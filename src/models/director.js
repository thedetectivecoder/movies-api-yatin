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

// getDirector().then(data => { console.log(data); });

const selectDirectorById = id => new Promise((resolve, reject) => {
  const sql = `SELECT Director from directorData WHERE Id = ${id}`;
  con.query(sql, (err, result) => {
    if (result.length === 0) {
      resolve(result);
    } else {
      if (err) reject(err);
      resolve(result);
    }
  });
});

// selectDirectorById(156).then((data) => { console.log(data); });

const addDirector = (dirObj) => {
  const insertDirector = new Promise((resolve, reject) => {
    const sql = 'INSERT INTO directorData SET ?';
    con.query(sql, dirObj, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
  return insertDirector;
};

// addDirector({
//   Director:"Yatin" });

const updateDirector = (id, dirObj) => new Promise((resolve, reject) => {
  const sql = `UPDATE directorData SET Director = '${dirObj.Director}' where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    resolve(result);
  });
});

// updateDirector(36, { Director:"YATin BUrhmi"});

const deleteDirector = id => new Promise((resolve, reject) => {
  con.query(`DELETE FROM directorData WHERE Id = ${id}`, (err, result) => {
    if (err) reject(err);
    console.log(`Successfully Deleted row with id ${id}`);
    resolve(result);
  });
});


// deleteDirector(36);

module.exports = {
  getDirector,
  addDirector,
  selectDirectorById,
  deleteDirector,
  updateDirector,
};
