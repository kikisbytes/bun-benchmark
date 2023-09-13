import DataTypes from 'sequelize';
import sequelize from '../db.js';

const Book = sequelize.define('book',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNUll: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNUll: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNUll: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        author: {
            type: DataTypes.STRING,
            allowNUll: false
        }
    });

export default Book;
