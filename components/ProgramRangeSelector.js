import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";

const ProgramRangeSelector = ({ programs }) => {
  const [visible, setVisible] = useState(false);
  const [dates, setDates] = useState(null);
  const [email, setEmail] = useState("");
  const toast = useRef(null);

  const handleSend = async () => {
    if (!dates || !dates[0] || !dates[1]) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a date range",
        life: 3000,
      });
      return;
    }

    if (!email) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter an email address",
        life: 3000,
      });
      return;
    }

    const filteredPrograms = filterProgramsByDateRange(programs);
    const formattedPrograms = formatPrograms(filteredPrograms);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          programs: formattedPrograms,
        }),
      });

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Email sent successfully",
          life: 3000,
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to send email",
        life: 3000,
      });
    }
    setDates(null);
    setEmail("");

    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    setDates(null);
    setEmail("");
  };

  const filterProgramsByDateRange = (programs) => {
    if (!dates || !dates[0] || !dates[1]) return programs;

    const startDate = dates[0].getTime();
    const endDate = dates[1].getTime();

    return programs.filter((program) => {
      const programDate = new Date(program.date).getTime();
      return (
        programDate >= startDate &&
        programDate <= endDate &&
        hasFacilitatorNeeds(program.facilitatorsNeeded)
      );
    });
  };

  const hasFacilitatorNeeds = (facilitatorsNeeded) => {
    return Object.values(facilitatorsNeeded).some(
      (value) => value && value !== "0"
    );
  };

  const formatPrograms = (programs) => {
    return programs.map((program) => ({
      programName: program.programName,
      date: program.date
        ? new Date(program.date).toLocaleDateString()
        : "Not specified",
      startTime: formatTime(program.startTime),
      endTime: formatTime(program.endTime),
      facilitatorsNeeded: formatFacilitatorsNeeded(program.facilitatorsNeeded),
    }));
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFacilitatorsNeeded = (facilitatorsNeeded) => {
    return Object.entries(facilitatorsNeeded)
      .filter(([_, value]) => value && value !== "0")
      .map(([key, value]) => `${value} ${key}`)
      .join(", ");
  };

  const footer = (
    <div>
      <Button label="Send" icon="pi pi-check" onClick={handleSend} />
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={handleCancel}
        className="p-button-text"
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Button
        label="Send Staffing Email"
        icon="pi pi-envelope"
        onClick={() => setVisible(true)}
      />
      <Dialog
        header="Select Date Range and Email"
        visible={visible}
        style={{ width: "50vw" }}
        footer={footer}
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid">
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            style={{ minWidth: "350px" }}
            placeholder="MM/DD/YYYY - MM/DD/YYYY"
          />
          <InputText
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="mt-3"
          />
        </div>
      </Dialog>
    </>
  );
};

export default ProgramRangeSelector;
