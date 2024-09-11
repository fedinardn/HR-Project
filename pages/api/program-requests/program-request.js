import * as fb from "../../../services/firebase.mjs";
import * as db from "../../../services/database.mjs";

export default async function handler(req, res) {
  if (req.method.toUpperCase() === "POST") {
    const programRequest = req.body;
    const newProgramRequest = await db.createProgramRequest(
      programRequest.contactPerson,
      programRequest.companyName,
      programRequest.userid,
      programRequest.programTypes,
      programRequest.desiredDate,
      programRequest.desiredLength,
      programRequest.role,
      programRequest.email,
      programRequest.phone,
      programRequest.website,
      programRequest.size,
      programRequest.additionalDetails
    );
    if (newProgramRequest) {
      return res.status(200).json(newProgramRequest);
    } else {
      return res.status(400).json("program request not sent");
    }
  } else if (req.method.toUpperCase() === "GET") {
    const request = req.body;
    const allProgramRequests = await db.getAllProgramRequestsForClient(
      request.userid
    );

    if (allProgramRequests) {
      return res.status(200).json(allProgramRequests);
    } else {
      return res.status(200).json(["no requests"]);
    }
  }
}
