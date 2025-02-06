'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MegaMenu extends Model {
        static associate(models) {
            MegaMenu.belongsTo(models.Menu, {
                foreignKey: 'menuId',
                as: 'menu',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            MegaMenu.hasMany(models.Content, {
                foreignKey: 'megaMenuId',
                as: 'contents',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            MegaMenu.hasMany(models.SubMegaMenu, {
                foreignKey: 'megaMenuId',
                as: 'subMegaMenus',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    MegaMenu.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        enableQuickLink: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        menuId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menus',
                key: 'id'
            }
        },
    }, {
        sequelize,
        modelName: 'MegaMenu',
        tableName: 'megaMenus'
    });

    return MegaMenu;
}; 