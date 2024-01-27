import { Op } from "sequelize";
import Schedules from "../../db/models/Scheduling";

export const getAllRooms = async () => {
  const roomParsed = await Schedules.findAll({
    where: {
      room: {
        [Op.not]: 'OL'
      }
    },
    attributes: ['room']
  });

  let rooms = Array.from(new Set(roomParsed.map(schedule => schedule.room)));
  rooms = rooms.filter(rm => rm !== '');

  return {
    count: rooms.length,
    rooms
  }
};

export const getAllCourses = async () => {
  const roomParsed = await Schedules.findAll({
    attributes: ['subject']
  });

  let subjects = Array.from(new Set(roomParsed.map(schedule => schedule.subject)));
  subjects = subjects.filter(sb => sb !== '');
  return {
    count: subjects.length,
    subjects
  }
};

export const getAllSections = async () => {
  const roomParsed = await Schedules.findAll({
    attributes: ['section']
  });

  let schedules = Array.from(new Set(roomParsed.map(schedule => schedule.section)));
  schedules = schedules.filter(sc => sc !== '');
  return {
    count: schedules.length,
    schedules
  }
};