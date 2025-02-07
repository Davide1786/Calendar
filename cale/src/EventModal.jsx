import { useState, useEffect } from "react";
import moment from "moment";
import "./index.css";

const EventModal = ({ event, date, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(event ? event.title : "");
  const [description, setDescription] = useState(event ? event.description : "");
  const [dateValue, setDateValue] = useState(event ? moment(event.date).format("YYYY-MM-DD") : moment(date).format("YYYY-MM-DD"));
  const [time, setTime] = useState(event ? moment(event.date).format("HH:mm") : moment().format("HH:mm"));

  const handleSave = () => {
    const newEvent = {
      id: event ? event.id : Date.now(),
      title,
      description,
      date: moment(`${dateValue} ${time}`).toDate(),
    };
    onSave(newEvent);
    onClose();
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{event ? "Modifica Evento" : "Aggiungi Evento"}</h2>
        <input type="text" placeholder="Titolo" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Descrizione" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <div className="modal-actions">
          <button onClick={handleSave}>Salva</button>
          {event && <button onClick={handleDelete}>Elimina</button>}
          <button onClick={onClose}>Annulla</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
