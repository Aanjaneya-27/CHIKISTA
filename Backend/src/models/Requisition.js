const pool = require("../config/database");

const safeDate = (val1, val2, allowNull = false) => {
  let d = val1 || val2;
  const today = new Date().toISOString().slice(0, 10);
  if (!d || d === "" || String(d).includes("null") || String(d).includes("undefined")) {
    return allowNull ? null : today;
  }
  try {
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? (allowNull ? null : today) : parsed.toISOString().slice(0, 10);
  } catch (e) {
    return allowNull ? null : today;
  }
};

class Requisition {
  static async getAll() {
    const [rows] = await pool.query(`SELECT * FROM requisitions ORDER BY created_at DESC`);
    return rows;
  }
  
  static async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM requisitions WHERE id = ?`, [id]);
    return rows[0];
  }

  static async create(data) {
    const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // NOT NULL columns (allowNull = false)
    const startDate = safeDate(data.start_date, data.startDate, false);
    const logoutDate = safeDate(data.logout_date, data.logoutDate, false);
    // NULLable column (allowNull = true)
    const notifyDate = safeDate(data.notify_date, data.notifyDate, true);

    // FIX: 'accessories' naam hai database mein
    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessories, referral, bed_no) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.care_center_id || data.careCenterId || "CARE-NEW", // NOT NULL
      data.equipment_id || data.equipmentId || data.deviceModel || "EQ-NEW", // NOT NULL
      data.patient_name || data.patientName || "Unknown Patient", // NOT NULL
      data.quantity || 1,
      startDate, // NOT NULL
      logoutDate, // NOT NULL
      data.status || "Pending",
      data.delivery_status || data.deliveryStatus || "Pending Dispatch",
      data.payment_type || data.paymentType || null,
      data.deal_type || data.dealType || null,
      data.unit || null,
      data.mode || null,
      notifyDate, // YES NULL
      data.delivery_address || data.deliveryAddress || null,
      data.notes || null,
      accValue || null, // accessories (YES NULL)
      data.referral || null,
      data.bed_no || data.bedNo || null
    ];

    await pool.query(sql, values);
  }

  static async update(id, data) {
    const startDate = safeDate(data.start_date, data.startDate, false);
    const logoutDate = safeDate(data.logout_date, data.logoutDate, false);
    const notifyDate = safeDate(data.notify_date, data.notifyDate, true);

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const sql = `
       UPDATE requisitions 
       SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
           start_date = ?, logout_date = ?, status = ?, delivery_status = ?, 
           payment_type = ?, deal_type = ?, unit = ?, mode = ?, notify_date = ?, 
           delivery_address = ?, notes = ?, accessories = ?, referral = ?, bed_no = ?
       WHERE id = ?
    `;
    
    const values = [
      data.care_center_id || data.careCenterId, 
      data.equipment_id || data.equipmentId, 
      data.patient_name || data.patientName, 
      data.quantity || 1, 
      startDate, 
      logoutDate, 
      data.status || "Active", 
      data.delivery_status || data.deliveryStatus || "Pending Dispatch", 
      data.payment_type || data.paymentType || null, 
      data.deal_type || data.dealType || null, 
      data.unit || null, 
      data.mode || null, 
      notifyDate, 
      data.delivery_address || data.deliveryAddress || null, 
      data.notes || null, 
      accValue || null, 
      data.referral || null, 
      data.bed_no || data.bedNo || null, 
      id 
    ];

    await pool.query(sql, values);
  }
  
  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;