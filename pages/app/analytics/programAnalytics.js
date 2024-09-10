import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { getAllContractedPrograms } from "../../../services/database.mjs";

// Now I want to create a new page to calculate program cost, labour and profit. So for each program, I want to find all the staff that were assigned to it, calculate their hourly rate * the number of hours they worked +2 and draw a bar chart to compare the cost of the program, with the cost of all the staff on that program and another bar to display the profit
const AnalyticsDashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [dates, setDates] = useState(null);
  const [clientTypeCountChart, setClientTypeCountChart] = useState({});
  const [clientTypeRevenueChart, setClientTypeRevenueChart] = useState({});

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programs.length > 0) {
      generateChartData();
    }
  }, [programs, dates]);

  const fetchPrograms = async () => {
    try {
      const data = await getAllContractedPrograms();
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const generateChartData = () => {
    const clientTypeCounts = {};
    const clientTypeRevenues = {};
    const filteredPrograms = filterProgramsByDateRange(programs);

    filteredPrograms.forEach((program) => {
      const { clientType, totalCost } = program;
      clientTypeCounts[clientType] = (clientTypeCounts[clientType] || 0) + 1;
      clientTypeRevenues[clientType] =
        (clientTypeRevenues[clientType] || 0) + Number(totalCost);
    });

    setClientTypeCountChart({
      labels: Object.keys(clientTypeCounts),
      datasets: [
        {
          label: "Programs by Client Type",
          data: Object.values(clientTypeCounts),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });

    setClientTypeRevenueChart({
      labels: Object.keys(clientTypeRevenues),
      datasets: [
        {
          label: "Revenue by Client Type",
          data: Object.values(clientTypeRevenues),
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const filterProgramsByDateRange = (programs) => {
    if (!dates || !dates[0] || !dates[1]) return programs;

    const startDate = dates[0].getTime();
    const endDate = dates[1].getTime();

    return programs.filter((program) => {
      const programDate = new Date(program.programDate).getTime();
      return programDate >= startDate && programDate <= endDate;
    });
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.programDate).toLocaleDateString();
  };

  return (
    <div className="analytics-dashboard">
      <h1>Analytics Dashboard</h1>

      <Card className="mb-4">
        <div className="flex justify-content-center">
          <h2>Date Range Selection</h2>

          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            style={{ minWidth: "400px" }}
          />
        </div>
      </Card>

      <div className="grid">
        <div className="col-12 md:col-6">
          <Card className="mb-4">
            <h2>Programs by Client Type</h2>
            <Chart type="bar" data={clientTypeCountChart} />
          </Card>
        </div>
        <div className="col-12 md:col-6">
          <Card className="mb-4">
            <h2>Revenue by Client Type</h2>
            <Chart type="bar" data={clientTypeRevenueChart} />
          </Card>
        </div>
      </div>

      <Card>
        <h2>Programs Table</h2>
        <DataTable
          value={filterProgramsByDateRange(programs)}
          paginator
          rows={10}
        >
          <Column field="programName" header="Program Name" />
          <Column field="clientType" header="Client Type" />
          <Column
            field="programDate"
            header="Program Date"
            body={dateBodyTemplate}
          />
          <Column field="totalCost" header="Total Cost" />
        </DataTable>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
