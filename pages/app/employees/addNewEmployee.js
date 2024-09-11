import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import Link from "next/link";
import withProtectedRoute from "../../../components/WithProtectedRoute";

const trainingLows = ["No", "TA", "Level 1", "Level 2", "Lead"];
const trainingHighs = ["No", "TA", "Level 1", "Level 2", "Lead"];
const towerTraining = ["No", "TA", "Lead"];
const rescueTraining = ["No", "Yes"];
const proFacilitator = ["No", "TA", "Level 1", "Lead"];
const typeOfStaff = ["Student", "Staff", "Alumni", "Community"];

const AddNewStaff = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    payRate: null,
    phone: "",
    email: "",
    lowsTraining: "",
    highsTraining: "",
    towerTraining: "",
    rescueTraining: "",
    proFacilitator: "",
    typeOfStaff: "",
  });
  const toast = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onCreateEmployeeSubmitted = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/employees/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "New staff member created",
          life: 3000,
        });
        setFormData({
          firstName: "",
          lastName: "",
          address: "",
          payRate: null,
          phone: "",
          email: "",
          lowsTraining: "",
          highsTraining: "",
          towerTraining: "",
          rescueTraining: "",
          proFacilitator: "",
          typeOfStaff: "",
        });
      } else {
        throw new Error("Failed to create staff member");
      }
    } catch (error) {
      console.error("Error creating new staff member:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create new staff member",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-between mb-4">
        <Link href="/app/employees/viewEmployees">
          <Button
            label="Back to all staff"
            icon="pi pi-arrow-left"
            className="p-button-text"
          />
        </Link>
      </div>
      <Card title="Add a new staff member" className="mb-4">
        <form onSubmit={onCreateEmployeeSubmitted} className="p-fluid">
          <div className="p-field mb-3">
            <label htmlFor="firstName" className="font-bold">
              First Name *
            </label>
            <InputText
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="lastName" className="font-bold">
              Last Name *
            </label>
            <InputText
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="address" className="font-bold">
              Address
            </label>
            <InputText
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="payRate" className="font-bold">
              Pay Rate *
            </label>
            <InputNumber
              id="payRate"
              name="payRate"
              value={formData.payRate}
              onValueChange={(e) =>
                setFormData((prev) => ({ ...prev, payRate: e.value }))
              }
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="phone" className="font-bold">
              Phone *
            </label>
            <InputMask
              id="phone"
              name="phone"
              mask="(999) 999-9999"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(999) 999-9999"
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="email" className="font-bold">
              Email *
            </label>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="lowsTraining" className="font-bold">
              Lows Training
            </label>
            <Dropdown
              id="lowsTraining"
              name="lowsTraining"
              value={formData.lowsTraining}
              options={trainingLows}
              onChange={handleInputChange}
              placeholder="Select Lows Training Level"
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="highsTraining" className="font-bold">
              Highs Training
            </label>
            <Dropdown
              id="highsTraining"
              name="highsTraining"
              value={formData.highsTraining}
              options={trainingHighs}
              onChange={handleInputChange}
              placeholder="Select Highs Training Level"
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="towerTraining" className="font-bold">
              Tower Training
            </label>
            <Dropdown
              id="towerTraining"
              name="towerTraining"
              value={formData.towerTraining}
              options={towerTraining}
              onChange={handleInputChange}
              placeholder="Select Tower Training Level"
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="rescueTraining" className="font-bold">
              Rescue Training
            </label>
            <Dropdown
              id="rescueTraining"
              name="rescueTraining"
              value={formData.rescueTraining}
              options={rescueTraining}
              onChange={handleInputChange}
              placeholder="Select Rescue Training Level"
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="proFacilitator" className="font-bold">
              Professional Facilitator Level
            </label>
            <Dropdown
              id="proFacilitator"
              name="proFacilitator"
              value={formData.proFacilitator}
              options={proFacilitator}
              onChange={handleInputChange}
              placeholder="Select Professional Facilitator Level"
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="typeOfStaff" className="font-bold">
              Type of Staff
            </label>
            <Dropdown
              id="typeOfStaff"
              name="typeOfStaff"
              value={formData.typeOfStaff}
              options={typeOfStaff}
              onChange={handleInputChange}
              placeholder="Select Type of Staff"
            />
          </div>
          <Button type="submit" label="Submit" className="mt-3" />
        </form>
      </Card>
    </div>
  );
};

export default withProtectedRoute(AddNewStaff);
