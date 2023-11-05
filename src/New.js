import React, { useState, useEffect } from 'react';
import './New.css';

function New() {
  const [websiteInput, setWebsiteInput] = useState('');
  const[timeinput,settimeinput]=useState(0);
  const [blockedWebsites, setBlockedWebsites] = useState([]);

  // Load the blocked websites from localStorage when the component mounts
  useEffect(() => {
    const storedBlockedWebsites = localStorage.getItem('blockedWebsites');
    if (storedBlockedWebsites) {
      setBlockedWebsites(JSON.parse(storedBlockedWebsites));
    }
  }, []);
  


     // Function to add websites to the JSON array
  const createBlockedWebsiteObject = async (website,id) => {


    // const response = await chrome.runtime.sendMessage({mess:'blockSite',website:website})
   
    // chrome.declarativeNetRequest.updateDynamicRules({
    //     addRules: {
    //       "id": id,
    //       "priority": 1,
    //       "action": { "type": "block" },
    //       "condition": { "urlFilter": website, "resourceTypes": ["main_frame"] }
    //     },
    //     removeRuleIds: [id]
    //   });



  };

  // Function to handle adding a website to the state
  const handleAddWebsite = async () => {
    if (websiteInput.trim() !== '') {
      
      setBlockedWebsites([...blockedWebsites, websiteInput]);
      setWebsiteInput('');
      const response = await chrome.runtime.sendMessage({mess:'blockSite',website:websiteInput})
    }

    setTimeout(() => {
        handleunblock();
    }, timeinput);
  };

  // Add websites from local storage to the JSON array
  const blockedWebsitesJSON = blockedWebsites.map((website, index) =>
    createBlockedWebsiteObject(website, index + 1)
  );

  // Function to handle saving changes to local storage
  const handleSaveBlockedWebsites = () => {
    localStorage.setItem('blockedWebsites', JSON.stringify(blockedWebsites));
  };
//   }, []);

 const handleunblock= async()=>{
    console.log('triggered');
    const res= await chrome.runtime.sendMessage({mess:'unblock',website:blockedWebsites})
   
 }

console.log(timeinput);

const text = "L U M I N A T E";
  const [displayText1, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isOn, setIsOn] = useState(false);
 const bg= isOn? 'black':'honeydew';
const col=isOn? 'white':'black';
  const handleToggle = () => {
    setIsOn((prevIsOn) => !prevIsOn);
  };

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setShowCursor(false);
      }
    }, 100);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

console.log(isOn);
  return (
    <div style={{ background: bg , color:col, transition:'0.6s' }}>


<div className="begin">

<div className="typed-text">{showCursor ? "" : null}<span style={{fontFamily:''}}>{displayText1}</span></div>
<div className="xyx">
      <label className="switch">
        <input type="checkbox" checked={isOn} onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
     
    </div>
    </div>
<hr/>


      {/* <div className='heading'>ATTENTION SEEKER</div> */}

      <div className='input2'>
        <input
          type="text"
          placeholder="Enter a website to block"
          className="custom-input"
          
          value={websiteInput}
        onChange={(e) => setWebsiteInput(e.target.value)}
        />
      </div>

    
       <div className='input2'>
        <input
          type="number"
          placeholder="Enter time period"
          className="custom-input"
        
          value={timeinput}
      onChange={(e)=> settimeinput(e.target.value)}

        />
      </div>
     

<div className='btn'>
      <button onClick={()=>{handleAddWebsite()}}>Block Website</button>
      
      </div>

      <div class="line-container">
    <div class="line1"></div>
    <div class="text-bh">Blocked Distracting Websites List</div>
    <div class="line2"></div>
  </div>


      <ul >
      {blockedWebsites.map((website) => (
          <li key={website}>{website}</li>
        ))}
      </ul>
      <div className='btn'>
      
      <button onClick={handleSaveBlockedWebsites}>Save Changes</button>
      </div>
      
      {/* <button onClick={handleSaveBlockedWebsites}>Save Changes</button> */}
   
    </div>
  );
}

export default New;
