var conditional = 'none';
var isDone = false;

// get condition
chrome.runtime.onMessageExternal.addListener(function (
  request,
  s,
  sendResponse
) {
  if (request.greeting == "yes") {
    var newURL = "https://en.wikipedia.org/wiki/Garden_Peach";
    chrome.tabs.create({ url: newURL });

    //timer
    var countDownDate = new Date(new Date().getTime() + 182000).getTime();

      chrome.tabs.onUpdated.addListener(function(tabId, info) {
        if (info.status === 'complete') {
          chrome.tabs.executeScript(tabId, {
            file: "./js/wiki-injector.js",
          });
        }


        // Update the count down every 1 second
        var x = setInterval(function () {
          // Get today's date and time
          var now = new Date().getTime();
    
          // Find the distance between now and the count down date
          var distance = countDownDate - now;
    
          // Time calculations for days, hours, minutes and seconds
          var minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
          // If the count down is over, write some text
          if (distance < 0 && isDone == false) {
            _removeTab(tabId);
            isDone = true;
            return;
          }
        }, 1000);
        return;
      });


  } else if (request.greeting == "DeleteID") {
    chrome.management.uninstallSelf();
  }
  else if (request.greeting == "treatment") {
    conditional = request.type;
    _init();
  }
  sendResponse({farewell: "goodbye"});
});

var isRunning = false;
var MODE_ON = chrome.i18n.getMessage('modeOn') || 'on';
var mode = MODE_ON;

var usedOn: any = {};
var openedOn: any = {};
var accessed: any = {};
var activeTabId;
var timeout: any;
var tabs: any;
var activeInterval = 2500;

function _markActive(tabId: number) {
  usedOn[tabId] = new Date().getTime();
  accessed[tabId] += 1;
}

function _handleTabActivated(data: any) {
  
  var tabId = data.tabId;
  activeTabId = tabId;
  clearTimeout(timeout);

  // after 3 seconds mark this tab as active
  // this is so if you are quickly switching tabs
  // they are not considered active
  timeout = setTimeout(function () {
    _markActive(tabId);
  }, activeInterval);
}

function _handleTabRemoved(tabId: any) {
  clearTimeout(timeout);

  // _debug('removedTab', tabId);
  delete usedOn[tabId];
  delete openedOn[tabId];
  delete accessed[tabId];
}

function _handleTabReplaced(newTabId: any, oldTabId: any) {
  if (usedOn[oldTabId]) {
    usedOn[newTabId] = usedOn[oldTabId];
  }

  if (openedOn[oldTabId]) {
    openedOn[newTabId] = openedOn[oldTabId];
  }

  if (accessed[oldTabId]) {
    accessed[newTabId] = accessed[oldTabId];
  }

  delete usedOn[oldTabId];
  delete openedOn[oldTabId];
  delete accessed[oldTabId];
}

function _removeTab(tabId: any) {
  if (tabId) {
    chrome.tabs.remove(tabId, function () {});
  }
}

function openWikiArticle(tabId, info){
  if (info.status === "complete") {
    chrome.tabs.executeScript(
      tabId,
      {
        code: "var config = 1;",
      },
      function () {
        chrome.tabs.executeScript(tabId, {
          file: "./js/wiki-injector.js",
        });
      }
    );

    var countDownDate = new Date(
      new Date().getTime() + 182000
    ).getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // If the count down is over, write some text
      if (distance < 0) {
        _removeTab(tabId);
      }
    }, 1000);
    return;
  }
}

function _handleTabAdded(data: any) {
  
  chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === "complete" && conditional != 'none') {
      chrome.tabs.query({}, function (tabs) {
        if (
          tabs.length <= 2 &&
          tabs[1].url == "https://en.wikipedia.org/wiki/Garden_Peach"
        ) 
        {
          openWikiArticle(tabId, info);
        } 
        else {
          _removeTab(tabId);
        }
      });
    }
  });
}

function _removeWindow(windowId: any) {
  if (windowId) {
    chrome.windows.remove(windowId, function () {});
  }
}

function _removeWindows() {
  var curId;
  chrome.windows.getCurrent({}, function (window: any) {
    curId = window.id;
  });

  chrome.windows.getAll({}, function (windows: any) {
    for (var i = 0; i < windows.length; i++) {
      if (windows[i].id != curId) {
        chrome.windows.remove(windows[i].id);
      }
    }
  });
}

