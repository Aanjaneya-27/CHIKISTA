const express = require("express");
const { getRequisitions,createRequisition,updateRequisition,deleteRequisition,getNotifications } = require("../controllers/requisitionController");

const router = express.Router();

router.get("/requisitions", getRequisitions);
router.post("/requisitions", createRequisition);
router.put("/requisitions/:id", updateRequisition);
router.delete("/requisitions/:id", deleteRequisition);
router.get("/notifications", getNotifications);
module.exports = router;