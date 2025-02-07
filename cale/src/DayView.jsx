import moment from "moment";
import "./index.css";
import Drawer from "./Drawer";
import { useState } from "react";

const DayView = ({ currentDate, events, onAddEvent, generateCalendar, namesDaysWeek, onEventContextMenu }) => {
  const day = generateCalendar(currentDate, "day");
  const dayEvents = events.filter((event) => moment(event.date).isSame(day, "day"));
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isToday = moment().isSame(day, "day");

  const handleShowDrower = (event) => {
    setSelectedEvent(event);
    setShowDrawer(true);
  };

  return (
    <div className={"day-view"}>
      <div className={`day-header ${isToday ? "current-day" : ""}`}>
        {namesDaysWeek[day.format("dddd")]}, {day.format("D ")}
        <button className="add-event-btn" onClick={() => onAddEvent(null, day)}>
          +
        </button>
      </div>
      {showDrawer ? (
        <Drawer setShowDrawer={setShowDrawer} event={selectedEvent} />
      ) : (
        dayEvents.map((event) => (
          <div key={event.id} onClick={() => handleShowDrower(event)} onContextMenu={(e) => onEventContextMenu(event, e)} className="event">
            {event.title} - {moment(event.date).format("HH:mm")}
          </div>
        ))
      )}
    </div>
  );
};

export default DayView;
