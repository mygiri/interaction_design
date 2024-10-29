import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import Sidebar from './Sidebar';
import axios from 'axios';
import { linspace, getClosestValues } from './utils/functions';

const defaultCenter = {name:'Wähle einen Ort', lat: 52.520008 , lng: 13.404954 }; // coordinates Berlin
const defaultZoom = 12;

//fictive sceanrio locations 
const locations = [
  { id: 0, name: "Zuhause", position: { lat: 52.52162837, lng: 13.4467040}},
  { id: 1, name: "Café", position: { lat: 52.5349617, lng: 13.4182916}},
  { id: 2, name: "Persönlicher Ort", position: { lat: 52.5138820, lng: 13.3014155 }},
  { id: 3, name: "Arbeit", position: { lat: 52.5076, lng: 13.3902 },},
  { id: 4, name: "Station", position: { lat: 52.5165879, lng: 13.4433214 }}
];


// -----------------------maps styling --------------------------//

const mapStyles = 

[
    {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#f49935"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#fad959"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on",
            }
          //   //make transport red
          // {
          //     "color": "ff0000"
          //   },
          //   {
          //     "saturation": 30
          // },
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#a1cdfc"
            },
            {
                "saturation": 30
            },
            {
                "lightness": 49
            }
        ]
    }
]

//--------------------------------------------------------------/



const Map = ({ apikey,apiHost, center = defaultCenter, zoom = defaultZoom, userID, initialRadii}) => {
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null); // for info box on location pin click
  const [hoveredRadius, setHoveredRadius] = useState(null); // hovering over radi
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter); // to select locations
  const [lockOnLocations, setLockOnLocation]=useState([0,0,0,0,0]); //lock states to make sure that a prefernce for each location is saved
  const [preferences, setPreference] =useState([0,0,0,0,0]);
  const [visibleRadii,setVisibleRadii]= useState([0,0,0,0,0]);
  const [radii, setRadii] = useState(initialRadii);
  const normalizedRadiiValues = linspace(0.02,1,49);


//normalize vector so its easier to grasp for users
  const setnormalizedRadii = (radiis)=>{
    
    const normalizedValueLeft = getClosestValues(radiis.option_1, normalizedRadiiValues);
    const normalizedValueRight = getClosestValues(radiis.option_2, normalizedRadiiValues);
    const normalizedRadii = {option_1:normalizedValueLeft, option_2: normalizedValueRight};
    setRadii(normalizedRadii);
    console.log('noramlizedRadii',normalizedRadii)
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apikey,
  });
 
  

// next and previous location button handlers------------------------------
  const handleNextLocation = () => {
    const currentIndex = locations.findIndex(loc => loc.id === selectedLocation.id);
    const nextIndex = (currentIndex + 1) % locations.length;
    setSelectedLocation(locations[nextIndex]);
  };

  const handlePreviousLocation = () => {
    const currentIndex = locations.findIndex(loc => loc.id === selectedLocation.id);
    const previousIndex = (currentIndex - 1 + locations.length) % locations.length;
    setSelectedLocation(locations[previousIndex]);
  };
//------------------------------------------------------------------------

// ---------put location zooom into center when pin is clicked---------//
  const handleLocationClick = (location) => {  
    console.log(location)
    setSelectedLocation(location);
  };

  //-----------hover over sidebar and show coressponding radius----------------------------------------------//
  const handleRadiusHover = (radius) => {
    setHoveredRadius(null); // Setzt den aktuellen Zustand zurück
    if (hoveredRadius == null) {
      setHoveredRadius(radius);
    }else {
      setHoveredRadius(null);
    }
  };
//----click eye-icon to show radius by setting radius visibility status: visibleRadius
  const toggleRadiusVisibility = (index) => {
    const newVisibleRadii = [...visibleRadii]
    if (newVisibleRadii[index]=== 1){  
      newVisibleRadii[index]= 0;
    }else{
      newVisibleRadii[index]=1
    }
    setVisibleRadii(newVisibleRadii)
    console.log(newVisibleRadii)

    return newVisibleRadii;
    };

//------------------------------------------------------------------------

  const unlockLocation = (locationIndex) => {
    const preference = 0;
    const newPreference  =[...lockOnLocations];
    newPreference[locationIndex]= preference;
    setLockOnLocation(newPreference);
    fetchCurrentOptions(userID);

  }


//---------------------funkction to check whether loations should be locked------------------------------------------------------
  const checkAndLockLocation = (locationIndex, leftValue, rightValue) => {
    const convergenceThreshold = 0.07; // threshold to make sure when to lock 
    if (Math.abs(leftValue - rightValue) <= convergenceThreshold) {
      // if values of each prefernce option are close enough the status updated to 1== locked
      const newLockedStatus = [...lockOnLocations];
      newLockedStatus[locationIndex] = 1;
      setLockOnLocation(newLockedStatus); // Update des Locked-Status
      console.log('Locked Values:',newLockedStatus)

      const preference = ((leftValue+rightValue)/2)
      const newPreference  =[...preferences]
      newPreference[locationIndex]= preference
      setPreference(newPreference)
      console.log('Prefernce Values:',newPreference)

    }
  };
