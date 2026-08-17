
// // const pool = require("../config/database");

// // (async () => {
// //   try {
// //     await pool.query("ALTER TABLE requisitions MODIFY COLUMN care_center_id VARCHAR(100) NULL");
// //     await pool.query("ALTER TABLE requisitions MODIFY COLUMN equipment_id VARCHAR(100) NULL");
// //   } catch (e) {}
// // })();

// // const cleanDate = (val) => {
// //   if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") return null;
// //   const str = String(val).trim().slice(0, 10);
// //   return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
// // };

// // const cleanNum = (val) => {
// //   if (val === null || val === undefined || val === "") return 0;
// //   const n = parseFloat(val);
// //   return isNaN(n) ? 0 : n;
// // };

// // const cleanFk = (val) => {
// //   if (!val || val === "" || val === "null" || val === "undefined" || val === "NEW" || val === "other" || val === "CC-ME") return null;
// //   return String(val).trim();
// // };

// // const cleanStr = (val, fallback = "") => {
// //   if (val === null || val === undefined) return fallback;
// //   return String(val).trim();
// // };

// // class Requisition {
// //   static async getAll() {
// //     const [rows] = await pool.query(`
// //       SELECT r.*, 
// //              c.name AS careCenterName, 
// //              e.name AS equipmentName,
// //              r.bed_number AS bedNumber, 
// //              r.referral_doctor AS referralDoctor, 
// //              r.gst_number AS gstNumber,
// //              COALESCE(r.billing_type, 'Daily') AS billingType,
// //              COALESCE(r.rental_charge, 0) AS rentalCharge,
// //              COALESCE(r.deposit_advance, 0) AS depositAdvance,
// //              COALESCE(r.installation_charge, 0) AS installationCharge,
// //              r.incharge_mobile AS inchargeMobile,
// //              r.alt_mobile AS altMobile,
// //              r.attendant_name AS attendantName,
// //              r.mobile_number AS mobileNumber,
// //              r.alt_mobile_number AS altMobileNumber,
// //              r.care_address AS careAddress,
// //              r.record_date AS recordDate,
// //              r.recall_date AS recallDate,
// //              r.logout_date AS logoutDate,
// //              r.start_date AS startDate,
// //              r.patient_name AS patientName
// //       FROM requisitions r
// //       LEFT JOIN care_centers c ON r.care_center_id = c.id
// //       LEFT JOIN equipment e ON r.equipment_id = e.id
// //       ORDER BY r.created_at DESC
// //     `);
// //     return rows;
// //   }
  
// //   static async findById(id) {
// //     const [rows] = await pool.query(`
// //       SELECT r.*, 
// //              c.name AS careCenterName, 
// //              e.name AS equipmentName,
// //              r.bed_number AS bedNumber, 
// //              r.referral_doctor AS referralDoctor, 
// //              r.gst_number AS gstNumber,
// //              COALESCE(r.billing_type, 'Daily') AS billingType,
// //              COALESCE(r.rental_charge, 0) AS rentalCharge,
// //              COALESCE(r.deposit_advance, 0) AS depositAdvance,
// //              COALESCE(r.installation_charge, 0) AS installationCharge,
// //              r.incharge_mobile AS inchargeMobile,
// //              r.alt_mobile AS altMobile,
// //              r.attendant_name AS attendantName,
// //              r.mobile_number AS mobileNumber,
// //              r.alt_mobile_number AS altMobileNumber,
// //              r.care_address AS careAddress,
// //              r.record_date AS recordDate,
// //              r.recall_date AS recallDate,
// //              r.logout_date AS logoutDate,
// //              r.start_date AS startDate,
// //              r.patient_name AS patientName
// //       FROM requisitions r
// //       LEFT JOIN care_centers c ON r.care_center_id = c.id
// //       LEFT JOIN equipment e ON r.equipment_id = e.id
// //       WHERE r.id = ?
// //     `, [id]);
// //     return rows[0];
// //   }

// //   static async create(data) {
// //     const reqId = cleanStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
// //     const today = new Date().toISOString().slice(0, 10);
// //     const startDate = cleanDate(data.start_date || data.startDate) || today;
// //     const logoutDate = cleanDate(data.logout_date || data.logoutDate);
// //     const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

// //     let accValue = data.accessories || data.accessory || "";
// //     if (Array.isArray(accValue)) accValue = accValue.join(", ");

// //     const sql = `
// //       INSERT INTO requisitions 
// //       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
// //       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //     `;

