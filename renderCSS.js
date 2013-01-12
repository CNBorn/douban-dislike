
var loadOldDouban = function() {
  if (document.getElementById("old_douban")) return;
  var el = document.createElement("link");
  el.id = "old_douban";
  el.rel = "stylesheet";
  el.href = chrome.extension.getURL("old-douban.css");
  headEl = document.getElementsByTagName("head")[0];
  headEl.appendChild(el);
};

loadOldDouban();

