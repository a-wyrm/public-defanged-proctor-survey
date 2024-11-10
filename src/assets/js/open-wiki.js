// some good resources: https://stackoverflow.com/questions/26739774/passing-object-from-injected-page-script-to-content-script/26740141#26740141
// https://stackoverflow.com/questions/26140443/executing-code-at-page-level-from-background-js-and-returning-the-value/26141393#26141393
// https://stackoverflow.com/questions/26090563/sending-message-to-background-script/26095346#26095346

/*global chrome*/

function connectExternally(){
  var extensionID = document.getElementById("GWSECExtensionID");
  var text = extensionID.innerText;
  if(chrome && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(
      text,
      {greeting: "yes"}
    );

    document.querySelector('div.vector-body-before-content').remove();
  }
}