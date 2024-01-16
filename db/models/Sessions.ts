import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface SessionsAttributes {
  id?: number;
  token: string;
  userid: number;
}

class Sessions extends Model<SessionsAttributes> {
  public id!: string;
  public token!: string;
  public userid!: number;
}

Sessions.init({
  token: DataTypes.STRING,
  userid: DataTypes.NUMBER
}, {
  sequelize: sequelizeConnection,
  modelName: 'Sessions'
});

export default Sessions;