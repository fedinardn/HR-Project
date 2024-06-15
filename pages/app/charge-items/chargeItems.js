import React, { useState } from "react";
import styles from "../../../styles/createChargeItem.module.css";

export default function MyComponent() {
  const [isServiceChecked, setIsServiceChecked] = useState(false);
  const [isProductChecked, setIsProductChecked] = useState(false);
  const [lineItemCode, setLineItemCode] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const handleServiceCheckboxChange = () => {
    setIsServiceChecked(!isServiceChecked);
  };

  const handleProductCheckboxChange = () => {
    setIsProductChecked(!isProductChecked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "lineItemCode":
        setLineItemCode(value);

      case "description":
        setDescription(value);
        break;
      case "unitPrice":
        setUnitPrice(value);
        break;
      default:
        break;
    }
  };

  const FormReusableInput = ({
    id,
    name,
    label,
    placeholder,
    type = "text",
    value,
    onChange,
  }) => {
    return (
      <div className={styles["form-group"]}>
        <label className={styles["form-label visually-hidden"]} htmlFor={id}>
          {label}
        </label>
        <input
          className={styles["form-input"]}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label={label}
        />
      </div>
    );
  };

  const FormOptions = ({ id, name, ariaLabel, checked, onChange }) => {
    return (
      <div className={styles["form-options"]}>
        <div className={styles["form-option"]}>
          <input
            className={styles["form-checkbox"]}
            type="checkbox"
            tabIndex="0"
            id={id}
            name={name}
            checked={checked}
            aria-label={ariaLabel}
            onChange={onChange}
          />
          <span className={styles["form-option-label"]}>{name}</span>
        </div>
      </div>
    );
  };

  const resetForm = () => {
    setLineItemCode("");
    setDescription("");
    setUnitPrice("");
    setIsServiceChecked(false);
    setIsProductChecked(false);
  };

  const onChargeItemSubmitted = async (event) => {
    event.preventDefault();

    const lineItemCode = event.target.lineItemCode.value;
    const description = event.target.description.value;
    const unitPrice = event.target.unitPrice.value;
    const isProduct = isProductChecked;
    const isService = isServiceChecked;

    const response = await fetch("/api/charge-items/chargeItems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lineItemCode: lineItemCode,
        description: description,
        unitPrice: unitPrice,
        isProduct: isProduct,
        isService: isService,
      }),
    });
    if (response.ok) {
      console.log("Item submitted");
    }
    event.target.reset();
  };

  return (
    <>
      <main className={styles["main-container"]}>
        <section className={styles["form-section"]}>
          <h1 className={styles["form-title"]}>Create New Item</h1>
          <form
            className={styles["form"]}
            onSubmit={(event) => onChargeItemSubmitted(event)}
          >
            <FormReusableInput
              id="lineItemCode"
              name="lineItemCode"
              label="Line Item Code"
              placeholder="Enter code"
              value={lineItemCode}
              onChange={handleInputChange}
            />
            <FormReusableInput
              id="description"
              name="description"
              label="Description"
              placeholder="Enter description"
              value={description}
              onChange={handleInputChange}
            />
            <FormReusableInput
              id="unitPrice"
              name="unitPrice"
              label="Unit Price"
              placeholder="$0.00"
              type="text"
              value={unitPrice}
              onChange={handleInputChange}
            />
            <FormOptions
              id="isService"
              name="isService"
              ariaLabel="isService"
              checked={isServiceChecked}
              onChange={handleServiceCheckboxChange}
            />

            <FormOptions
              id="isProduct"
              name="isProduct"
              ariaLabel="isProduct"
              checked={isProductChecked}
              onChange={handleProductCheckboxChange}
            />
            <div className={styles["form-actions"]}>
              <button
                type="button"
                onClick={resetForm}
                className={styles["form-cancel"]}
              >
                Cancel
              </button>
              <button type="submit" className={styles["form-save"]}>
                Save
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
