const Requisition = require("../models/Requisition");
const Notification = require("../models/Notification");

const getRequisitions = async (req, res) => {
  try {
    const rows = await Requisition.getAll();
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const createRequisition = async (req, res) => {
  const data = req.body;
  if (data.payment_type === "Prepaid" && !data.notify_date) {
    return res.status(400).json({ message: "Notify Date is mandatory for Prepaid requisitions!" });
  }

  try {
    await Requisition.create(data);
    await Notification.create("info", "New Requisition Submitted", `REQ ${data.id} created for patient ${data.patient_name}.`);
    
    const today = new Date().toISOString().slice(0, 10);
    if (data.notify_date === today) {
      await Notification.create("warning", "Action Required: Pay Now", `Payment is due TODAY for ${data.patient_name} (REQ ${data.id}).`);
    }

    res.status(201).json({ message: "Requisition created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateRequisition = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  
  try {
    await Requisition.update(id, data); 
    await Notification.create("info", "Requisition Updated", `REQ ${id} details were updated.`);
    res.status(200).json({ message: "Requisition updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteRequisition = async (req, res) => {
  const { id } = req.params;

  try {
    await Requisition.delete(id); 
    await Notification.create("warning", "Requisition Deleted", `REQ ${id} was removed from the system.`);
    res.status(200).json({ message: "Requisition deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const rows = await Notification.getAll();
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

module.exports = { 
  getRequisitions, 
  createRequisition, 
  updateRequisition, 
  deleteRequisition, 
  getNotifications 
};