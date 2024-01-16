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

const DAY_TYPE = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
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
  schedule = schedule.filter(sched => sched.schedules.length > 0);
  const formatSchedule = schedule.map(sched => {
    return sched.schedules.map(isched => {
      return {
        day: isched.day,
        time: sched.time,
        section: isched.section,
        room: isched.room,
        subject: isched.course,
        initials: isched.initials,
        time_type: 'am'
      };
    });
  });

  const oneDimensionSched = [];
  for (let i = 0; i < formatSchedule.length; i++)
    for (let j = 0; j < formatSchedule[0].length; j++)
      oneDimensionSched.push(formatSchedule[i][j]);

  return await bulkScheduleCreate(oneDimensionSched);
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

  const formattedData = TIME_TYPE.map((time, index) => {
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

  // prototype solution
  for (let i = 0; i < formattedData.length; i++) {
    const includedDays: string[] = [];
    for (let j = 0; j < formattedData[i].schedules.length; j++)
      includedDays.push(formattedData[i].schedules[j].day);

    const undefinedDays = DAY_TYPE.filter(day => !includedDays.includes(day));
    for (let j = 0; j < undefinedDays.length; j++)
      formattedData[i].schedules.push({
        day: undefinedDays[j],
        course: '',
        initials: '',
        room: '',
        section: ''
      });
  }

  return formattedData;
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