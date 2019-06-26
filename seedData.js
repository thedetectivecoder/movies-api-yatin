/* eslint-disable no-console */
const mysql = require('mysql');
const jsonData = require('./data/movies.json');

const con = mysql.createConnection({
  host: '172.17.0.2',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'movies',
});

// con.connect((err) => {
//   if (err) throw err;
//   console.log('Connected!');
//   con.query('CREATE DATABASE movies', (err, result) => {
//     if (err) throw err;
//     console.log('Database created');
//   });
// });

const dropTable = name => new Promise((resolve, reject) => {
  con.query(`DROP TABLE IF EXISTS ${name}`, (err) => {
    if (err) reject(err);
    console.log(`Existing Table ${name} dropped`);
    resolve();
  });
});

const createTable = (name, query) => new Promise((resolve, reject) => {
  const sql = `CREATE TABLE ${name} ${query}`;
  con.query(sql, (err) => {
    if (err) reject(err);
    console.log('Table Created');
    resolve();
  });
});

const getUniqueDirectors = (rawJsonFile) => {
  const directorName = new Set();
  rawJsonFile.map((item) => {
    directorName.add(item.Director);
    return directorName;
  });
  return directorName;
};

const createDirectorTable = (obj) => {
  obj.forEach((element) => {
    con.query(`INSERT INTO directorData (Director_Name) VALUES ("${element}")`, (err) => {
      if (err) throw err;
    });
  });
};

const populateDirectorsTable = () => new Promise((resolve,reject) => {
  const directorName = getUniqueDirectors(jsonData);
  createDirectorTable(directorName);
  resolve();
});
// createDirectorTable();

const insertIntoMovies = () => new Promise((resolve,reject) => {
  jsonData.forEach(async (element) => {
    const directorName = element.Director;
    const idPromise = new Promise((resolve, reject) => {
      con.query(`SELECT id from directorData where Director_Name like "${directorName}"`, (err, result) => {
        if (err) throw err;
        resolve(result[0].id);
      });
    });
    const directorId = await idPromise;
    let grossEarnings = element.Gross_Earning_in_Mil;
    let metascore = element.Metascore;
    if (grossEarnings === 'NA') {
      grossEarnings = null;
    }
    if (metascore === 'NA') {
      metascore = null;
    }
    const sql = `INSERT INTO moviesTable (Rank, Title, Discription, Runtime, Genre, Rating, Metascore, 
        Votes,Gross_Earning_in_Mil, Director_Id,Actor,Year) VALUES 
      (${element.Rank},"${element.Title}","${element.Description}",${element.Runtime}, 
      "${element.Genre}", ${element.Rating},${metascore},${element.Votes},${grossEarnings},
      ${directorId},"${element.Actor}",${element.Year})`;

    const insertMoviePromise = () => new Promise((resolve, reject) => {
      con.query(sql, (err1) => {
        if (err1) reject(err1);
        resolve();
      });
    });
    await insertMoviePromise();
  });
  resolve();
});

const finalQuery = async () => {
  await dropTable('moviesTable');
  await dropTable('directorData');
  await createTable('directorData', '(Id INT AUTO_INCREMENT PRIMARY KEY,Director_Name VARCHAR(255))');
  await createTable('moviesTable', '(Id INT AUTO_INCREMENT PRIMARY KEY,Rank INT(10), Title VARCHAR(255), Discription VARCHAR(255),Runtime INTEGER(5),Genre VARCHAR(255), Rating DECIMAL(2,1),Metascore INTEGER(3), Votes INTEGER(25), Gross_Earning_in_Mil DECIMAL(6,2),Director_Id INTEGER(10),Actor VARCHAR(255),Year INTEGER(5), FOREIGN KEY(Director_Id) REFERENCES directorData(Id))');
  await populateDirectorsTable();
  await insertIntoMovies();
};


