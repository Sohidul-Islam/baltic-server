'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Menu extends Model {
        static associate(models) {
            Menu.hasMany(models.MegaMenu, {
                foreignKey: 'menuId',
                as: 'megaMenus',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            Menu.hasMany(models.Content, {
                foreignKey: 'menuId',
                as: 'contents',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    Menu.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        enableQuickLink: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        sequelize,
        modelName: 'Menu',
        tableName: 'menus'
    });

    return Menu;
}; 