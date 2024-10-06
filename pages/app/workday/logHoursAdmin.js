import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import {
  getAllLoggedHours,
  updateLog,
  updateMultipleLogs,
  deleteLog,
} from "../../../services/database.mjs";

const AdminDashboard = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [userSummaries, setUserSummaries] = useState([]);
  const [selectedSummaries, setSelectedSummaries] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    fetchAllLogs();
  }, []);

  useEffect(() => {
    if (allLogs.length > 0) {
      createUserSummaries();
    }
  }, [allLogs]);

  const fetchAllLogs = async () => {
    try {
      const logs = await getAllLoggedHours();
      setAllLogs(logs.filter((log) => !log.approved));
    } catch (error) {
      console.error("Error fetching logs:", error);
      showToast("error", "Error", "Failed to fetch logs");
    }
  };

  const createUserSummaries = () => {
    const summaries = Object.values(
      allLogs.reduce((acc, log) => {
        if (!acc[log.userId]) {
          acc[log.userId] = {
            userId: log.userId,
            totalHours: 0,
            logCount: 0,
            name: log.userId || "Unknown User",
          };
        }
        acc[log.userId].totalHours += log.hours;
        acc[log.userId].logCount += 1;
        return acc;
      }, {})
    );
    setUserSummaries(summaries);
  };

  const handleRowClick = (event) => {
    setSelectedUser(event.data.userId);
    setIsModalOpen(true);
  };

  const handleEdit = (log) => {
    setEditingLog({
      ...log,
      programName: log.programName || "",
      hours: log.hours || 0,
      startTime: log.startTime || null,
      endTime: log.endTime || null,
    });
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return 0;

    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;

    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }

    return Number((hours + minutes / 60).toFixed(2));
  };

  const handleTimeChange = (field, value) => {
    setEditingLog((prev) => {
      const updatedLog = { ...prev, [field]: value };
      const newHours = calculateHours(updatedLog.startTime, updatedLog.endTime);
      return { ...updatedLog, hours: newHours };
    });
  };

  const handleSave = async () => {
    try {
      await updateLog(editingLog.userId, editingLog.timeID, editingLog);
      setAllLogs(
        allLogs.map((log) =>
          log.timeID === editingLog.timeID ? editingLog : log
        )
      );
      setEditingLog(null);
      showToast("success", "Success", "Log updated successfully");
    } catch (error) {
      console.error("Error updating log:", error);
      showToast("error", "Error", "Failed to update log");
    }
  };

  const handleApprove = async (log) => {
    try {
      await updateLog(log.userId, log.timeID, { ...log, approved: true });
      setAllLogs(allLogs.filter((l) => l.timeID !== log.timeID));
      showToast("success", "Success", "Log approved successfully");
    } catch (error) {
      console.error("Error approving log:", error);
      showToast("error", "Error", "Failed to approve log");
    }
  };

  const handleDelete = (log) => {
    confirmDialog({
      message: "Are you sure you want to delete this log?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await deleteLog(log.userId, log.timeID);
          setAllLogs(allLogs.filter((l) => l.timeID !== log.timeID));
          showToast("success", "Success", "Log deleted successfully");
        } catch (error) {
          console.error("Error deleting log:", error);
          showToast("error", "Error", "Failed to delete log");
        }
      },
    });
  };

  const handleBulkApproval = async () => {
    try {
      const updates = selectedSummaries.flatMap((summary) =>
        allLogs
          .filter((log) => log.userId === summary.userId)
          .map((log) => ({
            userId: log.userId,
            logID: log.timeID,
            data: { approved: true },
          }))
      );

      for (const summary of selectedSummaries) {
        await updateMultipleLogs(
          summary.userId,
          updates.filter((u) => u.userId === summary.userId)
        );
      }

      setAllLogs(
        allLogs.filter(
          (log) => !selectedSummaries.some((s) => s.userId === log.userId)
        )
      );
      setSelectedSummaries([]);
      showToast("success", "Success", "Bulk approval successful");
    } catch (error) {
      console.error("Error in bulk approval:", error);
      showToast("error", "Error", "Failed to perform bulk approval");
    }
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon={
            editingLog && editingLog.timeID === rowData.timeID
              ? "pi pi-check"
              : "pi pi-pencil"
          }
          className="p-button-rounded p-button-info p-mr-2"
          onClick={() =>
            editingLog && editingLog.timeID === rowData.timeID
              ? handleSave()
              : handleEdit(rowData)
          }
        />
        <Button
          icon="pi pi-check"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => handleApprove(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData)}
        />
      </>
    );
  };

  const editableBodyTemplate = (field) => (rowData) => {
    if (editingLog && editingLog.timeID === rowData.timeID) {
      switch (field) {
        case "programName":
          return (
            <InputText
              value={editingLog.programName}
              onChange={(e) =>
                setEditingLog({ ...editingLog, programName: e.target.value })
              }
            />
          );
        case "hours":
          return editingLog.hours.toFixed(2);
        case "startTime":
        case "endTime":
          return (
            <InputText
              value={editingLog[field]}
              onChange={(e) => handleTimeChange(field, e.target.value)}
              placeholder="HH:MM"
            />
          );
        default:
          return rowData[field];
      }
    }
    return field === "hours" ? rowData[field].toFixed(2) : rowData[field] || "";
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />
      <h1 className="text-3xl font-bold mb-4">Staff Hours Dashboard</h1>
      <DataTable
        value={userSummaries}
        selection={selectedSummaries}
        onSelectionChange={(e) => setSelectedSummaries(e.value)}
        dataKey="userId"
        onRowClick={handleRowClick}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
        ></Column>
        <Column field="name" header="Name" />
        <Column field="totalHours" header="Total Unapproved Hours" />
        <Column field="logCount" header="Number of Unapproved Logs" />
      </DataTable>
      <Button
        label="Approve Selected"
        icon="pi pi-check"
        onClick={handleBulkApproval}
        disabled={!selectedSummaries || selectedSummaries.length === 0}
        className="p-mt-2"
      />

      <Dialog
        header={`Unapproved Logs for ${
          userSummaries.find((s) => s.userId === selectedUser)?.name || "User"
        }`}
        visible={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        style={{ width: "80vw" }}
      >
        <DataTable value={allLogs.filter((log) => log.userId === selectedUser)}>
          <Column
            field="programName"
            header="Program"
            body={editableBodyTemplate("programName")}
          />
          <Column field="date" header="Date" />
          <Column
            field="hours"
            header="Hours"
            body={editableBodyTemplate("hours")}
          />
          <Column
            field="startTime"
            header="Start Time"
            body={editableBodyTemplate("startTime")}
          />
          <Column
            field="endTime"
            header="End Time"
            body={editableBodyTemplate("endTime")}
          />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
