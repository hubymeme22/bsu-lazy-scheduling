import Users from "../../db/models/Users";
import { UsersAttributes } from "../../db/models/Users";

export const getUserById = async (id: number) => {
  return await Users.findByPk(id);
}

export const getAllUsers = async () => {
  return await Users.findAndCountAll();
}

export const createUser = async (username: string, password: string) => {
  const newUser = await Users.create({ username, password });
  return getUserById(newUser.id);
}

export const deleteUserById = async (id: number) => {
  const userData = await getUserById(id);
  await Users.destroy({
    where: { id }
  });

  return userData;
}

export const updateUserById = async (id: number, updatedUserData: UsersAttributes) => {
  await Users.update(updatedUserData, {
    where: { id }
  });

  return getUserById(id);
}