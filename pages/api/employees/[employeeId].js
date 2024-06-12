import * as db from "../../../services/database.mjs"

export default async function handler(req, res) {
  const staffID = req.query.employeeId;

  // console.log(typeof(staffID))
  if (req.method === "POST") {
    const staffData = await db.updateStaffDetails(staffID)
    // console.log(staffData)
    if (staffData) {
      return res.status(200).json(staffData)
    } else {
      return res.status(400).json("staff not updates")
    }
  } else if (req.method === "GET") {
    const staffData = await db.getStaffDetails(staffID);

    if (staffData) {
      return res.status(200).json(staffData)
    } else {
      return res.status(200).json(["no staff with that id"])
    }
  }

}