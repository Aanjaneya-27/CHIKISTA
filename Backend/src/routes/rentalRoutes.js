// const express = require("express");
// const router = express.Router();
// const pool = require("../config/database"); 

// const getSafeDate = (dateStr) => {
//   const today = new Date().toISOString().slice(0, 10);
//   if (!dateStr || String(dateStr).trim() === "") return today;
//   return dateStr.toString().slice(0, 10);
// };

// router.post("/requisitions", async (req, res) => {
//   try {
//     console.log("REQUISITION PAYLOAD:", req.body); 

//     const { 
//       id, care_center_id, equipment_id, patient_name, quantity, 
//       start_date, logout_date, deal_type, unit, mode, notify_date, 
//       delivery_address, notes, bed_number, bedNumber, referral_doctor, referralDoctor, gst_number, gstNumber 
//     } = req.body;

//     const cleanStartDate = getSafeDate(start_date);
//     const cleanLogoutDate = getSafeDate(logout_date);
//     const cleanNotifyDate = notify_date && notify_date.trim() !== "" ? notify_date.toString().slice(0, 10) : null;
//     const reqId = id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

//     const finalBed = bed_number || bedNumber || '';
//     const finalRefDoc = referral_doctor || referralDoctor || '';
//     const finalGst = gst_number || gstNumber || '';

//     await pool.query(
//       `INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, deal_type, unit, mode, notify_date, delivery_address, notes, bed_number, referral_doctor, gst_number) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         reqId, 
//         care_center_id || "CARE-NEW", 
//         equipment_id || "EQ-NEW", 
//         patient_name || "Unknown Patient", 
//         quantity || 1, 
//         cleanStartDate, 
//         cleanLogoutDate, 
//         deal_type || "B2B", 
//         unit || "ODCOM", 
//         mode || "Postpaid", 
//         cleanNotifyDate, 
//         delivery_address || "", 
//         notes || "",
//         finalBed,
//         finalRefDoc,
//         finalGst
//       ]
//     );

//     if (mode === "Prepaid" && cleanNotifyDate) {
//       const notifMessage = `Prepaid payment reminder for Patient: ${patient_name}. Notify Date: ${cleanNotifyDate}`;
//       await pool.query(
//         `INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)`,
//         ["Action Required: Prepaid Alert", notifMessage, "warning"]
//       );
//     }

//     res.status(201).json({ message: "Requisition Created Successfully!" });
//   } catch (err) {
//     console.error("DETAILED SERVER ERROR:", err); 
//     res.status(500).json({ message: "Server error while saving", error: err.message });
//   }
// });

// router.get("/requisitions", async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT r.*, c.name as careCenterName, e.name as equipmentName,
//              r.bed_number AS bedNumber, r.referral_doctor AS referralDoctor, r.gst_number AS gstNumber
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       ORDER BY r.created_at DESC
//     `);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching data", error: err.message });
//   }
// });

// router.get("/notifications", async (req, res) => {
//   try {
//     const [rows] = await pool.query(`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10`);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching notifications", error: err.message });
//   }
// });

// router.put("/requisitions/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       care_center_id, equipment_id, patient_name, quantity, 
//       start_date, logout_date, deal_type, unit, mode, notify_date, 
//       delivery_address, notes, bed_number, bedNumber, referral_doctor, referralDoctor, gst_number, gstNumber 
//     } = req.body;

//     const cleanStartDate = getSafeDate(start_date);
//     const cleanLogoutDate = getSafeDate(logout_date);
//     const cleanNotifyDate = notify_date ? notify_date.toString().slice(0, 10) : null;

//     const finalBed = bed_number !== undefined ? bed_number : (bedNumber || '');
//     const finalRefDoc = referral_doctor !== undefined ? referral_doctor : (referralDoctor || '');
//     const finalGst = gst_number !== undefined ? gst_number : (gstNumber || '');

//     await pool.query(
//       `UPDATE requisitions 
//        SET care_center_id=?, equipment_id=?, patient_name=?, quantity=?, start_date=?, logout_date=?, deal_type=?, unit=?, mode=?, notify_date=?, delivery_address=?, notes=?, bed_number=?, referral_doctor=?, gst_number=?
//        WHERE id=?`,
//       [
//         care_center_id || null, equipment_id || null, patient_name || "Unknown Patient", quantity || 1, 
//         cleanStartDate, cleanLogoutDate, deal_type || "B2B", unit || "ODCOM", mode || "Postpaid", 
//         cleanNotifyDate, delivery_address || "", notes || "", finalBed, finalRefDoc, finalGst, id
//       ]
//     );

