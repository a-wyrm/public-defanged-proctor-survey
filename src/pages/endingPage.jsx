import TopBar from "../web-components/TopBar";
import gwusec_logo from "../assets/images/gwusec.svg";
import {useEffect, useState} from "react";
import { Model } from "survey-core";
import surveyJson from "../survey";

// cookie
import Cookies from "js-cookie";

const storageItemKey = "survey-data";

async function SendToServer(survey, FB){

  const cDataProlific = Cookies.get("prolificID");
  const cDataTreatment = Cookies.get("treatment");
  const updatedData = survey.data;
  const withdraw = "true";
  const endDate = Date();
  const hasCompleted = "true";

  await fetch("/postsurvey", { 
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prolificID: cDataProlific,
      surveyData: updatedData,
      treatment: cDataTreatment,
      endDate: endDate,
      withdrawn: withdraw,
      feedback: FB,
      complete: hasCompleted,
      pageSource: "end",
    }),
  });
}  

const prolificLink = import.meta.env.VITE_PROLIFIC_LINK;


export default function EndingPage() {

  const survey = new Model(surveyJson);
  const prevData = window.localStorage.getItem(storageItemKey);
  const data = JSON.parse(prevData);
  survey.data = data;

  const [feedback, setFeedback] = useState("");

  
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(() => {

      const submitted = localStorage.getItem('isSubmitted');
      return submitted !== null ? JSON.parse(submitted) : false;

    });

    const [showPage, setShowPage] = useState(false);

    useEffect(() => {

      const finished = localStorage.getItem("finished");

      if(finished == "true"){

        setShowPage(true);

      }
      else{

        window.location.href = "/survey";

      }
      
      localStorage.setItem('isSubmitted', JSON.stringify(feedbackSubmitted));

    });
  
    const handleFeedbackChange = (event) => {
      setFeedback(event.target.value);
    };
  
    const submitFeedback = () => {
      setFeedbackSubmitted(true);
      SendToServer(survey, feedback);
    };
  

  const backtoProlific = () => {
    SendToServer(survey, feedback);
    localStorage.removeItem("survey-data");
    Cookies.remove('prolificID');
    Cookies.remove('treatment');
    window.location.href = prolificLink;
  }

  return (
    
    <>
      <div>
        <TopBar />
        <div className="px-4 py-5 my-5 text-center">
          <img
            className="mx-auto mb-4"
            src={gwusec_logo}
            alt=""
            width="72"
            height="57"
          ></img>
          <div className="container mx-auto px-4 py-8">
        {!feedbackSubmitted && (
          <div className="card shadow-md rounded-lg bg-gray-100">
            <div className="card-header bg-secondary text-black font-bold text-center rounded-t-lg pt-3">
              Please provide any thoughts or suggestions on the survey. (Optional)
            </div>
            <div className="card-body px-4 py-6">
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Feedback"
                placeholder="Type your feedback here"
                rows="3"
                value={feedback}
                onChange={handleFeedbackChange}
              />
            </div>
            <div className="card-footer flex justify-center py-4">
              <button
                type="button"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
                onClick={submitFeedback}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>
        </div>
        <div className="">
          <h4 className="endPageTop">Thank you for participating in this survey!</h4>
          <p className="endPageBottom">Please click the button below to complete the study and return to Prolific.</p>

          <div className="flex flex-col items-center py-6">
              <button
                onClick={backtoProlific}
                className="bg-gw-primary-blue rounded px-8 py-4 mb-5 shadow-lg text-2xl font-extrabold text-white focus:outline-none focus:ring focus:ring-red-500"
              >
                Return To Prolific
              </button>
          </div>
        
        </div>

      </div>
    </>
  );
}