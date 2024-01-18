import { Request, Response } from "express";
import { requestHandler } from "../utils";
import { FormattedSched, ScheduleInterface } from "../../db/models/Scheduling";
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

export const getFormattedSchedulesBySection = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { section_code } = req.params;
    res.json(await service.getFormattedSchedulesBySection(section_code));
  });
};

export const getFormattedSchedulesByRoom = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { room_code } = req.params;
    res.json(await service.getFormattedSchedulesByRoom(room_code));
  });
};

export const bulkScheduleCreate = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { rows } = req.body;
    res.json(await service.bulkScheduleCreate(rows as ScheduleInterface[]));
  });
};

export const bulkFormattedScheduleCreate = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { rows } = req.body;
    res.json(await service.bulkFormattedScheduleCreate(rows as FormattedSched[]));
  });
};

export const updateSingleSchedule = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const update: ScheduleInterface = req.body.update;
    const { time, day } = req.body;
    service.updateSchedule(time, day, update);
  });
};