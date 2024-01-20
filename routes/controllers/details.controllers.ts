import { Request, Response } from "express";
import { requestHandler } from "../utils";

import * as service from "../services/details.service";
import * as schedDetailService from "../services/schedule-details.service";

export const getAllRooms = (res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.getAllRooms());
  });
};

export const getAllCourses = (res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.getAllCourses());
  });
};

export const getAllSections = (res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.getAllSections());
  });
};

export const getScheduleDetails = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    res.json(await schedDetailService.getFormattedUserScheduleDetail(parseInt(req.params.id)));
  });
}