const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DATABASE_DEV,
    process.env.MYSQLUSERNAME_DEV,
    process.env.MYSQLPASSWORD_DEV,
    {
        host: process.env.MYSQLHOST_DEV,
        dialect: 'mysql',
        logging: process.env.logging === 'true' ? console.log : false,
    }
);

module.exports = sequelize; 