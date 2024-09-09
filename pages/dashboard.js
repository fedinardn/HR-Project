import styles from "../styles/Dashboard.module.css";
import {
  getAllProgramRequests,
  getAllStaff,
  getAllClients,
} from "../services/database.mjs";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";

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

  const SideMenuItem = ({ icon, label, href }) => {
    const handleClick = () => {
      window.location.href = href;
    };
    return (
      <Button
        onClick={handleClick}
        className={`${styles["side-menu-item"]} p-button-text `}
        icon={`pi ${icon}`}
        label={label}
        style={{
          color: "inherit",
          width: "80%",
          textAlign: "left",
          padding: "0.5rem 1rem",
        }}
      />
    );
  };

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
              icon="pi-users"
              label="Clients"
              href="/app/clients/viewClients"
            />
            <SideMenuItem
              icon="pi-user"
              label="Staff"
              href="/app/employees/viewEmployees"
            />
            <SideMenuItem
              icon="pi-calendar"
              label="Schedule"
              href="/app/schedule/scheduleDisplay"
            />
            <SideMenuItem icon="pi-chart-bar" label="Reports" href="#" />
            <SideMenuItem
              icon="pi-dollar"
              label="Charge Items"
              href="/app/charge-items/chargeItems"
            />
            <SideMenuItem
              icon="pi-cog"
              label="Users"
              href="/app/users/viewUsers"
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
