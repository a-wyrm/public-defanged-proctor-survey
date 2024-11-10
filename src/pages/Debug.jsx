import { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { FcExpand, FcNext } from "react-icons/fc";
import {FiCheckCircle, FiCircle } from "react-icons/fi";

import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import surveyJson from "../survey";
import TopBar from "../web-components/TopBar";


// cookie
import Cookies from "js-cookie";

// custom widgets
import { CameraConfirmationButton } from "../survey-components/ConfirmCamera";
import { TrackingConfirmationButton } from "../survey-components/ConfirmTracking";
import { ProctorConfirmationButton } from "../survey-components/ConfirmProctor";
import { ExamConfirmationButton } from "../survey-components/ExamConfirmationButton";
import { ExamNextButton } from "../survey-components/NextButton";
import { UninstallExtension } from "../survey-components/Uninstall";
import { GetArticle } from "../survey-components/ArticleButton";
import { ExamNextInstalledButton } from "../survey-components/InstalledNext";

const storageItemKey = "survey-data";
function saveSurveyData(survey) {
  const data = survey.data;
  data.pageNo = survey.currentPageNo;
  window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}

function makeVisible(survey){
  survey.pages.forEach(function(page) {
    page.visible = true;
  });
}


export default function Debug() {
  const survey = new Model(surveyJson);
  survey.setVariable("treatment", Cookies.get('treatment'));

  makeVisible(survey);

  // custom widgets
  ExamConfirmationButton(survey);
  TrackingConfirmationButton(survey);
  ProctorConfirmationButton(survey);
  CameraConfirmationButton(survey);
  ExamNextButton(survey);
  UninstallExtension(survey);
  GetArticle(survey);
  ExamNextInstalledButton(survey);

  const prevData = window.localStorage.getItem(storageItemKey) || null;


  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
    if (data.pageNo) {
      survey.currentPageNo = data.pageNo;
    }
  }
  survey.onValueChanged.add(saveSurveyData);

  
  const ResultBox = () => {
    const [data, setData] = useState(JSON.stringify(survey.data, null, " "));

    survey.onValueChanged.add((survey) => {
      setData(JSON.stringify(survey.data, null, " "));
    });

    useEffect(() => {
      setData(JSON.stringify(survey.data, null, " "));
    }, []);

    return (
      <div>
        <div className="whitespace-pre-wrap h-64 overflow-y-scroll p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {data}
        </div>
      </div>
    );
  };

  const Pages = () => {
    const [pages] = useState(survey.pages);
    const [curPage, setCurPage] = useState(survey.currentPage);

    survey.onValueChanged.add((survey) => {
      setCurPage(survey.currentPage);
      ExamNextButton(survey, setCurPage);
    });

    makeVisible(survey);

    return (
      <div>
        <ul className="dark:text-white text-sm ml-2">
          {pages
            .map((page) => (
              <button 
                onClick={() => {
                  survey.currentPageNo = page.num - 1;
                  setCurPage(survey.currentPage);
          
                }}
                className="my-2" key={page.name}> 

                {curPage === page ? (
                  <span style={{ display: 'flex', fontWeight: 'bold', color: 'rgb(73, 148, 236)'}} className="float-left mr-2">
                    <FiCheckCircle style={{ marginRight: '3px' }} /> 
                    <span style={{ position: 'relative', top: '-3px'}}>
                      {survey.pages.indexOf(page) + 1}-{page.name}
                    </span>
                  </span>
                ) : (
                  <span style={{ display: 'flex' }} className="float-left mr-2">
                    <FiCircle style={{ marginRight: '3px' }} /> 
                    <span style={{ position: 'relative', top: '-3px'}}>
                      {survey.pages.indexOf(page) + 1}-{page.name}
                    </span>
                  </span>
                )}
              </button>
            ))}
        </ul>
      </div>
    );
  };

  const Updates = () => {

    const [curPage, setCurPage] = useState(survey.currentPage);
    useEffect(() => {
      const pageChange = () => {
          setCurPage(survey.currentPage);
      };
      survey.onCurrentPageChanged.add(pageChange);
    });

    return(

          <><h6 className="flex text-lg py-4 dark:text-white">
        <span>Survey Info</span>
      </h6><div className="input-group input-group-sm mb-3 row-cols-3">
          <span
            className="input-group-text dark:text-white"
            id="debug-mode-survey-state dark:text-white"
          >
            Survey State
          </span>
          <input
            type="text"
            className="form-control col-2"
            value={survey.state}
            readOnly
            aria-label="Survey State"
            aria-describedby="debug-mode-survey-state" />
        </div><div className="input-group input-group-sm mb-3 row-cols-3">
          <span
            className="input-group-text dark:text-white"
            id="debug-mode-survey-currentPage"
          >
            Current Page
          </span>
          <input
            type="text"
            className="form-control col-2"
            value={curPage}
            readOnly
            aria-label="Survey State"
            aria-describedby="debug-mode-survey-currentPage" />
        </div></>

    );

  };

  const Consistency = () => {

    const [surveyData, setSurveyData] = useState([]);

    useEffect(() => {
  
      const cDataProlific = Cookies.get("prolificID");
      const GetAllData = async () => {
        try {
        const response = await fetch("/postsurvey", { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prolificID: cDataProlific,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSurveyData(data.survey);
      }
      catch (error) {
        console.log(error)
      }
      }

      
      GetAllData();
      const pageChange = async () => {
        const prevData = window.localStorage.getItem(storageItemKey);
        console.log("Prev data: ", JSON.parse(prevData));
      };
      survey.onCurrentPageChanged.add(pageChange);
    }, []);

    const compare = () => {

      const prevData = JSON.parse(window.localStorage.getItem(storageItemKey));

      console.log("Database data :" + JSON.stringify(surveyData));
      console.log("LocalStorage data :" + JSON.stringify(prevData));

      if (JSON.stringify(surveyData) == JSON.stringify(prevData) || (JSON.stringify(surveyData) == "{}" && JSON.stringify(prevData) == "null")) {

        console.log("same");

      } else {

        console.log("differing");

      }

    };

    return (
      <div>
        <button className="opt-out" onClick={compare}>
          Compare
        </button>
      </div>
    );

  };

  const Sidebar = () => {

    useEffect(() => {
      const togPage = () => {
        if (isPagesExpanded){
          togglePages();
        }
      };
      survey.onCurrentPageChanged.add(togPage);
    });
    
    // for dropdown menus
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const toggleNavigation = () => {
      setIsNavigationOpen(!isNavigationOpen);
    };
    const [isOperationsOpen, setIsOperationsOpen] = useState(false);
    const toggleOperations = () => {
      setIsOperationsOpen(!isOperationsOpen);
    };

    // next and previous page
    const nextPage = () => {
      survey.currentPageNo = survey.currentPageNo + 1;
    };
    const previousPage = () => {
      survey.currentPageNo = survey.currentPageNo - 1;

    };

    const clear = async () => {

      localStorage.clear();

      var toDelete = document.cookie.split(';');

      for( var i = 0; i < toDelete.length; i++){

        const pos = toDelete[i].indexOf('=');
        const name = pos > -1 ? toDelete[i].substring(0, pos) : toDelete[i];
        document.cookie = name + '=;expires=Tue, 02 Jun 2024 00:00:00 GMT';

      }

      window.location.reload();

    };

    const generation = () => {

      localStorage.clear();

      var chars = "abcdefghijklmnopqrstuvwxyz"

      const generateID = () => [...Array(6)].map(() => chars[Math.floor(Math.random() * 26)]).join('');

      const pid = generateID();
      const sid = generateID();
      const stid = generateID();

      window.location.href = `/?PROLIFIC_PID=${pid}&STUDY_ID=${stid}&SESSION_ID=${sid}`;

    };

    // survey operations
    const completeSurvey = () => {
      localStorage.setItem("finished","true");
      survey.doComplete();
    };
    const clearSurvey = () => {
      // Clear the survey and restart from the beginning
      if(isCollapsed){

        setIsCollapsed(!isCollapsed);

      }
      survey.clear(true, false);
      survey.deleteCookie();

    };
    const restartSurvey = () => {
      if(isCollapsed){

        setIsCollapsed(!isCollapsed);

      }

      survey.clear(true, true);
      survey.deleteCookie();
    };
    const [showInvisibleElements, setShowInvisibleElements] = useState(
      survey.showInvisibleElements
    );
    const toggleInvisibleElements = () => {
      setShowInvisibleElements(!showInvisibleElements);
    };

    const [isPagesExpanded, setIsPagesExpanded] = useState(false);
    const togglePages = () => {
      setIsPagesExpanded(!isPagesExpanded);
    };

    const [isCollapsed, setIsCollapsed] = useState(false);
    const handleClick = () => {
      setIsCollapsed(!isCollapsed);
    };

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
          withdrawn: WD,
          feedback: "",
        }),
      });
    }

    survey.onComplete.add (async (survey) => {
      const cDataProlific = Cookies.get("prolificID");
      const cDataTreatment = Cookies.get("treatment");
      const updatedData = survey.data;
      const WD = "false";
    
      SendToServer(updatedData, cDataProlific, cDataTreatment, WD);

      console.log("Survey is on the last page!");
      localStorage.removeItem("survey-data");
      window.location.href = "/end";

    });

    return (
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium list-outside">
            <li
              onClick={toggleNavigation}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="mr-2">
                
              </span>
              Navigation
            </li>
          </ul>
          {(
            <ul className="ml-4 text-sm list-inside">
              <li
                onClick={nextPage}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                Next Page
              </li>
              <li
                onClick={previousPage}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                Previous Page
              </li>
            </ul>
          )}

          <ul className="space-y-2 font-medium">
            <li
              onClick={toggleOperations}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="mr-2">
                {isOperationsOpen ? <FcExpand /> : <FcNext />}
              </span>
              Survey Operations
            </li>
          </ul>
          {isOperationsOpen && (
            <ul className="ml-4 text-sm">
              <li
                onClick={completeSurvey}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                Complete Survey
              </li>
              <li
                onClick={clearSurvey}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                Clear Survey
              </li>
              <li
                onClick={restartSurvey}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                Restart Survey
              </li>
              <li className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <label className="link-dark rounded">
                  <input
                    id="showInvisibleElementsButton"
                    type="checkbox"
                    className="btn-check"
                    checked={showInvisibleElements}
                    onChange={toggleInvisibleElements}
                  />
                  Show Invisible Elements
                </label>
              </li>
            </ul>
          )}
          <ul className="space-y-2 font-medium">
            <li
              onClick={togglePages}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="mr-2">
                {isPagesExpanded ? <FcExpand /> : <FcNext />}
              </span>
              Pages
            </li>
            {isPagesExpanded && <Pages />}
          </ul>

          <li
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleClick}
            aria-expanded={!isCollapsed}
          >
            <span className="mr-2">
              {isCollapsed ? <FcExpand /> : <FcNext />}
            </span>
            Survey Results
          </li>
          {isCollapsed && <ResultBox s />}

          <Updates s/>

          <br></br>

          <button className="opt-out" onClick={clear}>
            Reset Cookies & Storage
          </button>

          <br></br>
          <br></br>

          <button className="opt-out" onClick={generation}>
            Generate Survey ID
          </button>

          <br></br>
          <br></br>

          <Consistency ></Consistency>

        </div>
      </aside>
    );
  };

  return (
    <>
      <TopBar />

      <div>
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-end mx-auto p-4">
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                    Debug Mode
                  </span>
                </li>
                <li className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                <Link to="..">Leave Debug Mode</Link>
              </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="p-4 sm:ml-64">
          <Survey model={survey} />
        </div>
        <Sidebar />
      </div>
    </>
  );
}
