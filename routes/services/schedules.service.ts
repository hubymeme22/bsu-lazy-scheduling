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

const formatData = (schedules: ScheduleInterface[], isRandomUser?: boolean, conflicted?: boolean, isStaticSection?: boolean) => {
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
  
  // first user & first sched
  const firstinitial = schedules.length > 0 ? schedules[0].initials : '';
  const firstSection = (schedules.length > 0 && isStaticSection) ? schedules[0].section : '';

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
        section: firstSection
      });

    formattedData[i].schedules.sort((a: Sched, b: Sched) => {
      return DAY_TYPE.indexOf(a.day) - DAY_TYPE.indexOf(b.day);
    });
  }

  return formattedData;
};

// compares the values of the schedule if already existing
export const ignorable = async (schedule: ScheduleInterface) => {
  const { initials, time, day, room, subject } = schedule;
  return !!(await Schedules.findOne({
    where: { initials, time, day, room, subject }
  }));
};

// checks if the section's room will be replaced
export const roomReplacable = async (schedule: ScheduleInterface) => {
  const { initials, time, day, subject } = schedule;
  return !!(await Schedules.findOne({
    where: { initials, time, day, subject }
  })) || !!(await Schedules.findOne({
    where: { day, time, initials }
  }));
};

export const conflictCheck = async (schedule: ScheduleInterface) => {
  const { time, day, room } = schedule;

  // logic for checking if some section is already using the room 
  // ignoring the sections with empty strings
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
    },
    raw: true
  });


  // checking if some prof has already assigned the section
  // in the given time and day
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
      ],
      initials: { [Op.not]: schedule.initials }
    }
  });

  const scheduleOnlineRemoved = scheduleMatch.rows.filter(sched => sched.room !== 'OL');
  if (scheduleOnlineRemoved.length > 0 || sectionConflict.count > 0) {
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

  await Schedules.destroy({ where: { initials: schedule[0].initials }});
  console.log(schedule);
  await Schedules.bulkCreate(schedule);

  // // creates a schedules for each sched
  // await SchedDetails.destroy({ where: { initials: schedule[0].initials } });
  // const formattedEven: SchedDetailsInterface[] = schedule.map(sched => {
  //   return {
  //     initials: sched.initials,
  //     section: sched.section,
  //     student_count: 0,
  //     subject: sched.subject,
  //     time: sched.time,
  //     type: 'even'
  //   }
  // });

  // const formattedOdd: SchedDetailsInterface[] = schedule.map(sched => {
  //   return {
  //     initials: sched.initials,
  //     section: sched.section,
  //     student_count: 0,
  //     subject: sched.subject,
  //     time: sched.time,
  //     type: 'odd'
  //   }
  // });

  // // cursed implementation, but, what can i do? time is ticking lol
  // await SchedDetails.bulkCreate(formattedEven);
  // await SchedDetails.bulkCreate(formattedOdd);
  return await Schedules.findAndCountAll();
};

// overwrites the schedules with matching day and time
export const bulkCreateCleaner = async (schedule: ScheduleInterface[]) => {
  if (schedule.length === 0) return {count: 0, rows: []};

  const inputSched: ScheduleInterface[] = schedule.filter(sched => (sched.day !== '' && sched.room !== '' && sched.time !== ''));
  let indivSchedule: ScheduleInterface[] = [];

  // auto remove existing schedules
  const deletables = inputSched.filter(sched => sched.initials === 'DEL');
  for (let i = 0; i < deletables.length; i++) {
    Schedules.update({ section: '', subject: '', room: '' },
      {
        where: {
          day: deletables[i].day,
          time: deletables[i].time,
          subject: deletables[i].subject,
          section: deletables[i].section,
          room: deletables[i].room,
        }
      });
  }

  for (let i = 0; i < inputSched.length; i++) {
    if (!(await ignorable(inputSched[i])) && inputSched[i].initials !== 'DEL')
      indivSchedule.push(inputSched[i]);
  }

  // checks for replacable rooms and destroy
  for (let i = 0; i < indivSchedule.length; i++) {
    if ((await roomReplacable(indivSchedule[i]))) {
      const { day, time, initials } = indivSchedule[i];
      Schedules.destroy({ where: { day, time, initials } });
    }
  }

  const conflicts = [];
  for (let i = 0; i < indivSchedule.length; i++) {
    const conflict = await conflictCheck(indivSchedule[i]);
    conflict.conflicted ? conflicts.push(conflict) : null;
  }

  if (conflicts.length > 0) {
    const formattedConflict: ScheduleInterface[] = conflicts.map(conflict => conflict.schedule);
    throw [{ conflicts, formattedConflict: formatData(formattedConflict, false, true) }, 400];
  }

  await Schedules.bulkCreate(indivSchedule);
  return Schedules.findAndCountAll({
    where: { section: schedule[0].section }
  });
};

export const bulkFormattedScheduleCreate = async (schedule: FormattedSched[], isClassSched: boolean=false) => {
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

  return isClassSched
    ? await bulkCreateCleaner(oneDimensionSched)
    : await bulkScheduleCreate(oneDimensionSched);
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
  return formatData(schedules.rows, true, false, true);
};

export const updateSchedule = async (day: string, time: string, update: ScheduleInterface) => {
  await Schedules.update(update, {
    where: { day, time }
  });
};