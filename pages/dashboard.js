import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import { useRouter } from "next/router";
import moment from "moment";
import {
  getAllProgramRequests,
  getAllStaff,
  getAllClients,
  getAllProgramsInGrid,
} from "../services/database.mjs";

const Dashboard = ({ user }) => {
  const [numberOfProgramRequest, setNumberOfProgramRequest] = useState(0);
  const [numberOfStaff, setNumberOfStaff] = useState(0);
  const [numberOfClients, setNumberOfClients] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [programRequests, setProgramRequests] = useState([]);
  const [facilitatorRequests, setFacilitatorRequests] = useState([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState([]);
  const router = useRouter();
  const op = React.useRef(null);

  const fetchPageDetails = async () => {
    if (user) {
      const pageStaffData = await getAllStaff();
      const pageRequestData = await getAllProgramRequests(user.uid);
      const pageClientData = await getAllClients();
      const allPrograms = await getAllProgramsInGrid();

      setNumberOfProgramRequest(pageRequestData.length);
      setNumberOfStaff(pageStaffData.length);
      setNumberOfClients(pageClientData.length);

      setProgramRequests(pageRequestData.slice(0, 5));
      setFacilitatorRequests([
        {
          id: 1,
          name: "John Doe",
          type: "New Facilitator",
          date: "2023-06-01",
        },
        {
          id: 2,
          name: "Jane Smith",
          type: "Training Request",
          date: "2023-06-02",
        },
      ]);

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
          icon: "pi pi-users",
          command: () => router.push("/app/clients/viewClients"),
        },
        {
          label: "Staff",
          icon: "pi pi-user",
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
          icon: "pi pi-cog",
          command: () => router.push("/app/users/viewUsers"),
        },
        {
          label: "Contract",
          icon: "pi pi-book",
          command: () => router.push("/app/contract/contractEditor"),
        },
      ],
    },
  ];

  const deleteNotification = (type, id) => {
    if (type === "program") {
      setProgramRequests(programRequests.filter((req) => req.id !== id));
    } else {
      setFacilitatorRequests(
        facilitatorRequests.filter((req) => req.id !== id)
      );
    }
  };

  const deleteAllNotifications = () => {
    setProgramRequests([]);
    setFacilitatorRequests([]);
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
      <div className="flex justify-content-between align-items-center mb-3">
        <h3>Notifications</h3>
        <Button
          icon="pi pi-trash"
          onClick={deleteAllNotifications}
          tooltip="Delete All"
        />
      </div>
      <TabView>
        <TabPanel header="Program Requests">
          <DataTable value={programRequests}>
            <Column field="companyName" header="Company" />
            <Column field="contactPerson" header="Contact" />
            <Column field="desiredDate" header="Desired Date" />
            <Column
              body={(rowData) => (
                <div>
                  <Button
                    icon="pi pi-eye"
                    onClick={() =>
                      router.push(`/app/program-requests/${rowData.id}`)
                    }
                    className="p-button-text"
                  />
                  <Button
                    icon="pi pi-times"
                    onClick={() => deleteNotification("program", rowData.id)}
                    className="p-button-text p-button-danger"
                  />
                </div>
              )}
            />
          </DataTable>
        </TabPanel>
        <TabPanel header="Facilitator Requests">
          <DataTable value={facilitatorRequests}>
            <Column field="name" header="Name" />
            <Column field="type" header="Request Type" />
            <Column field="date" header="Date" />
            <Column
              body={(rowData) => (
                <div>
                  <Button
                    icon="pi pi-eye"
                    onClick={() =>
                      router.push(`/app/facilitator-requests/${rowData.id}`)
                    }
                    className="p-button-text"
                  />
                  <Button
                    icon="pi pi-times"
                    onClick={() =>
                      deleteNotification("facilitator", rowData.id)
                    }
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
            badge={programRequests.length + facilitatorRequests.length}
            badgeClassName="p-badge-danger"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="grid">
          <div className="col-12 md:col-4">
            <Card title="Total Employees" subTitle={numberOfStaff}>
              <Button
                icon="pi pi-users"
                label="View Employees"
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
                icon="pi pi-calendar"
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

export default Dashboard;
