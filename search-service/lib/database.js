const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, String(process.env.DB_PASS), {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  
  dialect: 'postgres',
  logging: false,
  pool: {
    max: parseInt(process.env.SQL_MAX_CONNECT),  // Maximum number of connections in the pool
    min: 1,   // Minimum number of connections in the pool
    acquire: 5*1000, // Maximum time to acquire a connection before throwing an error
    idle: 10*1000  // Maximum idle time before releasing a connection (in milliseconds)
  }
});

module.exports = sequelize;