import { useEffect, useState } from "react";
import styles from "../../../styles/viewAllStaff.module.css";
import { getAllStaff } from "../../../services/database.mjs";
import Link from "next/link";

function StaffCard({ firstName, lastName, actionImgSrc, email }) {
  return (
    <section className={styles["staff-card"]}>
      <div className={styles["staff-info"]}>
        <div className={styles["staff-details"]}>
          <div className={styles["staff-name"]}>
            {firstName} {lastName}
          </div>
          <div className={styles["staff-role"]}>{email}</div>
        </div>
      </div>
      <img src={actionImgSrc} alt="" className="action-img" />
    </section>
  );
}

export default function ViewStaff({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [staff, setStaff] = useState([]);

  const fetchStaff = async () => {
    const data = await getAllStaff().then();
    setStaff(data);
  };

  useEffect(() => {
    fetchStaff();
  }, [user]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterStaff = (staff, searchQuery) => {
    if (!searchQuery.trim()) {
      return staff;
    }

    return staff.filter(
      (member) =>
        member.firstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  };

  const filteredStaff = filterStaff(staff, searchQuery);

  return (
    <>
      <section className={styles["main-container"]}>
        <header className={styles["header"]}>
          <h1 className={styles["title"]}>Staff</h1>
          <Link
            className={styles["new-staff"]}
            href={"/app/employees/addNewEmployee"}
          >
            <h4 className={styles["new-staff-text"]}>Add New Staff</h4>
          </Link>
        </header>
        <section className={styles["content"]}>
          <h2 className={styles["content-title"]}>All staff</h2>
          <form
            onChange={(event) => handleSearch(event)}
            className={styles["search-form"]}
          >
            <input
              className={styles["search-input"]}
              type="text"
              id="searchStaff"
              placeholder="Search staff"
              aria-label="Search staff"
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
          {filteredStaff.length > 0
            ? filteredStaff.map((staffMember, index) => (
                <a key={index} href={`/app/employees/${staffMember.staffID}`}>
                  <StaffCard
                    key={index}
                    firstName={staffMember.firstName}
                    lastName={staffMember.lastName}
                    email={staffMember.email}
                    actionImgSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/60a6cea30403c6413700e7e7bd78dfdff5f044a135a9cb4ae1e1027f5aa242de?apiKey=6dceda0d543f454b955d90f7c576a010&"
                  />
                </a>
              ))
            : "Oops...No staff with this name"}
        </section>
      </section>
    </>
  );
}
