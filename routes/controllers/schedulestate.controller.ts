import { Request, Response } from 'express';
import { requestHandler } from '../utils';
import * as service from '../services/schedulestate.service';

export const createScheduleState = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { initials, course, section, status } = req.body;
    res.json(await service.createScheduleState({initials, course, section, status}));
  });
};

export const createManyScheduleState = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.createBulkScheduleState(req.body));
  })
};

export const getScheduleState = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.getScheduleStateByInitials(req.params.initials));
  });
};