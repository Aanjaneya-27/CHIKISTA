// const pool = require("../config/database");

// class Requisition {
//   static async getAll() {
//     const [rows] = await pool.query(`
//       SELECT r.*, 
//              c.name AS careCenterName, 
//              e.name AS equipmentName,
//              r.bed_number AS bedNumber, 
//              r.referral_doctor AS referralDoctor, 
//              r.gst_number AS gstNumber,
//              COALESCE(r.billing_type, 'Daily') AS billingType,
//              COALESCE(r.rental_charge, 0) AS rentalCharge,
//              COALESCE(r.deposit_advance, 0) AS depositAdvance,
//              COALESCE(r.installation_charge, 0) AS installationCharge,
//              r.incharge_mobile AS inchargeMobile,
//              r.alt_mobile AS altMobile,
//              r.attendant_name AS attendantName,
//              r.mobile_number AS mobileNumber,
//              r.alt_mobile_number AS altMobileNumber,
//              r.care_address AS careAddress,
//              r.record_date AS recordDate,
//              r.recall_date AS recallDate,
//              r.logout_date AS logoutDate
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       ORDER BY r.created_at DESC
//     `);
//     return rows;
//   }
  
//   static async findById(id) {
//     const [rows] = await pool.query(`
//       SELECT r.*, 
//              c.name AS careCenterName, 
//              e.name AS equipmentName,
//              r.bed_number AS bedNumber, 
//              r.referral_doctor AS referralDoctor, 
//              r.gst_number AS gstNumber,
//              COALESCE(r.billing_type, 'Daily') AS billingType,
//              COALESCE(r.rental_charge, 0) AS rentalCharge,
//              COALESCE(r.deposit_advance, 0) AS depositAdvance,
//              COALESCE(r.installation_charge, 0) AS installationCharge,
//              r.incharge_mobile AS inchargeMobile,
//              r.alt_mobile AS altMobile,
//              r.attendant_name AS attendantName,
//              r.mobile_number AS mobileNumber,
//              r.alt_mobile_number AS altMobileNumber,
//              r.care_address AS careAddress,
//              r.record_date AS recordDate,
//              r.recall_date AS recallDate,
//              r.logout_date AS logoutDate
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       WHERE r.id = ?
//     `, [id]);
//     return rows[0];
//   }

//   static async create(data) {
//     const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
//     const today = new Date().toISOString().slice(0, 10);
    
//     const startDate = data.start_date || data.startDate || today;
//     const logoutDate = data.logout_date || data.logoutDate || null; 
//     const notifyDate = data.notify_date || data.notifyDate || null;
//     const recordDate = data.record_date || data.recordDate || today;
//     const recallDate = data.recall_date || data.recallDate || null;

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

//     const billingType = data.billing_type || data.billingType || "Daily";
//     const rentalCharge = parseFloat(data.rental_charge ?? data.rentalCharge ?? 0) || 0;
//     const depositAdvance = parseFloat(data.deposit_advance ?? data.depositAdvance ?? 0) || 0;
//     const installationCharge = parseFloat(data.installation_charge ?? data.installationCharge ?? 0) || 0;

//     const sql = `
//       INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       reqId,
//       data.care_center_id || data.careCenterId || null,
//       data.equipment_id || data.equipmentId || null,
//       (data.patient_name || data.patientName || "Unknown").trim(),
//       Number(data.quantity) > 0 ? Number(data.quantity) : 1,
//       startDate,
//       logoutDate,
//       finalStatus,
//       data.delivery_status || data.deliveryStatus || "Pending Dispatch",
//       data.payment_type || data.paymentType || "Postpaid",
//       data.deal_type || data.dealType || "B2B",
//       data.unit || "ODCOM",
//       data.mode || data.paymentType || "Postpaid",
//       notifyDate,
//       data.delivery_address || data.deliveryAddress || "",
//       data.notes || "",
//       accValue,
//       data.referral_doctor || data.referral || "",
//       data.bed_number || data.bedNo || "",
//       data.gst_number || data.gstNo || "",
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
//       data.age || "",
//       data.attendant_name || data.attendantName || "",
//       data.mobile_number || data.mobileNumber || "",
//       data.alt_mobile_number || data.altMobileNumber || "",
//       data.incharge_mobile || data.inchargeMobile || "",
//       data.alt_mobile || data.altMobile || "",
//       data.care_address || data.careAddress || "",
//       recordDate,
//       recallDate
//     ];

