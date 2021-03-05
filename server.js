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

app.get('/home', (req, res) => {
  if (req.session) {
    console.log(req.session);
  }
  res.render('home');
})

app.post('/register', (req, res) => {
  console.log(req.body);
  console.log(res);
  req.session.user = req.body.name;
  res.redirect('/home');
});

app.post('/logout', (req, res) => {
  res.clearCookie('name');
  req.session = null;
  res.redirect('/home');
});

app.post('/login', (req, res) => {
  req.session.user = req.body.name;
  res.redirect('/home');
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});