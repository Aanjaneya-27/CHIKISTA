// const pool = require("../config/database");

// const safeDate = (val) => {
//   const today = new Date().toISOString().slice(0, 10);
//   if (!val || val === "" || String(val).trim().toLowerCase() === "null") return today;
//   try {
//     const d = new Date(val);
//     return isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
//   } catch (err) {
//     return today;
//   }
// };

// const safeOptionalDate = (val) => {
//   if (!val || val === "" || String(val).trim().toLowerCase() === "null" || val === "undefined") {
//     return null;
//   }
//   try {
//     const d = new Date(val);
//     return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
//   } catch (err) {
//     return null;
//   }
// };

// class Requisition {
//   static async getAll() {
//     const [rows] = await pool.query(`
//       SELECT r.*, 
//              c.name AS careCenterName, 
//              e.name AS equipmentName,
//              r.bed_number AS bedNumber, 
//              r.referral_doctor AS referralDoctor, 
//              r.gst_number AS gstNumber,
//              r.billing_type AS billingType,
//              r.rental_charge AS rentalCharge,
//              r.deposit_advance AS depositAdvance,
//              r.installation_charge AS installationCharge,
//              r.incharge_mobile AS inchargeMobile,
//              r.alt_mobile AS altMobile,
//              r.attendant_name AS attendantName,
//              r.mobile_number AS mobileNumber,
//              r.alt_mobile_number AS altMobileNumber,
//              r.care_address AS careAddress,
//              r.record_date AS recordDate,
//              r.recall_date AS recallDate
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
//              r.billing_type AS billingType,
//              r.rental_charge AS rentalCharge,
//              r.deposit_advance AS depositAdvance,
//              r.installation_charge AS installationCharge,
//              r.incharge_mobile AS inchargeMobile,
//              r.alt_mobile AS altMobile,
//              r.attendant_name AS attendantName,
//              r.mobile_number AS mobileNumber,
//              r.alt_mobile_number AS altMobileNumber,
//              r.care_address AS careAddress,
//              r.record_date AS recordDate,
//              r.recall_date AS recallDate
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       WHERE r.id = ?
//     `, [id]);
//     return rows[0];
//   }

//   static async create(data) {
//     const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    
//     const startDate = safeDate(data.start_date || data.startDate || data.loginDate);
//     const logoutDate = safeOptionalDate(data.logout_date || data.logoutDate); // 👈 Optional
//     const notifyDate = safeOptionalDate(data.notify_date || data.notifyDate);
//     const recordDate = safeOptionalDate(data.record_date || data.recordDate) || safeDate(null);
//     const recallDate = safeOptionalDate(data.recall_date || data.recallDate);

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     let finalStatus = data.status || data.requisition_status || (logoutDate ? "Closed" : "Active");
//     if (String(finalStatus).toLowerCase() === "returned") finalStatus = "Closed";

//     const sql = `
//       INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       reqId,
//       data.care_center_id || data.careCenterId || "CARE-NEW",
//       data.equipment_id || data.equipmentId || data.deviceModel || "EQ-NEW",
//       data.patient_name || data.patientName || "Unknown",
//       data.quantity || 1,
//       startDate,
//       logoutDate,
//       finalStatus,
//       data.delivery_status || data.deliveryStatus || "Pending Dispatch",
//       data.payment_type || data.paymentType || data.mode || "Postpaid",
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
//       data.billing_type || data.billingType || "Daily",
//       data.rental_charge !== undefined ? data.rental_charge : (data.rentalCharge || 0),
//       data.deposit_advance !== undefined ? data.deposit_advance : (data.depositAdvance || 0),
//       data.installation_charge !== undefined ? data.installation_charge : (data.installationCharge || 0),
//       data.age || "",
//       data.attendant_name || data.attendantName || "",
//       data.mobile_number || data.mobileNumber || "",
//       data.alt_mobile_number || data.altMobileNumber || "",
//       data.incharge_mobile || data.inchargeMobile || data.phone || "",
//       data.alt_mobile || data.altMobile || "",
//       data.care_address || data.careAddress || "",
//       recordDate,
//       recallDate
//     ];

