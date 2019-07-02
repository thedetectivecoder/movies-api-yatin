const models = require('../models/models');

/* findaLL() => query for all records. Filter using where operator
*
*/

const getDirector = async () => {
  const allDirectorPromiseArray = await models.Director.findAll();
  const arrObj = [];
  const getAllDirectorsPromise = new Promise((resolve, reject) => {
    allDirectorPromiseArray.forEach((element) => {
      arrObj.push(element.dataValues);
    });
    resolve(arrObj);
  });
  return getAllDirectorsPromise;
};

// getAllDirectors().then(data => { console.log(data)});

const selectDirectorById = async (idPass) => {
  const getDirectorByIdPromise = await models.Director.findOne({ where: { id: idPass } });
  if (getDirectorByIdPromise !== null) {
    return getDirectorByIdPromise.dataValues;
  } return console.log('Id not present');
};

// getDirectorById(35);

const addDirector = async (dirObj) => {
  const addDirPromise = await models.Director.create({ Director: dirObj.Director });
  return addDirPromise;
};

// addDirector({ Director: 'Yatin' });

const updateDirector = async (idPass, dirObj) => {
  const updateDirPromise = await models.Director.update(dirObj, { where: { id: idPass } });
  return updateDirPromise;
};

// updateDirector(37, { Director: 'Yatin Burhmi' });

const deleteDirector = async (idPass) => {
  const deleteDirPromise = await models.Director.destroy({ where: { id: idPass } });
  return deleteDirPromise;
};

// deleteDirector(36);

module.exports = {
  getDirector,
  addDirector,
  selectDirectorById,
  deleteDirector,
  updateDirector,
}