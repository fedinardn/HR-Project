// import * as React from "react";
// import styles from "../../../styles/AddNewEmployee.module.css";
// import { getAuth } from "firebase/auth";

// const trainingLows = ["No", "TA", "Level 1", "Level 2", "Lead"];
// const trainingHighs = ["No", "TA", "Level 1", "Level 2", "Lead"];
// const towerTraining = ["No", "TA", "Lead"];
// const rescueTraining = ["No", "Yes"];
// const proFacilitator = ["No", "TA", "Level 1", "Lead"];
// const typeOfStaff = ["Student", "Staff", "Alumni", "Community"];

// const InputField = ({ label, placeholder, id, type, name }) => (
//   <>
//     <label className={styles["label"]} htmlFor={id}>
//       {label}
//     </label>
//     <input
//       className={styles["input"]}
//       type={type}
//       id={id}
//       placeholder={placeholder}
//       aria-label={label}
//       name={name}
//     />
//   </>
// );

// const SelectBox = ({ label, id, name, options, ariaLabel }) => (
//   <>
//     <div className={styles["select-wrapper"]}>
//       <label className={styles["label"]}>{label}</label>
//       <select
//         id={id}
//         name={name}
//         className={styles["select-input"]}
//         aria-label={ariaLabel}
//         required
//       >
//         <option value="">Select {label}</option>
//         {options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//       <img
//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/1448298fe2ea85cfff1176242a243ec0ab6e9126f0ace451c066f9edbf4c9336?apiKey=6dceda0d543f454b955d90f7c576a010&"
//         alt=""
//         className={styles["select-arrow"]}
//       />
//     </div>
//   </>
// );

// const onCreateEmployeeSubmitted = async (event) => {
//   event.preventDefault();
//   const auth = getAuth(); // Get the Auth instance (assuming you need user authentication)

//   const user = auth.currentUser;

//   const firstName = event.target.firstName.value;
//   const lastName = event.target.lastName.value;
//   const address = event.target.address.value;
//   const payRate = event.target.payRate.value;
//   const phone = event.target.phoneNumber.value;
//   const email = event.target.email.value;
//   const lowsTraining = event.target.trainingLows.value;
//   const highsTraining = event.target.trainingHighs.value;
//   const towerTraining = event.target.towerTraining.value;
//   const rescueTraining = event.target.rescueTraining.value;
//   const proFacilitator = event.target.proFacilitator.value;
//   const typeOfStaff = event.target.typeOfStaff.value;

//   const response = await fetch("/api/employees/employee", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       firstName: firstName,
//       lastName: lastName,
//       address: address,
//       payRate: payRate,
//       phone: phone,
//       email: email,
//       lowsTraining: lowsTraining,
//       highsTraining: highsTraining,
//       towerTraining: towerTraining,
//       rescueTraining: rescueTraining,
//       proFacilitator: proFacilitator,
//       typeOfStaff: typeOfStaff,
//     }),
//   });
//   if (response.ok) {
//     console.log("new staff created");
//   }
//   event.target.reset();
// };

// function MyComponent() {
//   return (
//     <>
//       <section className={styles["form-container"]}>
//         <h1 className={styles["header"]}>Add a new staff member</h1>
//         <form onSubmit={(event) => onCreateEmployeeSubmitted(event)}>
//           <InputField
//             label="First name"
//             placeholder="e.g. John"
//             id="firstName"
//             type="text"
//             name="firstName"
//           />
//           <InputField
//             label="Last name"
//             placeholder="e.g. Smith"
//             id="lastName"
//             type="text"
//             name="lastName"
//           />
//           <InputField
//             label="Address"
//             placeholder="e.g. 123 Main St, Apt 2, San Francisco, CA 94105"
//             id="address"
//             type="text"
//             name="address"
//           />
//           <InputField
//             label="Pay Rate"
//             placeholder="e.g. $20.00"
//             id="payRate"
//             type="text"
//             name="payRate"
//           />
//           <InputField
//             label="Phone"
//             placeholder="999-999-9999"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//           />
//           <InputField
//             label="Email"
//             placeholder="johnsmith@gmail.com"
//             id="email"
//             type="email"
//             name="email"
//           />

//           <SelectBox
//             label="Lows Training"
//             id="trainingLows"
//             name="trainingLows"
//             options={trainingLows}
//             ariaLabel="Select Lows Training Level"
//           />
//           <SelectBox
//             label="Highs Training"
//             id="trainingHighs"
//             name="trainingHighs"
//             options={trainingHighs}
//             ariaLabel="Select Highs Training Level"
//           />
//           <SelectBox
//             label="Tower Training"
//             id="towerTraining"
//             name="towerTraining"
//             options={towerTraining}
//             ariaLabel="Select Tower Training Level"
//           />
//           <SelectBox
//             label="Rescue Training"
//             id="rescueTraining"
//             name="rescueTraining"
//             options={rescueTraining}
//             ariaLabel="Select Rescue Training Level"
//           />

//           <SelectBox
//             label="Professional Facilitator Level"
//             id="proFacilitator"
//             name="proFacilitator"
//             options={proFacilitator}
//             ariaLabel="Select Professional Facilitator Level"
//           />

//           <SelectBox
//             label="Type of Staff"
//             id="typeOfStaff"
//             name="typeOfStaff"
//             options={typeOfStaff}
//             ariaLabel="Select Type of Staff"
//           />

//           <button className={styles["submit-button"]} type="submit">
//             Submit
//           </button>
//         </form>
//       </section>
//     </>
//   );
// }

// export default MyComponent;

import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import Link from "next/link";

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

export default AddNewStaff;