// //     const values = [
// //       reqId,
// //       cleanFk(data.care_center_id || data.careCenterId),
// //       cleanFk(data.equipment_id || data.equipmentId || data.deviceModel),
// //       cleanStr(data.patient_name || data.patientName, "Unknown"),
// //       Math.max(1, cleanNum(data.quantity) || 1),
// //       startDate,
// //       logoutDate,
// //       finalStatus,
// //       cleanStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"),
// //       cleanStr(data.payment_type || data.paymentType || data.mode, "Postpaid"),
// //       cleanStr(data.deal_type || data.dealType, "B2B"),
// //       cleanStr(data.unit, "ODCOM"),
// //       cleanStr(data.mode || data.paymentType, "Postpaid"),
// //       cleanDate(data.notify_date || data.notifyDate),
// //       cleanStr(data.delivery_address || data.deliveryAddress),
// //       cleanStr(data.notes),
// //       cleanStr(accValue),
// //       cleanStr(data.referral_doctor || data.referral),
// //       cleanStr(data.bed_number || data.bedNo),
// //       cleanStr(data.gst_number || data.gstNo),
// //       cleanStr(data.billing_type || data.billingType, "Daily"),
// //       cleanNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge),
// //       cleanNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance),
// //       cleanNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge),
// //       cleanStr(data.age),
// //       cleanStr(data.attendant_name || data.attendantName),
// //       cleanStr(data.mobile_number || data.mobileNumber),
// //       cleanStr(data.alt_mobile_number || data.altMobileNumber),
// //       cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
// //       cleanStr(data.alt_mobile || data.altMobile),
// //       cleanStr(data.care_address || data.careAddress),
// //       cleanDate(data.record_date || data.recordDate) || startDate,
// //       cleanDate(data.recall_date || data.recallDate)
// //     ];

// //     await pool.query(sql, values);
// //     return reqId;
// //   }

// //   static async update(id, data) {
// //     const today = new Date().toISOString().slice(0, 10);
// //     const startDate = cleanDate(data.start_date || data.startDate) || today;
// //     const logoutDate = cleanDate(data.logout_date || data.logoutDate);
// //     let finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";
// //     if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
// //       finalStatus = "Inactive";
// //     }

// //     let accValue = data.accessories || data.accessory || "";
// //     if (Array.isArray(accValue)) accValue = accValue.join(", ");

// //     const careCenterId = cleanFk(data.care_center_id || data.careCenterId);
// //     const equipmentId = cleanFk(data.equipment_id || data.equipmentId || data.deviceModel);

// //     // 🔒 COALESCE prevents overriding with NULL when care_center_id is missing
// //     const sql = `
// //       UPDATE requisitions 
// //       SET care_center_id = COALESCE(?, care_center_id), 
// //           equipment_id = COALESCE(?, equipment_id), 
// //           patient_name = ?, 
// //           quantity = ?, 
// //           start_date = ?, 
// //           logout_date = ?, 
// //           status = ?, 
// //           delivery_status = ?, 
// //           payment_type = ?, 
// //           deal_type = ?, 
// //           unit = ?, 
// //           mode = ?, 
// //           notify_date = ?, 
// //           delivery_address = ?, 
// //           notes = ?, 
// //           accessory = ?, 
// //           referral_doctor = ?, 
// //           bed_number = ?, 
// //           gst_number = ?,
// //           billing_type = ?, 
// //           rental_charge = ?, 
// //           deposit_advance = ?, 
// //           installation_charge = ?,
// //           age = ?, 
// //           attendant_name = ?, 
// //           mobile_number = ?, 
// //           alt_mobile_number = ?,
// //           incharge_mobile = ?, 
// //           alt_mobile = ?, 
// //           care_address = ?, 
// //           record_date = ?, 
// //           recall_date = ?
// //       WHERE id = ?
// //     `;
    
