// const express = require("express");
// const router = express.Router();
// const pool = require("../config/database");

// // Mandatory Start Date (defaults to today if empty)
// const getSafeDate = (dateStr) => {
//   if (!dateStr || String(dateStr).trim() === "") {
//     return new Date().toISOString().slice(0, 10);
//   }
//   return dateStr.toString().slice(0, 10);
// };

// const getSafeOptionalDate = (dateStr) => {
//   if (!dateStr || String(dateStr).trim() === "" || dateStr === "null" || dateStr === "undefined") {
//     return null;
//   }
//   return dateStr.toString().slice(0, 10);
// };

// router.post("/requisitions", async (req, res) => {
//   try {
//     const { 
//       id, care_center_id, equipment_id, patient_name, quantity, 
//       start_date, startDate, login_date, loginDate,
//       logout_date, logoutDate, 
//       deal_type, dealType, 
//       unit, mode, 
//       notify_date, notifyDate, 
//       delivery_address, deliveryAddress, 
//       notes, 
//       bed_number, bedNumber, 
//       referral_doctor, referralDoctor, 
//       gst_number, gstNumber,
//       status, requisition_status, 
//       accessory, accessories 
//     } = req.body;

//     const cleanStartDate = getSafeDate(start_date || startDate || login_date || loginDate);
//     const cleanLogoutDate = getSafeOptionalDate(logout_date || logoutDate); // 👈 Optional (NULL if not provided)
//     const cleanNotifyDate = getSafeOptionalDate(notify_date || notifyDate);
//     const reqId = id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

//     const finalBed = bed_number || bedNumber || "";
//     const finalRefDoc = referral_doctor || referralDoctor || "";
//     const finalGst = gst_number || gstNumber || "";
    
//     let finalStatus = status || requisition_status || (cleanLogoutDate ? "Closed" : "Active");
//     if (String(finalStatus).toLowerCase() === "returned") finalStatus = "Closed";

//     const finalAccessory = Array.isArray(accessory || accessories)
//       ? (accessory || accessories).join(", ")
//       : (accessory || accessories || "");

//     await pool.query(
//       `INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, deal_type, unit, mode, notify_date, delivery_address, notes, bed_number, referral_doctor, gst_number, status, accessory) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         reqId, 
//         care_center_id || "CARE-NEW", 
//         equipment_id || "EQ-NEW", 
//         patient_name || "Unknown Patient", 
//         quantity || 1, 
//         cleanStartDate, 
//         cleanLogoutDate, 
//         deal_type || dealType || "B2B", 
//         unit || "ODCOM", 
//         mode || "Postpaid", 
//         cleanNotifyDate, 
//         delivery_address || deliveryAddress || "", 
//         notes || "",
//         finalBed,
//         finalRefDoc,
//         finalGst,
//         finalStatus,
//         finalAccessory 
//       ]
//     );

//     if (mode === "Prepaid" && cleanNotifyDate) {
//       const notifMessage = `Prepaid payment reminder for Patient: ${patient_name || "Unknown"}. Notify Date: ${cleanNotifyDate}`;
//       await pool.query(
//         `INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)`,
//         ["Action Required: Prepaid Alert", notifMessage, "warning"]
//       );
//     }

//     res.status(201).json({ message: "Requisition Created Successfully!", id: reqId });
//   } catch (err) {
//     console.error("DETAILED SERVER ERROR:", err); 
//     res.status(500).json({ message: "Server error while saving", error: err.message });
//   }
// });

// router.get("/requisitions", async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT r.*, 
//              c.name AS careCenterName, 
//              e.name AS equipmentName,
//              r.bed_number AS bedNumber, 
//              r.referral_doctor AS referralDoctor, 
//              r.gst_number AS gstNumber
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
//       care_center_id, careCenterId,
//       equipment_id, equipmentId,
//       patient_name, patientName,
//       quantity, 
//       start_date, startDate, login_date, loginDate,
//       logout_date, logoutDate, 
//       deal_type, dealType, 
//       unit, mode, 
//       notify_date, notifyDate, 
//       delivery_address, deliveryAddress, 
//       notes, 
//       bed_number, bedNumber, 
//       referral_doctor, referralDoctor, 
//       gst_number, gstNumber,
//       status, requisition_status, return_status,
//       accessory, accessories
//     } = req.body;

