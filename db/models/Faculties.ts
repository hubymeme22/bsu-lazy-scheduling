import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface FacultiesInterface {
  id?: number;
  name: string;
  initials: string;
}

class Faculties extends Model<FacultiesInterface> {
  public id!: number;
  public name!: string;
  public initials!: string;
}

Faculties.init({
  name: DataTypes.STRING,
  initials: DataTypes.STRING
}, {
  sequelize: sequelizeConnection,
  modelName: 'Faculties'
});

export default Faculties;