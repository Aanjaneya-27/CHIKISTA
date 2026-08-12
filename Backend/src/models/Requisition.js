const pool = require("../config/database");

const getStrictDate = (val1, val2) => {
  const today = new Date().toISOString().slice(0, 10); 
  let d = val1 || val2;
  
  if (!d || d === "" || d === "null" || d === "undefined") return today;
  
  try {
    if (typeof d === "string" && d.includes("-") && d.split("-")[0].length === 2) {
      const p = d.split("-");
      return `${p[2]}-${p[1]}-${p[0]}`;
    }
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return today;
    return dateObj.toISOString().slice(0, 10);
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
    // 💥 Guaranteed Safe Values (Koi column khali nahi jayega)
    const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const startDate = getStrictDate(data.start_date, data.startDate);
    const logoutDate = getStrictDate(data.logout_date, data.logoutDate); // Guaranteed NOT NULL
    const notifyDate = getStrictDate(data.notify_date, data.notifyDate);
    
    let accValue = data.accessory || data.accessories || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, logout_date, bed_no, referral, status, accessory) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.care_center_id || data.careCenterId || "N/A",
      data.equipment_id || data.equipmentId || "N/A",
      data.patient_name || data.patientName || "Unknown",
      data.quantity || 1,
      startDate,
      data.payment_type || data.paymentType || "Postpaid",
      data.deal_type || data.dealType || "B2B",
      data.unit || data.unit || "ODCOM",
      data.mode || data.mode || "Postpaid",
      notifyDate,
      data.delivery_address || data.deliveryAddress || "N/A",
      data.notes || "",
      logoutDate, 
      data.bed_no || data.bedNo || "",
      data.referral || "",
      data.status || 'Active',
      accValue
    ];

    await pool.query(sql, values);
  }

  static async update(id, data) {
    const startDate = getStrictDate(data.start_date, data.startDate);
    const logoutDate = getStrictDate(data.logout_date, data.logoutDate);
    const notifyDate = getStrictDate(data.notify_date, data.notifyDate);

    let accValue = data.accessory || data.accessories || "";
    if (Array.isArray(accValue)) accValue = accValue.join(", ");

    const sql = `
       UPDATE requisitions 
       SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
           start_date = ?, payment_type = ?, deal_type = ?, unit = ?, 
           mode = ?, notify_date = ?, delivery_address = ?, notes = ?,
           logout_date = ?, bed_no = ?, referral = ?, status = ?, accessory = ?
       WHERE id = ?
    `;
    
    const values = [
      data.care_center_id || data.careCenterId || "N/A", 
      data.equipment_id || data.equipmentId || "N/A", 
      data.patient_name || data.patientName || "Unknown", 
      data.quantity || 1, 
      startDate, 
      data.payment_type || data.paymentType || "Postpaid", 
      data.deal_type || data.dealType || "B2B", 
      data.unit || data.unit || "ODCOM", 
      data.mode || data.mode || "Postpaid", 
      notifyDate, 
      data.delivery_address || data.deliveryAddress || "N/A", 
      data.notes || "", 
      logoutDate, 
      data.bed_no || data.bedNo || "",       
      data.referral || "",                   
      data.status || 'Active', 
      accValue, 
      id 
    ];

    await pool.query(sql, values);
  }
  
  static async delete(id) {
    await pool.query(`DELETE FROM requisitions WHERE id = ?`, [id]);
  }
}

module.exports = Requisition;