const { postEvent, getCurrentTab } = require("./popup");

console.log('This is timepicker script');
console.log(`forms count: ${document.forms.length}. Would it subscribe?`);
if (document.forms.length>0) {
  document.forms[0].onsubmit = async function (e) {
    console.log('onsubmit called');
    e.preventDefault(); // Prevent submission
    const eventDateTime = document.getElementById('eventDateAndTime').value;
    console.log(`Entered date time: ${eventDateTime}`);
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { text: 'report_metadata', eventDateTime }, postEvent);
//    window.close();
  };

}
