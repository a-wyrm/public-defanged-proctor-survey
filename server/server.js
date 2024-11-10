import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = process.env.EXPRESS_PORT || 8080;


app.use(express.json());
app.use(cors());

import survey from "./routes/survey.js";

app.use("/postsurvey", survey);

let connectionString =
  process.env.CONNECTION_STRING || "mongodb://root:example@localhost:27000/";
mongoose
  .connect(connectionString)
  .then(() => console.log("connected to DB"))
  .catch(console.error);

  app.use('/', express.static("./dist"));
  app.use('/debug', express.static("./dist"));
  app.use('/survey', express.static("./dist"));

//AJA: needed to add this to actually list on the survey
app.listen(port,() => {
  console.log(`Express running on port localhost:${port}`)
});
