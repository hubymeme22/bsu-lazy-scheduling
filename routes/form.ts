import { Router, Request, Response } from "express";
import { getAll, setDean, setAcademicYear, setSemester, setVCAA } from "./controllers/form-details.controllers";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  getAll(res);
});

router.post('/dean', (req: Request, res: Response) => {
  setDean(req, res);
});

router.post('/ay', (req: Request, res: Response) => {
  setAcademicYear(req, res);
});

router.post('/semester', (req: Request, res: Response) => {
  setSemester(req, res);
});

router.post('/vcaa', (req: Request, res: Response) => {
  setVCAA(req, res);
});

export default router;