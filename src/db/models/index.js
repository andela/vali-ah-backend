import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import config from '../../../config/sequelize';

const basename = path.basename(__filename);
const database = {};
const sequelize = new Sequelize(config.url, config);

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    database[model.name] = model;
  });

Object.keys(database).forEach((model) => {
  if (database[model].associate) {
    database[model].associate(database);
  }
});

database.sequelize = sequelize;
database.Sequelize = Sequelize;

export default database;
