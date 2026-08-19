// const express = require("express");
// const router = express.Router();
// const pool = require("../config/database");
// const Notification = require("../models/Notification");


// const getSafeDate = (val) => {
//   if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") {
//     return null;
//   }
//   if (val instanceof Date) {
//     if (isNaN(val.getTime())) return null;
//     const y = val.getFullYear();
//     const m = String(val.getMonth() + 1).padStart(2, "0");
//     const d = String(val.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   }
//   const str = String(val).trim();
//   if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
//     return str.slice(0, 10);
//   }
//   const parsed = new Date(str);
//   if (!isNaN(parsed.getTime())) {
//     const y = parsed.getFullYear();
//     const m = String(parsed.getMonth() + 1).padStart(2, "0");
//     const d = String(parsed.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   }
//   return null;
// };
// const getSafeNum = (v1, v2) => {
//   const val = (v1 !== undefined && v1 !== null && v1 !== "") ? v1 : v2;
//   if (val === null || val === undefined || val === "") return 0;
//   const n = parseFloat(val);
//   return isNaN(n) ? 0 : n;
// };

// const getSafeStr = (val, fallback = "") => {
//   if (val === null || val === undefined) return fallback;
//   return String(val).trim();
// };

// const cleanFk = (val) => {
//   if (!val || val === "" || val === "null" || val === "undefined" || val === "NEW" || val === "other" || val === "CC-ME") return null;
//   return String(val).trim();
// };

// // 🟢 1. GET ALL REQUISITIONS


// router.get("/requisitions", async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT r.*, 
//              c.name AS careCenterName, 
//              e.name AS equipmentName
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       ORDER BY r.created_at DESC
//     `);

//     const data = rows.map((r) => {
//       const start = getSafeDate(r.start_date);
//       const end = getSafeDate(r.logout_date);

//       // Calculate Total Days
//       let totalDays = 0;
//       if (start) {
//         const s = new Date(start);
//         const e = end ? new Date(end) : new Date();
//         const diffTime = e.getTime() - s.getTime();
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         totalDays = diffDays >= 0 ? diffDays + 1 : 1;
//       }

//       return {
//         ...r,
//         billingType: r.billing_type || "Daily",
//         billing_type: r.billing_type || "Daily",
//         rentalCharge: getSafeNum(r.rental_charge),
//         rental_charge: getSafeNum(r.rental_charge),
//         depositAdvance: getSafeNum(r.deposit_advance),
//         deposit_advance: getSafeNum(r.deposit_advance),
//         installationCharge: getSafeNum(r.installation_charge),
//         installation_charge: getSafeNum(r.installation_charge),
//         patientName: r.patient_name || "",
//         patient_name: r.patient_name || "",
//         attendantName: r.attendant_name || "",
//         attendant_name: r.attendant_name || "",
//         mobileNumber: r.mobile_number || "",
//         mobile_number: r.mobile_number || "",
//         altMobileNumber: r.alt_mobile_number || "",
//         alt_mobile_number: r.alt_mobile_number || "",
//         inchargeMobile: r.incharge_mobile || "",
//         incharge_mobile: r.incharge_mobile || "",
//         altMobile: r.alt_mobile || "",
//         alt_mobile: r.alt_mobile || "",
//         careAddress: r.care_address || "",
//         care_address: r.care_address || "",
//         bedNumber: r.bed_number || "",
//         bed_number: r.bed_number || "",
//         bedNo: r.bed_number || "",
//         referralDoctor: r.referral_doctor || "",
//         referral_doctor: r.referral_doctor || "",

//         //  All Date Keys & Aliases
//         startDate: start,
//         start_date: start,
//         loginDate: start,
//         login_date: start,

//         logoutDate: end,
//         logout_date: end,
//         endDate: end,
//         end_date: end,

//         recordDate: getSafeDate(r.record_date),
//         record_date: getSafeDate(r.record_date),
//         recallDate: getSafeDate(r.recall_date),
//         recall_date: getSafeDate(r.recall_date),
//         notifyDate: getSafeDate(r.notify_date),
//         notify_date: getSafeDate(r.notify_date),

//         // 🔢 Total Days
//         totalDays: totalDays,
//         total_days: totalDays
//       };
//     });

//     res.json(data);
//   } catch (err) {
//     console.error("Fetch Error:", err);
//     res.status(500).json({ message: "Error fetching data", error: err.message });
//   }
// });

