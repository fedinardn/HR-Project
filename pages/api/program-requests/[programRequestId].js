import * as fb from "../../../services/firebase.mjs"

import * as db from "../../../services/database.mjs"

export default async function handler(req, res) {
  const programRequestId = req.query.programRequestId;

  console.log(programRequestId)
  if (req.method === "POST") {
    const programRequest = await db.approveProgramRequest(programRequestId)
    console.log(programRequest)
    if (programRequest) {
      return res.status(200).json(programRequest)
    } else {
      return res.status(400).json("program request not approved")
    }
  } else if (req.method === "GET") {
    const programRequestData = await db.getDataForProgramRequest(programRequestId);

    if (programRequestData) {
      return res.status(200).json(programRequestData)
    } else {
      return res.status(200).json(["no requests with that id"])
    }
  }

}