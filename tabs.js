function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById('tabs-list');
    let currentTabs = document.createDocumentFragment();
    let limit = 5; // change max tab limit here
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

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

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
});

function massDelete() {
    var blacklist = ["4chan.org", "twitch.tv"]; // load this from file or somethhing

    // line 55 is a condition that determine what tabs will be pulled into the 'tabs' variable
    browser.tabs.query({
      currentWindow: true
    }).then((tabs) => {
      for (var tab of tabs) {
        blacklist.forEach(function(site) {
          if (tab.url.indexOf(site) !== -1) {
            browser.tabs.remove(tab.id);
          }
        });
      }
    });
  }

  e.preventDefault();

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  c4onsole.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});