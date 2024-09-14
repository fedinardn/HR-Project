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
import {
  createProgramRequest,
  createProgramRequestNotification,
} from "../../../services/database.mjs";
import { getAuth } from "firebase/auth";
import { InputMask } from "primereact/inputmask";
import { uuidv7 } from "uuidv7";

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
    {
      label: "Challenge Course-Low Element Program",
      value: "Challenge Course-Low Element Program",
    },
    {
      label: "Challenge Course-High Element Program",
      value: "Challenge Course-High Element Program",
    },
    {
      label: "Challenge Course-Low and High Element Program",
      value: "Challenge Course-Low and High Element Program",
    },
    { label: "Portable team building", value: "Portable team building" },
    { label: "Scavenger Hunt", value: "Scavenger Hunt" },
    { label: "Virtual teambuilding", value: "Virtual teambuilding" },
    {
      label: "Leadership Assessment (MBTI, DiSC, etc.)",
      value: "Leadership Assessment (MBTI, DiSC, etc.)",
    },
    { label: "Canoe Program", value: "Canoe Program" },
    { label: "Rappel Program", value: "Rappel Program" },
    { label: "Climbing Program", value: "Climbing Program" },
    { label: "Dragon Boat Program", value: "Dragon Boat Program" },
    { label: "Other Program", value: "Other Program" },
  ];

  const groupTypes = [
    { label: "Cornell Student", value: "Cornell Student" },
    { label: "Cornell Grad Student", value: "Cornell Grad Student" },
    { label: "Cornell Staff", value: "Cornell Staff" },
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
      label: "You select a location (portable programs)",
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
        id: uuidv7(),
        userid: user.uid,
        dateSubmitted: Date.now(),
        approved: false,
      };

      const response = await createProgramRequest(programRequestDetails);

      if (response) {
        const notification = await createProgramRequestNotification(
          programRequestDetails
        );
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
            <label htmlFor="size">Number of Participants * </label>
            <small id="size-help">
              (if you don't know the exact number, please write a range, ex.
              10-14)
            </small>
            <InputText
              id="size"
              name="size"
              value={formData.size}
              onValueChange={(e) =>
                setFormData((prev) => ({ ...prev, size: e.value }))
              }
              aria-describedby="size-help"
              required
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
            <small id="date-help">
              (If you are unsure, you can select multiple dates)
            </small>
            <Calendar
              id="desiredDates"
              name="desiredDates"
              value={formData.desiredDates}
              onChange={handleInputChange}
              selectionMode="multiple"
              readOnlyInput
              aria-describedby="size-help"
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

          <Button type="submit" label="Submit" className="mt-3" />
        </form>
      </Card>
    </div>
  );
};

export default SubmitProgramRequestPage;
