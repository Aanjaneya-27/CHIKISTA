const express = require("express");
const { 
  getCareCenters, addCareCenter, deleteCareCenter, 
  getEquipment, addEquipment, deleteEquipment, 
  getCategories, addCategory, deleteCategory, 
  getReferences, addReference, deleteReference, 
  getDeliveryExecutives, addDeliveryExecutive, deleteDeliveryExecutive
} = require("../controllers/MasterController");

const router = express.Router();
router.get("/carecenters", getCareCenters);
router.post("/carecenters", addCareCenter);
router.delete("/carecenters/:id", deleteCareCenter); 
router.get("/equipment", getEquipment);
router.post("/equipment", addEquipment);
router.delete("/equipment/:id", deleteEquipment); 
router.get("/categories", getCategories); 
router.post("/categories", addCategory); 
router.delete("/categories/:id", deleteCategory); 
router.get("/references", getReferences); 
router.post("/references", addReference); 
router.delete("/references/:id", deleteReference);
router.get("/delivery-executives", getDeliveryExecutives);
router.post("/delivery-executives", addDeliveryExecutive);
router.delete("/delivery-executives/:id", deleteDeliveryExecutive);

module.exports = router;