import express from 'express';
import session from 'express-session';
import ejs from 'ejs';
import bcrypt from 'bcrypt';

import { connectDb, getDb, getStore, ObjectId } from './data/database.mjs';

connectDb();
const db = getDb()
const store = getStore();
const app = express();

// templates and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));
// pre-parse json
app.use(express.json());
// keep sessions
app.use(session({
  secret: 'pauloblogjs',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 3600 * 24 },
  store: store,
}));
// generate isAuth variable
app.use(function(req, res, next) {
  if (req.session.isAuth) { // avoiding undefined isAuth
    res.locals.isAuth = true;
  } else {
    res.locals.isAuth = false;
  }
  next();
});

app.get('/', async function(req, res) {
  let currPage = Number(req.query.page);
  if (!currPage) {
    currPage = 1;
  }
  
  const query = {};
  const postsPerPage = 2;
  const totalPosts = await db.collection('posts').countDocuments(query);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const currPageStartIndex = Math.max(0, Math.min(totalPosts - 1, (currPage - 1) * postsPerPage));
  const pagePosts = await db.collection('posts').find(query).skip(currPageStartIndex).limit(postsPerPage).toArray();

  let pages = [1];
  if (currPage > 1) {
    if (currPage > 3) {
      // [1, x, y, currPage...]
      pages = pages.concat(['...', currPage - 1, currPage]);
    } else if (currPage > 2) {
      // [1, x, currPage...]
      pages = pages.concat([currPage - 1, currPage]);
    } else {
      // [1, currPage...]
      pages = pages.concat([currPage]);
    }
  }
  if (currPage < totalPages) {
    if (currPage < totalPages - 2) {
      // [..., currPage, totalPages -2, totalPages-1, totalPages]
      pages = pages.concat([currPage + 1,'...', totalPages]);
      // [..., currPage, totalPages - 1, totalPages]
    } else if (currPage < totalPages - 1) {
      pages = pages.concat([currPage + 1, totalPages]);
    } else {
      // [..., currPage, totalPages]
      pages = pages.concat([totalPages]);
    }
  }

  res.render('home', { pages: pages, currPage: currPage , pagePosts: pagePosts });
});

app.get('/profile', async function(req, res) {
  const user = await db.collection('users').findOne( { _id: new ObjectId(req.session.userId)}, { projection: { password: 0 }});
  res.render('profile', { user: user });
});

app.get('/read', async function(req, res) {
  const postId = req.query.postId;
  console.log(postId);
  if (postId) {
    const postData = await db.collection('posts').findOne({_id: new ObjectId(postId)}, { projection: {_id: 0, authorId: 0} });
    console.log(postData);
    res.render('read', { postData: postData });
//     res.redirect('/');
  } else {
    console.log("post not found");
    return res.status(404).render('404');
  }
});

app.get('/write', function(req, res) {
  const postData = {
    title: 'some title',
    summary: 'a summary',
    body: 'this is the post',
  }
  res.render('write', { postData: postData } );
});

function validatePostForm (postData) {
  if (!postData.title || postData == '' || !postData.summary || postData.summary == '' || !postData.body || postData.summary == '') {
    return false;
  }
  return true;
}

app.post('/write',async function(req, res) {
  if (!res.locals.isAuth) {
    console.log('write: not Auth!');
    return res.redirect('/login');
  }

  const user = await db.collection('users').findOne( { _id: new ObjectId(req.session.userId) } );
  if (!user) {
    console.log('write: user not found!');
    return res.redirect('/login');
  }
  
  const isValid = validatePostForm(req.body);
  if (!isValid) {
    console.log("write: not valid!")
    return res.redirect('/write');
  }

  const authorId = user._id;
  const authorName = user.name;

  const title = req.body.title;
  const summary = req.body.summary;
  const body = req.body.body;

  await db.collection('posts').insertOne({
    title: title,
    summary: summary,
    body: body,
    authorId: authorId,
    authorName: authorName,
    date: new Date()
  });
  
  res.redirect('/write');
});


app.get('/register', function(req, res) {
  console.log(req.session.id);

  if (!req.session.regForm) {
    req.session.regForm = {
      name: '',
      email: '',
      password: ''
    };
  }

  res.render('register', { formData: req.session.regForm });
});

function validateRegForm(formData) {
  if ((!formData.name || formData.name == '') || (!formData.email || formData.email == '') || (!formData.password || formData.password == '')) {
    return false;
  }
  return true;
}