// //     const values = [
// //       careCenterId, 
// //       equipmentId, 
// //       cleanStr(data.patient_name || data.patientName, "Unknown"), 
// //       Math.max(1, cleanNum(data.quantity) || 1), 
// //       startDate, 
// //       logoutDate, 
// //       finalStatus, 
// //       cleanStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"), 
// //       cleanStr(data.payment_type || data.paymentType || data.mode, "Postpaid"), 
// //       cleanStr(data.deal_type || data.dealType, "B2B"), 
// //       cleanStr(data.unit, "ODCOM"), 
// //       cleanStr(data.mode || data.paymentType, "Postpaid"), 
// //       cleanDate(data.notify_date || data.notifyDate), 
// //       cleanStr(data.delivery_address || data.deliveryAddress), 
// //       cleanStr(data.notes), 
// //       cleanStr(accValue), 
// //       cleanStr(data.referral_doctor || data.referral), 
// //       cleanStr(data.bed_number || data.bedNo), 
// //       cleanStr(data.gst_number || data.gstNo), 
// //       cleanStr(data.billing_type || data.billingType, "Daily"), 
// //       cleanNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge), 
// //       cleanNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance), 
// //       cleanNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge), 
// //       cleanStr(data.age), 
// //       cleanStr(data.attendant_name || data.attendantName), 
// //       cleanStr(data.mobile_number || data.mobileNumber), 
// //       cleanStr(data.alt_mobile_number || data.altMobileNumber), 
// //       cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone), 
// //       cleanStr(data.alt_mobile || data.altMobile), 
// //       cleanStr(data.care_address || data.careAddress), 
// //       cleanDate(data.record_date || data.recordDate), 
// //       cleanDate(data.recall_date || data.recallDate), 
// //       id 
// //     ];

// //     await pool.query(sql, values);
// //   }
  
// //   static async delete(id) {
// //     await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
// //   }
// // }

// // module.exports = Requisition;

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

// const mapRequisitionRow = (r) => ({
//   ...r,
//   id: r.id,
//   patientName: r.patient_name || "",
//   patient_name: r.patient_name || "",
//   careCenterId: r.care_center_id || null,
//   care_center_id: r.care_center_id || null,
//   careCenterName: r.careCenterName || "",
//   care_center_name: r.careCenterName || "",
//   equipmentId: r.equipment_id || null,
//   equipment_id: r.equipment_id || null,
//   equipmentName: r.equipmentName || "",
//   equipment_name: r.equipmentName || "",
//   billingType: r.billing_type || "Daily",
//   billing_type: r.billing_type || "Daily",
//   rentalCharge: cleanNum(r.rental_charge),
//   rental_charge: cleanNum(r.rental_charge),
//   depositAdvance: cleanNum(r.deposit_advance),
//   deposit_advance: cleanNum(r.deposit_advance),
//   installationCharge: cleanNum(r.installation_charge),
//   installation_charge: cleanNum(r.installation_charge),
//   startDate: cleanDate(r.start_date),
//   start_date: cleanDate(r.start_date),
//   logoutDate: cleanDate(r.logout_date),
//   logout_date: cleanDate(r.logout_date),
//   recordDate: cleanDate(r.record_date),
//   record_date: cleanDate(r.record_date),
//   recallDate: cleanDate(r.recall_date),
//   recall_date: cleanDate(r.recall_date),
//   notifyDate: cleanDate(r.notify_date),
//   notify_date: cleanDate(r.notify_date),
//   bedNumber: r.bed_number || "",
//   bed_number: r.bed_number || "",
//   bedNo: r.bed_number || "",
//   referralDoctor: r.referral_doctor || "",
//   referral_doctor: r.referral_doctor || "",
//   referral: r.referral_doctor || "",
//   gstNumber: r.gst_number || "",
//   gst_number: r.gst_number || "",
//   gstNo: r.gst_number || "",
//   inchargeMobile: r.incharge_mobile || "",
//   incharge_mobile: r.incharge_mobile || "",
//   altMobile: r.alt_mobile || "",
//   alt_mobile: r.alt_mobile || "",
//   attendantName: r.attendant_name || "",
//   attendant_name: r.attendant_name || "",
//   mobileNumber: r.mobile_number || "",
//   mobile_number: r.mobile_number || "",
//   altMobileNumber: r.alt_mobile_number || "",
//   alt_mobile_number: r.alt_mobile_number || "",
//   careAddress: r.care_address || "",
//   care_address: r.care_address || "",
//   deliveryAddress: r.delivery_address || "",
//   delivery_address: r.delivery_address || "",
//   notes: r.notes || "",
//   accessory: r.accessory || "",
//   accessories: r.accessory || "",
//   dealType: r.deal_type || "B2B",
//   deal_type: r.deal_type || "B2B",
//   unit: r.unit || "ODCOM",
//   mode: r.mode || r.payment_type || "Postpaid",
//   paymentType: r.payment_type || r.mode || "Postpaid",
//   payment_type: r.payment_type || r.mode || "Postpaid",
//   deliveryStatus: r.delivery_status || "Pending Dispatch",
//   delivery_status: r.delivery_status || "Pending Dispatch",
//   status: r.status,
//   age: r.age || ""
// });

