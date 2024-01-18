import { Router, Request, Response } from "express";
import { 
  bulkFormattedScheduleCreate,
  bulkScheduleCreate,
  getFormattedSchedulesByFacultyId,
  getFormattedSchedulesBySection,
  getFormattedSchedulesByRoom,
  updateSingleSchedule
} from "./controllers/schedules.controller";

const router = Router();
router.get('/user/formatted/:user_id', (req: Request, res: Response) => {
  getFormattedSchedulesByFacultyId(req, res);
});

router.get('/section/formatted/:section_code', (req: Request, res: Response) => {
  getFormattedSchedulesBySection(req, res);
});

router.get('/room/formatted/:room_code', (req: Request, res: Response) => {
  getFormattedSchedulesByRoom(req, res);
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