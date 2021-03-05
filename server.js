const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

const pool = new Pool ({
  host: 'localhost',
  user: 'connormackay',
  database: 'speer_api'
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) { 
      return console.error('error executing query', err.stack)
    }
    console.log(result.rows);
  })
});

app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
  if (req.session) {
    console.log(req.session);
  }
  res.render('home');
})

app.post('/register', (req, res) => {
  console.log(req.body);
  const name = req.body.name
  const password = req.body.password
  pool.query('SELECT * FROM users where name = $1', [req.body.name])
  .then(data => {
    if (data.rows.length > 0 ) {
    if (data.rows[0].name == req.body.name) {
      res.json('<div>Error, user already exists </div>');}
    } else if (!req.body.password || !req.body.name) {
      res.json('<div>Error, fields cannot be left blank </div>');
    } else {
      pool.query(`INSERT INTO users (name, password) VALUES ($1, $2)`, [req.body.name, req.body.password]);
      req.session.user = req.body.name;
      res.redirect('/home');
    }
  })
  .catch(err => {
    console.log(err);
  })
});

app.post('/logout', (req, res) => {
  res.clearCookie('name');
  req.session = null;
  res.redirect('/home');
});

app.post('/login', (req, res) => {
  pool.query(`SELECT * FROM users where name = $1`, [req.body.name])
  .then(data => {
    console.log(data);
    console.log(data.rows[0].password);
    console.log(req.body.password);
    if (data.rows[0].password == req.body.password) {
      req.session.user = req.body.name;
      res.redirect('/home');
    } else {
      res.json('<div>Error, invalid password </div>');
    }
  })
});

app.get('/tweets', (req, res) => {
  pool.query(`SELECT * FROM tweets`)
  .then(data => {
    const templateVars = data.rows;
    res.redirect('/home', { templateVars });
  })
});

app.post('/tweets', (req, res) => {
  pool.query(`INSERT INTO tweets(text, author)`, [req.body.text, req.session.user])
  .then(() => {
    res.redirect('/home');
  })
  .catch(err => {
    console.log(err);
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});