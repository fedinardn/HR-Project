import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  getAllStaff,
  getStaffAssignments,
} from "../../../services/database.mjs";

const FacilitatorAnalysis = () => {
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(null);

  useEffect(() => {
    fetchFacilitatorsData();
  }, []);

  const fetchFacilitatorsData = async () => {
    try {
      setLoading(true);
      const allStaff = await getAllStaff();
      const facilitatorsWithAssignments = await Promise.all(
        allStaff.map(async (facilitator) => {
          const assignments = await getStaffAssignments(facilitator.staffID);
          const programsWorked = assignments.length;
          const totalHours = assignments.reduce((total, assignment) => {
            return total + assignment.hours + 2; // Adding 2 hours to each assignment
          }, 0);
          return {
            ...facilitator,
            programsWorked,
            totalHours,
          };
        })
      );
      setFacilitators(facilitatorsWithAssignments);
    } catch (error) {
      console.error("Error fetching facilitators data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search facilitators..."
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
    <div>
      <h1>Facilitator Analysis</h1>
      <DataTable
        value={facilitators}
        paginator
        rows={10}
        dataKey="staffID"
        globalFilter={globalFilter}
        header={renderHeader}
        emptyMessage="No facilitators found."
      >
        <Column field="firstName" header="First Name" sortable />
        <Column field="lastName" header="Last Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="programsWorked" header="Programs Worked" sortable />
        <Column
          field="totalHours"
          header="Total Hours"
          sortable
          body={(rowData) => rowData.totalHours.toFixed(2)}
        />
      </DataTable>
    </div>
  );
};

export default FacilitatorAnalysis;
