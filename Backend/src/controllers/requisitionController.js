// const pool = require("../config/database");


// const cleanDate = (val) => {
//   if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") return null;
//   const str = String(val).trim().slice(0, 10);
//   return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
// };

// const cleanNum = (v1, v2) => {
//   const val = (v1 !== undefined && v1 !== null && v1 !== "") ? v1 : v2;
//   if (val === null || val === undefined || val === "") return 0;
//   const n = parseFloat(val);
//   return isNaN(n) ? 0 : n;
// };

// const cleanStr = (val, fallback = "") => {
//   if (val === null || val === undefined) return fallback;
//   return String(val).trim();
// };

// const cleanFk = (val) => {
//   if (!val || val === "" || val === "null" || val === "undefined" || val === "NEW" || val === "other" || val === "CC-ME") return null;
//   return String(val).trim();
// };

// // 1. GET ALL REQUISITIONS
// const getRequisitions = async (req, res) => {
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
    
//     const data = rows.map((r) => ({
//       ...r,
//       billingType: r.billing_type || "Daily",
//       billing_type: r.billing_type || "Daily",
//       rentalCharge: cleanNum(r.rental_charge),
//       rental_charge: cleanNum(r.rental_charge),
//       depositAdvance: cleanNum(r.deposit_advance),
//       deposit_advance: cleanNum(r.deposit_advance),
//       installationCharge: cleanNum(r.installation_charge),
//       installation_charge: cleanNum(r.installation_charge),
//       patientName: r.patient_name || "",
//       patient_name: r.patient_name || "",
//       attendantName: r.attendant_name || "",
//       attendant_name: r.attendant_name || "",
//       mobileNumber: r.mobile_number || "",
//       mobile_number: r.mobile_number || "",
//       altMobileNumber: r.alt_mobile_number || "",
//       alt_mobile_number: r.alt_mobile_number || "",
//       inchargeMobile: r.incharge_mobile || "",
//       incharge_mobile: r.incharge_mobile || "",
//       altMobile: r.alt_mobile || "",
//       alt_mobile: r.alt_mobile || "",
//       careAddress: r.care_address || "",
//       care_address: r.care_address || "",
//       bedNumber: r.bed_number || "",
//       bed_number: r.bed_number || "",
//       bedNo: r.bed_number || "",
//       referralDoctor: r.referral_doctor || "",
//       referral_doctor: r.referral_doctor || "",
//       startDate: cleanDate(r.start_date),
//       start_date: cleanDate(r.start_date),
//       logoutDate: cleanDate(r.logout_date),
//       logout_date: cleanDate(r.logout_date),
//       recordDate: cleanDate(r.record_date),
//       record_date: cleanDate(r.record_date),
//       recallDate: cleanDate(r.recall_date),
//       recall_date: cleanDate(r.recall_date),
//       notifyDate: cleanDate(r.notify_date),
//       notify_date: cleanDate(r.notify_date)
//     }));

//     return res.status(200).json(data);
//   } catch (error) {
//     console.error("Fetch Error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// // 2. CREATE REQUISITION
// const createRequisition = async (req, res) => {
//   const data = req.body || {};
//   console.log("👉 [CREATE REQUISITION PAYLOAD]:", data);

//   try {
//     const reqId = cleanStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = cleanDate(data.start_date || data.startDate || data.login_date || data.loginDate) || today;
//     const logoutDate = cleanDate(data.logout_date || data.logoutDate || data.end_date);
//     const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const careCenterId = cleanFk(data.care_center_id || data.careCenterId);
//     const equipmentId = cleanFk(data.equipment_id || data.equipmentId || data.deviceModel);
//     const billingType = String(data.billing_type || data.billingType || "Daily").trim();
//     const rentalCharge = cleanNum(data.rental_charge, data.rentalCharge);
//     const depositAdvance = cleanNum(data.deposit_advance, data.depositAdvance);
//     const installationCharge = cleanNum(data.installation_charge, data.installationCharge);

