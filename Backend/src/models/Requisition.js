const pool = require("../config/database");

function formatMySQLDate(dateStr) {
  if (!dateStr || dateStr === "null" || dateStr === "undefined") return null;
  const s = String(dateStr).trim();
  if (!s) return null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  
  // ISO format
  if (s.includes("T")) return s.split("T")[0];
  const parts = s.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
    }
  }

  const d = new Date(s);
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
    const reqId = data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Strict Date Parsing with NOT NULL safety fallbacks
    const today = new Date().toISOString().slice(0, 10);
    const startDateVal = formatMySQLDate(data.start_date || data.startDate || data.loginDate) || today;
    const logoutDateVal = formatMySQLDate(data.logout_date || data.logoutDate) || startDateVal; // Guaranteed NOT NULL
    const notifyDateVal = formatMySQLDate(data.notify_date || data.notifyDate);

    let accValue = data.accessory || data.accessories || "";
    if (Array.isArray(accValue)) {
      accValue = accValue.length > 0 ? accValue.join(", ") : "";
    }

    const sql = `
      INSERT INTO requisitions 
      (id, care_center_id, equipment_id, patient_name, quantity, start_date, payment_type, deal_type, unit, mode, notify_date, delivery_address, notes, logout_date, bed_no, referral, status, accessory) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqId,
      data.care_center_id || data.careCenterId || "CARE-001",
      data.equipment_id || data.equipmentId || data.deviceModel || "EQ-001",
      data.patient_name || data.patientName || "Unknown",
      data.quantity || 1,
      startDateVal,
      data.payment_type || data.paymentType || "Postpaid",
      data.deal_type || data.dealType || "B2B",
      data.unit || "ODCOM",
      data.mode || "Postpaid",
      notifyDateVal,
      data.delivery_address || data.deliveryAddress || "N/A",
      data.notes || "",
      logoutDateVal, // Ensures NOT NULL condition passes 100%
      data.bed_no || data.bedNo || "",
      data.referral || "",
      data.status || 'Active',
      accValue
    ];

    await pool.query(sql, values);
  }

  static async update(id, data) {
    let accValue = data.accessory || data.accessories || "";
    if (Array.isArray(accValue)) {
      accValue = accValue.length > 0 ? accValue.join(", ") : "";
    }

    const today = new Date().toISOString().slice(0, 10);
    const startDateVal = formatMySQLDate(data.start_date || data.startDate) || today;
    const logoutDateVal = formatMySQLDate(data.logout_date || data.logoutDate) || startDateVal; // Guaranteed NOT NULL
    const notifyDateVal = formatMySQLDate(data.notify_date || data.notifyDate);

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
      data.quantity || 1, 
      startDateVal, 
      data.payment_type || data.paymentType, 
      data.deal_type || data.dealType, 
      data.unit, 
      data.mode, 
      notifyDateVal, 
      data.delivery_address || data.deliveryAddress, 
      data.notes || "", 
      logoutDateVal, 
      data.bed_no || data.bedNo || "",       
      data.referral || "",                   
      data.status || 'Active', 
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