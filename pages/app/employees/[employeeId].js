import { useEffect, useState } from "react";
import styles from "../../../styles/viewStaff.module.css";
import { useRouter } from "next/router";
import EditStaffModal from "../../../components/EditStaffModal";
import {
  updateStaffDetails,
  getStaffDetails,
} from "../../../services/database.mjs";
import Link from "next/link";
import AssignedStaffPrograms from "../../../components/AssignedStaffPrograms";
// import firebaseApp from "../../../firebase";

export default function getStaffData({ user }) {
  const router = useRouter();
  const staffID = router.query.employeeId;
  const [staffData, setStaffData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchStaffData = async () => {
    if (staffID) {
      const data = await getStaffDetails(staffID).then();
      setStaffData(data);
      // console.log(data);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [router.query.employeeId]);

  const handleEditClick = () => {
    setShowModal(true);
    console.log(staffData);
  };

  const handleSave = async (editedStaff) => {
    try {
      await updateStaffDetails(editedStaff.staffID, editedStaff);
      setStaffData(editedStaff);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating staff details:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const StaffSection = ({ staff }) => (
    <section className={styles["staff-section"]}>
      <Link
        className={styles["staff-section-title"]}
        href={"/app/employees/viewEmployees"}
      >
        Back to all staff
      </Link>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/63a740c47816da57a476db663d7572ba724c1ef93e2fd84ee2eaec6ea6782891?apiKey=6dceda0d543f454b955d90f7c576a010&"
        className={styles["staff-photo"]}
        alt="Staff photo"
        onClick={handleEditClick}
      />
    </section>
  );

  const StaffInfo = ({ info }) => (
    <>
      <section className={styles["staff-info"]}>
        <h2 className={styles["info-title"]}>Staff Information</h2>
        <div className={styles["info-section"]}>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Name</div>
              <div className={styles["value"]}>
                {info.firstName} {info.lastName}
              </div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Address</div>
              <div className={styles["value"]}>{info.address}</div>
            </div>
          </section>

          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Email</div>
              <div className={styles["value"]}>{info.email}</div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Phone</div>
              <div className={styles["value"]}>{info.phone}</div>
            </div>
          </section>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Hourly Wage</div>
              <div className={styles["value"]}>{info.payRate}</div>
            </div>
          </section>
        </div>
        <div className={styles["info-section"]}>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Lows Training</div>
              <div className={styles["value"]}>{info.lowsTraining}</div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Highs Training</div>
              <div className={styles["value"]}>{info.highsTraining}</div>
            </div>
          </section>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Rescue Training</div>
              <div className={styles["value"]}>{info.rescueTraining}</div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Tower Training</div>
              <div className={styles["value"]}>{info.towerTraining}</div>
            </div>
          </section>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Type of staff</div>
              <div className={styles["value"]}>{info.typeOfStaff}</div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Pro Facilitator Level</div>
              <div className={styles["value"]}>{info.proFacilitator}</div>
            </div>
          </section>
        </div>
      </section>
    </>
  );

  return (
    <>
      <StaffSection staff={staffData} />
      {showModal && (
        <EditStaffModal
          staff={staffData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <StaffInfo info={staffData} />
      <AssignedStaffPrograms staffData={staffData} />
    </>
  );
}