//     const sql = `
//       INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       reqId,
//       careCenterId,
//       equipmentId,
//       cleanStr(data.patient_name || data.patientName || data.patient, "Unknown"),
//       Math.max(1, cleanNum(data.quantity) || 1),
//       startDate,
//       logoutDate,
//       finalStatus,
//       cleanStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"),
//       cleanStr(data.payment_type || data.paymentType || data.mode, "Postpaid"),
//       cleanStr(data.deal_type || data.dealType, "B2B"),
//       cleanStr(data.unit, "ODCOM"),
//       cleanStr(data.mode || data.paymentType, "Postpaid"),
//       cleanDate(data.notify_date || data.notifyDate),
//       cleanStr(data.delivery_address || data.deliveryAddress),
//       cleanStr(data.notes),
//       cleanStr(accValue),
//       cleanStr(data.referral_doctor || data.referralDoctor || data.referral),
//       cleanStr(data.bed_number || data.bedNo),
//       cleanStr(data.gst_number || data.gstNo),
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
//       cleanStr(data.age),
//       cleanStr(data.attendant_name || data.attendantName || data.attendant),
//       cleanStr(data.mobile_number || data.mobileNumber || data.mobile || data.phone),
//       cleanStr(data.alt_mobile_number || data.altMobileNumber),
//       cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
//       cleanStr(data.alt_mobile || data.altMobile),
//       cleanStr(data.care_address || data.careAddress),
//       cleanDate(data.record_date || data.recordDate) || startDate,
//       cleanDate(data.recall_date || data.recallDate)
//     ];

//     await pool.query(sql, values);
//     try {
//       if (Notification && typeof Notification.create === "function") {
//         await Notification.create(
//           "CREATED",
//           `New Requisition: ${patientName}`,
//           `New requisition #${reqId} logged for ${patientName} (${equipmentName}).`,
//           careCenterId
//         );
//       }
//     } catch (notifErr) {
//       console.warn("Notification create warning:", notifErr.message);
//     }
//     return res.status(201).json({ message: "Requisition created successfully!", id: reqId });
//   } catch (error) {
//     console.error("Create Error:", error);
//     return res.status(500).json({ message: error.sqlMessage || error.message });
//   }
// };

// // 3. UPDATE REQUISITION 
// const updateRequisition = async (req, res) => {
//   console.log("🔥🔥🔥 MAIN UPDATE FUNCTION KE ANDAR AA GAYA HU! 🔥🔥🔥");
//   const data = req.body || {};
//   const targetId = cleanStr(req.params.id) || cleanStr(data.id);
//   console.log("👉 [UPDATE REQUISITION PAYLOAD for ID:", targetId, "]:", data);

//   if (!targetId) {
//     return res.status(400).json({ message: "Requisition ID is required for update." });
//   }

