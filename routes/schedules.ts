import { Router, Request, Response } from "express";
import { bulkScheduleCreate, getSchedulesByFacultyId, updateSingleSchedule } from "./controllers/schedules.controller";

const router = Router();
router.get('/user/:user_id', (req: Request, res: Response) => {
  getSchedulesByFacultyId(req, res);
});

router.post('/bulk', (req: Request, res: Response) => {
  bulkScheduleCreate(req, res);
});

router.put('/update-one', (req: Request, res: Response) => {
  updateSingleSchedule(req, res);
});

export default router;