import { Router, Request, Response } from "express";
import { createUser, getAllUsers, updateUser } from "./controllers/users.controller";

const router = Router();
router.get('/', async (req: Request, res: Response) => {
  getAllUsers(res);
});

router.post('/register', async (req: Request, res: Response) => {
  createUser(req, res);
});

router.put('/update', async (req: Request, res: Response) => {
  updateUser(req, res);
});

export default router;