// components/AssignedProgramsList.js
import React, { useState } from "react";
// import styles from "../styles/viewStaff.module.css";
import styles from "../styles/AssignedStaff.module.css";

export default function AssignedProgramsList({
  initialPrograms,
  onAddProgram,
}) {
  const [programs, setPrograms] = useState(initialPrograms);

  const handleAddProgram = () => {
    const newProgram = { name: "New Program", id: "12345" }; // Replace with actual data
    setPrograms([newProgram, ...programs]);
    if (onAddProgram) onAddProgram(newProgram);
  };

  const AssignedProgram = ({ program }) => (
    <div className={styles["task-item"]}>
      <div className={styles["program-name"]}>{program.name}</div>
      <div className={styles["program-id"]}>{program.id}</div>
      <div>
        <img
          className={styles["task-action"]}
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b3a5b8d3198f1c1498d25eaa52205402ba3fe76627b7ad00b3b541d597c1721?apiKey=6dceda0d543f454b955d90f7c576a010&"
        />
        <img
          className={styles["task-action"]}
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9da955eed0cc11a3c9cc0fab57e88377b4a9af89e0c175f075256b61a9850075?apiKey=6dceda0d543f454b955d90f7c576a010&"
        />
        <img
          className={styles["task-action"]}
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ae169bde185211a959c72406d9f02722e33a0a416b4885faa965f3cb4c9806af?apiKey=6dceda0d543f454b955d90f7c576a010&"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className={styles["task-list"]}>
        <div className={styles["header"]}>
          <h1 className={styles.title}>Assigned Programs({0})</h1>
          <button
            className={styles["add-program-button"]}
            onClick={handleAddProgram}
          >
            <span className={styles["add-program-icon"]}>+</span>
            <span className={styles["add-program-text"]}>Assign Program</span>
          </button>
        </div>
        <form onChange={(event) => event} className={styles["search-form"]}>
          <input
            className={styles["search-input"]}
            type="text"
            id="searchStaffContracts"
            placeholder="Search contracts"
            aria-label="Search contracts"
            // value={value}
            // onChange={handleSearch}
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef95366c70a6c027dfc7a1c0bb808953401267a94186d90914dcc35153889a45?apiKey=6dceda0d543f454b955d90f7c576a010&"
            alt=""
            className={styles["search-icon"]}
            tabindex="0"
            role="button"
          />
        </form>
        <header className={styles["task-header"]}>
          <div className={styles["header-name"]}>Program Name</div>
          <div className={styles["header-status"]}>Date</div>
          <div className={styles["header-staff"]}>Action</div>
        </header>

        <div className={styles["scrollable-container"]}>
          <div className={styles["programs-list"]}>
            {programs.map((program, index) => (
              <AssignedProgram key={index} program={program} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
