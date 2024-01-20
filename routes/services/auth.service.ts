import Users from "../../db/models/Users";
import * as service from "./sessions.service";

export const login = async (username: string, password: string) => {
  if ((service.admincreds.user && service.admincreds.pass) &&
    (username === service.admincreds.user && password === service.admincreds.pass)) {
    const admintoken = service.createNewAdminSession();
    return { token: admintoken, permission: 'admin' };
  }

  const userdata = await Users.findOne({ where: { username, password } });
  if (!userdata) throw ['Username and Password does not exist', 403];
  return {
    token: await service.createSession(userdata.id),
    permission: 'user'
  };
};

export const logout = async (token: string) => {
  service.createNewAdminSession();
  return service.destroySession(token);
};