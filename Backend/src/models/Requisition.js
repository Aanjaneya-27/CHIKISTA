
// const pool = require("../config/database");

// (async () => {
//   try {
//     await pool.query("ALTER TABLE requisitions MODIFY COLUMN care_center_id VARCHAR(100) NULL");
//     await pool.query("ALTER TABLE requisitions MODIFY COLUMN equipment_id VARCHAR(100) NULL");
//   } catch (e) {}
// })();

// const cleanDate = (val) => {
//   if (!val || val === "" || val === "null" || val === "undefined" || val === "0000-00-00") return null;
//   const str = String(val).trim().slice(0, 10);
//   return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
// };

// const cleanNum = (val) => {
//   if (val === null || val === undefined || val === "") return 0;
//   const n = parseFloat(val);
//   return isNaN(n) ? 0 : n;
// };

// const cleanFk = (val) => {
//   if (!val || val === "" || val === "null" || val === "undefined" || val === "NEW" || val === "other" || val === "CC-ME") return null;
//   return String(val).trim();
// };

// const cleanStr = (val, fallback = "") => {
//   if (val === null || val === undefined) return fallback;
//   return String(val).trim();
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
//              r.logout_date AS logoutDate,
//              r.start_date AS startDate,
//              r.patient_name AS patientName
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
//              r.logout_date AS logoutDate,
//              r.start_date AS startDate,
//              r.patient_name AS patientName
//       FROM requisitions r
//       LEFT JOIN care_centers c ON r.care_center_id = c.id
//       LEFT JOIN equipment e ON r.equipment_id = e.id
//       WHERE r.id = ?
//     `, [id]);
//     return rows[0];
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
//       cleanStr(data.referral_doctor || data.referral),
//       cleanStr(data.bed_number || data.bedNo),
//       cleanStr(data.gst_number || data.gstNo),
//       cleanStr(data.billing_type || data.billingType, "Daily"),
//       cleanNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge),
//       cleanNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance),
//       cleanNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge),
//       cleanStr(data.age),
//       cleanStr(data.attendant_name || data.attendantName),
//       cleanStr(data.mobile_number || data.mobileNumber),
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

//     // 🔒 COALESCE prevents overriding with NULL when care_center_id is missing
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
//       cleanStr(data.referral_doctor || data.referral), 
//       cleanStr(data.bed_number || data.bedNo), 
//       cleanStr(data.gst_number || data.gstNo), 
//       cleanStr(data.billing_type || data.billingType, "Daily"), 
//       cleanNum(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge), 
//       cleanNum(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance), 
//       cleanNum(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge), 
//       cleanStr(data.age), 
//       cleanStr(data.attendant_name || data.attendantName), 
//       cleanStr(data.mobile_number || data.mobileNumber), 
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

