import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllProgramsInGrid } from "../../../services/database.mjs";
import { useState, useEffect } from "react";

const localizer = momentLocalizer(moment);
const myEventsList = []; //empty object for now

const MyCalendar = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const programs = await getAllProgramsInGrid();
        console.log(programs);
        const formattedEvents = programs.map((program) => ({
          id: program.programID,
          title: program.programName,
          start: new Date(program.date), // Ensure date is in correct format
          end: new Date(program.date), // Adjust if you have an end date/time
        }));
        setEvents(formattedEvents);
        // console.log(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={true}
      />
    </div>
  );
};

export default MyCalendar;
