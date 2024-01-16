import Users from "../../db/models/Users";
import * as service from "./sessions.service";

export const login = async (username: string, password: string) => {
  const userdata = await Users.findOne({ where: { username, password } });
  if (!userdata) throw ['Username and Password does not exist', 403];
  return service.createSession(userdata.id);
};

export const logout = async (token: string) => {
  return service.destroySession(token);
};