import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface ScheduleInterface {
  id?: number;
  conflicted?: boolean;
  course?: string;
  day: string;
  section: string;
  room: string;
  subject: string;
  time: string;
  time_type: string;
  initials: string;
  year: number;
  semester: string;
}

export interface FormattedSched {
  time: string;
  schedules: {
    day: string,
    course: string,
    room: string,
    section: string,
    initials: string;
  }[];
}

class Schedules extends Model<ScheduleInterface> {
  public id!: number;
  public day!: string;
  public time!: string;
  public time_type!: 'am' | 'pm';
  public room!: string;
  public section!: string;
  public subject!: string;
  public initials!: string;
  public year!: number;
  public semester!: string;
}

Schedules.init({
  day: DataTypes.STRING,
  section: DataTypes.STRING,
  room: DataTypes.STRING,
  subject: DataTypes.STRING,
  time: DataTypes.STRING,
  time_type: DataTypes.STRING,
  initials: DataTypes.STRING,
  semester: DataTypes.STRING,
  year:  DataTypes.NUMBER,
}, { sequelize: sequelizeConnection, modelName: 'Schedules'});

export default Schedules;