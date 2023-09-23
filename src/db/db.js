import { dbConfig } from '../config/postgres.config.js';
import Sequelize from 'sequelize';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: dbConfig.pool,
    logging: false
});

export default sequelize;
