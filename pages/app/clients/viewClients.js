import * as React from "react";
import styles from "../../../styles/viewClients.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllClients } from "../../../services/database.mjs";

export default function ViewStaff({ user }) {
  const clientsData = [
    { name: "Acme Inc.", type: "Tech", contact: "John Doe", programs: "12" },
    {
      name: "Globex Corp.",
      type: "Retail",
      contact: "Jane Smith",
      programs: "15",
    },
    { name: "Initech", type: "Finance", contact: "Sam Johnson", programs: "9" },
    {
      name: "Umbrella Corp.",
      type: "BioTech",
      contact: "Dr. Alice Wong",
      programs: "18",
    },
    {
      name: "Gringotts Bank",
      type: "Finance",
      contact: "Rubeus Hagrid",
      programs: "6",
    },
    { name: "LexCorp", type: "Media", contact: "Lois Lane", programs: "22" },
    {
      name: "Stark Industries",
      type: "Tech",
      contact: "Pepper Potts",
      programs: "13",
    },
    {
      name: "Wayne Enterprises",
      type: "Diversified",
      contact: "Lucius Fox",
      programs: "17",
    },
  ];

  function ClientCard({ name, type, contact, programs }) {
    return (
      <div className={styles["client-card"]}>
        <div className={styles["client-name"]}>{name}</div>
        <div className={styles["client-type"]}>{type}</div>
        <div className={styles["client-contact"]}>{contact}</div>
        <div className={styles["client-programs"]}>{programs}</div>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    const data = await getAllClients().then();
    setClients(data);
    // console.log("all Clients");
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterClients = (clients, searchQuery) => {
    if (!searchQuery.trim()) {
      return clients;
    }

    return clients.filter(
      (member) =>
        member.firstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  };

  const filteredStaff = filterClients(clients, searchQuery);

  return (
    <>
      <section className={styles["main-container"]}>
        <header className={styles["header"]}>
          <h1 className={styles["title"]}>Clients</h1>
          <Link
            className={styles["new-client"]}
            href={"/app/clients/addNewClient"}
          >
            <h4 className={styles["new-client-text"]}>Add New Client</h4>
          </Link>
        </header>
        <form
          onChange={(event) => handleSearch(event)}
          className={styles["search-form"]}
        >
          <input
            className={styles["search-input"]}
            type="text"
            id="searchClients"
            placeholder="Search clients"
            aria-label="Search clients"
            // value={value}
            // onChange={handleSearch}
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef95366c70a6c027dfc7a1c0bb808953401267a94186d90914dcc35153889a45?apiKey=6dceda0d543f454b955d90f7c576a010&"
            alt=""
            className={styles["search-icon"]}
            // tabindex="0"
            role="button"
          />
        </form>

        <section className={styles["client-list"]}>
          <div className={styles["client-list-header"]}>
            <div className={styles["client-list-header-item"]}>Client</div>
            <div className={styles["client-list-header-item"]}>Type</div>
            <div className={styles["client-list-header-item"]}>Contact</div>
            <div className={styles["client-list-header-item"]}>Programs</div>
          </div>
          {clientsData.map((client, index) => (
            <ClientCard
              key={index}
              name={client.name}
              type={client.type}
              contact={client.contact}
              programs={client.programs}
            />
          ))}
        </section>
        {/* <section className={styles["client-list"]}>
          <table className={styles["client-table"]}>
            <thead>
              <tr className={styles["client-list-header"]}>
                <th className={styles["client-list-header-item"]}>Client</th>
                <th className={styles["client-list-header-item"]}>Type</th>
                <th className={styles["client-list-header-item"]}>Contact</th>
                <th className={styles["client-list-header-item"]}>Programs</th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((client, index) => (
                <tr key={index} className={styles["client-row"]}>
                  <td className={styles["client-list-item"]}>{client.name}</td>
                  <td className={styles["client-list-item"]}>{client.type}</td>
                  <td className={styles["client-list-item"]}>
                    {client.contact}
                  </td>
                  <td className={styles["client-list-item"]}>
                    {client.programs.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section> */}
      </section>
    </>
  );
}
