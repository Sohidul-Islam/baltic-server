'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('footerContents', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            emails: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: []
            },
            phones: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: []
            },
            addresses: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: []
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('footerContents');
    }
}; 