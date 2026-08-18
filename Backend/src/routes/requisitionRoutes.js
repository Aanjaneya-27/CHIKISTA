const express = require("express");
const { getRequisitions,createRequisition,updateRequisition,deleteRequisition,getNotifications,deleteNotification } = require("../controllers/requisitionController");

const router = express.Router();

router.get("/requisitions", getRequisitions);
router.post("/requisitions", createRequisition);
router.put("/requisitions/:id", updateRequisition);
router.delete("/requisitions/:id", deleteRequisition);
router.get("/notifications", getNotifications);
router.delete("/notifications/:id", deleteNotification);
module.exports = router;