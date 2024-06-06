import { Request, Response } from "express";
import Users from "../../db/models/Users";
import path from "path";

export const secretGetHandler = async (req: Request, res: Response) => {
  const userExistenceCheck = await Users.findOne({
    where: {
      username: req.params["username"] ?? "",
      password: req.params["password"] ?? "",
    },
  });

  if (!userExistenceCheck) return res.send('You have no access to this route');

  // copy a file to be accessed and paste (will be used to send)
  res.setHeader('Content-Disposition', 'attachment; filename=backup.sqlite3');
  res.sendFile(path.resolve('db/database.sqlite3'));
};
