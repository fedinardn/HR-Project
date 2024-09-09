import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

import {
  updateProgramInGrid,
  createNewProgramInGrid,
} from "../services/database.mjs";

const ProgramDialog = ({
  visible,
  program,
  editable,
  onHide,
  onEdit,
  facilitators,
  userPermission,
  onSave,
}) => {
  const [localProgram, setLocalProgram] = useState(program);
  const [submitted, setSubmitted] = useState(false);
  const [isAddRoleDialogVisible, setIsAddRoleDialogVisible] = useState(false);
  const [newRole, setNewRole] = useState("");

  const toast = useRef(null);

  console.log(localProgram);

  useEffect(() => {
    setLocalProgram(program);
  }, [program]);
  // useEffect(() => {
  //   if (program) {
  //     // Convert string dates to Date objects for the Calendar components
  //     const updatedProgram = {
  //       ...program,
  //       date: program.date ? new Date(program.date) : null,
  //       startTime: program.startTime ? new Date(program.startTime) : null,
  //       endTime: program.endTime ? new Date(program.endTime) : null,
  //     };
  //     setLocalProgram(updatedProgram);
  //   }
  // }, [program]);

  const saveProgram = async () => {
    let _program = { ...localProgram };

    if (_program.start) delete _program.start;
    if (_program.end) delete _program.end;

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
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Program Created Successfully",
        life: 3000,
      });
    }

    onHide();
    onSave();
  };

  // const onInputChange = (e, name) => {
  //   const val = (e.target && e.target.value) || "";
  //   setLocalProgram((prevProgram) => ({ ...prevProgram, [name]: val }));
  // };

  const onInputChange = (e, name) => {
    const val = e.value !== undefined ? e.value : e.target.value;
    setLocalProgram((prevProgram) => {
      if (name === "date" || name === "startTime" || name === "endTime") {
        // If it's a date or time field, only update if there's a value
        return val ? { ...prevProgram, [name]: val } : prevProgram;
      }
      return { ...prevProgram, [name]: val };
    });
  };

  const onCalendarChange = (e, name) => {
    const val = e.value;
    setLocalProgram((prevProgram) => {
      // Only update if there's a value
      return val ? { ...prevProgram, [name]: val } : prevProgram;
    });
  };

  const handleCheckboxChange = (field, value) => {
    setLocalProgram((prevProgram) => ({ ...prevProgram, [field]: value }));
  };

  const handleAddFacilitator = () => {
    const newFacilitator = {
      id: Date.now(),
      facilitatorName: null,
      role: "",
      email: "",
      phone: "",
    };
    setLocalProgram((prevProgram) => ({
      ...prevProgram,
      facilitators: [...(prevProgram.facilitators || []), newFacilitator],
    }));
  };

  const handleRowDel = (id) => {
    const itemToDelete = localProgram.facilitators.find(
      (item) => item.id === id
    );
    if (itemToDelete) {
      const updatedItems = localProgram.facilitators.filter(
        (item) => item.id !== id
      );
      setLocalProgram((prevProgram) => ({
        ...prevProgram,
        facilitators: updatedItems,
      }));
    }
  };

  const handleFacilitatorChange = (e, field, rowData) => {
    const val = (e.target && e.target.value) || e.value;
    let updatedEmails = [];

    const updatedItems = localProgram.facilitators.map((item) => {
      if (item.id === rowData.id) {
        if (field === "facilitatorName") {
          return {
            ...item,
            facilitatorName: val,
          };
        } else {
          return {
            ...item,
            [field]: val,
          };
        }
      }
      return item;
    });
    setLocalProgram((prevProgram) => ({
      ...prevProgram,
      facilitators: updatedItems,
    }));
  };

  const itemTemplate = (rowData, { field }) => {
    if (field === "facilitatorName") {
      return (
        <Dropdown
          options={facilitators}
          optionLabel="name"
          value={rowData.facilitatorName}
          onChange={(e) =>
            handleFacilitatorChange(e, "facilitatorName", rowData)
          }
          placeholder="Name"
          filter
          disabled={!editable}
        />
      );
    }
    if (field === "role") {
      return (
        <Dropdown
          value={rowData.role}
          options={Object.keys(localProgram.facilitatorsNeeded)}
          onChange={(e) => handleFacilitatorChange(e, "role", rowData)}
          placeholder="Select Role"
          filter
          disabled={!editable}
        />
      );
    }
    if (field === "email") {
      return (
        <InputText
          value={rowData.facilitatorName ? rowData.facilitatorName.email : ""}
          placeholder="Email"
          disabled
          readOnly
        />
      );
    }
    if (field === "phone") {
      return (
        <InputMask
          mask="(999) 999-9999"
          value={rowData.facilitatorName ? rowData.facilitatorName.phone : ""}
          placeholder="Phone"
          disabled
          readOnly
        />
      );
    }
  };

  const onFacilitatorChange = (e, role) => {
    const val = (e.target && e.target.value) || "";
    setLocalProgram((prevProgram) => ({
      ...prevProgram,
      facilitatorsNeeded: {
        ...prevProgram.facilitatorsNeeded,
        [role]: val,
      },
    }));
  };

  const addFacilitatorRole = () => {
    if (newRole && !localProgram.facilitatorsNeeded[newRole]) {
      setLocalProgram((prevProgram) => ({
        ...prevProgram,
        facilitatorsNeeded: {
          ...prevProgram.facilitatorsNeeded,
          [newRole]: "",
        },
      }));
      setNewRole("");
      setIsAddRoleDialogVisible(false);
    }
  };

  const showAddRoleDialog = () => {
    setIsAddRoleDialogVisible(true);
  };

  const ClientTypeDropdown = ({ onChange, value }) => {
    const clientTypes = ["STU", "NON-CU-STU", "CUP", "PDP", "COMMYTH"];

    return (
      <div className="card flex justify-content-center">
        <Dropdown
          value={value}
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

  const footer = (
    <>
      <div>
        {userPermission === "Admin" &&
          (!editable ? (
            <Button label="Edit" icon="pi pi-pencil" onClick={onEdit} />
          ) : (
            <>
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={onEdit}
                className="p-button-text"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                onClick={() => {
                  setSubmitted(true);
                  saveProgram(localProgram);
                }}
              />
            </>
          ))}
      </div>
    </>
  );

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={visible}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Program Details"
        modal
        className="p-fluid"
        footer={footer}
        onHide={onHide}
      >
        {/* Include all the form fields here, similar to your original code */}
        <div className="field">
          <label htmlFor="programName">Program Name</label>
          <InputText
            id="programName"
            value={localProgram.programName}
            onChange={(e) => onInputChange(e, "programName")}
            required
            autoFocus
            readOnly={!editable}
          />
          {submitted && !localProgram.programName && (
            <small className="p-invalid">Program Name is required.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <Calendar
            id="date"
            value={localProgram.date ? new Date(localProgram.date) : null}
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
              localProgram.startTime ? new Date(localProgram.startTime) : null
            }
            onChange={(e) => onCalendarChange(e, "startTime")}
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
            value={localProgram.endTime ? new Date(localProgram.endTime) : null}
            onChange={(e) => onCalendarChange(e, "endTime")}
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
            value={localProgram.clientType}
            onChange={(e) => onInputChange(e, "clientType")}
          />
        </div>

        <div className="field">
          <label htmlFor="locationAndProgram">Location and Program</label>
          <InputText
            id="locationAndProgram"
            value={localProgram.locationAndProgram}
            onChange={(e) => onInputChange(e, "locationAndProgram")}
            readOnly={!editable}
          />
        </div>

        <div className="field">
          <label htmlFor="groupSize">Group Size</label>
          <InputText
            id="groupSize"
            value={localProgram.groupSize}
            onChange={(e) => onInputChange(e, "groupSize")}
            keyfilter="int"
            readOnly={!editable}
          />
        </div>

        <div className="field">
          <label htmlFor="contactPerson">Contact Person</label>
          <InputText
            id="contactPerson"
            value={localProgram.contactPerson}
            onChange={(e) => onInputChange(e, "contactPerson")}
            readOnly={!editable}
          />
        </div>

        <div className="field">
          <label htmlFor="contactPersonEmail">Contact Person Email</label>
          <InputText
            id="contactPersonEmail"
            value={localProgram.contactPersonEmail}
            onChange={(e) => onInputChange(e, "contactPersonEmail")}
            readOnly={!editable}
          />
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="underAgeParticipants"
            checked={localProgram.underAgeParticipants}
            onChange={(e) =>
              handleCheckboxChange("underAgeParticipants", e.target.checked)
            }
            disabled={!editable}
          />
          <label htmlFor="underAgeParticipants">Under Age Participants</label>
        </div>

        <div className="field">
          <label htmlFor="facilitators">Facilitators</label>
          <Card className="p-mb-3">
            <DataTable value={localProgram.facilitators}>
              <Column
                field="facilitatorName"
                header="Name"
                body={(rowData) =>
                  itemTemplate(rowData, { field: "facilitatorName" })
                }
              />
              <Column
                field="role"
                header="Role"
                body={(rowData) => itemTemplate(rowData, { field: "role" })}
              />

              <Column
                field="email"
                header="Email"
                body={(rowData) => itemTemplate(rowData, { field: "email" })}
                style={{ minWidth: "250px" }}
              />
              <Column
                field="phone"
                header="Phone"
                body={(rowData) => itemTemplate(rowData, { field: "phone" })}
                style={{ minWidth: "250px" }}
              />
              <Column
                body={(rowData) => (
                  <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-rounded"
                    onClick={() => handleRowDel(rowData.id)}
                    disabled={!editable}
                  />
                )}
              />
            </DataTable>
            <Button
              label="Add Facilitator"
              icon="pi pi-plus"
              onClick={handleAddFacilitator}
              className="p-mt-2"
              disabled={!editable}
            />
          </Card>
        </div>

        {/* <div className="field">
          <label htmlFor="facilitatorEmails">Facilitator Emails</label>
          <InputText
            id="facilitatorEmails"
            value={localProgram.facilitatorEmails}
            onChange={(e) => onInputChange(e, "facilitatorEmails")}
            disabled
          />
        </div> */}

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <InputTextarea
            id="notes"
            value={localProgram.notes}
            onChange={(e) => onInputChange(e, "notes")}
            readOnly={!editable}
          />
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="returningClient"
            checked={localProgram.returningClient}
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
            checked={localProgram.contractSent}
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
            checked={localProgram.preProgramEmail}
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
            checked={localProgram.packetReady}
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
            checked={localProgram.packetProcessed}
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
            checked={localProgram.followUp}
            onChange={(e) => handleCheckboxChange("followUp", e.target.checked)}
            disabled={!editable}
          />
          <label htmlFor="followUp">Follow Up</label>
        </div>

        <div className="field-checkbox">
          <input
            type="checkbox"
            id="cancelled"
            checked={localProgram.cancelled}
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
            {localProgram.facilitatorsNeeded &&
              Object.entries(localProgram.facilitatorsNeeded).map(
                ([role, count], index) => (
                  <div key={index} className="field">
                    <label style={{ width: "120px" }}>{role}</label>
                    <InputText
                      value={count}
                      onChange={(e) => onFacilitatorChange(e, role)}
                      readOnly={!editable}
                      keyfilter="int"
                    />
                  </div>
                )
              )}
            <Button
              label="Add Role"
              icon="pi pi-plus"
              onClick={showAddRoleDialog}
              className="p-mt-2"
              disabled={!editable}
            />

            <Dialog
              header="Add New Role"
              visible={isAddRoleDialogVisible}
              style={{ width: "30vw" }}
              modal
              footer={
                <div>
                  <Button
                    label="Cancel"
                    icon="pi pi-times"
                    onClick={() => setIsAddRoleDialogVisible(false)}
                    className="p-button-text"
                  />
                  <Button
                    label="Add"
                    icon="pi pi-check"
                    onClick={addFacilitatorRole}
                  />
                </div>
              }
              onHide={() => setIsAddRoleDialogVisible(false)}
            >
              <div className="p-field">
                <InputText
                  id="newRole"
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>
            </Dialog>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProgramDialog;
