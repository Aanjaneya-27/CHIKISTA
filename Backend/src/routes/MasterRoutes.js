const express = require("express");
const { 
  getCareCenters, 
  addCareCenter, 
  deleteCareCenter, 
  getEquipment, 
  addEquipment,
  deleteEquipment, 
  deleteCategory, 
  deleteReference, 
  deleteDeliveryExecutive
} = require("../controllers/MasterController");

const router = express.Router();

router.get("/carecenters", getCareCenters);
router.post("/carecenters", addCareCenter);
router.delete("/carecenters/:id", deleteCareCenter); 
router.get("/equipment", getEquipment);
router.post("/equipment", addEquipment);
router.delete("/equipment/:id", deleteEquipment); 
router.delete("/categories/:id", deleteCategory); 
router.delete("/references/:id", deleteReference);
router.delete("/delivery-executives/:id", deleteDeliveryExecutive);
module.exports = router;