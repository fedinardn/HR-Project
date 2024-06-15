// import React, { useState } from "react";
import styles from "../../../styles/createChargeItem.module.css";

// export default function MyComponent() {
//   const [isServiceChecked, setIsServiceChecked] = useState(false);
//   const [isProductChecked, setIsProductChecked] = useState(false);
//   const [lineItemCode, setLineItemCode] = useState("");
//   const [description, setDescription] = useState("");
//   const [unitPrice, setUnitPrice] = useState("");

//   const handleServiceCheckboxChange = () => {
//     setIsServiceChecked(!isServiceChecked);
//   };

//   const handleProductCheckboxChange = () => {
//     setIsProductChecked(!isProductChecked);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     switch (name) {
//       case "lineItemCode":
//         setLineItemCode(value);

//       case "description":
//         setDescription(value);
//         break;
//       case "unitPrice":
//         setUnitPrice(value);
//         break;
//       default:
//         break;
//     }
//   };

//   const FormReusableInput = ({
//     id,
//     name,
//     label,
//     placeholder,
//     type = "text",
//     value,
//     onChange,
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
//           value={value}
//           onChange={onChange}
//           aria-label={label}
//         />
//       </div>
//     );
//   };

//   const FormOptions = ({ id, name, ariaLabel, checked, onChange }) => {
//     return (
//       <div className={styles["form-options"]}>
//         <div className={styles["form-option"]}>
//           <input
//             className={styles["form-checkbox"]}
//             type="checkbox"
//             tabIndex="0"
//             id={id}
//             name={name}
//             checked={checked}
//             aria-label={ariaLabel}
//             onChange={onChange}
//           />
//           <span className={styles["form-option-label"]}>{name}</span>
//         </div>
//       </div>
//     );
//   };

//   const resetForm = () => {
//     setLineItemCode("");
//     setDescription("");
//     setUnitPrice("");
//     setIsServiceChecked(false);
//     setIsProductChecked(false);
//   };

//   const onChargeItemSubmitted = async (event) => {
//     event.preventDefault();

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
//               value={lineItemCode}
//               onChange={handleInputChange}
//             />
//             <FormReusableInput
//               id="description"
//               name="description"
//               label="Description"
//               placeholder="Enter description"
//               value={description}
//               onChange={handleInputChange}
//             />
//             <FormReusableInput
//               id="unitPrice"
//               name="unitPrice"
//               label="Unit Price"
//               placeholder="$0.00"
//               type="text"
//               value={unitPrice}
//               onChange={handleInputChange}
//             />
//             <FormOptions
//               id="isService"
//               name="isService"
//               ariaLabel="isService"
//               checked={isServiceChecked}
//               onChange={handleServiceCheckboxChange}
//             />

//             <FormOptions
//               id="isProduct"
//               name="isProduct"
//               ariaLabel="isProduct"
//               checked={isProductChecked}
//               onChange={handleProductCheckboxChange}
//             />
//             <div className={styles["form-actions"]}>
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className={styles["form-cancel"]}
//               >
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

// import * as React from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/DeleteOutlined";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Close";
// import Checkbox from "@mui/material/Checkbox";

// import {
//   GridRowModes,
//   DataGrid,
//   GridToolbarContainer,
//   GridActionsCellItem,
//   GridRowEditStopReasons,
// } from "@mui/x-data-grid";
// import {
//   randomCreatedDate,
//   randomTraderName,
//   randomId,
//   randomArrayItem,
// } from "@mui/x-data-grid-generator";

// const roles = ["Market", "Finance", "Development"];
// const randomRole = () => {
//   return randomArrayItem(roles);
// };

// const initialRows = [
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 25,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 36,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 19,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 28,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 23,
//     joinDate: randomCreatedDate(),
//     role: randomRole(),
//   },
// ];

// function EditToolbar(props) {
//   const { setRows, setRowModesModel } = props;

//   const handleClick = () => {
//     const id = randomId();
//     setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
//     }));
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }

// export default function FullFeaturedCrudGrid() {
//   const [rows, setRows] = React.useState(initialRows);
//   const [rowModesModel, setRowModesModel] = React.useState({});

