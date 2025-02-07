import React from "react";
import moment from "moment";
moment.locale("it");

const HeaderCalendar = ({
  currentDate,
  currentView,
  setCurrentDate,
  daysOfWeek,
  handleViewChange,
  namesDaysWeek,
  monthsOfYear,
  showView = false,
  showNamesDay = false,
  viewScaleTime = false,
  timeScale,
  setTimeScale,
  generateCalendar,
  onAddEvent,
  showDayOfWeek = false,
}) => {
  const handleNext = () => {
    if (currentView === "month") setCurrentDate((prev) => moment(prev).add(1, "month")); // mi assicuro che prev sia un oggetto moment
    if (currentView === "week") setCurrentDate((prev) => moment(prev).add(1, "week"));
    if (currentView === "day") setCurrentDate((prev) => moment(prev).add(1, "day"));
  };

  const handlePrevious = () => {
    if (currentView === "month") setCurrentDate((prev) => moment(prev).subtract(1, "month")); // mi assicuro che prev sia un oggetto moment
    if (currentView === "week") setCurrentDate((prev) => moment(prev).subtract(1, "week"));
    if (currentView === "day") setCurrentDate((prev) => moment(prev).subtract(1, "day"));
  };

  let format = "";
  if (currentView === "month") {
    const monthName = currentDate.format("MMMM"); // recupero il nome del mese in inglese
    const translatedMonth = monthsOfYear[monthName]; // Traduco il mese
    format = `${translatedMonth} ${currentDate.format("YYYY")}`; // Uso il mese tradotto
  } else if (currentView === "week") {
    const momentCurrentDate = moment(currentDate); // controllo che sia un moment obj
    const startOfWeek = momentCurrentDate.clone().startOf("week"); // calcolo il primo giorno della settimana
    const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, "day")); // genero gg settimana
    const firstDay = weekDays[0]; // prendi il 1° day
    const lastDay = weekDays[weekDays.length - 1]; // prendi ultimo day

    const translatedMonth = monthsOfYear[currentDate.format("MMMM")]; // Traduci il mese in italiano

    format = `${firstDay.date()} - ${lastDay.date()} ${translatedMonth} ${currentDate.format("YYYY")}`; // Usa il mese tradotto
  } else if (currentView === "day") {
    format = (
      <>
        {currentDate.format("D")} {monthsOfYear[currentDate.format("MMMM")]} {currentDate.format("YYYY")}
      </>
    );
  }

  const daysOfWeekAdd = generateCalendar(currentDate, "week");

  return (
    <div className="headerCalendar">
      {showView && (
        <div className="controls">
          <button onClick={() => handleViewChange("month")}>Mese</button>
          <button onClick={() => handleViewChange("week")}>Settimana</button>
          <button onClick={() => handleViewChange("day")}>Giorno</button>
        </div>
      )}

      {viewScaleTime && (
        <div className="controls">
          <label>Scala temporale: </label>
          <select value={timeScale} onChange={(e) => setTimeScale(Number(e.target.value))}>
            <option value={60}>60 min</option>
            <option value={30}>30 min</option>
            <option value={10}>10 min</option>
          </select>
        </div>
      )}
      <div className="headerTop">
        <button onClick={handlePrevious}>Indietro</button>
        <p>{format}</p>
        <button onClick={handleNext}>Avanti</button>
      </div>
      {showNamesDay ? (
        <div className="dayName">
          {daysOfWeek.map((dayName, index) => (
            <p key={index}>{dayName}</p>
          ))}
        </div>
      ) : null}

      {showDayOfWeek && (
        <div className="wrapperDaysOfWeekAdd">
          <div className="timeDaysOfWeekAdd"></div>

          {daysOfWeekAdd.map((day) => {
            return (
              <div key={day.format("YYYY-MM-DD")} className="day-column">
                <div className="day-header">
                  {day.format("D ")}
                  {namesDaysWeek[day.format("dddd")].slice(0, 3)}
                  <button className="add-event-btn" onClick={() => onAddEvent(null, day)}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeaderCalendar;
