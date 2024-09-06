import styles from "../../../styles/viewRequest.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  deleteProgramRequest,
  getUserPermission,
  getDataForProgramRequest,
} from "../../../services/database.mjs";

export default function programRequestData({ user }) {
  const router = useRouter();
  const programRequestId = router.query.programRequestId;
  const [programRequestData, setProgramRequestData] = useState([]);
  const [userPermission, setUserPermission] = useState(null);

  const fetchRequestData = async () => {
    if (programRequestId) {
      // const response = await fetch(`/api/program-requests/${programRequestId}`, {
      //   method: "GET"
      // });
      const data = await getDataForProgramRequest(programRequestId);
      setProgramRequestData(data);
      if (user) {
        const permission = await getUserPermission(user.email);
        setUserPermission(permission);
      } else {
        console.log("no user");
      }
    }
  };

  useEffect(() => {
    fetchRequestData();
  }, [router.query.programRequestId, user]);

  const onRequestDeleted = async (programRequestId) => {
    await deleteProgramRequest(programRequestId);

    window.location.href = "/app/program-requests/viewRequests";
  };

  const onRequestApproved = async (programRequestId) => {
    const response = await fetch(`/api/program-requests/${programRequestId}`, {
      method: "POST",
      body: JSON.stringify({ programRequestId: programRequestId }),
    });
    if (response.ok) {
      await fetchRequestData();
    }
  };
  const StatusBadge = ({ icon, text, color }) => (
    <div className={`${styles["status-badge"]} ${styles[color]}`}>
      <img src={icon} alt="" className={styles["status-icon"]} />
      <span className={styles["status-text"]}>{text}</span>
    </div>
  );

  const Status = (programRequestData) => {
    if (programRequestData.approved) {
      return (
        <div className={styles["status-container"]}>
          <StatusBadge
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/edd81594f697aa10f2ca27d577a563282f1da21caa499064d2baef100cabbfac?apiKey=6dceda0d543f454b955d90f7c576a010&"
            text="Approved"
            color="green"
          />
        </div>
      );
    } else {
      return (
        <div className={styles["status-container"]}>
          <StatusBadge
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/edd81594f697aa10f2ca27d577a563282f1da21caa499064d2baef100cabbfac?apiKey=6dceda0d543f454b955d90f7c576a010&"
            text="In Progress"
            color="orange"
          />
        </div>
      );
    }
  };

  const CompanyDetails = (programRequestData) => (
    <section className={styles["company-details"]}>
      <div className={styles["contact-info"]}>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Contact Person</div>
          <div className={styles["info-value"]}>
            {programRequestData.contactPerson}
          </div>
        </div>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Role</div>
          <div className={styles["info-value"]}>{programRequestData.role}</div>
        </div>
      </div>
      <div className={styles["contact-info"]}>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Email</div>
          <div className={styles["info-value"]}>{programRequestData.email}</div>
        </div>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Phone</div>
          <div className={styles["info-value"]}>{programRequestData.phone}</div>
        </div>
      </div>
    </section>
  );

  const CompanyOverview = (programRequestData) => (
    <section className={styles["company-overview"]}>
      <div className={styles["overview-info"]}>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Company Name</div>
          <div className={styles["info-value"]}>
            {programRequestData.companyName}
          </div>
        </div>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Website</div>
          <div className={styles["info-value"]}>
            {programRequestData.website}
          </div>
        </div>
      </div>
      <div className={styles["info-item"]}>
        <div className={styles["info-label"]}>Size</div>
        <div className={styles["info-value"]}>{programRequestData.size}</div>
      </div>
    </section>
  );

  const ProgramDetails = (programRequestData) => (
    <section className="program-details">
      <div className="details-info">
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Program Type</div>
          <div className={styles["info-value"]}>
            {programRequestData.programTypes}
          </div>
        </div>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Desired Date</div>
          <div className={styles["info-value"]}>
            {programRequestData.desiredDate}
          </div>
        </div>
      </div>
      <div className={styles["overview-info"]}>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Desired Length</div>
          <div className={styles["info-value"]}>
            {programRequestData.desiredLength}
          </div>
        </div>
        <div className={styles["info-item"]}>
          <div className={styles["info-label"]}>Date Submitted</div>
          <div className={styles["info-value"]}>
            {new Date(programRequestData.dateSubmitted).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )}
          </div>
        </div>
      </div>

      <div className={styles["info-item"]}>
        <div className={styles["info-label"]}>Additional Details</div>
        <div className={styles["info-value"]}>
          {programRequestData.additionalDetails}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <main className={styles["program-request"]}>
        <header className={styles["request-header"]}>
          <h1 className={styles["request-number"]}>
            Program Request #{String(programRequestId).slice(0, 8) + "..."}
          </h1>
          <Status {...programRequestData} />
          <h2 className={styles["section-title"]}>Company Details</h2>
        </header>
        <CompanyDetails {...programRequestData} />
        <CompanyOverview {...programRequestData} />
        <h2 className={styles["section-title"]}>Program Details</h2>
        <ProgramDetails {...programRequestData} />
        {userPermission == "Admin" && (
          <>
            <button
              className={styles["approve-button"]}
              onClick={() => onRequestApproved(programRequestId)}
            >
              <span className={styles["button-text"]}>
                Approve Program Request
              </span>
            </button>

            <button
              className={styles["delete-button"]}
              onClick={() => onRequestDeleted(programRequestId)}
            >
              <span className={styles["delete-button-text"]}>
                Delete Program Request
              </span>
            </button>
          </>
        )}
      </main>
    </>
  );
}
