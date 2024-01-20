import { Router, Request, Response } from "express";
import { createFaculty, editFaculty, getAllFaculties } from "./controllers/faculties.controller";

const router = Router();
router.get('/', (req: Request, res: Response) => {
  getAllFaculties(res);
});

router.post('/add', (req: Request, res: Response) => {
  createFaculty(req, res);
});

router.put('/update', (req: Request, res: Response) => {
  editFaculty(req, res);
});

export default router;