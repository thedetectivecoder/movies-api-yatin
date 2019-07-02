const Sequelize = require('sequelize');

const sequelize = require('../utils/connection');

const Director = sequelize.define('director', {
  Director: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Movie = sequelize.define('movie', {
  Rank: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Description: {
    type: Sequelize.TEXT,
  },
  Runtime: {
    type: Sequelize.FLOAT,
  },
  Genre: {
    type: Sequelize.STRING,
  },
  Rating: {
    type: Sequelize.FLOAT,
  },
  Metascore: {
    type: Sequelize.STRING,
  },
  Votes: {
    type: Sequelize.BIGINT,
  },
  Gross_Earning_in_Mil: {
    type: Sequelize.STRING,
  },
  Actor: {
    type: Sequelize.STRING,
  },
  Year: {
    type: Sequelize.INTEGER,
  },
});

Movie.belongsTo(Director, {
  foreignKey: {
    name: 'Director_Id',
    allowNull: false,
  },
  onDelete: 'cascade',
  onUpdate: 'cascade',
});

module.exports = { Director, Movie };
