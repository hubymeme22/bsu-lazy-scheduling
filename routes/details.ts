import { Router, Request, Response } from "express";
import { getAllCourses, getAllRooms, getAllSections, getScheduleDetails } from "./controllers/details.controllers";
import { getFooterById, createFooterDetails } from "./controllers/footer.controllers";
import { getScheduleState, createScheduleState, createManyScheduleState } from "./controllers/schedulestate.controller";

const router = Router();
router.get('/rooms', (req: Request, res: Response) => {
  getAllRooms(res);
});

router.get('/courses', (req: Request, res: Response) => {
  getAllCourses(res);
});

router.get('/sections', (req: Request, res: Response) => {
  getAllSections(res);
});

router.get('/schedules/:id', (req: Request, res: Response) => {
  getScheduleDetails(req, res);
});

router.get('/footer/:id', (req: Request, res: Response) => {
  getFooterById(req, res);
});

router.get('/schedule-state/:initials', (req: Request, res: Response) => {
  getScheduleState(req, res);
});

router.post('/schedule-state', (req: Request, res: Response) => {
  createScheduleState(req, res);
});

router.post('/schedule-state/bulk', (req: Request, res: Response) => {
  createManyScheduleState(req, res);
});

router.post('/footer', (req: Request, res: Response) => {
  createFooterDetails(req, res);
});

export default router;