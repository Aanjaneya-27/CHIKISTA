const pool = require("../config/database");

// Ironclad Date Formatter
const safeDate = (val) => {
  const today = new Date().toISOString().slice(0, 10);
  if (!val || val === "" || String(val).trim().toLowerCase() === "null") return today;
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
  } catch (err) {
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
    
    // Strict NOT NULL columns
    const startDate = safeDate(data.start_date || data.startDate);
    const logoutDate = safeDate(data.logout_date || data.logoutDate);

    // Ensure array accessories are converted to string
    let accValue = data.accessories || data.accessory || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    // The query EXACTLY matches your schema columns
    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, logout_date, status, delivery_status, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, accessories, referral, bed_no) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.care_center_id || data.careCenterId || "CARE-NEW", // Must exist in care_centers if foreign key exists
      data.equipment_id || data.equipmentId || "EQ-NEW",       // Must exist in equipment if foreign key exists
      data.patient_name || data.patientName || "Unknown",
      data.quantity || 1,
      startDate,
      logoutDate,
      data.status || "Pending",
      data.delivery_status || data.deliveryStatus || "Pending Dispatch",
      data.payment_type || data.paymentType || "Cash",
      data.deal_type || data.dealType || "Rental",
      data.unit || "Unit",
      data.mode || "Mode",
      data.notify_date || data.notifyDate || null, // Allowed to be NULL
      data.delivery_address || data.deliveryAddress || "Not Provided",
      data.notes || "",
      accValue,
      data.referral || "",
      data.bed_no || data.bedNo || ""
    ];

    await pool.query(sql, values);
  }

  static async update(id, data) {
    const startDate = safeDate(data.start_date || data.startDate);
    const logoutDate = safeDate(data.logout_date || data.logoutDate);

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
      data.care_center_id || data.careCenterId || "CARE-NEW", 
      data.equipment_id || data.equipmentId || "EQ-NEW", 
      data.patient_name || data.patientName || "Unknown", 
      data.quantity || 1, 
      startDate, 
      logoutDate, 
      data.status || "Pending", 
      data.delivery_status || data.deliveryStatus || "Pending Dispatch", 
      data.payment_type || data.paymentType || "Cash", 
      data.deal_type || data.dealType || "Rental", 
      data.unit || "Unit", 
      data.mode || "Mode", 
      data.notify_date || data.notifyDate || null, 
      data.delivery_address || data.deliveryAddress || "Not Provided", 
      data.notes || "", 
      accValue, 
      data.referral || "", 
      data.bed_no || data.bedNo || "", 
      id 
    ];

    await pool.query(sql, values);
  }
  
  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;