app.post('/register', async function(req, res) {
  const isValid = validateRegForm(req.body);

  if (isValid) {
    const result = await getDb().collection('users').insertOne({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    });
    console.log(result);
    res.redirect(303, '/');
  } else {
    res.redirect(303, '/register');
  }

});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await db.collection('users').findOne({ email: email });
  if (user) {
    console.log('found');
    req.session.isAuth = await bcrypt.compare(password, user.password);
    req.session.userId = user._id;
  } else {
    console.log('not found');
  }
  res.redirect(303, '/');
});

app.get('/logout', async function(req, res) {
  req.session.isAuth = false;
  res.redirect(303, '/');
})

app.get('/change-username', function(req, res) {
  res.render('change-username');
});

app.post('/change-username', async function(req, res) {
  const newUsername = req.body.newUsername;
  const password = req.body.password;
  const userId = req.session.userId;

  const user = await db.collection('users').findOne( {_id: new ObjectId(userId) } );
  const passwordIsCorrect = await bcrypt.compare(password, user.password)

  console.log(password, userId, passwordIsCorrect, user.password);

  if (passwordIsCorrect) {
    const dbStatus = await db.collection('users').updateOne( { _id: new ObjectId(userId) } , {$set: { name: newUsername }} );
    console.log(dbStatus);
    return res.redirect('/profile');
  } 
});

app.get('/change-email', function(req, res) {
  res.render('change-email');
});

app.post('/change-email', async function(req, res) {
  const newEmail = req.body.newEmail;
  const password = req.body.password;
  const userId = req.session.userId;

  const user = await db.collection('users').findOne( {_id: new ObjectId(userId) } );
  const passwordIsCorrect = await bcrypt.compare(password, user.password)

  console.log(password, userId, passwordIsCorrect, user.password);

  if (passwordIsCorrect) {
    const dbStatus = await db.collection('users').updateOne( { _id: new ObjectId(userId) } , {$set: { email: newEmail }} );
    console.log(dbStatus);
    return res.redirect('/profile');
  } 
});

app.get('/change-password', function(req, res) {
  res.render('change-password');
});

app.post('/change-password', async function(req, res) {
  const newPassword = req.body.newPassword;
  const password = req.body.password;
  const userId = req.session.userId;

  const user = await db.collection('users').findOne( {_id: new ObjectId(userId) } );
  const passwordIsCorrect = await bcrypt.compare(password, user.password)

  console.log(password, userId, passwordIsCorrect, user.password);

  if (passwordIsCorrect) {
    const dbStatus = await db.collection('users').updateOne( { _id: new ObjectId(userId) } , {$set: { password: await bcrypt.hash(newPassword, 10)}} );
    console.log(dbStatus);
    return res.redirect('/profile');
  } 
});

app.get('/my-posts', async function(req, res) {
  let currPage = Number(req.query.page);
  if (!currPage) {
    currPage = 1;
  }

  console.log(req.session.userId);
  
  const query = { authorId: new ObjectId(req.session.userId) };
  const postsPerPage = 2;
  const totalPosts = await db.collection('posts').countDocuments(query);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const currPageStartIndex = Math.max(0, Math.min(totalPosts - 1, (currPage - 1) * postsPerPage));
  const pagePosts = await db.collection('posts').find(query).skip(currPageStartIndex).limit(postsPerPage).toArray();

  let pages = [1];
  if (currPage > 1) {
    if (currPage > 3) {
      // [1, x, y, currPage...]
      pages = pages.concat(['...', currPage - 1, currPage]);
    } else if (currPage > 2) {
      // [1, x, currPage...]
      pages = pages.concat([currPage - 1, currPage]);
    } else {
      // [1, currPage...]
      pages = pages.concat([currPage]);
    }
  }
  if (currPage < totalPages) {
    if (currPage < totalPages - 2) {
      // [..., currPage, totalPages -2, totalPages-1, totalPages]
      pages = pages.concat([currPage + 1,'...', totalPages]);
      // [..., currPage, totalPages - 1, totalPages]
    } else if (currPage < totalPages - 1) {
      pages = pages.concat([currPage + 1, totalPages]);
    } else {
      // [..., currPage, totalPages]
      pages = pages.concat([totalPages]);
    }
  }

  res.render('my-posts', { pages: pages, currPage: currPage , pagePosts: pagePosts });
});

app.use(function(req, res, next) {
  res.status(404).render('404');
});


app.listen(3000);
