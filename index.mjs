import express from 'express';
import ejs from 'ejs';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.listen(3000);
