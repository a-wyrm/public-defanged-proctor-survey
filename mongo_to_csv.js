// database
import db from "./server/db/connection.js";
import {Parser} from 'json2csv';
import fs from 'fs';

const collection = await db.collection("survey-results");

// replace with appropriate name
const outputFile = "prolific_survey_data.csv";

const results = await collection.find().toArray((err) => {
    if (err) {
        console.error(err);
        return;
    }
});

function flattenObject(obj, prefix = '') {
    const fieldsTop = [];
    const fieldsBottom = [];
    for (const key in obj) {
      const value = obj[key];
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        const nested = flattenObject(value, newPrefix);
        fieldsTop.push(...nested[0]); // Append field names from nested results
        fieldsBottom.push(...nested[1]); // Append string values from nested results
      } else {
        fieldsTop.push(newPrefix.toString());
        fieldsBottom.push(value.toString());
      }
    }
    return [fieldsTop, fieldsBottom];
}

const keys = [];
const values = [];
let rows = 0;

results.forEach((obj) => {
  for (const [key, value] of Object.entries(obj)) {
    if (key === "survey"){
        continue;
    }
    else{
      if (key === "_id"){

        rows = rows + 1;

      }
        keys.push(key);
        values.push(value);
    }
  }

});

const keys2 = Array.from({ length: rows }, () => []);
const values2 = Array.from({ length: rows }, () => []);

let ctr = 0;
let ctr2 = 0;

while (ctr < rows && ctr2 < keys.length) {

  let row = ctr;
  let col = ctr2 % (keys.length/rows);

  keys2[row].push(keys[ctr2]);
  values2[row].push(values[ctr2]);

  ctr2++;

  if (col === (keys.length/rows) - 1) {
    ctr++;
  }
}

const placeholder = [];

for(let i = 0; i < keys.length/rows; i++){

  placeholder[i] = " ";

}

fs.writeFileSync(outputFile,"");

for(let i = 0; i < rows; i++){

  const csvFields = flattenObject(results[i].survey);

  const csvParserTop = new Parser({ fields: csvFields[0], delimiter: ',' });
  const csvDataTop = csvParserTop.parse(results, (doc) => flattenObject(doc));
  const csvParserBottom = new Parser({ fields: csvFields[1], delimiter: ',' });
  const csvDataBottom= csvParserBottom.parse(results, (doc) => flattenObject(doc));

    if(i === 0){

      const topLine = `${keys2[i]},Survey Results:,${csvDataTop}`;
      const bottomLine = `${values2[i]}, ,${csvDataBottom}`;

      fs.appendFileSync(outputFile, topLine + "\n" + bottomLine);

    }
    else{

      const topLine = `${placeholder},Survey Results:,${csvDataTop}`;
      const bottomLine = `${values2[i]}, ,${csvDataBottom}`;

      fs.appendFileSync(outputFile, "\n" + topLine + "\n" + bottomLine);

    }

}


console.log(`Survey results exported to ${outputFile}`)
process.exit(0);