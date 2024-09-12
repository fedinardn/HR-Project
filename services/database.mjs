import crypto from "crypto";
import { uuidv7 } from "uuidv7";
import { format } from "date-fns";

import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const getAllProgramRequestsForClient = async (uid) => {
  const db = getFirestore();
  const programRequestsCollection = collection(db, "programRequests");

  const q = query(programRequestsCollection, where("userid", "==", uid));

  const querySnapshot = await getDocs(q);

  const programRequests = [];
  querySnapshot.forEach((doc) => {
    programRequests.push((doc.id, "=>", doc.data()));
  });

  return programRequests;
};

export const createUser = async (user) => {
  const db = getFirestore();
  const userRef = collection(db, "users");
  const q = query(userRef, where("userid", "==", user.uid));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log(`User with UID ${user.uid} already exists.`);
    return null;
  }

  const newUser = {
    email: user.email,
    username: user.displayName,
    userid: user.uid,
    permission: "No Access",
  };

  await setDoc(doc(db, "users", newUser.email), newUser);
  return newUser;
};

export const getAllUsers = async () => {
  const db = getFirestore();
  const userCollection = collection(db, "users");

  const q = query(userCollection);

  const querySnapshot = await getDocs(q);

  const users = [];
  querySnapshot.forEach((doc) => {
    users.push((doc.id, "=>", doc.data()));
  });

  return users;
};

