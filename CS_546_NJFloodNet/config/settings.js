// TODO: Consider if we want to change this to a .env file, mostly if we want to use an actual sever (Thys' laptop? but idk if that will work with the scale of data we're collecting)
import dotenv from "dotenv";


dotenv.config();

export const mongoConfig = {
  serverUrl: process.env.MONGO_CONNSTRING,
  database: "FinalProject",
};
