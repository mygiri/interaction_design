import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myImage from '../img/1.png'
import myImage2 from '../img/2.png'

const questions = [
  'Mobilitätsdaten können verschiedene Formen annehmen. Um welche Art von Mobilitätsdaten dreht es sich in dem Aufruf der SVG?',
  'Als Anonyimiserungstechnik wird Differential Privacy verwendet. Welche Aussage stimmt in Bezug auf GPS Koordinaten?',
  'Wofür sollen die gesammelten Daten unter anderem genutzt werden?',
];

const answers = [
  [' Name eines besuchten Ortes', ' Gefahrene Strecke zwischen zwei besuchten Orten', ' Koordinaten eines besuchten Ortes'],
  [' Je größer der Radius, desto größer das Privatsphäre-Niveau', ' Je größer der Radius, desto kleiner das Privatsphäre-Niveau', ' Die Größe des Radius hat keinen Einfluss auf das Privatsphäre-Niveau'],
  [' Um das Konzept einer "Smart City" im öffentlichen Nahverkehr zu testen', ' Um das vielfältige Carsharing Angebot der Stadt zu koordinieren', ' Um besser zu verstehen, wo und wann zusätzliche Busse und Bahnen zur Verfügung gestellt werden sollten'],
];

const correctAnswers = ['3', '1', '3'];

const ScenarioPage2 = () => {
  const [answersArray, setAnswersArray] = useState(questions.map(() => undefined));
  const [answersAreCorrect, setAnswersAreCorrect] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState(undefined);
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleRadioClicked = (value, answerIndex) => {
    const newAnswersArray = answersArray.map((a, index) => (index === answerIndex ? value : a));
    setAnswersArray(newAnswersArray);

    // After choosing all the answers, we check for correctness
    if (newAnswersArray.every((a) => a)) {
      setFinalAnswers(newAnswersArray);
      const correct = newAnswersArray.every((a, index) => a === correctAnswers[index]);
      setAnswersAreCorrect(correct);
    }
  };

  const handleContinueClick =()=>{
    navigate('/');
  }

  return (
    <div className='page-container'>
      <div className = "main-content">
        <h2>Die SVG bittet um Ihre Unterstützung!</h2>

        <p>
          <strong>Um unser Verkehrsnetz zu verbessern</strong>, brauchen wir Informationen darüber, 
          wie sich Menschen in unserer Stadt bewegen. 
          Mit genügend Daten können wir besser vorhersagen, wann und wo es zu Engpässen kommt, 
          und zusätzliche Verkehrsmittel bereitstellen. 
          Aus Datenschutzgründen haben wir bisher keine Mobilitätsdaten gesammelt. 
          Auch in Zukunft bleibt die <strong>Abgabe Ihrer Mobilitätsdaten freiwillig</strong>.
        </p>

        <p> 
          Mit diesem Aufruf fragen wir Sie daher, uns Ihre Mobilitäsdaten zu
          spenden.
        </p>

        <p>
            Mobilitätsdaten können viele Formen annehmen. In diesem Fall interessieren wir uns 
            ausschließlich für die <strong>GPS-Koordinaten Ihrer am häufigsten besuchten Orte</strong>, 
            wie zum Beispiel eines regelmäßig besuchten Cafés oder Ihrer Arbeitsstelle
        </p>

          <p>
            <strong>Datenschutz ist uns dabei sehr wichtig.</strong> Daher anonymisieren wir Ihre 
            Mobilitätsdaten vor der Übertragung mit einem Verfahren namens <strong>Differential Privacy</strong>.
          </p>

          <p>
          Bei diesem Verfahren werden die Koordinaten Ihrer besuchten Orte verändert, bevor sie 
          an unseren Server gesendet werden. Statt der tatsächlichen Koordinaten werden <strong>zufällige 
          Koordinaten innerhalb eines bestimmten Radius</strong> übermittelt.  Welche
          Koordinaten dies genau sind, darauf haben auch wir keinen Einfluss.
          </p>


          <div className="image-container">
            <img src={myImage} alt="Anonymisierungsradius" className="responsive-image"/>
          </div>

          <p>        
            Es ist wichtig zu wissen, dass <strong>trotz des Anonymisierungsverfahrens
            immer ein Restrisiko bleibt</strong>, dass ein besuchter Ort eindeutig
            identifiziert werden kann. Wie hoch dieses Restrisiko ist, hängt
            vom gewählten Privatsphäre-Niveau ab.
          </p>
        <p>
            Grundsätzlich gilt: <strong>Je größer der gewählte Radius für die
            Anonymisierung, desto höher ist das Privatsphäre-Niveau</strong>, da eine
            Übermittlung weiter vom Ursprung entfernter Koordinaten
            wahrscheinlicher wird.
        </p>
        
        <div className="image-container">
            <img src={myImage2} alt="Anonymisierungsradius" className="responsive-image smaller-image"/>
          </div>

        <p mt={'20px'}>
            Wir haben eine Bedienoberfläche entwickelt, mit der Sie individuelle
            Privatssphäre-Niveaus für besuchte Orte festgelegt können. Je
            geringer das gewählte Privatsphäre-Niveau für die Spende der
            Mobilitätsdaten, desto besser können wir unseren Streckenplan
            optimieren. Allerdings steigt damit auch das Restrisiko, dass ein
            besuchter Ort identifiziert werden kann. Durch die Festlegung Ihres
            individuellen Privatsphäre-Niveaus entscheiden Sie selbst, in
            welchem Umfang die Koordinaten besuchter Orte anonymisiert und
            schließlich gespendet werden sollen.{' '}
          </p>

      </div>

      <hr className="separator-line" />  {/* Thin line */}
      
      <div className="quiz-section">
        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="question-block" >
            <p><strong>{q}</strong></p>
            <div className="answer-options">
              {answers[questionIndex].map((a, answerIndex) => (
                <label key={answerIndex} className="radio-label">
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={answerIndex + 1}
                    checked={answersArray[questionIndex] === `${answerIndex + 1}`}
                    onChange={(e) => handleRadioClicked(e.target.value, questionIndex)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="buttons-container">
        {answersAreCorrect ? (
          <button className="button" onClick={handleContinueClick}>Weiter</button>
        ) : (
          <button className="button-disabled" disabled={!finalAnswers}>
            Weiter
          </button>
        )}
      </div>

      {!answersAreCorrect && finalAnswers && (
        <div className="error-message">
          <p>Leider waren nicht alle Antworten richtig. Bitte versuchen Sie es erneut.</p>
        </div>
      )}

    </div>
  );
};



export default ScenarioPage2;
