// import * as React from "react";
// import styles from "../../../styles/viewClients.module.css";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { getAllClients } from "../../../services/database.mjs";

// export default function ViewStaff({ user }) {
//   function ClientCard({ name, type, contact, programs }) {
//     return (
//       <div className={styles["client-card"]}>
//         <div className={styles["client-name"]}>{name}</div>
//         <div className={styles["client-type"]}>{type}</div>
//         <div className={styles["client-contact"]}>{contact}</div>
//         <div className={styles["client-programs"]}>{programs}</div>
//       </div>
//     );
//   }

//   const [searchQuery, setSearchQuery] = useState("");
//   const [clients, setClients] = useState([]);

//   const fetchClients = async () => {
//     const data = await getAllClients().then();
//     setClients(data);
//     // console.log("all Clients");
//   };

//   useEffect(() => {
//     fetchClients();
//   }, [user]);

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filterClients = (clients, searchQuery) => {
//     if (!searchQuery.trim()) {
//       return clients;
//     }

//     return clients.filter((member) => {
//       const query = searchQuery.toLowerCase();

//       const orgNameWords = member.organizationName.toLowerCase().split(" ");
//       const contactPersonWords = member.contactPerson.toLowerCase().split(" ");

//       const matchesOrgName = orgNameWords.some((word) =>
//         word.startsWith(query)
//       );
//       const matchesContactPerson = contactPersonWords.some((word) =>
//         word.startsWith(query)
//       );

//       return matchesOrgName || matchesContactPerson;
//     });
//   };

//   const filteredClients = filterClients(clients, searchQuery);

//   return (
//     <>
//       <section className={styles["main-container"]}>
//         <header className={styles["header"]}>
//           <h1 className={styles["title"]}>Clients</h1>
//           <Link
//             className={styles["new-client"]}
//             href={"/app/clients/addNewClient"}
//           >
//             <h4 className={styles["new-client-text"]}>Add New Client</h4>
//           </Link>
//         </header>
//         <form
//           onChange={(event) => handleSearch(event)}
//           className={styles["search-form"]}
//         >
//           <input
//             className={styles["search-input"]}
//             type="text"
//             id="searchClients"
//             placeholder="Search clients"
//             aria-label="Search clients"
//           />
//           <img
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef95366c70a6c027dfc7a1c0bb808953401267a94186d90914dcc35153889a45?apiKey=6dceda0d543f454b955d90f7c576a010&"
//             alt=""
//             className={styles["search-icon"]}
//             role="button"
//           />
//         </form>

//         <section className={styles["client-list"]}>
//           <div className={styles["client-list-header"]}>
//             <div className={styles["client-list-header-item"]}>Client</div>
//             <div className={styles["client-list-header-item"]}>Type</div>
//             <div className={styles["client-list-header-item"]}>Contact</div>
//             <div className={styles["client-list-header-item"]}>Programs</div>
//           </div>

//           {filteredClients.map((client, index) => (
//             <a key={index} href={`/app/clients/${client.clientID}`}>
//               <ClientCard
//                 key={index}
//                 name={client.organizationName}
//                 type={client.clientType}
//                 contact={client.contactPerson}
//                 programs={client.programs.length}
//               />
//             </a>
//           ))}
//         </section>
//       </section>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../../styles/viewClients.module.css";
import { getAllClients } from "../../../services/database.mjs";
import { IconField } from "primereact/iconfield";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export default function ViewStaff({ user }) {
  const [clients, setClients] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const router = useRouter();

  const fetchClients = async () => {
    const data = await getAllClients();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />

        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search Clients"
          />
        </IconField>
      </div>
    );
  };

  const clearFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();

  const onRowClick = (event) => {
    router.push(`/app/clients/${event.data.clientID}`);
  };

  return (
    <section className={styles["main-container"]}>
      <header className={styles["header"]}>
        <h1 className={styles["title"]}>Clients</h1>
        <Link className={styles["new-client"]} href="/app/clients/addNewClient">
          <h4 className={styles["new-client-text"]}>Add New Client</h4>
        </Link>
      </header>

      <DataTable
        value={clients}
        paginator
        rows={10}
        dataKey="clientID"
        filters={filters}
        filterDisplay="menu"
        x
        globalFilterFields={["organizationName", "clientType", "contactPerson"]}
        header={header}
        emptyMessage="No clients found."
        onRowClick={onRowClick}
        selectionMode="single"
      >
        <Column
          field="organizationName"
          header="Client"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="clientType"
          header="Type"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="contactPerson"
          header="Contact"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="programs"
          header="Programs"
          sortable
          body={(rowData) => rowData.programs.length}
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
    </section>
  );
}
