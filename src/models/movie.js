const connectionFile = require('../utils/connection');

const con = connectionFile.connection();


const getMovies = async () => new Promise((resolve, reject) => {
  const sql = `SELECT m.Id,Rank, Title, Description, Runtime, Genre, Rating, Metascore, Votes,Gross_Earning_in_Mil,
  Director_Id,Actor,Year,Director FROM moviesTable m INNER JOIN directorData d ON m.Director_Id = d.Id`;
  con.query(sql, (err, res) => {
    if (err) reject(err);
    resolve(JSON.stringify(res));
  });
});
 
const selectMovieById = id => new Promise((resolve, reject) => {
  const sql = `SELECT Title from moviesTable where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    resolve(result);
  });
});

selectMovieById(50);

const addMovie = (moviesObj) => {
  const addmoviePromise = new Promise((resolve, reject) => {
    const sql = 'INSERT INTO moviesTable SET ?';
    con.query(sql,moviesObj, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
  return addmoviePromise;
};

// addMovie({
//   Rank: 51,
//   Title: 'The Dark Knight',
//   Description: 'How Batman deals with criminal mastermind Joker',
//   Runtime: 190,
//   Genre: 'Action',
//   Rating: 8.7,
//   Metascore: 82,
//   Votes: 5412648,
//   Gross_Earning_in_Mil: 300.21,
//   Director_id: 3,
//   Actor: 'Christian Bale',
//   Year: 2008,
// });

const updateMovie = (id, obj) => new Promise((resolve, reject) => {
  const paramArr = Object.keys(obj);
  let updateColumns = '';
  paramArr.forEach((item) => {
    if (typeof obj[item] === 'string') {
      updateColumns += `${item} = '${obj[item]}',`;
    } else {
      updateColumns += `${item} = ${obj[item]},`;
    }
  });
  updateColumns = updateColumns.substring(0, updateColumns.length - 1);
  const sql = `UPDATE moviesTable SET ${updateColumns} where Id = ${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(`Id ${id} successfully updated.`);
    resolve();
  });
});

// updateMovie(50, {
//   Title: 'The Dark Knight Rises',
//   Rating: 8.9,
// });

const deleteMovie = (id) => {
  con.query(`DELETE FROM moviesTable WHERE Id = ${id}`, (err, result) => {
    if (err) throw err;
    console.log(`Successfully Deleted row with id ${id}`);
  });
};

// deleteMovie(51);

module.exports = {
  getMovies,
  selectMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};