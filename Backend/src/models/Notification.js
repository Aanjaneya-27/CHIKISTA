// const pool = require("../config/database");

// class Notification {
//   static async getAll(careCenterId = null, role = null) {
//     try {
//       if (role === "super_admin" || role === "admin" || !careCenterId || careCenterId === "All") {
//         const [rows] = await pool.query(
//           "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 30"
//         );
//         return rows;
//       }

//       const [rows] = await pool.query(
//         `SELECT * FROM notifications 
//          WHERE care_center_id = ? 
//             OR care_center_id LIKE ? 
//             OR care_center_id IS NULL 
//          ORDER BY created_at DESC LIMIT 30`,
//         [careCenterId, `%${careCenterId}%`]
//       );
//       return rows;
//     } catch (error) {
//       console.error("Notification Fetch Error:", error.message);
//       const [fallbackRows] = await pool.query(
//         "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20"
//       );
//       return fallbackRows;
//     }
//   }

//   static async create(type, title, message, careCenterId = null) {
//     try {
//       await pool.query(
//         "INSERT INTO notifications (type, title, message, care_center_id) VALUES (?, ?, ?, ?)",
//         [type, title, message, careCenterId]
//       );
//     } catch (error) {
//       await pool.query(
//         "INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)",
//         [type, title, message]
//       );
//     }
//   }
// }

// module.exports = Notification;

const pool = require("../config/database");

class Notification {
  static async getAll(careCenterId = null, role = null) {
    try {
      if (role === "super_admin" || role === "admin" || !careCenterId || careCenterId === "All") {
        const [rows] = await pool.query(
          "SELECT * FROM notifications ORDER BY id DESC LIMIT 30"
        );
        return rows;
      }

      const cleanId = careCenterId.toString().replace(/\D/g, "");
      const [rows] = await pool.query(
        `SELECT * FROM notifications 
         WHERE care_center_id = ? 
            OR care_center_id = ? 
            OR care_center_id LIKE ?
            OR care_center_id IS NULL
         ORDER BY id DESC LIMIT 30`,
        [careCenterId, cleanId, `%${cleanId}%`]
      );
      return rows;
    } catch (error) {
      console.error("Notification DB Error:", error.message);
      const [fallback] = await pool.query("SELECT * FROM notifications ORDER BY id DESC LIMIT 20");
      return fallback;
    }
  }

  static async create(type, title, message, careCenterId = null) {
    try {
      await pool.query(
        "INSERT INTO notifications (type, title, message, care_center_id) VALUES (?, ?, ?, ?)",
        [type || "info", title, message, careCenterId]
      );
    } catch (error) {
      await pool.query(
        "INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)",
        [type || "info", title, message]
      );
    }
  }
}

module.exports = Notification;