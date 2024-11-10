// css
import "./App.css";
import "survey-core/defaultV2.min.css";
import gwusec_logo from "./assets/images/gwusec.svg";
import { useSearchParams } from "react-router-dom";

// Topbar
import TopBar from "./web-components/TopBar";

// Cookies
import { useState, useEffect } from "react";
import Cookies from "js-cookie";


const expireTime = import.meta.env.VITE_TIME_TO_EXPIRE;

// this function sets the expiration time of the localstorage
function setWithExpiry() {
	const now = new Date();
  const newTime = now.setDate(new Date().getDate() + expireTime);
  console.log(new Date(newTime));
	const item = {
		expiry: newTime,
	}
	localStorage.setItem("expire-time", JSON.stringify(item));
}


function setConditionals() {
  localStorage.setItem("turnOnCamera", "false");
  localStorage.setItem("turnOnLiveProctor", "false");
  localStorage.setItem("turnOnFaceTracking", "false");
}

const storageItemKey = "survey-data";

function checkStorage(){
  
  const prevData = window.localStorage.getItem(storageItemKey);
  const expireTime = localStorage.getItem("expire-time");

  if ( prevData != null || expireTime != null && Cookies.get('prolificID') != null) {
    window.location.href = "/survey";
  }
}
export default function App() {

  checkStorage();

  const [searchParams] = useSearchParams();
  const [prolificID, setProlificID] = useState(searchParams.get("PROLIFIC_PID") || "");
  const studyID = searchParams.get("STUDY_ID" || "");
  const sessionID = searchParams.get("SESSION_ID" || "");

  const [fetchData, setFetchData] = useState("");
  const [surveyVal, setSurveyData] = useState([]);
  // for disabling button
  const [isSubmitting, setIsSubmitting] = useState(true);

  // this useEffect checks if there's already data in the database
  useEffect(() => {
    const fetchData = async () => {

      const response = await fetch("/postsurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prolificID,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      setSurveyData(data.survey);
    };

    fetchData();
  }, []); // one time execute

  // this is used to set the treatment
  const getRequest = async () => {
    try {
      const response = await fetch("/postsurvey");
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const json = await response.json();
      setFetchData(json.treatment);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  getRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // prolific id in url
    const submittedProlificID = e.target.elements.prolificID.value;
    if (submittedProlificID != ""){
      setIsSubmitting(true);

      try {
        // set cookie
        Cookies.set("prolificID", submittedProlificID);
        Cookies.set("studyID", studyID);
        Cookies.set("sessionID", sessionID);
        Cookies.set("treatment", fetchData);
        
        // add expire date
        setWithExpiry();

        // add conditionals
        setConditionals();

        window.location.href = "/survey";

      } catch (error) {
        console.error("Error setting cookie:", error);
        // Handle any errors setting the cookie
      }
    }
    else {
      alert("Requires Prolific ID.")
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <TopBar />
      <div>
        <div className="px-4 py-5 my-5 text-center">
          <img
            className="mx-auto mb-4"
            src={gwusec_logo}
            alt=""
            width="72"
            height="57"
          ></img>
          <h1 className="display-5 fw-bold">Welcome to our Survey</h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">
              When you are ready please click the button below to start.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="id"
              >
                Prolific ID
              </label>
              <input
                className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="id"
                name="prolificID"
                value={prolificID}
                onChange={(e) => setProlificID(e.target.value)}
                readOnly
              />
            </div>
            <br />
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            {
            (Object.keys(surveyVal) != 0 || isSubmitting == false) ? "Your Prolific ID is invalid or your survey data is already collected." 
            :
            <button
                type="submit"
                className="bg-gw-primary-blue rounded px-8 py-4 mb-5 shadow-lg text-2xl font-extrabold text-white focus:outline-none focus:ring focus:ring-red-500"
              >
                Start Survey
              </button>
            }
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
