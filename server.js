const express = require('express');
const app = express();
const port = 3000;
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
})