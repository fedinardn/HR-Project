import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "primereact/button";
import { getContractText } from "../services/database.mjs";

const PDFGenerator = ({ invoiceItems, clientData, programDetails }) => {
  const generatePDF = async (action = "save") => {
    const doc = new jsPDF();

    // Fetch the latest contract text
    let contractText;
    try {
      contractText = await getContractText();
    } catch (error) {
      console.error("Error fetching contract text:", error);
      return;
    }

    // Add header
    doc.setFontSize(12);
    doc.text(clientData.organizationName, 14, 20);

    // Add contact information
    doc.setFontSize(8);
    doc.setTextColor("#808080");
    doc.text("Contact Person", 14, 25);
    doc.text("Email", 14, 30);
    doc.text("Phone", 14, 35);
    doc.text("Program", 14, 40);

    doc.setTextColor("#000000");
    doc.setFont("helvetica", "normal");
    doc.text(clientData.contactPerson, 45, 25);
    doc.text(clientData.contactPersonEmail, 45, 30);
    doc.text(clientData.phone, 45, 35);
    doc.setFont(undefined, "bold");
    doc.text(programDetails.programName, 45, 40);

    doc.setFont(undefined, "normal");

    // Function to load image as base64
    const getImageFromUrl = (url, callback) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        callback(dataURL);
      };
      img.src = url;
    };

    // Load and add the image
    getImageFromUrl("/ctlcLogo.png", function (imgData) {
      doc.addImage(imgData, "PNG", 145, 0, 50, 50);

      // Add address
      doc.setFontSize(6);
      doc.text(
        [
          "Address:",
          "801 Bartels Hall",
          "Ithaca NY, 14853",
          "Phone: 607-254-7474",
          "Fax: 607-255-9881",
          "Email: teambuilding@cornell.edu",
          "www.ctlc.cornell.edu",
        ],
        145,
        40
      );

      // Contract for services
      doc.setFontSize(9);
      doc.text("CONTRACT FOR SERVICES", 14, 60);
      doc.setFontSize(8);
      doc.text("Cornell Outdoor Education will provide:", 14, 65);
      doc.line(14, 67, 196, 67);

      // Table
      doc.autoTable({
        head: [
          [
            "Description",
            "Date",
            "Time Slot",
            "Location",
            "Qty",
            "Price",
            "Amount",
          ],
        ],
        body: invoiceItems.map((item) => [
          item.description,
          item.date,
          item.timeSlot,
          item.location,
          item.qty,
          `$${item.price}`,
          `$${item.subtotal.toFixed(2)}`,
        ]),
        startY: 70,
        theme: "plain",
        styles: { fontSize: 7 },
        columnStyles: { 0: { cellWidth: 60 }, 2: { cellWidth: 40 } },
      });

      const calculateTotal = () => {
        return invoiceItems.reduce((total, item) => total + item.subtotal, 0);
      };

      const total = calculateTotal();

      doc.setFont(undefined, "bold");
      doc.setFontSize(9);
      const totalText = `Total:   $${total.toFixed(2)}`;
      const x = 190;
      const y = doc.lastAutoTable.finalY + 10;

      doc.text(totalText, x, y, { align: "right" });

      const textWidth = doc.getTextWidth(totalText);

      doc.line(x - textWidth - 1, y + 1, x + 1, y + 1);

      doc.setFont(undefined, "normal");
      // Function to parse HTML and add formatted text to PDF
      const addFormattedText = (htmlContent, startY, maxWidth) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlContent, "text/html");
        let currentY = startY;

        const processNode = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent
              .trim()
              .replace(/{}/g, programDetails.programDate);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, 14, currentY);
            currentY += lines.length * 4; // Reduced line height
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            switch (node.tagName.toLowerCase()) {
              case "p":
                currentY += 2; // Significantly reduced space before paragraph
                break;
              case "strong":
              case "b":
                doc.setFont(undefined, "bold");
                break;
              case "em":
              case "i":
                doc.setFont(undefined, "italic");
                break;
              case "ol":
              case "ul":
                currentY += 4; // Add a little space before lists
                break;
              case "li":
                doc.rect(14, currentY - 1.5, 2, 2); // Add checkbox
                doc.text(node.textContent.trim(), 18, currentY);
                currentY += 4; // Space between list items
                return; // Skip processing child nodes for list items
            }

            Array.from(node.childNodes).forEach(processNode);

            if (
              ["strong", "b", "em", "i"].includes(node.tagName.toLowerCase())
            ) {
              doc.setFont(undefined, "normal");
            }
          }
        };

        processNode(htmlDoc.body);
        return currentY;
      };

      // Add payment text
      let currentY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text("PAYMENT", 14, currentY);
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      currentY = addFormattedText(contractText.paymentText, currentY + 3, 180);

      // Add additional text
      currentY = addFormattedText(
        contractText.additionalText,
        currentY + 5,
        180
      );

      // Signature lines
      const signY = doc.internal.pageSize.height - 20;
      doc.setFontSize(7);
      doc.line(14, signY, 74, signY);
      doc.text("Client Representative", 14, signY + 4);
      doc.text("Date", 64, signY + 4);

      doc.line(120, signY, 190, signY);
      doc.text("CTLC Representative", 120, signY + 4);
      doc.text("Date", 180, signY + 4);

      if (action === "save") {
        doc.save(
          `${formatDate(programDetails.programDate)} ${
            programDetails.programName
          }.pdf`
        );
      } else if (action === "preview") {
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    });

    const formatDate = (date) => {
      const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
      return new Date(date)
        .toLocaleDateString("en-US", options)
        .replace(/\//g, "-");
    };
  };
  return (
    <div>
      <Button
        icon="pi pi-file-pdf"
        label="Generate PDF"
        onClick={() => generatePDF("save")}
      />
      <Button
        icon="pi pi-eye"
        label="Preview PDF"
        onClick={() => generatePDF("preview")}
      />
    </div>
  );
};
export default PDFGenerator;
