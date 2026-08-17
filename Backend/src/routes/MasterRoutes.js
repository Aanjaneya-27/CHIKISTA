// const express = require("express");
// const { 
//   getCareCenters, addCareCenter, deleteCareCenter, updateCareCenter,
//   getEquipment, addEquipment, deleteEquipment, updateEquipment,
//   getCategories, addCategory, deleteCategory, updateCategory,
//   getReferences, addReference, deleteReference, updateReference,
//   getDeliveryExecutives, addDeliveryExecutive, deleteDeliveryExecutive, updateDeliveryExecutive
// } = require("../controllers/MasterController");

// const router = express.Router();

// // Care Centers
// router.get("/carecenters", getCareCenters);
// router.post("/carecenters", addCareCenter);
// router.put("/carecenters/:id", updateCareCenter);
// router.delete("/carecenters/:id", deleteCareCenter); 

// // Equipment
// router.get("/equipment", getEquipment);
// router.post("/equipment", addEquipment);
// router.put("/equipment/:id", updateEquipment);
// router.delete("/equipment/:id", deleteEquipment); 

// // Categories
// router.get("/categories", getCategories); 
// router.post("/categories", addCategory); 
// router.put("/categories/:id", updateCategory); 
// router.delete("/categories/:id", deleteCategory); 

// // References (Doctors)
// router.get("/references", getReferences); 
// router.post("/references", addReference); 
// router.put("/references/:id", updateReference);
// router.delete("/references/:id", deleteReference);

// // Delivery Executives
// router.get("/delivery-executives", getDeliveryExecutives);
// router.post("/delivery-executives", addDeliveryExecutive);
// router.put("/delivery-executives/:id", updateDeliveryExecutive);
// router.delete("/delivery-executives/:id", deleteDeliveryExecutive);

// module.exports = router;

const express = require("express");
const { 
  getCareCenters, addCareCenter, deleteCareCenter, updateCareCenter,
  getEquipment, addEquipment, deleteEquipment, updateEquipment,
  getCategories, addCategory, deleteCategory, updateCategory,
  getReferences, addReference, deleteReference, updateReference,
  getDeliveryExecutives, addDeliveryExecutive, deleteDeliveryExecutive, updateDeliveryExecutive
} = require("../controllers/MasterController");

const router = express.Router();

router.get("/carecenters", getCareCenters);
router.post("/carecenters", addCareCenter);
router.put("/carecenters/:id", updateCareCenter);
router.delete("/carecenters/:id", deleteCareCenter); 

router.get("/equipment", getEquipment);
router.post("/equipment", addEquipment);
router.put("/equipment/:id", updateEquipment);
router.delete("/equipment/:id", deleteEquipment); 

router.get("/categories", getCategories); 
router.post("/categories", addCategory); 
router.put("/categories/:id", updateCategory); 
router.delete("/categories/:id", deleteCategory); 

router.get("/references", getReferences); 
router.post("/references", addReference); 
router.put("/references/:id", updateReference);
router.delete("/references/:id", deleteReference);

router.get("/delivery-executives", getDeliveryExecutives);
router.post("/delivery-executives", addDeliveryExecutive);
router.put("/delivery-executives/:id", updateDeliveryExecutive);
router.delete("/delivery-executives/:id", deleteDeliveryExecutive);

module.exports = router;