//     const cleanStartDate = getSafeDate(start_date || startDate || login_date || loginDate);
//     const cleanLogoutDate = getSafeOptionalDate(logout_date || logoutDate); // 👈 Optional
//     const cleanNotifyDate = getSafeOptionalDate(notify_date || notifyDate);

//     const finalBed = bed_number !== undefined ? bed_number : (bedNumber || "");
//     const finalRefDoc = referral_doctor !== undefined ? referral_doctor : (referralDoctor || "");
//     const finalGst = gst_number !== undefined ? gst_number : (gstNumber || "");
    
//     let finalStatus = status || requisition_status || return_status || "Active";
//     if (String(finalStatus).toLowerCase() === "returned") finalStatus = "Closed";

//     const finalAccessory = Array.isArray(accessory || accessories)
//       ? (accessory || accessories).join(", ")
//       : (accessory || accessories || "");

//     await pool.query(
//       `UPDATE requisitions 
//        SET care_center_id=?, equipment_id=?, patient_name=?, quantity=?, 
//            start_date=?, logout_date=?, deal_type=?, unit=?, mode=?, 
//            notify_date=?, delivery_address=?, notes=?, bed_number=?, 
//            referral_doctor=?, gst_number=?, status=?, accessory=?
//        WHERE id=?`,
//       [
//         care_center_id || careCenterId || null, 
//         equipment_id || equipmentId || null, 
//         patient_name || patientName || "Unknown Patient", 
//         quantity || 1, 
//         cleanStartDate, 
//         cleanLogoutDate, 
//         deal_type || dealType || "B2B", 
//         unit || "ODCOM", 
//         mode || "Postpaid", 
//         cleanNotifyDate, 
//         delivery_address || deliveryAddress || "", 
//         notes || "", 
//         finalBed, 
//         finalRefDoc, 
//         finalGst, 
//         finalStatus, 
//         finalAccessory, 
//         id
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

// router.delete("/notifications/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query(`DELETE FROM notifications WHERE id = ?`, [id]);
//     res.status(200).json({ message: "Notification Deleted Successfully!" });
//   } catch (err) {
//     console.error("Delete Notification Error:", err);
//     res.status(500).json({ message: "Error deleting notification", error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../config/database");

const getSafeDate = (dateStr) => {
  if (!dateStr || String(dateStr).trim() === "" || dateStr === "null" || dateStr === "undefined" || dateStr === "0000-00-00") {
    return null;
  }
  const str = String(dateStr).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
};

const getSafeNum = (v1, v2) => {
  const val = (v1 !== undefined && v1 !== null && v1 !== "") ? v1 : v2;
  if (val === null || val === undefined || val === "") return 0;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const getSafeStr = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  return String(val).trim();
};

const cleanFk = (val) => {
  if (!val || val === "" || val === "null" || val === "undefined" || val === "NEW" || val === "other" || val === "CC-ME") return null;
  return String(val).trim();
};

