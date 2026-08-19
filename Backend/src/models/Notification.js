const pool = require("../config/database");

class Notification {
  static async create({ type = "INFO", title, message, careCenterId = null }) {
    try {
      const cleanCcId = careCenterId && careCenterId !== "other" && !isNaN(Number(careCenterId)) 
        ? Number(careCenterId) 
        : null;

      const query = `
        INSERT INTO notifications (type, title, message, care_center_id, is_read, created_at)
        VALUES (?, ?, ?, ?, 0, NOW())
      `;
      const [result] = await pool.query(query, [type, title, message, cleanCcId]);
      console.log(" [NOTIF INSERTED]: ID =", result.insertId);
      return result.insertId;
    } catch (err) {
      console.error("Notification DB Save Error:", err.message);
      return null;
    }
  }

  static async getAll(careCenterId = null, role = null) {
    try {
      const isAdmin = role === "super_admin" || role === "admin" || !careCenterId || careCenterId === "All";

      let query = `SELECT * FROM notifications`;
      const params = [];

      if (!isAdmin) {
        query += ` WHERE (care_center_id = ? OR care_center_id IS NULL)`;
        params.push(Number(careCenterId));
      }

      query += ` ORDER BY id DESC LIMIT 50`;

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error(" Notification Fetch Error:", err.message);
      return [];
    }
  }

  static async markAsRead(id) {
    try {
      await pool.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
      return true;
    } catch (err) {
      console.error(" Mark Read Error:", err.message);
      return false;
    }
  }
}

module.exports = Notification;