const express = require("express");
const router = express.Router();
const pool = require("../config/database"); 

router.post("/requisitions", async (req, res) => {
  try {
    const { 
      id, care_center_id, equipment_id, patient_name, quantity, 
      start_date, deal_type, unit, mode, notify_date, 
      delivery_address, notes 
    } = req.body;

    await pool.query(
      `INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, deal_type, unit, mode, notify_date, delivery_address, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, care_center_id, equipment_id, patient_name, quantity, start_date, deal_type, unit, mode, notify_date || null, delivery_address, notes]
    );

    if (mode === "Prepaid" && notify_date) {
      const notifMessage = `Prepaid payment reminder for Patient: ${patient_name}. Notify Date: ${notify_date}`;
      await pool.query(
        `INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)`,
        ["Action Required: Prepaid Alert", notifMessage, "warning"]
      );
    }

    res.status(201).json({ message: "Requisition Created Successfully!" });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ message: "Server error while saving", error: err.message });
  }
});

router.post("/requisitions", async (req, res) => {
  try {
    console.log("REQUISITION PAYLOAD:", req.body); 

    const { 
      id, care_center_id, equipment_id, patient_name, quantity, 
      start_date, deal_type, unit, mode, notify_date, 
      delivery_address, notes 
    } = req.body;

    const cleanStartDate = start_date && start_date.trim() !== "" ? start_date : null;
    const cleanNotifyDate = notify_date && notify_date.trim() !== "" ? notify_date : null;

    await pool.query(
      `INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, deal_type, unit, mode, notify_date, delivery_address, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        care_center_id || null, 
        equipment_id || null, 
        patient_name || "Unknown Patient", 
        quantity || 1, 
        cleanStartDate, 
        deal_type || "B2B", 
        unit || "ODCOM", 
        mode || "Postpaid", 
        cleanNotifyDate, 
        delivery_address || "", 
        notes || ""
      ]
    );

    if (mode === "Prepaid" && cleanNotifyDate) {
      const notifMessage = `Prepaid payment reminder for Patient: ${patient_name}. Notify Date: ${cleanNotifyDate}`;
      await pool.query(
        `INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)`,
        ["Action Required: Prepaid Alert", notifMessage, "warning"]
      );
    }

    res.status(201).json({ message: "Requisition Created Successfully!" });
  } catch (err) {
    console.error("DETAILED SERVER ERROR:", err); 
    res.status(500).json({ message: "Server error while saving", error: err.message });
  }
});

router.get("/requisitions", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, c.name as careCenterName, e.name as equipmentName 
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

module.exports = router;