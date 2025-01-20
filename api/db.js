'use strict';

const { Sequelize } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

// Create Sequelize instance
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: config.logging,
        pool: config.pool || {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Import models
const models = require('./models');

// Initialize models with sequelize instance
const db = {
    sequelize,
    Sequelize
};

// Initialize each model
Object.keys(models).forEach(modelName => {
    const model = models[modelName](sequelize, Sequelize.DataTypes);
    db[modelName] = model;
});

// Set up associations after all models are initialized
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db; 