// // 🔵 2. CREATE REQUISITION (All 33 Columns)
// router.post("/requisitions", async (req, res) => {
//   try {
//     const d = req.body || {};
//     const reqId = getSafeStr(d.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = getSafeDate(d.start_date || d.startDate || d.login_date || d.loginDate) || today;
//     const logoutDate = getSafeDate(d.logout_date || d.logoutDate || d.end_date);
//     const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

//     let accValue = d.accessories || d.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const careCenterId = cleanFk(d.care_center_id || d.careCenterId);
//     const equipmentId = cleanFk(d.equipment_id || d.equipmentId || d.deviceModel);
//     const billingType = String(d.billing_type || d.billingType || "Daily").trim();
//     const rentalCharge = getSafeNum(d.rental_charge, d.rentalCharge || d.rent || d.daily_rate);
//     const depositAdvance = getSafeNum(d.deposit_advance, d.depositAdvance || d.deposit || d.advance);
//     const installationCharge = getSafeNum(d.installation_charge, d.installationCharge || d.installation);

//     const sql = `
//       INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       reqId,
//       careCenterId,
//       equipmentId,
//       getSafeStr(d.patient_name || d.patientName || d.patient, "Unknown Patient"),
//       Math.max(1, getSafeNum(d.quantity) || 1),
//       startDate,
//       logoutDate,
//       finalStatus,
//       getSafeStr(d.delivery_status || d.deliveryStatus, "Pending Dispatch"),
//       getSafeStr(d.payment_type || d.paymentType || d.mode, "Postpaid"),
//       getSafeStr(d.deal_type || d.dealType, "B2B"),
//       getSafeStr(d.unit, "ODCOM"),
//       getSafeStr(d.mode || d.paymentType, "Postpaid"),
//       getSafeDate(d.notify_date || d.notifyDate),
//       getSafeStr(d.delivery_address || d.deliveryAddress),
//       getSafeStr(d.notes),
//       getSafeStr(accValue),
//       getSafeStr(d.referral_doctor || d.referralDoctor || d.referral),
//       getSafeStr(d.bed_number || d.bedNo || d.bedNumber),
//       getSafeStr(d.gst_number || d.gstNo || d.gstNumber),
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
//       getSafeStr(d.age),
//       getSafeStr(d.attendant_name || d.attendantName || d.attendant),
//       getSafeStr(d.mobile_number || d.mobileNumber || d.mobile || d.phone),
//       getSafeStr(d.alt_mobile_number || d.altMobileNumber),
//       getSafeStr(d.incharge_mobile || d.inchargeMobile || d.phone),
//       getSafeStr(d.alt_mobile || d.altMobile),
//       getSafeStr(d.care_address || d.careAddress),
//       getSafeDate(d.record_date || d.recordDate) || startDate,
//       getSafeDate(d.recall_date || d.recallDate)
//     ];

//     await pool.query(sql, values);
//     try {
//       await Notification.create(
//         "CREATED",
//         "New Requisition Added",
//         `New requisition #${reqId} logged for patient ${patientName} (${equipmentName}).`,
//         careCenterId
//       );
//     } catch (notifErr) {
//       console.error("Failed to generate create notification:", notifErr.message);
//     }
//     res.status(201).json({ message: "Requisition Created Successfully!", id: reqId });
//   } catch (err) {
//     console.error("Create Error:", err);
//     res.status(500).json({ message: "Server error while saving", error: err.message });
//   }
// });

// // 🟡 3. UPDATE REQUISITION (All 33 Columns)
// router.put("/requisitions/:id", async (req, res) => {
//   try {
//     const targetId = getSafeStr(req.params.id) || getSafeStr(req.body.id);
//     const d = req.body || {};

//     if (!targetId) {
//       return res.status(400).json({ message: "Requisition ID is required." });
//     }

//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = getSafeDate(d.start_date || d.startDate || d.login_date || d.loginDate) || today;
//     const logoutDate = getSafeDate(d.logout_date || d.logoutDate || d.end_date);
//     const finalStatus = getSafeStr(d.status) || ((logoutDate && logoutDate <= today) ? "Closed" : "Active");

//     let accValue = d.accessories || d.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const careCenterId = cleanFk(d.care_center_id || d.careCenterId);
//     const equipmentId = cleanFk(d.equipment_id || d.equipmentId || d.deviceModel);
//     const billingType = String(d.billing_type || d.billingType || "Daily").trim();
//     const rentalCharge = getSafeNum(d.rental_charge, d.rentalCharge || d.rent || d.daily_rate);
//     const depositAdvance = getSafeNum(d.deposit_advance, d.depositAdvance || d.deposit || d.advance);
//     const installationCharge = getSafeNum(d.installation_charge, d.installationCharge || d.installation);

