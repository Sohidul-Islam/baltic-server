'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // 1. Create menus table
            await queryInterface.createTable('menus', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                path: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
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
            console.log('Menus table created successfully');

            // 2. Create megaMenus table
            await queryInterface.createTable('megaMenus', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                path: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
                },
                menuId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'menus',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
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
            console.log('MegaMenus table created successfully');

            // 3. Create subMegaMenus table
            await queryInterface.createTable('subMegaMenus', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                path: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
                },
                megaMenuId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'megaMenus',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                items: {
                    type: Sequelize.TEXT,
                    allowNull: false
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
            console.log('SubMegaMenus table created successfully');

            // 4. Create contents table
            await queryInterface.createTable('contents', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                menuId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'menus',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                megaMenuId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'megaMenus',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                subMegaMenuId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'subMegaMenus',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                sections: {
                    type: Sequelize.JSON,
                    allowNull: false
                },
                sequence: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0
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
            console.log('Contents table created successfully');

        } catch (error) {
            console.error('Migration error:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Drop tables in reverse order
        await queryInterface.dropTable('contents');
        await queryInterface.dropTable('subMegaMenus');
        await queryInterface.dropTable('megaMenus');
        await queryInterface.dropTable('menus');
    }
}; 