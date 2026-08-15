// const pool = require("../config/database");

// class User {
//   static async findByEmail(email) {
//     const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
//     return rows[0];
//   }

//   static async create(name, email, password, role) {
//     const [result] = await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
//       [name, email, password, role]
//     );
//     return result.insertId;
//   }
// }
// module.exports = User;

const pool = require("../config/database");

class User {
  //  Find by Phone
  static async findByPhone(phone) {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);
    return rows[0];
  }

  //  Find by Email ()
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  //  Create New User with Phone & Role
  static async create(name, phone, password, role, email = null) {
    const [result] = await pool.query(
      "INSERT INTO users (name, phone, password, role, email) VALUES (?, ?, ?, ?, ?)",
      [name, phone, password, role, email]
    );
    return result.insertId;
  }
}

module.exports = User;