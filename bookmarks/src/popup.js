console.log('This is popup script - edit me!');

const BASE_URL = 'https://phf.net.au/external/';

function addClickEventListenerForElement(selector, handler) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.addEventListener('click', handler);
}

addClickEventListenerForElement('#postFromPage', onPostFromPageClicked);
addClickEventListenerForElement('#eventFromPage', onEventFromPageClicked);

function processResponse(resp, action) {
  console.log(`Got response: ${resp.status}`);
  if (resp.status > 399) {
    return { message: `Failed to create ${action}. Server returned ${resp.responseText}` };
  }
  const jsonResponse = JSON.parse(resp.responseText)
  console.log(`Response text: ${resp.responseText}`);
  return jsonResponse;
}

export function postData(data, action, callback = (result)=>alert(result.message)) {
  const request = new XMLHttpRequest();
  const baseUrl = `${BASE_URL}${action}`;
  request.open("post", baseUrl);
  request.send(JSON.stringify(data));
  request.onreadystatechange = function () {
    console.log(`request status: ${this.readyState}`);
    if (this.readyState === XMLHttpRequest.DONE) {
      const result = processResponse(this)
      callback(result)
    }
  }
}

function postMeta(data) {
  console.log("postMeta");
  postData(data, 'post');
}

export function postEvent(data) {
  console.log("postEventMeta");
  postData(data, 'event', (result) => { alert(result.message); window.close(); });
}

function eventMeta() {
  console.log("eventMeta");
  chrome.windows.getCurrent((win) => {
    const left = win.left + Math.round(win.width/2);
    const top =  win.top + Math.round(win.height/2);
    chrome.tabs.create({
      url: chrome.runtime.getURL('time_picker_dialog.html'),
      active: false
    }, function(tab) {
      // After the tab has been created, open a window to inject the tab
      chrome.windows.create({
        tabId: tab.id,
        type: 'popup',
        focused: true,
        height: 110,
        width: 225,
        top: top,
        left: left
        // incognito, top, left, ...
      });
    });
//    alert(`Left: ${left}; Top: ${top}`);
  });


//  postData(data, 'event');
}

export async function getCurrentTab() {
  let queryOptions = { active: true }; //, lastFocusedWindow: true
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function onPostFromPageClicked() {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, {text: 'report_metadata'}, postMeta);
}


async function onEventFromPageClicked() {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, {text: 'report_metadata'}, eventMeta);
}