//     await pool.query(sql, values);
//     return reqId;
//   }

//   static async update(id, data) {
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = data.start_date || data.startDate || today;
//     const logoutDate = data.logout_date || data.logoutDate || null; 
//     const notifyDate = data.notify_date || data.notifyDate || null;
//     const recordDate = data.record_date || data.recordDate || today;
//     const recallDate = data.recall_date || data.recallDate || null;

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     let finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";
//     if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
//       finalStatus = "Inactive";
//     }

//     const billingType = data.billing_type || data.billingType || "Daily";
//     const rentalCharge = parseFloat(data.rental_charge ?? data.rentalCharge ?? 0) || 0;
//     const depositAdvance = parseFloat(data.deposit_advance ?? data.depositAdvance ?? 0) || 0;
//     const installationCharge = parseFloat(data.installation_charge ?? data.installationCharge ?? 0) || 0;

//     const sql = `
//       UPDATE requisitions 
//       SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
//           start_date = ?, logout_date = ?, status = ?, delivery_status = ?, 
//           payment_type = ?, deal_type = ?, unit = ?, mode = ?, notify_date = ?, 
//           delivery_address = ?, notes = ?, accessory = ?, referral_doctor = ?, bed_number = ?, gst_number = ?,
//           billing_type = ?, rental_charge = ?, deposit_advance = ?, installation_charge = ?,
//           age = ?, attendant_name = ?, mobile_number = ?, alt_mobile_number = ?,
//           incharge_mobile = ?, alt_mobile = ?, care_address = ?, record_date = ?, recall_date = ?
//       WHERE id = ?
//     `;
    
//     const values = [
//       data.care_center_id || data.careCenterId || null, 
//       data.equipment_id || data.equipmentId || null, 
//       (data.patient_name || data.patientName || "Unknown").trim(), 
//       Number(data.quantity) > 0 ? Number(data.quantity) : 1, 
//       startDate, 
//       logoutDate, 
//       finalStatus, 
//       data.delivery_status || data.deliveryStatus || "Pending Dispatch", 
//       data.payment_type || data.paymentType || "Postpaid", 
//       data.deal_type || data.dealType || "B2B", 
//       data.unit || "ODCOM", 
//       data.mode || data.paymentType || "Postpaid", 
//       notifyDate, 
//       data.delivery_address || data.deliveryAddress || "", 
//       data.notes || "", 
//       accValue, 
//       data.referral_doctor || data.referral || "", 
//       data.bed_number || data.bedNo || "", 
//       data.gst_number || data.gstNo || "",
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
//       data.age || "",
//       data.attendant_name || data.attendantName || "",
//       data.mobile_number || data.mobileNumber || "",
//       data.alt_mobile_number || data.altMobileNumber || "",
//       data.incharge_mobile || data.inchargeMobile || "",
//       data.alt_mobile || data.altMobile || "",
//       data.care_address || data.careAddress || "",
//       recordDate,
//       recallDate,
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

// 🛡️ Helper to prevent NaN / undefined crashing mysql2
const safeNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const safeDate = (v) => {
  if (!v || v === "null" || v === "undefined" || String(v).trim() === "" || String(v).trim() === "0000-00-00") {
    return null;
  }
  const s = String(v).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};

const safeStr = (v, fallback = "") => {
  if (v === null || v === undefined) return fallback;
  return String(v).trim();
};

