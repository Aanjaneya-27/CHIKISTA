const pool = require("../config/database");

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
    const {
      id, care_center_id, equipment_id, patient_name, quantity, start_date, 
      payment_type, deal_type, unit, mode, notify_date, delivery_address, notes
    } = data;
    
    await pool.query(
      `INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, care_center_id, equipment_id, patient_name, quantity, start_date, payment_type, deal_type, unit, mode, notify_date || null, delivery_address, notes]
    );
  }
}
module.exports = Requisition;