//------------------lock location through a selcted prefernce---------------------------------------------------------------------
  const lockThroughSaveButton = (locationIndex, selectedPreference) =>{
    const newLockedStatus = [...lockOnLocations];
      newLockedStatus[locationIndex] = 1;
      setLockOnLocation(newLockedStatus); // Update des Locked-Status
      console.log('Locked Values:',newLockedStatus)

      const newPreference  =[...preferences]
      newPreference[locationIndex]= selectedPreference
      setPreference(newPreference)
      console.log('Prefernce Values:',newPreference)

  }


// --------------------Function to fetch the current options for the user from backend -------------

const fetchCurrentOptions = async (userID) => {
  try {
    const response = await axios.get(`http://${apiHost}/get_current_options/${userID}`);
    setnormalizedRadii(response.data)
    console.log('radii',response.data)
  } catch (error) {
    console.error('Error fetching current options:', error);
  }
};
//-----------------update radii preferences in frontend by visualizing the current options--------


//-------------------------------------------------------------------------------------
const submitFeedbackData = async (userID, optimizerIndex, selectedIndex) => {
  try {
    const response = await axios.post(`http://${apiHost}/submit_feedback_data`, {
      user_id: userID,
      optimizer_index: optimizerIndex,
      selected_index: selectedIndex,
    });
    console.log('feedback submitted')
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
};


// effect hooks for data fetching - useEffect()

//change --> when lcoation is selceted again nothing happens
useEffect(() => {
  console.log('useEffect running for selectedLocation change');
    if (selectedLocation && mapRef.current) {
      const map = mapRef.current;
      const offsetX = 0.005; 
      const newCenter = {
        lat: selectedLocation.position.lat,
        lng: selectedLocation.position.lng + offsetX,
      };
      map.panTo(newCenter)
      // map.setCenter(newCenter);
      map.setZoom(15);
    }

  }
, [selectedLocation]);




if (!isLoaded) {
  return <div>Loading...</div>;
}



  //--------------output (return)---------------//
  return (
    <div className = "map-container"
    style={{ position: 'relative', width: '100%', height: '100vh' }}>

    <Sidebar 
    userID = {userID}
    locations={locations}
    defaultCenter={defaultCenter}
    radii ={radii}
    preferences = {preferences}
    selectedLocation={selectedLocation}
    setSelectedLocation={setSelectedLocation}
    visibleRadii={visibleRadii}
    handleRadiusHover={handleRadiusHover}
    handleNextLocation={handleNextLocation}
    handleLocationClick={handleLocationClick}
    handlePreviousLocation={handlePreviousLocation}
    fetchCurrentOptions ={fetchCurrentOptions}
    submitFeedbackData ={submitFeedbackData}
    setnormalizedRadii = {setnormalizedRadii}
    checkAndLockLocation = {checkAndLockLocation}
    lockOnLocations={lockOnLocations}
    lockThroughSaveButton={lockThroughSaveButton}
    unlockLocation = {unlockLocation}
    toggleRadiusVisibility = {toggleRadiusVisibility}
    
  
    
    

    >
    </Sidebar>
    
     
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100vh' }}
      center={center}
      zoom={zoom}
      onLoad={(map) => {
        mapRef.current = map; // Correctly set the map reference
        console.log('Map loaded, mapRef.current:', mapRef.current);
        console.log('isLoaded:', isLoaded);
        
      }}
      options = {{
        styles: mapStyles,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl:false,
        fullscreenControl: false,
        zoomControl: false,
      }}

    >
      
      {locations.map((location) => (

        <React.Fragment key={location.id}>
          <Marker
            position={location.position}
            title={location.name}
            icon={{
              url: lockOnLocations[location.id]
                ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' // locked marker (green)
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // unlocked marker (red)
              scaledSize: new window.google.maps.Size(40, 40), // Adjust marker size if needed
            }}
            onClick={() => handleLocationClick(location)}

          />

{/* circle rendeering for last overview and eye-icon toggle */}
          <Circle
            center={location.position}
            radius={visibleRadii[location.id] === 1 ? preferences[location.id]*1000: null}
            options={{
              fillColor: "#ff6347",  
              fillOpacity: 0.65,
              strokeColor: "white",               
              strokeOpacity: 0.3,                   
              strokeWeight: 2,                      
              clickable: false,                     // Verhindert, dass der Kreis anklickbar ist
            }}
          />
      
  {/* Render Circle only for the selected location and when hovered */}
        {(selectedLocation.id === location.id) && visibleRadii[location.id] === 0 && lockOnLocations[location.id]===0 && (
          <Circle
            center={selectedLocation.position}
            radius={hoveredRadius}
            options={{
              fillColor: "#ff6347",  
              fillOpacity: 0.65,
              strokeColor: "white",               
              strokeOpacity: 0.3,                   
              strokeWeight: 2,                      
              clickable: false,                     // Verhindert, dass der Kreis anklickbar ist
            }}
          />
          )}          

        </React.Fragment>
      ))}
      {selectedMarker && (
        <InfoWindow
        position={selectedMarker.position}
        onCloseClick={() => setSelectedMarker(null)}
      >
        <div style={{ padding: '10px', maxWidth: '200px',color: '#333'  }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{selectedMarker.name}</h3>
        <p style={{ margin: '0' }}>Details about {selectedMarker.name}.</p>
        </div>
      </InfoWindow>
      )}

    </GoogleMap>
      
    </div>
  );
};

export default Map;


