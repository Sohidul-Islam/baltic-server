'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Content extends Model {
        static associate(models) {
            Content.belongsTo(models.Menu, {
                foreignKey: 'menuId',
                as: 'menu',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            Content.belongsTo(models.MegaMenu, {
                foreignKey: 'megaMenuId',
                as: 'megaMenu',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            Content.belongsTo(models.SubMegaMenu, {
                foreignKey: 'subMegaMenuId',
                as: 'subMegaMenu',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    Content.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        menuId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'menus',
                key: 'id'
            }
        },
        megaMenuId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'megaMenus',
                key: 'id'
            }
        },
        subMegaMenuId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'subMegaMenus',
                key: 'id'
            }
        },
        sections: {
            type: DataTypes.JSON,
            allowNull: false
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'Content',
        tableName: 'contents'
    });

    return Content;
}; 