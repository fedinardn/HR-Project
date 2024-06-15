import * as db from "../../../services/database.mjs";

export default async function handler(req, res) {
  if (req.method.toUpperCase() === "POST") {
    const itemDetails = req.body;
    const newItem = await db.createChargeItem(
      itemDetails.lineItemCode,
      itemDetails.description,
      itemDetails.unitPrice,
      itemDetails.isService,
      itemDetails.isProduct
    );
    if (newItem) {
      return res.status(200).json(newItem);
    } else {
      return res.status(400).json("item not created");
    }
  } else if (req.method.toUpperCase() === "GET") {
    const request = req.body;
    const allChargeItems = await db.getAllChargeItemCodes();

    if (allChargeItems) {
      return res.status(200).json(allChargeItems);
    } else {
      return res.status(200).json(["no charge items"]);
    }
  }
}
