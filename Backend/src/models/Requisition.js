// const pool = require("../config/database");

// (async () => {
//   try {
//     await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS billing_type VARCHAR(50) DEFAULT 'Daily'");
//     await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS rental_charge DECIMAL(10,2) DEFAULT 0.00");
//     await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS deposit_advance DECIMAL(10,2) DEFAULT 0.00");
//     await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS installation_charge DECIMAL(10,2) DEFAULT 0.00");
//     await pool.query("ALTER TABLE requisitions MODIFY COLUMN logout_date DATE NULL");
//     await pool.query("ALTER TABLE requisitions MODIFY COLUMN recall_date DATE NULL");
//   } catch (e) {
//     // Ignore alter errors if already present
//   }
// })();

// const safeDate = (val) => {
//   if (!val || val === "" || String(val).trim().toLowerCase() === "null" || String(val).trim().toLowerCase() === "undefined") {
//     const now = new Date();
//     const y = now.getFullYear();
//     const m = String(now.getMonth() + 1).padStart(2, "0");
//     const d = String(now.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   }
//   const str = String(val).trim();
//   if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
//   try {
//     const d = new Date(val);
//     if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   } catch (err) {
//     return new Date().toISOString().slice(0, 10);
//   }
// };

// const safeOptionalDate = (val) => {
//   if (!val || val === "" || String(val).trim().toLowerCase() === "null" || String(val).trim().toLowerCase() === "undefined" || String(val).trim() === "0000-00-00") {
//     return null;
//   }
//   const str = String(val).trim();
//   if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
//   try {
//     const d = new Date(val);
//     if (isNaN(d.getTime())) return null;
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   } catch (err) {
//     return null;
//   }
// };

// // Safe Number parser (fixes 0 bug)
// const getNum = (v1, v2) => {
//   if (v1 !== undefined && v1 !== null && v1 !== "") return Number(v1);
//   if (v2 !== undefined && v2 !== null && v2 !== "") return Number(v2);
//   return 0;
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
//     const today = new Date().toISOString().slice(0, 10);
    
//     const startDate = safeDate(data.start_date || data.startDate || data.loginDate);
//     const logoutDate = safeOptionalDate(data.logout_date || data.logoutDate); 
//     const notifyDate = safeOptionalDate(data.notify_date || data.notifyDate);
//     const recordDate = safeOptionalDate(data.record_date || data.recordDate) || safeDate(null);
//     const recallDate = safeOptionalDate(data.recall_date || data.recallDate);

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

//     const billingType = data.billing_type || data.billingType || "Daily";
//     const rentalCharge = getNum(data.rental_charge, data.rentalCharge);
//     const depositAdvance = getNum(data.deposit_advance, data.depositAdvance);
//     const installationCharge = getNum(data.installation_charge, data.installationCharge);

//     const sql = `
//       INSERT INTO requisitions 
//       (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       reqId,
//       data.care_center_id || data.careCenterId || null,
//       data.equipment_id || data.equipmentId || data.deviceModel || null,
//       (data.patient_name || data.patientName || "Unknown").trim(),
//       Number(data.quantity) > 0 ? Number(data.quantity) : 1,
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
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
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
//     const today = new Date().toISOString().slice(0, 10);
//     const startDate = safeDate(data.start_date || data.startDate || data.loginDate);
//     const logoutDate = safeOptionalDate(data.logout_date || data.logoutDate); 
//     const notifyDate = safeOptionalDate(data.notify_date || data.notifyDate);
//     const recordDate = safeOptionalDate(data.record_date || data.recordDate);
//     const recallDate = safeOptionalDate(data.recall_date || data.recallDate);

//     let accValue = data.accessories || data.accessory || "";
//     if (Array.isArray(accValue)) accValue = accValue.join(", ");

//     let finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";
//     if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
//       finalStatus = "Inactive";
//     }

//     const billingType = data.billing_type || data.billingType || "Daily";
//     const rentalCharge = getNum(data.rental_charge, data.rentalCharge);
//     const depositAdvance = getNum(data.deposit_advance, data.depositAdvance);
//     const installationCharge = getNum(data.installation_charge, data.installationCharge);

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
//       data.equipment_id || data.equipmentId || data.deviceModel || null, 
//       (data.patient_name || data.patientName || "Unknown").trim(), 
//       Number(data.quantity) > 0 ? Number(data.quantity) : 1, 
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
//       billingType,
//       rentalCharge,
//       depositAdvance,
//       installationCharge,
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

// 🛠️ Auto-ensure database has all commercial and date columns
(async () => {
  try {
    await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS billing_type VARCHAR(50) DEFAULT 'Daily'");
    await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS rental_charge DECIMAL(10,2) DEFAULT 0.00");
    await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS deposit_advance DECIMAL(10,2) DEFAULT 0.00");
    await pool.query("ALTER TABLE requisitions ADD COLUMN IF NOT EXISTS installation_charge DECIMAL(10,2) DEFAULT 0.00");
    await pool.query("ALTER TABLE requisitions MODIFY COLUMN logout_date DATE NULL");
    await pool.query("ALTER TABLE requisitions MODIFY COLUMN recall_date DATE NULL");
    await pool.query("ALTER TABLE requisitions MODIFY COLUMN notify_date DATE NULL");
    await pool.query("ALTER TABLE requisitions MODIFY COLUMN record_date DATE NULL");
  } catch (e) {
    // Ignore if columns already exist
  }
})();

const safeDate = (val) => {
  if (!val || val === "" || String(val).trim().toLowerCase() === "null" || String(val).trim().toLowerCase() === "undefined") {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (err) {
    return new Date().toISOString().slice(0, 10);
  }
};

const safeOptionalDate = (val) => {
  if (!val || val === "" || String(val).trim().toLowerCase() === "null" || String(val).trim().toLowerCase() === "undefined" || String(val).trim() === "0000-00-00") {
    return null;
  }
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (err) {
    return null;
  }
};

const getNum = (v1, v2) => {
  if (v1 !== undefined && v1 !== null && v1 !== "") return Number(v1);
  if (v2 !== undefined && v2 !== null && v2 !== "") return Number(v2);
  return 0;
};

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
             r.logout_date AS logoutDate
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
             r.logout_date AS logoutDate
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
    
    const startDate = safeDate(data.start_date || data.startDate || data.loginDate);
    const logoutDate = safeOptionalDate(data.logout_date || data.logoutDate); 
    const notifyDate = safeOptionalDate(data.notify_date || data.notifyDate);
    const recordDate = safeOptionalDate(data.record_date || data.recordDate) || safeDate(null);
    const recallDate = safeOptionalDate(data.recall_date || data.recallDate);

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";

    const billingType = data.billing_type || data.billingType || "Daily";
    const rentalCharge = getNum(data.rental_charge, data.rentalCharge);
    const depositAdvance = getNum(data.deposit_advance, data.depositAdvance);
    const installationCharge = getNum(data.installation_charge, data.installationCharge);

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessory, referral_doctor, bed_number, gst_number, billing_type, rental_charge, deposit_advance, installation_charge, age, attendant_name, mobile_number, alt_mobile_number, incharge_mobile, alt_mobile, care_address, record_date, recall_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.care_center_id || data.careCenterId || null,
      data.equipment_id || data.equipmentId || data.deviceModel || null,
      (data.patient_name || data.patientName || "Unknown").trim(),
      Number(data.quantity) > 0 ? Number(data.quantity) : 1,
      startDate,
      logoutDate,
      finalStatus,
      data.delivery_status || data.deliveryStatus || "Pending Dispatch",
      data.payment_type || data.paymentType || data.mode || "Postpaid",
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
      data.incharge_mobile || data.inchargeMobile || data.phone || "",
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
    const startDate = safeDate(data.start_date || data.startDate || data.loginDate);
    const logoutDate = safeOptionalDate(data.logout_date || data.logoutDate); 
    const notifyDate = safeOptionalDate(data.notify_date || data.notifyDate);
    const recordDate = safeOptionalDate(data.record_date || data.recordDate);
    const recallDate = safeOptionalDate(data.recall_date || data.recallDate);

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    let finalStatus = (logoutDate && logoutDate <= today) ? "Closed" : "Active";
    if (String(data.status || data.requisition_status || "").toLowerCase() === "inactive") {
      finalStatus = "Inactive";
    }

    const billingType = data.billing_type || data.billingType || "Daily";
    const rentalCharge = getNum(data.rental_charge, data.rentalCharge);
    const depositAdvance = getNum(data.deposit_advance, data.depositAdvance);
    const installationCharge = getNum(data.installation_charge, data.installationCharge);

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
      data.equipment_id || data.equipmentId || data.deviceModel || null, 
      (data.patient_name || data.patientName || "Unknown").trim(), 
      Number(data.quantity) > 0 ? Number(data.quantity) : 1, 
      startDate, 
      logoutDate, 
      finalStatus, 
      data.delivery_status || data.deliveryStatus || "Pending Dispatch", 
      data.payment_type || data.paymentType || data.mode || "Postpaid", 
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
      data.incharge_mobile || data.inchargeMobile || data.phone || "",
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