const express = require('express');
const dir = require('../models/movie');

const router = express.Router();
const validate = require('../utils/validation');

router.get('/', async (req, res) => {
  const arrMovie = await dir.getMovies();
  res.send(arrMovie);
});

router.get('/:id', async (req, res) => {
  const movName = await dir.selectMovieById(req.params.id);
  res.send(movName);
});

router.post('/', async (req, res) => {
  const validRes = validate.addMovieValidation(req.body);
  if (validRes.error) {
    res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
  } else {
    const addMovieObj = await dir.addMovie(req.body);
    res.send(addMovieObj);
  }
});

router.put('/:id', async (req, res) => {
  const validRes = validate.updateMovieValidation(req.body);
  if (validRes.error) {
    res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
  } else {
    const updateMovieObj = await dir.updateMovie(req.params.id, req.body);
    res.send(updateMovieObj);
  }
});

router.delete('/:id', async (req, res) => {
  const movName = await dir.deleteMovie(req.params.id);
  res.send(movName);
});

// app.listen(3000, () => console.log('Server Starting....'));


module.exports = router;
