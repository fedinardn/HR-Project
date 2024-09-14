import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import Link from "next/link";
import { useRouter } from "next/router";
import withProtectedRoute from "../../../components/WithProtectedRoute";
import { getAllClients } from "../../../services/database.mjs";
import { IconField } from "primereact/iconfield";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const ViewClients = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
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

  const header = renderHeader();

  const onRowClick = (event) => {
    router.push(`/app/clients/${event.data.clientID}`);
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
    <div className="p-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Card>
        <div className="flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Clients</h1>
          <Link href="/app/clients/addNewClient">
            <Button label="Add New Client" icon="pi pi-plus" />
          </Link>
        </div>

        <DataTable
          value={clients}
          paginator
          rows={10}
          dataKey="clientID"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            "organizationName",
            "clientType",
            "contactPerson",
          ]}
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
        </DataTable>
      </Card>
    </div>
  );
};

export default withProtectedRoute(ViewClients);
