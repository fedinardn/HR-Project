import * as React from "react";
import styles from "../styles/CreateClientContract.module.css";

function TextInput({ label, id }) {
  return (
    <div className={styles["input-container"]}>
      <label className={styles["input-label visually-hidden"]} htmlFor={id}>
        {label}
      </label>
      <input className={styles["input-field"]} type="text" id={id} />
    </div>
  );
}

function HeaderTitle() {
  return (
    <header className={styles["header"]}>
      <h1 className={styles["header-title"]}>Contract For Group Name</h1>
    </header>
  );
}

function InformationSection() {
  return (
    <section className={styles["information-section"]}>
      <div className={styles["input-group"]}>
        <TextInput label={styles["Program"]} id="program" />
        <TextInput label={styles["Payment Due"]} id="payment-due" />
      </div>
      <div className={styles["input-group"]}>
        <TextInput label="Required By" id="required-by" />
        <TextInput label="Date Paid" id="date-paid" />
      </div>
      <div className={styles["input-group"]}>
        <TextInput label="Attendance" id="attendance" />
        <TextInput label="Payment Method" id="payment-method" />
      </div>
      <div className={styles["input-group"]}>
        <TextInput label="Paid" id="paid" />
      </div>
    </section>
  );
}

function ItemList() {
  return (
    <section className={styles["item-list"]}>
      <div className={styles["item-list-header"]}>
        <div className={styles["item-list-cell"]}>Item Code</div>
        <div className={styles["item-list-cell"]}>Item Description</div>
        <div className={styles["item-list-cell"]}>Date</div>
        <div className={styles["item-list-cell"]}>Time Slot</div>
        <div className={styles["item-list-cell"]}>Site</div>
        <div className={styles["item-list-cell"]}>Qty</div>
        <div className={styles["item-list-cell"]}>Price</div>
        <div className={styles["item-list-cell"]}>Sub Total</div>
      </div>
      <div className={styles["item-list-row"]}>
        <div className={styles["item-list-cell"]}>0</div>
        <div className={styles["item-list-cell"]}>$0.00</div>
        <div className={styles["item-list-cell"]}>$0.00</div>
      </div>
    </section>
  );
}

function ActionButtons() {
  return (
    <div className={styles["action-buttons"]}>
      <button className={styles["button button-preview"]}>Preview</button>
      <button className={styles["button button-pdf"]}>PDF</button>
    </div>
  );
}

export default function CreateClientContract() {
  return (
    <>
      <div className={styles.container}>
        <HeaderTitle />
        <InformationSection />
        <ItemList />
        <ActionButtons />
      </div>
    </>
  );
}
