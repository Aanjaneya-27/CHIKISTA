const pool = require("../config/database");

class CareCenter {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY created_at DESC");
    return rows;
  }
  static async create(id, name, address, contact_person, phone, gst) {
    await pool.query(
      "INSERT INTO care_centers (id, name, address, contact_person, phone, gst) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, address, contact_person, phone, gst]
    );
  }
}
module.exports = CareCenter;