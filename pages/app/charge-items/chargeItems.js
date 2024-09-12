import styles from "../../../styles/createChargeItem.module.css";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  getAllChargeItemCodes,
  createChargeItem,
  updateChargeItem,
  deleteChargeItem,
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

const initialRows = [
  {
    id: randomId(),
    lineItemCode: "",
    description: "",
    unitPrice: "",
    isService: false,
    isProduct: false,
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
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "lineItemCode" },
    }));
  };

  return (
    <GridToolbarContainer className={styles["header"]}>
      <h1 className={styles["form-title"]}>Charge Item Codes</h1>

      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleCheckboxChange = async (id, field, value) => {
    const rowToUpdate = rows.find((row) => row.id === id);
    const updatedRow = { ...rowToUpdate, [field]: value };
    const newRow = await updateChargeItem(id, updatedRow);
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
  };
  useEffect(() => {
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
        setRows(formattedData);
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

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    setRows(rows.filter((row) => row.id !== id));
    await deleteChargeItem(id);
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

    try {
      if (updatedRow.isNew) {
        setRowModesModel({
          ...rowModesModel,
          [updatedRow.id]: { mode: GridRowModes.View },
        });
        const createdItem = await createChargeItem(
          updatedRow.id,
          updatedRow.lineItemCode,
          updatedRow.description,
          updatedRow.unitPrice,
          updatedRow.isService,
          updatedRow.isProduct
        );
      } else {
        await updateChargeItem(updatedRow.id, updatedRow);
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
    console.log("row not added");
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "lineItemCode",
      id: "lineItemCode",
      headerName: "Line Item Code",
      width: 180,
      editable: true,
    },
    {
      field: "description",
      id: "description",
      headerName: "Description",
      width: 280,
      editable: true,
    },
    {
      field: "unitPrice",
      id: "unitPrice",
      headerName: "Unit Price",
      width: 150,
      editable: true,
    },
    {
      field: "isService",
      id: "isService",
      headerName: "isService",
      width: 120,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(params.id, "isService", event.target.checked)
          }
        />
      ),
    },
    {
      field: "isProduct",
      id: "isProduct",
      headerName: "isProduct",
      width: 120,
      //   editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) =>
            handleCheckboxChange(params.id, "isProduct", event.target.checked)
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
    <main className={styles["main-container"]}>
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
      </Box>
    </main>
  );
}
