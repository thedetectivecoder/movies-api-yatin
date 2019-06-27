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

const populateDirectorsTable = () => new Promise((resolve, reject) => {
  const directorName = getUniqueDirectors(jsonData);
  createDirectorTable(directorName);
  resolve();
});
// createDirectorTable();

const insertIntoMovies = () => new Promise((resolve, reject) => {
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

// finalQuery();

const resetAutoIncrement = tableName => new Promise((resolve, reject) => {
  con.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`, (err, result) => {
    if (err) reject(err);
    console.log('Auto increment reset!');
    resolve();
  });
});

const getDirector = () => {
  const sql = 'SELECT * FROM directorData';
  con.query(sql, (err, res) => {
    if (err) throw err;
    res.forEach((element) => {
      console.log(element.Director_Name);
    });
  });
};

// // getDirector();

const selectDirectorById = (id) => {
  const sql = `SELECT Director_Name from directorData where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result[0].Director_Name);
  });
};

// selectDirectorById(2);


const addDirector = async (name) => {
  await resetAutoIncrement('directorData');
  const insertDirector = new Promise((resolve, reject) => {
    const sql = `INSERT INTO directorData (Director_Name) VALUES ("${name}")`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      console.log(`${name} inserted in table`);
      resolve();
    });
  });
  await insertDirector;
};

// addDirector('Frank Jr. Jr.');

const updateDirector = (id, name) => {
  const sql = `UPDATE directorData SET Director_Name = '${name}' where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(`Id ${id} successfully updated.`);
  });
};

// updateDirector(36, 'Frank Jr.');


const deleteDirector = (id) => {
  con.query(`DELETE FROM directorData WHERE Id = ${id}`, (err, result) => {
    if (err) throw err;
    console.log(`Successfully Deleted row with id ${id}`);
  });
};

// deleteDirector(37);

const getMovies = () => {
  const sql = 'SELECT * FROM moviesTable';
  con.query(sql, (err, res) => {
    if (err) throw err;
    res.forEach((element) => {
      console.log(element.Title);
    });
  });
};

// getMovies();

const selectMovieById = (id) => {
  const sql = `SELECT Title from moviesTable where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result[0].Title);
  });
};

// selectMovieById(50);


const addMovie = async (rank, title, description, runtime, genre, rating, metascore, votes, grossEarningsInMil,
  directorName, actor, year) => {
  const dName = directorName;
  const idDirectorPromise = () => new Promise((resolve, reject) => {
    con.query(`SELECT Id from directorData where Director_Name = "${dName}"`, (err, result) => {
      if (err) reject(err);
      resolve(result[0]);
    });
  });
  let directorId = await idDirectorPromise();
  if (directorId === undefined) {
    await addDirector(directorName);
    directorId = await idDirectorPromise();
  }
  const id = directorId.Id;
  const insertMovie = () => new Promise((resolve, reject) => {
    const sql = `INSERT INTO moviesTable (Rank, Title, Discription, Runtime, Genre, Rating, Metascore, 
      Votes,Gross_Earning_in_Mil, Director_Id,Actor,Year) VALUES ( ${rank}, "${title}", "${description}",
      ${runtime}, "${genre}", ${rating}, ${metascore}, ${votes}, ${grossEarningsInMil}, ${id}, "${actor}", ${year})`;
    con.query(sql, (err, result) => {
      if (err) reject(err);
      console.log('Movie added successfully');
      resolve();
    });
  });
  await insertMovie();
};

deleteDirector(37);
// addMovie(51, 'The Dark Knight', 'How Batman deals with criminal mastermind Joker', 190, 'Action', 8.7, 82, 5412648,
//   300.21, 'Christopher Swartz', 'Christian Bale', 2008);

const updateMovie = (id, updateField, updateVal) => {
  const sql = `UPDATE moviesTable SET ${updateField} = '${updateVal}' where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(`Id ${id} successfully updated.`);
  });
};

// updateMovie(50, 'Title', 'Casablanca');


const deleteMovie = (id) => {
  con.query(`DELETE FROM moviesTable WHERE Id = ${id}`, (err, result) => {
    if (err) throw err;
    console.log(`Successfully Deleted row with id ${id}`);
  });
};

// deleteMovie(36);
