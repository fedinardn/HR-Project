// import styles from "../styles/EditStaffModal.module.css";
// import React, { useState, useEffect } from "react";
// import { updateStaffDetails } from "../services/database.mjs";
// import { useRouter } from "next/router";

// const trainingLows = ["No", "TA", "Level 1", "Level 2", "Lead"];
// const trainingHighs = ["No", "TA", "Level 1", "Level 2", "Lead"];
// const towerTraining = ["No", "TA", "Lead"];
// const rescueTraining = ["No", "Yes"];
// const proFacilitator = ["No", "TA", "Level 1", "Lead"];
// const typeOfStaff = ["Student", "Staff", "Alumni", "Community"];

// const DetailsInputColumn = ({ label, id, value, onChange }) => (
//   <div className={styles["details-input-column"]}>
//     <label htmlFor={id} className={styles["visually-hidden"]}>
//       {label}
//     </label>
//     <input
//       className={styles["details-input"]}
//       id={id}
//       name={id}
//       type="text"
//       placeholder={label}
//       value={value}
//       onChange={onChange}
//     />
//   </div>
// );

// const EditableDetailsSection = ({ inputs, staffData, handleInputChange }) => {
//   return (
//     <section className={styles["editable-details-section"]}>
//       {inputs.map((input) => (
//         <DetailsInputColumn
//           key={input.id}
//           id={input.id}
//           label={input.label}
//           value={staffData[input.id] || ""}
//           onChange={handleInputChange}
//         />
//       ))}
//     </section>
//   );
// };

// const LevelTraining = ({
//   id,
//   title,
//   options,
//   staffData,
//   handleLevelChange,
// }) => {
//   return (
//     <div className={styles["level-training"]}>
//       <p className={styles["level-training-title"]}>{title}</p>
//       {/* className={styles["level-training-container"]} */}
//       <div className={styles["select-wrapper"]}>
//         <select
//           id={id}
//           className={styles["select-input"]}
//           value={staffData[id] || ""}
//           onChange={(e) => handleLevelChange(e, id)}
//         >
//           {options.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <img
//           src="https://cdn.builder.io/api/v1/image/assets/TEMP/ab4728370a058d975ad105b2a1cfa86d4b1eb5f36de052e8ac72a6316729bacf?apiKey=6dceda0d543f454b955d90f7c576a010&"
//           alt={title}
//           className={styles["select-arrow"]}
//         />
//       </div>
//     </div>
//   );
// };

// const EditStaffModal = ({ staff, onSave, onCancel }) => {
//   const [staffData, setStaffData] = useState({ ...staff });
//   const router = useRouter();
//   const staffID = router.query.employeeId;

//   useEffect(() => {
//     setStaffData({ ...staff });
//   }, [staff]);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setStaffData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleLevelChange = (e, key) => {
//     setStaffData((prevState) => ({
//       ...prevState,
//       [key]: e.target.value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       await updateStaffDetails(staffID, staffData);
//       onSave(staffData);
//     } catch (error) {
//       console.error("Error updating staff details:", error);
//     }
//   };
//   const handleCancel = () => {
//     onCancel();
//   };

//   return (
//     <div className={styles["container"]}>
//       <div className={styles["header"]}>
//         <div className={styles["profile-img-container"]}>
//           <img
//             loading="lazy"
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee5d1d7e1bf27db1317898ef58f822aa3e7fa3ba64b38134e0690ba431d5a008?apiKey=6dceda0d543f454b955d90f7c576a010&"
//             alt=""
//             className={styles["profile-img"]}
//           />
//           <img
//             loading="lazy"
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5b0c388f8e47aac81b07a1390828f9906d1669265dd260fdf583a117c2f17cf?apiKey=6dceda0d543f454b955d90f7c576a010&"
//             alt=""
//             className={styles["profile-edit-icon"]}
//             onClick={handleCancel}
//           />
//         </div>
//         <div className={styles["edit-title"]}>Edit Staff Information</div>
//       </div>

//       <form className={styles["editable-section"]}>
//         <EditableDetailsSection
//           title="Personal Information"
//           inputs={[
//             { id: "firstName", label: "First Name" },
//             { id: "lastName", label: "Last Name" },
//             { id: "address", label: "Address" },
//             { id: "email", label: "Email" },
//             { id: "phone", label: "Phone Number" },
//             { id: "payRate", label: "Hourly Wage" },
//           ]}
//           staffData={staffData}
//           handleInputChange={handleInputChange}
//         />

