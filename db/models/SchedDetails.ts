'use strict';

import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../connection";

export interface SchedDetailsInterface {
  id?: number;
  initials: string;
  subject: string;
  section: string;
  student_count: number;
  time: string;
  type: 'even' | 'odd';
}

class SchedDetails extends Model<SchedDetailsInterface> {
  public id!: number;
  public initials!: string;
  public subject!: string;
  public section!: string;
  public student_count!: number;
  public time!: string;
  public type!: 'even' | 'odd';
}

SchedDetails.init({
  initials: DataTypes.STRING,
  subject: DataTypes.STRING,
  section: DataTypes.STRING,
  student_count: DataTypes.INTEGER,
  time: DataTypes.STRING,
  type: DataTypes.STRING,
}, {
  sequelize: sequelizeConnection,
  modelName: 'ScheduleDetails'
});

export default SchedDetails;