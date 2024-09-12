import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { updateClientDetails } from "../services/database.mjs";
import { useRouter } from "next/router";

const clientTypes = [
  "STU",
  "STU Sports",
  "STU Non CU",
  "COMMYOUTH",
  "CUP",
  "PDP",
];

const EditClientModal = ({ client, visible, onHide, onSave }) => {
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

  const handleSave = async () => {
    try {
      await updateClientDetails(clientID, clientData);
      onSave(clientData);
      onHide();
    } catch (error) {
      console.error("Error updating client details:", error);
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
      header="Edit Client Information"
      visible={visible}
      style={{ width: "50vw" }}
      footer={renderFooter()}
      onHide={onHide}
    >
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="organizationName">Organization Name</label>
          <InputText
            id="organizationName"
            name="organizationName"
            value={clientData.organizationName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field">
          <label htmlFor="contactPerson">Contact Person</label>
          <InputText
            id="contactPerson"
            name="contactPerson"
            value={clientData.contactPerson || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field">
          <label htmlFor="address">Address</label>
          <InputText
            id="address"
            name="address"
            value={clientData.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field">
          <label htmlFor="contactPersonEmail">Email</label>
          <InputText
            id="contactPersonEmail"
            name="contactPersonEmail"
            value={clientData.contactPersonEmail || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field">
          <label htmlFor="phone">Phone Number</label>
          <InputMask
            id="phone"
            name="phone"
            mask="(999) 999-9999"
            value={clientData.phone || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field">
          <label htmlFor="mobile">Mobile Number</label>
          <InputMask
            id="mobile"
            name="mobile"
            mask="(999) 999-9999"
            value={clientData.mobile || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="p-field">
          <label htmlFor="clientType">Type of Client</label>
          <Dropdown
            id="clientType"
            name="clientType"
            value={clientData.clientType}
            options={clientTypes}
            onChange={handleInputChange}
            placeholder="Select a client type"
          />
        </div>
        <div className="p-field">
          <label htmlFor="notes">Notes</label>
          <InputTextarea
            id="notes"
            name="notes"
            rows={5}
            value={clientData.notes || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default EditClientModal;
