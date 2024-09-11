import React from "react";
import { Card } from "primereact/card";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  function AddressBlock() {
    return (
      <div className={styles["address-block"]}>
        <i className="pi pi-map-marker" style={{ fontSize: "1.5rem" }}></i>
        <p className={styles["address-text"]}>
          B01 Bartels Hall, 554 Campus Road • Ithaca, NY 14853
        </p>
      </div>
    );
  }

  function PhoneBlock({ icon, number }) {
    return (
      <div className={styles["phone-block"]}>
        <i className={`pi ${icon}`} style={{ fontSize: "1.5rem" }}></i>
        <p className={styles["phone-number"]}>{number}</p>
      </div>
    );
  }

  return (
    <Card className={styles["container"]}>
      <div className={styles["cta-section"]}>
        <div className={styles["cta-content"]}>
          <div className={styles["line"]} />
          <div className={styles["info-section"]}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8683de68b243e6a31a9bfe9f0f2cc308fafc2e22cc7b13f45667dfa4bb74c407?apiKey=6dceda0d543f454b955d90f7c576a010&"
              alt="Logo"
              className={styles["logo"]}
            />
            <div className={styles["info-content"]}>
              <AddressBlock />
              <div className={styles["phone-section"]}>
                <PhoneBlock icon="pi-phone blue" number="607-254-4897" />
                <PhoneBlock icon="pi-phone" number="607-255-9881" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
