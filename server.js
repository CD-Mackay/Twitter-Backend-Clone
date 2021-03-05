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
  pool.query('SELECT * FROM users where name = $1', [req.body.name])
  .then(data => {
    console.log("data", data.rows);
    if (data.rows.name == req.body.name) {
      console.log('error, user already exists');
    } else {
      pool.query(`INSERT INTO users (name, password) VALUES ($1, $2)`, [req.body.name, req.body.password]);
      req.session.user = req.body.name;
      res.redirect('/home');
    }
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
    if (data.rows.password === req.body.password) {
      req.session.user = req.body.name;
      res.redirect('/home');
    } else {
      res.render('<div>Error, invalid password </div>');
    }
  })
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});