//     await pool.query(sql, values);
//     return reqId;
//   }

//   static async update(id, data) {
//     const startDate = safeDate(data.start_date || data.startDate || data.loginDate);
//     const logoutDate = safeOptionalDate(data.logout_date || data.logoutDate); // 👈 Optional
//     const notifyDate = safeOptionalDate(data.notify_date || data.notifyDate);
//     const recordDate = safeOptionalDate(data.record_date || data.recordDate);
//     const recallDate = safeOptionalDate(data.recall_date || data.recallDate);

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     let finalStatus = data.status || data.requisition_status || data.return_status || "Active";
//     if (String(finalStatus).toLowerCase() === "returned") finalStatus = "Closed";

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
//       data.care_center_id || data.careCenterId || "CARE-NEW", 
//       data.equipment_id || data.equipmentId || data.deviceModel || "EQ-NEW", 
//       data.patient_name || data.patientName || "Unknown", 
//       data.quantity || 1, 
//       startDate, 
//       logoutDate, 
//       finalStatus, 
//       data.delivery_status || data.deliveryStatus || "Pending Dispatch", 
//       data.payment_type || data.paymentType || data.mode || "Postpaid", 
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
//       data.billing_type || data.billingType || "Daily",
//       data.rental_charge !== undefined ? data.rental_charge : (data.rentalCharge || 0),
//       data.deposit_advance !== undefined ? data.deposit_advance : (data.depositAdvance || 0),
//       data.installation_charge !== undefined ? data.installation_charge : (data.installationCharge || 0),
//       data.age || "",
//       data.attendant_name || data.attendantName || "",
//       data.mobile_number || data.mobileNumber || "",
//       data.alt_mobile_number || data.altMobileNumber || "",
//       data.incharge_mobile || data.inchargeMobile || data.phone || "",
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
  if (!val || val === "" || String(val).trim() === "0000-00-00" || String(val).toLowerCase() === "null") return null;
  const d = new Date(val);
  return isNaN(d.getTime()) || d.getFullYear() < 2000 ? null : d.toISOString().slice(0, 10);
};

