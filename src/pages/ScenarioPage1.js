import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myImage from '../img/3.png'

const ScenarioPage1 = ()=>{
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook
    const
    handleContinueClick = ()=>{
        navigate('../pages/s2')
    }

    return(
        <div className='main-content1'>
        <h2>Stellen Sie sich folgende Situation vor:</h2>

        <p>Die städtische Verkehrsgemeinschaft <strong>(SVG)</strong> stellt 
        das Angebot des öffentlichen Nahverkehrs in Berlin
        bereit. In der Vergangenheit kam es aufgrund überfüllter Busse
        und Bahnen, vielen Verspätungen oder gar Ausfällen oft zu
        Frustrationen bei Fahrgästen. Daher möchte die SVG neue Bus- und
        Bahnverbindungen effektiv an den Stellen einsetzen, wo die
        größte Entlastung für das Streckennetz zu erwarten ist. Um diese <strong>Verbesserungen umzusetzen, sollen Mobilitätsdaten von
        Nutzer:innen analysiert und Auslastungsspitzen vorhergesagt
        werden.</strong></p>

        <p>Stellen Sie sich nun vor, Sie wohnen und arbeiten in Berlin 
            und nutzen täglich die öffentlichen Verkehrsmittel der SVG. 
            Gelegentlich sind Sie von ausfallenden und zu spät kommenden Bussen und Bahnen genervt 
            und daher grundsätzlich an einer Verbesserung des Streckennetzes interessiert.</p>

            <p>Ihre am häufigsten besuchten Orte:</p>
        <div className="image-container">
            
            <img src={myImage} alt="Anonymisierungsradius" className="responsive-image"/>
        </div>

        <p>  
            Stellen Sie sich für den persönlichen Ort einen Ort vor, der für
            Sie sehr privat ist und den Sie nicht mit jeder Person teilen würden.

        </p>
        <p>
            Nennen Sie einen Ort, von dem Sie denken, dass viele Leute ihn als 
            "Persönlichen Ort" im Sinne dieser Erklärung einordnen würden:
        </p>

        <input
        className="custom-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="..."
        
        />

        <p> 
        <em>Falls es Ihnen schwerfällt, einen solchen Ort zu identifizieren, 
        überlegen Sie, wo Sie sich regelmäßig aufhalten oder wo Sie sich besonders wohl und geschützt fühlen.</em>  
        </p>

<div className="buttons-container">
        {inputValue? (
          <button className="button" onClick={handleContinueClick}>Weiter</button>
        ) : (
          <button className="button-disabled" disabled={!inputValue}>
            Weiter
          </button>
        )}
      </div>

        </div>
     
    )
}



export default ScenarioPage1;