class Requisition {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT r.*, 
             COALESCE(c.name, r.care_center_name, '') AS careCenterName, 
             COALESCE(e.name, r.equipment_name, '') AS equipmentName,
             COALESCE(r.incharge_mobile, c.incharge_mobile, c.mobile, c.phone, '') AS inchargeMobile,
             COALESCE(r.care_address, c.address, '') AS careAddress,
             COALESCE(r.bed_number, r.bed_no, '') AS bedNumber, 
             COALESCE(r.referral_doctor, r.referral, '') AS referralDoctor, 
             COALESCE(r.gst_number, r.gst_no, '') AS gstNumber,
             COALESCE(r.billing_type, 'Daily') AS billingType,
             COALESCE(r.rental_charge, 0) AS rentalCharge,
             COALESCE(r.deposit_advance, 0) AS depositAdvance,
             COALESCE(r.installation_charge, 0) AS installationCharge,
             COALESCE(r.patient_name, '') AS patientName,
             r.mobile_number AS mobileNumber,
             r.alt_mobile_number AS altMobileNumber,
             r.attendant_name AS attendantName,
             r.delivery_address AS deliveryAddress,
             r.record_date AS recordDate,
             r.recall_date AS recallDate,
             r.logout_date AS logoutDate,
             r.start_date AS startDate,
             r.notify_date AS notifyDate
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `);

    return rows.map((r) => ({
      ...r,
      // Dono formats ensure karo (Frontend & Backend compatible)
      billingType: r.billingType || r.billing_type || "Daily",
      billing_type: r.billingType || r.billing_type || "Daily",
      rentalCharge: cleanNum(r.rentalCharge, r.rental_charge),
      rental_charge: cleanNum(r.rentalCharge, r.rental_charge),
      depositAdvance: cleanNum(r.depositAdvance, r.deposit_advance),
      deposit_advance: cleanNum(r.depositAdvance, r.deposit_advance),
      installationCharge: cleanNum(r.installationCharge, r.installation_charge),
      installation_charge: cleanNum(r.installationCharge, r.installation_charge),
      patientName: r.patientName || r.patient_name || "",
      patient_name: r.patientName || r.patient_name || "",
      careCenterName: r.careCenterName || "",
      inchargeMobile: r.inchargeMobile || r.incharge_mobile || "",
      careAddress: r.careAddress || r.care_address || "",
      bedNumber: r.bedNumber || r.bed_number || "",
      bedNo: r.bedNumber || r.bed_number || "",
      referralDoctor: r.referralDoctor || r.referral_doctor || "",
      mobileNumber: r.mobileNumber || r.mobile_number || "",
      attendantName: r.attendantName || r.attendant_name || "",
      deliveryAddress: r.deliveryAddress || r.delivery_address || "",
      startDate: cleanDate(r.startDate || r.start_date),
      logoutDate: cleanDate(r.logoutDate || r.logout_date),
      recordDate: cleanDate(r.recordDate || r.record_date),
      recallDate: cleanDate(r.recallDate || r.recall_date),
      notifyDate: cleanDate(r.notifyDate || r.notify_date)
    }));
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT r.*, 
             COALESCE(c.name, r.care_center_name, '') AS careCenterName, 
             COALESCE(e.name, r.equipment_name, '') AS equipmentName,
             COALESCE(r.incharge_mobile, c.incharge_mobile, c.mobile, c.phone, '') AS inchargeMobile,
             COALESCE(r.care_address, c.address, '') AS careAddress,
             COALESCE(r.bed_number, r.bed_no, '') AS bedNumber, 
             COALESCE(r.referral_doctor, r.referral, '') AS referralDoctor, 
             COALESCE(r.gst_number, r.gst_no, '') AS gstNumber,
             COALESCE(r.billing_type, 'Daily') AS billingType,
             COALESCE(r.rental_charge, 0) AS rentalCharge,
             COALESCE(r.deposit_advance, 0) AS depositAdvance,
             COALESCE(r.installation_charge, 0) AS installationCharge,
             COALESCE(r.patient_name, '') AS patientName,
             r.mobile_number AS mobileNumber,
             r.alt_mobile_number AS altMobileNumber,
             r.attendant_name AS attendantName,
             r.delivery_address AS deliveryAddress,
             r.record_date AS recordDate,
             r.recall_date AS recallDate,
             r.logout_date AS logoutDate,
             r.start_date AS startDate,
             r.notify_date AS notifyDate
      FROM requisitions r
      LEFT JOIN care_centers c ON r.care_center_id = c.id
      LEFT JOIN equipment e ON r.equipment_id = e.id
      WHERE r.id = ?
    `, [id]);

    if (!rows[0]) return null;
    const r = rows[0];
    return {
      ...r,
      billingType: r.billingType || r.billing_type || "Daily",
      billing_type: r.billingType || r.billing_type || "Daily",
      rentalCharge: cleanNum(r.rentalCharge, r.rental_charge),
      rental_charge: cleanNum(r.rentalCharge, r.rental_charge),
      depositAdvance: cleanNum(r.depositAdvance, r.deposit_advance),
      deposit_advance: cleanNum(r.depositAdvance, r.deposit_advance),
      installationCharge: cleanNum(r.installationCharge, r.installation_charge),
      installation_charge: cleanNum(r.installationCharge, r.installation_charge),
      patientName: r.patientName || r.patient_name || "",
      patient_name: r.patientName || r.patient_name || "",
      careCenterName: r.careCenterName || "",
      inchargeMobile: r.inchargeMobile || r.incharge_mobile || "",
      careAddress: r.careAddress || r.care_address || "",
      bedNumber: r.bedNumber || r.bed_number || "",
      bedNo: r.bedNumber || r.bed_number || "",
      referralDoctor: r.referralDoctor || r.referral_doctor || "",
      mobileNumber: r.mobileNumber || r.mobile_number || "",
      attendantName: r.attendantName || r.attendant_name || "",
      deliveryAddress: r.deliveryAddress || r.delivery_address || "",
      startDate: cleanDate(r.startDate || r.start_date),
      logoutDate: cleanDate(r.logoutDate || r.logout_date)
    };
  }

  static async create(data) {
    const reqId = cleanStr(data.id) || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().slice(0, 10);
    const startDate = cleanDate(data.start_date || data.startDate) || today;
    const logoutDate = cleanDate(data.logout_date || data.logoutDate);
    const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

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
      cleanStr(data.referral_doctor || data.referral),
      cleanStr(data.bed_number || data.bedNo),
      cleanStr(data.gst_number || data.gstNo),
      cleanStr(data.billing_type || data.billingType, "Daily"),
      cleanNum(data.rental_charge, data.rentalCharge),
      cleanNum(data.deposit_advance, data.depositAdvance),
      cleanNum(data.installation_charge, data.installationCharge),
      cleanStr(data.age),
      cleanStr(data.attendant_name || data.attendantName),
      cleanStr(data.mobile_number || data.mobileNumber),
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
    const today = new Date().toISOString().slice(0, 10);
    const startDate = cleanDate(data.start_date || data.startDate) || today;
    const logoutDate = cleanDate(data.logout_date || data.logoutDate);
    let finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";
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
      cleanStr(data.referral_doctor || data.referral), 
      cleanStr(data.bed_number || data.bedNo), 
      cleanStr(data.gst_number || data.gstNo), 
      cleanStr(data.billing_type || data.billingType, "Daily"), 
      cleanNum(data.rental_charge, data.rentalCharge), 
      cleanNum(data.deposit_advance, data.depositAdvance), 
      cleanNum(data.installation_charge, data.installationCharge), 
      cleanStr(data.age), 
      cleanStr(data.attendant_name || data.attendantName), 
      cleanStr(data.mobile_number || data.mobileNumber), 
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