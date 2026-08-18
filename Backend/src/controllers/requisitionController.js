// // // const Requisition = require("../models/Requisition");
// // // const Notification = require("../models/Notification");

// // // // Clean YYYY-MM-DD Date Formatter (Prevents 1-day shift timezone bug)
// // // const cleanDate = (dateVal) => {
// // //   if (!dateVal || dateVal === "null" || dateVal === "undefined" || String(dateVal).trim() === "") {
// // //     return null;
// // //   }
// // //   const str = String(dateVal).trim();
// // //   if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
// // //   try {
// // //     const d = new Date(dateVal);
// // //     if (isNaN(d.getTime())) return null;
// // //     const year = d.getFullYear();
// // //     const month = String(d.getMonth() + 1).padStart(2, "0");
// // //     const day = String(d.getDate()).padStart(2, "0");
// // //     return `${year}-${month}-${day}`;
// // //   } catch {
// // //     return null;
// // //   }
// // // };

// // // // Auto-align Status, Dates & Commercials (Fixes 0 charges bug)
// // // const sanitizeRequisitionData = (data) => {
// // //   const startDate = cleanDate(data.start_date || data.startDate) || new Date().toISOString().split("T")[0];
// // //   const logoutDate = cleanDate(data.logout_date || data.logoutDate);
// // //   const notifyDate = cleanDate(data.notify_date || data.notifyDate);

// // //   // Logout date hone par hi Closed hoga, warna strictly Active
// // //   const status = logoutDate ? "Closed" : "Active";

// // //   // 🔒 Explicit number parsing for commercial fields so they never become 0 or blank
// // //   const rentalCharge = Number(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge) || 0;
// // //   const depositAdvance = Number(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance) || 0;
// // //   const installationCharge = Number(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge) || 0;
// // //   const billingType = data.billing_type || data.billingType || "Daily";

// // //   return {
// // //     ...data,
// // //     start_date: startDate,
// // //     startDate: startDate,
// // //     logout_date: logoutDate,
// // //     logoutDate: logoutDate,
// // //     notify_date: notifyDate,
// // //     notifyDate: notifyDate,
// // //     status: status,
// // //     requisition_status: status,
// // //     quantity: Number(data.quantity) > 0 ? Number(data.quantity) : 1,
// // //     // 🔒 Sync both camelCase & snake_case for backend model
// // //     billing_type: billingType,
// // //     billingType: billingType,
// // //     rental_charge: rentalCharge,
// // //     rentalCharge: rentalCharge,
// // //     deposit_advance: depositAdvance,
// // //     depositAdvance: depositAdvance,
// // //     installation_charge: installationCharge,
// // //     installationCharge: installationCharge
// // //   };
// // // };

// // // // 1. GET ALL REQUISITIONS
// // // const getRequisitions = async (req, res) => {
// // //   try {
// // //     const rows = await Requisition.getAll();
// // //     res.status(200).json(rows);
// // //   } catch (error) { 
// // //     console.error("Fetch Requisitions Error:", error);
// // //     res.status(500).json({ message: "Server error while fetching requisitions", error: error.message }); 
// // //   }
// // // };

// // // // 2. CREATE REQUISITION
// // // const createRequisition = async (req, res) => {
// // //   try {
// // //     const sanitizedData = sanitizeRequisitionData(req.body);
// // //     const reqId = await Requisition.create(sanitizedData);

// // //     const patientName = sanitizedData.patient_name || sanitizedData.patientName || "Patient";
// // //     const equipName = sanitizedData.equipmentName || sanitizedData.equipment_id || "Medical Equipment";
// // //     const careCenterId = sanitizedData.care_center_id || sanitizedData.careCenterId || null;
// // //     const careCenterName = sanitizedData.care_center_name || sanitizedData.careCenterName || "Care Center";

// // //     try {
// // //       if (Notification && typeof Notification.create === "function") {
// // //         await Notification.create(
// // //           "success",
// // //           `New Requisition: ${patientName}`,
// // //           `Allocation created for ${equipName} (Patient: ${patientName}) by ${careCenterName}.`,
// // //           careCenterId
// // //         );
// // //       }
// // //     } catch (notifErr) {
// // //       console.warn("Notification insert warning:", notifErr.message);
// // //     }

// // //     res.status(201).json({ message: "Requisition created successfully!", id: reqId, status: sanitizedData.status });
// // //   } catch (error) {
// // //     console.error("Create Requisition Error:", error);
// // //     res.status(400).json({ message: error.sqlMessage || error.message || "Failed to create requisition" });
// // //   }
// // // };

// // // // 3. UPDATE REQUISITION
// // // const updateRequisition = async (req, res) => {
// // //   const { id } = req.params;
// // //   try {
// // //     const sanitizedData = sanitizeRequisitionData(req.body);
// // //     await Requisition.update(id, sanitizedData); 

