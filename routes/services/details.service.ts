import Schedules from "../../db/models/Scheduling";

export const getAllRooms = async () => {
  const roomParsed = await Schedules.findAll({
    attributes: ['room']
  });

  const rooms = Array.from(new Set(roomParsed.map(schedule => schedule.room)));
  return {
    count: rooms.length,
    rooms
  }
};

export const getAllCourses = async () => {
  const roomParsed = await Schedules.findAll({
    attributes: ['subject']
  });

  const subjects = Array.from(new Set(roomParsed.map(schedule => schedule.subject)));
  return {
    count: subjects.length,
    subjects
  }
};

export const getAllSections = async () => {
  const roomParsed = await Schedules.findAll({
    attributes: ['section']
  });

  const schedules = Array.from(new Set(roomParsed.map(schedule => schedule.section)));
  return {
    count: schedules.length,
    schedules
  }
};