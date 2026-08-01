const express = require("express");
const { getCareCenters, addCareCenter, getEquipment, addEquipment } = require("../controllers/MasterController");
const router = express.Router();

router.get("/carecenters", getCareCenters);
router.post("/carecenters", addCareCenter);
router.get("/equipment", getEquipment);
router.post("/equipment", addEquipment);

module.exports = router;