// class Requisition {
//   static async getAll() {
//     const [rows] = await pool.query(`
//       SELECT r.*, 
//              c.name AS careCenterName, 
//              e.name AS equipmentName
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       ORDER BY r.created_at DESC
//     `);
//     return rows.map(mapRequisitionRow);
//   }
  
//   static async findById(id) {
//     const [rows] = await pool.query(`
//       SELECT r.*, 
//              c.name AS careCenterName, 
//              e.name AS equipmentName
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       WHERE r.id = ?
//     `, [id]);
//     if (!rows[0]) return null;
//     return mapRequisitionRow(rows[0]);
//   }

//   static async create(data) {
//     const reqId = cleanStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = cleanDate(data.start_date || data.startDate) || today;
//     const logoutDate = cleanDate(data.logout_date || data.logoutDate);
//     const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const sql = `
//       INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       reqId,
//       cleanFk(data.care_center_id || data.careCenterId),
//       cleanFk(data.equipment_id || data.equipmentId || data.deviceModel),
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
//       cleanStr(data.billing_type || data.billingType, "Daily"),
//       cleanNum(data.rental_charge, data.rentalCharge),
//       cleanNum(data.deposit_advance, data.depositAdvance),
//       cleanNum(data.installation_charge, data.installationCharge),
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
//     return reqId;
//   }

//   static async update(id, data) {
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = cleanDate(data.start_date || data.startDate) || today;
//     const logoutDate = cleanDate(data.logout_date || data.logoutDate);
//     let finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";
//     if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
//       finalStatus = "Inactive";
//     }

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const careCenterId = cleanFk(data.care_center_id || data.careCenterId);
//     const equipmentId = cleanFk(data.equipment_id || data.equipmentId || data.deviceModel);

//     const sql = `
//       UPDATE requisitions 
//       SET care_center_id = COALESCE(?, care_center_id), 
//           equipment_id = COALESCE(?, equipment_id), 
//           patient_name = ?, 
//           quantity = ?, 
//           start_date = ?, 
//           logout_date = ?, 
//           status = ?, 
//           delivery_status = ?, 
//           payment_type = ?, 
//           deal_type = ?, 
//           unit = ?, 
//           mode = ?, 
//           notify_date = ?, 
//           delivery_address = ?, 
//           notes = ?, 
//           accessory = ?, 
//           referral_doctor = ?, 
//           bed_number = ?, 
//           gst_number = ?, 
//           billing_type = ?, 
//           rental_charge = ?, 
//           deposit_advance = ?, 
//           installation_charge = ?, 
//           age = ?, 
//           attendant_name = ?, 
//           mobile_number = ?, 
//           alt_mobile_number = ?, 
//           incharge_mobile = ?, 
//           alt_mobile = ?, 
//           care_address = ?, 
//           record_date = ?, 
//           recall_date = ?
//       WHERE id = ?
//     `;
    
//     const values = [
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
//       cleanStr(data.billing_type || data.billingType, "Daily"), 
//       cleanNum(data.rental_charge, data.rentalCharge), 
//       cleanNum(data.deposit_advance, data.depositAdvance), 
//       cleanNum(data.installation_charge, data.installationCharge), 
//       cleanStr(data.age), 
//       cleanStr(data.attendant_name || data.attendantName), 
//       cleanStr(data.mobile_number || data.mobileNumber || data.mobile), 
//       cleanStr(data.alt_mobile_number || data.altMobileNumber), 
//       cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone), 
//       cleanStr(data.alt_mobile || data.altMobile), 
//       cleanStr(data.care_address || data.careAddress), 
//       cleanDate(data.record_date || data.recordDate), 
//       cleanDate(data.recall_date || data.recallDate), 
//       id 
//     ];

//     await pool.query(sql, values);
//   }
  
//   static async delete(id) {
//     await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
//   }
// }

// module.exports = Requisition;

const pool = require("../config/database");

