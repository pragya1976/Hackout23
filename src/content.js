chrome.storage.sync.get("blockedWebsites", function (data) {
    const blockedWebsites = data.blockedWebsites || [];
  
    // Redirect to a blocked page if the current URL matches a blocked website
    if (blockedWebsites.some(website => location.href.includes(website))) {
      location.href = "blocked.html";
    }
  });
  
  