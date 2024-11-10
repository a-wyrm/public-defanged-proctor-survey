/*global chrome*/
import * as SurveyCore from "survey-core";

export function UninstallExtension(Survey) {
  const componentName = "uninstall_extension_button";
  const unactivateExtension = {
    // Unique name for the widget
    name: "uninstall_extension_button",

    // Check if the widget applies to the current question
    isFit: (question) => question.name === componentName,
    htmlTemplate:
      "<div style='height: 39px'>" +
      "<button type='button' id='uninstall_extension_button' class='bg-gw-primary-blue rounded px-8 py-4 mb-5 shadow-lg text-2xl font-extrabold text-white focus:outline-none focus:ring focus:ring-red-500'>Uninstall Extension</button>" +
      "&nbsp;&nbsp;" +
      "</div>" + 
      "<br><br>",

    afterRender: () => {
      const buttonCustom = document.getElementById("uninstall_extension_button");

      buttonCustom.addEventListener("click", function () {
        const extensionID = document.getElementById("GWSECExtensionID").textContent;
        chrome.runtime.sendMessage(extensionID, { greeting: "DeleteID" });
          localStorage.setItem("turnOnCamera", "false");
          localStorage.setItem("turnOnLiveProctor", "false");
          localStorage.setItem("turnOnFaceTracking", "false");
          window.location.reload();
      });
    },
  };
  SurveyCore.CustomWidgetCollection.Instance.addCustomWidget(
    unactivateExtension,
    "myCustomWidget"
  );
}