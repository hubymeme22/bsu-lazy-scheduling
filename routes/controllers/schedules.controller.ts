import { Request, Response } from "express";
import { requestHandler } from "../utils";
import { ScheduleInterface } from "../../db/models/Scheduling";
import * as service from "../services/schedules.service";

export const getSchedulesByFacultyId = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { user_id } = req.params;
    res.json(await service.getSchedulesByFacultyId(parseInt(user_id)));
  });
};

export const bulkScheduleCreate = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { rows } = req.body;
    res.json(await service.bulkScheduleCreate(rows as ScheduleInterface[]));
  });
};

export const updateSingleSchedule = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const update: ScheduleInterface = req.body.update;
    const { time, day } = req.body;
    service.updateSchedule(time, day, update);
  });
};