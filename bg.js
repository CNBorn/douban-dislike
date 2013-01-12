var updateTab = function(tab) {
  if (!/http(.+)douban\.com/.test(tab.url)) return;
  file = "renderCSS.js";
  chrome.tabs.executeScript(tab.id, {
    file : file,
    runAt: "document_start"
  }, function() {});
};

chrome.tabs.getAllInWindow(function(tabs) {
  tabs.forEach(updateTab);
});

chrome.extension.onMessage.addListener(function(req) {
  chrome.tabs.getAllInWindow(function(tabs) {
    tabs.forEach(updateTab);
  });
});

chrome.tabs.onUpdated.addListener(function(id, data, tab) {
  updateTab(tab);
});

