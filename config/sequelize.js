import { Sequelize } from 'sequelize';
import config from './config.js';



// connect to mysql database
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        dialect: config.dialect,
        host: config.host,
    },
);

try {
    await sequelize.authenticate();
    console.log('Database Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  
export default sequelize;