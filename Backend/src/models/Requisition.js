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

const cleanDate = (val) => {
  if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") return null;
  const str = String(val).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
};

const cleanNum = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const cleanFk = (val) => {
  if (!val || val === "" || val === "null" || val === "undefined" || val === "NEW" || val === "other" || val === "CC-ME") return null;
  return String(val).trim();
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
      rentalCharge: cleanNum(r.rental_charge),
      depositAdvance: cleanNum(r.deposit_advance),
      installationCharge: cleanNum(r.installation_charge),
      patientName: r.patient_name || "",
      startDate: cleanDate(r.start_date),
      logoutDate: cleanDate(r.logout_date),
      recordDate: cleanDate(r.record_date),
      recallDate: cleanDate(r.recall_date),
      notifyDate: cleanDate(r.notify_date),
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
    const r = rows[0];
    return {
      ...r,
      billingType: r.billing_type || "Daily",
      rentalCharge: cleanNum(r.rental_charge),
      depositAdvance: cleanNum(r.deposit_advance),
      installationCharge: cleanNum(r.installation_charge),
      patientName: r.patient_name || "",
      startDate: cleanDate(r.start_date),
      logoutDate: cleanDate(r.logout_date),
      recordDate: cleanDate(r.record_date),
      recallDate: cleanDate(r.recall_date),
      notifyDate: cleanDate(r.notify_date)
    };
  }

  static async create(data) {
    const reqId = String(data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`).trim();
    const today = new Date().toISOString().slice(0, 10);
    const startDate = cleanDate(data.start_date || data.startDate) || today;
    const logoutDate = cleanDate(data.logout_date || data.logoutDate);
    const finalStatus = logoutDate && logoutDate <= today ? "Closed" : "Active";

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const [columnsData] = await pool.query("SHOW COLUMNS FROM `requisitions`");
    const dbColumns = columnsData.map((c) => c.Field);

    const payloadMap = {
      id: reqId,
      patient_name: String(data.patient_name || data.patientName || "Unknown").trim(),
      care_center_id: cleanFk(data.care_center_id || data.careCenterId),
      equipment_id: cleanFk(data.equipment_id || data.equipmentId || data.deviceModel),
      quantity: Math.max(1, cleanNum(data.quantity) || 1),
      start_date: startDate,
      logout_date: logoutDate,
      status: finalStatus,
      billing_type: String(data.billing_type || data.billingType || "Daily").trim(),
      rental_charge: cleanNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge),
      deposit_advance: cleanNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance),
      installation_charge: cleanNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge),
      delivery_status: String(data.delivery_status || data.deliveryStatus || "Pending Dispatch").trim(),
      payment_type: String(data.payment_type || data.paymentType || data.mode || "Postpaid").trim(),
      deal_type: String(data.deal_type || data.dealType || "B2B").trim(),
      unit: String(data.unit || "ODCOM").trim(),
      mode: String(data.mode || data.paymentType || "Postpaid").trim(),
      notify_date: cleanDate(data.notify_date || data.notifyDate),
      record_date: cleanDate(data.record_date || data.recordDate) || startDate,
      recall_date: cleanDate(data.recall_date || data.recallDate),
      delivery_address: String(data.delivery_address || data.deliveryAddress || "").trim(),
      notes: String(data.notes || "").trim(),
      accessory: String(accValue).trim(),
      referral_doctor: String(data.referral_doctor || data.referral || "").trim(),
      bed_number: String(data.bed_number || data.bedNo || "").trim(),
      gst_number: String(data.gst_number || data.gstNo || "").trim(),
      age: String(data.age || "").trim(),
      attendant_name: String(data.attendant_name || data.attendantName || "").trim(),
      mobile_number: String(data.mobile_number || data.mobileNumber || "").trim(),
      alt_mobile_number: String(data.alt_mobile_number || data.altMobileNumber || "").trim(),
      incharge_mobile: String(data.incharge_mobile || data.inchargeMobile || data.phone || "").trim(),
      alt_mobile: String(data.alt_mobile || data.altMobile || "").trim(),
      care_address: String(data.care_address || data.careAddress || "").trim()
    };

    const insertCols = [];
    const placeholders = [];
    const values = [];

    for (const col of dbColumns) {
      if (payloadMap.hasOwnProperty(col)) {
        insertCols.push(`\`${col}\``);
        placeholders.push("?");
        values.push(payloadMap[col]);
      }
    }

    const sql = `INSERT INTO \`requisitions\` (${insertCols.join(", ")}) VALUES (${placeholders.join(", ")})`;
    await pool.query(sql, values);
    return reqId;
  }

  static async update(id, data) {
    const today = new Date().toISOString().slice(0, 10);
    const logoutDate = cleanDate(data.logout_date || data.logoutDate);
    const startDate = cleanDate(data.start_date || data.startDate);
    let finalStatus = logoutDate && logoutDate <= today ? "Closed" : "Active";
    if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
      finalStatus = "Inactive";
    }

    let accValue = data.accessories || data.accessory;
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const [columnsData] = await pool.query("SHOW COLUMNS FROM `requisitions`");
    const dbColumns = columnsData.map((c) => c.Field);

    const payloadMap = {
      patient_name: String(data.patient_name || data.patientName || "Unknown").trim(),
      care_center_id: cleanFk(data.care_center_id || data.careCenterId),
      equipment_id: cleanFk(data.equipment_id || data.equipmentId || data.deviceModel),
      quantity: Math.max(1, cleanNum(data.quantity) || 1),
      start_date: startDate || today,
      logout_date: logoutDate,
      status: finalStatus,
      billing_type: String(data.billing_type || data.billingType || "Daily").trim(),
      rental_charge: cleanNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge),
      deposit_advance: cleanNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance),
      installation_charge: cleanNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge),
      delivery_status: String(data.delivery_status || data.deliveryStatus || "Pending Dispatch").trim(),
      payment_type: String(data.payment_type || data.paymentType || data.mode || "Postpaid").trim(),
      deal_type: String(data.deal_type || data.dealType || "B2B").trim(),
      unit: String(data.unit || "ODCOM").trim(),
      mode: String(data.mode || data.paymentType || "Postpaid").trim(),
      notify_date: cleanDate(data.notify_date || data.notifyDate),
      record_date: cleanDate(data.record_date || data.recordDate),
      recall_date: cleanDate(data.recall_date || data.recallDate),
      delivery_address: String(data.delivery_address || data.deliveryAddress || "").trim(),
      notes: String(data.notes || "").trim(),
      accessory: accValue !== undefined ? String(accValue).trim() : undefined,
      referral_doctor: String(data.referral_doctor || data.referral || "").trim(),
      bed_number: String(data.bed_number || data.bedNo || "").trim(),
      gst_number: String(data.gst_number || data.gstNo || "").trim(),
      age: String(data.age || "").trim(),
      attendant_name: String(data.attendant_name || data.attendantName || "").trim(),
      mobile_number: String(data.mobile_number || data.mobileNumber || "").trim(),
      alt_mobile_number: String(data.alt_mobile_number || data.altMobileNumber || "").trim(),
      incharge_mobile: String(data.incharge_mobile || data.inchargeMobile || data.phone || "").trim(),
      alt_mobile: String(data.alt_mobile || data.altMobile || "").trim(),
      care_address: String(data.care_address || data.careAddress || "").trim()
    };

    const setClauses = [];
    const values = [];

    for (const col of dbColumns) {
      if (col === "id" || col === "created_at" || col === "updated_at") continue;
      if (payloadMap.hasOwnProperty(col) && payloadMap[col] !== undefined) {
        setClauses.push(`\`${col}\` = ?`);
        values.push(payloadMap[col]);
      }
    }

    if (setClauses.length === 0) return;

    values.push(id);
    const sql = `UPDATE \`requisitions\` SET ${setClauses.join(", ")} WHERE \`id\` = ?`;
    await pool.query(sql, values);
  }

  static async delete(id) {
    await pool.query(`DELETE FROM \`requisitions\` WHERE \`id\` = ?`, [id]);
  }
}

module.exports = Requisition;