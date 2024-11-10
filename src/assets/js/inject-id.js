
var extensionID = chrome.runtime.id;
var div = document.createElement("div");
document.body.appendChild(div);
div.setAttribute("id", "GWSECExtensionID");
div.innerText=extensionID;
div.style.display = 'none';
