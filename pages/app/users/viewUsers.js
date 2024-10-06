import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { getAllUsers, updateUser } from "../../../services/database.mjs";
import { format } from "date-fns";

import styles from "../../../styles/viewClients.module.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toast = useRef(null);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          {/* <i className="pi pi-search" /> */}
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search user"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  const onRowClick = (event) => {
    setEditingUser(event.data);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || e.value;
    setEditingUser((prevUser) => ({
      ...prevUser,
      [name]: val, // Store empty string if the field is cleared
    }));
  };

  const permissionOptions = [
    { label: "No Access", value: "No Access" },
    { label: "Facilitator", value: "Facilitator" },
    { label: "Admin", value: "Admin" },
  ];

  const employeeTypeOptions = [
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Contract", value: "Contract" },
    { label: "Temporary", value: "Temporary" },
  ];

  const payRateTypeOptions = [
    { label: "Hourly", value: "Hourly" },
    { label: "Salary", value: "Salary" },
  ];

  const saveUser = async () => {
    try {
      let updatedUser = { ...editingUser };

      if (updatedUser.endEmploymentDate) {
        updatedUser = {
          ...updatedUser,
          endEmploymentDate: format(
            new Date(updatedUser.endEmploymentDate),
            "MM/dd/yyyy"
          ),
        };
      }
      Object.keys(updatedUser).forEach((key) => {
        if (updatedUser[key] === null || updatedUser[key] === undefined) {
          updatedUser[key] = "";
        }
      });

      await updateUser(updatedUser.email, updatedUser);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Updated Successfully",
        life: 3000,
      });
      hideModal();
      fetchUsers();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update user",
        life: 3000,
      });
    }
  };

  const footer = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={hideModal}
        className="p-button-text"
      />
      <Button label="Save" icon="pi pi-check" onClick={saveUser} />
    </>
  );

  return (
    <section className={styles["main-container"]}>
      <header className={styles["header"]}>
        <h1 className={styles["title"]}>Users</h1>
      </header>
      <Toast ref={toast} />
      <DataTable
        value={users}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={["username", "email", "permission"]}
        header={header}
        emptyMessage="No users found."
        onRowClick={onRowClick}
        selectionMode="single"
      >
        <Column
          field="username"
          header="Name"
          sortable
          style={{ width: "33%" }}
        />
        <Column
          field="email"
          header="Email"
          sortable
          style={{ width: "33%" }}
        />
        <Column
          field="permission"
          header="Permission"
          sortable
          style={{ width: "33%" }}
        />
      </DataTable>

      <Dialog
        visible={isModalVisible}
        style={{ width: "50rem" }}
        header="Edit User"
        modal
        className="p-fluid"
        footer={footer}
        onHide={hideModal}
      >
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={editingUser?.username || ""}
                onChange={(e) => onInputChange(e, "username")}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={editingUser?.email || ""}
                onChange={(e) => onInputChange(e, "email")}
                required
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="permission">Permission</label>
              <Dropdown
                id="permission"
                value={editingUser?.permission}
                options={permissionOptions}
                onChange={(e) => onInputChange(e, "permission")}
                placeholder="Select Permission"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="employeeId">Employee ID</label>
              <InputText
                id="employeeId"
                value={editingUser?.employeeId || ""}
                onChange={(e) => onInputChange(e, "employeeId")}
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="positionId">Position ID</label>
              <InputText
                id="positionId"
                value={editingUser?.positionId || ""}
                onChange={(e) => onInputChange(e, "positionId")}
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="employeeType">Employee Type</label>
              <Dropdown
                id="employeeType"
                value={editingUser?.employeeType}
                options={employeeTypeOptions}
                onChange={(e) => onInputChange(e, "employeeType")}
                placeholder="Select Employee Type"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="jobFamilyGroup">Job Family Group</label>
              <InputText
                id="jobFamilyGroup"
                value={editingUser?.jobFamilyGroup || ""}
                onChange={(e) => onInputChange(e, "jobFamilyGroup")}
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="businessTitle">Business Title</label>
              <InputText
                id="businessTitle"
                value={editingUser?.businessTitle || ""}
                onChange={(e) => onInputChange(e, "businessTitle")}
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="endEmploymentDate">End Employment Date</label>
              <Calendar
                id="endEmploymentDate"
                value={
                  editingUser?.endEmploymentDate
                    ? new Date(editingUser.endEmploymentDate)
                    : null
                }
                onChange={(e) => onInputChange(e, "endEmploymentDate")}
                dateFormat="dd/mm/yy"
                showIcon
                // showClear={true}
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="payRateType">Pay Rate Type</label>
              <Dropdown
                id="payRateType"
                value={editingUser?.payRateType}
                options={payRateTypeOptions}
                onChange={(e) => onInputChange(e, "payRateType")}
                placeholder="Select Pay Rate Type"
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="managerName">Manager Name</label>
              <InputText
                id="managerName"
                value={editingUser?.managerName || ""}
                onChange={(e) => onInputChange(e, "managerName")}
              />
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="costCenter">Cost Center</label>
              <InputText
                id="costCenter"
                value={editingUser?.costCenter || ""}
                onChange={(e) => onInputChange(e, "costCenter")}
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="payRate">Pay Rate</label>
              <InputText
                id="payRate"
                value={editingUser?.payRate || ""}
                onChange={(e) => onInputChange(e, "payRate")}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
