import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// TODO: Make this whatever collections we have
export const reports = getCollectionFn("Reports");
export const users = getCollectionFn("Users");
export const sensors = getCollectionFn("Sensors")


