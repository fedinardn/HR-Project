import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import moment from "moment";

import {
  getAllProgramRequests,
  getAllProgramRequestsForClient,
  getUserPermission,
} from "../../../services/database.mjs";

export default function ViewRequests({ user }) {
  const [programRequests, setProgramRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [globalFilterApproved, setGlobalFilterApproved] = useState(null);
  const [globalFilterPending, setGlobalFilterPending] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProgramRequests = async () => {
    if (user) {
      setLoading(true);
      try {
        const userData = await getUserPermission(user.email);
        let data;
        if (userData === "Facilitator" || userData === "No Access") {
          data = await getAllProgramRequestsForClient(user.uid);
        } else {
          data = await getAllProgramRequests(user.uid);
        }
        setProgramRequests(data);
        setApprovedRequests(data.filter((request) => request.approved));
        setPendingRequests(data.filter((request) => !request.approved));
      } catch (error) {
        console.error("Error fetching program requests:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No User");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramRequests();
  }, [user]);

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.approved ? "Approved" : "Pending"}
        severity={rowData.approved ? "success" : "warning"}
      />
    );
  };

  const onRowClick = (event) => {
    router.push(`/app/program-requests/${event.data.id}`);
  };

  const renderHeader = (globalFilterState, setGlobalFilterState, title) => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h5 className="m-0">{title}</h5>
        <span className="p-input-icon-left">
          <InputText
            type="search"
            onInput={(e) => setGlobalFilterState(e.target.value)}
            placeholder="Global Search"
          />
        </span>
      </div>
    );
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
      <h1>Program Requests</h1>

      <Card>
        <DataTable
          value={pendingRequests}
          paginator
          rows={10}
          dataKey="id"
          globalFilter={globalFilterPending}
          header={renderHeader(
            globalFilterPending,
            setGlobalFilterPending,
            `Pending Requests (${pendingRequests.length})`
          )}
          emptyMessage="No pending requests found."
          onRowClick={onRowClick}
          selectionMode="single"
        >
          <Column
            field="programTypes"
            header="Name"
            sortable
            body={(rowData) => rowData.programTypes.join(", ")}
          />
          <Column field="approved" header="Status" body={statusBodyTemplate} />
          <Column field="contactPerson" header="Contact Person" sortable />
          <Column
            field="createdAt"
            header="Date Received"
            sortable
            body={(rowData) => {
              const date = new Date(rowData.createdAt);
              return moment(date, "MM/DD/YYYY").format("MM/DD/YYYY");
            }}
          />
        </DataTable>
      </Card>

      <Card className="mb-4">
        <DataTable
          value={approvedRequests}
          paginator
          rows={10}
          dataKey="id"
          globalFilter={globalFilterApproved}
          header={renderHeader(
            globalFilterApproved,
            setGlobalFilterApproved,
            `Approved Requests (${approvedRequests.length})`
          )}
          emptyMessage="No approved requests found."
          onRowClick={onRowClick}
          selectionMode="single"
        >
          <Column
            field="programTypes"
            header="Name"
            sortable
            body={(rowData) => rowData.programTypes.join(", ")}
          />
          <Column field="approved" header="Status" body={statusBodyTemplate} />
          <Column field="contactPerson" header="Contact Person" sortable />
          <Column
            field="createdAt"
            header="Date Received"
            sortable
            body={(rowData) => {
              const date = new Date(rowData.createdAt);
              return moment(date, "MM/DD/YYYY").format("MM/DD/YYYY");
            }}
          />
        </DataTable>
      </Card>
    </div>
  );
}