// 🟢 1. GET ALL REQUISITIONS
router.get("/requisitions", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, 
             c.name AS careCenterName, 
             e.name AS equipmentName
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `);

    const data = rows.map((r) => ({
      ...r,
      billingType: r.billing_type || "Daily",
      billing_type: r.billing_type || "Daily",
      rentalCharge: getSafeNum(r.rental_charge),
      rental_charge: getSafeNum(r.rental_charge),
      depositAdvance: getSafeNum(r.deposit_advance),
      deposit_advance: getSafeNum(r.deposit_advance),
      installationCharge: getSafeNum(r.installation_charge),
      installation_charge: getSafeNum(r.installation_charge),
      patientName: r.patient_name || "",
      patient_name: r.patient_name || "",
      attendantName: r.attendant_name || "",
      attendant_name: r.attendant_name || "",
      mobileNumber: r.mobile_number || "",
      mobile_number: r.mobile_number || "",
      altMobileNumber: r.alt_mobile_number || "",
      alt_mobile_number: r.alt_mobile_number || "",
      inchargeMobile: r.incharge_mobile || "",
      incharge_mobile: r.incharge_mobile || "",
      altMobile: r.alt_mobile || "",
      alt_mobile: r.alt_mobile || "",
      careAddress: r.care_address || "",
      care_address: r.care_address || "",
      bedNumber: r.bed_number || "",
      bed_number: r.bed_number || "",
      bedNo: r.bed_number || "",
      referralDoctor: r.referral_doctor || "",
      referral_doctor: r.referral_doctor || "",
      startDate: getSafeDate(r.start_date),
      start_date: getSafeDate(r.start_date),
      logoutDate: getSafeDate(r.logout_date),
      logout_date: getSafeDate(r.logout_date),
      recordDate: getSafeDate(r.record_date),
      record_date: getSafeDate(r.record_date),
      recallDate: getSafeDate(r.recall_date),
      recall_date: getSafeDate(r.recall_date),
      notifyDate: getSafeDate(r.notify_date),
      notify_date: getSafeDate(r.notify_date)
    }));

    res.json(data);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
});

// 🔵 2. CREATE REQUISITION (All 33 Columns)
router.post("/requisitions", async (req, res) => {
  try {
    const d = req.body || {};
    const reqId = getSafeStr(d.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);
    const startDate = getSafeDate(d.start_date || d.startDate || d.login_date || d.loginDate) || today;
    const logoutDate = getSafeDate(d.logout_date || d.logoutDate || d.end_date);
    const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

    let accValue = d.accessories || d.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const careCenterId = cleanFk(d.care_center_id || d.careCenterId);
    const equipmentId = cleanFk(d.equipment_id || d.equipmentId || d.deviceModel);
    const billingType = String(d.billing_type || d.billingType || "Daily").trim();
    const rentalCharge = getSafeNum(d.rental_charge, d.rentalCharge || d.rent || d.daily_rate);
    const depositAdvance = getSafeNum(d.deposit_advance, d.depositAdvance || d.deposit || d.advance);
    const installationCharge = getSafeNum(d.installation_charge, d.installationCharge || d.installation);

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      careCenterId,
      equipmentId,
      getSafeStr(d.patient_name || d.patientName || d.patient, "Unknown Patient"),
      Math.max(1, getSafeNum(d.quantity) || 1),
      startDate,
      logoutDate,
      finalStatus,
      getSafeStr(d.delivery_status || d.deliveryStatus, "Pending Dispatch"),
      getSafeStr(d.payment_type || d.paymentType || d.mode, "Postpaid"),
      getSafeStr(d.deal_type || d.dealType, "B2B"),
      getSafeStr(d.unit, "ODCOM"),
      getSafeStr(d.mode || d.paymentType, "Postpaid"),
      getSafeDate(d.notify_date || d.notifyDate),
      getSafeStr(d.delivery_address || d.deliveryAddress),
      getSafeStr(d.notes),
      getSafeStr(accValue),
      getSafeStr(d.referral_doctor || d.referralDoctor || d.referral),
      getSafeStr(d.bed_number || d.bedNo || d.bedNumber),
      getSafeStr(d.gst_number || d.gstNo || d.gstNumber),
      billingType,
      rentalCharge,
      depositAdvance,
      installationCharge,
      getSafeStr(d.age),
      getSafeStr(d.attendant_name || d.attendantName || d.attendant),
      getSafeStr(d.mobile_number || d.mobileNumber || d.mobile || d.phone),
      getSafeStr(d.alt_mobile_number || d.altMobileNumber),
      getSafeStr(d.incharge_mobile || d.inchargeMobile || d.phone),
      getSafeStr(d.alt_mobile || d.altMobile),
      getSafeStr(d.care_address || d.careAddress),
      getSafeDate(d.record_date || d.recordDate) || startDate,
      getSafeDate(d.recall_date || d.recallDate)
    ];

    await pool.query(sql, values);
    res.status(201).json({ message: "Requisition Created Successfully!", id: reqId });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Server error while saving", error: err.message });
  }
});

// 🟡 3. UPDATE REQUISITION (All 33 Columns)
router.put("/requisitions/:id", async (req, res) => {
  try {
    const targetId = getSafeStr(req.params.id) || getSafeStr(req.body.id);
    const d = req.body || {};

    if (!targetId) {
      return res.status(400).json({ message: "Requisition ID is required." });
    }

    const today = new Date().toISOString().slice(0, 10);
    const startDate = getSafeDate(d.start_date || d.startDate || d.login_date || d.loginDate) || today;
    const logoutDate = getSafeDate(d.logout_date || d.logoutDate || d.end_date);
    const finalStatus = getSafeStr(d.status) || ((logoutDate && logoutDate <= today) ? "Closed" : "Active");

    let accValue = d.accessories || d.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const careCenterId = cleanFk(d.care_center_id || d.careCenterId);
    const equipmentId = cleanFk(d.equipment_id || d.equipmentId || d.deviceModel);
    const billingType = String(d.billing_type || d.billingType || "Daily").trim();
    const rentalCharge = getSafeNum(d.rental_charge, d.rentalCharge || d.rent || d.daily_rate);
    const depositAdvance = getSafeNum(d.deposit_advance, d.depositAdvance || d.deposit || d.advance);
    const installationCharge = getSafeNum(d.installation_charge, d.installationCharge || d.installation);

    const query = `
      UPDATE requisitions SET 
        care_center_id = ?,
        equipment_id = ?,
        patient_name = ?,
        quantity = ?,
        start_date = ?,
        logout_date = ?,
        status = ?,
        delivery_status = ?,
        payment_type = ?,
        deal_type = ?,
        unit = ?,
        mode = ?,
        notify_date = ?,
        delivery_address = ?,
        notes = ?,
        accessory = ?,
        referral_doctor = ?,
        bed_number = ?,
        gst_number = ?,
        billing_type = ?,
        rental_charge = ?,
        deposit_advance = ?,
        installation_charge = ?,
        age = ?,
        attendant_name = ?,
        mobile_number = ?,
        alt_mobile_number = ?,
        incharge_mobile = ?,
        alt_mobile = ?,
        care_address = ?,
        record_date = ?,
        recall_date = ?
      WHERE id = ?
    `;

    const values = [
      careCenterId,
      equipmentId,
      getSafeStr(d.patient_name || d.patientName || d.patient, "Unknown Patient"),
      Math.max(1, getSafeNum(d.quantity) || 1),
      startDate,
      logoutDate,
      finalStatus,
      getSafeStr(d.delivery_status || d.deliveryStatus, "Pending Dispatch"),
      getSafeStr(d.payment_type || d.paymentType || d.mode, "Postpaid"),
      getSafeStr(d.deal_type || d.dealType, "B2B"),
      getSafeStr(d.unit, "ODCOM"),
      getSafeStr(d.mode || d.paymentType, "Postpaid"),
      getSafeDate(d.notify_date || d.notifyDate),
      getSafeStr(d.delivery_address || d.deliveryAddress),
      getSafeStr(d.notes),
      getSafeStr(accValue),
      getSafeStr(d.referral_doctor || d.referralDoctor || d.referral),
      getSafeStr(d.bed_number || d.bedNo || d.bedNumber),
      getSafeStr(d.gst_number || d.gstNo || d.gstNumber),
      billingType,
      rentalCharge,
      depositAdvance,
      installationCharge,
      getSafeStr(d.age),
      getSafeStr(d.attendant_name || d.attendantName || d.attendant),
      getSafeStr(d.mobile_number || d.mobileNumber || d.mobile || d.phone),
      getSafeStr(d.alt_mobile_number || d.altMobileNumber),
      getSafeStr(d.incharge_mobile || d.inchargeMobile || d.phone),
      getSafeStr(d.alt_mobile || d.altMobile),
      getSafeStr(d.care_address || d.careAddress),
      getSafeDate(d.record_date || d.recordDate) || startDate,
      getSafeDate(d.recall_date || d.recallDate),
      targetId
    ];

    await pool.query(query, values);
    res.status(200).json({ message: "Requisition Updated Successfully!" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Error updating", error: err.message });
  }
});

// 🔴 4. DELETE REQUISITION
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

// 🟣 5. NOTIFICATIONS
router.get("/notifications", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

router.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM notifications WHERE id = ?`, [id]);
    res.status(200).json({ message: "Notification Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notification", error: err.message });
  }
});

module.exports = router;