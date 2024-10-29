import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import ThankYouPage from './pages/thankyouPage';
import Map from './Map';
import axios from 'axios';
import { linspace, getClosestValues } from './utils/functions';
import ScenarioPage2 from './pages/ScenarioPage2';
import ScenarioPage1 from './pages/ScenarioPage1';
import Version_2 from './version_2/Version_2';





function App() {

  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null); // State for user ID
  const [inputValue, setInputValue] = useState(''); // State for userID input field
  const numDims = 5; // Set the number of dimensions
  const apiHost ='localhost:5000';
  const [initialRadii,setInitialRadii] = useState(null);
  const helpModalRef = useRef(null);




// fetch the APIkey and Initialize Optimizer from backend before map is  rendered---------------------
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(`http://${apiHost}/get_api_key`);
        setGoogleMapsApiKey(response.data.apikey);
        console.log('ApiKey fetched');
      } catch (error) {
        console.error('Error fetching the API key:', error);
      } finally {
        setLoading(false);
      }
    }; 
    fetchApiKey();
  }, []);
//------------------------------------------------------------------------------------------------------


//------------------------- initializing Optimizer triggered by submitted userID ---------------------------------------
  const initializeSession = async (user_id) => {
    try {
      const response = await axios.get(`http://${apiHost}/init/${user_id}/${numDims}`);
      console.info('Initial Options Set: done',response);
      await fetchInitialOptions(user_id);
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };
//--------------------------------------save user ID----------------------------------- 
const handleSaveUserID = () => {
  if (inputValue) {
    setUserID(inputValue);
    console.log("User ID saved:", inputValue);
    initializeSession(inputValue); // automatically initializes a session when a userId is submitted, use inputValue as it takes some time until userId is set 
    helpModalRef.current.openModal();
  } else {
    alert("Please enter a User ID");
  }
};

//----------------------fetch initial optimzer options for each location-----------------------------
const fetchInitialOptions = async (userID) => {
  try {
    const response = await axios.get(`http://${apiHost}/get_current_options/${userID}`);
//normalized
    const normalizedRadiiValues = linspace(0.2,1,49);
    const normalizedValueLeft = getClosestValues(response.data.option_1, normalizedRadiiValues);
    const normalizedValueRight = getClosestValues(response.data.option_2, normalizedRadiiValues);
    const normalizedRadii = {option_1:normalizedValueLeft, option_2: normalizedValueRight};
  
    setInitialRadii( response.dats);
    setInitialRadii(normalizedRadii)
    console.log('radii',response.data)
  } catch (error) {
    console.error('Error fetching current options:', error);
  }
};


//------------------------------------------------------------------------------------------------------------------------------------------------


if (loading) {
  return <div>Loading...</div>;
}


  return (
    <div className="App">
     <Navbar ref={helpModalRef} />

    {!userID &&(
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', width: '100%' }}>
     <input
       type="text"
       value={inputValue}
       onChange={(e) => setInputValue(e.target.value)}
       placeholder="Enter User ID"
       style={{
         padding: '10px',
         fontSize: '16px',
         color:'black',
         borderRadius: '5px',
         border: '1px solid #ccc',
         marginRight: '10px',
         marginLeft: '10px',
         marginBottom: '10px',
         marginTop: '10px',
       }}
     />
     <button
       onClick={handleSaveUserID}
       style={{
         padding: '10px 20px',
         fontSize: '16px',
         backgroundColor: '#0c3868',
         color: 'white',
         border: 'none',
         borderRadius: '5px',
         cursor: 'pointer',
         transition: 'background-color 0.3s ease',
       }}
       onMouseEnter={(e) => e.target.style.backgroundColor = '#446a92'}
       onMouseLeave={(e) => e.target.style.backgroundColor = '#0c3868'}
     >
       Save User-ID
     </button>
     

   </div>
   
   
    )}


     {userID && initialRadii && googleMapsApiKey && (
     <div className="content">
     <Map 
     apikey= {googleMapsApiKey}
     apiHost={apiHost}
     userID={userID}
     initialRadii={initialRadii}
    

     ></Map>
     </div>
     
     )}


    </div>
  );
}


// Den Router in der Haupt-App einfügen
function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path= "/pages/s2"element={<ScenarioPage2/>} />
        <Route path= "/pages/s1"element={<ScenarioPage1/>} />
        <Route path= "/version_2"element={<Version_2/>} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;