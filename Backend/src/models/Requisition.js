const pool = require("../config/database");

// 100% Safe Date Formatter
const safeDate = (val1, val2) => {
  let d = val1 || val2;
  const today = new Date().toISOString().slice(0, 10);
  if (!d || d === "" || String(d).includes("null")) return today;
  try {
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? today : parsed.toISOString().slice(0, 10);
  } catch (e) {
    return today;
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
    
    // Dates hamesha YYYY-MM-DD jayengi, kabhi NULL nahi.
    const startDate = safeDate(data.start_date, data.startDate);
    const logoutDate = safeDate(data.logout_date, data.logoutDate);

    // 💥 FIX: 'accessory' column hata diya gaya hai taaki MySQL crash na ho.
    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, payment_type, deal_type, unit, mode, delivery_address, notes, logout_date, bed_no, referral, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.care_center_id || data.careCenterId || "CARE-NEW",
      data.equipment_id || data.equipmentId || data.deviceModel || "EQ-NEW",
      data.patient_name || data.patientName || "Unknown Patient",
      data.quantity || 1,
      startDate,
      data.payment_type || data.paymentType || "Postpaid",
      data.deal_type || data.dealType || "B2B",
      data.unit || data.unit || "ODCOM",
      data.mode || data.mode || "Postpaid",
      data.delivery_address || data.deliveryAddress || "N/A",
      data.notes || "",
      logoutDate, 
      data.bed_no || data.bedNo || "",
      data.referral || "",
      data.status || 'Active'
    ];

    await pool.query(sql, values);
  }

  static async update(id, data) {
    const startDate = safeDate(data.start_date, data.startDate);
    const logoutDate = safeDate(data.logout_date, data.logoutDate);

    const sql = `
       UPDATE requisitions 
       SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
           start_date = ?, payment_type = ?, deal_type = ?, unit = ?, 
           mode = ?, delivery_address = ?, notes = ?, logout_date = ?, 
           bed_no = ?, referral = ?, status = ?
       WHERE id = ?
    `;
    
    const values = [
      data.care_center_id || data.careCenterId, 
      data.equipment_id || data.equipmentId, 
      data.patient_name || data.patientName, 
      data.quantity || 1, 
      startDate, 
      data.payment_type || data.paymentType, 
      data.deal_type || data.dealType, 
      data.unit, 
      data.mode, 
      data.delivery_address || data.deliveryAddress, 
      data.notes || "", 
      logoutDate, 
      data.bed_no || data.bedNo || "",       
      data.referral || "",                   
      data.status || 'Active', 
      id 
    ];

    await pool.query(sql, values);
  }
  
  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;