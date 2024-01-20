import { Request, Response } from "express";
import { requestHandler } from "../utils";

import * as loginservice from "../services/auth.service";
import * as sessionservice from "../services/sessions.service";

export const login = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { username, password } = req.body;
    res.json(await loginservice.login(username, password));
  });
};

export const logout = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const token = req.cookies.token;
    const loggedOut = await loginservice.logout(token);
    if (loggedOut) return res.json({ loggedOut: true });
    return res.json({ loggedOut: false });
  });
};

export const check = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { token } = req.params;
    res.json({ valid: (await sessionservice.checkSession(token)) });
  });
};