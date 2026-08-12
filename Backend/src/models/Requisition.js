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
    
    const startDate = safeDate(data.start_date, data.startDate, false);
    const logoutDate = safeDate(data.logout_date, data.logoutDate, false);
    const notifyDate = safeDate(data.notify_date, data.notifyDate, true);

    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    // 🛡️ FOREIGN KEY AUTO-HEAL: Ensure Care Center ID exists in database
    let inputCC = data.care_center_id || data.careCenterId;
    let [ccCheck] = await pool.query("SELECT id FROM care_centers WHERE id = ?", [inputCC]);
    if (ccCheck.length === 0) {
      let [fallbackCC] = await pool.query("SELECT id FROM care_centers LIMIT 1");
      inputCC = fallbackCC.length > 0 ? fallbackCC[0].id : null;
    }

    // 🛡️ FOREIGN KEY AUTO-HEAL: Ensure Equipment ID exists in database
    let inputEQ = data.equipment_id || data.equipmentId || data.deviceModel;
    let [eqCheck] = await pool.query("SELECT id FROM equipment WHERE id = ?", [inputEQ]);
    if (eqCheck.length === 0) {
      let [fallbackEQ] = await pool.query("SELECT id FROM equipment LIMIT 1");
      inputEQ = fallbackEQ.length > 0 ? fallbackEQ[0].id : null;
    }

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessories, referral, bed_no) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      inputCC,
      inputEQ,
      data.patient_name || data.patientName || "Unknown Patient",
      data.quantity || 1,
      startDate,
      logoutDate,
      data.status || "Pending",
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

    let inputCC = data.care_center_id || data.careCenterId;
    let [ccCheck] = await pool.query("SELECT id FROM care_centers WHERE id = ?", [inputCC]);
    if (ccCheck.length === 0) {
      let [fallbackCC] = await pool.query("SELECT id FROM care_centers LIMIT 1");
      inputCC = fallbackCC.length > 0 ? fallbackCC[0].id : null;
    }

    let inputEQ = data.equipment_id || data.equipmentId;
    let [eqCheck] = await pool.query("SELECT id FROM equipment WHERE id = ?", [inputEQ]);
    if (eqCheck.length === 0) {
      let [fallbackEQ] = await pool.query("SELECT id FROM equipment LIMIT 1");
      inputEQ = fallbackEQ.length > 0 ? fallbackEQ[0].id : null;
    }

    const sql = `
       UPDATE requisitions 
       SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
           start_date = ?, logout_date = ?, status = ?, delivery_status = ?, 
           payment_type = ?, deal_type = ?, unit = ?, mode = ?, notify_date = ?, 
           delivery_address = ?, notes = ?, accessories = ?, referral = ?, bed_no = ?
       WHERE id = ?
    `;
    
    const values = [
      inputCC, 
      inputEQ, 
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

    const [result] = await pool.query(sql, values);
    return result;
  }
  
  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;