import { useState } from "react";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import EventModal from "./EventModal";
import moment from "moment";
import "./index.css";
import HeaderCalendar from "./HeaderCalendar";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState("week");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [timeScale, setTimeScale] = useState(10); // Scala temporale dinamica (60, 30, 10 minuti)
  const daysOfWeek = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  const namesDaysWeek = {
    Sunday: "Domenica",
    Monday: "Lunedì",
    Tuesday: "Martedì",
    Wednesday: "Mercoledì",
    Thursday: "Giovedì",
    Friday: "Venerdì",
    Saturday: "Sabato",
  };

  const monthsOfYear = {
    January: "Gennaio",
    February: "Febbraio",
    March: "Marzo",
    April: "Aprile",
    May: "Maggio",
    June: "Giugno",
    July: "Luglio",
    August: "Agosto",
    September: "Settembre",
    October: "Ottobre",
    November: "Novembre",
    December: "Dicembre",
  };

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(moment(newDate));
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const openModal = (event = null, date = null) => {
    setSelectedEvent(event);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleContextMenu = (event, e) => {
    e.preventDefault();
    setSelectedEvent(event);
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleClickOutsideContextMenu = () => {
    setShowContextMenu(false);
  };

  const generateCalendar = (currentDate, view) => {
    const date = moment(currentDate);

    if (view === "month") {
      const startOfMonth = date.clone().startOf("month");
      const daysInMonth = date.daysInMonth();
      const startDay = (startOfMonth.day() + 6) % 7;
      return { startDay, daysInMonth };
    }

    if (view === "week") {
      const startOfWeek = date.clone().startOf("week");
      return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, "days"));
    }

    if (view === "day") {
      return date;
    }
  };

  return (
    <div className="calendar" onClick={handleClickOutsideContextMenu}>
      <HeaderCalendar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        currentView={view}
        daysOfWeek={daysOfWeek}
        handleViewChange={handleViewChange}
        namesDaysWeek={namesDaysWeek}
        monthsOfYear={monthsOfYear}
        showNamesDay={view === "month"}
        showView
        viewScaleTime={view === "week"}
        timeScale={timeScale}
        setTimeScale={setTimeScale}
        generateCalendar={generateCalendar}
        onAddEvent={openModal}
        showDayOfWeek={view === "week"}
      />

      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          events={events}
          onDateChange={handleDateChange}
          onAddEvent={openModal}
          onEventContextMenu={handleContextMenu}
          generateCalendar={generateCalendar}
        />
      )}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          events={events}
          onDateChange={handleDateChange}
          onAddEvent={openModal}
          onEventClick={openModal}
          onEventContextMenu={handleContextMenu}
          generateCalendar={generateCalendar}
          namesDaysWeek={namesDaysWeek}
          timeScale={timeScale}
          setTimeScale={setTimeScale}
        />
      )}
      {view === "day" && (
        <DayView
          currentDate={currentDate}
          events={events}
          onAddEvent={openModal}
          onDateChange={handleDateChange}
          onEventClick={openModal}
          onEventContextMenu={handleContextMenu}
          generateCalendar={generateCalendar}
          namesDaysWeek={namesDaysWeek}
        />
      )}

      {isModalOpen && (
        <EventModal event={selectedEvent} date={selectedDate} onSave={selectedEvent ? updateEvent : addEvent} onDelete={deleteEvent} onClose={closeModal} />
      )}

      {showContextMenu && (
        <div className="context-menu" style={{ top: contextMenuPos.y, left: contextMenuPos.x }}>
          <button onClick={() => openModal(selectedEvent)}>Modifica</button>
          <button onClick={() => deleteEvent(selectedEvent.id)}>Elimina</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
