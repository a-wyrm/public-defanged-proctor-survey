import express from "express";

// database
import db from "../db/connection.js";
const router = express.Router();

// This section will help you get a single record by id
router.post("/", async (request, res) => {
  console.log("Server: POST: " + request);
  let collection = await db.collection("survey-results");
  const prolificID = request.body.prolificID;

  // used to get every record
  if (prolificID == "getAll"){
    const record = await collection.find({}).toArray();
    return res.json({ survey: record, sessionData: prolificID });
  }
  else {
    const record = await collection.findOne({ PID: prolificID });

    if (!record) {
      res.send({ survey: {}, sessionData: prolificID }).status(200);
    } else {
      const survey = record.survey;
      return res.json({ survey: survey, sessionData: prolificID });
    }
  }
});

// either add a new record or edit an existing one
router.patch("/", async (request, res) => {
  try {
    // data from fetch
    const data = request.body;
    const collection = await db.collection("survey-results");

    // get survey info and prolificID and store it in JSON
    const jsonData = data.surveyData;
    const prolificID = data.prolificID;
    const treatmentID = data.treatment;
    const isWithdrawn = data.withdrawn;
    const hasFeedback = data.feedback;
    const startDate = data.startDate;
    const endDate = data.endDate;
    const completed = data.complete;
    const surveyData = {
      PID: prolificID,
      survey: jsonData,
      treatment: treatmentID,
      start: startDate,
      end: endDate,
      complete: completed,
      withdrawn: isWithdrawn,
      feedback: hasFeedback,
    };

    var updateData = {};
    // we don't want to update the withdrawn status from the end page
    if (data.pageSource !== 'end') {
      updateData.$set = {
        survey: jsonData,
        treatment: treatmentID,
        end: endDate,
        complete: completed,
        feedback: hasFeedback,
        withdrawn: isWithdrawn,
    }
    }
    else{
      updateData.$set = {
        survey: jsonData,
        treatment: treatmentID,
        end: endDate,
        complete: completed,
        feedback: hasFeedback,
    } 
    }

    const p = await collection.findOne({ PID: prolificID });
    if (p) {
      const result = await collection.updateOne(
        { PID: prolificID },
        updateData
      );
      return result;
    } else {
      const result = await collection.insertOne(surveyData);
      res.send(result).status(200);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// GET is just used to choose a treatment
router.get("/", async (request, res) => {
  const treatments = ["camera", "proctor", "AI", "lockdown"];
  const treatmentMinCounts = {
    camera: 0,
    proctor: 0,
    AI: 0,
    lockdown: 0,
  };
  let minCount = Infinity;
  let minTreatment;

  try {
    const collection = await db.collection("survey-results");
    const results = await collection
      .aggregate([
        {
          $group: { _id: "$treatment", count: { $sum: 1 } },
        },
      ])
      .toArray();

    for (const treatment of treatments) {
      const count =
        results.find((result) => result._id === treatment)?.count ??
        treatmentMinCounts[treatment]; // Use result count if exists, otherwise use minimum count

      if (count < minCount) {
        minCount = count;
        minTreatment = treatment;
      }
    }

    return res.json({ treatment: minTreatment });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
