import express from 'express';
import session from 'express-session';
import ejs from 'ejs';
import bcrypt from 'bcrypt';

import { connect, getDb, getStore } from './data/database.mjs';

connect();
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
  cookie: { maxAge: 1000 * 60 },
  store: store,
}));
// generate isAuth variable
app.use(function(req, res, next) {
  if (req.session.isAuth) {
    res.locals.isAuth = true;
  } else {
    res.locals = false;
  }
  res.locals.isAuth 
  next();
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/write', function(req, res) {
  const postData = {
    title: 'some title',
    summary: 'a summary',
    body: 'this is the post',
  }
  res.render('write', { postData: postData } );
});

app.post('/write',async function(req, res) {
  const user = await db.collection('users').findOne();
  const title = req.body.title;
  const summary = req.body.summary;
  const body = req.body.body;

  const isValid = true;

  if (isValid) {
    console.log(user._id, user.name, user.email);
    console.log(title, summary, body);
  }
  
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

app.use(function(req, res, next) {
  res.status(404).render('404');
});

app.listen(3000);
