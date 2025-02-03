'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FooterContent extends Model {
        static associate(models) {
            // Define associations if needed
        }
    }

    FooterContent.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        emails: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            validate: {
                isValidEmailArray(value) {
                    if (!Array.isArray(value)) {
                        throw new Error('Emails must be an array');
                    }
                    value.forEach(email => {
                        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                            throw new Error('Invalid email format');
                        }
                    });
                }
            }
        },
        phones: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        addresses: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'FooterContent',
        tableName: 'footerContents'
    });

    return FooterContent;
}; 