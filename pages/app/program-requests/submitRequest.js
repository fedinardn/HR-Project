// import styles from "../../../styles/programRequestForm.module.css";
// import { getAuth } from "firebase/auth";

// export default function SubmitProgramRequestPage() {
//   const programLengths = ["1-3 hours", "3-6 hours", "Full day"];
//   const programTypes = ["Conference", "Club Event", "Lecture"];

//   const onProgramRequestSubmitted = async (event) => {
//     event.preventDefault();
//     const auth = getAuth(); // Get the Auth instance (assuming you need user authentication)

//     const user = auth.currentUser;

//     const contactPerson = event.target.contactPersonInput.value;
//     const companyName = event.target.companyNameInput.value;
//     const programTypes = event.target.programTypesInput.value;
//     const desiredDate = event.target.desiredDateInput.value;
//     const desiredLength = event.target.desiredLengthInput.value;
//     const email = event.target.emailInput.value;
//     const phone = event.target.phoneInput.value;
//     const role = event.target.roleInput.value;
//     const website = event.target.websiteInput.value;
//     const size = event.target.sizeInput.value;
//     const additionalDetails = event.target.additionalDetailsInput.value;

//     const response = await fetch("/api/program-requests/program-request", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contactPerson: contactPerson,
//         companyName: companyName,
//         userid: user.uid,
//         programTypes: programTypes,
//         desiredDate: desiredDate,
//         desiredLength: desiredLength,
//         email: email,
//         phone: phone,
//         role: role,
//         website: website,
//         size: size,
//         additionalDetails: additionalDetails,
//       }),
//     });
//     if (response.ok) {
//       console.log("request submitted");
//     }
//     event.target.reset();
//   };

//   return (
//     <>
//       <div className={styles.container}>
//         <main className={styles["form-container"]}>
//           <h1 className={styles.title}>Request a program</h1>
//           <form onSubmit={(event) => onProgramRequestSubmitted(event)}>
//             <label htmlFor="contactPerson" className={styles.formlabel}>
//               Contact person
//             </label>
//             <input
//               type="text"
//               id="contactPerson"
//               name="contactPersonInput"
//               className={styles["form-input"]}
//               placeholder="Enter contact person name"
//               aria-label="Enter contact person name"
//               required
//             />
//             <label htmlFor="email" className={styles["form-label"]}>
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="emailInput"
//               className={styles["form-input"]}
//               placeholder="Enter your email"
//               aria-label="Enter your email"
//               required
//             />
//             <label htmlFor="phone" className={styles["form-label"]}>
//               Phone Number
//             </label>
//             <input
//               type="text"
//               id="phone"
//               name="phoneInput"
//               className={styles["form-input"]}
//               placeholder="Enter your phone number"
//               aria-label="Enter your phone number"
//               required
//             />

//             <label htmlFor="role" className={styles["form-label"]}>
//               Role
//             </label>
//             <input
//               type="text"
//               id="role"
//               name="roleInput"
//               className={styles["form-input"]}
//               placeholder="Enter your role"
//               aria-label="Enter your role"
//             />

//             <label htmlFor="companyName" className={styles["form-label"]}>
//               Company name
//             </label>
//             <input
//               type="text"
//               id="companyName"
//               name="companyNameInput"
//               className={styles["form-input"]}
//               placeholder="Enter company name"
//               aria-label="Enter company name"
//               required
//             />

//             <label htmlFor="website" className={styles["form-label"]}>
//               Website(If applicaple)
//             </label>
//             <input
//               type="url"
//               id="website"
//               name="websiteInput"
//               className={styles["form-input"]}
//               placeholder="Enter your company website"
//               aria-label="Enter your company website"
//             />
//             <label htmlFor="size" className={styles["form-label"]}>
//               Group Size
//             </label>
//             <input
//               type="number"
//               id="size"
//               name="sizeInput"
//               className={styles["form-input"]}
//               placeholder="Enter your group size"
//               aria-label="Enter your group size"
//               required
//             />

