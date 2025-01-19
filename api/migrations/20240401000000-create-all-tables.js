'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Get all model files
            const modelsPath = path.join(__dirname, '../models');
            const modelFiles = fs.readdirSync(modelsPath)
                .filter(file =>
                    file.indexOf('.') !== 0 &&
                    file !== 'index.js' &&
                    file.slice(-3) === '.js'
                );

            // Import all models
            const models = {};
            for (const file of modelFiles) {
                const model = require(path.join(modelsPath, file))(queryInterface.sequelize, Sequelize);
                models[model.name] = model;
            }

            // Create tables in the correct order (based on dependencies)
            const modelOrder = ['Menu', 'MegaMenu', 'Content'];

            for (const modelName of modelOrder) {
                const model = models[modelName];
                console.log(`Creating table for model: ${modelName}`);

                const attributes = {};
                for (const [key, value] of Object.entries(model.rawAttributes)) {
                    attributes[key] = {
                        ...value,
                        type: value.type || Sequelize[value.constructor.key]
                    };
                }

                await queryInterface.createTable(model.tableName, attributes);
                console.log(`Table ${model.tableName} created successfully`);
            }

            console.log('All tables created successfully');
        } catch (error) {
            console.error('Migration error:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Drop tables in reverse order
        const tableOrder = ['contents', 'megaMenus', 'menus'];

        for (const tableName of tableOrder) {
            try {
                await queryInterface.dropTable(tableName);
                console.log(`Table ${tableName} dropped successfully`);
            } catch (error) {
                console.error(`Error dropping table ${tableName}:`, error);
                throw error;
            }
        }
    }
}; 