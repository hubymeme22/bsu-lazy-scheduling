import Schedules from "../../db/models/Scheduling";
import Faculties from "../../db/models/Faculties";
import { FormattedSched, ScheduleInterface } from "../../db/models/Scheduling";

const TIME_TYPE = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
  "05:00 - 06:00",
  "18:00 - 19:00",
];


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

export const bulkFormattedScheduleCreate = async (schedule: FormattedSched[]) => {
  const formatSchedule = schedule.map(sched => {
    return {
      day: sched.schedules.day,
      time: sched.time,
      section: sched.schedules.section,
      room: sched.schedules.room,
      subject: sched.schedules.course,
      initials: sched.schedules.initials,
      time_type: 'am'
    };
  });

  return await bulkScheduleCreate(formatSchedule);
};

export const getSchedulesByFacultyId = async (faculty_id: number) => {
  const userdata = await Faculties.findByPk(faculty_id);
  if (!userdata)
    throw ['User has been deleted', 400];

  return await Schedules.findAndCountAll({
    where: { initials: userdata.initials }
  });
};

export const getFormattedSchedulesByFacultyId = async (faculty_id: number) => {
  const userdata = await Faculties.findByPk(faculty_id);
  if (!userdata)
    throw ['User has been deleted', 400];

  const schedules = await Schedules.findAndCountAll({
    where: { initials: userdata.initials },
    raw: true
  });

  return TIME_TYPE.map((time, index) => {
    const filteredSchedules: Schedules[] = schedules.rows.filter(sched => sched.time === time);
    const formattedSchedules = filteredSchedules.map(sched => {
      return {
        day: sched.day,
        course: sched.subject,
        room: sched.room,
        section: sched.section,
        initials: sched.initials
      };
    });

    return { time, schedules: formattedSchedules };
  });
};

export const getSchedulesBySubject = async (subjectCode: string) => {
  return await Schedules.findAndCountAll({
    where: { subject: subjectCode }
  });
};

export const getSchedulesBySection = async (section: string) => {
  return await Schedules.findAndCountAll({
    where: { section }
  });
};

export const updateSchedule = async (day: string, time: string, update: ScheduleInterface) => {
  await Schedules.update(update, {
    where: { day, time }
  });
};