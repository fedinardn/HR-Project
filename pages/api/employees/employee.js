import * as db from "../../../services/database.mjs"

export default async function handler(req, res) {
    console.log("here", req.method)
    if (req.method.toUpperCase() === "POST") {
      const staffDetails = req.body;
      const newStaff = await db.createNewStaff(staffDetails.firstName,
        staffDetails.lastName, staffDetails.address, staffDetails.payRate, staffDetails.phone,staffDetails.email,
        staffDetails.lowsTraining, staffDetails.highsTraining, staffDetails.towerTraining, staffDetails.rescueTraining,
        staffDetails.proFacilitator, staffDetails.typeOfStaff)
      if (newStaff) {
        return res.status(200).json(newStaff)
      } else {
        return res.status(400).json("staff not created")
      }
    } else if (req.method.toUpperCase() === "GET") {
      const request = req.body
      const allProgramRequests = await db.getAllProgramsForClient(request.userid);
  
      if (allProgramRequests) {
        return res.status(200).json(allProgramRequests)
      } else {
        return res.status(200).json(["no requests"])
      }
    }
  
  }