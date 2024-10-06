import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { getAllUsers, getAllLoggedHours } from "../../../services/database.mjs";

const PayFinalization = () => {
  const [users, setUsers] = useState([]);
  const [loggedHours, setLoggedHours] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [payData, setPayData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await getAllUsers();
      const fetchedHours = await getAllLoggedHours();
      setUsers(fetchedUsers);
      setLoggedHours(fetchedHours.filter((log) => log.approved === true));
    };
    fetchData();
  }, []);

  const calculatePay = () => {
    if (!dateRange || dateRange.length !== 2) return;

    const [startDate, endDate] = dateRange;
    endDate.setHours(23, 59, 59, 999);

    const filteredHours = loggedHours.filter((log) => {
      const submittedDate = new Date(log.dateSubmitted.toDate());
      return submittedDate >= startDate && submittedDate <= endDate;
    });

    const calculatedPayData = filteredHours
      .map((log) => {
        const user = users.find((u) => u.email === log.userId);
        if (!user) return null;

        const [firstName, ...lastNameParts] = user.username.split(" ");
        const lastName = lastNameParts.join(" ");
        const payRate = parseFloat(user.payRate);
        const totalPay = log.hours * payRate;

        return {
          "Position ID": user.positionId,
          "Employee ID": user.employeeId,
          "First Name": firstName,
          "Last Name": lastName,
          "Employee Type": user.employeeType,
          "Job Family Group": user.jobFamilyGroup,
          "Business Title": user.businessTitle,
          "End Employment Date": user.endEmploymentDate,
          "Pay Rate Type": user.payRateType,
          "Manager Name": user.managerName,
          "Cost Center": user.costCenter,
          "Pay Rate": user.payRate,
          "Program Name": log.programName,
          Hours: log.hours,
          "Total Pay": totalPay.toFixed(2),
        };
      })
      .filter(Boolean);

    setPayData(calculatedPayData);
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(payData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "pay_data");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });
        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const columns = [
    { field: "Position ID", header: "Position ID" },
    { field: "Employee ID", header: "Employee ID" },
    { field: "First Name", header: "First Name" },
    { field: "Last Name", header: "Last Name" },
    { field: "Employee Type", header: "Employee Type" },
    { field: "Job Family Group", header: "Job Family Group" },
    { field: "Business Title", header: "Business Title" },
    { field: "End Employment Date", header: "End Employment Date" },
    { field: "Pay Rate Type", header: "Pay Rate Type" },
    { field: "Manager Name", header: "Manager Name" },
    { field: "Cost Center", header: "Cost Center" },
    { field: "Pay Rate", header: "Pay Rate" },
    { field: "Program Name", header: "Program Name" },
    { field: "Hours", header: "Hours" },
    { field: "Total Pay", header: "Total Pay" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pay Finalization</h1>
      <div className="flex justify-content-between items-center mb-4">
        <div className="w-20rem">
          <Calendar
            value={dateRange}
            onChange={(e) => setDateRange(e.value)}
            selectionMode="range"
            readOnlyInput
            placeholder="Select Date Range"
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            icon="pi pi-check"
            label="Calculate Pay"
            onClick={calculatePay}
            className="p-button-success"
          />
          <Button
            icon="pi pi-file-excel"
            label="Export to Excel"
            onClick={exportExcel}
            className="p-button-help"
            disabled={payData.length === 0}
          />
        </div>
      </div>
      <DataTable value={payData} paginator rows={10} className="p-datatable-sm">
        {columns.map((col) => (
          <Column key={col.field} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </div>
  );
};

export default PayFinalization;
