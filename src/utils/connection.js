const Sequelize = require('sequelize');

const sequelize = new Sequelize('movies', 'root', 'root', {
  host: '172.17.0.2',
  port: 3306,
  dialect: 'mysql',
  define: { timestamps: false },
});

// sequelize.authenticate().then((err) => {
//   if (err) {
//     console.log('There is connection in ERROR');
//   } else {
//     console.log('Connection has been established successfully');
//   }
// });


module.exports = sequelize;
