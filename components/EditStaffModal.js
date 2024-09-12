import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
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

        <div className="p-field">
          <label htmlFor="notes">Notes</label>
          <InputTextarea
            id="notes"
            name="notes"
            rows={5}
            value={staffData.notes || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default EditStaffModal;
