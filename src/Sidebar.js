import React from 'react';
import { useState} from 'react';
import { linspace, getClosestIndex } from './utils/functions';
import { useNavigate } from 'react-router-dom';
import { reinitializeOptimzer } from './utils/apiCalls';
import { FaEdit, FaEye } from 'react-icons/fa'; 

const Sidebar = ({userID, defaultCenter, selectedLocation, preferences, visibleRadii, toggleRadiusVisibility, handleRadiusHover, handleLocationClick, handleNextLocation, handlePreviousLocation, fetchCurrentOptions, submitFeedbackData, radii, setnormalizedRadii, checkAndLockLocation, lockOnLocations, lockThroughSaveButton, unlockLocation, locations  }) => {

  const [hoveredBar, setHoveredBar] = useState(null); // State to track the hovered bar
  const [hoveredButton, setHoveredButton] = useState(null); // State to track the hovered button

  const navigate = useNavigate();

  const locationRadius1 = radii.option_1[selectedLocation.id];
  const locationRadius2 = radii.option_2[selectedLocation.id];
  const allLocationsLocked = lockOnLocations.every(status => status === 1);

  const handleTransferData = () => {
    console.log("Mobilitätsdaten werden übertragen...");
  
    navigate("/thank-you"); // Navigation zur ThankYou-Seite
  };

  return (

    <div style={{
      position: 'absolute',
      top: 50,
      right: 20,
      width: '300px', // Feste Breite
      height: '90vh', // Feste Höhe relativ zum Viewport
      backgroundColor: '#fff',
      display: 'flex',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 10,
      padding: '20px',
      overflowY: 'auto',
    }}>



  <div style={{flex: '1 0 auto',marginBottom: '0px'}}
      >
        <h2 style={{ marginBottom: '10px' }}>Privatsphäre Einstellung</h2>
        
        {/* <p style={{ marginBottom: '5px' }}>Wähle deine Privatsphäreniveau-Präferenz für diesen Ort:</p>
        <h3>{selectedLocation.name}</h3> */}
  </div>



    {/* Falls alle Orte "locked" sind */}
{allLocationsLocked ? (
  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', height: '100%' }}>
  <p>Du hast für alle Orte Privatsphäreniveaus bestimmt</p>
  <h3 style={{ marginBottom: '25px'}} >Präferenzen:</h3>
  <ul style={{ listStyleType: 'none', padding: 0 }}>
    {locations.map((location, index) => (
      <li key={index} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          <strong>{location.name}:</strong> 
          {` ${Math.round(preferences[index] * 1000)}m`} 
        </span>
        
        <div style={{color:'red'}}>
          {/* Show radius for specific location*/}
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              marginRight: '10px'
            }}
            onClick={() => {
              toggleRadiusVisibility(index ) // Toggle visibility
            }}
          >
            <FaEye style={{ color:visibleRadii[index] === 1 ? 'red' : 'black' }} /> {/* Icon für das Ansehen der eingestellten Präferenz */}
          </button>
          {/* Bearbeiten-Schaltfläche */}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'black',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={() => {

              if (visibleRadii[index]== 1){
                toggleRadiusVisibility(index) // wenn visibility of radii on turn off so one can hover
              };
              handleLocationClick(location);

              unlockLocation(index);  // Ort entsperren
              reinitializeOptimzer(userID, index); // Optimierer neu starten

              
            }}
          >
            <FaEdit /> {/* Bearbeiten == Stift-Symbol */}
          </button>
        </div>
      </li>
    ))}
  </ul>
  <button
    onClick={handleTransferData// Navigation zur ThankYou-Seite
    }
    className='transfer-button'
    >
    Daten übertragen
  </button>
</div>
) : (
   

/* Lower Section: bars & buttons */


  <div style={{   display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
    <p style={{ marginBottom: '5px' }}>Wähle deine Privatsphäreniveau-Präferenz für diesen Ort:</p>
    <h3>{selectedLocation.name}</h3>

      <div style={{ height:'55vh' ,display: 'flex', justifyContent:'space-evenly', alignItems: 'flex-end' }}>
    {/* Bar Charts */}
      {/* left bar - shows either option for selection or the selected prefernce*/}
        <div       
          onMouseOver={() => { handleRadiusHover(locationRadius1*1000); setHoveredBar('left'); } }
          onMouseOut={() => { handleRadiusHover(null); setHoveredBar(null); }}
          
          onClick={async () => {
            if (!lockOnLocations[selectedLocation.id]) {
              await submitFeedbackData(userID, selectedLocation.id, 0); // 0 indicates left bar
              await fetchCurrentOptions(userID);
              checkAndLockLocation(selectedLocation.id, locationRadius1, locationRadius2);
            }
          }}

          style={{
            height: lockOnLocations[selectedLocation.id]
              ? `${preferences[selectedLocation.id] * 55}vh` // Show locked preference height
              : `${locationRadius1 * 55}vh`, // Otherwise show radius option height
            width: '40%',
            backgroundColor: !lockOnLocations[selectedLocation.id] 
              ? (hoveredBar === 'left' ? '#ff6347' : '#0f4580') 
              : '#0f4580', // Change color on hover only if preference is not locked yet
            marginTop: '10px',
            cursor: 'pointer',
            display: 'flex-end',
            transition: 'background-color 0.3s ease',
            position: 'relative', // Allows absolute positioning of the text
            lineHeight: '22px',
        }}>
          {/* need for the case when radius is smaller than 50m --> number is shown in black and on top of bar */}
          <span style={{
              position: lockOnLocations[selectedLocation.id] || locationRadius1 < 0.05 ? 'absolute' : 'relative',
              top: lockOnLocations[selectedLocation.id] || locationRadius1 < 0.05 ? '-22px' : 'auto', // Adjust positioning for small bars or locked state
              color: lockOnLocations[selectedLocation.id] || locationRadius1 < 0.05 ? 'black' : 'white',
              paddingLeft: '5px',
              fontSize: '18px',
            }}
          >
          {selectedLocation === defaultCenter
            ? 'Radius Auswahl 1' // Default status text when no specific location is selected
            : lockOnLocations[selectedLocation.id]
              ? `${Math.round(preferences[selectedLocation.id] * 1000)}m` // Show locked preference
              : `${Math.round(locationRadius1 * 1000)}m`} {/* Show radius option if not locked */}
          </span>
                  
        </div>  
        {/* right bar */}
    {!lockOnLocations[selectedLocation.id] &&(// makes sure that only one bar is shown, when the locationprefernce is locked
      
        <div
          onMouseOver={() => {handleRadiusHover(locationRadius2*1000); setHoveredBar('right');} } //*1000 to get the meters
          onMouseOut={() => { handleRadiusHover(null); setHoveredBar(null); }}
          onClick={async () => {
            setnormalizedRadii(radii);
            await submitFeedbackData(userID, selectedLocation.id, 1); // 1 indicates right bar
            await fetchCurrentOptions(userID);
            checkAndLockLocation(selectedLocation.id,locationRadius1, locationRadius2)

          }}
       


          style={{
            height: `${locationRadius2*55}vh`,
            width: '40%',
            backgroundColor: hoveredBar === 'right' ? '#ff6347' : '#0f4580', // Change color on hover
            marginTop: '0px',
            cursor: 'pointer',
            display: 'flex-end',
            transition: 'background-color 0.3s ease',
            position: 'relative', // Allows absolute positioning of the text
            lineHeight: '22px',
        }}>
          {/* need for the case when radius is smaller than 50m --> number is shown in black and on top of bar */}
           <span style={{
            position: locationRadius2 < 0.07 ? 'absolute' : 'relative',
            top: locationRadius2 < 0.07? '-22px' : 'auto', // Adjust positioning for small bars
            color: locationRadius2 < 0.07 ? 'black' : 'white',
            paddingLeft: '5px', 
            fontSize: '18px',
            }}> {selectedLocation === defaultCenter 
              ? 'Radius Auswahl 2'
              : `${Math.round(locationRadius2*1000)}m`}
            
            </span>
          
        </div>
      )
    }
      </div> 

      
      {/* Buttons */}
      <div style={{ display: 'flex',flexDirection:'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '25px' }}>
        
        {/* Left/previous Button */}
        <button
          onMouseOver={() => setHoveredButton('left')}
          onMouseOut={() => setHoveredButton(null)}
          onClick={handlePreviousLocation}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#0f4580',
            color: 'white',
            border: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={hoveredButton === 'left' ? '#ff6347' : 'white'} // Change fill color on hover
              width="24px"
              height="24px"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
        </button>
        


<div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
    {!lockOnLocations[selectedLocation.id] ? (
      <>
        {/* Save Left Button */}
        <button
          style={{
            width: '60px',
            height: '40px',
            borderRadius: '15%',
            backgroundColor: 'white',
            color: '#0f4580',
            borderColor: '#0f4580',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          onMouseOver={(e) => (e.target.style.color = '#ff6347')}
          onMouseOut={(e) => (e.target.style.color = '#0f4580')}
          onClick={async()=> {lockThroughSaveButton(selectedLocation.id, locationRadius1)}}
        >
          links
        </button>

        {/* Save Right Button */}
        <button
          style={{
            width: '60px',
            height: '40px',
            borderRadius: '15%',
            backgroundColor: 'white',
            color: '#0f4580',
            borderColor: '#0f4580',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          onMouseOver={(e) => (e.target.style.color = '#ff6347')}
          onMouseOut={(e) => (e.target.style.color = '#0f4580')}
          onClick={async()=> {lockThroughSaveButton(selectedLocation.id, locationRadius2)}}
        >
          rechts
        </button>
      </>
    ) : (
      /* Edit Button when Location is locked  */
      <button
        style={{
          width: '80px',
          height: '40px',
          borderRadius: '15%',
          backgroundColor: 'white',
          color: '#0f4580',
          borderColor: '#0f4580',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}

        onMouseOver={(e) => (e.target.style.color = '#ff6347')}
        onMouseOut={(e) => (e.target.style.color = '#0f4580')}
        onClick={async()=> {
          await reinitializeOptimzer(userID, selectedLocation.id); 
          unlockLocation(selectedLocation.id);
        }}
      >
        bearbeiten
      </button>
    )}
  </div>
       
          

        {/* Right/Next Button */}
        <button
          onMouseOver={() => setHoveredButton('right')}
          onMouseOut={() => setHoveredButton(null)}
          onClick={handleNextLocation}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#0f4580',
            color: 'white',
            border: '#0f4580',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}

        >
         <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={hoveredButton === 'right' ? '#ff6347' : 'white'} // Change fill color on hover
        width="24px"
        height="24px"
      >
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
        </button>
      </div> {/* Buttons finished */}

    </div> //* Bars and Buttons finished */}
  )}
    </div> // content finshed
  );
};

export default Sidebar;