//   try {
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = cleanDate(data.start_date || data.startDate || data.login_date || data.loginDate) || today;
//     const logoutDate = cleanDate(data.logout_date || data.logoutDate || data.end_date);
//     const finalStatus = cleanStr(data.status) || ((logoutDate && logoutDate <= today) ? "Closed" : "Active");

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const careCenterId = cleanFk(data.care_center_id || data.careCenterId);
//     const equipmentId = cleanFk(data.equipment_id || data.equipmentId || data.deviceModel);
//     const billingType = String(data.billing_type || data.billingType || "Daily").trim();
//     const rentalCharge = cleanNum(data.rental_charge, data.rentalCharge);
//     const depositAdvance = cleanNum(data.deposit_advance, data.depositAdvance);
//     const installationCharge = cleanNum(data.installation_charge, data.installationCharge);

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
//       cleanStr(data.patient_name || data.patientName || data.patient, "Unknown"),
//       Math.max(1, cleanNum(data.quantity) || 1),
//       startDate,
//       logoutDate,
//       finalStatus,
//       cleanStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"),
//       cleanStr(data.payment_type || data.paymentType || data.mode, "Postpaid"),
//       cleanStr(data.deal_type || data.dealType, "B2B"),
//       cleanStr(data.unit, "ODCOM"),
//       cleanStr(data.mode || data.paymentType, "Postpaid"),
//       cleanDate(data.notify_date || data.notifyDate),
//       cleanStr(data.delivery_address || data.deliveryAddress),
//       cleanStr(data.notes),
//       cleanStr(accValue),
//       cleanStr(data.referral_doctor || data.referralDoctor || data.referral),
//       cleanStr(data.bed_number || data.bedNo),
//       cleanStr(data.gst_number || data.gstNo),
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
//       cleanStr(data.age),
//       cleanStr(data.attendant_name || data.attendantName || data.attendant),
//       cleanStr(data.mobile_number || data.mobileNumber || data.mobile || data.phone),
//       cleanStr(data.alt_mobile_number || data.altMobileNumber),
//       cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
//       cleanStr(data.alt_mobile || data.altMobile),
//       cleanStr(data.care_address || data.careAddress),
//       cleanDate(data.record_date || data.recordDate) || startDate,
//       cleanDate(data.recall_date || data.recallDate),
//       targetId
//     ];

//     const [result] = await pool.query(query, values);
//     console.log("👉 [UPDATE RESULT]: Affected rows =", result.affectedRows);

//     try {
//       const safeCareCenterId = (careCenterId && careCenterId !== "other") ? careCenterId : null;
      
//       await pool.query(
//         "INSERT INTO notifications (type, title, message, care_center_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())",
//         [
//           "UPDATED",
//           `Requisition Updated: ${patientNameVal}`,
//           `Requisition #${targetId} for ${patientNameVal} updated. Status: ${finalStatus}.`,
//           safeCareCenterId
//         ]
//       );
//       console.log("🔥 100% SUCCESS: Notification database me save ho gayi!");
//     } catch (notifErr) {
//       console.error("🚨 ASLI ERROR YEH HAI ->", notifErr.message);
//     }

//     return res.status(200).json({ 
//       message: "Requisition updated successfully!", 
//       id: targetId 
//     });
//   } catch (error) {
//     console.error("Update Error:", error);
//     return res.status(500).json({ message: error.sqlMessage || error.message });
//   }
// };

// // 4. DELETE REQUISITION
// const deleteRequisition = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query("DELETE FROM requisitions WHERE id = ?", [id]);
//     return res.status(200).json({ message: "Requisition deleted successfully!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // 5. NOTIFICATIONS
// // 5. GET NOTIFICATIONS ()
// const getNotifications = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50");
//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error("Get Notifications Error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// const deleteNotification = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (typeof id === "string" && id.startsWith("REMINDER_")) {
//       return res.status(200).json({ message: "Reminder dismissed successfully!" });
//     }

//     await pool.query("DELETE FROM notifications WHERE id = ?", [id]);
//     return res.status(200).json({ message: "Notification deleted successfully!" });
//   } catch (error) {
//     console.error("Delete Notification Error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getRequisitions,
//   createRequisition,
//   updateRequisition,
//   deleteRequisition,
//   getNotifications,
//   deleteNotification
// };

const pool = require("../config/database");
const Notification = require("../models/Notification");

//  Timezone-safe date helper
const cleanDate = (val) => {
  if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") return null;
  const str = String(val).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
};

const cleanNum = (v1, v2) => {
  const val = (v1 !== undefined && v1 !== null && v1 !== "") ? v1 : v2;
  if (val === null || val === undefined || val === "") return 0;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const cleanStr = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  return String(val).trim();
};

const cleanFk = (val) => {
  if (!val || val === "" || val === "null" || val === "undefined" || val === "NEW" || val === "other" || val === "CC-ME") return null;
  return String(val).trim();
};

