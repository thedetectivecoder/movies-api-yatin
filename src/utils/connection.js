const mysql = require('mysql');

const connection = () => mysql.createConnection({
  host: '172.17.0.2',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'movies',
});

module.exports = {
  connection,
};