export const updateUser = async (userEmail, updatedData) => {
  const db = getFirestore();
  const itemRef = doc(db, "users", userEmail);

  try {
    await updateDoc(itemRef, updatedData);
    // console.log("Charge item details updated successfully");
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
  return updatedData;
};

export const getUserPermission = async (userEmail) => {
  const db = getFirestore();
  const userCollection = collection(db, "users");

  const q = query(userCollection, where("email", "==", userEmail));

  const querySnapshot = await getDocs(q);

  const userData = [];
  querySnapshot.forEach((doc) => {
    userData.push((doc.id, "=>", doc.data()));
  });

  return userData[0].permission;
};

export const createProgramRequest = async (programRequestDetails) => {
  const db = getFirestore();

  const newProgramRequest = {
    ...programRequestDetails,
    createdAt: Date.now(),
  };

  const docRef = await setDoc(
    doc(db, "programRequests", newProgramRequest.id),
    newProgramRequest
  );

  return newProgramRequest;
};

export const createProgramRequestNotification = async (
  programRequestDetails
) => {
  const db = getFirestore();

  const newNotification = {
    id: uuidv7(),
    type: "program_request",
    message: "New program request created",
    relatedDocumentId: programRequestDetails.id,
    createdAt: Date.now(),
  };

  const notificationRef = doc(db, "notifications", newNotification.id);

  await setDoc(notificationRef, newNotification);

  return newNotification;
};

export const getProgramRequestNotification = async () => {
  const db = getFirestore();

  const notificationCollection = collection(db, "notifications");

  const q = query(
    notificationCollection,
    where("type", "==", "program_request")
  );
  const querySnapshot = await getDocs(q);

  const notifications = [];
  querySnapshot.forEach((doc) => {
    notifications.push((doc.id, "=>", doc.data()));
  });

  return notifications;
};

export const deleteProgramRequestNotification = async (id) => {
  const db = getFirestore();

  await deleteDoc(doc(db, "notifications", id));

  return true;
};

export const getAllContractedPrograms = async () => {
  const db = getFirestore();
  const programRequestsCollection = collection(db, "clientPrograms");

  const q = query(programRequestsCollection);

  const querySnapshot = await getDocs(q);

  const programs = [];
  querySnapshot.forEach((doc) => {
    programs.push((doc.id, "=>", doc.data()));
  });

  return programs;
};

export const getAllProgramRequests = async () => {
  const db = getFirestore();
  const programRequestsCollection = collection(db, "programRequests");

  const q = query(programRequestsCollection);

  const querySnapshot = await getDocs(q);

  const programRequests = [];
  querySnapshot.forEach((doc) => {
    programRequests.push((doc.id, "=>", doc.data()));
  });

  return programRequests;
};

export const getDataForProgramRequest = async (programRequestId) => {
  const db = getFirestore();
  const programRequestsCollection = collection(db, "programRequests");

  const q = query(
    programRequestsCollection,
    where("id", "==", programRequestId)
  );

  const querySnapshot = await getDocs(q);

  const programRequests = [];
  querySnapshot.forEach((doc) => {
    programRequests.push((doc.id, "=>", doc.data()));
  });

  return programRequests[0];
};

export const approveProgramRequest = async (programRequestId) => {
  const db = getFirestore();

  const programRequestRef = doc(db, "programRequests", programRequestId);

  const approvalData = { approved: true };
  await updateDoc(programRequestRef, approvalData);

  return true;
};

export const deleteProgramRequest = async (programRequestId) => {
  const db = getFirestore();

  await deleteDoc(doc(db, "programRequests", programRequestId));

  return true;
};

// EMPLOYEE FUNCTIONS

export const createNewStaff = async (
  firstName,
  lastName,
  address,
  payRate,
  phone,
  email,
  lowsTraining,
  highsTraining,
  towerTraining,
  rescueTraining,
  proFacilitator,
  typeOfStaff
) => {
  const db = getFirestore();
  const staffID = crypto.randomUUID();
  const staffRef = doc(db, "staff", staffID);

  const newStaff = {
    staffID: staffID,
    firstName: firstName,
    lastName: lastName,
    address: address,
    payRate: payRate,
    phone: phone,
    email: email,
    lowsTraining: lowsTraining,
    highsTraining: highsTraining,
    towerTraining: towerTraining,
    rescueTraining: rescueTraining,
    proFacilitator: proFacilitator,
    typeOfStaff: typeOfStaff,
  };

  await setDoc(staffRef, newStaff);
  return newStaff;
};

export const updateStaffDetails = async (staffID, updatedStaffData) => {
  const db = getFirestore();
  const staffRef = doc(db, "staff", staffID);

  try {
    await updateDoc(staffRef, updatedStaffData);
    console.log("Staff details updated successfully");
  } catch (error) {
    console.error("Error updating staff details:", error);
    throw error;
  }
};

export const getAllStaff = async () => {
  const db = getFirestore();
  const staffCollection = collection(db, "staff");

  const q = query(staffCollection);

  const querySnapshot = await getDocs(q);

  const staff = [];
  querySnapshot.forEach((doc) => {
    staff.push((doc.id, "=>", doc.data()));
  });

  return staff;
};

export const getStaffDetails = async (staffID) => {
  const db = getFirestore();
  const staffCollection = collection(db, "staff");

  const q = query(staffCollection, where("staffID", "==", staffID));

  const querySnapshot = await getDocs(q);

  const staff = [];

  querySnapshot.forEach((doc) => {
    staff.push((doc.id, "=>", doc.data()));
  });
  return staff[0];
};

export const assignProgramToStaff = async (staffID, programData) => {
  const db = getFirestore();
  const staffRef = doc(db, "staff", staffID);
  const staffProgramRef = doc(
    db,
    "staffPrograms",
    `${staffID}_${programData.programID}`
  );

  try {
    await setDoc(staffProgramRef, {
      staffID: staffID,
      ...programData,
      createdAt: Date.now(),
    });

    return {
      ...programData,
    };
  } catch (error) {
    console.error("Error assigning program to staff:", error);
    throw error;
  }
};

export const updateStaffProgramAssignment = async (
  staffID,
  programID,
  updatedProgramData
) => {
  const db = getFirestore();
  const staffProgramRef = doc(db, "staffPrograms", `${staffID}_${programID}`);

  try {
    // Update the program assignment in the staffPrograms collection
    await updateDoc(staffProgramRef, {
      ...updatedProgramData,
      updatedAt: Date.now(),
    });

    return {
      ...updatedProgramData,
    };
  } catch (error) {
    console.error("Error updating staff program assignment:", error);
    throw error;
  }
};

export const getStaffAssignments = async (staffID) => {
  const db = getFirestore();
  const staffProgramsClollection = collection(db, "staffPrograms");

  const q = query(staffProgramsClollection, where("staffID", "==", staffID));

  const querySnapshot = await getDocs(q);

  const programs = [];

  querySnapshot.forEach((doc) => {
    programs.push((doc.id, "=>", doc.data()));
  });
  return programs;
};

export const deleteStaffAssignment = async (staffID, programID) => {
  const db = getFirestore();
  const staffProgramAssignmentRef = doc(
    db,
    "staffPrograms",
    `${staffID}_${programID}`
  );

  try {
    await deleteDoc(staffProgramAssignmentRef);
    console.log("Assignment deleted successfully");
  } catch (error) {
    console.error("Error deleting Assignment:", error);
    throw error;
  }
};

export const getAllStaffAssignments = async () => {
  const db = getFirestore();
  const staffAssignmentsCollection = collection(db, "staffPrograms");

  const q = query(staffAssignmentsCollection);

  const querySnapshot = await getDocs(q);

  const programs = [];
  querySnapshot.forEach((doc) => {
    programs.push((doc.id, "=>", doc.data()));
  });

  return programs;
};

export const createFacilitatorRequestNotification = async (requestDetails) => {
  const db = getFirestore();

  const newNotification = {
    id: uuidv7(),
    type: "facilitator_request",
    message: `${requestDetails.name} wants to ${requestDetails.role} ${requestDetails.programName} on ${requestDetails.programDate}`,
    additionalDetails: requestDetails.additionalDetails,
    createdAt: Date.now(),
  };

  const notificationRef = doc(db, "notifications", newNotification.id);

  await setDoc(notificationRef, newNotification);

  return newNotification;
};

export const getFacilitatorRequestNotification = async () => {
  const db = getFirestore();

  const notificationCollection = collection(db, "notifications");

  const q = query(
    notificationCollection,
    where("type", "==", "facilitator_request")
  );
  const querySnapshot = await getDocs(q);

  const notifications = [];
  querySnapshot.forEach((doc) => {
    notifications.push((doc.id, "=>", doc.data()));
  });

  return notifications;
};

export const deleteFacilitatorRequestNotification = async (id) => {
  const db = getFirestore();

  await deleteDoc(doc(db, "notifications", id));

  return true;
};

// EMPLOYEE FUNCTIONS END HERE

//CLIENT FUNCTIONS
export const createClient = async (
  organizationName,
  clientType,
  contactPerson,
  address,
  phone,
  mobile,
  contactPersonEmail
) => {
  const db = getFirestore();
  const clientID = crypto.randomUUID();
  const clientRef = doc(db, "clients", clientID);

  const newClient = {
    clientID: clientID,
    organizationName: organizationName,
    contactPerson: contactPerson,
    clientType: clientType,
    contactPersonEmail: contactPersonEmail,
    createdAt: Date.now(),
    address: address,
    phone: phone,
    mobile: mobile,
    programs: [],
  };
  await setDoc(clientRef, newClient);
  return newClient;
};

export const getClientDetails = async (clientID) => {
  const db = getFirestore();
  const clientCollection = collection(db, "clients");

  const q = query(clientCollection, where("clientID", "==", clientID));

  const querySnapshot = await getDocs(q);

  const clients = [];

  querySnapshot.forEach((doc) => {
    clients.push((doc.id, "=>", doc.data()));
  });
  return clients[0];
};

export const getClientPrograms = async (clientID) => {
  const db = getFirestore();
  const clientProgramsCollection = collection(db, "clientPrograms");

  const q = query(clientProgramsCollection, where("clientID", "==", clientID));

  const querySnapshot = await getDocs(q);

  const programs = [];

  querySnapshot.forEach((doc) => {
    programs.push((doc.id, "=>", doc.data()));
  });
  return programs;
};

export const getAllClients = async () => {
  const db = getFirestore();
  const clientCollection = collection(db, "clients");

  const q = query(clientCollection);

  const querySnapshot = await getDocs(q);

  const clients = [];
  querySnapshot.forEach((doc) => {
    clients.push((doc.id, "=>", doc.data()));
  });

  return clients;
};

export const updateClientDetails = async (clientID, updatedClientData) => {
  const db = getFirestore();
  const clientRef = doc(db, "clients", clientID);

  try {
    await updateDoc(clientRef, updatedClientData);
    console.log("Client details updated successfully");
  } catch (error) {
    console.error("Error updating client details:", error);
    throw error;
  }
};

export const createNewProgramForClient = async (clientID, programData) => {
  const db = getFirestore();
  const clientProgramRef = doc(db, "clientPrograms", programData.programID);

  try {
    await setDoc(clientProgramRef, {
      clientID: clientID,
      ...programData,
      createdAt: Date.now(),
    });

    return {
      ...programData,
    };
  } catch (error) {
    console.error("Error creating new program:", error);
    throw error;
  }
};

export const updateProgramForClient = async (
  clientID,
  programID,
  updatedProgramData
) => {
  const db = getFirestore();
  const clientProgramRef = doc(db, "clientPrograms", programID);

  try {
    await updateDoc(clientProgramRef, {
      ...updatedProgramData,
      updatedAt: Date.now(),
    });

    return {
      ...updatedProgramData,
    };
  } catch (error) {
    console.error("Error updating program:", error);
    throw error;
  }
};

export const deleteProgramForClient = async (clientID, programID) => {
  const db = getFirestore();
  const programRef = doc(db, "clientPrograms", programID);

  try {
    await deleteDoc(programRef);

    return {
      success: true,
      message: "Program deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting program:", error);
    throw error;
  }
};

//ITEM CODES

export const createChargeItem = async (
  id,
  lineItemCode,
  description,
  unitPrice
  // isService,
  // isProduct
) => {
  const db = getFirestore();
  const itemID = id;
  // console.log(itemID);
  const itemRef = doc(db, "chargeItems", itemID);

  const newItem = {
    itemID: itemID,
    lineItemCode: lineItemCode,
    description: description,
    unitPrice: unitPrice,
    isService: false,
    createdAt: Date.now(),
    isProduct: false,
    isNew: false,
  };
  await setDoc(itemRef, newItem);
  return newItem;
};

export const getAllChargeItemCodes = async () => {
  const db = getFirestore();
  const chargeItemCollection = collection(db, "chargeItems");

  const q = query(chargeItemCollection);

  const querySnapshot = await getDocs(q);

  const chargeItems = [];
  querySnapshot.forEach((doc) => {
    chargeItems.push((doc.id, "=>", doc.data()));
  });

  return chargeItems;
};

export const updateChargeItem = async (itemID, updatedItemData) => {
  const db = getFirestore();
  const itemRef = doc(db, "chargeItems", itemID);

  try {
    await updateDoc(itemRef, updatedItemData);
    console.log("Charge item details updated successfully");
  } catch (error) {
    console.error("Error updating charge item details:", error);
    throw error;
  }
  return updatedItemData;
};

export const deleteChargeItem = async (itemID) => {
  const db = getFirestore();
  const itemRef = doc(db, "chargeItems", itemID);

  try {
    await deleteDoc(itemRef);
    console.log("Charge item deleted successfully");
  } catch (error) {
    console.error("Error deleting charge item:", error);
    throw error;
  }
};

//Schedule

export const createNewProgramInGrid = async (
  id,
  programName,
  date,
  startTime,
  endTime,
  clientType,
  locationAndProgram,
  groupSize,
  contactPerson,
  contactPersonEmail,
  notes,
  facilitators,
  facilitatorsNeeded
) => {
  const db = getFirestore();
  const programID = id;
  const programRef = doc(db, "programSchedule", programID);

  let formattedDate = "";
  if (date) {
    formattedDate = format(new Date(date), "MM/dd/yyyy");
  }

  let formattedStartTime = "";
  if (startTime) {
    formattedStartTime = format(new Date(startTime), "Pp");
  }

  let formattedEndTime = "";
  if (endTime) {
    formattedEndTime = format(new Date(endTime), "Pp");
  }
  const newProgram = {
    programID: programID,
    programName: programName,
    date: formattedDate,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
    clientType: clientType,
    locationAndProgram: locationAndProgram,
    groupSize: groupSize,
    contactPerson: contactPerson,
    contactPersonEmail: contactPersonEmail,
    underAgeParticipants: false,
    facilitators: facilitators,
    facilitatorEmails: [],
    notes: notes,
    returningClient: false,
    contractSent: false,
    preProgramEmail: false,
    packetReady: false,
    packetProcessed: false,
    followUp: false,
    cancelled: false,
    facilitatorsNeeded: facilitatorsNeeded,
    createdAt: Date.now(),
    isNew: false,
  };

  await setDoc(programRef, newProgram);
  return newProgram;
};

export const updateProgramInGrid = async (programID, updatedProgramData) => {
  const db = getFirestore();
  const programRef = doc(db, "programSchedule", programID);

  const { date, startTime, endTime, ...rest } = updatedProgramData;

  let formattedDate = "";
  if (date) {
    formattedDate = format(new Date(date), "MM/dd/yyyy");
  }

  let formattedStartTime = "";
  if (startTime) {
    formattedStartTime = format(new Date(startTime), "Pp");
  }

  let formattedEndTime = "";
  if (endTime) {
    formattedEndTime = format(new Date(endTime), "Pp");
  }

  const formattedProgramData = {
    ...rest,
    date: formattedDate,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  };

  try {
    await updateDoc(programRef, formattedProgramData);
    console.log("Program details updated successfully");
  } catch (error) {
    console.error("Error updating program details:", error);
    throw error;
  }
  return updatedProgramData;
};

export const getAllProgramsInGrid = async () => {
  const db = getFirestore();
  const programsCollection = collection(db, "programSchedule");

  const q = query(programsCollection);

  const querySnapshot = await getDocs(q);

  const programs = [];
  querySnapshot.forEach((doc) => {
    programs.push((doc.id, "=>", doc.data()));
  });

  return programs;
};

export const deleteProgramInGrid = async (programID) => {
  const db = getFirestore();
  const programRef = doc(db, "programSchedule", programID);

  try {
    await deleteDoc(programRef);
    console.log("Program deleted successfully");
  } catch (error) {
    console.error("Error deleting program:", error);
    throw error;
  }
};

// CONTRACT FUNCTIONS

export const getContractText = async () => {
  const db = getFirestore();
  const contractDocRef = doc(db, "contractText", "default");

  try {
    const contractDocSnap = await getDoc(contractDocRef);

    if (contractDocSnap.exists()) {
      return contractDocSnap.data();
    } else {
      console.log("No contract text found, returning default values");
      return { paymentText: "", additionalText: "" };
    }
  } catch (error) {
    console.error("Error fetching contract text:", error);
    throw error;
  }
};

export const saveContractText = async (contractText) => {
  const db = getFirestore();
  const contractDocRef = doc(db, "contractText", "default");

  try {
    await setDoc(contractDocRef, contractText, { merge: true });
    console.log("Contract text saved successfully");
  } catch (error) {
    console.error("Error saving contract text:", error);
    throw error;
  }
};

export const updateContractTextField = async (field, value) => {
  const db = getFirestore();
  const contractDocRef = doc(db, "contractText", "default");

  try {
    await setDoc(contractDocRef, { [field]: value }, { merge: true });
    console.log(`Contract text field '${field}' updated successfully`);
  } catch (error) {
    console.error(`Error updating contract text field '${field}':`, error);
    throw error;
  }
};
