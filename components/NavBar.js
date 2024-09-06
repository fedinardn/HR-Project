// import React, { useState, useEffect } from "react";
// import { Menubar } from "primereact/menubar";
// import { Avatar } from "primereact/avatar";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { useRouter } from "next/router";
// import styles from "../styles/NavBar.module.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primeicons/primeicons.css";
// import "primeflex/primeflex.css";

// const NavBar = () => {
//   const router = useRouter();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSubmitRequestClick = () => {
//     if (!user) {
//       router.push("/login");
//     } else {
//       router.push("/app/program-requests/submitRequest");
//     }
//   };

//   const handleViewProgramRequestsClick = () => {
//     if (!user) {
//       router.push("/login");
//     } else {
//       router.push("/app/program-requests/viewRequests");
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     signOut(getAuth()).then(() => {
//       router.push("/login");
//     });
//   };

//   const items = [
//     {
//       label: "Home",
//       icon: "pi pi-home",
//       command: () => {
//         router.push("/");
//       },
//     },
//     {
//       label: "Submit Request",
//       icon: "pi pi-file",
//       command: handleSubmitRequestClick,
//     },
//     {
//       label: "Program Requests",
//       icon: "pi pi-list",
//       command: handleViewProgramRequestsClick,
//     },
//     {
//       label: "Dashboard",
//       icon: "pi pi-chart-line",
//       items: [
//         {
//           label: "Schedule",
//           command: () => {
//             router.push("/app/schedule/scheduleDisplay");
//           },
//         },
//         {
//           label: "Dashboard",
//           command: () => {
//             router.push("/dashboard");
//           },
//         },
//       ],
//     },
//     {
//       label: user ? "Logout" : "Sign In",
//       icon: user ? "pi pi-sign-out" : "pi pi-sign-in",
//       command: user ? handleLogout : () => router.push("/login"),
//     },
//   ];

//   const end = user && (
//     <div className="flex align-items-center gap-2">
//       <span className={styles.welcome}>Welcome</span>
//       <Avatar icon="pi pi-user" shape="circle" />
//     </div>
//   );

//   return (
//     <div className="card">
//       <Menubar model={items} end={end} />
//     </div>
//   );
// };

// export default NavBar;

import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import styles from "../styles/NavBar.module.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
// Highlight[
import { getUserPermission } from "../services/database.mjs";
// ]Highlight

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  // Highlight[
  const [userPermission, setUserPermission] = useState(null);
  // ]Highlight

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      // Highlight[
      if (user) {
        const permission = await getUserPermission(user.email);
        setUserPermission(permission);
      } else {
        setUserPermission(null);
      }
      // ]Highlight
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
    // Highlight[
    setUserPermission(null);
    // ]Highlight
    signOut(getAuth()).then(() => {
      router.push("/login");
    });
  };

  // Highlight[
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
  // ]Highlight

  const end = user && (
    <div className="flex align-items-center gap-2">
      <span className={styles.welcome}>Welcome</span>
      <Avatar icon="pi pi-user" shape="circle" />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} end={end} />
    </div>
  );
};

export default NavBar;
