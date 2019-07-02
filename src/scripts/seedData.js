
const jsonData = require('../../data/movies.json');
const sequelize = require('../utils/connection');
const models = require('../models/models');

const getUniqueDirectors = (rawJsonFile) => {
  const uniqueDirectorsArr = rawJsonFile.reduce((acc, item) => {
    if (!acc.includes(item.Director)) acc.push(item.Director);
    return acc;
  }, []);
  return uniqueDirectorsArr;
};

const insertIntoDirectors = (rawJsonFile) => {
  const uniqueDirectors = getUniqueDirectors(rawJsonFile);
  uniqueDirectors.forEach((element) => {
    models.Director.create({
      Director: element,
    });
  });
};

const insertIntoMovies = (rawJsonFile) => {
  const insertPromise = rawJsonFile.forEach(async (item) => {
    const getDirectorPromise = models.Director.findOne({
      where: { Director: item.Director },
    });
    const directorId = await getDirectorPromise;
    console.log(directorId.id);
    getDirectorPromise.then(() => {
      models.Movie.create({
        Rank: item.Rank,
        Title: item.Title,
        Description: item.Description,
        Runtime: item.Runtime,
        Genre: item.Genre,
        Rating: item.Rating,
        Metascore: item.Metascore,
        Director_Id: directorId.id,
        Votes: item.Votes,
        Gross_Earning_in_Mil: item.Gross_Earning_in_Mil,
        Actor: item.Actor,
        Year: item.Year,
      });
    });
  });
  return Promise.all(insertPromise);
};

async function finalQuery() {
  await sequelize.drop();
  // await Director;
  await models.Director.sync({ force: true });
  await insertIntoDirectors(jsonData);
  // await Movie;
  // Movie.belongsTo(Director);
  await models.Movie.sync({ force: true });
  await insertIntoMovies(jsonData);
}

finalQuery();
