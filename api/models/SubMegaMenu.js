'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SubMegaMenu extends Model {
        static associate(models) {
            SubMegaMenu.belongsTo(models.MegaMenu, {
                foreignKey: 'megaMenuId',
                as: 'megaMenu',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            SubMegaMenu.hasMany(models.Content, {
                foreignKey: 'subMegaMenuId',
                as: 'contents',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    SubMegaMenu.init({
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
            allowNull: false,
            unique: true
        },
        megaMenuId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'megaMenus',
                key: 'id'
            }
        },
        items: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
            get() {
                const rawValue = this.getDataValue('items');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('items', JSON.stringify(value));
            }
        }
    }, {
        sequelize,
        modelName: 'SubMegaMenu',
        tableName: 'submegamenus'
    });

    return SubMegaMenu;
}; 