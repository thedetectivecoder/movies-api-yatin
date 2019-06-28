const connectionFile = require('../utils/connection');

const con = connectionFile.connection();

const getDirector = async () => {
  const sql = 'SELECT * FROM directorData';
  const directorPromise = new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) reject(err);
      resolve(JSON.stringify(res));
    });
  });
  return directorPromise;
};

// getDirector();

const selectDirectorById = id => new Promise((resolve, reject) => {
  const sql = `SELECT Director_Name from directorData where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (result.length === 0) {
      resolve(console.log('Id not present'));
    } else {
      resolve(result[0].Director_Name);
    }
  });
});

// selectDirectorById(60);

const addDirector = (name) => {
  const insertDirector = new Promise((resolve, reject) => {
    const sql = `INSERT INTO directorData (Director_Name) VALUES ("${name}")`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      console.log(`${name} inserted in table`);
      resolve();
    });
  });
  return insertDirector;
};

// addDirector('Frank Jr. Jr.');

const updateDirector = (id, name) => new Promise((resolve, reject) => {
  const sql = `UPDATE directorData SET Director_Name = '${name}' where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(`Id ${id} successfully updated.`);
    resolve();
  });
});

// updateDirector(36, 'Frank Jr.');

const deleteDirector = async id => new Promise((resolve, reject) => {
  con.query(`DELETE FROM directorData WHERE Id = ${id}`, (err, result) => {
    if (err) reject(err);
    console.log(`Successfully Deleted row with id ${id}`);
    resolve();
  });
});


// deleteDirector(36);
