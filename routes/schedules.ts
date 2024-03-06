import { Router, Request, Response } from "express";
import { 
  bulkFormattedScheduleCreate,
  getFormattedSchedulesByFacultyId,
  getFormattedSchedulesBySection,
  getFormattedSchedulesByRoom,
  updateSingleSchedule,
  getFormattedSchedulesByFacultyIdYearSem,
  getFormattedSchedulesBySectionIdYearSem,
  getFormattedSchedulesByRoomYearSem
} from "./controllers/schedules.controller";

const router = Router();

router.get('/user/formatted/:year/:semester/:user_id', (req: Request, res: Response) => {
  getFormattedSchedulesByFacultyIdYearSem(req, res);
});

router.get('/user/formatted/:user_id', (req: Request, res: Response) => {
  getFormattedSchedulesByFacultyId(req, res);
});

router.get('/section/formatted/:year/:semester/:section_code', (req: Request, res: Response) => {
  getFormattedSchedulesBySectionIdYearSem(req, res);
});

router.get('/section/formatted/:section_code', (req: Request, res: Response) => {
  getFormattedSchedulesBySection(req, res);
});

router.get('/room/formatted/:year/:semester/:room_code', (req: Request, res: Response) => {
  getFormattedSchedulesByRoomYearSem(req, res);
});

router.get('/room/formatted/:room_code', (req: Request, res: Response) => {
  getFormattedSchedulesByRoom(req, res);
});

// router.post('/bulk', (req: Request, res: Response) => {
//   bulkScheduleCreate(req, res);
// });

router.post('/bulk/formatted', (req: Request, res: Response) => {
  bulkFormattedScheduleCreate(req, res);
});

// router.post('/bulk/formatted/class-schedule', (req: Request, res: Response) => {
//   bulkFormattedClassScheduleCreate(req, res);
// });

router.put('/update-one', (req: Request, res: Response) => {
  updateSingleSchedule(req, res);
});

export default router;