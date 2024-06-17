import styles from "../styles/EditStaffModal.module.css";
import React, { useState, useEffect } from "react";
import { updateClientDetails } from "../services/database.mjs";
import { useRouter } from "next/router";

const clientType = [
  "STU",
  "STU Sports",
  "STU Non CU",
  "COMMYOUTH",
  "CUP",
  "PDP",
];
const DetailsInputColumn = ({ label, id, value, onChange }) => (
  <div className={styles["details-input-column"]}>
    <label htmlFor={id} className={styles["visually-hidden"]}>
      {label}
    </label>
    <input
      className={styles["details-input"]}
      id={id}
      name={id}
      type="text"
      placeholder={label}
      value={value}
      onChange={onChange}
    />
  </div>
);

const EditableDetailsSection = ({ inputs, clientData, handleInputChange }) => {
  return (
    <section className={styles["editable-details-section"]}>
      {inputs.map((input) => (
        <DetailsInputColumn
          key={input.id}
          id={input.id}
          label={input.label}
          value={clientData[input.id] || ""}
          onChange={handleInputChange}
        />
      ))}
    </section>
  );
};

const LevelTraining = ({
  id,
  title,
  options,
  clientData,
  handleLevelChange,
}) => {
  return (
    <div className={styles["level-training"]}>
      <p className={styles["level-training-title"]}>{title}</p>
      {/* className={styles["level-training-container"]} */}
      <div className={styles["select-wrapper"]}>
        <select
          id={id}
          className={styles["select-input"]}
          value={clientData[id] || ""}
          onChange={(e) => handleLevelChange(e, id)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ab4728370a058d975ad105b2a1cfa86d4b1eb5f36de052e8ac72a6316729bacf?apiKey=6dceda0d543f454b955d90f7c576a010&"
          alt={title}
          className={styles["select-arrow"]}
        />
      </div>
    </div>
  );
};

const EditClientModal = ({ client, onSave, onCancel }) => {
  const [clientData, setClientData] = useState({ ...client });
  const router = useRouter();
  const clientID = router.query.clientId;

  useEffect(() => {
    setClientData({ ...client });
  }, [client]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setClientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLevelChange = (e, key) => {
    setClientData((prevState) => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateClientDetails(clientID, clientData);
      onSave(clientData);
    } catch (error) {
      console.error("Error updating client details:", error);
    }
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <div className={styles["profile-img-container"]}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee5d1d7e1bf27db1317898ef58f822aa3e7fa3ba64b38134e0690ba431d5a008?apiKey=6dceda0d543f454b955d90f7c576a010&"
            alt=""
            className={styles["profile-img"]}
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5b0c388f8e47aac81b07a1390828f9906d1669265dd260fdf583a117c2f17cf?apiKey=6dceda0d543f454b955d90f7c576a010&"
            alt=""
            className={styles["profile-edit-icon"]}
            onClick={handleCancel}
          />
        </div>
        <div className={styles["edit-title"]}>Edit Client Information</div>
      </div>

      <form className={styles["editable-section"]}>
        <EditableDetailsSection
          title="Personal Information"
          inputs={[
            { id: "organizationName", label: "Organization Name" },
            { id: "contactPerson", label: "Contact Person" },
            { id: "address", label: "Address" },
            { id: "contactPersonEmail", label: "Email" },
            { id: "phone", label: "Phone Number" },
            { id: "mobile", label: "Mobile Number" },
          ]}
          clientData={clientData}
          handleInputChange={handleInputChange}
        />

        <LevelTraining
          id="clientType"
          title="Type of Client"
          options={clientType}
          clientData={clientData}
          handleLevelChange={handleLevelChange}
        />

        <div className={styles["action-buttons"]}>
          <button
            type="button"
            className={styles["cancel-button"]}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles["confirm-button"]}
            onClick={handleSave}
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClientModal;
