// survey info
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import surveyJson from "../survey";
import {useRef, useState} from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// cookie
import Cookies from "js-cookie";

// other components
import TopBar from "../web-components/TopBar";

// custom widgets
import { CameraConfirmationButton } from "../survey-components/ConfirmCamera";
import { TrackingConfirmationButton } from "../survey-components/ConfirmTracking";
import { ProctorConfirmationButton } from "../survey-components/ConfirmProctor";
import { ExamConfirmationButton } from "../survey-components/ExamConfirmationButton";
import { ExamNextButton } from "../survey-components/NextButton";
import { UninstallExtension } from "../survey-components/Uninstall";
import { GetArticle } from "../survey-components/ArticleButton";
import { ExamNextInstalledButton } from "../survey-components/InstalledNext";


// good resource: https://github.com/mongodb-developer/mern-stack-example/

const storageItemKey = "survey-data";
const currentDate = Date();
function saveSurveyData(survey) {
  const data = survey.data;
  data.pageNo = survey.currentPageNo;
  window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}


async function SendToServer(surveyData, prolific, T, WD){

  await fetch("/postsurvey", { 
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prolificID: prolific,
      surveyData: surveyData,
      treatment: T,
      startDate: currentDate,
      withdrawn: WD,
      feedback: "",
    }),
  });
}


const OptOutButton = ({handleWithdrawSurvey}) => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const handleCloseSurvey = () => {

    localStorage.setItem("finished", "true");
    setIsSurveyOpen(!isSurveyOpen);

  };

  return (
    <nav >
      <div className="topnav">
        <div className="topnav-right">
          <Dialog
            open={isSurveyOpen}
            onClose={handleCloseSurvey}
            aria-labelledby="withdrawDialogTitle"
            aria-describedby="withdrawDialogDescription"
          >
            <DialogTitle id="withdrawDialogTitle">Are you sure you want to withdraw from the survey?</DialogTitle>
            <DialogContent>
              <DialogContentText id="withdrawDialogDescription">
                If you choose to withdraw, your responses will <strong>not be saved</strong>, and any partial progress will be lost.
                This action cannot be undone, and you may <strong>not be eligible for compensation</strong> if you haven&apos;t completed the survey.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button
                onClick={handleCloseSurvey}
                type="button"
                className="buttonSuccess"
              >
                No, take me back
              </button>
              <button
                onClick={() => {
                  handleCloseSurvey();
                  handleWithdrawSurvey();
                }}
                type="button"
                className="buttonDanger"
              >
                Yes, I want to withdraw
              </button>
            </DialogActions>
          </Dialog>
          <button style={{ marginTop: '1%' }} className="opt-out" onClick={handleCloseSurvey}>
            Opt-Out
          </button>
        </div>
      </div>
    </nav>
  );
};


function getWithExpiry() {

	const itemStr = localStorage.getItem("expire-time")
	const item = JSON.parse(itemStr);
  
	const now = new Date();

	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		localStorage.removeItem("survey-data");
    localStorage.removeItem("expire-date");
		window.location.href = window.history.back();
	}
}

function checkStorage(){
  const itemStr = localStorage.getItem("expire-time");
  
  if ( itemStr == null) {
    window.location.href = window.history.back();
  }
}


export default function SurveyPage() {

  // check if we have storage
  checkStorage();

  // check if we're expired
  getWithExpiry();

  var survey = new Model(surveyJson);
  survey.setVariable("treatment", Cookies.get('treatment'));

  // set survey treatment
  const surveyTreatment = Cookies.get("treatment");
  survey.setVariable("surveyTreatment", surveyTreatment);


  survey.onValueChanged.add(saveSurveyData);
  survey.onCurrentPageChanged.add(saveSurveyData);

  // custom widgets
  ExamConfirmationButton(survey);
  CameraConfirmationButton(survey);
  TrackingConfirmationButton(survey);
  ProctorConfirmationButton(survey);
  ExamNextButton(survey);
  UninstallExtension(survey);
  GetArticle(survey);
  ExamNextInstalledButton(survey);

  // Restore survey results
  const prevData = window.localStorage.getItem(storageItemKey);
  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
    if (data.pageNo) {
      survey.currentPageNo = data.pageNo;
    }
  }

  const handleWithdrawSurvey = () => {
    const cDataProlific = Cookies.get("prolificID");
      const cDataTreatment = Cookies.get("treatment");
      const updatedData = survey.data;
      updatedData.pageNo = survey.currentPageNo;
      const WD = "true";
      
      SendToServer(updatedData, cDataProlific, cDataTreatment, WD);
    survey.doComplete();
  };

  survey.onCurrentPageChanged.add( async (survey) => {
      const cDataProlific = Cookies.get("prolificID");
      const cDataTreatment = Cookies.get("treatment");
      const updatedData = survey.data;
      updatedData.pageNo = survey.currentPageNo;
      const WD = "false";
      SendToServer(updatedData, cDataProlific, cDataTreatment, WD);
      getWithExpiry();
      
    });

    // gotta do it this way to actually send to the survey, yes it's annoying
    survey.onComplete.add (async (survey) => {
        const cDataProlific = Cookies.get("prolificID");
        const cDataTreatment = Cookies.get("treatment");
        const updatedData = survey.data;
        const WD = "false";
      
        SendToServer(updatedData, cDataProlific, cDataTreatment, WD);

        console.log("Survey is on the last page!");
        window.location.href = "/end";

      });

    const surveyRef = useRef(survey);
  return (
    <>
      <div>
        <TopBar />
        <div className="static">
          <OptOutButton surveyRef={surveyRef} handleWithdrawSurvey={handleWithdrawSurvey} />
        </div>
      </div>
      <Survey model={survey} ref={surveyRef} />
    </>
  );
}