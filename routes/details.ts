import { Router, Request, Response } from "express";
import { getAllCourses, getAllRooms, getAllSections } from "./controllers/details.controllers";

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

export default router;