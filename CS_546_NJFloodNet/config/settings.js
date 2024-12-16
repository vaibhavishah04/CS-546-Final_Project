import dotenv from "dotenv";

dotenv.config();

export const mongoConfig = {
  serverUrl: process.env.MONGO_CONNSTRING,
  database: "FinalProject",
};
