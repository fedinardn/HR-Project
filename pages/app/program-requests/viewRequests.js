import Link from "next/link";
import styles from "../../../styles/viewRequests.module.css";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getAllProgramRequests,
  getAllProgramRequestsForClient,
  getUserPermission,
} from "../../../services/database.mjs";

export default function ViewRequests({ user }) {
  const [programRequests, setProgramRequests] = useState([]);

  const fetchProgramRequests = async () => {
    if (user) {
      const userData = await getUserPermission(user.email);
      if (userData == "client") {
        const data = await getAllProgramRequestsForClient(user.uid).then();
        setProgramRequests(data);
      } else {
        const data = await getAllProgramRequests(user.uid).then();
        setProgramRequests(data);
      }
    } else {
      console.log("No User");
    }
  };

  useEffect(() => {
    fetchProgramRequests();
  }, [user]);

  return (
    <>
      <div className={styles["task-list"]}>
        <h1 className={styles.title}>
          Program Requests({programRequests.length})
        </h1>
        <header className={styles["task-header"]}>
          <div className={styles["header-name"]}>Name</div>
          <div className={styles["header-status"]}>Status</div>
          <div className={styles["header-staff"]}>Contact Person</div>
          <div className={styles["header-staff"]}>Action</div>
        </header>
        <main>
          {programRequests ? (
            programRequests.map((request, index) => (
              <div className={styles["task-item"]} key={index}>
                <div className={styles["task-name"]}>
                  {request.programTypes}
                </div>
                <div className={styles["task-status"]}>
                  <div className={styles["status-text"]}>
                    {request.approved ? "Approved" : "Pending"}
                  </div>
                </div>
                <div className={styles["task-staff"]}>
                  {request.contactPerson}
                </div>
                <div className={styles["task-action"]}>
                  <Link href={`/app/program-requests/${request.id}`}>View</Link>
                </div>
              </div>
            ))
          ) : (
            <p>No Requests Yet!</p>
          )}
        </main>
      </div>
    </>
  );
}
