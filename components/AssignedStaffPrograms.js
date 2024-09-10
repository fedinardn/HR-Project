import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import {
  getAllContractedPrograms,
  assignProgramToStaff,
  updateStaffProgramAssignment,
  getStaffAssignments,
  deleteStaffAssignment,
} from "../services/database.mjs";
import styles from "../styles/AssignedStaff.module.css";

export default function AssignedStaffPrograms({ staffData }) {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [contractedPrograms, setContractedPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [role, setRole] = useState("");
  const [hours, setHours] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    fetchContractedPrograms();
    if (staffData && staffData.staffID) {
      const fetchStaffAssignments = async () => {
        try {
          const assignments = await getStaffAssignments(staffData.staffID);
          setPrograms(assignments);
        } catch (error) {
          console.error("Error fetching staff assignments:", error);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch staff assignments",
            life: 3000,
          });
        }
      };
      fetchStaffAssignments();
    }
  }, [staffData]);

  const fetchContractedPrograms = async () => {
    try {
      const data = await getAllContractedPrograms();
      setContractedPrograms(data);
    } catch (error) {
      console.error("Error fetching contracted programs:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch contracted programs",
        life: 3000,
      });
    }
  };

  const handleAssignProgramClick = () => {
    setEditIndex(null);
    setSelectedProgram(null);
    setRole("");
    setHours(0);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditIndex(null);
    setSelectedProgram(null);
    setRole("");
    setHours(0);
  };

  const handleSaveAssignment = async () => {
    if (!selectedProgram || !role || hours <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all fields",
        life: 3000,
      });
      return;
    }
    const totalCost = staffData.payRate * (hours + 2);

    const assignmentData = {
      programID: selectedProgram.programID,
      programName: selectedProgram.programName,
      date: selectedProgram.programDate,
      role: role,
      hours: hours,
      totalCost: totalCost,
    };

    try {
      console.log(editIndex);
      if (editIndex !== null) {
        // Updating an existing assignment
        await updateStaffProgramAssignment(
          staffData.staffID,
          selectedProgram.programID,
          assignmentData
        );
        const updatedPrograms = [...programs];
        updatedPrograms[editIndex] = assignmentData;
        setPrograms(updatedPrograms);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Assignment updated successfully",
          life: 3000,
        });
      } else {
        // Creating a new assignment
        await assignProgramToStaff(staffData.staffID, assignmentData);
        setPrograms([...programs, assignmentData]);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Program assigned successfully",
          life: 3000,
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error saving assignment. Please try again.",
        life: 3000,
      });
    }
  };

  const onRowClick = (event) => {
    const { index, data } = event;
    setEditIndex(index);
    setSelectedProgram(
      contractedPrograms.find((p) => p.programID === data.programID)
    );
    setRole(data.role);
    setHours(data.hours);
    setShowModal(true);
  };

  const handleProgramDelete = async (staffID, programID) => {
    try {
      await deleteStaffAssignment(staffID, programID);

      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "Assignment Deleted Successfully",
        life: 3000,
      });

      setPrograms(
        programs.filter((program) => program.programID !== programID)
      );
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Program. Please Try Again",
        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className={styles["task-list"]}>
        <div className={styles["header"]}>
          <h1 className={styles.title}>
            Assigned Programs ({programs.length || 0})
          </h1>
          <Button
            label="Assign Program"
            icon="pi pi-plus"
            className={styles["add-program-button"]}
            onClick={handleAssignProgramClick}
          />
        </div>
        <div className={styles["custom-search-bar"]}>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              placeholder="Search Programs"
              onInput={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          value={programs}
          globalFilter={globalFilter}
          paginator
          rows={10}
          className="p-mt-3"
          onRowClick={onRowClick}
          selectionMode="single"
        >
          <Column field="programName" header="Program Name" />
          <Column field="date" header="Date" />
          <Column field="role" header="Role" />
          <Column field="hours" header="Number of Hours" />
          <Column
            body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-rounded"
                onClick={() =>
                  handleProgramDelete(staffData.staffID, rowData.programID)
                }
              />
            )}
            style={{ width: "2vw" }}
          />
        </DataTable>
      </div>

      <Dialog
        header={editIndex !== null ? "Edit Assignment" : "Assign Program"}
        visible={showModal}
        style={{ width: "50vw" }}
        modal
        onHide={handleCloseModal}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="program">Program</label>
            <Dropdown
              id="program"
              value={selectedProgram}
              options={contractedPrograms}
              onChange={(e) => setSelectedProgram(e.value)}
              optionLabel="programName"
              placeholder="Select a Program"
              filter
            />
          </div>
          <div className="field">
            <label htmlFor="role">Role</label>
            <InputText
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter Role"
            />
          </div>
          <div className="field">
            <label htmlFor="hours">Number of Hours</label>
            <InputNumber
              id="hours"
              value={hours}
              onValueChange={(e) => setHours(e.value)}
              placeholder="Enter Number of Hours"
              min={0}
            />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={handleCloseModal}
            className="p-button-text"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            onClick={handleSaveAssignment}
            autoFocus
          />
        </div>
      </Dialog>
    </>
  );
}