//             <label htmlFor="programType" className={styles["form-label"]}>
//               Program type
//             </label>
//             <div className={styles["select-wrapper"]}>
//               <select
//                 id="programTypes"
//                 name="programTypesInput"
//                 className={styles["select-input"]}
//                 aria-label="Select a program type"
//                 required
//               >
//                 <option value="">Select a program type</option>
//                 {programTypes.map((type, index) => (
//                   <option key={index} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//               <img
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/360139a58546f1a44c344016c3909c2a17ee16b8faf1c265cbd33b688552dab8?apiKey=6dceda0d543f454b955d90f7c576a010&"
//                 alt=""
//                 className={styles["select-arrow"]}
//               />
//             </div>
//             <label htmlFor="desiredDate" className={styles["form-label"]}>
//               Desired date
//             </label>
//             <input
//               type="date"
//               id="desiredDate"
//               name="desiredDateInput"
//               className={styles["form-input"]}
//               placeholder="Enter your desired date"
//               aria-label="Enter your desired date"
//               required
//             />
//             <label htmlFor="programLength" className={styles["form-label"]}>
//               Desired program length
//             </label>
//             <div className={styles["select-wrapper"]}>
//               <select
//                 id="programLength"
//                 name="desiredLengthInput"
//                 className={styles["select-input"]}
//                 aria-label="Select a length"
//                 required
//               >
//                 <option value="">Select a length</option>
//                 {programLengths.map((length, index) => (
//                   <option key={index} value={length}>
//                     {length}
//                   </option>
//                 ))}
//               </select>
//               <img
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/1448298fe2ea85cfff1176242a243ec0ab6e9126f0ace451c066f9edbf4c9336?apiKey=6dceda0d543f454b955d90f7c576a010&"
//                 alt=""
//                 className={styles["select-arrow"]}
//               />
//             </div>

//             <label htmlFor="additionalDetails" className={styles["form-label"]}>
//               Additional Details
//             </label>
//             <textarea
//               type="text"
//               id="additionalDetails"
//               name="additionalDetailsInput"
//               className={styles["form-input-big"]}
//               placeholder="Any additional details you would like us to know?"
//               aria-label="Any additional details you would like us to know?"
//             />

//             <div className={styles["button-group"]}>
//               <button type="button" className={styles["cancel-button"]}>
//                 Cancel
//               </button>
//               <button type="submit" className={styles["submit-button"]}>
//                 Submit
//               </button>
//             </div>
//           </form>
//         </main>
//       </div>
//     </>
//   );
// }

import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { createProgramRequest } from "../../../services/database.mjs";
import { getAuth } from "firebase/auth";
import { InputMask } from "primereact/inputmask";

