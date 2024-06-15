import crypto from "crypto";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
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

export const createUser = async (uid) => {
  const db = getFirestore();
  const userRef = collection(db, "users");
  const q = query(userRef, where("userid", "==", uid));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log(`User with UID ${uid} already exists.`);
    return null;
  }

  const newUser = {
    userid: uid,
    permission: "client",
  };

  await setDoc(doc(db, "users", newUser.userid), newUser);
  return newUser;
};

export const getUserPermission = async (uid) => {
  const db = getFirestore();
  const userCollection = collection(db, "users");

  const q = query(userCollection, where("userid", "==", uid));

  const querySnapshot = await getDocs(q);

  const userData = [];
  querySnapshot.forEach((doc) => {
    userData.push((doc.id, "=>", doc.data()));
  });

  return userData[0].permission;
};

export const createProgramRequest = async (
  contactPerson,
  companyName,
  userid,
  programTypes,
  desiredDate,
  desiredLength,
  role,
  email,
  phone,
  website,
  size,
  additionalDetails
) => {
  const db = getFirestore();

  const programRequestsCollection = collection(db, "programRequests");

  const newProgramRequest = {
    id: crypto.randomUUID(),
    userid: userid,
    contactPerson: contactPerson,
    companyName: companyName,
    programTypes: programTypes,
    desiredDate: desiredDate,
    desiredLength: desiredLength,
    role: role,
    email: email,
    phone: phone,
    website: website,
    size: size,
    additionalDetails: additionalDetails,
    dateSubmitted: Date.now(),
    approved: false,
  };

  // const docRef = await addDoc(programRequestsCollection, newProgramRequest);
  const docRef = await setDoc(
    doc(db, "programRequests", newProgramRequest.id),
    newProgramRequest
  );
  if (docRef === undefined) {
    return {};
  }

  return { id: docRef.id, ...newProgramRequest };
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
  professionalFacilitatorLevel,
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
    professionalFacilitatorLevel: professionalFacilitatorLevel,
    typeOfStaff: typeOfStaff,
    programs: [],
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

// EMPLOYEE FUNCTIONS END HERE

//CLIENT FUNCTIONS
export const createClient = async (
  companyName,
  contactPerson,
  contactPersonEmail,
  address,
  phone,
  email,
  typeOfClient
) => {
  const db = getFirestore();
  const clientID = crypto.randomUUID();
  const clientRef = doc(db, "clients", clientID);

  const newClient = {
    clientID: clientID,
    companyName: companyName,
    contactPerson: contactPerson,
    contactPersonEmail: contactPersonEmail,
    createdAt: Date.now(),
    address: address,
    phone: phone,
    email: email,
    typeOfClient: typeOfClient,
    programs: [],
  };
  await setDoc(clientRef, newClient);
  return newClient;
};

export const getClientDetails = async (clientID) => {
  const db = getFirestore();
  const clientCollection = collection(db, "staff");

  const q = query(clientCollection, where("clientID", "==", clientID));

  const querySnapshot = await getDocs(q);

  const clients = [];

  querySnapshot.forEach((doc) => {
    clients.push((doc.id, "=>", doc.data()));
  });
  return clients[0];
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

// export const createNewProgramForClient = async (clientId, companyName, programName, programTypes, date) => {
//   if (!client) {
//     throw new Error(`Client with ID ${clientId} not found`);
//   }

//   const newProgram = {
//     id: crypto.randomUUID(),
//     companyName: companyName,
//     programName: programName,
//     date: date,
//     programTypes: programTypes,
//     price: [],
//     assignedStaff: [],
//     approved: false,
//   }

//   const docRef = await addDoc(programRequestsCollection, newProgram);

//   return { id: docRef.id, ...newProgram };

// }

//ITEM CODES

export const createChargeItem = async (
  lineItemCode,
  description,
  unitPrice,
  isService,
  isProduct
) => {
  const db = getFirestore();
  const itemID = crypto.randomUUID();
  const itemRef = doc(db, "chargeItems", itemID);

  const newItem = {
    itemID: itemID,
    lineItemCode: lineItemCode,
    description: description,
    unitPrice: unitPrice,
    isService: isService,
    createdAt: Date.now(),
    isProduct: isProduct,
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
