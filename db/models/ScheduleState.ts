import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface IScheduleRight {
  initials: string;
  course: string;
  section: string;
  status: 'OK' | '';
}

class ScheduleState extends Model<IScheduleRight> {
  public initials!: string;
  public course!: string;
  public section!: string;
  public status!: string;
}

ScheduleState.init({
  initials: DataTypes.STRING,
  course: DataTypes.STRING,
  section: DataTypes.STRING,
  status: DataTypes.STRING
}, {
  sequelize: sequelizeConnection,
  modelName: 'ScheduleState'
});

export default ScheduleState;