import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import withProtectedRoute from "../../../components/WithProtectedRoute";
import EditStaffModal from "../../../components/EditStaffModal";
import AssignedStaffPrograms from "../../../components/AssignedStaffPrograms";
import {
  updateStaffDetails,
  getStaffDetails,
} from "../../../services/database.mjs";

const ViewStaff = ({ user }) => {
  const router = useRouter();
  const staffID = router.query.employeeId;
  const [staffData, setStaffData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const toast = useRef(null);

  const fetchStaffData = async () => {
    if (staffID) {
      const data = await getStaffDetails(staffID);
      setStaffData(data);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [staffID]);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleSave = async (editedStaff) => {
    try {
      await updateStaffDetails(editedStaff.staffID, editedStaff);
      setStaffData(editedStaff);
      setShowModal(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Staff details updated successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error updating staff details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update staff details",
        life: 3000,
      });
    }
  };

  const StaffHeader = ({ staff }) => (
    <div className="flex align-items-center justify-content-between mb-4">
      <Link href="/app/employees/viewEmployees">
        <Button
          label="Back to all staff"
          icon="pi pi-arrow-left"
          className="p-button-text"
        />
      </Link>
      <div className="flex align-items-center">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          onClick={handleEditClick}
          tooltip="Edit Staff"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="col-12 md:col-6 mb-3">
      <label className="font-bold">{label}</label>
      <div className="mt-2">{value || "N/A"}</div>
    </div>
  );

  const StaffInfo = ({ info }) => (
    <Card title="Staff Information" className="mb-4">
      <div className="grid">
        <InfoItem label="Name" value={`${info.firstName} ${info.lastName} `} />
        <InfoItem label="Address" value={info.address} />
        <InfoItem label="Email" value={info.email} />
        <InfoItem label="Phone" value={info.phone} />
        <InfoItem label="Hourly Wage" value={`$${info.payRate}`} />
        <InfoItem label="Lows Training" value={info.lowsTraining} />
        <InfoItem label="Highs Training" value={info.highsTraining} />
        <InfoItem label="Rescue Training" value={info.rescueTraining} />
        <InfoItem label="Tower Training" value={info.towerTraining} />
        <InfoItem label="Type of Staff" value={info.typeOfStaff} />
        <InfoItem label="Pro Facilitator Level" value={info.proFacilitator} />
      </div>
      <Divider />
      <div className="field col-12">
        <label className="font-bold">Notes</label>
        <div className="mt-2 whitespace-pre-line">
          {info.notes || "No notes available."}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Toast ref={toast} />
      <StaffHeader staff={staffData} />
      <StaffInfo info={staffData} />
      <AssignedStaffPrograms staffData={staffData} />

      <EditStaffModal
        staff={staffData}
        visible={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default withProtectedRoute(ViewStaff);
