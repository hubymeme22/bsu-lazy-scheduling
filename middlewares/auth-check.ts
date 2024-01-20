import { Request, Response, NextFunction } from "express";
import * as sessionservice from "../routes/services/sessions.service";
import { requestHandler } from "../routes/utils";

export const authChecker = (req: Request, res: Response, next: NextFunction) => {
  requestHandler(res, async () => {
    if (!req.cookies.token) throw ['No token assigned', 403];
    if (await sessionservice.checkSession(req.cookies.token))
      return next();
    throw ['Unauthorized action', 403];
  });
};

export const adminAuthChecker = (req: Request, res: Response, next: NextFunction) => {
  requestHandler(res, async () => {
    if (!req.cookies.token) throw ['No token assigned', 403];
    if (sessionservice.adminCheckSession(req.cookies.token))
      return next();

    throw ['Unauthorized action', 403];
  });
};