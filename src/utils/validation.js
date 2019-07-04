// load joi module
const Joi = require('joi');

function idValidation(id) {
  const idSchema = Joi.object().keys({
    id: Joi.number().required().min(1).max(100),
  });
  return Joi.validate(id, idSchema);
}

function directorValidation(dirObj) {
  const directorSchema = Joi.object().keys({
    Director: Joi.string().required(),
  });
  return Joi.validate(dirObj, directorSchema);
}

function addMovieValidation(movObj) {
  const addMovieSchema = Joi.object().keys({
    Rank: Joi.number().positive().required(),
    Title: Joi.string().required(),
    Description: Joi.string().required(),
    Runtime: Joi.number().positive().required(),
    Genre: Joi.string().required(),
    Rating: Joi.number().positive().precision(2).required(),
    Metascore: Joi.number().positive().required(),
    Votes: Joi.number().positive().required(),
    Gross_Earning_in_Mil: Joi.number().positive().precision(2).required(),
    Director_Id: Joi.number().required(),
    Actor: Joi.string().required(),
    Year: Joi.number().required(),
  });
  return Joi.validate(movObj, addMovieSchema);
}

function updateMovieValidation(movObj) {
  const updateMovieSchema = Joi.object().keys({
    Rank: Joi.number().positive(),
    Title: Joi.string(),
    Description: Joi.string(),
    Runtime: Joi.number().positive(),
    Genre: Joi.string(),
    Rating: Joi.number().positive().precision(2),
    Metascore: Joi.number().positive(),
    Votes: Joi.number().positive(),
    Gross_Earning_in_Mil: Joi.number().positive().precision(2),
    Director_Id: Joi.number(),
    Actor: Joi.string(),
    Year: Joi.number(),
  });
  return Joi.validate(movObj, updateMovieSchema);
}


module.exports = {
  idValidation,
  directorValidation,
  addMovieValidation,
  updateMovieValidation,
};
