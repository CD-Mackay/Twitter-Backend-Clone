const { Pool } = require('pg');

const pool = new Pool();

pool.connect();
console.log("pooling!");
const text = `SELECT * from users`;

pool.query(text)
.then(res => {
  console.log(res);
})