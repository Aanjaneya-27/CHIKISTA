const express = require("express");
const { 
  getCareCenters, 
  addCareCenter, 
  deleteCareCenter, 
  getEquipment, 
  addEquipment,
  deleteEquipment, 
  deleteCategory    
} = require("../controllers/MasterController");

const router = express.Router();

//forced routes for care centers and equipment
router.get("/carecenters", getCareCenters);
router.post("/carecenters", addCareCenter);
router.delete("/carecenters/:id", deleteCareCenter); 
router.get("/equipment", getEquipment);
router.post("/equipment", addEquipment);
router.delete("/equipment/:id", deleteEquipment); 
router.delete("/categories/:id", deleteCategory); 

module.exports = router;