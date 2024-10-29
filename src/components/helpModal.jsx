import React, { useState, forwardRef, useImperativeHandle} from 'react';
import '../index.css'; // CSS für das Modal

const HelpModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);



  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  return (
    <>
      {/* Button to open the modal */}
      <button onClick={openModal} className="help-button">
        Hilfe
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
          <h1 style={{ marginBottom: '10px', textAlign: 'left' }}>Willkommen zu den Privatsphäre-Einstellungen</h1>

<p>
  Diese Bedienoberfläche soll Sie bei der Auswahl Ihrer <strong>Privatsphäre-Niveaus</strong> unterstützen. 
  Auf der Karte sehen Sie fünf fiktive Orte in Berlin, die Ihre häufigsten Aufenthaltsorte darstellen.
</p>

<h3 style={{fontStyle:'normal', marginBottom: '5px' }}>So funktioniert das System:</h3>

<ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
  <li><strong>Vorschläge anzeigen:</strong> Das System schlägt für jeden Ort verschiedene Privatsphäre-Niveaus vor, die durch Radien in Metern dargestellt werden.</li>
  <li><strong>Seitenleiste:</strong> In der rechten Seitenleiste sehen Sie die vorgeschlagenen Radien. Wenn Sie mit der Maus über die Balken fahren, werden diese Radien auf der Karte visualisiert.</li>
  <li><strong>Navigation:</strong> Klicken Sie auf die Pfeile unten in der Seitenleiste, um zum nächsten oder vorherigen Ort zu wechseln. Oder klicken Sie direkt auf die Marker auf der Karte, um einen bestimmten Ort auszuwählen. </li>
  <li><strong>Privatsphäre verstehen:</strong> Die Radien auf der Karte zeigen den Bereich an, aus dem der Standort erfasst wird. Je größer der Radius, desto größer die Privatsphäre.</li>
  <li><strong>Vorschläge auswählen:</strong> Um Ihre Präferenz auszuwählen klicken sie auf die einen der beiden Balken. </li>
  <li><strong>Lernen durch Auswahl:</strong> Das System lernt aus Ihren wiederholten Entscheidungen, welche Privatsphäre-Einstellungen Sie bevorzugen.</li>
  <li><strong>Automatisches und manuelles Speichern:</strong> Sobald das System Ihre Präferenz erkannt hat, speichert es diese automatisch. Sie können Ihre Auswahl aber auch manuell speichern, indem Sie auf die "links" und "rechts" Button klicken.</li>
</ul>

<p style={{ fontStyle: 'italic' }}>
  Hinweis: Dieses Hilfefenster können Sie jederzeit wieder öffnen, indem Sie auf das "Hilfe"-Symbol oben rechts klicken.
</p>
            <button onClick={closeModal} className="close-button">
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default HelpModal;




