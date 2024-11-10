import { MongoClient } from "mongodb";

let connectionString =
  process.env.CONNECTION_STRING || "mongodb://root:example@localhost:27000/";

if (!connectionString) {
  throw new Error(
    "No connection string provided. \n\nPlease create a `.env` file in the root of this project. Add a CONNECTION_STRING variable to that file with the connection string to your MongoDB cluster. \nRefer to the README.md file for more information."
  );
}

let mongodb = new MongoClient(connectionString);

try {
  // Connect the client to the server
  await mongodb.connect();
} catch (err) {
  console.error(err);
}

let db = mongodb.db("survey");

export default db;