const SubmitProgramRequestPage = () => {
  const [formData, setFormData] = useState({
    contactPerson: "",
    companyName: "",
    programTypes: [],
    desiredDates: null,
    desiredLength: "",
    email: "",
    phone: "",
    role: "",
    website: "",
    size: null,
    additionalDetails: "",
    groupType: [],
    programLocation: "",
    returningClient: null,
    underageParticipants: null,
    goals: "",
    otherInfo: "",
  });
  const toast = useRef(null);

  const programLengths = [
    { label: "2 Hours (Scavenger Hunt or Workshop only)", value: "2 Hours" },
    {
      label:
        "3 Hours (not enough time for combination low and high element programs)",
      value: "3 Hours",
    },
    { label: "4 Hours", value: "4 Hours" },
    { label: "5 Hours", value: "5 Hours" },
    { label: "8 Hours", value: "8 Hours" },
    { label: "Overnight (Camping at the ropes course)", value: "Overnight" },
    { label: "Undecided/Other", value: "Undecided/Other" },
  ];

  const programTypes = [
    { label: "Low Element Program", value: "Low Element Program" },
    { label: "High Element Program", value: "High Element Program" },
    {
      label: "Low and High Element Program",
      value: "Low and High Element Program",
    },
    { label: "Team Bonding", value: "Team Bonding" },
    { label: "Leadership Program", value: "Leadership Program" },
    { label: "Virtual Program", value: "Virtual Program" },
    { label: "I'm not sure!", value: "Unsure" },
  ];

  const groupTypes = [
    { label: "Cornell Student", value: "Cornell Student" },
    { label: "Cornell Grad Student", value: "Cornell Grad Student" },
    { label: "Cornell Staff", value: "Cornell Staff" },
    { label: "Student", value: "Student" },
    {
      label: "Other College or University",
      value: "Other College or University",
    },
    { label: "Corporate", value: "Corporate" },
    { label: "Professional group", value: "Professional group" },
    { label: "Non-Profit", value: "Non-Profit" },
    { label: "Youth (High School age or younger)", value: "Youth" },
    { label: "Community", value: "Community" },
    { label: "Other", value: "Other" },
  ];

  const locationOptions = [
    {
      label: "Hoffman Challenge Course (Outdoor ropes course in Freeville NY)",
      value: "Hoffman Challenge Course",
    },
    { label: "Cornell Campus", value: "Cornell Campus" },
    {
      label:
        "You select a location (for scavenger hunts and portable programs)",
      value: "Custom Location",
    },
    { label: "Virtual Program (Zoom preferred)", value: "Virtual Program" },
    {
      label: "Other location (not at Cornell University)",
      value: "Other location",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onProgramRequestSubmitted = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const programRequestDetails = {
        ...formData,
        userid: user.uid,
        dateSubmitted: Date.now(),
        approved: false,
      };

      const response = await createProgramRequest(programRequestDetails);
      console.log(response);

      if (response) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Program request submitted successfully",
          life: 3000,
        });
        setFormData({
          contactPerson: "",
          companyName: "",
          programTypes: [],
          desiredDates: null,
          desiredLength: "",
          email: "",
          phone: "",
          role: "",
          website: "",
          size: null,
          additionalDetails: "",
          groupType: [],
          programLocation: "",
          returningClient: null,
          underageParticipants: null,
          goals: "",
          otherInfo: "",
        });
      } else {
        throw new Error("Failed to submit program request");
      }
    } catch (error) {
      console.error("Error submitting program request:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to submit program request",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Toast ref={toast} />
      <Card title="Request a Program">
        <form onSubmit={onProgramRequestSubmitted} className="p-fluid">
          <div className="p-field mb-3">
            <label htmlFor="contactPerson">Contact Person *</label>
            <InputText
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="email">Email *</label>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="phone">Phone Number *</label>
            <InputMask
              id="phone"
              name="phone"
              mask="(999) 999-9999"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="role">Role</label>
            <InputText
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="companyName">Group Name/Organization *</label>
            <InputText
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="website">Website (If applicable)</label>
            <InputText
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="size">Number of Participants </label>
            <InputNumber
              id="size"
              name="size"
              value={formData.size}
              onValueChange={(e) =>
                setFormData((prev) => ({ ...prev, size: e.value }))
              }
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="programTypes">Type of Program *</label>
            <MultiSelect
              id="programTypes"
              name="programTypes"
              value={formData.programTypes}
              options={programTypes}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="desiredDates">Desired Date for Program </label>
            <Calendar
              id="desiredDates"
              name="desiredDates"
              value={formData.desiredDates}
              onChange={handleInputChange}
              selectionMode="multiple"
              readOnlyInput
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="desiredLength">Length of Program *</label>
            <Dropdown
              id="desiredLength"
              name="desiredLength"
              value={formData.desiredLength}
              options={programLengths}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="groupType">Type of Group *</label>
            <MultiSelect
              id="groupType"
              name="groupType"
              value={formData.groupType}
              options={groupTypes}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="programLocation">
              Where will your program take place? *
            </label>
            <Dropdown
              id="programLocation"
              name="programLocation"
              value={formData.programLocation}
              options={locationOptions}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="returningClient">
              Are you a Returning Client? *
            </label>
            <Dropdown
              id="returningClient"
              name="returningClient"
              value={formData.returningClient}
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="underageParticipants">
              Are any participants under the age of 18? *
            </label>
            <Dropdown
              id="underageParticipants"
              name="underageParticipants"
              value={formData.underageParticipants}
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="goals">Goals for the Program</label>
            <InputTextarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="additionalDetails">Additional Details</label>
            <InputTextarea
              id="additionalDetails"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="p-field mb-3">
            <label htmlFor="otherInfo">Other Information</label>
            <InputTextarea
              id="otherInfo"
              name="otherInfo"
              value={formData.otherInfo}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <Button type="submit" label="Submit" className="mt-3" />
        </form>
      </Card>
    </div>
  );
};

export default SubmitProgramRequestPage;
