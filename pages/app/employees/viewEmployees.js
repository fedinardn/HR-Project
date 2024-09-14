import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllStaff } from "../../../services/database.mjs";
import Link from "next/link";
import { useRouter } from "next/router";
import withProtectedRoute from "../../../components/WithProtectedRoute";

const ViewStaff = ({ user }) => {
  const [staff, setStaff] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await getAllStaff();
      setStaff(data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [user]);

  const header = (
    <div className="flex justify-content-between align-items-center">
      <span className="p-input-icon-left">
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search staff..."
        />
      </span>
    </div>
  );

  const onRowClick = (event) => {
    router.push(`/app/employees/${event.data.staffID}`);
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
          <h1 className="m-0">Staff</h1>
          <Link href="/app/employees/addNewEmployee">
            <Button label="Add New Staff" icon="pi pi-plus" />
          </Link>
        </div>
        <DataTable
          value={staff}
          paginator
          rows={10}
          dataKey="staffID"
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No staff found."
          onRowClick={onRowClick}
          selectionMode="single"
          metaKeySelection={false}
        >
          <Column field="firstName" header="First Name" sortable />
          <Column field="lastName" header="Last Name" sortable />
          <Column field="email" header="Email" sortable />
        </DataTable>
      </Card>
    </div>
  );
};

export default withProtectedRoute(ViewStaff);
