import { useEffect, useState } from "react";
import styles from "../../../styles/viewClient.module.css";
import { useRouter } from "next/router";
import EditClientModal from "../../../components/EditClientModal";
import {
  updateClientDetails,
  getClientDetails,
} from "../../../services/database.mjs";
import Link from "next/link";
import AssignedProgramsList from "../../../components/AssignedProgamsList";
import firebaseApp from "../../../firebase";

export default function getClientData({ user }) {
  const router = useRouter();
  const clientID = router.query.clientId;
  const [clientData, setClientData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //   const [showContract, setShowContract] = useState(false);
  const [programs, setAssignedPrograms] = useState([
    { name: "Jennet Gray", id: "1234 - Program A" },
    { name: "Jennet Gray", id: "5678 - Program B" },
    { name: "Jennet Gray", id: "9012 - Program C" },
    { name: "Jennet Gray", id: "1234 - Program D" },
    { name: "Jennet Gray", id: "5678 - Program E" },
    { name: "Jennet Gray", id: "9012 - Program F" },
    { name: "Jennet Gray", id: "1234 - Program G" },
    { name: "Jennet Gray", id: "5678 - Program H" },
    { name: "Jennet Gray", id: "9012 - Program I" },
    { name: "Jennet Gray", id: "1234 - Program J" },
  ]);

  const fetchClientData = async () => {
    if (clientID) {
      const data = await getClientDetails(clientID).then();
      setClientData(data);
      console.log(data);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [router.query.clientId]);

  const handleEditClick = () => {
    setShowModal(true);
  };

  //   s

  const handleSave = async (editedClient) => {
    try {
      await updateClientDetails(editedClient.clientID, editedClient);
      setClientData(editedClient);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating client details:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const ClientSection = ({ client }) => (
    <section className={styles["staff-section"]}>
      <Link
        className={styles["staff-section-title"]}
        href={"/app/clients/viewClients"}
      >
        Back to all clients
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

  const ClientInfo = ({ info }) => (
    <>
      <section className={styles["staff-info"]}>
        <h2 className={styles["info-title"]}>Client Information</h2>
        <div className={styles["info-section"]}>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Organization Name</div>
              <div className={styles["value"]}>{info.organizationName}</div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Contact Person</div>
              <div className={styles["value"]}>{info.contactPerson}</div>
            </div>
          </section>

          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Email</div>
              <div className={styles["value"]}>{info.contactPersonEmail}</div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Address</div>
              <div className={styles["value"]}>{info.address}</div>
            </div>
          </section>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Phone</div>
              <div className={styles["value"]}>{info.phone}</div>
            </div>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Mobile</div>
              <div className={styles["value"]}>{info.mobile}</div>
            </div>
          </section>
        </div>
        <div className={styles["info-section"]}>
          <section className={styles["sub-grid"]}>
            <div className={styles["info-item"]}>
              <div className={styles["label"]}>Type of Client</div>
              <div className={styles["value"]}>{info.clientType}</div>
            </div>
          </section>
        </div>
      </section>
    </>
  );

  return (
    <>
      <ClientSection client={clientData} />

      {showModal && (
        <EditClientModal
          client={clientData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <ClientInfo info={clientData} />

      <AssignedProgramsList
        // initialPrograms={staffData.programs || []}  this is the correct one replace when functionality is correct
        initialPrograms={programs}
        onAddProgram={(newProgram) => console.log("Program added:", newProgram)}
        clientData={clientData}
      />

      {/* <CreateClientContract /> */}
    </>
  );
}
