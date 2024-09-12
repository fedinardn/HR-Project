import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { createFacilitatorRequestNotification } from "../services/database.mjs";
import { Toast } from "primereact/toast";

const FacilitatorRequestDialog = ({ programDetails }) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    additionalDetails: "",
  });
  const toast = useRef();

  const openDialog = () => setIsDialogVisible(true);
  const closeDialog = () => {
    setIsDialogVisible(false);
    setFormData({
      name: "",
      role: "",
      additionalDetails: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const programName = programDetails.programName;
  const programDate = programDetails.date;

  const handleSubmit = async () => {
    const requestDetails = {
      ...formData,
      programName,
      programDate,
    };
    try {
      await createFacilitatorRequestNotification(requestDetails);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Request sent Successfully",
        life: 3000,
      });
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to send request",
        life: 3000,
      });
    }

    closeDialog();
    setFormData({
      name: "",
      role: "",
      additionalDetails: "",
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div>
        <Button
          label="Request to Facilitate"
          icon="pi pi-plus"
          className="p-button-secondary"
          onClick={openDialog}
        />
      </div>

      {/* Modal Dialog */}
      <Dialog
        header="Facilitation Request"
        visible={isDialogVisible}
        className="p-fluid"
        onHide={closeDialog}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={closeDialog} />
            <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
          </div>
        }
      >
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="role">Role</label>
          <InputText
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="details">Additional Details</label>
          <InputTextarea
            id="additionalDetails"
            name="additionalDetails"
            rows={3}
            value={formData.additionalDetails}
            onChange={handleInputChange}
          />
        </div>
      </Dialog>
    </>
  );
};

export default FacilitatorRequestDialog;