class Requisition {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT r.*, 
             DATE_FORMAT(r.record_date, '%Y-%m-%d') AS recordDate,
             DATE_FORMAT(r.start_date, '%Y-%m-%d') AS startDate,
             DATE_FORMAT(r.start_date, '%Y-%m-%d') AS loginDate,
             DATE_FORMAT(r.logout_date, '%Y-%m-%d') AS logoutDate,
             DATE_FORMAT(r.notify_date, '%Y-%m-%d') AS notifyDate,
             DATE_FORMAT(r.recall_date, '%Y-%m-%d') AS recallDate,
             c.name AS careCenterName, 
             e.name AS equipmentName,
             r.bed_number AS bedNo,
             r.referral_doctor AS referral,
             r.billing_type AS billingType,
             r.rental_charge AS rentalCharge,
             r.deposit_advance AS depositAdvance,
             r.installation_charge AS installationCharge,
             r.incharge_mobile AS inchargeMobile,
             r.alt_mobile AS altMobile,
             r.attendant_name AS attendantName,
             r.mobile_number AS mobileNumber,
             r.alt_mobile_number AS altMobileNumber,
             r.care_address AS careAddress
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `);
    return rows;
  }

  static async create(data) {
    const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const startDate = cleanDate(data.startDate || data.start_date || data.loginDate) || new Date().toISOString().slice(0, 10);
    const logoutDate = cleanDate(data.logoutDate || data.logout_date);
    const recordDate = cleanDate(data.recordDate || data.record_date) || startDate;
    const notifyDate = cleanDate(data.notifyDate || data.notify_date);
    const recallDate = cleanDate(data.recallDate || data.recall_date);

    const finalStatus = logoutDate !== null ? "Closed" : "Active";
    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.careCenterId || data.care_center_id || "CARE-NEW",
      data.equipmentId || data.equipment_id || data.deviceModel || "EQ-NEW",
      data.patientName || data.patient_name || "Unknown",
      1,
      startDate,
      logoutDate,
      finalStatus,
      "Pending Dispatch",
      data.paymentType || data.mode || "Postpaid",
      data.dealType || data.deal_type || "B2B",
      data.unit || "ODCOM",
      data.mode || "Postpaid",
      notifyDate,
      data.deliveryAddress || data.delivery_address || "",
      data.notes || "",
      accValue,
      data.referral || data.referral_doctor || "",
      data.bedNo || data.bed_number || "",
      data.gstNo || data.gst_number || "",
      data.billingType || data.billing_type || "Daily",
      Number(data.rentalCharge ?? data.rental_charge) || 0,
      Number(data.depositAdvance ?? data.deposit_advance) || 0,
      Number(data.installationCharge ?? data.installation_charge) || 0,
      data.age || "",
      data.attendantName || data.attendant_name || "",
      data.mobileNumber || data.mobile_number || "",
      data.altMobileNumber || data.alt_mobile_number || "",
      data.inchargeMobile || data.incharge_mobile || "",
      data.altMobile || data.alt_mobile || "",
      data.careAddress || data.care_address || "",
      recordDate,
      recallDate
    ];

    await pool.query(sql, values);
    return reqId;
  }

  static async update(id, data) {
    const startDate = cleanDate(data.startDate || data.start_date || data.loginDate) || new Date().toISOString().slice(0, 10);
    const logoutDate = cleanDate(data.logoutDate || data.logout_date);
    const recordDate = cleanDate(data.recordDate || data.record_date) || startDate;
    const notifyDate = cleanDate(data.notifyDate || data.notify_date);
    const recallDate = cleanDate(data.recallDate || data.recall_date);

    let finalStatus = logoutDate !== null ? "Closed" : "Active";
    if (String(data.status).toLowerCase() === "inactive") finalStatus = "Inactive";

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const sql = `
      UPDATE requisitions 
      SET care_center_id = ?, equipment_id = ?, patient_name = ?, start_date = ?, logout_date = ?, 
          status = ?, payment_type = ?, deal_type = ?, unit = ?, mode = ?, notify_date = ?, 
          delivery_address = ?, notes = ?, accessory = ?, referral_doctor = ?, bed_number = ?, 
          billing_type = ?, rental_charge = ?, deposit_advance = ?, installation_charge = ?,
          age = ?, attendant_name = ?, mobile_number = ?, alt_mobile_number = ?,
          incharge_mobile = ?, alt_mobile = ?, care_address = ?, record_date = ?, recall_date = ?
      WHERE id = ?
    `;

    const values = [
      data.careCenterId || data.care_center_id || "CARE-NEW",
      data.equipmentId || data.equipment_id || data.deviceModel || "EQ-NEW",
      data.patientName || data.patient_name || "Unknown",
      startDate,
      logoutDate,
      finalStatus,
      data.paymentType || data.mode || "Postpaid",
      data.dealType || data.deal_type || "B2B",
      data.unit || "ODCOM",
      data.mode || "Postpaid",
      notifyDate,
      data.deliveryAddress || data.delivery_address || "",
      data.notes || "",
      accValue,
      data.referral || data.referral_doctor || "",
      data.bedNo || data.bed_number || "",
      data.billingType || data.billing_type || "Daily",
      Number(data.rentalCharge ?? data.rental_charge) || 0,
      Number(data.depositAdvance ?? data.deposit_advance) || 0,
      Number(data.installationCharge ?? data.installation_charge) || 0,
      data.age || "",
      data.attendantName || data.attendant_name || "",
      data.mobileNumber || data.mobile_number || "",
      data.altMobileNumber || data.alt_mobile_number || "",
      data.inchargeMobile || data.incharge_mobile || "",
      data.altMobile || data.alt_mobile || "",
      data.careAddress || data.care_address || "",
      recordDate,
      recallDate,
      id
    ];

    await pool.query(sql, values);
  }

  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;