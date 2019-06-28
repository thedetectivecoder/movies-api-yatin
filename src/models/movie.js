const connectionFile = require('../utils/connection');

const con = connectionFile.connection();

const addMovie = (arrOfMoviesObj) => {
  const addmoviePromise = arrOfMoviesObj.map(element => new Promise((resolve, reject) => {
    const sql = `INSERT INTO moviesTable (Rank, Title, Discription, Runtime, Genre, Rating, Metascore, 
          Votes,Gross_Earning_in_Mil, Director_Id,Actor,Year) VALUES 
        (${element.Rank},"${element.Title}","${element.Description}",${element.Runtime}, 
        "${element.Genre}", ${element.Rating},${element.Metascore},${element.Votes},${element.Gross_Earning_in_Mil},
        ${element.Director_id},"${element.Actor}",${element.Year})`;

    con.query(sql, (err1) => {
      if (err1) reject(err1);
      resolve();
    });
  }));
  Promise.all(addmoviePromise);
};

// addMovie([{
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
// }]);

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