// 🚀 Automatic Database Schema Migration (Adds missing columns automatically)
const ensureColumns = async () => {
  const missingCols = [
    { name: "billing_type", def: "VARCHAR(50) DEFAULT 'Daily'" },
    { name: "rental_charge", def: "DECIMAL(10,2) DEFAULT 0.00" },
    { name: "deposit_advance", def: "DECIMAL(10,2) DEFAULT 0.00" },
    { name: "installation_charge", def: "DECIMAL(10,2) DEFAULT 0.00" },
    { name: "attendant_name", def: "VARCHAR(255) DEFAULT ''" },
    { name: "mobile_number", def: "VARCHAR(50) DEFAULT ''" },
    { name: "alt_mobile_number", def: "VARCHAR(50) DEFAULT ''" },
    { name: "incharge_mobile", def: "VARCHAR(50) DEFAULT ''" },
    { name: "alt_mobile", def: "VARCHAR(50) DEFAULT ''" },
    { name: "gst_number", def: "VARCHAR(100) DEFAULT ''" },
    { name: "record_date", def: "DATE NULL" },
    { name: "recall_date", def: "DATE NULL" },
    { name: "notify_date", def: "DATE NULL" },
    { name: "care_address", def: "TEXT NULL" },
    { name: "delivery_address", def: "TEXT NULL" },
    { name: "bed_number", def: "VARCHAR(50) DEFAULT ''" },
    { name: "referral_doctor", def: "VARCHAR(255) DEFAULT ''" },
    { name: "age", def: "VARCHAR(20) DEFAULT ''" },
    { name: "notes", def: "TEXT NULL" },
    { name: "accessory", def: "TEXT NULL" }
  ];

  try {
    const [cols] = await pool.query("SHOW COLUMNS FROM `requisitions`");
    const existing = cols.map((c) => c.Field.toLowerCase());

    for (const col of missingCols) {
      if (!existing.includes(col.name.toLowerCase())) {
        try {
          await pool.query(`ALTER TABLE \`requisitions\` ADD COLUMN \`${col.name}\` ${col.def}`);
          console.log(`✅ Auto-created missing column: ${col.name}`);
        } catch (e) {
          console.warn(`Column ${col.name} note:`, e.message);
        }
      }
    }
  } catch (err) {
    console.error("Migration error:", err.message);
  }
};

ensureColumns();

const cleanDate = (val) => {
  if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") return null;
  const str = String(val).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
};

