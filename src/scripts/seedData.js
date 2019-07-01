const jsonData = require('../../data/movies.json');

const connectionFile = require('../utils/connection');

const con = connectionFile.connection();

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
  const uniqueDirectorsArr = rawJsonFile.reduce((acc, item) => {
    if (!acc.includes(item.Director)) acc.push(item.Director);
    return acc;
  }, []);
  return uniqueDirectorsArr;
};

const InsertIntoDirectorTable = (rawJsonFile) => {
  const uniqueDirectors = getUniqueDirectors(rawJsonFile);
  const insertPromise = uniqueDirectors.map(element => new Promise((resolve, reject) => {
    con.query(`INSERT INTO directorData (Director) VALUES ("${element}")`, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  }));
  Promise.all(insertPromise);
};

// InsertIntoDirectorTable(jsonData);

const cleanData = (rawJsonFile) => {
  const cleanDatapromise = rawJsonFile.map(element => new Promise((resolve, reject) => {
    if (element.Gross_Earning_in_Mil === 'NA') {
      element.Gross_Earning_in_Mil = null;
    }
    if (element.Metascore === 'NA') {
      element.Metascore = null;
    }
    resolve();
  }));
  Promise.all(cleanDatapromise);
};

const getDirectorId = name => new Promise((resolve, reject) => {
  con.query(`SELECT id from directorData where Director like "${name}"`, (err, result) => {
    if (err) throw err;
    resolve(result[0].id);
  });
});

const insertIntoMovies = (arrOfObj) => {
  const insertPromise = arrOfObj.map(element => new Promise(async (resolve, reject  ) => {
    const directorName = element.Director;
    getDirectorId(directorName).then((directorId) => {
      const sql = `INSERT INTO moviesTable (Rank, Title, Description, Runtime, Genre, Rating, Metascore, 
        Votes,Gross_Earning_in_Mil, Director_Id,Actor,Year) VALUES 
      (${element.Rank},"${element.Title}","${element.Description}",${element.Runtime}, 
      "${element.Genre}", ${element.Rating},${element.Metascore},${element.Votes},${element.Gross_Earning_in_Mil},
      ${directorId},"${element.Actor}",${element.Year})`;
      con.query(sql, (err1) => {
        if (err1) reject(err1);
        resolve();
      });
    });
  }));
  Promise.all(insertPromise);
};

// insertIntoMovies(jsonData);

const finalQuery = async () => {
  await dropTable('moviesTable');
  await dropTable('directorData');
  await createTable('directorData', '(Id INT AUTO_INCREMENT PRIMARY KEY,Director VARCHAR(255))');
  await createTable('moviesTable', `(Id INT AUTO_INCREMENT PRIMARY KEY,Rank INT(10), Title VARCHAR(255), 
  Description VARCHAR(255),Runtime INTEGER(5),Genre VARCHAR(255), Rating DECIMAL(2,1),
  Metascore INTEGER(3), Votes INTEGER(25), Gross_Earning_in_Mil DECIMAL(6,2),Director_Id INTEGER(10),Actor VARCHAR(255),
  Year INTEGER(5), FOREIGN KEY(Director_Id) REFERENCES directorData(Id) ON DELETE CASCADE)`);
  await cleanData(jsonData);
  await InsertIntoDirectorTable(jsonData);
  await insertIntoMovies(jsonData);
};

finalQuery();
