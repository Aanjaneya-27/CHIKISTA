const express = require("express");
const { getRequisitions, createRequisition, getNotifications } = require("../controllers/requisitionController");
const router = express.Router();

router.get("/requisitions", getRequisitions);
router.post("/requisitions", createRequisition);
router.get("/notifications", getNotifications);

module.exports = router;