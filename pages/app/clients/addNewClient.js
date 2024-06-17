import * as React from "react";
import styles from "../../../styles/AddNewEmployee.module.css";
import { getAuth } from "firebase/auth";

const clientType = [
  "STU",
  "STU Sports",
  "STU Non CU",
  "COMMYOUTH",
  "CUP",
  "PDP",
];

const InputField = ({ label, placeholder, id, type, name }) => (
  <>
    <label className={styles["label"]} htmlFor={id}>
      {label}
    </label>
    <input
      className={styles["input"]}
      type={type}
      id={id}
      placeholder={placeholder}
      aria-label={label}
      name={name}
    />
  </>
);

const SelectBox = ({ label, id, name, options, ariaLabel }) => (
  <>
    <div className={styles["select-wrapper"]}>
      <label className={styles["label"]}>{label}</label>
      <select
        id={id}
        name={name}
        className={styles["select-input"]}
        aria-label={ariaLabel}
        required
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1448298fe2ea85cfff1176242a243ec0ab6e9126f0ace451c066f9edbf4c9336?apiKey=6dceda0d543f454b955d90f7c576a010&"
        alt=""
        className={styles["select-arrow"]}
      />
    </div>
  </>
);

const onCreateClientSubmitted = async (event) => {
  event.preventDefault();
  const auth = getAuth(); // Get the Auth instance (assuming you need user authentication)

  const user = auth.currentUser;

  const organizationName = event.target.organizationName.value;
  const clientType = event.target.clientType.value;
  const contactPerson = event.target.contactPerson.value;
  const address = event.target.address.value;
  const phone = event.target.phoneNumber.value;
  const mobile = event.target.mobileNumber.value;
  const email = event.target.email.value;

  const response = await fetch("/api/clients/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organizationName: organizationName,
      clientType: clientType,
      contactPerson: contactPerson,
      address: address,
      phone: phone,
      mobile: mobile,
      email: email,
    }),
  });
  if (response.ok) {
    console.log("new client created");
  }
  event.target.reset();
};

function MyComponent() {
  return (
    <>
      <section className={styles["form-container"]}>
        <h1 className={styles["header"]}>Add a new client</h1>
        <form onSubmit={(event) => onCreateClientSubmitted(event)}>
          <InputField
            label="Organization Name"
            placeholder="e.g. Samuel Curtis Johnson"
            id="organizationName"
            type="text"
            name="organizationName"
          />
          <SelectBox
            label="Client Type"
            id="clientType"
            name="clientType"
            options={clientType}
            ariaLabel="Select Client Type"
          />
          <InputField
            label="Contact Person"
            placeholder="e.g. John Smith"
            id="contactPerson"
            type="text"
            name="contactPerson"
          />
          <InputField
            label="Address"
            placeholder="e.g. 123 Main St, Apt 2, San Francisco, CA 94105"
            id="address"
            type="text"
            name="address"
          />

          <InputField
            label="Phone"
            placeholder="999-999-9999"
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
          />

          <InputField
            label="Mobile"
            placeholder="999-999-9999"
            id="mobileNumber"
            type="tel"
            name="mobileNumber"
          />
          <InputField
            label="Email"
            placeholder="johnsmith@gmail.com"
            id="email"
            type="email"
            name="email"
          />

          <button className={styles["submit-button"]} type="submit">
            Submit
          </button>
        </form>
      </section>
    </>
  );
}

export default MyComponent;
