import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllProgramsInGrid } from "../../../services/database.mjs";
import { useState, useEffect } from "react";

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const programs = await getAllProgramsInGrid();
        // console.log(programs);
        const formattedEvents = programs.map((program) => {
          // Default to the date if time is not provided
          const startDateTime = program.startTime
            ? new Date(
                `${program.date} ${new Date(
                  program.startTime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              )
            : new Date(program.date);
          const endDateTime = program.endTime
            ? new Date(
                `${program.date} ${new Date(program.endTime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`
              )
            : new Date(program.date);
          console.log(program.startTime);
          return {
            id: program.programID,
            title: program.programName,
            start: startDateTime,
            end: endDateTime,
          };
        });
        setEvents(formattedEvents);
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
