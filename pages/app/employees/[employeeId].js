import { useEffect, useState } from "react";
import styles from "../../../styles/viewStaff.module.css";
import { useRouter } from "next/router";
import EditStaffModal from "../../../components/EditStaffModal";
import { updateStaffDetails } from "../../../services/database.mjs";

export default function getStaffData({ user }) {
  const router = useRouter();
  const staffID = router.query.employeeId;
  const [staffData, setStaffData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchStaffData = async () => {
    if (staffID) {
      const response = await fetch(`/api/employees/${staffID}`, {
        method: "GET",
      });
      const data = await response.json();
      setStaffData(data);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [router.query.employeeId, user]);

  const handleEditClick = () => {
    setShowModal(true);
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
      <h2 className={styles["staff-section-title"]}>Staff</h2>
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
              <div className={styles["value"]}>
                {info.professionalFacilitatorLevel}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );

  const AssignedProgram = ({ program }) => (
    <li className={styles["program"]}>
      <div className={styles["program-details"]}>
        <div className={styles["program-name"]}>{program.name}</div>
        <div className={styles["program-id"]}>{program.id}</div>
      </div>
    </li>
  );

  const AssignedProgramsList = ({ programs }) => (
    <section className={styles["assigned-programs"]}>
      <h2 className={styles["programs-title"]}>Assigned Programs</h2>
      <ul className={styles["programs-list"]}>
        {programs.map((program, index) => (
          <AssignedProgram key={index} program={program} />
        ))}
      </ul>
    </section>
  );

  const programs = [
    { name: "Jennet Gray", id: "1234 - Program A" },
    { name: "Jennet Gray", id: "5678 - Program B" },
    { name: "Jennet Gray", id: "9012 - Program C" },
  ];

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
      <AssignedProgramsList programs={programs} />
      {/* <div className="view-profile">
            <button className="view-profile-button">View Staff Profile</button>
        </div> */}
    </>
  );
}
