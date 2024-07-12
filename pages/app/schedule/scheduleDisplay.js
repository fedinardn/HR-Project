// import React, { useState, useEffect } from "react";
// // import { db } from "./firebase";
// import { updateDoc, doc, getDoc, getFirestore } from "firebase/firestore";
// const db = getFirestore();

// const FacilitatorsNeeded = ({ programId }) => {
//   const [facilitatorsNeeded, setFacilitatorsNeeded] = useState([]);
//   const [role, setRole] = useState("");
//   const [count, setCount] = useState(1);

//   //   useEffect(() => {
//   //     const fetchFacilitatorsNeeded = async () => {
//   //       const programRef = doc(db, "programs", programId);
//   //       const programDoc = await getDoc(programRef);
//   //       if (programDoc.exists()) {
//   //         setFacilitatorsNeeded(programDoc.data().facilitatorsNeeded || []);
//   //       }
//   //     };

//   //     fetchFacilitatorsNeeded();
//   //   }, [programId]);

//   const addFacilitatorRole = () => {
//     const newFacilitatorsNeeded = [...facilitatorsNeeded, { role, count }];
//     setFacilitatorsNeeded(newFacilitatorsNeeded);
//     updateFacilitatorsNeeded(newFacilitatorsNeeded);
//   };

//   const updateFacilitatorsNeeded = async (newFacilitatorsNeeded) => {
//     const programRef = doc(db, "programs", programId);
//     await updateDoc(programRef, {
//       facilitatorsNeeded: newFacilitatorsNeeded,
//     });
//   };

//   const handleRoleChange = (index, newRole) => {
//     const updatedFacilitatorsNeeded = facilitatorsNeeded.map((item, i) =>
//       i === index ? { ...item, role: newRole } : item
//     );
//     setFacilitatorsNeeded(updatedFacilitatorsNeeded);
//     updateFacilitatorsNeeded(updatedFacilitatorsNeeded);
//   };

//   const handleCountChange = (index, newCount) => {
//     const updatedFacilitatorsNeeded = facilitatorsNeeded.map((item, i) =>
//       i === index ? { ...item, count: newCount } : item
//     );
//     setFacilitatorsNeeded(updatedFacilitatorsNeeded);
//     updateFacilitatorsNeeded(updatedFacilitatorsNeeded);
//   };

//   const removeFacilitatorRole = (index) => {
//     const newFacilitatorsNeeded = facilitatorsNeeded.filter(
//       (_, i) => i !== index
//     );
//     setFacilitatorsNeeded(newFacilitatorsNeeded);
//     updateFacilitatorsNeeded(newFacilitatorsNeeded);
//   };

//   return (
//     <div>
//       <h3>Facilitators Needed</h3>
//       <ul>
//         {facilitatorsNeeded.map((item, index) => (
//           <li key={index}>
//             <input
//               type="text"
//               value={item.role}
//               onChange={(e) => handleRoleChange(index, e.target.value)}
//               placeholder="Role"
//             />
//             <input
//               type="number"
//               value={item.count}
//               onChange={(e) => handleCountChange(index, e.target.value)}
//               placeholder="Count"
//             />
//             <button onClick={() => removeFacilitatorRole(index)}>Remove</button>
//           </li>
//         ))}
//       </ul>
//       <div>
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="">Select Role</option>
//           <option value="lead">Lead</option>
//           <option value="belayers">Belayers</option>
//           <option value="TA">TA</option>
//           <option value="canoe">Canoe</option>
//           <option value="support">Support</option>
//           <option value="lows">Lows</option>
//           <option value="highs">Highs</option>
//         </select>
//         <input
//           type="number"
//           value={count}
//           onChange={(e) => setCount(e.target.value)}
//           placeholder="Count"
//         />
//         <button onClick={addFacilitatorRole}>Add</button>
//       </div>
//     </div>
//   );
// };

// export default FacilitatorsNeeded;

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MyCalendar from "./scheduleCalendar";
import FullFeaturedCrudProgramGrid from "./scheduleGrid";
import ProgramList from "./scheduleTest";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Schedule Tabs">
          {/* <Tab label="Program Grid View" {...a11yProps(0)} /> */}
          <Tab label="Programs View" {...a11yProps(0)} />
          <Tab label="Program Calendar View" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <ProgramList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MyCalendar />
      </CustomTabPanel>
    </Box>
  );
}
