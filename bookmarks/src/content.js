
console.log('content is loaded!!!');

const eventHandlers = {
  report_metadata:  collectMetadata
}

function collectMetadata() {
  const metas = document.getElementsByTagName('meta');
  const metaData = [];
  console.log(metas);
  for (const meta of metas) {
    metaData.push({
      name: meta.name,
      property: meta.getAttribute('property'),
      itemprop: meta.getAttribute('itemprop'),
      content: meta.content,
    });
  }
  return metaData;
}

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponseCallback) {
  // If the received message has the expected format...
  const handler = eventHandlers[msg.text];
  if (!handler) {
    console.log(`not found event handler for ${msg.text}. Msg: ${JSON.stringify(msg)}`);
    return;
  }
  const callBackData = handler();
  console.log(JSON.stringify(callBackData));
  sendResponseCallback(callBackData);
});
