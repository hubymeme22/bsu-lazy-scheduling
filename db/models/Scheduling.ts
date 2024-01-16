import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface ScheduleInterface {
  id?: number;
  day: string;
  section: string;
  room: string;
  subject: string;
  time: string;
  time_type: string;
  initials: string;
}

class Schedules extends Model<ScheduleInterface> {
  public id!: number;
  public day!: string;
  public time!: 'am' | 'pm';
  public room!: string;
  public section!: string;
  public subject!: string;
  public initials!: string;
}

Schedules.init({
  day: DataTypes.STRING,
  section: DataTypes.STRING,
  room: DataTypes.STRING,
  subject: DataTypes.STRING,
  time: DataTypes.STRING,
  time_type: DataTypes.STRING,
  initials: DataTypes.STRING,
}, { sequelize: sequelizeConnection, modelName: 'Schedules'});

export default Schedules;