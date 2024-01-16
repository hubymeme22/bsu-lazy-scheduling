import Schedules from "../../db/models/Scheduling";
import { ScheduleInterface } from "../../db/models/Scheduling";
import Faculties from "../../db/models/Faculties";

interface conflict {
  conflicted: boolean;
  schedule: ScheduleInterface;
}

export const conflictCheck = async (schedule: ScheduleInterface) => {
  const { time, day, room } = schedule;
  const scheduleMatch = await Schedules.findAndCountAll({
    where: { time, day, room }
  });

  if (scheduleMatch.count > 0)
    return {
      conflicted: true,
      schedule
    };

  return {
    conflicted: false,
    schedule
  };
};

export const bulkScheduleCreate = async (schedule: ScheduleInterface[]) => {
  const conflicts = [];
  for (let i = 0; i < schedule.length; i++)
    conflicts.push(await conflictCheck(schedule[i]));

  const allConflicts = conflicts.filter(conflict => conflict.conflicted);
  if (allConflicts.length > 0)
    throw [{ conflicts: allConflicts }, 400];

  await Schedules.bulkCreate(schedule);
  return await Schedules.findAndCountAll();
};

export const getSchedulesByFacultyId = async (faculty_id: number) => {
  const userdata = await Faculties.findByPk(faculty_id);
  if (!userdata)
    throw ['User has been deleted', 400];

  return await Schedules.findAndCountAll({
    where: { initials: userdata.initials }
  });
};

export const updateSchedule = async (day: string, time: string, update: ScheduleInterface) => {
  await Schedules.update(update, {
    where: { day, time }
  });
};