// // //     const patientName = sanitizedData.patient_name || sanitizedData.patientName || "Patient";
// // //     const careCenterId = sanitizedData.care_center_id || sanitizedData.careCenterId || null;
// // //     const status = sanitizedData.status;

// // //     try {
// // //       if (Notification && typeof Notification.create === "function") {
// // //         await Notification.create(
// // //           status === "Closed" ? "warning" : "info",
// // //           `Requisition ${status}: ${patientName}`,
// // //           `Requisition ${id} for ${patientName} is now ${status}.`,
// // //           careCenterId
// // //         );
// // //       }
// // //     } catch (notifErr) {
// // //       console.warn("Notification update warning:", notifErr.message);
// // //     }

// // //     res.status(200).json({ message: "Requisition updated successfully!", status });
// // //   } catch (error) {
// // //     console.error("Update Requisition Error:", error);
// // //     res.status(400).json({ message: error.sqlMessage || error.message || "Failed to update requisition" });
// // //   }
// // // };

// // // // 4. DELETE REQUISITION
// // // const deleteRequisition = async (req, res) => {
// // //   const { id } = req.params;
// // //   try {
// // //     await Requisition.delete(id); 

// // //     try {
// // //       if (Notification && typeof Notification.create === "function") {
// // //         await Notification.create(
// // //           "warning", 
// // //           "Requisition Deleted", 
// // //           `Requisition ${id} was removed from the system.`,
// // //           null
// // //         );
// // //       }
// // //     } catch (notifErr) {
// // //       console.warn("Notification delete warning:", notifErr.message);
// // //     }

// // //     res.status(200).json({ message: "Requisition deleted successfully!" });
// // //   } catch (error) {
// // //     console.error("Delete Requisition Error:", error);
// // //     res.status(500).json({ message: "Server error while deleting requisition", error: error.message });
// // //   }
// // // };

// // // // 5. GET NOTIFICATIONS
// // // const getNotifications = async (req, res) => {
// // //   try {
// // //     const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id || null;
// // //     const role = req.query.role || req.user?.role || null;

// // //     let data = [];
// // //     if (Notification && typeof Notification.getAll === "function") {
// // //       data = await Notification.getAll(careCenterId, role);
// // //     }
// // //     res.status(200).json(data);
// // //   } catch (error) {
// // //     console.error("Get Notifications Error:", error);
// // //     res.status(500).json({ message: error.message });
// // //   }
// // // };

// // // module.exports = { 
// // //   getRequisitions, 
// // //   createRequisition, 
// // //   updateRequisition, 
// // //   deleteRequisition, 
// // //   getNotifications 
// // // };

// // const Requisition = require("../models/Requisition");
// // const Notification = require("../models/Notification");

// // const getRequisitions = async (req, res) => {
// //   try {
// //     const rows = await Requisition.getAll();
// //     return res.status(200).json(rows);
// //   } catch (error) { 
// //     console.error("Fetch Requisitions Error:", error);
// //     return res.status(500).json({ message: "Server error while fetching requisitions", error: error.message }); 
// //   }
// // };

// // const createRequisition = async (req, res) => {
// //   try {
// //     const reqId = await Requisition.create(req.body);
// //     const patientName = req.body.patient_name || req.body.patientName || "Patient";
// //     const careCenterId = req.body.care_center_id || req.body.careCenterId || null;

// //     try {
// //       if (Notification && typeof Notification.create === "function") {
// //         await Notification.create(
// //           "success",
// //           `New Requisition: ${patientName}`,
// //           `Requisition created for ${patientName}`,
// //           careCenterId
// //         );
// //       }
// //     } catch (notifErr) {}

// //     return res.status(201).json({ message: "Requisition created successfully!", id: reqId });
// //   } catch (error) {
// //     console.error("Create Requisition Error:", error);
// //     return res.status(400).json({ message: error.sqlMessage || error.message || "Failed to create requisition" });
// //   }
// // };

// // const updateRequisition = async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     await Requisition.update(id, req.body);

// //     const patientName = req.body.patient_name || req.body.patientName || "Patient";
// //     const careCenterId = req.body.care_center_id || req.body.careCenterId || null;
// //     const status = (req.body.logout_date || req.body.logoutDate) ? "Closed" : "Active";

// //     try {
// //       if (Notification && typeof Notification.create === "function") {
// //         await Notification.create(
// //           status === "Closed" ? "warning" : "info",
// //           `Requisition ${status}: ${patientName}`,
// //           `Requisition ${id} for ${patientName} is now ${status}.`,
// //           careCenterId
// //         );
// //       }
// //     } catch (notifErr) {}

