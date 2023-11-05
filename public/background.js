// importScripts(chrome.runtime.getURL('./contentscript.js'));

// import { declarativeNetRequest } from 'declarative-net-request';

// // Get the websites and blocking times from the React app.
// const websiteUrls = window.electronAPI.getBlockedWebsites();
// const blockingTimes = window.electronAPI.getBlockingTimes();

// // Create a list of Declarative Net Request rules.
// const rules = websiteUrls.map((websiteUrl, index) => ({
//   id: index,
//   priority: index,
//   action: {
//     type: 'block',
//     duration: blockingTimes[websiteUrls.indexOf(websiteUrl)] // in seconds
//   },
//   condition: {
//     urlPatterns: [websiteUrl]
//   }
// }));

// // Set the Declarative Net Request rules.
// declarativeNetRequest.setRules(rules);

// console.log("start");
// throw new Error("lol");
// console.log("end");

// import { declarativeNetRequest } from 'chrome-extension';



function getBlockedWebsites() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('blockedWebsites', (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.blockedWebsites);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
  if(request.console){
    console.log(request.content)
}
  if(request.mess==='unblock'){
    console.log("unblock message received")
    console.log(request.website);
    chrome.declarativeNetRequest.getDynamicRules()
    .then((oldRules)=>{
      const oldRuleIds = oldRules.map(rule=>rule.id)
      // for(const web in request.website){
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: oldRuleIds,
        })
        .then((res)=>{
          console.log("unblocking done?")
          sendResponse({mess:"Unblocked the sites"})
        })
      })
      .catch((err)=>{
        console.log("Error in unblocking: "+err)
      })
  // }
      return true
  }


});




chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{


 if(request.console){
      console.log(request.content)
  }

  if(request.mess==='blockSite'){
    console.log("message received")
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        "id": Math.floor(Math.random()*10000),
        "priority": 1,
        "action": { "type": "block" },
        "condition": { "urlFilter": request.website, "resourceTypes": ["main_frame"] }
      }],
      // removeRuleIds: [tempId]
    });
   
      console.log("returning response from background.js")
        sendResponse({message:`${request.website} blocked!`})
      return true
  }

  

});

function updateRules() {
  console.log("HERE")
  chrome.declarativeNetRequest.getDynamicRules().then((myData)=>{
    console.log("promise done")
    console.log(myData)
    console.log(typeof myData)
  })
  // console.log(chrome.declarativeNetRequest.updateRules)
  // console.log(chrome.declarativeNetRequest.updateStaticRules)
  getBlockedWebsites()
    .then((blockedWebsites) => {
      console.log("blocked sites promise done")
      console.log(blockedWebsites)
      const blockRule = {
        condition: 
          {
            urlFilter: blockedWebsites
          }
        ,
        action: 
          {
            type: 'block'
          }
        ,
        id: Math.floor(Math.random()*10000)
      };

      chrome.declarativeNetRequest.updateSessionRules({
        addRules: [blockRule]
      });

      // Listen for changes to the user's preferences.
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.blockedWebsites) {
          // Update the declarative net request rule with the new blocked websites.
          getBlockedWebsites()
            .then((newBlockedWebsites) => {
              
              const updatedBlockRule = {
                condition: 
                  {
                    urlFilter: newBlockedWebsites
                  }
                ,
                action: 
                  {
                    type: 'block'
                  }
                ,
                id: tempId++
              };

              chrome.declarativeNetRequest.updateSessionRules({
                updateRules: [updatedBlockRule]
              });
            })
            .catch((error) => {
              console.error('Error retrieving new blocked websites:', error);
            });
        }
      });
    })
    .catch((error) => {
      console.error('Error retrieving blocked websites:', error);
    });
}

updateRules();
