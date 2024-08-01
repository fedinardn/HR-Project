import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "primereact/button";
import ctlcLogo from "/public/ctlcLogo.png";

const PDFGenerator = ({ invoiceItems, clientData, programDetails }) => {
  const generatePDF = (action = "save") => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(14);
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
      doc.setFontSize(10);
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
          item.date ? item.date : "",
          item.timeSlot,
          item.location,
          item.qty,
          `$${item.price}`,
          `$${item.subtotal.toFixed(2)}`,
        ]),
        startY: 70,
        theme: "plain",
        styles: { fontSize: 8 },
        columnStyles: { 0: { cellWidth: 60 }, 2: { cellWidth: 40 } },
      });

      const calculateTotal = () => {
        return invoiceItems.reduce((total, item) => total + item.subtotal, 0);
      };

      const total = calculateTotal();

      doc.setFont(undefined, "bold");
      doc.setFontSize(10);
      const totalText = `Total:   $${total.toFixed(2)}`;
      const x = 190;
      const y = doc.lastAutoTable.finalY + 10;

      doc.text(totalText, x, y, { align: "right" });

      const textWidth = doc.getTextWidth(totalText);

      doc.line(x - textWidth - 1, y + 1, x + 1, y + 1);

      doc.setFont(undefined, "normal");

      const paymentText = [
        {
          text: `A signed contract and roster are required by ${programDetails.programDate} to confirm this program. Final payment is due by ${programDetails.programDate}. If paying with a Cornell account number, the full accounting string is necessary.`,
        },
        {
          checkbox: true,
          text: "CHECK: Make checks payable to Cornell University",
        },
        {
          checkbox: true,
          text: "CORNELL INTERNAL BILLING AUTHORIZATION: Account # _____________________________",
        },
        {
          checkbox: true,
          text: "MC/Visa: Please call our office at 607-255-6183 to make a payment over the phone.",
        },
      ];
      let currentYpay = doc.lastAutoTable.finalY + 20;
      let currentXpay = 14;
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("PAYMENT", 14, currentYpay);
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);

      paymentText.forEach((item) => {
        if (item.checkbox) {
          doc.rect(14, currentYpay + 6, 2, 2);
          const lines = doc.splitTextToSize(item.text, 170);
          lines.forEach((line, index) => {
            doc.text(line, 19, currentYpay + 8);
          });
          currentYpay += 8;
        } else {
          const lines = doc.splitTextToSize(item.text, 170);
          lines.forEach((line, index) => {
            if (index === 0) {
              doc.text(line, 14, currentYpay + 4);
            } else {
              currentYpay += 4;
              doc.text(line, 14, currentYpay + 4);
            }
          });
        }
        // currentYpay += 8;
      });

      const additionalText = [
        { text: "NUMBER OF PARTICIPANTS: ", bold: true },
        {
          text: `To provide you with the appropriate number of facilitators, as well as the best matched facilitators, we begin the staffing process as soon as your signed contract is returned to us. We will staff for the number of participants listed above. If you need to change the number of participants, we need to know 2 weeks in advance of the program date. If the number drops within 2 weeks, we will charge for the number contracted. If your number increases, we will charge for the increased number.\n\n`,
        },
        { text: "CANCELLATION POLICY: ", bold: true },
        {
          text: `Programs canceled with at least three weeks notice will be refunded 50% of the deposit. No refunds will be made for programs canceled with less than three weeks notice.\n\n`,
        },
        { text: "CONTRACTUAL AGREEMENT: ", bold: true },
        {
          text: `This document is a contract between Cornell University Outdoor Education(COE) and the "Sponsoring Organization" specified above, contracting COE to conduct the selected course/program based upon the following terms and conditions:\n\n`,
        },
        { text: "ASSUMPTION OF RISK: ", bold: true },
        {
          text: `This contract requires that the sponsoring organization shall assume all risks, losses, damages or injuries to all individual involved including participants and spectators arising out of the program, and the sponsoring organization shall be solely responsible an answerable for all accidents or injuries, including death, to persons or property and hereby covenants and agrees to indemnify and hold harmless Cornell University, its officers, trustees, agents and employees from any and all claims or suits for losses, damages or injuries to persons or property of whatever kind or nature whether direct or indirect, including attorney's fees and cost of defense arising out of this program.\n\n`,
        },
        { text: "SAFETY: ", bold: true },
        {
          text: `Participants in this program are subject to Cornell University regulations, Cornell Outdoor Education guidelines, the laws of the United States, and the laws of New York State. In the event of violation of these, or behavior which is considered by Cornell Outdoor Education to be detrimental to the participant, other participants, or the Cornell Outdoor Education program, Cornell Outdoor Education shall have the right to dismiss the participant from the program while retaining all payments.\n\n`,
        },
        { text: "ACCEPTANCE OF CONTRACTUAL AGREEMENT: ", bold: true },
        {
          text: `The acceptance of this climbing course/program contract, evidenced by payment(or payment authorization) and the signature of the "contact person" for the sponsoring organization, binds the sponsoring organization and "contact person" to this contract.`,
        },
      ];
      let currentY = doc.lastAutoTable.finalY + 60;
      let currentX = 14;

      additionalText.forEach((segment) => {
        if (segment.bold) {
          doc.setFont(undefined, "bold");
          doc.setFontSize(8);
        } else {
          doc.setFont(undefined, "normal");
          doc.setFontSize(8);
        }
        const lines = doc.splitTextToSize(segment.text, 180);
        doc.text(lines, 14, currentY);
        currentY += doc.getTextDimensions(lines).h;
      });

      // Signature lines
      const signY = doc.internal.pageSize.height - 20;
      doc.setFontSize(8);
      doc.line(14, signY, 74, signY);
      doc.text("Client Representative", 14, signY + 4);
      doc.text("Date", 64, signY + 4);

      doc.line(120, signY, 190, signY);
      doc.text("CTLC Representative", 120, signY + 4);
      doc.text("Date", 180, signY + 4);

      const formatDate = (date) => {
        const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
        return new Date(date)
          .toLocaleDateString("en-US", options)
          .replace(/\//g, "-");
      };

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
  };

  return (
    <div>
      <Button
        icon="pi pi-file-pdf"
        label="PDF"
        onClick={() => generatePDF("save")}
      />
      <Button
        icon="pi pi-eye"
        label="Preview"
        onClick={() => generatePDF("preview")}
      />
    </div>
  );
};

export default PDFGenerator;