// //     return res.status(200).json({ message: "Requisition updated successfully!" });
// //   } catch (error) {
// //     console.error("Update Requisition Error:", error);
// //     return res.status(400).json({ message: error.sqlMessage || error.message || "Failed to update requisition" });
// //   }
// // };

// // const deleteRequisition = async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     await Requisition.delete(id);
// //     return res.status(200).json({ message: "Requisition deleted successfully!" });
// //   } catch (error) {
// //     return res.status(500).json({ message: error.message });
// //   }
// // };

// // const getNotifications = async (req, res) => {
// //   try {
// //     const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id || null;
// //     const role = req.query.role || req.user?.role || null;
// //     let data = [];
// //     if (Notification && typeof Notification.getAll === "function") {
// //       data = await Notification.getAll(careCenterId, role);
// //     }
// //     return res.status(200).json(data);
// //   } catch (error) {
// //     return res.status(500).json({ message: error.message });
// //   }
// // };

// // // 🛠️ One-Click Database Schema Fix
// // const fixDatabaseSchema = async (req, res) => {
// //   const queries = [
// //     "ALTER TABLE requisitions ADD COLUMN billing_type VARCHAR(50) DEFAULT 'Daily'",
// //     "ALTER TABLE requisitions ADD COLUMN rental_charge DECIMAL(10,2) DEFAULT 0.00",
// //     "ALTER TABLE requisitions ADD COLUMN deposit_advance DECIMAL(10,2) DEFAULT 0.00",
// //     "ALTER TABLE requisitions ADD COLUMN installation_charge DECIMAL(10,2) DEFAULT 0.00",
// //     "ALTER TABLE requisitions ADD COLUMN attendant_name VARCHAR(255) DEFAULT ''",
// //     "ALTER TABLE requisitions ADD COLUMN mobile_number VARCHAR(50) DEFAULT ''",
// //     "ALTER TABLE requisitions ADD COLUMN alt_mobile_number VARCHAR(50) DEFAULT ''",
// //     "ALTER TABLE requisitions ADD COLUMN incharge_mobile VARCHAR(50) DEFAULT ''",
// //     "ALTER TABLE requisitions ADD COLUMN alt_mobile VARCHAR(50) DEFAULT ''",
// //     "ALTER TABLE requisitions ADD COLUMN gst_number VARCHAR(100) DEFAULT ''",
// //     "ALTER TABLE requisitions ADD COLUMN record_date DATE NULL",
// //     "ALTER TABLE requisitions ADD COLUMN recall_date DATE NULL",
// //     "ALTER TABLE requisitions ADD COLUMN notify_date DATE NULL"
// //   ];

// //   const results = [];
// //   for (const q of queries) {
// //     try {
// //       await pool.query(q);
// //       results.push({ query: q, status: "SUCCESS" });
// //     } catch (err) {
// //       results.push({ query: q, status: err.message.includes("Duplicate") ? "ALREADY_EXISTS" : err.message });
// //     }
// //   }

// //   res.status(200).json({ message: "Database schema updated successfully!", details: results });
// // };

// // module.exports = {
// //   getRequisitions,
// //   createRequisition,
// //   updateRequisition,
// //   deleteRequisition,
// //   getNotifications,
// //   fixDatabaseSchema 
// // };

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

// // 2. CREATE REQUISITION (Direct Full Insert)
// const createRequisition = async (req, res) => {
//   const data = req.body;
//   console.log("👉 [CREATE REQUISITION PAYLOAD]:", data);

//   try {
//     const reqId = cleanStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = cleanDate(data.start_date || data.startDate) || today;
//     const logoutDate = cleanDate(data.logout_date || data.logoutDate);
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
//       cleanStr(data.patient_name || data.patientName, "Unknown"),
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
//       cleanStr(data.attendant_name || data.attendantName),
//       cleanStr(data.mobile_number || data.mobileNumber || data.mobile),
//       cleanStr(data.alt_mobile_number || data.altMobileNumber),
//       cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
//       cleanStr(data.alt_mobile || data.altMobile),
//       cleanStr(data.care_address || data.careAddress),
//       cleanDate(data.record_date || data.recordDate) || startDate,
//       cleanDate(data.recall_date || data.recallDate)
//     ];

//     await pool.query(sql, values);
//     return res.status(201).json({ message: "Requisition created successfully!", id: reqId });
//   } catch (error) {
//     console.error("Create Error:", error);
//     return res.status(500).json({ message: error.sqlMessage || error.message });
//   }
// };

// // PUT: Update Requisition (CommonJS Format - No Syntax Error)
// const updateRequisition = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const d = req.body || {};

//     const query = `
//       UPDATE requisitions SET 
//         care_center_id = ?,
//         equipment_id = ?,
//         patient_name = ?,
//         start_date = ?,
//         logout_date = ?,
//         deal_type = ?,
//         unit = ?,
//         mode = ?,
//         payment_type = ?,
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
//         delivery_address = ?,
//         bed_number = ?,
//         referral_doctor = ?,
//         gst_number = ?,
//         accessory = ?,
//         notes = ?,
//         status = ?
//       WHERE id = ?
//     `;

