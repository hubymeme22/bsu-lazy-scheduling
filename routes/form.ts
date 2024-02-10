import { Router, Request, Response } from "express";
import { getAll, updateAll } from "./controllers/form-details.controllers";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  getAll(res);
});

router.post('/', (req: Request, res: Response) => {
  updateAll(req, res);
});

export default router;