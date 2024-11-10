import * as SurveyCore from "survey-core";
import Cookies from "js-cookie";

export function ExamNextInstalledButton(Survey) {
  const componentName = "exam_next_installed_button";
  const goNextIf = {
    // Unique name for the widget
    name: "exam_next_installed_button",

    // Check if the widget applies to the current question
    isFit: (question) => question.name === componentName,
    htmlTemplate:
      "<div style='height: 39px'>" +
      "<button type='button' id='exam_next_installed_button' class='bg-gw-primary-blue rounded px-8 py-4 mb-5 shadow-lg text-2xl font-extrabold text-white focus:outline-none focus:ring focus:ring-red-500'></button>" +
      "&nbsp;&nbsp;" +
      "</div>",

    afterRender: () => {
      const buttonCustom = document.getElementById("exam_next_installed_button");
      {
        Survey.isLastPage
          ? (buttonCustom.innerText = "Complete")
          : (buttonCustom.innerText = "Next");
      }

      buttonCustom.addEventListener("click", async function () {
        {
          if (document.getElementById("GWSECExtensionID")) {
            if(Cookies.get('treatment') == "none"){
                
              Survey.isLastPage ? Survey.completeLastPage() : Survey.nextPage();
              document.getElementById('top-bar').scrollIntoView(); 
              return;
              
            }
            else{
              try{

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                const tracks = stream.getTracks();

                const hasAudio = tracks.some(track => track.kind === 'audio');
                const hasVideo = tracks.some(track => track.kind === 'video');

                if(Cookies.get('treatment') == "camera"){
                    if(hasAudio && hasVideo){
                      Survey.isLastPage ? Survey.completeLastPage() : Survey.nextPage();
                      document.getElementById('top-bar').scrollIntoView(); 
                    }
                    else{
                      alert("Please make sure the camera and/or microphone is enabled.");
                    }
                }
                if(Cookies.get('treatment') == "proctor"){
                  if(hasAudio && hasVideo){
                    Survey.isLastPage ? Survey.completeLastPage() : Survey.nextPage();
                    document.getElementById('top-bar').scrollIntoView(); 
                  }
                  else{
                    alert("Please make sure the camera and/or microphone is enabled.");
                  }
                }
                if(Cookies.get('treatment') == "lockdown"){
                  
                  Survey.isLastPage ? Survey.completeLastPage() : Survey.nextPage();
                  document.getElementById('top-bar').scrollIntoView(); 
                  
                }
                if(Cookies.get('treatment') == "AI"){
                  if(hasAudio && hasVideo){
                    Survey.isLastPage ? Survey.completeLastPage() : Survey.nextPage();
                    document.getElementById('top-bar').scrollIntoView(); 
                  }
                  else{

                    alert("Please make sure the camera and/or microphone is enabled.");

                  }
                  
                }
                else{

                  const localCheck = window.localStorage.getItem("expire-time");
                  const cookieCheck = Cookies.get('treatment');

                  if(localCheck == null){

                    alert("Error with localstorage corrupted. Please return to prolific and reclick the survey link");

                    localStorage.clear();
                    window.location.reload();
                    window.location.href = "/";

                  }
                  else if(cookieCheck == null){
                    alert("Error with cookie corrupted. Please return to prolific and reclick the survey link");
                    localStorage.clear();
                    window.location.reload();
                    window.location.href = "/";
                  }

                }
              }
              catch{
                console.log("error");
              }
            }
          } else {
            alert("Please install the extension and refresh this page.");
          } 
        }
      });
    },
  };
  SurveyCore.CustomWidgetCollection.Instance.addCustomWidget(
    goNextIf,
    "myCustomWidget"
  );
}