class Requisition {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT r.*, 
             c.name AS careCenterName, 
             e.name AS equipmentName
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `);
    return rows.map((r) => ({
      ...r,
      billingType: r.billing_type || "Daily",
      rentalCharge: safeNum(r.rental_charge),
      depositAdvance: safeNum(r.deposit_advance),
      installationCharge: safeNum(r.installation_charge),
      patientName: r.patient_name || "",
      startDate: safeDate(r.start_date),
      logoutDate: safeDate(r.logout_date),
      recordDate: safeDate(r.record_date),
      recallDate: safeDate(r.recall_date),
      notifyDate: safeDate(r.notify_date),
      bedNumber: r.bed_number || "",
      referralDoctor: r.referral_doctor || "",
      gstNumber: r.gst_number || "",
      inchargeMobile: r.incharge_mobile || "",
      altMobile: r.alt_mobile || "",
      attendantName: r.attendant_name || "",
      mobileNumber: r.mobile_number || "",
      altMobileNumber: r.alt_mobile_number || "",
      careAddress: r.care_address || ""
    }));
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT r.*, 
             c.name AS careCenterName, 
             e.name AS equipmentName
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      WHERE r.id = ?
    `,
      [id]
    );
    if (!rows[0]) return null;
    const r = rows[0];
    return {
      ...r,
      billingType: r.billing_type || "Daily",
      rentalCharge: safeNum(r.rental_charge),
      depositAdvance: safeNum(r.deposit_advance),
      installationCharge: safeNum(r.installation_charge),
      patientName: r.patient_name || "",
      startDate: safeDate(r.start_date),
      logoutDate: safeDate(r.logout_date),
      recordDate: safeDate(r.record_date),
      recallDate: safeDate(r.recall_date),
      notifyDate: safeDate(r.notify_date)
    };
  }

  static async create(data) {
    const reqId = safeStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);
    const startDate = safeDate(data.start_date || data.startDate) || today;
    const logoutDate = safeDate(data.logout_date || data.logoutDate);
    const status = logoutDate && logoutDate <= today ? "Closed" : "Active";

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    let existingCols = [];
    try {
      const [cols] = await pool.query(`SHOW COLUMNS FROM requisitions`);
      existingCols = cols.map((c) => c.Field);
    } catch (e) {
      existingCols = [];
    }

    const fieldMap = {
      id: reqId,
      patient_name: safeStr(data.patient_name || data.patientName, "Unknown"),
      care_center_id: safeStr(data.care_center_id || data.careCenterId) || null,
      equipment_id: safeStr(data.equipment_id || data.equipmentId || data.deviceModel) || null,
      quantity: Math.max(1, safeNum(data.quantity) || 1),
      start_date: startDate,
      logout_date: logoutDate,
      status: status,
      billing_type: safeStr(data.billing_type || data.billingType, "Daily"),
      rental_charge: safeNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge),
      deposit_advance: safeNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance),
      installation_charge: safeNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge),
      delivery_status: safeStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"),
      payment_type: safeStr(data.payment_type || data.paymentType || data.mode, "Postpaid"),
      deal_type: safeStr(data.deal_type || data.dealType, "B2B"),
      unit: safeStr(data.unit, "ODCOM"),
      mode: safeStr(data.mode || data.paymentType, "Postpaid"),
      notify_date: safeDate(data.notify_date || data.notifyDate),
      record_date: safeDate(data.record_date || data.recordDate) || startDate,
      recall_date: safeDate(data.recall_date || data.recallDate),
      delivery_address: safeStr(data.delivery_address || data.deliveryAddress),
      notes: safeStr(data.notes),
      accessory: safeStr(accValue),
      referral_doctor: safeStr(data.referral_doctor || data.referral),
      bed_number: safeStr(data.bed_number || data.bedNo),
      gst_number: safeStr(data.gst_number || data.gstNo),
      age: safeStr(data.age),
      attendant_name: safeStr(data.attendant_name || data.attendantName),
      mobile_number: safeStr(data.mobile_number || data.mobileNumber),
      alt_mobile_number: safeStr(data.alt_mobile_number || data.altMobileNumber),
      incharge_mobile: safeStr(data.incharge_mobile || data.inchargeMobile || data.phone),
      alt_mobile: safeStr(data.alt_mobile || data.altMobile),
      care_address: safeStr(data.care_address || data.careAddress)
    };

    const insertCols = [];
    const placeholders = [];
    const values = [];

    for (const [col, val] of Object.entries(fieldMap)) {
      if (existingCols.length === 0 || existingCols.includes(col)) {
        insertCols.push(`\`${col}\``);
        placeholders.push("?");
        values.push(val);
      }
    }

    const cleanValues = values.map((v) => (v === undefined ? null : Number.isNaN(v) ? 0 : v));
    await pool.query(`INSERT INTO requisitions (${insertCols.join(", ")}) VALUES (${placeholders.join(", ")})`, cleanValues);
    return reqId;
  }

  static async update(id, data) {
    const today = new Date().toISOString().slice(0, 10);
    const logoutDate = safeDate(data.logout_date || data.logoutDate);
    const startDate = safeDate(data.start_date || data.startDate);
    let finalStatus = logoutDate && logoutDate <= today ? "Closed" : "Active";
    if (String(data.status || "").toLowerCase() === "inactive") finalStatus = "Inactive";

    let accValue = data.accessories || data.accessory;
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    let existingCols = [];
    try {
      const [cols] = await pool.query(`SHOW COLUMNS FROM requisitions`);
      existingCols = cols.map((c) => c.Field);
    } catch (e) {
      existingCols = [];
    }

    const fieldMap = {
      patient_name: safeStr(data.patient_name || data.patientName, "Unknown"),
      care_center_id: safeStr(data.care_center_id || data.careCenterId) || null,
      equipment_id: safeStr(data.equipment_id || data.equipmentId || data.deviceModel) || null,
      quantity: Math.max(1, safeNum(data.quantity) || 1),
      start_date: startDate || today,
      logout_date: logoutDate,
      status: finalStatus,
      billing_type: safeStr(data.billing_type || data.billingType, "Daily"),
      rental_charge: safeNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge),
      deposit_advance: safeNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance),
      installation_charge: safeNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge),
      delivery_status: safeStr(data.delivery_status || data.deliveryStatus, "Pending Dispatch"),
      payment_type: safeStr(data.payment_type || data.paymentType || data.mode, "Postpaid"),
      deal_type: safeStr(data.deal_type || data.dealType, "B2B"),
      unit: safeStr(data.unit, "ODCOM"),
      mode: safeStr(data.mode || data.paymentType, "Postpaid"),
      notify_date: safeDate(data.notify_date || data.notifyDate),
      record_date: safeDate(data.record_date || data.recordDate),
      recall_date: safeDate(data.recall_date || data.recallDate),
      delivery_address: safeStr(data.delivery_address || data.deliveryAddress),
      notes: safeStr(data.notes),
      accessory: accValue !== undefined ? safeStr(accValue) : undefined,
      referral_doctor: safeStr(data.referral_doctor || data.referral),
      bed_number: safeStr(data.bed_number || data.bedNo),
      gst_number: safeStr(data.gst_number || data.gstNo),
      age: safeStr(data.age),
      attendant_name: safeStr(data.attendant_name || data.attendantName),
      mobile_number: safeStr(data.mobile_number || data.mobileNumber),
      alt_mobile_number: safeStr(data.alt_mobile_number || data.altMobileNumber),
      incharge_mobile: safeStr(data.incharge_mobile || data.inchargeMobile || data.phone),
      alt_mobile: safeStr(data.alt_mobile || data.altMobile),
      care_address: safeStr(data.care_address || data.careAddress)
    };

    const setClauses = [];
    const values = [];

    for (const [col, val] of Object.entries(fieldMap)) {
      if (val !== undefined && (existingCols.length === 0 || existingCols.includes(col))) {
        setClauses.push(`\`${col}\` = ?`);
        values.push(val);
      }
    }

    if (setClauses.length === 0) return;

    values.push(id);
    const cleanValues = values.map((v) => (v === undefined ? null : Number.isNaN(v) ? 0 : v));
    await pool.query(`UPDATE requisitions SET ${setClauses.join(", ")} WHERE id = ?`, cleanValues);
  }

  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;