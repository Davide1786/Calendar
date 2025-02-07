import React, { useState } from "react";
import moment from "moment";
import "./index.css";
import Drawer from "./Drawer";

const MonthView = ({ currentDate, events, onAddEvent, onEventContextMenu, generateCalendar }) => {
  const { startDay, daysInMonth } = generateCalendar(currentDate, "month");
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleShowDrower = (event) => {
    setSelectedEvent(event);
    setShowDrawer(true);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(currentDate).date(i);
      const isToday = moment().isSame(date, "day"); // Controlla se è il giorno attuale
      const dayEvents = events.filter((event) => moment(event.date).isSame(date, "day"));

      days.push(
        <div key={i} className={`day ${isToday ? "current-day" : ""}`}>
          <div className="day-header">
            <span>{i}</span>
            <button className="add-event-btn" onClick={() => onAddEvent(null, date)}>
              +
            </button>
          </div>
          <div className="wrapperEvents">
            {showDrawer ? (
              <Drawer setShowDrawer={setShowDrawer} event={selectedEvent} />
            ) : (
              dayEvents.map((event) => (
                <div key={event.id} className="event" onClick={() => handleShowDrower(event)} onContextMenu={(e) => onEventContextMenu(event, e)}>
                  {event.title}
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return <div className="month-view">{renderDays()}</div>;
};

export default MonthView;
