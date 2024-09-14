import React from "react";
import { Card } from "primereact/card";
import styles from "../styles/Footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  function AddressBlock() {
    return (
      <div className={styles["address-block"]}>
        <i className="pi pi-map-marker" style={{ fontSize: "15px" }}></i>
        <a
          href="https://www.google.com/maps/search/?api=1&query=B01+Bartels+Hall,+554+Campus+Road,+Ithaca,+NY+14853"
          target="_blank"
          rel="noopener noreferrer"
          className={styles["address-text"]}
        >
          B01 Bartels Hall, 554 Campus Road • Ithaca, NY 14853
        </a>
      </div>
    );
  }

  function ContactBlock({ icon, content, href }) {
    return (
      <div className={styles["address-block"]}>
        <i className={`pi ${icon}`} style={{ fontSize: "15px" }}></i>
        <a href={href} className={styles["address-text"]}>
          {content}
        </a>
      </div>
    );
  }

  return (
    <Card className={styles["container"]}>
      <div className={styles["cta-section"]}>
        <div className={styles["cta-content"]}>
          <div className={styles["line"]} />
          <div className={styles["info-section"]}>
            <Link
              href="https://scl.cornell.edu/sub/coe/ctlc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/CTLCLogoWhiteRed.jpg"
                alt="Logo"
                width={150}
                height={50}
                className={styles["logo"]}
              />
            </Link>
            <div className={styles["info-content"]}>
              <AddressBlock />
              <ContactBlock
                icon="pi-phone"
                content="607-254-4897"
                href="tel:+16072544897"
              />
              <ContactBlock
                icon="pi-envelope"
                content="teambuilding@cornell.edu"
                href="mailto:teambuilding@cornell.edu"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
