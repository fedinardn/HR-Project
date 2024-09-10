import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Chart } from "primereact/chart";
import { InputText } from "primereact/inputtext"; // Add this import
import {
  getAllContractedPrograms,
  getAllStaffAssignments,
} from "../../../services/database.mjs";

const StaffCostAnalysis = () => {
  const [programs, setPrograms] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [chartData, setChartData] = useState({});
  const [globalFilter, setGlobalFilter] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const programsData = await getAllContractedPrograms();
      const staffAssignmentsData = await getAllStaffAssignments();
      setPrograms(programsData);
      setStaffAssignments(staffAssignmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateProgramMetrics = (program) => {
    const programAssignments = staffAssignments.filter(
      (assignment) => assignment.programID === program.programID
    );

    const laborCost = programAssignments.reduce(
      (total, assignment) => total + assignment.totalCost,
      0
    );

    const programRevenue = program.totalCost;
    const profit = programRevenue - laborCost;

    return { laborCost, programRevenue, profit };
  };

  const onRowClick = (event) => {
    const program = event.data;
    setSelectedProgram(program);
    const { laborCost, programRevenue, profit } =
      calculateProgramMetrics(program);

    setChartData({
      labels: ["Program Revenue", "Labor Cost", "Profit"],
      datasets: [
        {
          label: "Amount ($)",
          data: [programRevenue, laborCost, profit],
          backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        },
      ],
    });

    setShowModal(true);
  };

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  // Add this function for the search bar
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Program..."
          />
        </span>
      </div>
    );
  };

  return (
    <div>
      <h1>Program Cost Analysis</h1>
      <DataTable
        value={programs}
        onRowClick={onRowClick}
        selectionMode="single"
        globalFilter={globalFilter}
        header={renderHeader}
        emptyMessage="No programs found."
      >
        <Column field="organizationName" header="Organization Name" />

        <Column field="programName" header="Program Name" />
        <Column field="programDate" header="Date" />
        <Column field="clientType" header="Client Type" />
        <Column
          field="totalCost"
          header="Total Cost"
          body={(rowData) => formatCurrency(rowData.totalCost)}
        />
      </DataTable>

      <Dialog
        header={
          selectedProgram
            ? `${selectedProgram.programName} Analysis`
            : "Program Analysis"
        }
        visible={showModal}
        style={{ width: "50vw" }}
        onHide={() => setShowModal(false)}
      >
        {selectedProgram && (
          <div>
            <Chart
              type="bar"
              data={chartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Amount ($)",
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${formatCurrency(
                          context.raw
                        )}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default StaffCostAnalysis;
