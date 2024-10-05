import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { uuidv7 } from "uuidv7";
import {
  logTime,
  getHoursLoggedByUser,
  updateLog,
  deleteLog,
} from "../../../services/database.mjs";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import styles from "../../../styles/LogHours.module.css";

const WorkdayApp = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [logData, setLogData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({
    timeID: "",
    startTime: "",
    endTime: "",
    hours: 0,
    programName: "",
    approved: false,
  });
  const [isNewEntry, setIsNewEntry] = useState(true);
  const [loading, setLoading] = useState(true);

  const calendarRef = useRef(null);
  const toast = useRef(null);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    fetchUserLogs();
  }, [user]);

  const fetchUserLogs = async () => {
    try {
      setLoading(true);
      if (user) {
        const userLogs = await getHoursLoggedByUser(user.email);
        setLogData(userLogs);
      }
    } catch (error) {
      console.error("Error fetching user logs:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch logged hours.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getWeekDates = useCallback(() => {
    return days.map((day, index) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - currentDate.getDay() + index);
      return { day, date: formatDate(date), fullDate: new Date(date) };
    });
  }, [currentDate]);

  const weekDates = getWeekDates();

  const handlePrevWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateSelect = (e) => {
    const date = e.value;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    setCurrentDate(startOfWeek);
  };

  const handleSlotClick = (date, hour, existingEntry = null) => {
    const formattedHour = hour.toString().padStart(2, "0");
    if (existingEntry) {
      if (existingEntry.approved) {
        toast.current.show({
          severity: "warn",
          summary: "Cannot Edit",
          detail: "Approved entries cannot be edited.",
        });
        return;
      }
      setCurrentEntry(existingEntry);
      setIsNewEntry(false);
    } else {
      setCurrentEntry({
        timeID: uuidv7(),
        date: date.toISOString().split("T")[0],
        programName: "",
        startTime: `${formattedHour}:00`,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        hours: 1,
        approved: false,
      });
      setIsNewEntry(true);
    }
    setSelectedSlot({ date, hour });
    setModalOpen(true);
  };

  const handleEntryChange = (field, value) => {
    setCurrentEntry((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "startTime" || field === "endTime") {
        const start = new Date(`2000-01-01T${updated.startTime}`);
        const end = new Date(`2000-01-01T${updated.endTime}`);
        const diff = (end - start) / (1000 * 60 * 60);
        updated.hours = Math.max(0, diff);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!currentEntry.programName) {
      toast.current.show({
        severity: "error",
        summary: "Invalid Entry",
        detail: "Please fill in all required fields.",
      });
      return;
    }
    if (currentEntry.hours <= 0 || isNaN(currentEntry.hours)) {
      toast.current.show({
        severity: "error",
        summary: "Invalid Entry",
        detail: "Hours must be greater than 0.",
      });
      return;
    }

    const isOverlapping = logData.some(
      (entry) =>
        entry.date === currentEntry.date &&
        entry.timeID !== currentEntry.timeID &&
        new Date(`${entry.date}T${entry.startTime}`) <
          new Date(`${currentEntry.date}T${currentEntry.endTime}`) &&
        new Date(`${entry.date}T${entry.endTime}`) >
          new Date(`${currentEntry.date}T${currentEntry.startTime}`)
    );

    if (isOverlapping) {
      toast.current.show({
        severity: "error",
        summary: "Overlapping Entry",
        detail: "This time slot overlaps with an existing entry.",
      });
      return;
    }

    try {
      if (isNewEntry) {
        const newLog = await logTime(user.email, currentEntry);
        setLogData((prevLogs) => [...prevLogs, newLog]);
      } else {
        await updateLog(user.email, currentEntry.timeID, currentEntry);
        setLogData((prevLogs) =>
          prevLogs.map((log) =>
            log.timeID === currentEntry.timeID ? currentEntry : log
          )
        );
      }

      setModalOpen(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: isNewEntry ? "Time entry added." : "Time entry updated.",
      });
    } catch (error) {
      console.error("Error submitting log:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to submit time entry.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLog(user.email, currentEntry.timeID);
      const dateKey = selectedSlot.date.toISOString().split("T")[0];
      setLogData((prevLogs) =>
        prevLogs.filter((log) => log.timeID !== currentEntry.timeID)
      );
      setModalOpen(false);
      toast.current.show({
        severity: "info",
        summary: "Deleted",
        detail: "Time entry deleted.",
      });
    } catch (error) {
      console.error("Error deleting log:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete time entry.",
      });
    }
  };

  const calculateWeekTotalHours = useCallback(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeekString = startOfWeek.toISOString().split("T")[0];

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);
    endOfWeek.setHours(23, 59, 59, 999);
    const endOfWeekString = endOfWeek.toISOString().split("T")[0];

    return logData.reduce((total, entry) => {
      if (entry.date >= startOfWeekString && entry.date <= endOfWeekString) {
        return total + entry.hours || 0;
      }
      return total;
    }, 0);
  }, [logData, currentDate]);

  const renderSummary = () => {
    const totalHours = calculateWeekTotalHours();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return (
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Summary</h2>
          <h3 className={styles.summaryDate}>
            {`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`}
          </h3>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total Hours</span>
            <span className={styles.summaryTotalHours}>
              {totalHours.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderTimeSlot = (date, hour) => {
    const dateKey = date.toISOString().split("T")[0];
    const entries = logData.filter((log) => log.date === dateKey);
    const existingEntries = entries.filter((entry) => {
      const startHour = parseInt(entry.startTime.split(":")[0]);
      const endHour = parseInt(entry.endTime.split(":")[0]);
      const endMinutes = parseInt(entry.endTime.split(":")[1]);
      return (
        startHour === hour ||
        (hour > startHour && hour < endHour) ||
        (hour === endHour && endMinutes > 0)
      );
    });

    return (
      <div className={styles.hourSlot}>
        {existingEntries.map((existingEntry, index) => {
          const startHour = parseInt(existingEntry.startTime.split(":")[0]);
          const startMinutes = parseInt(existingEntry.startTime.split(":")[1]);
          const endHour = parseInt(existingEntry.endTime.split(":")[0]);
          const endMinutes = parseInt(existingEntry.endTime.split(":")[1]);

          let topOffset = 0;
          let height = 100;

          if (startHour === hour) {
            topOffset = (startMinutes / 60) * 100;
          }

          if (endHour === hour) {
            height = (endMinutes / 60) * 100;
          }

          const totalDuration =
            endHour - startHour + (endMinutes - startMinutes) / 60;
          const totalHeightPercentage = totalDuration * 100;

          if (startHour === hour) {
            return (
              <div
                key={index}
                className={classNames(styles.entrySlot, {
                  [styles.entrySlotApproved]: existingEntry.approved,
                  [styles.entrySlotNotApproved]: !existingEntry.approved,
                })}
                onClick={() => handleSlotClick(date, startHour, existingEntry)}
                style={{
                  position: "absolute",
                  top: `${topOffset}%`,
                  height: `${totalHeightPercentage}%`,
                  width: "100%",
                  zIndex: 2,
                }}
              >
                <div
                  className={styles.bgStripe}
                  style={{ height: "100%" }}
                ></div>
                <div className={styles.entryContent}>
                  <div className={styles.entryProgramName}>
                    {existingEntry.programName}
                  </div>
                  <div className={styles.entryTime}>
                    {existingEntry.startTime} - {existingEntry.endTime}
                  </div>
                  <div className={styles.entryHours}>
                    {existingEntry.hours.toFixed(2)} Hours
                  </div>
                </div>
              </div>
            );
          }
          return null; // Don't render anything for continuation hours
        })}
        <div
          className={`${styles.daySlot} ${styles.emptySlot}`}
          onClick={() => handleSlotClick(date, hour)}
        ></div>
      </div>
    );
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
      <div className={styles.container}>
        <Toast ref={toast} />
        <div className={styles.header}>
          <div className={styles.headerControls}>
            <Button label="Today" onClick={handleToday} outlined />
            <Button
              icon="pi pi-chevron-left"
              onClick={handlePrevWeek}
              outlined
            />
            <Button
              icon="pi pi-chevron-right"
              onClick={handleNextWeek}
              outlined
            />
            <OverlayPanel ref={calendarRef} showCloseIcon>
              <Calendar
                value={currentDate}
                onChange={handleDateSelect}
                inline
              />
            </OverlayPanel>
            <Button
              label={`${weekDates[0].date} - ${
                weekDates[6].date
              }, ${currentDate.getFullYear()}`}
              icon="pi pi-chevron-down"
              onClick={(e) => calendarRef.current.toggle(e)}
              outlined
            />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.calendar}>
            <div className={styles.timeColumn}>
              <div className={styles.timeColumnHeader}></div>
              {hours.map((hour) => (
                <div key={hour} className={styles.timeSlot}>
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </div>
              ))}
            </div>
            <div className={styles.daysContainer}>
              <div className={styles.daysHeader}>
                {weekDates.map((day, index) => (
                  <div key={index} className={styles.dayHeader}>
                    <div className={styles.dayName}>{day.day}</div>
                    <div className={styles.dayDate}>{day.date}</div>
                  </div>
                ))}
              </div>
              <div className={styles.daysContent}>
                {weekDates.map((day, dayIndex) => (
                  <div key={dayIndex} className={styles.dayColumn}>
                    {hours.map((hour) => (
                      <div
                        key={`${dayIndex}-${hour}`}
                        className={styles.hourSlot}
                      >
                        {renderTimeSlot(day.fullDate, hour)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.summaryContainer}>{renderSummary()}</div>
        </div>

        <Dialog
          header={isNewEntry ? "Log Hours" : "Edit Hours"}
          visible={modalOpen}
          onHide={() => setModalOpen(false)}
          className={styles.dialog}
          footer={
            <div>
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setModalOpen(false)}
                className="p-button-text"
              />
              {!isNewEntry && (
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  onClick={handleDelete}
                  className="p-button-danger"
                />
              )}
              <Button
                label="Submit"
                icon="pi pi-check"
                onClick={handleSubmit}
                autoFocus
              />
            </div>
          }
        >
          <div className={styles.form}>
            <div className={styles.formField}>
              <label htmlFor="selected-date">Selected Date</label>
              <InputText
                id="selected-date"
                value={selectedSlot ? selectedSlot.date.toDateString() : ""}
                disabled
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="program-name">Program Name *</label>
              <InputText
                id="program-name"
                value={currentEntry.programName}
                onChange={(e) =>
                  handleEntryChange("programName", e.target.value)
                }
                required={true}
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="start-time">Start Time (24hr format)</label>
              <InputText
                id="start-time"
                value={currentEntry.startTime}
                onChange={(e) => handleEntryChange("startTime", e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="end-time">End Time (24hr format)</label>
              <InputText
                id="end-time"
                value={currentEntry.endTime}
                onChange={(e) => handleEntryChange("endTime", e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="hours">Hours</label>
              <InputNumber
                id="hours"
                value={currentEntry.hours}
                onValueChange={(e) => handleEntryChange("hours", e.value)}
                mode="decimal"
                minFractionDigits={2}
                maxFractionDigits={2}
                min={0}
                disabled
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default WorkdayApp;
