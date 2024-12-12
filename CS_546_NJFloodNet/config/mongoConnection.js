/**
 * Establish a MongoDB connection and export it for reuse across the application.
 */

// Connect to MongoDB using Mongoose
import { MongoClient } from "mongodb";
import { mongoConfig } from "./settings.js";

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

const closeConnection = async () => {
  await _connection.close();
};

/* testing to see if mongo connects correctly
export const testConnection = async () => {
  try {
    const db = await dbConnection();
    console.log("Connected to MongoDB:", db.databaseName);

    // Fetch and log the first item from a collection (e.g., 'Users')
    const usersCollection = await db.collection("Users");
    const firstUser = await usersCollection.findOne();
    console.log("First item in 'Users' collection:", firstUser);
  } catch (e) {
    console.error("Failed to connect to MongoDB or fetch data:", e);
  } finally {
    await closeConnection();
  }
};
*/

export { dbConnection, closeConnection };
