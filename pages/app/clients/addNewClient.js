// import * as React from "react";
// import styles from "../../../styles/AddNewEmployee.module.css";
// import { getAuth } from "firebase/auth";

// const clientType = [
//   "STU",
//   "STU Sports",
//   "STU Non CU",
//   "COMMYOUTH",
//   "CUP",
//   "PDP",
// ];

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

// const onCreateClientSubmitted = async (event) => {
//   event.preventDefault();
//   const auth = getAuth(); // Get the Auth instance (assuming you need user authentication)

//   const user = auth.currentUser;

//   const organizationName = event.target.organizationName.value;
//   const clientType = event.target.clientType.value;
//   const contactPerson = event.target.contactPerson.value;
//   const address = event.target.address.value;
//   const phone = event.target.phoneNumber.value;
//   const mobile = event.target.mobileNumber.value;
//   const email = event.target.email.value;

//   const response = await fetch("/api/clients/client", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       organizationName: organizationName,
//       clientType: clientType,
//       contactPerson: contactPerson,
//       address: address,
//       phone: phone,
//       mobile: mobile,
//       email: email,
//     }),
//   });
//   if (response.ok) {
//     console.log("new client created");
//   }
//   event.target.reset();
// };

// function MyComponent() {
//   return (
//     <>
//       <section className={styles["form-container"]}>
//         <h1 className={styles["header"]}>Add a new client</h1>
//         <form onSubmit={(event) => onCreateClientSubmitted(event)}>
//           <InputField
//             label="Organization Name"
//             placeholder="e.g. Samuel Curtis Johnson"
//             id="organizationName"
//             type="text"
//             name="organizationName"
//           />
//           <SelectBox
//             label="Client Type"
//             id="clientType"
//             name="clientType"
//             options={clientType}
//             ariaLabel="Select Client Type"
//           />
//           <InputField
//             label="Contact Person"
//             placeholder="e.g. John Smith"
//             id="contactPerson"
//             type="text"
//             name="contactPerson"
//           />
//           <InputField
//             label="Address"
//             placeholder="e.g. 123 Main St, Apt 2, San Francisco, CA 94105"
//             id="address"
//             type="text"
//             name="address"
//           />

//           <InputField
//             label="Phone"
//             placeholder="999-999-9999"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//           />

//           <InputField
//             label="Mobile"
//             placeholder="999-999-9999"
//             id="mobileNumber"
//             type="tel"
//             name="mobileNumber"
//           />
//           <InputField
//             label="Email"
//             placeholder="johnsmith@gmail.com"
//             id="email"
//             type="email"
//             name="email"
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
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";

import Link from "next/link";

const clientTypes = [
  "STU",
  "STU Sports",
  "STU Non CU",
  "COMMYOUTH",
  "CUP",
  "PDP",
];

const AddNewClient = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    clientType: "",
    contactPerson: "",
    address: "",
    phone: "",
    mobile: "",
    email: "",
  });
  const toast = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onCreateClientSubmitted = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/clients/client", {
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
          detail: "New client created",
          life: 3000,
        });
        setFormData({
          organizationName: "",
          clientType: "",
          contactPerson: "",
          address: "",
          phone: "",
          mobile: "",
          email: "",
        });
      } else {
        throw new Error("Failed to create client");
      }
    } catch (error) {
      console.error("Error creating new client:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create new client",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-between mb-4">
        <Link href="/app/clients/viewClients">
          <Button
            label="Back to all clients"
            icon="pi pi-arrow-left"
            className="p-button-text"
          />
        </Link>
      </div>
      <Card title="Add a new client" className="mx-auto">
        <form onSubmit={onCreateClientSubmitted} className="p-fluid">
          <div className="p-field mb-3">
            <label htmlFor="organizationName" className="font-bold">
              Organization Name
            </label>
            <InputText
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              placeholder="e.g. Samuel Curtis Johnson"
              required
            />
          </div>

          <div className="p-field mb-3">
            <label htmlFor="clientType" className="font-bold">
              Client Type
            </label>
            <Dropdown
              id="clientType"
              name="clientType"
              value={formData.clientType}
              options={clientTypes}
              onChange={handleInputChange}
              placeholder="Select Client Type"
            />
          </div>

          <div className="p-field mb-3">
            <label htmlFor="contactPerson" className="font-bold">
              Contact Person
            </label>
            <InputText
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              placeholder="e.g. John Smith"
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
              placeholder="e.g. 123 Main St, Apt 2, San Francisco, CA 94105"
            />
          </div>

          <div className="p-field mb-3">
            <label htmlFor="phone" className="font-bold">
              Phone
            </label>
            <InputMask
              id="phone"
              name="phone"
              mask="(999) 999-9999"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(999) 999-9999"
            />
          </div>

          <div className="p-field mb-3">
            <label htmlFor="mobile" className="font-bold">
              Mobile
            </label>
            <InputMask
              id="mobile"
              name="mobile"
              mask="(999) 999-9999"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="(999) 999-9999"
            />
          </div>

          <div className="p-field mb-3">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johnsmith@gmail.com"
              type="email"
              required
            />
          </div>

          <Button type="submit" label="Submit" className="mt-3" />
        </form>
      </Card>
    </div>
  );
};

export default AddNewClient;
