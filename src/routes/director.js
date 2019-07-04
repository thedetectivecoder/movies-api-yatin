const express = require('express');
const dir = require('../models/director.js');

const router = express.Router();
const validate = require('../utils/validation');

router.get('/', async (req, res, next) => {
  try {
    const arrDirector = await dir.getDirector();
    res.send(arrDirector);
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
      const dirName = await dir.selectDirectorById(req.params.id);
      res.send(dirName);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const validRes = validate.directorValidation(req.body);
    if (validRes.error) {
      res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
    } else {
      const directorAdd = await dir.addDirector(req.body);
      res.send(directorAdd);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const idValidRes = validate.idValidation(req.params.id);
    const validRes = validate.directorValidation(req.body);
    if (validRes.error) {
      res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
    } else if (idValidRes.error) {
      res.status(400).send(`${idValidRes.error.name} : ${idValidRes.error.details[0].message}`);
    } else {
      const updateDir = dir.updateDirector(req.params.id, req.body);
      res.send(updateDir);
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const delDir = await dir.deleteDirector(req.params.id);
    res.send(delDir);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
