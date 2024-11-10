import * as SurveyCore from "survey-core";
import Cookies from "js-cookie";
/*global chrome*/

export function CameraConfirmationButton(Survey) {
  const componentName = "confirm_camera";
  const activateCamera = {
    // Unique name for the widget
    name: "confirm_camera",

    // Check if the widget applies to the current question
    isFit: (question) => question.name === componentName,
    htmlTemplate:
      "<div>" +
      "<button type='button' id='confirm_camera' class='bg-gw-primary-blue rounded px-8 py-4 mb-5 shadow-lg text-2xl font-extrabold text-white focus:outline-none focus:ring focus:ring-red-500'> Confirm Camera Permissions </button>" +
      "&nbsp;&nbsp;" +
      "</div>",

    afterRender: () => {
      const buttonCustom = document.getElementById("confirm_camera");

      function setVar () {
        localStorage.setItem("turnOnCamera", "true");
      }

      buttonCustom.addEventListener("click", async function () {

        if (document.getElementById("GWSECExtensionID")) {
          if (Cookies.get('treatment') == "camera"){
            try {
               // Request microphone access using navigator.mediaDevices.getUserMedia
               const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true});
               // Close the stream immediately as permission is confirmed
               stream.getTracks().forEach((track) => track.stop());
               setVar();

               const extensionID = document.getElementById("GWSECExtensionID").textContent;
               chrome.runtime.sendMessage(extensionID, {greeting: "treatment", type: "camera" },
                (response) => {
                  console.log("Response from extension:", response);
                }
               );
               
               window.location.reload();
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
                else{

                  Survey.isLastPage ? Survey.doComplete() : Survey.nextPage();
                  document.getElementById('top-bar').scrollIntoView(); 

                }
            } catch (error) {

              console.error("microphone permission denied: ", error);
              alert("Please make sure you install the extension and have access to a camera & microphone, refresh the page once ready");
              window.location.reload();
            }
          }
        } else {
          alert("Please install the extension");
        } 
      });
    },
  };
  SurveyCore.CustomWidgetCollection.Instance.addCustomWidget(
    activateCamera,
    "myCustomWidget"
  );
}