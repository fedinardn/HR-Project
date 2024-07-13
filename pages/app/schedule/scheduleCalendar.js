import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllProgramsInGrid } from "../../../services/database.mjs";
import { useState, useEffect, useCallback, useRef } from "react";
import programDialog from "./scheduleTest";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { randomId } from "@mui/x-data-grid-generator";
import { updateProgramInGrid } from "../../../services/database.mjs";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const [events, setEvents] = useState([]);
  const [programDialog, setProgramDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [editable, setEditable] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [program, setProgram] = useState({
    id: randomId(),
    programName: "",
    date: "",
    startTime: "",
    endTime: "",
    clientType: "",
    locationAndProgram: "",
    groupSize: "",
    contactPerson: "",
    contactPersonEmail: "",
    facilitators: [],
    facilitatorEmails: [],
    notes: "",
    facilitatorsNeeded: {
      Lead: "",
      Belayers: "",
      "Low and High": "",
      TA: "",
      Support: "",
      Van: "",
    },
  });

  const toast = useRef(null);

  const [facilitators] = useState([
    { name: "John Doe", email: "JD@gmail.com" },
    { name: "Jane Smith", email: "JS@gmail.com" },
    { name: "Michael Johnson", email: "MJ@gmail.com" },
    // Add more facilitators as needed
  ]);

  const hideDialog = () => {
    setProgramDialog(false);
    setSubmitted(false);
    fetchEvents();
  };

  // const handleSelectEvent = (event) => {
  //   setSelectedProgram(event);
  //   setProgram(event);
  //   setProgramDialog(true);
  // };

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const saveProgram = async () => {
    let _program = { ...program };

    await updateProgramInGrid(_program.id, _program);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Program Edited Successfully",
      life: 3000,
    });
    setProgramDialog(false);
    setEditable(false);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _program = { ...program };
    _program[`${name}`] = val;

    setProgram(_program);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || "";
    let _program = { ...program };
    _program[`${name}`] = val;

    setProgram(_program);
  };

  const onCalendarChange = (e, name) => {
    const val = e.value || null;
    let _program = { ...program };
    _program[`${name}`] = val;

    setProgram(_program);
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < programs.length; i++) {
      if (programs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const onFacilitatorChange = (e, role) => {
    const val = (e.target && e.target.value) || "";
    let _program = { ...program };

    _program.facilitatorsNeeded[role] = val;

    setProgram(_program);
  };

  const addFacilitatorRole = () => {
    const role = prompt("Enter the new role:");
    if (role && !program.facilitatorsNeeded[role]) {
      let _program = { ...program };
      _program.facilitatorsNeeded[role] = "";
      setProgram(_program);
    }
  };

  const FacilitatorsMultiSelect = ({
    facilitators,
    selectedFacilitators,
    onChange,
  }) => {
    return (
      <div className="card flex justify-content-center">
        <MultiSelect
          value={program.facilitators}
          onChange={onChange}
          options={facilitators}
          optionLabel="name"
          filter
          display="chip"
          placeholder="Select Facilitators"
          className="w-full md:w-100rem"
          disabled={!editable}
        />
      </div>
    );
  };

  const handleFacilitatorsChange = (e) => {
    let selectedFacilitators = e.value;
    let facilitatorEmails = selectedFacilitators.map(
      (facilitator) => facilitator.email
    );

    setProgram({
      ...program,
      facilitators: selectedFacilitators,
      facilitatorEmails: facilitatorEmails,
    });
  };

  const ClientTypeDropdown = ({ onChange }) => {
    const clientTypes = ["STU", "NON-CU-STU", "CUP", "PDP", "COMMYTH"];

    return (
      <div className="card flex justify-content-center">
        <Dropdown
          value={program.clientType}
          onChange={onChange}
          options={clientTypes}
          optionLabel="name"
          placeholder="Select Client Type"
          className="w-full md:w-100rem"
          disabled={!editable}
        />
      </div>
    );
  };

  const handleClientTypeChange = (e) => {
    let _program = { ...program };
    try {
      const updatedProgram = { ..._program, clientType: e.value };

      setProgram(updatedProgram);
    } catch (error) {
      console.error("Error updating program details:", error);
    }
  };

  const programDialogFooter = (
    <>
      <div>
        {!editable ? (
          <Button label="Edit" icon="pi pi-pencil" onClick={toggleEditable} />
        ) : (
          <>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={toggleEditable}
              className="p-button-text"
            />
            <Button label="Save" icon="pi pi-check" onClick={saveProgram} />
          </>
        )}
      </div>
    </>
  );

  const onSelectEvent = useCallback((calEvent) => {
    // setSelectedProgram(calEvent);
    setProgram(calEvent);
    // console.log(program);
    // console.log(calEvent);
    setProgramDialog(true);
  }, []);

  const fetchEvents = async () => {
    try {
      const programs = await getAllProgramsInGrid();
      // console.log(programs);
      const formattedEvents = programs.map((program) => {
        // Default to the date if time is not provided
        const startDateTime = program.startTime
          ? new Date(
              `${program.date} ${new Date(program.startTime).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}`
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
        // console.log(program.startTime);
        return {
          id: program.programID,
          title: program.programName,
          start: startDateTime,
          end: endDateTime,
          programName: program.programName,
          date: program.date,
          startTime: program.startTime,
          endTime: program.endTime,
          clientType: program.clientType,
          locationAndProgram: program.locationAndProgram,
          groupSize: program.groupSize,
          contactPerson: program.contactPerson,
          contactPersonEmail: program.contactPersonEmail,
          facilitators: program.facilitators,
          facilitatorEmails: program.facilitatorEmails,
          notes: program.notes,
          contractSent: program.contractSent,
          cancelled: program.cancelled,
          facilitatorsNeeded: program.facilitatorsNeeded,
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <Toast ref={toast} />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={true}
        onSelectEvent={onSelectEvent}
      />

      {program && (
        <Dialog
          visible={programDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Program Details"
          modal
          className="p-fluid"
          footer={programDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="programName">Program Name</label>
            <InputText
              id="programName"
              value={program.programName}
              onChange={(e) => onInputChange(e, "programName")}
              required
              autoFocus
              readOnly={!editable}
            />
            {submitted && !program.programName && (
              <small className="p-invalid">Program Name is required.</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <PrimeCalendar
              id="date"
              value={program.date ? new Date(program.date) : program.date}
              onChange={(e) => onCalendarChange(e, "date")}
              showIcon
              disabled={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="startTime">Start Time</label>
            <PrimeCalendar
              id="startTime"
              value={
                program.startTime
                  ? new Date(program.startTime)
                  : program.startTime
              }
              onChange={(e) => onInputChange(e, "startTime")}
              showIcon
              timeOnly
              hourFormat="12"
              icon={() => <i className="pi pi-clock" />}
              disabled={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="endTime">End Time</label>
            <PrimeCalendar
              id="endTime"
              value={
                program.endTime ? new Date(program.endTime) : program.endTime
              }
              onChange={(e) => onInputChange(e, "endTime")}
              showIcon
              timeOnly
              hourFormat="12"
              icon={() => <i className="pi pi-clock" />}
              disabled={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="clientType">Client Type</label>

            <ClientTypeDropdown
              id="clientType"
              value={program.clientType}
              onChange={handleClientTypeChange}
            />
          </div>

          <div className="field">
            <label htmlFor="locationAndProgram">Location and Program</label>
            <InputText
              id="locationAndProgram"
              value={program.locationAndProgram}
              onChange={(e) => onInputChange(e, "locationAndProgram")}
              readOnly={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="groupSize">Group Size</label>
            <InputNumber
              id="groupSize"
              value={program.groupSize}
              onValueChange={(e) => onInputNumberChange(e, "groupSize")}
              integeronly
              readOnly={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="contactPerson">Contact Person</label>
            <InputText
              id="contactPerson"
              value={program.contactPerson}
              onChange={(e) => onInputChange(e, "contactPerson")}
              readOnly={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="contactPersonEmail">Contact Person Email</label>
            <InputText
              id="contactPersonEmail"
              value={program.contactPersonEmail}
              onChange={(e) => onInputChange(e, "contactPersonEmail")}
              readOnly={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="facilitators">Facilitators</label>
            <FacilitatorsMultiSelect
              facilitators={facilitators}
              onChange={handleFacilitatorsChange}
            />
          </div>

          <div className="field">
            <label htmlFor="facilitatorEmails">Facilitator Emails</label>
            <InputText
              id="facilitatorEmails"
              value={program.facilitatorEmails}
              onChange={(e) => onInputChange(e, "facilitatorEmails")}
              disabled
            />
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <InputTextarea
              id="notes"
              value={program.notes}
              onChange={(e) => onInputChange(e, "notes")}
              readOnly={!editable}
            />
          </div>

          <div className="field">
            <label htmlFor="facilitatorsNeeded" className="font-bold">
              Facilitators Needed
            </label>
            <div id="facilitatorsNeeded">
              {program.facilitatorsNeeded &&
                Object.entries(program.facilitatorsNeeded).map(
                  ([role, count], index) => (
                    <div key={index} className="field">
                      <label style={{ width: "120px" }}>{role}</label>
                      <InputText
                        value={count}
                        onChange={(e) => onFacilitatorChange(e, role)}
                        readOnly={!editable}
                      />
                    </div>
                  )
                )}
              <Button
                label="Add Role"
                icon="pi pi-plus"
                onClick={addFacilitatorRole}
                className="p-mt-2"
                s
                disabled={!editable}
              />
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default MyCalendar;
