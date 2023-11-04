document.addEventListener("DOMContentLoaded", function () {
    const blockedWebsites = document.getElementById("blocked-websites");
    const newWebsiteInput = document.getElementById("new-website");
    const addWebsiteButton = document.getElementById("add-website");
  
    // Load blocked websites from storage and display them
    chrome.storage.sync.get("blockedWebsites", function (data) {
      if (data.blockedWebsites) {
        data.blockedWebsites.forEach(function (website) {
          const li = document.createElement("li");
          li.textContent = website;
          blockedWebsites.appendChild(li);
        });
      }
    });
  
    // Add a new blocked website
    addWebsiteButton.addEventListener("click", function () {
      const website = newWebsiteInput.value.trim();
      if (website) {
        chrome.storage.sync.get("blockedWebsites", function (data) {
          const blockedWebsites = data.blockedWebsites || [];
          blockedWebsites.push(website);
          chrome.storage.sync.set({ blockedWebsites }, function () {
            const li = document.createElement("li");
            li.textContent = website;
            blockedWebsites.appendChild(li);
            newWebsiteInput.value = "";
          });
        });
      }
    });
  });
  