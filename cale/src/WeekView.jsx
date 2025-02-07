import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import "./index.css";
import Drawer from "./Drawer";

const WeekView = ({ currentDate, events, onAddEvent, onEventContextMenu, generateCalendar, namesDaysWeek, timeScale, setTimeScale }) => {
  const daysOfWeek = generateCalendar(currentDate, "week");
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const timeColumnRef = useRef(null); // Ref per la colonna delle ore
  const timeSlotRefs = useRef([]); // Array di refs per le celle delle ore

  const handleShowDrower = (event) => {
    setSelectedEvent(event);
    setShowDrawer(true);
  };

  const roundToNearestInterval = (time, interval) => {
    const minutes = time.minutes();
    const roundedMinutes = Math.round(minutes / interval) * interval;
    return time.clone().minutes(roundedMinutes).seconds(0); // Rimuovo i secondi per una maggiore precisione
  };

  const generateTimeSlots = () => {
    const slots = [];

    if (timeScale === 60) {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
          slots.push(moment().hour(hour).minute(minute).format("H:mm"));
        }
      }
    } else if (timeScale === 30) {
      for (let hour = 0; hour < 24; hour++) {
        slots.push(moment().hour(hour).minute(0).format("H:00"));
        slots.push(moment().hour(hour).minute(30).format("H:30"));
      }
    } else if (timeScale === 10) {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
          slots.push(moment().hour(hour).minute(minute).format("H:mm"));
        }
      }
    }

    return slots;
  };

  // Funzione per scorrere automaticamente alla cella dell'ora corrente
  useEffect(() => {
    const currentTime = moment();
    const roundedTime = roundToNearestInterval(currentTime, 10); // Arrotonda l'orario corrente ai 10 minuti più vicini

    let currentIndex = -1;

    generateTimeSlots().forEach((time, index) => {
      if (timeScale === 60 && time === currentTime.format("H:mm")) {
        currentIndex = index;
      } else if (timeScale === 30 && (time === currentTime.format("H:00") || time === currentTime.format("H:30"))) {
        currentIndex = index;
      } else if (timeScale === 10 && time === roundedTime.format("H:mm")) {
        currentIndex = index;
      }
    });

    if (currentIndex !== -1 && timeSlotRefs.current[currentIndex]) {
      timeSlotRefs.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentDate, timeScale]); // Ricarica ogni volta che cambia currentDate o timeScale

  const calculateEventStyle = (event, overlappingEvents, index, timeScale) => {
    const eventStart = moment(event.date);
    const startMinutes = eventStart.hours() * 60 + eventStart.minutes(); // Minuti dall'inizio della giornata
    const eventDuration = event.duration || 30; // Durata in minuti
    const totalMinutesInDay = 24 * 60;
    return {
      top: `${(startMinutes / totalMinutesInDay) * 100}%`, // Posizione in percentuale rispetto alla giornata
      height: `${(eventDuration / totalMinutesInDay) * 100}%`, // Altezza in percentuale rispetto alla giornata
      left: `${index * (100 / (overlappingEvents.length || 1))}%`,
      width: `${100 / (overlappingEvents.length || 1)}%`,
      position: "absolute",
      background: "rgba(33, 150, 243, 0.8)",
      color: "#fff",
      borderRadius: "4px",
      padding: "5px",
      boxSizing: "border-box",
      cursor: "pointer",
    };
  };

  return (
    <div className="week-view-container">
      <div className="time-column" ref={timeColumnRef}>
        {generateTimeSlots().map((time, index) => (
          <div
            key={index}
            className={`time-slot ${time === "niente" ? "none" : "visible"}`}
            ref={(el) => (timeSlotRefs.current[index] = el)} // Assegna il ref per ogni cella
          >
            {time !== "niente" ? timeScale === 30 || timeScale === 60 ? <div className="time-slot-inner">{time}</div> : time : ""}
          </div>
        ))}
      </div>

      <div className="week-view">
        {daysOfWeek.map((day) => {
          const dayEvents = events.filter((event) => moment(event.date).isSame(day, "day"));
          dayEvents.sort((a, b) => moment(a.date).diff(moment(b.date)));

          const isCurrentDay = moment().isSame(day, "day");
          const roundedTime = roundToNearestInterval(moment(), 10).format("H:mm");

          return (
            <div key={day.format("YYYY-MM-DD")} className={`day-column ${isCurrentDay ? "current-day" : ""}`}>
              <div className="day-body">
                {generateTimeSlots().map((time, index) => {
                  const isCurrentTime = roundedTime === time;
                  return <div key={index} className={`time-cell ${isCurrentTime ? "current-time" : ""}`}></div>;
                })}

                {dayEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="event"
                    style={calculateEventStyle(event, dayEvents, index, timeScale)}
                    onClick={() => handleShowDrower(event)}
                    onContextMenu={(e) => onEventContextMenu(event, e)}>
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showDrawer && <Drawer setShowDrawer={setShowDrawer} event={selectedEvent} />}
    </div>
  );
};

export default WeekView;
