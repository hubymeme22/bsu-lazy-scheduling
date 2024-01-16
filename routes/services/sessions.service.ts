import Sessions from "../../db/models/Sessions";
import Users from "../../db/models/Users";
import { v4 } from "uuid";

export const getSessionInfo = async (token: string) => {
  const sessionData = await Sessions.findOne({
    where: { token },
    raw: true
  });

  if (!sessionData)
    throw ['Session expired', 403];

  const userData = await Users.findByPk(sessionData.userid);
  if (!userData) {
    Sessions.destroy({ where: { id: sessionData.id} });
    throw ['User deleted', 404];
  }

  return {
    user: userData.username,
    ...sessionData
  };
};

export const checkSession = async (token: string) => {
  return !!(await Sessions.findOne({ where: { token } }));
};

export const createSession = async (userid: number) => {
  const token = v4();
  await Sessions.destroy({ where: { userid } });
  await Sessions.create({ userid, token });
  return token;
};

export const destroySession = async (token: string) => {
  return await Sessions.destroy({ where: { token }});
};