//     const values = [
//       d.care_center_id || d.careCenterId || null,
//       d.equipment_id || d.equipmentId || null,
//       String(d.patient_name || d.patientName || "").trim(),
//       d.start_date || d.startDate || null,
//       d.logout_date || d.logoutDate || null,
//       d.deal_type || d.dealType || "B2B",
//       d.unit || "ODCOM",
//       d.mode || d.payment_type || "Postpaid",
//       d.payment_type || d.mode || "Postpaid",
//       d.billing_type || d.billingType || "Daily",
//       parseFloat(d.rental_charge ?? d.rentalCharge ?? d.rent ?? 0) || 0,
//       parseFloat(d.deposit_advance ?? d.depositAdvance ?? d.deposit ?? 0) || 0,
//       parseFloat(d.installation_charge ?? d.installationCharge ?? 0) || 0,
//       String(d.age || "").trim(),
//       String(d.attendant_name || d.attendantName || "").trim(),
//       String(d.mobile_number || d.mobileNumber || d.mobile || "").trim(),
//       String(d.alt_mobile_number || d.altMobileNumber || "").trim(),
//       String(d.incharge_mobile || d.inchargeMobile || "").trim(),
//       String(d.alt_mobile || d.altMobile || "").trim(),
//       String(d.care_address || d.careAddress || "").trim(),
//       String(d.delivery_address || d.deliveryAddress || "").trim(),
//       String(d.bed_number || d.bedNumber || d.bedNo || "").trim(),
//       String(d.referral_doctor || d.referralDoctor || "").trim(),
//       String(d.gst_number || d.gstNumber || "").trim(),
//       String(d.accessory || d.accessories || "").trim(),
//       String(d.notes || "").trim(),
//       d.status || "Active",
//       id
//     ];

//     await pool.query(query, values);
//     return res.status(200).json({ message: "Requisition updated successfully!" });
//   } catch (error) {
//     console.error("Update Requisition Error:", error);
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
// const getNotifications = async (req, res) => {
//   try {
//     return res.status(200).json([]);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getRequisitions,
//   createRequisition,
//   updateRequisition,
//   deleteRequisition,
//   getNotifications
// };

const pool = require("../config/database");

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
  console.log("👉 [CREATE REQUISITION PAYLOAD]:", data);

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
      cleanStr(data.patient_name || data.patientName || data.patient, "Unknown"),
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
    try {
      if (Notification && typeof Notification.create === "function") {
        await Notification.create(
          "CREATED",
          `New Requisition: ${patientName}`,
          `New requisition #${reqId} logged for ${patientName} (${equipmentName}).`,
          careCenterId
        );
      }
    } catch (notifErr) {
      console.warn("Notification create warning:", notifErr.message);
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
  console.log("👉 [UPDATE REQUISITION PAYLOAD for ID:", targetId, "]:", data);

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
      cleanStr(data.patient_name || data.patientName || data.patient, "Unknown"),
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

    const [result] = await pool.query(query, values);
    console.log("👉 [UPDATE RESULT]: Affected rows =", result.affectedRows);
   try {
  const patient = cleanStr(data.patient_name || data.patientName || "Patient");
  const notifTitle = `Requisition Updated: ${patient}`;
  const notifMsg = `Requisition #${targetId} for ${patient} updated. Status: ${finalStatus}.`;

  try {
    await pool.query(
      "INSERT INTO notifications (type, title, message, care_center_id, created_at) VALUES (?, ?, ?, ?, NOW())",
      ["UPDATED", notifTitle, notifMsg, careCenterId || null]
    );
  } catch {
    await pool.query(
      "INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)",
      ["UPDATED", notifTitle, notifMsg]
    );
  }
  console.log(" Update Notification successfully written to DB for ID:", targetId);
} catch (notifErr) {
  console.error("Notification DB Insert Failed:", notifErr.message);
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
    return res.status(200).json({ message: "Requisition deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. NOTIFICATIONS
// const getNotifications = async (req, res) => {
//   try {
//     return res.status(200).json([]);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const getNotifications = async (req, res) => {
  try {
    const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id || null;
    const role = req.query.role || req.user?.role || null;
    
    let data = [];
    if (Notification && typeof Notification.getAll === "function") {
      data = await Notification.getAll(careCenterId, role);
    } else {
      const [rows] = await pool.query("SELECT * FROM notifications ORDER BY id DESC LIMIT 30");
      data = rows;
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    if (typeof id === "string" && id.startsWith("REMINDER_")) {
      return res.status(200).json({ message: "Reminder dismissed successfully!" });
    }

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