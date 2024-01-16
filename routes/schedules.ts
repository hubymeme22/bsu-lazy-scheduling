import { Router, Request, Response } from "express";
import { 
  bulkFormattedScheduleCreate,
  bulkScheduleCreate,
  getFormattedSchedulesByFacultyId,
  getSchedulesByFacultyId,
  updateSingleSchedule
} from "./controllers/schedules.controller";

const router = Router();
router.get('/user/:user_id', (req: Request, res: Response) => {
  getSchedulesByFacultyId(req, res);
});

router.get('/user/formatted/:user_id', (req: Request, res: Response) => {
  getFormattedSchedulesByFacultyId(req, res);
});

router.post('/bulk', (req: Request, res: Response) => {
  bulkScheduleCreate(req, res);
});

router.post('/bulk/formatted', (req: Request, res: Response) => {
  bulkFormattedScheduleCreate(req, res);
});

router.put('/update-one', (req: Request, res: Response) => {
  updateSingleSchedule(req, res);
});

export default router;