// 1. GET ALL REQUISITIONS
const getRequisitions = async (req, res) => {
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
      rentalCharge: cleanNum(r.rental_charge),
      rental_charge: cleanNum(r.rental_charge),
      depositAdvance: cleanNum(r.deposit_advance),
      deposit_advance: cleanNum(r.deposit_advance),
      installationCharge: cleanNum(r.installation_charge),
      installation_charge: cleanNum(r.installation_charge),
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
      startDate: cleanDate(r.start_date),
      start_date: cleanDate(r.start_date),
      logoutDate: cleanDate(r.logout_date),
      logout_date: cleanDate(r.logout_date),
      recordDate: cleanDate(r.record_date),
      record_date: cleanDate(r.record_date),
      recallDate: cleanDate(r.recall_date),
      recall_date: cleanDate(r.recall_date),
      notifyDate: cleanDate(r.notify_date),
      notify_date: cleanDate(r.notify_date)
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 2. CREATE REQUISITION
const createRequisition = async (req, res) => {
  const data = req.body || {};

  try {
    const reqId = cleanStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);
    const startDate = cleanDate(data.start_date || data.startDate || data.login_date || data.loginDate) || today;
    const logoutDate = cleanDate(data.logout_date || data.logoutDate || data.end_date);
    const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const careCenterId = cleanFk(data.care_center_id || data.careCenterId);
    const equipmentId = cleanFk(data.equipment_id || data.equipmentId || data.deviceModel);
    const patientName = cleanStr(data.patient_name || data.patientName || data.patient, "Patient");
    const billingType = String(data.billing_type || data.billingType || "Daily").trim();
    const rentalCharge = cleanNum(data.rental_charge, data.rentalCharge);
    const depositAdvance = cleanNum(data.deposit_advance, data.depositAdvance);
    const installationCharge = cleanNum(data.installation_charge, data.installationCharge);

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
      Math.max(1, cleanNum(data.quantity) || 1),
      startDate,
      logoutDate,
      finalStatus,
      cleanStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"),
      cleanStr(data.payment_type || data.paymentType || data.mode, "Postpaid"),
      cleanStr(data.deal_type || data.dealType, "B2B"),
      cleanStr(data.unit, "ODCOM"),
      cleanStr(data.mode || data.paymentType, "Postpaid"),
      cleanDate(data.notify_date || data.notifyDate),
      cleanStr(data.delivery_address || data.deliveryAddress),
      cleanStr(data.notes),
      cleanStr(accValue),
      cleanStr(data.referral_doctor || data.referralDoctor || data.referral),
      cleanStr(data.bed_number || data.bedNo),
      cleanStr(data.gst_number || data.gstNo),
      billingType,
      rentalCharge,
      depositAdvance,
      installationCharge,
      cleanStr(data.age),
      cleanStr(data.attendant_name || data.attendantName || data.attendant),
      cleanStr(data.mobile_number || data.mobileNumber || data.mobile || data.phone),
      cleanStr(data.alt_mobile_number || data.altMobileNumber),
      cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
      cleanStr(data.alt_mobile || data.altMobile),
      cleanStr(data.care_address || data.careAddress),
      cleanDate(data.record_date || data.recordDate) || startDate,
      cleanDate(data.recall_date || data.recallDate)
    ];

    await pool.query(sql, values);

    //  STEP 4 TRIGGER: Notification Create
  try {
      await pool.query(
        "INSERT INTO notifications (type, title, message, care_center_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())",
        [
          "CREATED",
          `New Requisition: ${patientName}`,
          `New requisition #${reqId} logged for ${patientName}.`,
          careCenterId || null
        ]
      );
      console.log("🔔 Notification Inserted for New Requisition:", reqId);
    } catch (err) {
      console.error("❌ Notif Insert Error:", err.message);
    }

    return res.status(201).json({ message: "Requisition created successfully!", id: reqId });
  } catch (error) {
    console.error("Create Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

// 3. UPDATE REQUISITION 
const updateRequisition = async (req, res) => {
  const data = req.body || {};
  const targetId = cleanStr(req.params.id) || cleanStr(data.id);

  if (!targetId) {
    return res.status(400).json({ message: "Requisition ID is required for update." });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const startDate = cleanDate(data.start_date || data.startDate || data.login_date || data.loginDate) || today;
    const logoutDate = cleanDate(data.logout_date || data.logoutDate || data.end_date);
    const finalStatus = cleanStr(data.status) || ((logoutDate && logoutDate <= today) ? "Closed" : "Active");

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const careCenterId = cleanFk(data.care_center_id || data.careCenterId);
    const equipmentId = cleanFk(data.equipment_id || data.equipmentId || data.deviceModel);
    const patientName = cleanStr(data.patient_name || data.patientName || data.patient, "Patient");
    const billingType = String(data.billing_type || data.billingType || "Daily").trim();
    const rentalCharge = cleanNum(data.rental_charge, data.rentalCharge);
    const depositAdvance = cleanNum(data.deposit_advance, data.depositAdvance);
    const installationCharge = cleanNum(data.installation_charge, data.installationCharge);

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
      Math.max(1, cleanNum(data.quantity) || 1),
      startDate,
      logoutDate,
      finalStatus,
      cleanStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"),
      cleanStr(data.payment_type || data.paymentType || data.mode, "Postpaid"),
      cleanStr(data.deal_type || data.dealType, "B2B"),
      cleanStr(data.unit, "ODCOM"),
      cleanStr(data.mode || data.paymentType, "Postpaid"),
      cleanDate(data.notify_date || data.notifyDate),
      cleanStr(data.delivery_address || data.deliveryAddress),
      cleanStr(data.notes),
      cleanStr(accValue),
      cleanStr(data.referral_doctor || data.referralDoctor || data.referral),
      cleanStr(data.bed_number || data.bedNo),
      cleanStr(data.gst_number || data.gstNo),
      billingType,
      rentalCharge,
      depositAdvance,
      installationCharge,
      cleanStr(data.age),
      cleanStr(data.attendant_name || data.attendantName || data.attendant),
      cleanStr(data.mobile_number || data.mobileNumber || data.mobile || data.phone),
      cleanStr(data.alt_mobile_number || data.altMobileNumber),
      cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
      cleanStr(data.alt_mobile || data.altMobile),
      cleanStr(data.care_address || data.careAddress),
      cleanDate(data.record_date || data.recordDate) || startDate,
      cleanDate(data.recall_date || data.recallDate),
      targetId
    ];

    await pool.query(query, values);

    //  STEP 4 TRIGGER: Notification Update (Clean variable used!)
   try {
      await pool.query(
        "INSERT INTO notifications (type, title, message, care_center_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())",
        [
          "UPDATED",
          `Requisition Updated: ${patientName}`,
          `Requisition #${targetId} for ${patientName} updated to ${finalStatus}.`,
          careCenterId || null
        ]
      );
      console.log("🔔 Notification Inserted for Update:", targetId);
    } catch (err) {
      console.error("❌ Notif Update Error:", err.message);
    }

    return res.status(200).json({ 
      message: "Requisition updated successfully!", 
      id: targetId 
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

// 4. DELETE REQUISITION
const deleteRequisition = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM requisitions WHERE id = ?", [id]);
    
    //  STEP 4 TRIGGER: Notification Delete
    await Notification.create({
      type: "DELETED",
      title: `Requisition Deleted`,
      message: `Requisition #${id} was deleted.`,
      careCenterId: null
    });

    return res.status(200).json({ message: "Requisition deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. GET NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const careCenterId = req.query.careCenterId || req.user?.careCenterId || null;
    const role = req.query.role || req.user?.role || null;
    const rows = await Notification.getAll(careCenterId, role);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 6. DELETE / DISMISS NOTIFICATION
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM notifications WHERE id = ?", [id]);
    return res.status(200).json({ message: "Notification deleted successfully!" });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRequisitions,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  getNotifications,
  deleteNotification
};