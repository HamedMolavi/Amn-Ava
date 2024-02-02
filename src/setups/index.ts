import { setupInteractive } from "./interactiveShell.setup";
import connectToDBs from "../db/index.database";
import { setupPassport } from "../setups/passport.setup";
import seedSetup from "./seed.setup";


export default async function setup() {
  const actionFunction = await setupInteractive();
  const dbs = await connectToDBs({ mongo: process.env["MONGODB_URL"].split(",").map((el) => el.trim()), redis: process.env["REDIS_URL"] });
  process["redis"] = dbs["redis"];
  const seeds = await seedSetup();
  const passport = setupPassport();
  return {
    actionFunction,
    dbs,
    seeds,
    passport
  };
};