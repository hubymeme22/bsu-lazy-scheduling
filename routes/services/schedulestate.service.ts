import ScheduleState, { IScheduleRight } from "../../db/models/ScheduleState";

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
  const checkQuery = await ScheduleState.findOne({ where: changedQuery });
  if (checkQuery) await ScheduleState.destroy({ where: changedQuery });

  await ScheduleState.create(schedState);
  return getScheduleStateByInitials(schedState.initials);
};