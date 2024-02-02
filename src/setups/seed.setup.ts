import { create } from "../db/mongo/create.database";
import User from "../db/mongo/models/user";
import { read } from "../db/mongo/read.database";
import { IUser } from "../types/interfaces/user.interface";

export default async () => {
  let user = await makeSeedUser();
  return {user};
};

async function makeSeedUser(): Promise<IUser | undefined> {
  if (!(await read(User, { query: { role: 'admin' } })).length) {
    const users: IUser[] = await create(User, {
      firstName: 'admin',
      lastName: 'admin',
      username: 'admin',
      password: 'admin',
      email: 'admin@gmail.com'
    });
    console.log("\t++ Seed data user: username=admin, password=admin");
    return users[0];
  };
  return undefined;
}