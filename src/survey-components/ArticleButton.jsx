
/*global chrome*/
import * as SurveyCore from "survey-core";
import Cookies from "js-cookie";

export function GetArticle(Survey) {
  const componentName = "get_article_button";
  const getArticle = {
    // Unique name for the widget
    name: "get_article_button",

    // Check if the widget applies to the current question
    isFit: (question) => question.name === componentName,
    htmlTemplate:
      "<div style='height: 39px'>" +
      "<button type='button' id='get_article_button' class='bg-gw-primary-blue rounded px-8 py-4 mb-5 shadow-lg text-2xl font-extrabold text-white focus:outline-none focus:ring focus:ring-red-500'>Show Article</button>" +
      "&nbsp;&nbsp;" +
      "</div>" + 
      "<br><br>",

    afterRender: () => {
      const buttonCustom = document.getElementById("get_article_button");
      buttonCustom.addEventListener("click", function () {

        if (document.getElementById("GWSECExtensionID")) {
          const extensionID = document.getElementById("GWSECExtensionID").textContent;
          chrome.runtime.sendMessage(extensionID, { greeting: "yes" });
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

              setTimeout(() => {

                Survey.isLastPage ? Survey.doComplete() : Survey.nextPage();
                document.getElementById('top-bar').scrollIntoView();

              }, 182000);

            }

          } else {
            alert("Please install the extension");
          } 

      });
    },
  };
  SurveyCore.CustomWidgetCollection.Instance.addCustomWidget(
    getArticle,
    "myCustomWidget"
  );
}