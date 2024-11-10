// database
import db from "./server/db/connection.js";
import readline  from "readline";
const collection = await db.collection("survey-results");

function confirmDelete(){
    const ask = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise (resolve => ask.question('Press [Y] to confirm: ', answer => {
        if (answer.toUpperCase() == 'Y'){
            resolve(true);
        }
        else {
            return false;
        }
    }));
}

async function deleteDB(){
    const ans = await confirmDelete();

    if (ans == true) {
        try {
            await collection.deleteMany();
            console.log("All data deleted.");

        }
        catch (error) {
            console.log("Error deleting data: ", error);
        }
    }
    else {
        console.log("Not deleted.")
    }
    process.exit(0);
}

deleteDB();