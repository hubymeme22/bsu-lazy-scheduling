import Faculties from "../../db/models/Faculties";
import Schedules from "../../db/models/Scheduling";
import { FacultiesInterface } from "../../db/models/Faculties";
import { DAY_TYPE, TIME_TYPE } from "../utils";

export const getFacultyByInitials = async (initials: string) => {
  return await Faculties.findOne({
    where: { initials }
  });
};

export const getAllFaculties = async () => {
  return await Faculties.findAndCountAll();
}

export const createFaculty = async (name: string, initials: string) => {
  const faculty = await Faculties.create({ name, initials });
  await initializeFacultySchedule(faculty.initials);
  return getFacultyByInitials(faculty.initials);
};

export const initializeFacultySchedule = async (initials: string) => {
  const faculty = await Faculties.findOne({ where: { initials } });
  if (!faculty) throw ['Nonexistent initial', 404];

  await Schedules.bulkCreate([{
    day: DAY_TYPE[0],
    time: TIME_TYPE[0],
    initials: initials,
    room: '',
    section: '',
    subject: '',
    time_type: 'am'
  }]);
};

export const deleteFaculty = async (initials: string) => {
  const faculty = await getFacultyByInitials(initials);
  if (faculty) {
    await Faculties.destroy({ where: { initials } });
    return faculty;
  }

  throw ['ID Provided does not exist', 404];
};

export const updateFaculty = async (initials: string, update: FacultiesInterface) => {
  const faculty = await Faculties.update(update, { where: { initials } });
  if (faculty) return getFacultyByInitials(initials);
  throw ['ID Provided does not exist', 404];
};