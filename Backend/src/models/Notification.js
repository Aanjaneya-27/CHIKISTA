// const pool = require("../config/database");

// class Notification {
//   static async getAll() {
//     const [rows] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20");
//     return rows;
//   }
//   static async create(type, title, message) {
//     await pool.query(
//       "INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)",
//       [type, title, message]
//     );
//   }
// }
// module.exports = Notification;

const pool = require("../config/database");

class Notification {
  static async getAll(careCenterId = null, role = null) {
    try {
      if (role === "super_admin" || role === "admin" || !careCenterId || careCenterId === "All") {
        const [rows] = await pool.query(
          "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 30"
        );
        return rows;
      }

      const [rows] = await pool.query(
        `SELECT * FROM notifications 
         WHERE care_center_id = ? 
            OR care_center_id LIKE ? 
            OR care_center_id IS NULL 
         ORDER BY created_at DESC LIMIT 30`,
        [careCenterId, `%${careCenterId}%`]
      );
      return rows;
    } catch (error) {
      console.error("Notification Fetch Error:", error.message);
      const [fallbackRows] = await pool.query(
        "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20"
      );
      return fallbackRows;
    }
  }

  static async create(type, title, message, careCenterId = null) {
    try {
      await pool.query(
        "INSERT INTO notifications (type, title, message, care_center_id) VALUES (?, ?, ?, ?)",
        [type, title, message, careCenterId]
      );
    } catch (error) {
      await pool.query(
        "INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)",
        [type, title, message]
      );
    }
  }
}

module.exports = Notification;