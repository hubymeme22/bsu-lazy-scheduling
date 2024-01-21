import ScheduleState, { IScheduleRight } from "../../db/models/ScheduleState";
import { Op } from "sequelize";

export const getScheduleStateByInitials = async (initials: string) => {
  return await ScheduleState.findAndCountAll({
    where: { initials }
  });
};

export const createScheduleState = async (schedState: IScheduleRight) => {
  const changedQuery = {
    initials: schedState.initials,
    course: schedState.course,
    section: schedState.section
  };

  // to avoid duplication
  await ScheduleState.destroy({ where: changedQuery });
  await ScheduleState.create(schedState);
  return getScheduleStateByInitials(schedState.initials);
};

export const createBulkScheduleState = async (schedState: IScheduleRight[]) => {
  if (schedState.length === 0) return { count: 0, rows: [] };
  const changedQuery = schedState.map(sched => {
    return {
      initials: sched.initials,
      course: sched.course,
      section: sched.section
    }
  });

  // to avoid duplication
  await ScheduleState.destroy({
    where: { [Op.or]: changedQuery }
  });

  await ScheduleState.bulkCreate(schedState);
  return getScheduleStateByInitials(schedState[0].initials);
};