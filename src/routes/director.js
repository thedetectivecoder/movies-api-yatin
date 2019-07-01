const express = require('express');
const dir = require('../models/director.js');

const router = express.Router();
const validate = require('../utils/validation');

router.get('/', async (req, res) => {
  const arrDirector = await dir.getDirector();
  res.send(arrDirector);
});

router.get('/:id', async (req, res) => {
  // res.send(req.params.id);
  const dirName = await dir.selectDirectorById(req.params.id);
  res.send(dirName);
});

router.post('/', async (req, res) => {
  const validRes = validate.directorValidation(req.body);
  if (validRes.error) {
    res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
  } else {
    const directorAdd = await dir.addDirector(req.body);
    res.send(directorAdd);
  }
});

router.put('/:id', async (req, res) => {
  const validRes = validate.directorValidation(req.body);
  if (validRes.error) {
    res.status(400).send(`${validRes.error.name} : ${validRes.error.details[0].message}`);
  } else {
    const updateDir = dir.updateDirector(req.params.id, req.body);
    res.send(updateDir);
  }
});

router.delete('/:id', async (req, res) => {
  const delDir = await dir.deleteDirector(req.params.id);
  res.send(delDir);
});


module.exports = router;
