import Faculties from "../../db/models/Faculties";
import { FacultiesInterface } from "../../db/models/Faculties";

export const getFacultyById = async (id: number) => {
  return await Faculties.findByPk(id);
};

export const getAllFaculties = async () => {
  return await Faculties.findAndCountAll();
}

export const createFaculty = async (name: string, initials: string) => {
  const faculty = await Faculties.create({ name, initials });
  return getFacultyById(faculty.id);
};

export const deleteFaculty = async (id: number) => {
  const faculty = await getFacultyById(id);
  if (faculty) {
    await Faculties.destroy({ where: { id } });
    return faculty;
  }

  throw ['ID Provided does not exist', 404];
};

export const updateFaculty = async (id: number, update: FacultiesInterface) => {
  const faculty = await Faculties.update(update, { where: { id } });
  if (faculty) return getFacultyById(id);
  throw ['ID Provided does not exist', 404];
};