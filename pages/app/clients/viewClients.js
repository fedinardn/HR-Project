import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../../styles/viewClients.module.css";
import { getAllClients } from "../../../services/database.mjs";
import { IconField } from "primereact/iconfield";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export default function ViewStaff({ user }) {
  const [clients, setClients] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const router = useRouter();

  const fetchClients = async () => {
    const data = await getAllClients();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

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
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />

        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search Clients"
          />
        </IconField>
      </div>
    );
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();

  const onRowClick = (event) => {
    router.push(`/app/clients/${event.data.clientID}`);
  };

  return (
    <section className={styles["main-container"]}>
      <header className={styles["header"]}>
        <h1 className={styles["title"]}>Clients</h1>
        <Link className={styles["new-client"]} href="/app/clients/addNewClient">
          <h4 className={styles["new-client-text"]}>Add New Client</h4>
        </Link>
      </header>

      <DataTable
        value={clients}
        paginator
        rows={10}
        dataKey="clientID"
        filters={filters}
        filterDisplay="menu"
        x
        globalFilterFields={["organizationName", "clientType", "contactPerson"]}
        header={header}
        emptyMessage="No clients found."
        onRowClick={onRowClick}
        selectionMode="single"
      >
        <Column
          field="organizationName"
          header="Client"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="clientType"
          header="Type"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="contactPerson"
          header="Contact"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="programs"
          header="Programs"
          sortable
          body={(rowData) => rowData.programs.length}
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
    </section>
  );
}
