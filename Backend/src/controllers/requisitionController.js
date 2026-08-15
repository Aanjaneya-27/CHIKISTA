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
    await Requisition.create(req.body);
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
    await Requisition.update(id, req.body); 
    res.status(200).json({ message: "Requisition updated successfully!" });
  } catch (error) {
    console.error(" Update Error:", error);
    const exactError = error.sqlMessage || error.message || "Unknown Database Error";
    res.status(400).json({ message: exactError });
  }
};

const deleteRequisition = async (req, res) => {
  const { id } = req.params;
  try {
    await Requisition.delete(id); 
    await Notification.create("warning", "Requisition Deleted", `REQ ${id} was removed.`);
    res.status(200).json({ message: "Requisition deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// const getNotifications = async (req, res) => {
//   try {
//     const rows = await Notification.getAll();
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };
const getNotifications = async (req, res) => {
  try {
    const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id;
    const role = req.query.role || req.user?.role;

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