//     const query = `
//       UPDATE requisitions SET 
//         care_center_id = ?,
//         equipment_id = ?,
//         patient_name = ?,
//         quantity = ?,
//         start_date = ?,
//         logout_date = ?,
//         status = ?,
//         delivery_status = ?,
//         payment_type = ?,
//         deal_type = ?,
//         unit = ?,
//         mode = ?,
//         notify_date = ?,
//         delivery_address = ?,
//         notes = ?,
//         accessory = ?,
//         referral_doctor = ?,
//         bed_number = ?,
//         gst_number = ?,
//         billing_type = ?,
//         rental_charge = ?,
//         deposit_advance = ?,
//         installation_charge = ?,
//         age = ?,
//         attendant_name = ?,
//         mobile_number = ?,
//         alt_mobile_number = ?,
//         incharge_mobile = ?,
//         alt_mobile = ?,
//         care_address = ?,
//         record_date = ?,
//         recall_date = ?
//       WHERE id = ?
//     `;

//     const values = [
//       careCenterId,
//       equipmentId,
//       getSafeStr(d.patient_name || d.patientName || d.patient, "Unknown Patient"),
//       Math.max(1, getSafeNum(d.quantity) || 1),
//       startDate,
//       logoutDate,
//       finalStatus,
//       getSafeStr(d.delivery_status || d.deliveryStatus, "Pending Dispatch"),
//       getSafeStr(d.payment_type || d.paymentType || d.mode, "Postpaid"),
//       getSafeStr(d.deal_type || d.dealType, "B2B"),
//       getSafeStr(d.unit, "ODCOM"),
//       getSafeStr(d.mode || d.paymentType, "Postpaid"),
//       getSafeDate(d.notify_date || d.notifyDate),
//       getSafeStr(d.delivery_address || d.deliveryAddress),
//       getSafeStr(d.notes),
//       getSafeStr(accValue),
//       getSafeStr(d.referral_doctor || d.referralDoctor || d.referral),
//       getSafeStr(d.bed_number || d.bedNo || d.bedNumber),
//       getSafeStr(d.gst_number || d.gstNo || d.gstNumber),
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
//       getSafeStr(d.age),
//       getSafeStr(d.attendant_name || d.attendantName || d.attendant),
//       getSafeStr(d.mobile_number || d.mobileNumber || d.mobile || d.phone),
//       getSafeStr(d.alt_mobile_number || d.altMobileNumber),
//       getSafeStr(d.incharge_mobile || d.inchargeMobile || d.phone),
//       getSafeStr(d.alt_mobile || d.altMobile),
//       getSafeStr(d.care_address || d.careAddress),
//       getSafeDate(d.record_date || d.recordDate) || startDate,
//       getSafeDate(d.recall_date || d.recallDate),
//       targetId
//     ];

//     await pool.query(query, values);
//     res.status(200).json({ message: "Requisition Updated Successfully!" });
//   } catch (err) {
//     console.error("Update Error:", err);
//     res.status(500).json({ message: "Error updating", error: err.message });
//   }
// });

// // 🔴 4. DELETE REQUISITION
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


// // 1. GET All Notifications + Live Due Date Reminders
// router.get("/notifications", async (req, res) => {
//   try {
//     const careCenterId = req.query.careCenterId || req.user?.careCenterId || null;
//     const role = req.query.role || req.user?.role || null;

//     const data = await Notification.getAll(careCenterId, role);
//     return res.status(200).json(data);
//   } catch (err) {
//     console.error("Route Error /notifications:", err.message);
//     return res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
//   }
// });

// router.put("/notifications/:id/read", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const success = await Notification.markAsRead(id);
//     return res.status(200).json({ success });
//   } catch (err) {
//     console.error("Route Error /notifications/read:", err.message);
//     return res.status(500).json({ message: "Failed to update notification", error: err.message });
//   }
// });

// // 2. DELETE Notification by ID
// router.delete("/notifications/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (typeof id === "string" && id.startsWith("REMINDER_")) {
//       return res.status(200).json({ message: "Reminder dismissed successfully!" });
//     }

//     await pool.query(`DELETE FROM notifications WHERE id = ?`, [id]);
//     res.status(200).json({ message: "Notification Deleted Successfully!" });
//   } catch (err) {
//     console.error("Error deleting notification:", err.message);
//     res.status(500).json({ message: "Error deleting notification", error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../config/database");

