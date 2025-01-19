require('dotenv').config();

module.exports = {
    development: {
        username: process.env.MYSQLUSERNAME_DEV,
        password: process.env.MYSQLPASSWORD_DEV,
        database: process.env.DATABASE_DEV,
        host: process.env.MYSQLHOST_DEV,
        dialect: 'mysql',
        logging: true,
        sync: { force: true },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    production: {
        username: process.env.MYSQLUSERNAME,
        password: process.env.MYSQLPASSWORD,
        database: process.env.DATABASE,
        host: process.env.MYSQLHOST,
        dialect: 'mysql'
    }
}; 