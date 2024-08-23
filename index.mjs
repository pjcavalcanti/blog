import express from 'express';
import ejs from 'ejs';
import session from 'express-session';

import { connect, getDb } from './data/database.mjs';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: 'pauloblogjs',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 },
}));

app.get('/', function(req, res) {
  res.render('home');
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
    const result = await getDb().collection('users').insertOne(req.body);
    console.log(result);
    res.redirect(303, '/');
  } else {
    res.redirect(303, '/register');
  }

});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  // process data
  res.redirect(303, '/');
});

app.use(function(req, res, next) {
  res.status(404).render('404');
});

app.listen(3000);
