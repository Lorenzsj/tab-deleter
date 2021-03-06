/* the following two functions are for debugging and aren't necessary */
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
        tabLink.classList.add('debug-tabs');
        currentTabs.appendChild(tabLink);
      }

      counter += 1;
    }

    tabsList.appendChild(currentTabs);
  });
}

// below will load listTabs() everytime the plugin is opened
// document.addEventListener("DOMContentLoaded", listTabs);

// handle click events in plugin box
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
}, false);

// todo: produce a better token for the substring match in mass delete
// todo: make this function cleaner and better
// note: there is a problem with adding www. to links
function getBlacklist() {
  // get list from plugin field
  var field = document.getElementById("blacklist-input").value;
  var blacklist = [];

  if (field) {
    // separate on commas
    var list = field.split(',');

    // pattern for url validity
    // todo: make pattern better
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    for (var i = 0; i < list.length; i++) {
      if (list[i].match(regex)) {
        blacklist.push(list[i].trim()); // remove trailing whitspace
      }
    }

    return blacklist;
  }
  else {
    return blacklist;
  }
}

function massDelete() {
  var blacklist = getBlacklist();
  
  if (blacklist) {
    // get all tabs that are in the current window of firefox
    browser.tabs.query({
      currentWindow: true
    }).then((tabs) => {
      // go through all tabs
      for (var tab of tabs) {
        // check if the current tab has a substring from the blacklist array
        // the some loop will short-circuit if a match is found
        blacklist.some(function(site) {
          if (tab.url.indexOf(site) !== -1) {
            browser.tabs.remove(tab.id); // kill the tab if the substring is found
            return true;
          }
          else {
            console.log(tab.url + " does not contain " + site);
          }
        });
      }
    });
  }
}

// onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});