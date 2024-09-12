import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { getAllUsers, updateUser } from "../../../services/database.mjs";
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
    const val = e.target.value;
    setEditingUser((prevUser) => ({ ...prevUser, [name]: val }));
  };

  const permissionOptions = [
    { label: "No Access", value: "No Access" },
    { label: "Facilitator", value: "Facilitator" },
    { label: "Admin", value: "Admin" },
  ];

  const saveUser = async () => {
    try {
      await updateUser(editingUser.email, editingUser);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Updated Successfully",
        life: 3000,
      });
      hideModal();
      fetchUsers(); // Refresh the user list
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
        {" "}
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
        ></Column>
        <Column
          field="email"
          header="Email"
          sortable
          style={{ width: "33%" }}
        ></Column>
        <Column
          field="permission"
          header="Permission"
          sortable
          style={{ width: "33%" }}
        ></Column>
      </DataTable>

      <Dialog
        visible={isModalVisible}
        style={{ width: "32rem" }}
        header="Edit User"
        modal
        className="p-fluid"
        footer={footer}
        onHide={hideModal}
      >
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

        <div className="field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            value={editingUser?.email || ""}
            onChange={(e) => onInputChange(e, "email")}
            required
          />
        </div>

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
      </Dialog>
    </section>
  );
}
