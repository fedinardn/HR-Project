import styles from "../../../styles/viewClient.module.css";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import withProtectedRoute from "../../../components/WithProtectedRoute";
import EditClientModal from "../../../components/EditClientModal";
import AssignedProgramsList from "../../../components/AssignedProgamsList";
import {
  updateClientDetails,
  getClientDetails,
  getClientPrograms,
} from "../../../services/database.mjs";

const ViewClient = ({ user }) => {
  const router = useRouter();
  const clientID = router.query.clientId;
  const [clientData, setClientData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const fetchClientData = async () => {
    if (clientID) {
      setLoading(true);
      try {
        const data = await getClientDetails(clientID);
        setClientData(data);
        const clientPrograms = await getClientPrograms(clientID);
        setPrograms(clientPrograms);
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load client details",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [clientID]);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleSave = async (editedClient) => {
    try {
      await updateClientDetails(editedClient.clientID, editedClient);
      setClientData(editedClient);
      setShowModal(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Client details edited successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error updating client details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update client details",
        life: 3000,
      });
    }
  };

  const ClientHeader = ({ client }) => (
    <div className="flex align-items-center justify-content-between mb-4">
      <Link href="/app/clients/viewClients">
        <Button
          label="Back to all clients"
          icon="pi pi-arrow-left"
          className="p-button-text"
        />
      </Link>
      <div className="flex align-items-center">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          onClick={handleEditClick}
          tooltip="Edit Client"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="col-12 md:col-6 mb-3">
      <label className="font-bold">{label}</label>
      <div className="mt-2">{value || "N/A"}</div>
    </div>
  );

  const ClientInfo = ({ info }) => (
    <Card className="mb-4">
      <div className="grid">
        <InfoItem label="Organization Name" value={info.organizationName} />
        <InfoItem label="Contact Person" value={info.contactPerson} />
        <InfoItem label="Address" value={info.address} />
        <InfoItem label="Email" value={info.contactPersonEmail} />
        <InfoItem label="Phone" value={info.phone} />
        <InfoItem label="Mobile" value={info.mobile} />
        <InfoItem label="Type of Client" value={info.clientType} />
      </div>
      <Divider />
      <div className="field col-12">
        <label className="font-bold">Notes</label>
        <div className="mt-2 whitespace-pre-line">
          {info.notes || "No notes available."}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className={styles["staff-info"]}>
      <Toast ref={toast} />

      <ClientHeader client={clientData} />
      <EditClientModal
        client={clientData}
        visible={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
      />
      <ClientInfo info={clientData} />
      <AssignedProgramsList
        initialPrograms={programs}
        clientData={clientData}
      />
    </div>
  );
};

export default withProtectedRoute(ViewClient);
