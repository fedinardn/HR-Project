// import { FileUpload } from "primereact/fileupload";
// import { RadioButton } from "primereact/radiobutton";
// import { Tag } from "primereact/tag";

import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";

import { InputTextarea } from "primereact/inputtextarea";
import classNames from "primereact/utils";
import { format } from "date-fns";
import { randomId } from "@mui/x-data-grid-generator";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {
  getAllProgramsInGrid,
  createNewProgramInGrid,
  updateProgramInGrid,
  deleteProgramInGrid,
} from "../../../services/database.mjs";

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
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
    underAgeParticipants: false,
    facilitators: [],
    facilitatorEmails: [],
    notes: "",
    returningClient: false,
    contractSent: false,
    preProgramEmail: false,
    packetReady: false,
    packetProcessed: false,
    followUp: false,
    cancelled: false,
    facilitatorsNeeded: {
      Lead: "",
      Belayers: "",
      "Low and High": "",
      TA: "",
      Support: "",
      Van: "",
    },
  });

  const [programDialog, setProgramDialog] = useState(false);
  const [deleteProgramDialog, setDeleteProgramDialog] = useState(false);
  const [deleteProgramsDialog, setDeleteProgramsDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState(null);
  const [editable, setEditable] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const globalFilterFields = [
    "programName",
    "date",
    "facilitators",
    "contactPerson",
    "contactPersonEmail",
    "locationAndProgram",
  ];
  const [facilitators] = useState([
    { name: "John Doe", email: "JD@gmail.com" },
    { name: "Jane Smith", email: "JS@gmail.com" },
    { name: "Michael Johnson", email: "MJ@gmail.com" },
    // Add more facilitators as needed
  ]);

  const toast = useRef(null);
  const dt = useRef(null);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const fetchData = async () => {
    try {
      const data = await getAllProgramsInGrid();
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const header = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0">Manage Programs</h4>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </IconField>
      </div>
    );
  };
  const openNew = () => {
    setProgram({
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
      underAgeParticipants: false,
      facilitators: [],
      facilitatorEmails: [],
      notes: "",
      returningClient: false,
      contractSent: false,
      preProgramEmail: false,
      packetReady: false,
      packetProcessed: false,
      followUp: false,
      cancelled: false,
      facilitatorsNeeded: {
        Lead: "",
        Belayers: "",
        "Low and High": "",
        TA: "",
        Support: "",
        Van: "",
      },
      isNew: true,
    });
    setSubmitted(false);
    setProgramDialog(true);
    setEditable(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedPrograms || !selectedPrograms.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProgramDialog(false);
  };

  const hideDeleteProgramDialog = () => {
    setDeleteProgramDialog(false);
  };

  const hideDeleteProgramsDialog = () => {
    setDeleteProgramsDialog(false);
  };

  const showProgramDetails = (program) => {
    setProgram({ ...program.data });
    console.log(program);
    setProgramDialog(true);
    setEditable(false);
  };

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const confirmDeleteSelected = () => {
    setDeleteProgramsDialog(true);
  };

  const saveProgram = async () => {
    let _programs = [...programs];
    let _program = { ...program };

    if (!_program.isNew) {
      await updateProgramInGrid(_program.programID, _program);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Program Edited Successfully",
        life: 3000,
      });
    } else {
      setSubmitted(true);
      await createNewProgramInGrid(
        _program.id,
        _program.programName,
        _program.date,
        _program.startTime,
        _program.endTime,
        _program.clientType,
        _program.locationAndProgram,
        _program.groupSize,
        _program.contactPerson,
        _program.contactPersonEmail,
        _program.notes,
        _program.facilitators,
        _program.facilitatorsNeeded
      );
      _programs.push(_program);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Program Created Successfully",
        life: 3000,
      });
    }

    // setSubmitted(true);
    // setPrograms(_programs);
    setProgramDialog(false);
    fetchData();
  };

  const editProgram = (program) => {
    setProgram({ ...program });
    setProgramDialog(true);
    setEditable(true);
  };

  const confirmDeleteProgram = (program) => {
    setProgram(program);
    setDeleteProgramDialog(true);
  };

  const deleteProgram = async () => {
    let _program = { ...program };

    setPrograms(programs.filter((row) => row.programID !== _program.programID));

    await deleteProgramInGrid(_program.programID);
    setDeleteProgramDialog(false);
    fetchData();
  };

  const deleteSelectedPrograms = async () => {
    let _programs = programs.filter((val) => !selectedPrograms.includes(val));

    for (let program of selectedPrograms) {
      await deleteProgramInGrid(program.programID);
    }

    setPrograms(_programs);

    setDeleteProgramsDialog(false);

    setSelectedPrograms(null);

    fetchData();
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Programs Deleted",
      life: 3000,
    });
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

  const handleCheckboxChange = async (field, value) => {
    let _program = { ...program };
    try {
      const updatedProgram = { ..._program, [field]: value };
      setProgram(updatedProgram);
    } catch (error) {
      console.error("Error updating program details:", error);
    }
  };

  const formatFacilitatorsNeeded = (facilitatorsNeeded) => {
    const formattedText = Object.entries(facilitatorsNeeded)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${value} ${key}`)
      .join(", ");

    return formattedText ? `NEED ${formattedText}` : null;
  };

  const facilitatorsNeededBodyTemplate = (rowData) => {
    const formattedText = formatFacilitatorsNeeded(rowData.facilitatorsNeeded);

    return formattedText ? (
      <Message severity="warn" text={formattedText} />
    ) : (
      <Message severity="success" text="No facilitators needed" />
    );
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
            {/* <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={hideDialog}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-text"
              onClick={saveProgram}
            /> */}
          </>
        )}
      </div>
    </>
  );

  const deleteProgramDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProgramDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProgram}
      />
    </>
  );

  const deleteProgramsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProgramsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedPrograms}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />

      <Toolbar
        className="mb-4"
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />
      <div className="card">
        <DataTable
          ref={dt}
          value={programs}
          selection={selectedPrograms}
          onSelectionChange={(e) => [setSelectedPrograms(e.value)]}
          dataKey={program.programID}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} programs"
          globalFilter={globalFilter}
          globalFilterFields={globalFilterFields}
          header={header}
          sortMode="multiple"
          resizableColumns={true}
          reorderableColumns={true}
          showGridlines
          sortField="date"
          onRowDoubleClick={showProgramDetails}
        >
          <Column selectionMode="multiple" exportable={false}></Column>

          <Column field="programName" header="Program Name" sortable></Column>
          <Column
            field="date"
            header="Date"
            body={(rowData) => rowData.date}
            sortable
          ></Column>
          <Column
            field="startTime"
            header="Start Time"
            body={(rowData) =>
              rowData.startTime
                ? new Date(rowData.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : rowData.startTime
            }
            sortable
          ></Column>
          <Column
            field="endTime"
            header="End Time"
            body={(rowData) =>
              rowData.endTime
                ? new Date(rowData.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : rowData.endTime
            }
            sortable
          ></Column>
          <Column field="clientType" header="Client Type" sortable></Column>
          <Column
            field="locationAndProgram"
            header="Location and Program"
            sortable
          ></Column>
          <Column field="groupSize" header="Group Size" sortable></Column>
          <Column
            field="contactPerson"
            header="Contact Person"
            sortable
          ></Column>
          <Column
            field="contactPersonEmail"
            header="Contact Person Email"
            sortable
          ></Column>
          <Column
            field="facilitatorsNeeded"
            header="Facilitators Needed"
            body={facilitatorsNeededBodyTemplate}
            style={{ maxWidth: "300px", overflow: "scroll" }}
            sortable
          ></Column>
          <Column
            field="facilitators"
            header="Facilitators"
            body={(rowData) => (
              <div>
                {rowData.facilitators.map((facilitator, index) => (
                  <div key={index} className="p-chip">
                    <span>{facilitator.name}</span>
                  </div>
                ))}
              </div>
            )}
            sortable
          ></Column>
          <Column
            field="facilitatorEmails"
            header="Facilitator Emails"
            body={(rowData) => (
              <div>
                {rowData.facilitatorEmails.map((facilitatorEmail, index) => (
                  <div key={index} className="p-chip">
                    <span>{facilitatorEmail}</span>
                  </div>
                ))}
              </div>
            )}
            sortable
          ></Column>
          <Column
            field="notes"
            header="Notes"
            sortable
            style={{
              maxWidth: "200px",
              maxHeight: "50px",
              overflow: "scroll",
            }}
          ></Column>
          <Column
            body={(rowData) => (
              <>
                <Button
                  icon="pi pi-pencil"
                  rounded
                  outlined
                  className="mr-2"
                  onClick={() => editProgram(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  outlined
                  severity="danger"
                  onClick={() => confirmDeleteProgram(rowData)}
                />
              </>
            )}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

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
          <Calendar
            id="date"
            value={program.date ? new Date(program.date) : program.date}
            onChange={(e) => onCalendarChange(e, "date")}
            showIcon
            disabled={!editable}
          />
        </div>

        <div className="field">
          <label htmlFor="startTime">Start Time</label>
          <Calendar
            id="startTime"
            value={
              program.startTime
                ? new Date(program.startTime)
                : program.startTime
            }
            // value={new Date(program.startTime).toDateString()}
            //   onChange={(e) => setStartTime(e.value)}
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
          <Calendar
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

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="underAgeParticipants"
            checked={program.underAgeParticipants}
            onChange={(e) =>
              handleCheckboxChange("underAgeParticipants", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="underAgeParticipants">Under Age Participants</label>
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

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="returningClient"
            checked={program.returningClient}
            onChange={(e) =>
              handleCheckboxChange("returningClient", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="returningClient">Returning Client</label>
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="contractSent"
            checked={program.contractSent}
            onChange={(e) =>
              handleCheckboxChange("contractSent", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="contractSent">Contract Sent</label>
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="preProgramEmail"
            checked={program.preProgramEmail}
            onChange={(e) =>
              handleCheckboxChange("preProgramEmail", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="preProgramEmail">Pre-Program Email</label>
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="packetReady"
            checked={program.packetReady}
            onChange={(e) =>
              handleCheckboxChange("packetReady", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="packetReady">Packet Ready</label>
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="packetProcessed"
            checked={program.packetProcessed}
            onChange={(e) =>
              handleCheckboxChange("packetProcessed", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="packetProcessed">Packet Processed</label>
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="followUp"
            checked={program.followUp}
            onChange={(e) => handleCheckboxChange("followUp", e.target.checked)}
            disabled={!editable}
          />
          <label htmlFor="followUp">Follow Up</label>
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="cancelled"
            checked={program.cancelled}
            onChange={(e) =>
              handleCheckboxChange("cancelled", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="cancelled">Cancelled</label>
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
              disabled={!editable}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteProgramDialog}
        style={{ width: "32rem" }}
        header="Confirm"
        modal
        footer={deleteProgramDialogFooter}
        onHide={hideDeleteProgramDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {program && (
            <span>
              Are you sure you want to delete <b>{program.programName}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProgramsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProgramsDialogFooter}
        onHide={hideDeleteProgramsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {program && (
            <span>Are you sure you want to delete the selected programs?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ProgramList;
