import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface UsersAttributes {
  id?: number;
  username: string;
  password: string;
}

class Users extends Model<UsersAttributes> {
  public id!: number;
  public username!: string;
  public password!: string;
}

Users.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING
},
{
  sequelize: sequelizeConnection,
  modelName: 'Users'
});

export default Users;