const getSafeDate = (val) => {
  if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") {
    return null;
  }
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return null;
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

    const data = rows.map((r) => {
      const start = getSafeDate(r.start_date);
      const end = getSafeDate(r.logout_date);

      // Calculate Total Days
      let totalDays = 0;
      if (start) {
        const s = new Date(start);
        const e = end ? new Date(end) : new Date();
        const diffTime = e.getTime() - s.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays = diffDays >= 0 ? diffDays + 1 : 1;
      }

      return {
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

        // All Date Keys & Aliases
        startDate: start,
        start_date: start,
        loginDate: start,
        login_date: start,

        logoutDate: end,
        logout_date: end,
        endDate: end,
        end_date: end,

        recordDate: getSafeDate(r.record_date),
        record_date: getSafeDate(r.record_date),
        recallDate: getSafeDate(r.recall_date),
        recall_date: getSafeDate(r.recall_date),
        notifyDate: getSafeDate(r.notify_date),
        notify_date: getSafeDate(r.notify_date),

        // 🔢 Total Days
        totalDays: totalDays,
        total_days: totalDays
      };
    });

    res.json(data);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
});

// 🔵 2. CREATE REQUISITION (All 33 Columns + Notification)
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
    const patientName = getSafeStr(d.patient_name || d.patientName || d.patient, "Patient");
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
      patientName,
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

    // 🔔 Real-time DB Notification Insert (CREATE)
    try {
      await pool.query(
        "INSERT INTO notifications (type, title, message, care_center_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())",
        [
          "CREATED",
          `New Requisition: ${patientName}`,
          `New requisition #${reqId} logged for ${patientName}. Status: ${finalStatus}.`,
          careCenterId || null
        ]
      );
    } catch (notifErr) {
      console.error("Notification Create Error:", notifErr.message);
    }

    res.status(201).json({ message: "Requisition Created Successfully!", id: reqId });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Server error while saving", error: err.message });
  }
});

// 🟡 3. UPDATE REQUISITION (All 33 Columns + Notification)
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
    const patientName = getSafeStr(d.patient_name || d.patientName || d.patient, "Patient");
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
      patientName,
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

    // 🔔 Real-time DB Notification Insert (UPDATE)
    try {
      await pool.query(
        "INSERT INTO notifications (type, title, message, care_center_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())",
        [
          "UPDATED",
          `Requisition Updated: ${patientName}`,
          `Requisition #${targetId} for ${patientName} updated. Status: ${finalStatus}.`,
          careCenterId || null
        ]
      );
    } catch (notifErr) {
      console.error("Notification Update Error:", notifErr.message);
    }

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

    try {
      await pool.query(
        "INSERT INTO notifications (type, title, message, care_center_id, is_read, created_at) VALUES (?, ?, ?, NULL, 0, NOW())",
        [
          "DELETED",
          `Requisition Deleted: #${id}`,
          `Requisition #${id} was deleted from the system.`
        ]
      );
    } catch (notifErr) {
      console.error("Notification Delete Error:", notifErr.message);
    }

    res.status(200).json({ message: "Requisition Deleted Successfully!" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Error deleting", error: err.message });
  }
});

// 🔔 5. GET NOTIFICATIONS
router.get("/notifications", async (req, res) => {
  try {
    const careCenterId = req.query.careCenterId || null;
    const role = req.query.role || null;
    const isAdmin = role === "super_admin" || role === "admin" || !careCenterId || careCenterId === "All";

    let query = "SELECT * FROM notifications";
    const params = [];

    if (!isAdmin && !isNaN(parseInt(careCenterId))) {
      query += " WHERE (care_center_id = ? OR care_center_id IS NULL)";
      params.push(parseInt(careCenterId));
    }

    query += " ORDER BY created_at DESC, id DESC LIMIT 50";

    const [rows] = await pool.query(query, params);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Route Error /notifications:", err.message);
    return res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
});

// 🔔 6. MARK AS READ
router.put("/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Route Error /notifications/read:", err.message);
    return res.status(500).json({ message: "Failed to update notification", error: err.message });
  }
});

// 🔔 7. DELETE NOTIFICATION
router.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM notifications WHERE id = ?`, [id]);
    res.status(200).json({ message: "Notification Deleted Successfully!" });
  } catch (err) {
    console.error("Error deleting notification:", err.message);
    res.status(500).json({ message: "Error deleting notification", error: err.message });
  }
});

module.exports = router;