const cleanNum = (v1, v2) => {
  const val = v1 !== undefined && v1 !== null && v1 !== "" ? v1 : v2;
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

const mapRequisitionRow = (r) => ({
  ...r,
  id: r.id,
  patientName: r.patient_name || "",
  patient_name: r.patient_name || "",
  careCenterId: r.care_center_id || null,
  care_center_id: r.care_center_id || null,
  careCenterName: r.careCenterName || "",
  care_center_name: r.careCenterName || "",
  equipmentId: r.equipment_id || null,
  equipment_id: r.equipment_id || null,
  equipmentName: r.equipmentName || "",
  equipment_name: r.equipmentName || "",
  billingType: r.billing_type || "Daily",
  billing_type: r.billing_type || "Daily",
  rentalCharge: cleanNum(r.rental_charge),
  rental_charge: cleanNum(r.rental_charge),
  depositAdvance: cleanNum(r.deposit_advance),
  deposit_advance: cleanNum(r.deposit_advance),
  installationCharge: cleanNum(r.installation_charge),
  installation_charge: cleanNum(r.installation_charge),
  startDate: cleanDate(r.start_date),
  start_date: cleanDate(r.start_date),
  logoutDate: cleanDate(r.logout_date),
  logout_date: cleanDate(r.logout_date),
  recordDate: cleanDate(r.record_date),
  record_date: cleanDate(r.record_date),
  recallDate: cleanDate(r.recall_date),
  recall_date: cleanDate(r.recall_date),
  notifyDate: cleanDate(r.notify_date),
  notify_date: cleanDate(r.notify_date),
  bedNumber: r.bed_number || "",
  bed_number: r.bed_number || "",
  bedNo: r.bed_number || "",
  referralDoctor: r.referral_doctor || "",
  referral_doctor: r.referral_doctor || "",
  referral: r.referral_doctor || "",
  gstNumber: r.gst_number || "",
  gst_number: r.gst_number || "",
  gstNo: r.gst_number || "",
  inchargeMobile: r.incharge_mobile || "",
  incharge_mobile: r.incharge_mobile || "",
  altMobile: r.alt_mobile || "",
  alt_mobile: r.alt_mobile || "",
  attendantName: r.attendant_name || "",
  attendant_name: r.attendant_name || "",
  mobileNumber: r.mobile_number || "",
  mobile_number: r.mobile_number || "",
  altMobileNumber: r.alt_mobile_number || "",
  alt_mobile_number: r.alt_mobile_number || "",
  careAddress: r.care_address || "",
  care_address: r.care_address || "",
  deliveryAddress: r.delivery_address || "",
  delivery_address: r.delivery_address || "",
  notes: r.notes || "",
  accessory: r.accessory || "",
  accessories: r.accessory || "",
  dealType: r.deal_type || "B2B",
  deal_type: r.deal_type || "B2B",
  unit: r.unit || "ODCOM",
  mode: r.mode || r.payment_type || "Postpaid",
  paymentType: r.payment_type || r.mode || "Postpaid",
  payment_type: r.payment_type || r.mode || "Postpaid",
  deliveryStatus: r.delivery_status || "Pending Dispatch",
  delivery_status: r.delivery_status || "Pending Dispatch",
  status: r.status,
  age: r.age || ""
});

class Requisition {
  static async getAll() {
    await ensureColumns();
    const [rows] = await pool.query(`
      SELECT r.*, 
             c.name AS careCenterName, 
             e.name AS equipmentName
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `);
    return rows.map(mapRequisitionRow);
  }

  static async findById(id) {
    await ensureColumns();
    const [rows] = await pool.query(`
      SELECT r.*, 
             c.name AS careCenterName, 
             e.name AS equipmentName
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      WHERE r.id = ?
    `, [id]);
    if (!rows[0]) return null;
    return mapRequisitionRow(rows[0]);
  }

  static async create(data) {
    await ensureColumns();
    const reqId = cleanStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);
    const startDate = cleanDate(data.start_date || data.startDate) || today;
    const logoutDate = cleanDate(data.logout_date || data.logoutDate);
    const finalStatus = logoutDate && logoutDate <= today ? "Closed" : "Active";

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      cleanFk(data.care_center_id || data.careCenterId),
      cleanFk(data.equipment_id || data.equipmentId || data.deviceModel),
      cleanStr(data.patient_name || data.patientName, "Unknown"),
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
      cleanStr(data.billing_type || data.billingType, "Daily"),
      cleanNum(data.rental_charge, data.rentalCharge),
      cleanNum(data.deposit_advance, data.depositAdvance),
      cleanNum(data.installation_charge, data.installationCharge),
      cleanStr(data.age),
      cleanStr(data.attendant_name || data.attendantName),
      cleanStr(data.mobile_number || data.mobileNumber || data.mobile),
      cleanStr(data.alt_mobile_number || data.altMobileNumber),
      cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
      cleanStr(data.alt_mobile || data.altMobile),
      cleanStr(data.care_address || data.careAddress),
      cleanDate(data.record_date || data.recordDate) || startDate,
      cleanDate(data.recall_date || data.recallDate)
    ];

    await pool.query(sql, values);
    return reqId;
  }

  static async update(id, data) {
    await ensureColumns();
    const today = new Date().toISOString().slice(0, 10);
    const startDate = cleanDate(data.start_date || data.startDate) || today;
    const logoutDate = cleanDate(data.logout_date || data.logoutDate);
    let finalStatus = logoutDate && logoutDate <= today ? "Closed" : "Active";
    if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
      finalStatus = "Inactive";
    }

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const careCenterId = cleanFk(data.care_center_id || data.careCenterId);
    const equipmentId = cleanFk(data.equipment_id || data.equipmentId || data.deviceModel);

    const sql = `
      UPDATE requisitions 
      SET care_center_id = COALESCE(?, care_center_id), 
          equipment_id = COALESCE(?, equipment_id), 
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
      cleanStr(data.patient_name || data.patientName, "Unknown"),
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
      cleanStr(data.billing_type || data.billingType, "Daily"),
      cleanNum(data.rental_charge, data.rentalCharge),
      cleanNum(data.deposit_advance, data.depositAdvance),
      cleanNum(data.installation_charge, data.installationCharge),
      cleanStr(data.age),
      cleanStr(data.attendant_name || data.attendantName),
      cleanStr(data.mobile_number || data.mobileNumber || data.mobile),
      cleanStr(data.alt_mobile_number || data.altMobileNumber),
      cleanStr(data.incharge_mobile || data.inchargeMobile || data.phone),
      cleanStr(data.alt_mobile || data.altMobile),
      cleanStr(data.care_address || data.careAddress),
      cleanDate(data.record_date || data.recordDate),
      cleanDate(data.recall_date || data.recallDate),
      id
    ];

    await pool.query(sql, values);
  }

  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;