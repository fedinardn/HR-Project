// import React, { useState } from "react";
import styles from "../../../styles/createChargeItem.module.css";
// import { getAuth } from "firebase/auth";

// export default function MyComponent() {
//   const [isServiceChecked, setIsServiceChecked] = useState(false);
//   const [isProductChecked, setIsProductChecked] = useState(false);

//   const handleServiceCheckboxChange = () => {
//     setIsServiceChecked(!isServiceChecked);
//   };

//   const handleProductCheckboxChange = () => {
//     setIsProductChecked(!isProductChecked);
//   };

//   const FormReusableInput = ({
//     id,
//     name,
//     label,
//     placeholder,
//     type = "text",
//   }) => {
//     return (
//       <div className={styles["form-group"]}>
//         <label className={styles["form-label visually-hidden"]} htmlFor={id}>
//           {label}
//         </label>
//         <input
//           className={styles["form-input"]}
//           type={type}
//           id={id}
//           name={name}
//           placeholder={placeholder}
//           aria-label={label}
//         />
//       </div>
//     );
//   };

//   const FormOptions = ({ id, name, label, checked, onChange }) => {
//     return (
//       <div className={styles["form-options"]}>
//         <div className={styles["form-option"]}>
//           <input
//             className={styles["form-checkbox"]}
//             type="checkbox"
//             tabIndex="0"
//             id={id}
//             name={name}
//             aria-label={label}
//             checked={checked}
//             onChange={onChange}
//           />
//           <span className={styles["form-option-label"]}>{label}</span>
//         </div>
//       </div>
//     );
//   };

//   const onChargeItemSubmitted = async (event) => {
//     event.preventDefault();
//     const auth = getAuth(); // Get the Auth instance (assuming you need user authentication)

//     const user = auth.currentUser;

//     const lineItemCode = event.target.lineItemCode.value;
//     const description = event.target.description.value;
//     const unitPrice = event.target.unitPrice.value;
//     const isProduct = isProductChecked;
//     const isService = isServiceChecked;

//     const response = await fetch("/api/charge-items/chargeItems", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         lineItemCode: lineItemCode,
//         description: description,
//         unitPrice: unitPrice,
//         isProduct: isProduct,
//         isService: isService,
//       }),
//     });
//     if (response.ok) {
//       console.log("Item submitted");
//     }
//     event.target.reset();
//     console.log({ isproduct: isProduct });
//     console.log({ isservice: isService });
//   };

//   return (
//     <>
//       <main className={styles["main-container"]}>
//         <section className={styles["form-section"]}>
//           <h1 className={styles["form-title"]}>Create New Item</h1>
//           <form
//             className={styles["form"]}
//             onSubmit={(event) => onChargeItemSubmitted(event)}
//           >
//             <FormReusableInput
//               id="lineItemCode"
//               name="lineItemCode"
//               label="Line Item Code"
//               placeholder="Enter code"
//             />
//             <FormReusableInput
//               id="description"
//               name="description"
//               label="Description"
//               placeholder="Enter description"
//             />
//             <FormReusableInput
//               id="unitPrice"
//               name="unitPrice"
//               label="Unit Price"
//               placeholder="$0.00"
//               type="text"
//             />
//             <FormOptions
//               id="isService"
//               name="isService"
//               label="is Service"
//               checked={isServiceChecked}
//               onChange={handleServiceCheckboxChange}
//             />
//             <FormOptions
//               id="isProduct"
//               name="isProduct"
//               label="is Product"
//               checked={isProductChecked}
//               onChange={handleProductCheckboxChange}
//             />
//             <div className={styles["form-actions"]}>
//               <button type="button" className={styles["form-cancel"]}>
//                 Cancel
//               </button>
//               <button type="submit" className={styles["form-save"]}>
//                 Save
//               </button>
//             </div>
//           </form>
//         </section>
//       </main>
//     </>
//   );
// }

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
    // console.log(newRow);
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

  //   const apiRef = useGridApiRef();

  const handleSaveClick = (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    setRows(rows.filter((row) => row.id !== id));
    // console.log(id);
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
    // console.log(updatedRow);

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