//   const handleRowEditStop = (params, event) => {
//     if (params.reason === GridRowEditStopReasons.rowFocusOut) {
//       event.defaultMuiPrevented = true;
//     }
//   };

//   const handleEditClick = (id) => () => {
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
//   };

//   const handleSaveClick = (id) => () => {
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
//   };

//   const handleDeleteClick = (id) => () => {
//     setRows(rows.filter((row) => row.id !== id));
//   };

//   const handleCancelClick = (id) => () => {
//     setRowModesModel({
//       ...rowModesModel,
//       [id]: { mode: GridRowModes.View, ignoreModifications: true },
//     });

//     const editedRow = rows.find((row) => row.id === id);
//     if (editedRow.isNew) {
//       setRows(rows.filter((row) => row.id !== id));
//     }
//   };

//   const processRowUpdate = (newRow) => {
//     const updatedRow = { ...newRow, isNew: false };
//     setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
//     return updatedRow;
//   };

//   const handleRowModesModelChange = (newRowModesModel) => {
//     setRowModesModel(newRowModesModel);
//   };

//   const columns = [
//     { field: "name", headerName: "Line Item Code", width: 180, editable: true },
//     {
//       field: "age",
//       headerName: "Age",
//       type: "number",
//       width: 80,
//       align: "left",
//       headerAlign: "left",
//       editable: true,
//     },
//     {
//       field: "joinDate",
//       headerName: "Join date",
//       type: "date",
//       width: 180,
//       editable: true,
//     },
//     {
//       field: "role",
//       headerName: "Department",
//       width: 220,
//       editable: true,
//       type: "singleSelect",
//       valueOptions: ["Market", "Finance", "Development"],
//     },
//     {
//       field: "actions",
//       type: "actions",
//       headerName: "Actions",
//       width: 100,
//       cellClassName: "actions",
//       getActions: ({ id }) => {
//         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

//         if (isInEditMode) {
//           return [
//             <GridActionsCellItem
//               icon={<SaveIcon />}
//               label="Save"
//               sx={{
//                 color: "primary.main",
//               }}
//               onClick={handleSaveClick(id)}
//             />,
//             <GridActionsCellItem
//               icon={<CancelIcon />}
//               label="Cancel"
//               className="textPrimary"
//               onClick={handleCancelClick(id)}
//               color="inherit"
//             />,
//           ];
//         }

//         return [
//           <GridActionsCellItem
//             icon={<EditIcon />}
//             label="Edit"
//             className="textPrimary"
//             onClick={handleEditClick(id)}
//             color="inherit"
//           />,
//           <GridActionsCellItem
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={handleDeleteClick(id)}
//             color="inherit"
//           />,
//         ];
//       },
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         height: 500,
//         width: "100%",
//         "& .actions": {
//           color: "text.secondary",
//         },
//         "& .textPrimary": {
//           color: "text.primary",
//         },
//       }}
//     >
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         editMode="row"
//         rowModesModel={rowModesModel}
//         onRowModesModelChange={handleRowModesModelChange}
//         onRowEditStop={handleRowEditStop}
//         processRowUpdate={processRowUpdate}
//         slots={{
//           toolbar: EditToolbar,
//         }}
//         slotProps={{
//           toolbar: { setRows, setRowModesModel },
//         }}
//       />
//     </Box>
//   );
// }

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";

const roles = ["Market", "Finance", "Development"];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows = [
  {
    id: randomId(),
    lineItemCode: randomTraderName(), // Adjusted field name
    description: "",
    unitPrice: "",
    isService: false,
    isProduct: false,
  },
  // Add more initial rows as needed
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
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "lineItemCode",
      headerName: "Line Item Code",
      width: 180,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: true,
    },
    {
      field: "unitPrice",
      headerName: "Unit Price",
      width: 150,
      editable: true,
    },
    {
      field: "isService",
      headerName: "isService",
      width: 120,
      renderCell: (params) => <Checkbox />,
    },
    {
      field: "isProduct",
      headerName: "isProduct",
      width: 120,
      renderCell: (params) => <Checkbox />,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
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
          //   height: 800,
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
