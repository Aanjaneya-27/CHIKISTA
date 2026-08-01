const pool = require("../config/database");

class Notification {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20");
    return rows;
  }
  static async create(type, title, message) {
    await pool.query(
      "INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)",
      [type, title, message]
    );
  }
}
module.exports = Notification;