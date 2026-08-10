const pool = require("../config/database");

function formatMySQLDate(dateStr) {
  if (!dateStr) return null;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; 
    }
  }
  
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  
  return null;
}

class Requisition {
  static async getAll() {
    const query = `
      SELECT r.*, c.name as careCenterName, e.name as equipmentName, e.category 
      FROM requisitions r
      JOIN care_centers c ON r.care_center_id = c.id
      JOIN equipment e ON r.equipment_id = e.id
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async create(data) {
    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, logout_date, bed_no, referral, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.id, 
      data.care_center_id, 
      data.equipment_id, 
      data.patient_name, 
      data.quantity, 
      data.start_date || data.loginDate, 
      data.payment_type, 
      data.deal_type, 
      data.unit, 
      data.mode, 
      data.notify_date || null, 
      data.delivery_address, 
      data.notes || null, 
      data.logout_date || data.logoutDate || null, 
      data.bed_no || null,  
      data.referral || null,  
      data.status || 'Active' 
    ];
    await pool.query(sql, values);
  }

 static async update(id, data) {
    const patientName = data.patient_name || data.patientName;
    const careCenterId = data.care_center_id || data.careCenterId;
    const equipmentId = data.equipment_id || data.equipmentId;
    const startDate = data.start_date || data.startDate;
    const logoutDate = data.logout_date || data.logoutDate || null;
    const notifyDate = data.notify_date || data.notifyDate || null;
    const paymentType = data.payment_type || data.paymentType;
    const dealType = data.deal_type || data.dealType;
    const deliveryAddress = data.delivery_address || data.deliveryAddress;

    const sql = `
       UPDATE requisitions 
       SET care_center_id = ?, equipment_id = ?, patient_name = ?, quantity = ?, 
           start_date = ?, payment_type = ?, deal_type = ?, unit = ?, 
           mode = ?, notify_date = ?, delivery_address = ?, notes = ?,
           logout_date = ?, status = ?
       WHERE id = ?
    `;
    
    const values = [
      careCenterId, 
      equipmentId, 
      patientName, 
      data.quantity, 
      startDate, 
      paymentType, 
      dealType, 
      data.unit, 
      data.mode, 
      notifyDate, 
      deliveryAddress, 
      data.notes || null, 
      logoutDate, 
      data.status || 'Pending', 
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