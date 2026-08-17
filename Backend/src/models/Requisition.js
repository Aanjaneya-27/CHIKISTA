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

class Requisition {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT r.*, 
             c.name AS careCenterName, 
             e.name AS equipmentName,
             r.bed_number AS bedNumber, 
             r.referral_doctor AS referralDoctor, 
             r.gst_number AS gstNumber,
             COALESCE(r.billing_type, 'Daily') AS billingType,
             COALESCE(r.rental_charge, 0) AS rentalCharge,
             COALESCE(r.deposit_advance, 0) AS depositAdvance,
             COALESCE(r.installation_charge, 0) AS installationCharge,
             r.incharge_mobile AS inchargeMobile,
             r.alt_mobile AS altMobile,
             r.attendant_name AS attendantName,
             r.mobile_number AS mobileNumber,
             r.alt_mobile_number AS altMobileNumber,
             r.care_address AS careAddress,
             r.record_date AS recordDate,
             r.recall_date AS recallDate,
             r.logout_date AS logoutDate,
             r.start_date AS startDate,
             r.patient_name AS patientName
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `);
    return rows;
  }
  
  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT r.*, 
             c.name AS careCenterName, 
             e.name AS equipmentName,
             r.bed_number AS bedNumber, 
             r.referral_doctor AS referralDoctor, 
             r.gst_number AS gstNumber,
             COALESCE(r.billing_type, 'Daily') AS billingType,
             COALESCE(r.rental_charge, 0) AS rentalCharge,
             COALESCE(r.deposit_advance, 0) AS depositAdvance,
             COALESCE(r.installation_charge, 0) AS installationCharge,
             r.incharge_mobile AS inchargeMobile,
             r.alt_mobile AS altMobile,
             r.attendant_name AS attendantName,
             r.mobile_number AS mobileNumber,
             r.alt_mobile_number AS altMobileNumber,
             r.care_address AS careAddress,
             r.record_date AS recordDate,
             r.recall_date AS recallDate,
             r.logout_date AS logoutDate,
             r.start_date AS startDate,
             r.patient_name AS patientName
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(data) {
    const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);
    
    const startDate = data.start_date || data.startDate || today;
    const logoutDate = data.logout_date || data.logoutDate || null; 
    const notifyDate = data.notify_date || data.notifyDate || null;
    const recordDate = data.record_date || data.recordDate || today;
    const recallDate = data.recall_date || data.recallDate || null;

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

    const billingType = data.billing_type || data.billingType || "Daily";
    const rentalCharge = Number(data.rental_charge ?? data.rentalCharge ?? 0) || 0;
    const depositAdvance = Number(data.deposit_advance ?? data.depositAdvance ?? 0) || 0;
    const installationCharge = Number(data.installation_charge ?? data.installationCharge ?? 0) || 0;

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.care_center_id || data.careCenterId || null,
      data.equipment_id || data.equipmentId || null,
      (data.patient_name || data.patientName || "Unknown").trim(),
      Number(data.quantity) > 0 ? Number(data.quantity) : 1,
      startDate,
      logoutDate,
      finalStatus,
      data.delivery_status || data.deliveryStatus || "Pending Dispatch",
      data.payment_type || data.paymentType || "Postpaid",
      data.deal_type || data.dealType || "B2B",
      data.unit || "ODCOM",
      data.mode || data.paymentType || "Postpaid",
      notifyDate,
      data.delivery_address || data.deliveryAddress || "",
      data.notes || "",
      accValue,
      data.referral_doctor || data.referral || "",
      data.bed_number || data.bedNo || "",
      data.gst_number || data.gstNo || "",
      billingType,
      rentalCharge,
      depositAdvance,
      installationCharge,
      data.age || "",
      data.attendant_name || data.attendantName || "",
      data.mobile_number || data.mobileNumber || "",
      data.alt_mobile_number || data.altMobileNumber || "",
      data.incharge_mobile || data.inchargeMobile || "",
      data.alt_mobile || data.altMobile || "",
      data.care_address || data.careAddress || "",
      recordDate,
      recallDate
    ];

    await pool.query(sql, values);
    return reqId;
  }

  static async update(id, data) {
    const today = new Date().toISOString().slice(0, 10);
    const startDate = data.start_date || data.startDate || today;
    const logoutDate = data.logout_date || data.logoutDate || null; 
    const notifyDate = data.notify_date || data.notifyDate || null;
    const recordDate = data.record_date || data.recordDate || today;
    const recallDate = data.recall_date || data.recallDate || null;

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    let finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";
    if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
      finalStatus = "Inactive";
    }

    const billingType = data.billing_type || data.billingType || "Daily";
    const rentalCharge = Number(data.rental_charge ?? data.rentalCharge ?? 0) || 0;
    const depositAdvance = Number(data.deposit_advance ?? data.depositAdvance ?? 0) || 0;
    const installationCharge = Number(data.installation_charge ?? data.installationCharge ?? 0) || 0;

    const sql = `
      UPDATE requisitions 
      SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
          start_date = ?, logout_date = ?, status = ?, delivery_status = ?, 
          payment_type = ?, deal_type = ?, unit = ?, mode = ?, notify_date = ?, 
          delivery_address = ?, notes = ?, accessory = ?, referral_doctor = ?, bed_number = ?, gst_number = ?,
          billing_type = ?, rental_charge = ?, deposit_advance = ?, installation_charge = ?,
          age = ?, attendant_name = ?, mobile_number = ?, alt_mobile_number = ?,
          incharge_mobile = ?, alt_mobile = ?, care_address = ?, record_date = ?, recall_date = ?
      WHERE id = ?
    `;
    
    const values = [
      data.care_center_id || data.careCenterId || null, 
      data.equipment_id || data.equipmentId || null, 
      (data.patient_name || data.patientName || "Unknown").trim(), 
      Number(data.quantity) > 0 ? Number(data.quantity) : 1, 
      startDate, 
      logoutDate, 
      finalStatus, 
      data.delivery_status || data.deliveryStatus || "Pending Dispatch", 
      data.payment_type || data.paymentType || "Postpaid", 
      data.deal_type || data.dealType || "B2B", 
      data.unit || "ODCOM", 
      data.mode || data.paymentType || "Postpaid", 
      notifyDate, 
      data.delivery_address || data.deliveryAddress || "", 
      data.notes || "", 
      accValue, 
      data.referral_doctor || data.referral || "", 
      data.bed_number || data.bedNo || "", 
      data.gst_number || data.gstNo || "",
      billingType,
      rentalCharge,
      depositAdvance,
      installationCharge,
      data.age || "",
      data.attendant_name || data.attendantName || "",
      data.mobile_number || data.mobileNumber || "",
      data.alt_mobile_number || data.altMobileNumber || "",
      data.incharge_mobile || data.inchargeMobile || "",
      data.alt_mobile || data.altMobile || "",
      data.care_address || data.careAddress || "",
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