const express = require('express');
const dir = require('../models/movie');

const router = express.Router();
const validate = require('../utils/validation');

router.get('/', async (req, res, next) => {
  try {
    const arrMovie = await dir.getMovies();
    res.send(arrMovie);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const validRes = validate.idValidation(req.params.id);
    if (validRes.error) {
      res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
    } else {
      const movName = await dir.selectMovieById(req.params.id);
      res.send(movName);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res) , next=> {
  try{
    const validRes = validate.addMovieValidation(req.body);
    if (validRes.error) {
      res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
    } else {
        const addMovieObj = await dir.addMovie(req.body);
        res.send(addMovieObj);
    }
  } catch(err) {
      next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try{
    const idValidRes = validate.idValidation(req.params.id);
    const validRes = validate.updateMovieValidation(req.body);
    if (validRes.error) {
      res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
    } else if(idValidRes.error){
      res.status(400).send(`${idValidRes.error.name} : ${idValidRes.error.details[0].message}`);
    } else {
        const updateMovieObj = await dir.updateMovie(req.params.id, req.body);
        res.send(updateMovieObj);
    }
  } catch(err){
      next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try{
    const validRes = validate.idValidation(req.params.id);
    if(validRes.error){
      res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
    } else{
      const movName = await dir.deleteMovie(req.params.id);
      res.send(movName);
    }
  } catch(err){
      next(err);
  }
});

// app.listen(3000, () => console.log('Server Starting....'));

module.exports = router;
