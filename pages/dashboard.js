import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/router";
import moment from "moment";

import withProtectedRoute from "../components/WithProtectedRoute";

import {
  getAllProgramRequests,
  getAllStaff,
  getAllClients,
  getAllProgramsInGrid,
  getProgramRequestNotification,
  deleteProgramRequestNotification,
  getFacilitatorRequestNotification,
  deleteFacilitatorRequestNotification,
} from "../services/database.mjs";

const Dashboard = ({ user }) => {
  const [numberOfProgramRequest, setNumberOfProgramRequest] = useState(0);
  const [numberOfStaff, setNumberOfStaff] = useState(0);
  const [numberOfClients, setNumberOfClients] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [programRequestNotifications, setProgramRequestNotifications] =
    useState([]);
  const [facilitatorRequestNotifications, setFacilitatorRequestNotifications] =
    useState([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);
  const [loading, setLoading] = useState(true); // Add this state

  const router = useRouter();
  const op = useRef(null);

  const fetchPageDetails = async () => {
    if (user) {
      try {
        setLoading(true);

        const pageStaffData = await getAllStaff();
        const pageRequestData = await getAllProgramRequests(user.uid);
        const pageClientData = await getAllClients();
        const allPrograms = await getAllProgramsInGrid();
        const notifications = await getProgramRequestNotification();
        const facilitatorNotifications =
          await getFacilitatorRequestNotification();

        setNumberOfProgramRequest(pageRequestData.length);
        setNumberOfStaff(pageStaffData.length);
        setNumberOfClients(pageClientData.length);
        setProgramRequestNotifications(notifications);
        setFacilitatorRequestNotifications(facilitatorNotifications);

        // Filter and format upcoming programs
        const today = moment().startOf("day");
        const nextWeek = moment().add(7, "days").endOf("day");
        const upcoming = allPrograms
          .filter((program) => {
            const programDate = moment(program.date, "MM/DD/YYYY");
            return programDate.isBetween(today, nextWeek, null, "[]");
          })
          .map((program) => ({
            ...program,
            formattedDate: moment(program.date, "MM/DD/YYYY").format(
              "MM/DD/YYYY"
            ),
            needsFacilitators: Object.values(program.facilitatorsNeeded).some(
              (value) => value !== "0" && value !== ""
            ),
          }))
          .sort((a, b) =>
            moment(a.date, "MM/DD/YYYY").diff(moment(b.date, "MM/DD/YYYY"))
          );

        setUpcomingPrograms(upcoming);
      } catch (error) {
        console.error("Error fetching page details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
  };

  useEffect(() => {
    fetchPageDetails();
  }, [user]);

  const menuItems = [
    {
      label: "Navigation",
      items: [
        {
          label: "Clients",
          icon: "pi pi-briefcase",
          command: () => router.push("/app/clients/viewClients"),
        },
        {
          label: "Staff",
          icon: "pi pi-users",
          command: () => router.push("/app/employees/viewEmployees"),
        },
        {
          label: "Schedule",
          icon: "pi pi-calendar",
          command: () => router.push("/app/schedule/scheduleDisplay"),
        },
        {
          label: "Reports",
          icon: "pi pi-chart-bar",
          command: () => router.push("/app/analytics/analyticsView"),
        },
        {
          label: "Charge Items",
          icon: "pi pi-dollar",
          command: () => router.push("/app/charge-items/chargeItems"),
        },
        {
          label: "Users",
          icon: "pi pi-user",
          command: () => router.push("/app/users/viewUsers"),
        },
        {
          label: "Contract",
          icon: "pi pi-book",
          command: () => router.push("/app/contract/contractEditor"),
        },
        {
          label: "Log Hours",
          icon: "pi pi-calendar",
          command: () => router.push("/app/workday/logHours"),
        },
        {
          label: "Log Hours Admin",
          icon: "pi pi-clock",
          command: () => router.push("/app/workday/logHoursAdmin"),
        },
        {
          label: "Pay Finalization",
          icon: "pi pi-dollar",
          command: () => router.push("/app/workday/payFinalization"),
        },
      ],
    },
  ];

  const deleteRequestNotification = async (id) => {
    await deleteProgramRequestNotification(id);
    setProgramRequestNotifications(
      programRequestNotifications.filter((req) => req.id !== id)
    );
  };

  const deleteFacilitatorRequest = async (id) => {
    await deleteFacilitatorRequestNotification(id);
    setFacilitatorRequestNotifications(
      facilitatorRequestNotifications.filter((req) => req.id !== id)
    );
  };

  const formatProgramTime = (program) => {
    let timeString = "";
    if (program.startTime) {
      timeString += moment(program.startTime).format("h:mm A");
    }
    if (program.endTime) {
      timeString += ` - ${moment(program.endTime).format("h:mm A")}`;
    }
    return timeString.trim();
  };

  const programTemplate = (program) => {
    return (
      <div className="flex align-items-center justify-content-between">
        <div>
          <span className="font-bold">{program.programName}</span> -{" "}
          {program.formattedDate} {formatProgramTime(program)}
        </div>
        <Tag
          value={
            program.needsFacilitators ? "Needs Facilitators" : "Fully Staffed"
          }
          severity={program.needsFacilitators ? "danger" : "success"}
        />
      </div>
    );
  };

  const notificationPanel = (
    <div className="p-3">
      <h3>Notifications</h3>
      <TabView>
        <TabPanel
          header={
            <div>
              Program Requests
              <Badge value={programRequestNotifications.length} />
            </div>
          }
        >
          <DataTable
            value={programRequestNotifications}
            emptyMessage="No new notifications"
          >
            <Column field="message" header="Message" />
            <Column
              field="createdAt"
              header="Date Received"
              body={(rowData) => {
                const date = new Date(rowData.createdAt);
                return moment(date, "MM/DD/YYYY").format("MM/DD/YYYY");
              }}
            />
            <Column
              body={(rowData) => (
                <div>
                  <Button
                    icon="pi pi-eye"
                    onClick={() =>
                      router.push(
                        `/app/program-requests/${rowData.relatedDocumentId}`
                      )
                    }
                    className="p-button-text"
                  />
                  <Button
                    icon="pi pi-times"
                    onClick={() => deleteRequestNotification(rowData.id)}
                    className="p-button-text p-button-danger"
                  />
                </div>
              )}
            />
          </DataTable>
        </TabPanel>
        <TabPanel
          header={
            <div>
              Facilitator Requests
              <Badge value={facilitatorRequestNotifications.length} />
            </div>
          }
        >
          <DataTable
            value={facilitatorRequestNotifications}
            emptyMessage="No new notifications"
          >
            <Column field="message" header="Message" />
            <Column field="additionalDetails" header="Additional Details" />

            <Column
              field="createdAt"
              header="Date Received"
              body={(rowData) => {
                const date = new Date(rowData.createdAt);
                return moment(date, "MM/DD/YYYY").format("MM/DD/YYYY");
              }}
            />
            <Column
              body={(rowData) => (
                <div>
                  <Button
                    icon="pi pi-eye"
                    onClick={() => router.push(`/app/schedule/scheduleDisplay`)}
                    className="p-button-text"
                  />
                  <Button
                    icon="pi pi-times"
                    onClick={() => deleteFacilitatorRequest(rowData.id)}
                    className="p-button-text p-button-danger"
                  />
                </div>
              )}
            />
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
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
    <div className="flex">
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)}>
        <h2>CTLC Dashboard</h2>
        <Menu model={menuItems} />
      </Sidebar>

      <div className="flex-1 p-4">
        <div className="flex justify-content-between align-items-center mb-4">
          <Button
            icon="pi pi-bars"
            onClick={() => setSidebarVisible(true)}
            className="p-button-rounded p-button-text"
          />
          <Button
            icon="pi pi-bell"
            onClick={(e) => op.current.toggle(e)}
            className="p-button-rounded p-button-text"
            badge={
              programRequestNotifications.length +
              facilitatorRequestNotifications.length
            }
            badgeClassName="p-badge-danger"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="grid">
          <div className="col-12 md:col-4">
            <Card title="Total Staff" subTitle={numberOfStaff}>
              <Button
                icon="pi pi-users"
                label="View Staff"
                onClick={() => router.push("/app/employees/viewEmployees")}
              />
            </Card>
          </div>
          <div className="col-12 md:col-4">
            <Card title="Total Clients" subTitle={numberOfClients}>
              <Button
                icon="pi pi-briefcase"
                label="View Clients"
                onClick={() => router.push("/app/clients/viewClients")}
              />
            </Card>
          </div>
          <div className="col-12 md:col-4">
            <Card title="Program Requests" subTitle={numberOfProgramRequest}>
              <Button
                icon="pi pi-list"
                label="View Requests"
                onClick={() =>
                  router.push("/app/program-requests/viewRequests")
                }
              />
            </Card>
          </div>
        </div>

        <div className="mt-4">
          <Card title="Upcoming Programs (Next 7 Days)">
            <DataTable value={upcomingPrograms}>
              <Column body={programTemplate} />
            </DataTable>
            <Button
              label="Go to Schedule"
              icon="pi pi-calendar"
              onClick={() => router.push("/app/schedule/scheduleDisplay")}
              className="p-mt-2"
              style={{ marginTop: "10px" }}
            />
          </Card>
        </div>

        <div className="mt-4">
          <Card title="Quick Actions">
            <div className="flex flex-column">
              <Button
                icon="pi pi-user-plus"
                label="Add New Staff"
                outlined
                onClick={() => router.push("/app/employees/addNewEmployee")}
                className="mb-2"
              />
              <Button
                icon="pi pi-plus-circle"
                label="Add New Client"
                outlined
                onClick={() => router.push("/app/clients/addNewClient")}
              />
            </div>
          </Card>
        </div>
      </div>

      <OverlayPanel ref={op} showCloseIcon>
        {notificationPanel}
      </OverlayPanel>
    </div>
  );
};

export default withProtectedRoute(Dashboard);
