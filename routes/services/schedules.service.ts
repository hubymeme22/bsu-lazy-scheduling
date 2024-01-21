import Schedules from "../../db/models/Scheduling";
import Faculties from "../../db/models/Faculties";
import SchedDetails from "../../db/models/SchedDetails";

import { FormattedSched, ScheduleInterface } from "../../db/models/Scheduling";
import { SchedDetailsInterface } from "../../db/models/SchedDetails";
import { DAY_TYPE, TIME_TYPE } from "../utils";
import { Op } from "sequelize";

interface Sched {
  day: string;
  course: string;
  room: string;
  section: string;
  initials: string;
}

interface FormattedData {
  time: string;
  schedules: Sched[];
}

const formatData = (schedules: ScheduleInterface[], isRandomUser?: boolean, conflicted?: boolean) => {
  const formattedData: FormattedData[] = TIME_TYPE.map(time => {
    const filteredSchedules: ScheduleInterface[] = schedules.filter(sched => sched.time === time);
    const formattedSchedules = filteredSchedules.map(sched => {
      return {
        day: sched.day,
        course: sched.subject,
        room: sched.room,
        section: sched.section,
        initials: sched.initials,
        conflicted: conflicted ? sched.conflicted : undefined
      };
    });
    
    return { time, schedules: formattedSchedules };
  });
  
  // first user
  const firstinitial = schedules.length > 0 ? schedules[0].initials : '';

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
        initials: isRandomUser ? '' : firstinitial,
        room: '',
        section: ''
      });

    formattedData[i].schedules.sort((a: Sched, b: Sched) => {
      return DAY_TYPE.indexOf(a.day) - DAY_TYPE.indexOf(b.day);
    });
  }

  return formattedData;
};

export const conflictCheck = async (schedule: ScheduleInterface) => {
  const { time, day, room } = schedule;
  const scheduleMatch = await Schedules.findAndCountAll({
    where: {
      [Op.and]: [
        {time, day, room},
        {
          time: { [Op.not]: '' } ,
          day: { [Op.not]: '' } ,
          room: { [Op.not]: '' } ,
        }
      ],
      initials: {
        [Op.not]: schedule.initials
      }
    }
  });

  const sectionConflict = await Schedules.findAndCountAll({
    where: {
      [Op.and]: [
        {
          section: schedule.section,
          time: schedule.time,
          day: schedule.day
        },
        {
          section: { [Op.not]: '' },
          time: { [Op.not]: '' },
          day: { [Op.not]: '' },
        }
      ]
    }
  });

  if (scheduleMatch.count > 0 || sectionConflict.count > 0) {
    schedule.conflicted = true;
    return {
      conflicted: true,
      schedule
    };
  }

  return {
    conflicted: false,
    schedule
  };
};

export const bulkScheduleCreate = async (schedule: ScheduleInterface[]) => {
  if (schedule.length === 0)
    return await Schedules.findAndCountAll();

  const conflicts = [];
  for (let i = 0; i < schedule.length; i++) {
      conflicts.push(await conflictCheck(schedule[i]));
  }

  const allConflicts = conflicts.filter(conflict => conflict.conflicted);
  if (allConflicts.length > 0) {
    const formattedConflict: ScheduleInterface[] = allConflicts.map(conflictedSchedule => conflictedSchedule.schedule);
    throw [{ conflicts: allConflicts, formattedConflict: formatData(formattedConflict, false, true) }, 400];
  }

  await Schedules.destroy({ where: { initials: schedule[0].initials } });
  await Schedules.bulkCreate(schedule);

  // creates a schedules for each sched
  await SchedDetails.destroy({ where: { initials: schedule[0].initials } });
  const formattedEven: SchedDetailsInterface[] = schedule.map(sched => {
    return {
      initials: sched.initials,
      section: sched.section,
      student_count: 0,
      subject: sched.subject,
      time: sched.time,
      type: 'even'
    }
  });

  const formattedOdd: SchedDetailsInterface[] = schedule.map(sched => {
    return {
      initials: sched.initials,
      section: sched.section,
      student_count: 0,
      subject: sched.subject,
      time: sched.time,
      type: 'odd'
    }
  });

  // cursed implementation, but, what can i do? time is ticking lol
  await SchedDetails.bulkCreate(formattedEven);
  await SchedDetails.bulkCreate(formattedOdd);
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

export const getSchedulesBySection = async (section: string) => {
  return await Schedules.findAndCountAll({
    where: { section }
  });
};

export const getScedulesByRoom = async (room: string) => {
  return await Schedules.findAndCountAll({
    where: { room }
  });
};

export const getFormattedSchedulesByFacultyId = async (faculty_id: number) => {
  const userdata = await Faculties.findByPk(faculty_id);
  if (!userdata)
    throw ['User has been deleted', 400];

  const schedules = await getSchedulesByFacultyId(faculty_id);
  return formatData(schedules.rows);
};

export const getFormattedSchedulesByRoom = async (room: string) => {
  const schedules = await getScedulesByRoom(room);
  return formatData(schedules.rows, true);
};

export const getFormattedSchedulesBySection = async (section: string) => {
  const schedules = await getSchedulesBySection(section);
  return formatData(schedules.rows, true);
};

export const updateSchedule = async (day: string, time: string, update: ScheduleInterface) => {
  await Schedules.update(update, {
    where: { day, time }
  });
};