//         {/* <section className={styles["training-section"]}> */}
//         <LevelTraining
//           id="lowsTraining"
//           title="Lows Training"
//           options={trainingLows}
//           staffData={staffData}
//           handleLevelChange={handleLevelChange}
//         />
//         <LevelTraining
//           id="highsTraining"
//           title="Highs Training"
//           options={trainingHighs}
//           staffData={staffData}
//           handleLevelChange={handleLevelChange}
//         />
//         <LevelTraining
//           id="rescueTraining"
//           title="Rescue Training"
//           options={rescueTraining}
//           staffData={staffData}
//           handleLevelChange={handleLevelChange}
//         />
//         <LevelTraining
//           id="towerTraining"
//           title="Tower Training"
//           options={towerTraining}
//           staffData={staffData}
//           handleLevelChange={handleLevelChange}
//         />
//         <LevelTraining
//           id="typeOfStaff"
//           title="Type of Staff"
//           options={typeOfStaff}
//           staffData={staffData}
//           handleLevelChange={handleLevelChange}
//         />

//         <LevelTraining
//           id="proFacilitator"
//           title="Pro Facilitator Level"
//           options={proFacilitator}
//           staffData={staffData}
//           handleLevelChange={handleLevelChange}
//         />
//         {/* </section> */}

//         <div className={styles["action-buttons"]}>
//           <button
//             type="button"
//             className={styles["cancel-button"]}
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             className={styles["confirm-button"]}
//             onClick={handleSave}
//           >
//             Confirm
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditStaffModal;

import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { updateStaffDetails } from "../services/database.mjs";
import { useRouter } from "next/router";

const trainingOptions = {
  trainingLows: ["No", "TA", "Level 1", "Level 2", "Lead"],
  trainingHighs: ["No", "TA", "Level 1", "Level 2", "Lead"],
  towerTraining: ["No", "TA", "Lead"],
  rescueTraining: ["No", "Yes"],
  proFacilitator: ["No", "TA", "Level 1", "Lead"],
  typeOfStaff: ["Student", "Staff", "Alumni", "Community"],
};

const EditStaffModal = ({ staff, visible, onHide, onSave }) => {
  const [staffData, setStaffData] = useState({ ...staff });
  const router = useRouter();
  const staffID = router.query.employeeId;

  useEffect(() => {
    setStaffData({ ...staff });
  }, [staff]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStaffData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateStaffDetails(staffID, staffData);
      onSave(staffData);
      onHide();
    } catch (error) {
      console.error("Error updating staff details:", error);
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          onClick={handleSave}
          autoFocus
        />
      </div>
    );
  };

  return (
    <Dialog
      header="Edit Staff Information"
      visible={visible}
      style={{ width: "50vw" }}
      footer={renderFooter()}
      onHide={onHide}
    >
      <div className="p-fluid">
        <div className="p-field mb-3">
          <label htmlFor="firstName">First Name</label>
          <InputText
            id="firstName"
            name="firstName"
            value={staffData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="lastName">Last Name</label>
          <InputText
            id="lastName"
            name="lastName"
            value={staffData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="address">Address</label>
          <InputText
            id="address"
            name="address"
            value={staffData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            name="email"
            value={staffData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="phone">Phone Number</label>
          <InputMask
            id="phone"
            name="phone"
            value={staffData.phone}
            onChange={handleInputChange}
            mask="(999) 999-9999"
          />
        </div>
        <div className="p-field mb-3">
          <label htmlFor="payRate">Hourly Wage</label>
          <InputNumber
            id="payRate"
            name="payRate"
            value={staffData.payRate}
            onValueChange={(e) =>
              setStaffData((prev) => ({ ...prev, payRate: e.value }))
            }
            mode="currency"
            currency="USD"
          />
        </div>

        {Object.entries(trainingOptions).map(([key, options]) => (
          <div key={key} className="p-field mb-3">
            <label htmlFor={key}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <Dropdown
              id={key}
              name={key}
              value={staffData[key]}
              options={options}
              onChange={handleInputChange}
              placeholder={`Select ${key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}`}
            />
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default EditStaffModal;
