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

export const updateUser = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { username, password, id } = req.body;
    res.json(await service.updateUserById(parseInt(id), { username, password }));
  });
};

export const getAllUsers = (res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.getAllUsers());
  });
};

export const removeUser = (req: Request, res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.deleteUserById(parseInt(req.params.id)));
  })
};