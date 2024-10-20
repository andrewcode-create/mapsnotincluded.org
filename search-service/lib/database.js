const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, String(process.env.DB_PASS), {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  
  dialect: 'postgres',
  logging: false,
  max: 5
});

module.exports = sequelize;