//     res.status(200).json({ message: "Requisition Updated Successfully!" });
//   } catch (err) {
//     console.error("Update Error:", err);
//     res.status(500).json({ message: "Error updating", error: err.message });
//   }
// });

// router.delete("/requisitions/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
//     res.status(200).json({ message: "Requisition Deleted Successfully!" });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     res.status(500).json({ message: "Error deleting", error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../config/database"); 

const getSafeDate = (dateStr) => {
  const today = new Date().toISOString().slice(0, 10);
  if (!dateStr || String(dateStr).trim() === "") return today;
  return dateStr.toString().slice(0, 10);
};

router.post("/requisitions", async (req, res) => {
  try {
    console.log("REQUISITION PAYLOAD:", req.body); 

    const { 
      id, care_center_id, equipment_id, patient_name, quantity, 
      start_date, logout_date, deal_type, unit, mode, notify_date, 
      delivery_address, notes, bed_number, bedNumber, referral_doctor, referralDoctor, gst_number, gstNumber,
      status, requisition_status
    } = req.body;

    const cleanStartDate = getSafeDate(start_date);
    const cleanLogoutDate = getSafeDate(logout_date);
    const cleanNotifyDate = notify_date && notify_date.trim() !== "" ? notify_date.toString().slice(0, 10) : null;
    const reqId = id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const finalBed = bed_number || bedNumber || '';
    const finalRefDoc = referral_doctor || referralDoctor || '';
    const finalGst = gst_number || gstNumber || '';
    const finalStatus = status || requisition_status || 'Active';

    await pool.query(
      `INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, deal_type, unit, mode, notify_date, delivery_address, notes, bed_number, referral_doctor, gst_number, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reqId, 
        care_center_id || "CARE-NEW", 
        equipment_id || "EQ-NEW", 
        patient_name || "Unknown Patient", 
        quantity || 1, 
        cleanStartDate, 
        cleanLogoutDate, 
        deal_type || "B2B", 
        unit || "ODCOM", 
        mode || "Postpaid", 
        cleanNotifyDate, 
        delivery_address || "", 
        notes || "",
        finalBed,
        finalRefDoc,
        finalGst,
        finalStatus
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
      SELECT r.*, c.name as careCenterName, e.name as equipmentName,
             r.bed_number AS bedNumber, r.referral_doctor AS referralDoctor, r.gst_number AS gstNumber
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

router.put("/requisitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      care_center_id, equipment_id, patient_name, quantity, 
      start_date, logout_date, deal_type, unit, mode, notify_date, 
      delivery_address, notes, bed_number, bedNumber, referral_doctor, referralDoctor, gst_number, gstNumber,
      status, requisition_status, return_status
    } = req.body;

    const cleanStartDate = getSafeDate(start_date);
    const cleanLogoutDate = getSafeDate(logout_date);
    const cleanNotifyDate = notify_date ? notify_date.toString().slice(0, 10) : null;

    const finalBed = bed_number !== undefined ? bed_number : (bedNumber || '');
    const finalRefDoc = referral_doctor !== undefined ? referral_doctor : (referralDoctor || '');
    const finalGst = gst_number !== undefined ? gst_number : (gstNumber || '');
    
    // Status update parameter
    const finalStatus = status || requisition_status || return_status || 'Active';

    await pool.query(
      `UPDATE requisitions 
       SET care_center_id=?, equipment_id=?, patient_name=?, quantity=?, start_date=?, logout_date=?, deal_type=?, unit=?, mode=?, notify_date=?, delivery_address=?, notes=?, bed_number=?, referral_doctor=?, gst_number=?, status=?
       WHERE id=?`,
      [
        care_center_id || null, equipment_id || null, patient_name || "Unknown Patient", quantity || 1, 
        cleanStartDate, cleanLogoutDate, deal_type || "B2B", unit || "ODCOM", mode || "Postpaid", 
        cleanNotifyDate, delivery_address || "", notes || "", finalBed, finalRefDoc, finalGst, finalStatus, id
      ]
    );

    res.status(200).json({ message: "Requisition Updated Successfully!" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Error updating", error: err.message });
  }
});

router.delete("/requisitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
    res.status(200).json({ message: "Requisition Deleted Successfully!" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Error deleting", error: err.message });
  }
});

module.exports = router;