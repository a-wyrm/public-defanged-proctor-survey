import { MongoClient } from "mongodb";

const dbName = "survey";
const collectionName = "survey-results";

let connectionString =
  process.env.CONNECTION_STRING || "mongodb://root:example@localhost:27000/";

if (!connectionString) {
  throw new Error(
    "No connection string provided. \n\nPlease create a `.env` file in the root of this project. Add a CONNECTION_STRING variable to that file with the connection string to your MongoDB cluster. \nRefer to the README.md file for more information."
  );
}

async function initDB() {
  const client = await MongoClient.connect(connectionString);
  const db = client.db(dbName);

  try {
    const existingDbs = await db.admin().listDatabases();
    const dbExists = existingDbs.databases.find((db) => db.name === dbName);

    // if the db doesn't exist, create it
    if (!dbExists) {
      console.log(`Database '${dbName}' does not exist. Creating...`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }

    const collection = db.collection(collectionName);
    const existingDocs = await collection.countDocuments();

    // if the collection doesn't exist, create it
    if (existingDocs === 0) {
      console.log(`Collection '${collectionName}' is empty. Creating initial document...`);
      const initialDoc = {PID: ".."};
      await collection.insertOne(initialDoc);
    } else {
      console.log(`Collection '${collectionName}' already contains documents.`);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await client.close();
  }
}

initDB();