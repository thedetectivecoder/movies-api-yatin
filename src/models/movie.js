const models = require('../models/models');


const getMovies = async () => {
  const allMovPromiseArray = await models.Movie.findAll();
  const arrObj = [];
  const getAllMovPromise = new Promise((resolve, reject) => {
    allMovPromiseArray.forEach((element) => {
      arrObj.push(element.dataValues);
    });
    resolve(arrObj);
  });
  return getAllMovPromise;
};

// getAllMovies().then(data => { console.log(data)});

const selectMovieById = async (idPass) => {
  const getMovieByIdPromise = await models.Movie.findOne({ where: { id: idPass } });
  if (getMovieByIdPromise !== null) {
    // console.log(getMovieByIdPromise);
    return getMovieByIdPromise.dataValues;
  } return getMovieByIdPromise;
};

// getMovieById(36);

const addMovie = async (dirObj) => {
  const addDirPromise = await models.Movie.create(dirObj);
  return addDirPromise;
};

// addMovie({
//   Rank: 53,
//   Title: 'SuperMan',
// });

const updateMovie = async (idPass, dirObj) => {
  const updateDirPromise = await models.Movie.update(dirObj, { where: { id: idPass } });
  return updateDirPromise;
};

// updateMovie(51, {
//   Title: 'SuperMan Returns',
// });

const deleteMovie = (idPass) => {
  const deleteDirPromise = models.Movie.destroy({ where: { id: idPass } });
  return deleteDirPromise;
};

// deleteMovie(51);
module.exports = {
  getMovies,
  selectMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};
