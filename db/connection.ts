import { Sequelize } from "sequelize";

const sequelizeConnection = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite3'
});

export default sequelizeConnection;