import * as db from "../../../services/database.mjs";

export default async function handler(req, res) {
  console.log("here", req.method);
  if (req.method.toUpperCase() === "POST") {
    const clientDetails = req.body;
    const newclient = await db.createClient(
      clientDetails.organizationName,
      clientDetails.clientType,
      clientDetails.contactPerson,
      clientDetails.address,
      clientDetails.phone,
      clientDetails.mobile,
      clientDetails.email
    );
    if (newclient) {
      return res.status(200).json(newclient);
    } else {
      return res.status(400).json("client not created");
    }
  }
}
