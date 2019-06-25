const mysql = require('mysql');

const con = mysql.createConnection({
  host: '172.17.0.2',
  user: 'root',
  password: 'root',
  port: 3306,
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
  con.query('CREATE DATABASE movies', (err, result) => {
    if (err) throw err;
    console.log('Database created');
  });
});
