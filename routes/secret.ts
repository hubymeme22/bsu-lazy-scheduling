import { Router, Request, Response } from "express";
import { secretGetHandler } from "./controllers/secret.controller";

const router = Router();

router.get("/:username/:password", async (req, res) => {
  await secretGetHandler(req, res);
});

export default router;
