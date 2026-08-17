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

// Auto-add commercial columns if missing (Safe for all MySQL versions)
(async () => {
  const colsToAdd = [
    "ALTER TABLE requisitions ADD COLUMN billing_type VARCHAR(50) DEFAULT 'Daily'",
    "ALTER TABLE requisitions ADD COLUMN rental_charge DECIMAL(10,2) DEFAULT 0.00",
    "ALTER TABLE requisitions ADD COLUMN deposit_advance DECIMAL(10,2) DEFAULT 0.00",
    "ALTER TABLE requisitions ADD COLUMN installation_charge DECIMAL(10,2) DEFAULT 0.00"
  ];
  for (const sql of colsToAdd) {
    try {
      await pool.query(sql);
    } catch (e) {
      // Ignored if column already exists
    }
  }
})();

const mapField = (colName, data) => {
  switch (colName) {
    case "patient_name": return String(data.patient_name || data.patientName || "Unknown").trim();
    case "care_center_id": return data.care_center_id || data.careCenterId || null;
    case "equipment_id": return data.equipment_id || data.equipmentId || data.deviceModel || null;
    case "quantity": return Number(data.quantity) > 0 ? Number(data.quantity) : 1;
    case "start_date": return data.start_date || data.startDate || null;
    case "logout_date": return data.logout_date || data.logoutDate || null;
    case "status": {
      const logout = data.logout_date || data.logoutDate;
      const today = new Date().toISOString().slice(0, 10);
      if (String(data.status || "").toLowerCase() === "inactive") return "Inactive";
      return (logout && logout <= today) ? "Closed" : "Active";
    }
    case "billing_type": return data.billing_type || data.billingType || "Daily";
    case "rental_charge": return Number(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge) || 0;
    case "deposit_advance": return Number(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance) || 0;
    case "installation_charge": return Number(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge) || 0;
    case "delivery_status": return data.delivery_status || data.deliveryStatus || "Pending Dispatch";
    case "payment_type": return data.payment_type || data.paymentType || data.mode || "Postpaid";
    case "deal_type": return data.deal_type || data.dealType || "B2B";
    case "unit": return data.unit || "ODCOM";
    case "mode": return data.mode || data.paymentType || "Postpaid";
    case "notify_date": return data.notify_date || data.notifyDate || null;
    case "record_date": return data.record_date || data.recordDate || null;
    case "recall_date": return data.recall_date || data.recallDate || null;
    case "delivery_address": return data.delivery_address || data.deliveryAddress || "";
    case "notes": return data.notes || "";
    case "accessory": {
      const acc = data.accessories || data.accessory || "";
      return Array.isArray(acc) ? acc.join(", ") : acc;
    }
    case "referral_doctor": return data.referral_doctor || data.referral || "";
    case "bed_number": return data.bed_number || data.bedNo || "";
    case "gst_number": return data.gst_number || data.gstNo || "";
    case "age": return data.age || "";
    case "attendant_name": return data.attendant_name || data.attendantName || "";
    case "mobile_number": return data.mobile_number || data.mobileNumber || "";
    case "alt_mobile_number": return data.alt_mobile_number || data.altMobileNumber || "";
    case "incharge_mobile": return data.incharge_mobile || data.inchargeMobile || data.phone || "";
    case "alt_mobile": return data.alt_mobile || data.altMobile || "";
    case "care_address": return data.care_address || data.careAddress || "";
    default:
      return data[colName];
  }
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
    return rows.map(r => ({
      ...r,
      billingType: r.billing_type || 'Daily',
      rentalCharge: Number(r.rental_charge) || 0,
      depositAdvance: Number(r.deposit_advance) || 0,
      installationCharge: Number(r.installation_charge) || 0,
      patientName: r.patient_name || '',
      startDate: r.start_date,
      logoutDate: r.logout_date,
      recordDate: r.record_date,
      recallDate: r.recall_date,
      notifyDate: r.notify_date,
      bedNumber: r.bed_number || r.bedNo || '',
      referralDoctor: r.referral_doctor || '',
      gstNumber: r.gst_number || '',
      inchargeMobile: r.incharge_mobile || '',
      altMobile: r.alt_mobile || '',
      attendantName: r.attendant_name || '',
      mobileNumber: r.mobile_number || '',
      altMobileNumber: r.alt_mobile_number || '',
      careAddress: r.care_address || ''
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
      billingType: r.billing_type || 'Daily',
      rentalCharge: Number(r.rental_charge) || 0,
      depositAdvance: Number(r.deposit_advance) || 0,
      installationCharge: Number(r.installation_charge) || 0,
      patientName: r.patient_name || '',
      startDate: r.start_date,
      logoutDate: r.logout_date,
      recordDate: r.record_date,
      recallDate: r.recall_date,
      notifyDate: r.notify_date,
      bedNumber: r.bed_number || r.bedNo || '',
      referralDoctor: r.referral_doctor || '',
      gstNumber: r.gst_number || '',
      inchargeMobile: r.incharge_mobile || '',
      altMobile: r.alt_mobile || '',
      attendantName: r.attendant_name || '',
      mobileNumber: r.mobile_number || '',
      altMobileNumber: r.alt_mobile_number || '',
      careAddress: r.care_address || ''
    };
  }

  static async create(data) {
    const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const [cols] = await pool.query(`SHOW COLUMNS FROM requisitions`);
    const validColNames = cols.map(c => c.Field).filter(c => c !== "created_at" && c !== "updated_at");

    const insertCols = ["id"];
    const insertPlaceholders = ["?"];
    const values = [reqId];

    for (const col of validColNames) {
      if (col === "id") continue;
      const val = mapField(col, data);
      if (val !== undefined && val !== null) {
        insertCols.push(`\`${col}\``);
        insertPlaceholders.push("?");
        values.push(val);
      }
    }

    const sql = `INSERT INTO requisitions (${insertCols.join(", ")}) VALUES (${insertPlaceholders.join(", ")})`;
    await pool.query(sql, values);
    return reqId;
  }

  static async update(id, data) {
    const [cols] = await pool.query(`SHOW COLUMNS FROM requisitions`);
    const validColNames = cols.map(c => c.Field).filter(c => c !== "id" && c !== "created_at" && c !== "updated_at");

    const setClauses = [];
    const values = [];

    for (const col of validColNames) {
      const val = mapField(col, data);
      if (val !== undefined) {
        setClauses.push(`\`${col}\` = ?`);
        values.push(val);
      }
    }

    if (setClauses.length === 0) return;

    values.push(id);
    const sql = `UPDATE requisitions SET ${setClauses.join(", ")} WHERE id = ?`;
    await pool.query(sql, values);
  }

  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;