import { Router, Request, Response } from "express";
import { check, login, logout } from "./controllers/auth.controllers";

const router = Router();
router.post('/login', (req: Request, res: Response) => {
  login(req, res);
});

router.get('/logout', (req: Request, res: Response) => {
  logout(req, res);
});

router.get('/check/:token', (req: Request, res: Response) => {
  check(req, res);
});

export default router;