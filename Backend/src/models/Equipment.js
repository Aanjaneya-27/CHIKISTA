const pool = require("../config/database");

class Equipment {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM equipment ORDER BY created_at DESC");
    return rows;
  }
  static async create(id, name, category, daily_rate, stock) {
    await pool.query(
      "INSERT INTO equipment (id, name, category, daily_rate, stock) VALUES (?, ?, ?, ?, ?)",
      [id, name, category, daily_rate, stock]
    );
  }
}
module.exports = Equipment;