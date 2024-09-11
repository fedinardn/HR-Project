import React, { useState, useEffect, useRef } from "react";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import {
  getContractText,
  saveContractText,
} from "../../../services/database.mjs";

const ContractEditorPage = () => {
  const [paymentText, setPaymentText] = useState("");
  const [additionalText, setAdditionalText] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    const fetchContractText = async () => {
      try {
        const text = await getContractText();
        setPaymentText(text.paymentText);
        setAdditionalText(text.additionalText);
      } catch (error) {
        console.error("Error fetching contract text:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load contract text",
        });
      }
    };
    fetchContractText();
  }, []);

  const handleSave = async () => {
    try {
      await saveContractText({ paymentText, additionalText });
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Contract text saved successfully",
      });
    } catch (error) {
      console.error("Error saving contract text:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save contract text",
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <Card title="Edit Contract Information">
        <h3>Payment Information</h3>
        <Editor
          value={paymentText}
          onTextChange={(e) => setPaymentText(e.htmlValue)}
          style={{ height: "320px" }}
        />

        <h3>Additional Information</h3>
        <Editor
          value={additionalText}
          onTextChange={(e) => setAdditionalText(e.htmlValue)}
          style={{ height: "320px" }}
        />

        <Button
          label="Save Changes"
          icon="pi pi-save"
          onClick={handleSave}
          className="mt-3"
        />
      </Card>
    </div>
  );
};

export default ContractEditorPage;
