// const pool = require("../config/database");

// class Notification {
 
//   static async getAll(careCenterId = null, role = null) {
//     try {
//       const isAdmin = role === "super_admin" || role === "admin" || !careCenterId || careCenterId === "All";

//       let reminderQuery = `
//         SELECT 
//           CONCAT('REMINDER_', id) AS id,
//           'DUE_REMINDER' AS type,
//           'Payment / Due Date Reminder' AS title,
//           CONCAT('Reminder for ', patient_name, ' (', COALESCE(equipment_name, 'Device'), '). Notify date reached.') AS message,
//           care_center_id,
//           notify_date AS created_at,
//           0 AS is_read
//         FROM requisitions
//         WHERE notify_date IS NOT NULL 
//           AND notify_date <= CURDATE()
//           AND (recall_date IS NULL OR recall_date = '')
//           AND (status IS NULL OR LOWER(status) != 'closed' AND LOWER(status) != 'inactive')
//       `;
//       const reminderParams = [];

//       if (!isAdmin) {
//         const cleanId = careCenterId.toString().replace(/\D/g, "");
//         reminderQuery += ` AND (care_center_id = ? OR care_center_id = ? OR care_center_id LIKE ? OR care_center_id IS NULL)`;
//         reminderParams.push(careCenterId, cleanId, `%${cleanId}%`);
//       }

//       const [reminders] = await pool.query(reminderQuery, reminderParams).catch(() => [[]]);
//       let notifQuery = "";
//       let notifParams = [];

//       if (isAdmin) {
//         notifQuery = "SELECT * FROM notifications ORDER BY id DESC LIMIT 30";
//       } else {
//         const cleanId = careCenterId.toString().replace(/\D/g, "");
//         notifQuery = `
//           SELECT * FROM notifications 
//           WHERE care_center_id = ? 
//              OR care_center_id = ? 
//              OR care_center_id LIKE ?
//              OR care_center_id IS NULL
//           ORDER BY id DESC LIMIT 30
//         `;
//         notifParams = [careCenterId, cleanId, `%${cleanId}%`];
//       }

//       const [storedNotifications] = await pool.query(notifQuery, notifParams);
//       return [...reminders, ...storedNotifications];
//     } catch (error) {
//       console.error("Notification DB Error:", error.message);
//       try {
//         const [fallback] = await pool.query("SELECT * FROM notifications ORDER BY id DESC LIMIT 20");
//         return fallback;
//       } catch {
//         return [];
//       }
//     }
//   }

 
//   static async create(type, title, message, careCenterId = null) {
//     try {
//       await pool.query(
//         "INSERT INTO notifications (type, title, message, care_center_id, created_at) VALUES (?, ?, ?, ?, NOW())",
//         [type || "info", title, message, careCenterId]
//       );
//     } catch {
//       try {
//         await pool.query(
//           "INSERT INTO notifications (type, title, message, care_center_id) VALUES (?, ?, ?, ?)",
//           [type || "info", title, message, careCenterId]
//         );
//       } catch {
//         await pool.query(
//           "INSERT INTO notifications (type, title, message) VALUES (?, ?, ?)",
//           [type || "info", title, message]
//         );
//       }
//     }
//   }
// }

// module.exports = Notification;

const pool = require("../config/database");

class Notification {
  static async getAll(careCenterId = null, role = null) {
    try {
      const isAdmin = role === "super_admin" || role === "admin" || !careCenterId || careCenterId === "All";
      let query = `
        SELECT 
          id,
          CASE 
            WHEN status = 'Closed' THEN 'CLOSED'
            ELSE 'UPDATE'
          END AS type,
          CONCAT('Requisition #', id) AS title,
          CONCAT('Patient: ', patient_name, ' (', COALESCE(equipment_name, 'Device'), ') - Status: ', COALESCE(status, 'Active')) AS message,
          care_center_id,
          COALESCE(start_date, NOW()) AS created_at,
          0 AS is_read
        FROM requisitions
        WHERE 1=1
      `;

      const params = [];

      if (!isAdmin) {
        const cleanId = careCenterId.toString().replace(/\D/g, "");
        query += ` AND (care_center_id = ? OR care_center_id = ? OR care_center_id LIKE ? OR care_center_id IS NULL)`;
        params.push(careCenterId, cleanId, `%${cleanId}%`);
      }

      query += ` ORDER BY id DESC LIMIT 30`;

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error("Notification DB Error:", error.message);
      return [];
    }
  }

  static async create(type, title, message, careCenterId = null) {
    return true;
  }
}

module.exports = Notification;