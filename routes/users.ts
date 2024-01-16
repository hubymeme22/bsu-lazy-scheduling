import { Router, Request, Response } from "express";
import { createUser, getAllUsers, initializeEmptyUser } from "./controllers/users.controller";

const router = Router();
router.get('/', async (req: Request, res: Response) => {
  getAllUsers(res);
});

router.get('/hidden-initialize-account', (req: Request, res: Response) => {
  initializeEmptyUser(res);
});

router.post('/register', async (req: Request, res: Response) => {
  createUser(req, res);
});

export default router;