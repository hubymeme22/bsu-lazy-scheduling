import { Request, Response } from "express";
import { requestHandler } from "../utils";
import { FormattedSched, ScheduleInterface } from "../../db/models/Scheduling";
import { getAll } from "../services/form-details.service";
import * as service from "../services/schedules.service";

export const getSchedulesByFacultyId = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { user_id } = req.params;
    res.json(await service.getSchedulesByFacultyId(parseInt(user_id)));
  });
};

export const getFormattedSchedulesByFacultyId = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { user_id } = req.params;
    res.json(await service.getFormattedSchedulesByFacultyId(parseInt(user_id)));
  });
};

export const getFormattedSchedulesByFacultyIdYearSem = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { user_id, year, semester } = req.params;
    res.json(await service.getSchedulesByFacultyIdYearSem(parseInt(user_id), parseInt(year), semester));
  });
};

export const getFormattedSchedulesBySection = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { section_code } = req.params;
    res.json(await service.getFormattedSchedulesBySection(section_code));
  });
};

export const getFormattedSchedulesBySectionIdYearSem = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { section_code, year, semester } = req.params;
    res.json(await service.getFormattedSchedulesBySectionIdYearSem(section_code, parseInt(year), semester));
  });
};

export const getFormattedSchedulesByRoom = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { room_code } = req.params;
    res.json(await service.getFormattedSchedulesByRoom(room_code));
  });
};

export const getFormattedSchedulesByRoomYearSem = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { room_code, year, semester } = req.params;
    res.json(await service.getFormattedSchedulesByRoomYearSem(room_code, parseInt(year), semester));
  });
};

// defaults year 2023 and 2nd semester
export const bulkFormattedScheduleCreate = (req: Request, res: Response) => {
  const formdetails = getAll();
  requestHandler(res, async () => {
    const { rows, year, semester } = req.body;
    res.json(await service.bulkFormattedScheduleCreate(
      parseInt(year) || formdetails.academic_year,
      semester || formdetails.semester,
      rows as FormattedSched[]
    ));
  });
};

export const updateSingleSchedule = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const update: ScheduleInterface = req.body.update;
    const { time, day } = req.body;
    service.updateSchedule(time, day, update);
  });
};