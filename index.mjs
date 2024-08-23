import express from 'express';
import ejs from 'ejs';
import session from 'express-session';

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

  console.log(req.session.regForm);
  res.render('register', { formData: req.session.regForm });
});

app.post('/register', function(req, res) {
  console.log(req.body.toString());
  res.redirect(303, '/');
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
