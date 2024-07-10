import styles from "../../../styles/createChargeItem.module.css";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  getAllProgramsInGrid,
  createNewProgramInGrid,
  updateProgramInGrid,
  deleteProgramInGrid,
} from "../../../services/database.mjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import crypto from "crypto";

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { getRowIdFromRowModel } from "@mui/x-data-grid/internals";
import { useGridApiRef } from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { enUS as locale } from "date-fns/locale";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import {
  useGridApiContext,
  GRID_DATE_COL_DEF,
  getGridDateOperators,
} from "@mui/x-data-grid";
import { isValid, parseISO } from "date-fns";

const dateAdapter = new AdapterDateFns({ locale });

const dateColumnType = {
  ...GRID_DATE_COL_DEF,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getGridDateOperators(false).map((item) => ({
    ...item,
    InputComponent: GridFilterDateInput,
    InputComponentProps: { showTime: false },
  })),
  valueFormatter: (value) => {
    //     if (value) {
    //       return dateAdapter.format(value, "keyboardDate");
    //     }
    //     return "";
    //   },
    //     if (value) {
    //       try {
    //         const date = new Date(value);
    //         return dateAdapter.format(date, "keyboardDate");
    //       } catch (error) {
    //         console.error("Invalid date value:", value, error);
    //         return "";
    //       }
    //     }
    //     return "";
    //   },

    if (value) {
      try {
        const date = parseISO(value); // Changed to parseISO
        if (isValid(date)) {
          // Added validation check
          return dateAdapter.format(date, "keyboardDate");
        } else {
          throw new Error("Invalid date");
        }
      } catch (error) {
        console.error("Invalid date value:", value, error);
        return "";
      }
    }
    return "";
  },
};

const GridEditDateInput = styled(InputBase)({
  fontSize: "inherit",
  padding: "0 9px",
});

function WrappedGridEditDateInput(props) {
  const { InputProps, focused, ...other } = props;
  return <GridEditDateInput fullWidth {...InputProps} {...other} />;
}

function GridEditDateCell({ id, field, value, colDef }) {
  const apiRef = useGridApiContext();

  const Component = colDef.type === "dateTime" ? DateTimePicker : DatePicker;

  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Component
      value={value ? new Date(value) : null}
      //   autoFocus
      onChange={handleChange}
      slots={{ textField: WrappedGridEditDateInput }}
    />
  );
}

function GridFilterDateInput(props) {
  const { item, showTime, applyValue, apiRef } = props;

  const Component = showTime ? DateTimePicker : DatePicker;

  const handleFilterChange = (newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Component
      value={item.value ? new Date(item.value) : null}
      label={apiRef.current.getLocaleText("filterPanelInputLabel")}
      slotProps={{
        textField: {
          variant: "standard",
        },
        inputAdornment: {
          sx: {
            "& .MuiButtonBase-root": {
              marginRight: -1,
            },
          },
        },
      }}
      onChange={handleFilterChange}
    />
  );
}

