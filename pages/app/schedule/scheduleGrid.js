import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { randomId } from "@mui/x-data-grid-generator";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {
  getAllProgramsInGrid,
  deleteProgramInGrid,
  getUserPermission,
  getAllStaff,
} from "../../../services/database.mjs";
import ProgramDialog from "../../../components/ProgramDialog";

export default function ProgramList({ user }) {
  const [programs, setPrograms] = useState([]);
  const [program, setProgram] = useState({
    id: randomId(),
    programName: "",
    date: "",
    startTime: "",
    endTime: "",
    clientType: "",
    locationAndProgram: "",
    groupSize: "",
    contactPerson: "",
    contactPersonEmail: "",
    underAgeParticipants: false,
    facilitators: [],
    facilitatorEmails: [],
    notes: "",
    returningClient: false,
    contractSent: false,
    preProgramEmail: false,
    packetReady: false,
    packetProcessed: false,
    followUp: false,
    cancelled: false,
    facilitatorsNeeded: {
      Lead: "",
      Belayers: "",
      "Low and High": "",
      TA: "",
      Support: "",
      Van: "",
    },
  });

  const [programDialog, setProgramDialog] = useState(false);
  const [deleteProgramDialog, setDeleteProgramDialog] = useState(false);
  const [deleteProgramsDialog, setDeleteProgramsDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState(null);
  const [editable, setEditable] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [userPermission, setUserPermission] = useState("");
  const globalFilterFields = [
    "programName",
    "date",
    "facilitators",
    "contactPerson",
    "contactPersonEmail",
    "locationAndProgram",
  ];

  const [facilitators, setFacilitators] = useState([]);

  const toast = useRef(null);
  const dt = useRef(null);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(programs);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "programs");
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

  const fetchData = async () => {
    if (user) {
      try {
        const permission = await getUserPermission(user.email);
        setUserPermission(permission);
        const data = await getAllProgramsInGrid();
        setPrograms(data);

        const staff = await getAllStaff();
        const formattedStaff = staff.map((item) => ({
          id: item.staffID,
          name: `${item.firstName} ${item.lastName}`,
          email: item.email,
          phone: item.phone,
        }));

        setFacilitators(formattedStaff);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.log("No User");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const header = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0">Manage Programs</h4>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </IconField>
      </div>
    );
  };
  const openNew = () => {
    setProgram({
      id: randomId(),
      programName: "",
      date: "",
      startTime: "",
      endTime: "",
      clientType: "",
      locationAndProgram: "",
      groupSize: "",
      contactPerson: "",
      contactPersonEmail: "",
      underAgeParticipants: false,
      facilitators: [],
      // facilitatorEmails: [],
      notes: "",
      returningClient: false,
      contractSent: false,
      preProgramEmail: false,
      packetReady: false,
      packetProcessed: false,
      followUp: false,
      cancelled: false,
      facilitatorsNeeded: {
        Lead: "",
        Belayers: "",
        "Low and High": "",
        TA: "",
        Support: "",
        Van: "",
      },
      isNew: true,
    });
    setSubmitted(false);
    setProgramDialog(true);
    setEditable(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {userPermission == "Admin" && (
          <>
            <Button
              label="New"
              icon="pi pi-plus"
              className="p-button-success"
              onClick={openNew}
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={confirmDeleteSelected}
              disabled={!selectedPrograms || !selectedPrograms.length}
            />
          </>
        )}
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div>
        {userPermission == "Admin" && (
          <Button
            label="Export"
            icon="pi pi-upload"
            className="p-button-help"
            onClick={exportExcel}
          />
        )}
      </div>
    );
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProgramDialog(false);
  };

  const hideDeleteProgramDialog = () => {
    setDeleteProgramDialog(false);
  };

  const hideDeleteProgramsDialog = () => {
    setDeleteProgramsDialog(false);
  };

  const showProgramDetails = (program) => {
    setProgram({ ...program.data });
    setProgramDialog(true);
    setEditable(false);
  };

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const confirmDeleteSelected = () => {
    setDeleteProgramsDialog(true);
  };

  const editProgram = (program) => {
    setProgram({ ...program });
    setProgramDialog(true);
    setEditable(true);
  };

  const confirmDeleteProgram = (program) => {
    setProgram(program);
    setDeleteProgramDialog(true);
  };

  const deleteProgram = async () => {
    let _program = { ...program };

    setPrograms(programs.filter((row) => row.programID !== _program.programID));

    await deleteProgramInGrid(_program.programID);
    setDeleteProgramDialog(false);
    toast.current.show({
      severity: "error",
      summary: "Successful",
      detail: "Program Deleted Successfully",
      life: 3000,
    });
    fetchData();
  };

  const deleteSelectedPrograms = async () => {
    let _programs = programs.filter((val) => !selectedPrograms.includes(val));

    for (let program of selectedPrograms) {
      await deleteProgramInGrid(program.programID);
    }

    setPrograms(_programs);

    setDeleteProgramsDialog(false);

    setSelectedPrograms(null);

    fetchData();
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Programs Deleted",
      life: 3000,
    });
  };

  const ClientTypeDropdown = ({ onChange }) => {
    const clientTypes = ["STU", "NON-CU-STU", "CUP", "PDP", "COMMYTH"];

    return (
      <div className="card flex justify-content-center">
        <Dropdown
          value={program.clientType}
          onChange={onChange}
          options={clientTypes}
          optionLabel="name"
          placeholder="Select Client Type"
          className="w-full md:w-100rem"
          disabled={!editable}
        />
      </div>
    );
  };

  const formatFacilitatorsNeeded = (facilitatorsNeeded) => {
    const formattedText = Object.entries(facilitatorsNeeded)
      .filter(([key, value]) => value && value !== "0" && value !== "")
      .map(([key, value]) => `${value} ${key}`)
      .join(", ");

    return formattedText ? `NEED ${formattedText}` : null;
  };

  const facilitatorsNeededBodyTemplate = (rowData) => {
    const formattedText = formatFacilitatorsNeeded(rowData.facilitatorsNeeded);

    return formattedText ? (
      <Message severity="warn" text={formattedText} />
    ) : (
      <Message severity="success" text="No facilitators needed" />
    );
  };

  const deleteProgramDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProgramDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProgram}
      />
    </>
  );

  const deleteProgramsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProgramsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedPrograms}
      />
    </React.Fragment>
  );

  const rowClass = (data) => {
    return {
      "bg-red-400": data.cancelled === true,
    };
  };

  return (
    <div>
      <Toast ref={toast} />

      <Toolbar
        className="mb-4"
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />
      <div className="card">
        <DataTable
          ref={dt}
          value={programs}
          selection={selectedPrograms}
          onSelectionChange={(e) => [setSelectedPrograms(e.value)]}
          dataKey={program.programID}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} programs"
          globalFilter={globalFilter}
          globalFilterFields={globalFilterFields}
          header={header}
          rowClassName={rowClass}
          resizableColumns={true}
          reorderableColumns={true}
          showGridlines
          sortField="date"
          sortOrder={1}
          onRowDoubleClick={showProgramDetails}
        >
          <Column selectionMode="multiple" exportable={false}></Column>

          <Column field="programName" header="Program Name" sortable></Column>
          <Column
            field="date"
            header="Date"
            body={(rowData) => rowData.date}
            sortable
          ></Column>
          <Column
            field="startTime"
            header="Start Time"
            body={(rowData) =>
              rowData.startTime
                ? new Date(rowData.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : rowData.startTime
            }
            sortable
          ></Column>
          <Column
            field="endTime"
            header="End Time"
            body={(rowData) =>
              rowData.endTime
                ? new Date(rowData.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : rowData.endTime
            }
            sortable
          ></Column>
          <Column field="clientType" header="Client Type" sortable></Column>
          <Column
            field="locationAndProgram"
            header="Location and Program"
            sortable
          ></Column>
          <Column field="groupSize" header="Group Size" sortable></Column>
          <Column
            field="contactPerson"
            header="Contact Person"
            sortable
          ></Column>
          <Column
            field="contactPersonEmail"
            header="Contact Person Email"
            sortable
          ></Column>
          <Column
            field="facilitatorsNeeded"
            header="Facilitators Needed"
            body={facilitatorsNeededBodyTemplate}
            style={{ maxWidth: "300px", overflow: "scroll" }}
            sortable
          ></Column>

          <Column
            field="notes"
            header="Notes"
            sortable
            style={{
              maxWidth: "200px",
              maxHeight: "50px",
              overflow: "scroll",
            }}
          ></Column>

          {userPermission == "Admin" && (
            <Column
              body={(rowData) => (
                <>
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => editProgram(rowData)}
                  />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteProgram(rowData)}
                  />
                </>
              )}
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          )}
        </DataTable>
      </div>

      <ProgramDialog
        visible={programDialog}
        program={program}
        editable={editable}
        onHide={hideDialog}
        onEdit={toggleEditable}
        facilitators={facilitators}
        userPermission={userPermission}
        onSave={fetchData}
      />

      <Dialog
        visible={deleteProgramDialog}
        style={{ width: "32rem" }}
        header="Confirm"
        modal
        footer={deleteProgramDialogFooter}
        onHide={hideDeleteProgramDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {program && (
            <span>
              Are you sure you want to delete <b>{program.programName}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProgramsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProgramsDialogFooter}
        onHide={hideDeleteProgramsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {program && (
            <span>Are you sure you want to delete the selected programs?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
