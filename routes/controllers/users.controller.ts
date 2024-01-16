import { Request, Response } from "express";
import { requestHandler } from "../utils";
import * as service from "../services/users.service";

export const createUser = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { username, password} = req.body;
    const dbResponse = await service.createUser(username, password);
    res.json(dbResponse);
  });
};

export const getAllUsers = (res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.getAllUsers());
  });
};

export const initializeEmptyUser = (res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.createUser('', ''));
  });
}