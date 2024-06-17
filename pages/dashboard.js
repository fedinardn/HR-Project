import styles from "../styles/Dashboard.module.css";
import {
  getAllProgramRequests,
  getAllStaff,
  getAllClients,
} from "../services/database.mjs";
import { useState, useEffect } from "react";
export default function MyComponent({ user }) {
  const [numberOfProgramRequest, setNumberOfProgramRequest] = useState(0);
  const [numberOfStaff, setNumberOfStaff] = useState(0);
  const [numberOfClients, setNumberOfClients] = useState(0);

  const fetchPageDetails = async () => {
    if (user) {
      const pageStaffData = await getAllStaff();
      const pageRequestData = await getAllProgramRequests(user.uid).then();
      const pageClientData = await getAllClients();
      setNumberOfProgramRequest(pageRequestData.length);
      setNumberOfStaff(pageStaffData.length);
      setNumberOfClients(pageClientData.length);
    }
  };

  useEffect(() => {
    fetchPageDetails();
  }, [user]);

  const data = [
    { title: "Total Employees", value: numberOfStaff },
    { title: "Total Clients", value: numberOfClients },
  ];

  const RequestData = [
    { title: "Program Requests", value: numberOfProgramRequest },
  ];

  const SideMenuItem = ({ src, alt, label, href }) => (
    <a href={href} className={styles["side-menu-item"]}>
      <img loading="lazy" src={src} alt={alt} className={styles["menu-icon"]} />
      <span className={styles["menu-label"]}>{label}</span>
    </a>
  );

  function Card({ title, value }) {
    return (
      <section className={styles["card"]}>
        <h3 className={styles["card-title"]}>{title}</h3>
        <p className={styles["card-value"]}>{value}</p>
      </section>
    );
  }

  const handleProgramRequestClick = () => {
    window.location.href = "/app/program-requests/viewRequests";
  };

  const addNewEmployee = () => {
    window.location.href = "/app/employees/addNewEmployee";
  };

  const addNewClient = () => {
    window.location.href = "/app/clients/addNewClient";
  };

  function RequestCard({ title, value }) {
    return (
      <section className={styles["card"]}>
        <h3 className={styles["card-title"]}>{title}</h3>
        <p className={styles["card-value"]}>{value}</p>
        <button
          className={styles["secondary-action"]}
          onClick={handleProgramRequestClick}
        >
          View Program Requests
        </button>
      </section>
    );
  }

  function ActionCard({ actionTitle, description, action }) {
    return (
      <section className={styles["action-card"]}>
        <div className={styles["action-info"]}>
          <h4 className={styles["action-title"]}>{actionTitle}</h4>
          <p className={styles["action-description"]}>{description}</p>
        </div>
        <button className={styles["action-button"]} onClick={action}>
          Add
        </button>
      </section>
    );
  }

  return (
    <>
      <div className={styles["container"]}>
        <aside className={styles["sidebar"]}>
          <section className={styles["side-menu"]}>
            <h2 className={styles["visually-hidden"]}>Sidebar</h2>
            <SideMenuItem
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d50d5d0b5a6d91c8c2df85849bb272eab7bc37bac38e3845d0295edc7d405a6?apiKey=6dceda0d543f454b955d90f7c576a010&"
              alt="clients Icon"
              label="Clients"
              href={"/app/clients/viewClients"}
            />
            <SideMenuItem
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d86f9b59e1d70f0e67588e10a86793bf9abe078a10496e35676dcedcb8ca735?apiKey=6dceda0d543f454b955d90f7c576a010&"
              alt="Staff Icon"
              label="Staff"
              href={"/app/employees/viewEmployees"}
            />
            <SideMenuItem
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a34677ddc2a19fdeb87616abc5f681e3b112f49a96db78b3dd6d6eb6b126d71?apiKey=6dceda0d543f454b955d90f7c576a010&"
              alt="Administration Icon"
              label="Administration"
            />
            <SideMenuItem
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e36345e6dbb2a893bf8f0639a566fa778d453362db0c18c237db37d1f3cfdef?apiKey=6dceda0d543f454b955d90f7c576a010&"
              alt="Reports Icon"
              label="Reports"
            />
            <SideMenuItem
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8234ee97158ece626fe6881c9bfb223354c575b5839bc5c3edd1a052f7b7a007?apiKey=6dceda0d543f454b955d90f7c576a010&"
              alt="Settings Icon"
              label="Settings"
              href={"/app/charge-items/chargeItems"}
            />
          </section>
        </aside>

        <main className={styles["dashboard"]}>
          <h1 className={styles["dashboard-title"]}>Dashboard</h1>
          <section className={styles["dashboard-summary"]}>
            {data.map((item, index) => (
              <Card key={index} title={item.title} value={item.value} />
            ))}
          </section>
          <section className={styles["financial-summary"]}>
            {RequestData.map((item, index) => (
              <RequestCard key={index} title={item.title} value={item.value} />
            ))}
          </section>
          <section className={styles["actions"]}>
            <h2 className={styles["actions-title"]}>Quick Actions</h2>
            <ActionCard
              actionTitle="Add new staff"
              description="You can add staff one by one."
              action={addNewEmployee}
            />
            <ActionCard
              actionTitle="Add a new client"
              description="You can add clients here."
              action={addNewClient}
            />
          </section>
        </main>
      </div>
    </>
  );
}

// export default MyComponent;
