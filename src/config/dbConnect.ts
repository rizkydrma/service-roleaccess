import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const db_Username = process.env.DB_USERNAME as string;
const db_Password = process.env.DB_PASSWORD;

const sequelizeConnection = new Sequelize(dbName, db_Username, db_Password, {
  host: dbHost,
  dialect: 'mysql',
});

export default sequelizeConnection;
