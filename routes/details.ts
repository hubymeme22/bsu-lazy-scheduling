import { Router, Request, Response } from "express";
import { getAllCourses, getAllRooms, getAllSections, getScheduleDetails } from "./controllers/details.controllers";

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

router.get('/schedules/:initials', (req: Request, res: Response) => {
  getScheduleDetails(req, res);
});

export default router;