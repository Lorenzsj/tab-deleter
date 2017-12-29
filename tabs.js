function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById('tabs-list');
    let currentTabs = document.createDocumentFragment();
    let limit = tabs.length; // change max list tab limit here
    let counter = 0;

    tabsList.textContent = '';

    for (let tab of tabs) {
      if (counter <= limit) {
        let tabLink = document.createElement('a');

        tabLink.textContent = tab.title || tab.id;
        tabLink.classList.add('switch-tabs');
        currentTabs.appendChild(tabLink);
      }

      counter += 1;
    }

    tabsList.appendChild(currentTabs);
  });
}

/* this will load the tab list everytime the plugin is opened */
document.addEventListener("DOMContentLoaded", listTabs);

/* handle click events in plugin box */
document.addEventListener("click", (e) => {
  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (var tab of tabs) {
        if (tab.active) {
          callback(tab, tabs);
        }
      }
    });
  }

  if (e.target.id === "tabs-remove") {
    massDelete();
  }

  e.preventDefault();
});

function massDelete() {
  var blacklist = ["google.com", "bing.com", "yahoo.com"]; // load this from file or somethhing

  /* get all tabs that are in the current window of firefox */
  browser.tabs.query({
    currentWindow: true
  }).then((tabs) => {
    /* go through all tabs */
    for (var tab of tabs) {
      /* check if the current tab has a substring from the blacklist array */
      blacklist.forEach(function(site) {
        if (tab.url.indexOf(site) !== -1) {
          browser.tabs.remove(tab.id); /* kill the tab if it does */
        }
      });
    }
  });
}

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  c4onsole.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});