const initialRows = [
  {
    id: randomId(),
    programName: "",
    date: "",
    time: "",
    clientType: "",
    locationAndProgram: "",
    groupSize: "",
    contactPerson: "",
    contactPersonEmail: "",
    underAgeParticipants: false,
    facilitators: "",
    facilitatorEmails: "",
    notes: "",
    returningClient: false,
    contractSent: false,
    preProgramEmail: false,
    packetReady: false,
    packetProcessed: false,
    followUp: false,
    cancelled: false,
    facilitatorsNeeded: "",
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        lineItemCode: "",
        description: "",
        unitPrice: "",
        isService: false,
        isProduct: false,
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "programName" },
    }));
  };

  return (
    <GridToolbarContainer className={styles["header"]}>
      <h1 className={styles["form-title"]}>Program Schedule Grid</h1>

      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudProgramGrid() {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleCheckboxChange = async (id, field, value) => {
    const rowToUpdate = rows.find((row) => row.id === id);
    const updatedRow = { ...rowToUpdate, [field]: value };
    const newRow = await updateProgramInGrid(id, updatedRow);
    // console.log(newRow);
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProgramsInGrid();
        const formattedData = data.map((program) => ({
          id: program.programID,
          programName: program.programName,
          date: program.date,
          time: program.time,
          clientType: program.clientType,
          locationAndProgram: program.locationAndProgram,
          groupSize: program.groupSize,
          contactPerson: program.contactPerson,
          contactPersonEmail: program.contactPersonEmail,
          underAgeParticipants: program.underAgeParticipants,
          facilitators: program.facilitators,
          facilitatorEmails: [],
          notes: program.notes,
          returningClient: program.returningClient,
          contractSent: program.contractSent,
          preProgramEmail: program.preProgramEmail,
          packetReady: program.packetReady,
          packetProcessed: program.packetProcessed,
          followUp: program.followUp,
          cancelled: program.cancelled,
          facilitatorsNeeded: program.facilitatorsNeeded,
        }));
        setRows(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  //   const apiRef = useGridApiRef();

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    setRows(rows.filter((row) => row.id !== id));
    // console.log(id);
    await deleteProgramInGrid(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow };
    // console.log(updatedRow);

    try {
      if (updatedRow.isNew) {
        setRowModesModel({
          ...rowModesModel,
          [updatedRow.id]: { mode: GridRowModes.View },
        });
        const createdItem = await createNewProgramInGrid(
          updatedRow.id,
          updatedRow.programName,
          updatedRow.date,
          updatedRow.time,
          updatedRow.clientType,
          updatedRow.locationAndProgram,
          updatedRow.groupSize,
          updatedRow.contactPerson,
          updatedRow.contactPersonEmail,
          updatedRow.notes,
          updatedRow.facilitators

          //   updatedRow.facilitatorsNeeded
        );
      } else {
        await updateProgramInGrid(updatedRow.id, updatedRow);
      }

      setRows((oldRows) =>
        oldRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );

      return updatedRow;
    } catch (error) {
      console.error("Error updating row:", error);
      //   throw new Error("row not added");
    }
  };

  const handleProcessRowUpdateError = async () => {
    // console.log("row not added");
    console.log("rI came here");
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "programName",
      id: "programName",
      headerName: "Program Name",
      width: 250,
      editable: true,
    },
    {
      field: "date",
      id: "date",
      headerName: "Date",
      ...dateColumnType,
      width: 150,
      editable: true,
    },
    {
      field: "time",
      id: "time",
      headerName: "Time",
      width: 150,
      editable: true,
    },

    {
      field: "clientType",
      id: "clientType",
      headerName: "Client Type",
      width: 100,
      editable: true,
    },
    {
      field: "locationAndProgram",
      id: "locationAndProgram",
      headerName: "Location and Program",
      width: 250,
      editable: true,
    },
    {
      field: "groupSize",
      id: "groupSize",
      headerName: "Group Size",
      width: 100,
      editable: true,
    },

    {
      field: "contactPerson",
      id: "contactPerson",
      headerName: "Contact Person",
      width: 250,
      editable: true,
    },
    {
      field: "contactPersonEmail",
      id: "contactPersonEmail",
      headerName: "Contact Person Email",
      width: 250,
      editable: true,
    },

    {
      field: "underAgeParticipants",
      id: "underAgeParticipants",
      headerName: "Under Age Participants",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(
              params.id,
              "underAgeParticipants",
              event.target.checked
            )
          }
        />
      ),
    },

    {
      field: "facilitators",
      id: "facilitators",
      headerName: "Facilitators",
      width: 150,
      editable: true,
    },

    {
      field: "facilitatorEmails",
      id: "facilitatorEmails",
      headerName: "Facilitator Emails",
      width: 250,
      editable: false,
    },

    {
      field: "notes",
      id: "notes",
      headerName: "Notes",
      width: 200,
      editable: true,
    },

    {
      field: "returningClient",
      id: "returningClient",
      headerName: "Returning Client",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(
              params.id,
              "returningClient",
              event.target.checked
            )
          }
        />
      ),
    },

    {
      field: "contractSent",
      id: "contractSent",
      headerName: "Contract Sent",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(
              params.id,
              "contractSent",
              event.target.checked
            )
          }
        />
      ),
    },

    {
      field: "preProgramEmail",
      id: "preProgramEmail",
      headerName: "Pre Program Email",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(
              params.id,
              "preProgramEmail",
              event.target.checked
            )
          }
        />
      ),
    },

    {
      field: "packetReady",
      id: "packetReady",
      headerName: "Packet Ready",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(params.id, "packetReady", event.target.checked)
          }
        />
      ),
    },

    {
      field: "packetProcessed",
      id: "packetProcessed",
      headerName: "Packet Processed",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(
              params.id,
              "packetProcessed",
              event.target.checked
            )
          }
        />
      ),
    },

    {
      field: "followUp",
      id: "followUp",
      headerName: "Follow Up",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(params.id, "followUp", event.target.checked)
          }
        />
      ),
    },

    {
      field: "cancelled",
      id: "cancelled",
      headerName: "Cancelled",
      width: 50,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(params.id, "cancelled", event.target.checked)
          }
        />
      ),
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 80,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <main>
      <Box
        sx={{
          height: 800,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </LocalizationProvider>
      </Box>
    </main>
  );
}
