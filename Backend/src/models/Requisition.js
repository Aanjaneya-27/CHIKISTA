const pool = require("../config/database");

function formatMySQLDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 2 && parts[2].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`; 
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

class Requisition {
  static async getAll() {
    const sql = `SELECT * FROM requisitions ORDER BY created_at DESC`;
    const [rows] = await pool.query(sql);
    return rows;
  }
  
  static async findById(id) {
    const sql = `SELECT * FROM requisitions WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  }

  static async create(data) {
    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, logout_date, bed_no, referral, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.id, data.care_center_id, data.equipment_id, data.patient_name, data.quantity, 
      formatMySQLDate(data.start_date || data.loginDate), data.payment_type, data.deal_type, data.unit, data.mode, 
      formatMySQLDate(data.notify_date) || null, data.delivery_address, data.notes || null, 
      formatMySQLDate(data.logout_date || data.logoutDate) || null, data.bed_no || null, data.referral || null, data.status || 'Active' 
    ];
    await pool.query(sql, values);
  }

 static async update(id, data) {
    let accValue = data.accessory || data.accessories || "";
    if (Array.isArray(accValue)) {
        accValue = accValue.length > 0 ? accValue.join(", ") : "";
    }

    const sql = `
       UPDATE requisitions 
       SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
           start_date = ?, payment_type = ?, deal_type = ?, unit = ?, 
           mode = ?, notify_date = ?, delivery_address = ?, notes = ?,
           logout_date = ?, bed_no = ?, referral = ?, status = ?, accessory = ?
       WHERE id = ?
    `;
    
    const values = [
      data.care_center_id || data.careCenterId, 
      data.equipment_id || data.equipmentId, 
      data.patient_name || data.patientName, 
      data.quantity, 
      formatMySQLDate(data.start_date || data.startDate), 
      data.payment_type || data.paymentType, 
      data.deal_type || data.dealType, 
      data.unit, 
      data.mode, 
      formatMySQLDate(data.notify_date || data.notifyDate), 
      data.delivery_address || data.deliveryAddress, 
      data.notes || null, 
      formatMySQLDate(data.logout_date || data.logoutDate), 
      data.bed_no || data.bedNo || "",       
      data.referral || "",                   
      data.status || 'Pending', 
      accValue, 
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