import Schedules from "../../db/models/Scheduling";
import Faculties from "../../db/models/Faculties";

import { FormattedSched, ScheduleInterface } from "../../db/models/Scheduling";
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
        conflicted: conflicted ? sched.conflicted : undefined,
        year: sched.year,
        semester: sched.semester,
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

export const formatResponseData = (initials: string, schedule: ScheduleInterface[]) => {
  const formatted = TIME_TYPE.map(time => {
    return {
      time,
      schedules: DAY_TYPE.map(day => {
        // find the matched schedule and format for response
        const matchedSchedule = schedule.find(val => val.day === day && val.time === time);
        if (matchedSchedule) {
          matchedSchedule.course = matchedSchedule.subject;
          return matchedSchedule;
        }

        return {
          initials: initials,
          day,
          course: '',
          room: '',
          section: '',
        }
      })
    }
  });

  return formatted;
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

// checks for online conflicts
export const onlineConflictCheck = async (schedule: ScheduleInterface) => {
  const targetTime = schedule.time;

  // retrieving the index of the target
  const targetTimeIndex = TIME_TYPE.findIndex((value) => value === targetTime);
  const firstTarget = (targetTimeIndex - 6) >= 0 ? (targetTimeIndex - 6) : 0;
  const lastTarget  = (targetTimeIndex + 6) < TIME_TYPE.length ? (targetTimeIndex + 6) : (TIME_TYPE.length - 1);

  // retrieval of the time included for checking
  const timeRangeCheck = TIME_TYPE.slice(firstTarget, lastTarget + 1);

  // checks conflict for newly added online schedule
  if (schedule.room === 'OL') {
    const scheduleMatch = await Schedules.findAndCountAll({
      where: {
        day: schedule.day,
        time: { [Op.or]: timeRangeCheck },
        section: schedule.section,
        year: schedule.year,
        semester: schedule.semester,
        [Op.and]: [
          { room: {[Op.not]: 'OL'} },
          { room: {[Op.not]: ''} }
        ]
      },
      raw: true
    });

    (scheduleMatch.count > 0) ? schedule.conflicted = true : {};
    return (scheduleMatch.count > 0) ? {
      conflicted: true,
      type: 'online-conflict',
      schedule
    } : {
      conflicted: false,
      type: null,
      schedule
    };
  }

  // checks conflict for newly added ftf schedule
  const scheduleMatch = await Schedules.findAndCountAll({
    where: {
      day: schedule.day,
      time: { [Op.or]: timeRangeCheck },
      section: schedule.section,
      year: schedule.year,
      semester: schedule.semester,
      room: 'OL'
    },
    raw: true
  });

  (scheduleMatch.count > 0) ? schedule.conflicted = true : {};
  return (scheduleMatch.count > 0) ? {
    conflicted: true,
    type: 'ftf-conflict',
    schedule
  } : {
    conflicted: false,
    type: null,
    schedule
  };
};

export const conflictCheck = async (schedule: ScheduleInterface) => {
  const { time, day, room, semester } = schedule;

  // logic for checking if some section is already using the room 
  // ignoring the sections with empty strings
  const scheduleMatch = await Schedules.findAndCountAll({
    where: {
      [Op.and]: [
        {time, day, room, semester},
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
          day: schedule.day,
          semester: schedule.semester
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

  // conflict checking for ftf & online schedule
  const ftfOnlineConflictCheck = await onlineConflictCheck(schedule);
  if (ftfOnlineConflictCheck.conflicted)
    return ftfOnlineConflictCheck;

  // we don't care if the room is online when adding a new room
  const scheduleOnlineRemoved = scheduleMatch.rows.filter(sched => sched.room !== 'OL');

  // room conflict counter
  if (scheduleOnlineRemoved.length > 0) {
    schedule.conflicted = true;
    return {
      conflicted: true,
      type: 'room-conflict',
      schedule
    };
  }

  // section conflict counter
  if (sectionConflict.count > 0) {
    schedule.conflicted = true;
    return {
      conflicted: true,
      type: 'section-conflict',
      schedule
    };
  }

  return {
    conflicted: false,
    type: null,
    schedule
  };
};

export const bulkScheduleCreate = async (schedule: ScheduleInterface[]) => {
  if (schedule.length === 0)
    return await Schedules.findAndCountAll();

  for (let i = 0; i < schedule.length; i++) {
    // replace the online schedules with removed spaces/newline format
    schedule[i].section = schedule[i].section.replace('\n', '');
    schedule[i].room = schedule[i].room.replace(' ', '').replace('\n', '');
    schedule[i].subject = schedule[i].subject.replace('\n', '');

    // for delete functionality
    const sched = schedule[i];
    if (sched.section === '' || sched.room === '' || sched.subject === '') {
      await Schedules.destroy({
        where: {
          day: sched.day,
          time: sched.time,
          initials: sched.initials,
          semester: sched.semester,
          year: sched.year,
        }
      });
    }
  }
  
  schedule = schedule.filter(sched => (sched.day !== '' && sched.room !== '' && sched.time !== '') || sched.initials === '');
  const conflicts = [];
  const uniqueInitials: string[] = [];
  for (let i = 0; i < schedule.length; i++) {
    if (!uniqueInitials.find(initial => initial === schedule[i].initials))
      uniqueInitials.push(schedule[i].initials);

    conflicts.push(await conflictCheck(schedule[i]));
  }

  const allConflicts = conflicts.filter(conflict => conflict.conflicted);
  if (allConflicts.length > 0) {
    const formattedConflict: ScheduleInterface[] = allConflicts.map(conflictedSchedule => conflictedSchedule.schedule);
    throw [{ conflicts: allConflicts, formattedConflict: formatData(formattedConflict, false, true) }, 400];
  }

  const semester = schedule[0].semester;
  const year = schedule[0].year;

  await Schedules.destroy({ where: { initials: uniqueInitials, year, semester }});
  await Schedules.bulkCreate(schedule);
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
          semester: deletables[i].semester,
          year: deletables[i].year,
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
      const { day, time, initials, semester, year } = indivSchedule[i];
      Schedules.destroy({ where: { day, time, initials, semester, year } });
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

  // idk what was i thinking while implementing this
  // but nah, ill not dare to move this one
  return Schedules.findAndCountAll({
    where: { section: schedule[0].section }
  });
};

export const bulkFormattedScheduleCreate = async (year: number, semester: string, schedule: FormattedSched[], isClassSched: boolean=false) => {
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
        time_type: 'am',
        semester,
        year,
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
    where: { initials: userdata.initials },
    raw: true
  });
};

export const getSchedulesByFacultyIdYearSem = async (faculty_id: number, year: number, semester: string) => {
  const userdata = await Faculties.findByPk(faculty_id);
  if (!userdata)
    throw ['User has been deleted', 400];

  return formatResponseData(
    userdata.initials,
    (await Schedules.findAndCountAll({
      where: {
        initials: userdata.initials,
        semester,
        year,
      },
      raw: true
    })).rows
  );
};

export const getFormattedSchedulesBySectionIdYearSem = async (section_code: string, year: number, semester: string) => {
  return formatData(
    (await Schedules.findAndCountAll({
      where: {
        section: section_code,
        semester,
        year,
      },
      raw: true
    })).rows,
    true, false, true
  );
};

export const getFormattedSchedulesByRoomYearSem = async (room_code: string, year: number, semester: string) => {
  return formatData(
    (await Schedules.findAndCountAll({
      where: {
        room: room_code,
        semester,
        year,
      },
      raw: true
    })).rows,
    true
  );
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
  return formatResponseData(userdata.initials, schedules.rows);
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