function _getTabs() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({}, function (tabs) {
        resolve(tabs);
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function _checkTabs() {
  tabs = await _getTabs();
  var onTest = false;
  for (var i = 0; i < tabs.length; i++) {
    // tabs[i].url?.substring(0, 16) == "https://nets.gwu" 
    if (tabs[i].url?.substring(0, 16) == "http://localhost") onTest = true;
  }
  return onTest;
}

function _removeTabs() {
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      // tabs[i].url?.substring(0, 16) != "https://nets.gwu" || 
      if (tabs[i].url?.substring(0, 16) != "http://localhost") {
        if (
          confirm(
            'Click "OK" to close tab at ' +
              tabs[i].url +
              ". \nThis extension requires that all non-survey tabs are closed."
          )
        ) {
          _removeTab(tabs[i].id);
        } else {
          alert(
            "Chrome extension is disabling itself. Please reenable to complete survey."
          );
          chrome.management.setEnabled(chrome.runtime.id, false);
        }
      }
    }
  });
}

function _handleWindowAdded(data: any) {
  var winId = data.id || data;
  _removeWindow(winId);
}

// CAMERA
function _updateTab(tabId) {
  chrome.tabs.get(tabId, function (tab) {
    if (isRunning && activeTabId && conditional == "camera") {
      activeTabId = tabId;
      _startWp(activeTabId);
    }
    if (isRunning && activeTabId && conditional == "proctor") {
      activeTabId = tabId;
      _startProctor(activeTabId);
    }
    if (isRunning && activeTabId && conditional == "AI") {
      activeTabId = tabId;
      _startAI(activeTabId);
    }
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo && changeInfo.status === 'complete') {
    _updateTab(tabId);
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  var tabId = activeInfo.tabId;

  chrome.storage.sync.get({
    trackTabs: true
  }, function (settings) {
    if (settings.trackTabs) {
      _updateTab(tabId);
    }
  });
});

// Start up camera
function _startWp (tabId) {
  chrome.tabs.insertCSS(tabId, { file: "./css/styles.css" });
  chrome.tabs.executeScript(tabId, { file: "./js/camera/camera.js" });
  chrome.tabs.executeScript(tabId, { file: "./js/camera/start.js" });

  isRunning = true;
}

// START UP PROCTOR
function _startProctor(tabId) {
  chrome.tabs.insertCSS(tabId, { file: "./css/styles.css" });
  chrome.tabs.executeScript(tabId, { file: "./js/proctor/proctor.js" });
  chrome.tabs.executeScript(tabId, { file: "./js/proctor/startP.js" });

  isRunning = true;
}

// START UP AI
function _startAI(tabId) {
  chrome.tabs.insertCSS(tabId, { file: "./css/styles.css" });
  chrome.tabs.executeScript(tabId, { file: "./js/AI/AI.js" });
  chrome.tabs.executeScript(tabId, { file: "./js/AI/startAI.js" });

  isRunning = true;
}

function _bindEvents(tabId) {
  if (conditional != 'none'){
    //chrome.tabs.onActivated.addListener(_handleTabActivated);
    //chrome.tabs.onCreated.addListener(_handleTabAdded);
    //chrome.tabs.onAttached.addListener(_handleTabAdded);
    //chrome.tabs.onRemoved.addListener(_handleTabRemoved);
    //chrome.tabs.onDetached.addListener(_handleTabRemoved);
    //chrome.tabs.onReplaced.addListener(_handleTabReplaced);
    //chrome.windows.onCreated.addListener(_handleWindowAdded);

    if (conditional == 'camera') {
      activeTabId = tabId.id;
      _startWp(activeTabId);
    }
    if (conditional == 'proctor') {
      activeTabId = tabId.id;
      _startProctor(activeTabId);
    }
    if (conditional == 'AI') {
      activeTabId = tabId.id;
      _startAI(activeTabId);
    }
  }
}

async function _init() {
  var testOpen = await _checkTabs();
  if (testOpen) {
    tabs = await _getTabs();
    //_removeTabs();
    //_removeWindows();
    _bindEvents(tabs[0]);
  } else {
    alert("Must open survey at http://localhost");
    alert(
      "Chrome extension is disabling itself. Please reenable to complete survey."
    );
    chrome.management.setEnabled(chrome.runtime.id, false);
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("Extension is turned ON");
});
