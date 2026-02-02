chrome.action.onClicked.addListener((tab) => {
  // Get the url from the active tab and encode it
  const targetUrl = tab.url ? encodeURIComponent(tab.url) : '';
  chrome.tabs.create({ url: `index.html?initialUrl=${targetUrl}` });
});
