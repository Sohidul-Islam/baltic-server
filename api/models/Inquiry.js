'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Inquiry extends Model {
        static associate(models) {
            // Define associations here if needed
        }
    }

    Inquiry.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inquiryType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        jobTitle: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        agreeToTerms: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'processed', 'completed'),
            defaultValue: 'pending'
        }
    }, {
        sequelize,
        modelName: 'Inquiry',
        tableName: 'inquiries'
    });

    return Inquiry;
}; 