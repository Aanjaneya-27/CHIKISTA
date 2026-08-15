// const Requisition = require("../models/Requisition");
// const Notification = require("../models/Notification");

// const getRequisitions = async (req, res) => {
//   try {
//     const rows = await Requisition.getAll();
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const createRequisition = async (req, res) => {
//   try {
//     await Requisition.create(req.body);
//     res.status(201).json({ message: "Requisition created successfully!" });
//   } catch (error) {
//     console.error("CRASH ERROR:", error);
//     const exactError = error.sqlMessage || error.message || "Unknown Database Error";
//     res.status(400).json({ message: exactError });
//   }
// };

// const updateRequisition = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await Requisition.update(id, req.body); 
//     res.status(200).json({ message: "Requisition updated successfully!" });
//   } catch (error) {
//     console.error(" Update Error:", error);
//     const exactError = error.sqlMessage || error.message || "Unknown Database Error";
//     res.status(400).json({ message: exactError });
//   }
// };

// const deleteRequisition = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await Requisition.delete(id); 
//     await Notification.create("warning", "Requisition Deleted", `REQ ${id} was removed.`);
//     res.status(200).json({ message: "Requisition deleted successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // const getNotifications = async (req, res) => {
// //   try {
// //     const rows = await Notification.getAll();
// //     res.json(rows);
// //   } catch (error) { 
// //     res.status(500).json({ message: "Server error", error: error.message }); 
// //   }
// // };
// const getNotifications = async (req, res) => {
//   try {
//     const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id;
//     const role = req.query.role || req.user?.role;

//     const data = await Notification.getAll(careCenterId, role);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { 
//   getRequisitions, 
//   createRequisition, 
//   updateRequisition, 
//   deleteRequisition, 
//   getNotifications 
// };

const Requisition = require("../models/Requisition");
const Notification = require("../models/Notification");


const getRequisitions = async (req, res) => {
  try {
    const rows = await Requisition.getAll();
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const createRequisition = async (req, res) => {
  try {
    const data = req.body;
    await Requisition.create(data);

    // Extract details for notification
    const patientName = data.patient_name || data.patientName || "Patient";
    const equipName = data.equipmentName || data.equipment_id || "Medical Equipment";
    const careCenterId = data.care_center_id || data.careCenterId || null;
    const careCenterName = data.care_center_name || data.careCenterName || "Care Center";

    await Notification.create(
      "success",
      `New Requisition: ${patientName}`,
      `Allocation created for ${equipName} (Patient: ${patientName}) by ${careCenterName}.`,
      careCenterId
    );

    res.status(201).json({ message: "Requisition created successfully!" });
  } catch (error) {
    console.error("CRASH ERROR:", error);
    const exactError = error.sqlMessage || error.message || "Unknown Database Error";
    res.status(400).json({ message: exactError });
  }
};

const updateRequisition = async (req, res) => {
  const { id } = req.params;
  try {
    const data = req.body;
    await Requisition.update(id, data); 

    const patientName = data.patient_name || data.patientName || "Patient";
    const careCenterId = data.care_center_id || data.careCenterId || null;
    const status = data.status || data.requisition_status || "Updated";

    await Notification.create(
      status === "Returned" ? "success" : "info",
      `Requisition ${status}: ${patientName}`,
      `Requisition ${id} for ${patientName} has been updated to ${status}.`,
      careCenterId
    );

    res.status(200).json({ message: "Requisition updated successfully!" });
  } catch (error) {
    console.error("Update Error:", error);
    const exactError = error.sqlMessage || error.message || "Unknown Database Error";
    res.status(400).json({ message: exactError });
  }
};

const deleteRequisition = async (req, res) => {
  const { id } = req.params;
  try {
    await Requisition.delete(id); 
    await Notification.create(
      "warning", 
      "Requisition Deleted", 
      `Requisition ${id} was removed from the system.`,
      null
    );

    res.status(200).json({ message: "Requisition deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id || null;
    const role = req.query.role || req.user?.role || null;

    const data = await Notification.getAll(careCenterId, role);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getRequisitions, 
  createRequisition, 
  updateRequisition, 
  deleteRequisition, 
  getNotifications 
};