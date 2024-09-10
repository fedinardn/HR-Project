// import { useEffect, useState } from "react";
// import styles from "../../../styles/viewStaff.module.css";
// import { useRouter } from "next/router";
// import EditStaffModal from "../../../components/EditStaffModal";
// import {
//   updateStaffDetails,
//   getStaffDetails,
// } from "../../../services/database.mjs";
// import Link from "next/link";
// import AssignedStaffPrograms from "../../../components/AssignedStaffPrograms";
// // import firebaseApp from "../../../firebase";

// export default function getStaffData({ user }) {
//   const router = useRouter();
//   const staffID = router.query.employeeId;
//   const [staffData, setStaffData] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const fetchStaffData = async () => {
//     if (staffID) {
//       const data = await getStaffDetails(staffID).then();
//       setStaffData(data);
//       // console.log(data);
//     }
//   };

//   useEffect(() => {
//     fetchStaffData();
//   }, [router.query.employeeId]);

//   const handleEditClick = () => {
//     setShowModal(true);
//     console.log(staffData);
//   };

//   const handleSave = async (editedStaff) => {
//     try {
//       await updateStaffDetails(editedStaff.staffID, editedStaff);
//       setStaffData(editedStaff);
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error updating staff details:", error);
//     }
//   };

//   const handleCancel = () => {
//     setShowModal(false);
//   };

//   const StaffSection = ({ staff }) => (
//     <section className={styles["staff-section"]}>
//       <Link
//         className={styles["staff-section-title"]}
//         href={"/app/employees/viewEmployees"}
//       >
//         Back to all staff
//       </Link>
//       <img
//         loading="lazy"
//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/63a740c47816da57a476db663d7572ba724c1ef93e2fd84ee2eaec6ea6782891?apiKey=6dceda0d543f454b955d90f7c576a010&"
//         className={styles["staff-photo"]}
//         alt="Staff photo"
//         onClick={handleEditClick}
//       />
//     </section>
//   );

//   const StaffInfo = ({ info }) => (
//     <>
//       <section className={styles["staff-info"]}>
//         <h2 className={styles["info-title"]}>Staff Information</h2>
//         <div className={styles["info-section"]}>
//           <section className={styles["sub-grid"]}>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Name</div>
//               <div className={styles["value"]}>
//                 {info.firstName} {info.lastName}
//               </div>
//             </div>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Address</div>
//               <div className={styles["value"]}>{info.address}</div>
//             </div>
//           </section>

//           <section className={styles["sub-grid"]}>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Email</div>
//               <div className={styles["value"]}>{info.email}</div>
//             </div>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Phone</div>
//               <div className={styles["value"]}>{info.phone}</div>
//             </div>
//           </section>
//           <section className={styles["sub-grid"]}>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Hourly Wage</div>
//               <div className={styles["value"]}>{info.payRate}</div>
//             </div>
//           </section>
//         </div>
//         <div className={styles["info-section"]}>
//           <section className={styles["sub-grid"]}>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Lows Training</div>
//               <div className={styles["value"]}>{info.lowsTraining}</div>
//             </div>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Highs Training</div>
//               <div className={styles["value"]}>{info.highsTraining}</div>
//             </div>
//           </section>
//           <section className={styles["sub-grid"]}>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Rescue Training</div>
//               <div className={styles["value"]}>{info.rescueTraining}</div>
//             </div>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Tower Training</div>
//               <div className={styles["value"]}>{info.towerTraining}</div>
//             </div>
//           </section>
//           <section className={styles["sub-grid"]}>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Type of staff</div>
//               <div className={styles["value"]}>{info.typeOfStaff}</div>
//             </div>
//             <div className={styles["info-item"]}>
//               <div className={styles["label"]}>Pro Facilitator Level</div>
//               <div className={styles["value"]}>{info.proFacilitator}</div>
//             </div>
//           </section>
//         </div>
//       </section>
//     </>
//   );

//   return (
//     <>
//       <StaffSection staff={staffData} />
//       {showModal && (
//         <EditStaffModal
//           staff={staffData}
//           onSave={handleSave}
//           onCancel={handleCancel}
//         />
//       )}
//       <StaffInfo info={staffData} />
//       <AssignedStaffPrograms staffData={staffData} />
//     </>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import EditStaffModal from "../../../components/EditStaffModal";
import AssignedStaffPrograms from "../../../components/AssignedStaffPrograms";
import {
  updateStaffDetails,
  getStaffDetails,
} from "../../../services/database.mjs";

export default function ViewStaff({ user }) {
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
}
