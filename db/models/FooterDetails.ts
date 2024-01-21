import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface ITotal {
  officialTime: string[];
  teachingHours: string[];
  overtimeWithin: string[];
  overtimeOutside: string[];
}

export interface IOverallSummary {
  designation: string;
  preparations: string;
  hoursPerWeek: string;
  regularLoad: string;
  overload: string;
  academicRank: string;
  consultationHours: string;
}

export interface FooterDetailsInterface {
  initials: string,
  official_time: string,
  teaching_hours: string,
  overtimeWithin: string,
  overtimeOutside: string,
  designation: string,
  preparations: string,
  hours_per_week: string,
  regular_load: string,
  overload: string,
  academic_rank: string,
  consultation_hours: string
}

class FooterDetails extends Model<FooterDetailsInterface> {
  public official_time!: string;
  public teaching_hours!: string;
  public overtimeWithin!: string;
  public overtimeOutside!: string;
  public designation!: string;
  public preparations!: string;
  public hours_per_week!: string;
  public regular_load!: string;
  public overload!: string;
  public academic_rank!: string;
  public consultation_hours!: string;
}

FooterDetails.init({
  initials: DataTypes.STRING,
  official_time: DataTypes.STRING,
  teaching_hours: DataTypes.STRING,
  overtimeWithin: DataTypes.STRING,
  overtimeOutside: DataTypes.STRING,
  designation: DataTypes.STRING,
  preparations: DataTypes.STRING,
  hours_per_week: DataTypes.STRING,
  regular_load: DataTypes.STRING,
  overload: DataTypes.STRING,
  academic_rank: DataTypes.STRING,
  consultation_hours: DataTypes.STRING
}, {
  sequelize: sequelizeConnection,
  modelName: 'FooterDetails'
});

export default FooterDetails;