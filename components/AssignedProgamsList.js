import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { DataTable, Column } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import { randomId } from "@mui/x-data-grid-generator";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import styles from "../styles/AssignedStaff.module.css";
import {
  getAllChargeItemCodes,
  createNewProgramForClient,
} from "../services/database.mjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PDFGenerator from "./PDFGenerator";
import { tr } from "date-fns/locale";

export default function AssignedProgramsList({
  initialPrograms,
  onAddProgram,
  clientData,
}) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [showContract, setShowContract] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [chargeItemCodes, setChargeItemCodes] = useState([]);
  const [programName, setProgramName] = useState("");
  const [programDate, setProgramDate] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [programDetails, setProgramDetails] = useState({
    programName: programName,
    programDate: programDate,
    totalCost: 0,
  });

  const fetchData = async () => {
    try {
      const data = await getAllChargeItemCodes();
      const formattedData = data.map((item) => ({
        id: item.itemID,
        lineItemCode: item.lineItemCode,
        description: item.description,
        unitPrice: item.unitPrice,
        isService: item.isService,
        isProduct: item.isProduct,
      }));
      setChargeItemCodes(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateContractClick = () => {
    // fetchData();
    setShowContract(true);
  };

  const handleCloseContractModal = () => {
    setShowContract(false);
  };

  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: Date.now(),
        itemCode: null,
        description: "",
        qty: 1,
        price: 1,
        subtotal: 1.0,
        date: null,
        timeSlot: null,
        location: "",
      },
    ]);
  };

  const handleItemChange = (e, id, field) => {
    const val = (e.target && e.target.value) || e.value;
    console.log(val);

    const updatedItems = invoiceItems.map((item) => {
      if (item.id === id) {
        if (field === "itemCode") {
          const selectedItem = val;

          return {
            ...item,
            itemCode: selectedItem ? selectedItem : "",
            description: selectedItem ? selectedItem.description : "",
            price: selectedItem ? selectedItem.unitPrice : 0,
            subtotal: item.qty * (selectedItem ? selectedItem.unitPrice : 0),
          };
        } else {
          const newItem = {
            ...item,
            [field]: val,
          };

          if (field === "qty" || field === "price") {
            newItem.subtotal = newItem.qty * newItem.price;
          }

          return newItem;
        }
      }
      return item;
    });
    setInvoiceItems(updatedItems);
    setProgramDetails({ ...programDetails, totalCost: totalCost });
    console.log(programDetails);
  };
  const handleRowDel = (id) => {
    const updatedItems = invoiceItems.filter((item) => item.id !== id);
    setInvoiceItems(updatedItems);
  };

  // ... existing code ...
  const toast = useRef(null);

  const handleSave = async () => {
    try {
      const programData = {
        programID: randomId(),
        programName: programDetails.programName,
        programDate: programDetails.programDate,
        clientType: clientData.clientType,
        invoiceItems: invoiceItems,
      };

      const newProgram = await createNewProgramForClient(
        clientData.clientID,
        programData
      );

      // // Update the local state with the new program
      // setPrograms([...programs, newProgram]);

      setShowContract(false);

      setProgramDetails({
        programName: "",
        programDate: null,
      });
      setInvoiceItems([]);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Program Saved Successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error saving program:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Saving Program. Please Try Again",
        life: 3000,
      });
    }
  };
  let totalCost = 0;
  const calculateTotal = () => {
    totalCost = invoiceItems.reduce((total, item) => total + item.subtotal, 0);
    // setProgramDetails({ ...programDetails, totalCost: totalCost });
    return totalCost;
  };

  const itemTemplate = (rowData, { field }) => {
    if (field === "itemCode") {
      return (
        <Dropdown
          value={rowData.itemCode}
          options={chargeItemCodes}
          onChange={(e) => handleItemChange(e, rowData.id, "itemCode")}
          placeholder="Select Item Code"
          filter
          optionLabel="lineItemCode"
          style={{ maxWidth: "180px" }}
        />
      );
    }
    if (field === "description") {
      return (
        <InputText
          value={rowData.description}
          onChange={(e) => handleItemChange(e, rowData.id, "description")}
          placeholder="Description"
        />
      );
    }
    if (field === "date") {
      return (
        <Calendar
          value={rowData.date}
          onChange={(e) => handleItemChange(e, rowData.id, "date")}
          placeholder="Select Date"
          showIcon
          dateFormat="mm/dd/yy"
          style={{ width: "160px" }}
        />
      );
    }
    if (field === "timeSlot") {
      return (
        <InputMask
          value={rowData.timeSlot}
          onChange={(e) => handleItemChange(e, rowData.id, "timeSlot")}
          mask="99:99 aa - 99:99 aa"
          placeholder="Enter Timeslot"
        ></InputMask>
      );
    }
    if (field === "location") {
      return (
        <InputText
          value={rowData.location}
          onChange={(e) => handleItemChange(e, rowData.id, "location")}
          placeholder="Location"
        />
      );
    }
    if (field === "qty") {
      return (
        <InputText
          value={rowData.qty}
          onChange={(e) => handleItemChange(e, rowData.id, "qty")}
          placeholder="Qty"
          style={{ width: "60px" }}
        />
      );
    }
    if (field === "price") {
      return (
        <InputText
          value={rowData.price}
          onChange={(e) => handleItemChange(e, rowData.id, "price")}
          placeholder="Price"
          style={{ width: "70px" }}
        />
      );
    }
    if (field === "subtotal") {
      return rowData.subtotal.toFixed(2);
    }
    return null;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className={styles["task-list"]}>
        <div className={styles["header"]}>
          <h1 className={styles.title}>Assigned Programs({programs.length})</h1>
          <Button
            label="Assign Program"
            icon="pi pi-plus"
            className={styles["add-program-button"]}
            onClick={handleCreateContractClick}
          />
        </div>
        <div className={styles["custom-search-bar"]}>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              placeholder="Search Programs"
              onInput={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          value={programs}
          globalFilter={globalFilter}
          paginator
          rows={10}
          className="p-mt-3"
        >
          <Column field="name" header="Program Name" />
          <Column field="date" header="Program Date" />
          <Column field="location" header="Location" />
          {/* Add more columns as necessary */}
        </DataTable>
      </div>

      <Dialog
        header="Create Client Contract"
        visible={showContract}
        style={{ width: "80vw" }}
        modal
        onHide={handleCloseContractModal}
        footer={
          <div className="flex">
            {/* <Button label="Preview" icon="pi pi-eye" onClick={handlePreview} /> */}
            {/* <Button label="PDF" icon="pi pi-file-pdf" onClick={handlePDF} /> */}
            <PDFGenerator
              invoiceItems={invoiceItems}
              clientData={clientData}
              programDetails={programDetails}
            />
            <Button label="Save" icon="pi pi-check" onClick={handleSave} />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="programName">Program Name</label>
            <InputText
              id="programName"
              value={programDetails.programName}
              onChange={(e) =>
                setProgramDetails({
                  ...programDetails,
                  programName: e.target.value,
                })
              }
              placeholder="Enter Program Name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="programDate">Program Date</label>
            <Calendar
              id="programDate"
              value={programDate}
              onChange={(e) =>
                setProgramDetails({
                  ...programDetails,
                  programDate: e.target.value,
                })
              }
              required
              showIcon
              dateFormat="mm/dd/yy"
            />
          </div>
        </div>

        <Card className="p-mb-3">
          <DataTable value={invoiceItems} tableStyle={{ minWidth: "50rem" }}>
            <Column
              field="itemCode"
              header="Item Code"
              body={(rowData) => itemTemplate(rowData, { field: "itemCode" })}
            />
            <Column
              field="description"
              header="Description"
              body={(rowData) =>
                itemTemplate(rowData, { field: "description" })
              }
            />
            <Column
              field="date"
              header="Date"
              body={(rowData) => itemTemplate(rowData, { field: "date" })}
            />
            <Column
              field="timeSlot"
              header="Time Slot"
              body={(rowData) => itemTemplate(rowData, { field: "timeSlot" })}
            />
            <Column
              field="location"
              header="Location"
              body={(rowData) => itemTemplate(rowData, { field: "location" })}
            />
            <Column
              field="qty"
              header="Quantity"
              body={(rowData) => itemTemplate(rowData, { field: "qty" })}
            />
            <Column
              field="price"
              header="Price"
              body={(rowData) => itemTemplate(rowData, { field: "price" })}
            />
            <Column
              field="subtotal"
              header="Amount"
              body={(rowData) => itemTemplate(rowData, { field: "subtotal" })}
            />
            <Column
              body={(rowData) => (
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-rounded"
                  onClick={() => handleRowDel(rowData.id)}
                />
              )}
            />
          </DataTable>
          <div className={styles["custom-total-calculation"]}>
            <Button
              label="Add Item"
              icon="pi pi-plus"
              className={styles["custom-button-margin"]}
              onClick={handleAddItem}
            />
            <div className={styles["custom-total-calculation-container"]}>
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
        </Card>
      </Dialog>
    </>
  );
}
