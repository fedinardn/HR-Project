import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import styles from "../styles/NavBar.module.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { getUserPermission } from "../services/database.mjs";

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userPermission, setUserPermission] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const permission = await getUserPermission(user.email);
        setUserPermission(permission);
      } else {
        setUserPermission(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitRequestClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/app/program-requests/submitRequest");
    }
  };

  const handleViewProgramRequestsClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/app/program-requests/viewRequests");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserPermission(null);
    signOut(getAuth()).then(() => {
      router.push("/login");
    });
  };

  const getDashboardItems = () => {
    if (userPermission === "Admin") {
      return [
        {
          label: "Schedule",
          command: () => {
            router.push("/app/schedule/scheduleDisplay");
          },
        },
        {
          label: "Dashboard",
          command: () => {
            router.push("/dashboard");
          },
        },
      ];
    } else if (userPermission === "Facilitator") {
      return [
        {
          label: "Schedule",
          command: () => {
            router.push("/app/schedule/scheduleDisplay");
          },
        },
      ];
    } else {
      return [];
    }
  };

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        router.push("/");
      },
    },
    {
      label: "Submit Request",
      icon: "pi pi-file",
      command: handleSubmitRequestClick,
    },
    {
      label: "Program Requests",
      icon: "pi pi-list",
      command: handleViewProgramRequestsClick,
    },
  ];

  if (userPermission === "Admin" || userPermission === "Facilitator") {
    items.push({
      label: "Dashboard",
      icon: "pi pi-chart-line",
      items: getDashboardItems(),
    });
  }

  items.push({
    label: user ? "Logout" : "Sign In",
    icon: user ? "pi pi-sign-out" : "pi pi-sign-in",
    command: user ? handleLogout : () => router.push("/login"),
  });

  const end = user && (
    <div className="flex align-items-center gap-2">
      <span className={styles.welcome}>Welcome</span>
      <Avatar icon="pi pi-user" shape="circle" />
    </div>
  );

  return (
    <div className={styles.stickyNavbar}>
      <Menubar model={items} end={end} />
    </div>
  );
};

export default NavBar;
