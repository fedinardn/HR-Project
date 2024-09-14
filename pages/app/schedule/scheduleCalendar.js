import React, { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getAllProgramsInGrid,
  getUserPermission,
  updateProgramInGrid,
  getAllStaff,
} from "../../../services/database.mjs";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import ProgramDialog from "../../../components/ProgramDialog";

const localizer = momentLocalizer(moment);

const MyCalendar = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [programDialog, setProgramDialog] = useState(false);
  const [program, setProgram] = useState(null);
  const [editable, setEditable] = useState(false);
  const [userPermission, setUserPermission] = useState("");
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const onSelectEvent = useCallback((calEvent) => {
    setProgram(calEvent);
    setProgramDialog(true);
    setEditable(false);
  }, []);

  const hideDialog = () => {
    setProgramDialog(false);
    setProgram(null);
    setEditable(false);
  };

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (user) {
        const programs = await getAllProgramsInGrid();
        const permission = await getUserPermission(user.email);
        setUserPermission(permission);

        const formattedEvents = programs.map((program) => {
          const startDateTime =
            program.startTime && program.date
              ? new Date(
                  `${program.date} ${new Date(
                    program.startTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                )
              : new Date(program.date);
          const endDateTime =
            program.endTime && program.date
              ? new Date(
                  `${program.date} ${new Date(
                    program.endTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                )
              : new Date(program.date);

          return {
            id: program.programID,
            start: startDateTime,
            end: endDateTime,
            ...program,
          };
        });

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load calendar events",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilitators = async () => {
    try {
      const staff = await getAllStaff();
      const formattedStaff = staff.map((item) => ({
        id: item.staffID,
        name: `${item.firstName} ${item.lastName}`,
        email: item.email,
        phone: item.phone,
      }));
      setFacilitators(formattedStaff);
    } catch (error) {
      console.error("Error fetching facilitators:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load facilitators",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchFacilitators()]);
      setLoading(false);
    };
    loadData();
  }, [user]);

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: "#3174ad",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };

    if (event.cancelled) {
      style.backgroundColor = "#e57373";
    }

    return {
      style: style,
    };
  };

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <Toast ref={toast} />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="programName"
        style={{ height: 500 }}
        selectable={true}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      {program && (
        <ProgramDialog
          visible={programDialog}
          program={program}
          editable={editable}
          onHide={hideDialog}
          onSave={fetchEvents}
          onEdit={toggleEditable}
          facilitators={facilitators}
          userPermission={userPermission}
        />
      )}
    </div>
  );
};

export default MyCalendar;
