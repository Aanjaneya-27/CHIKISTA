

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const pool = require("../config/database");

// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET || "chikitsa_secret_key_2026", {
//     expiresIn: "7d"
//   });
// };

// const register = async (req, res) => {
//   const { name, phone, role = "care_center" } = req.body;

//   try {
//     const cleanPhone = (phone || "").toString().replace(/\D/g, "");

//     if (!name || cleanPhone.length < 10) {
//       return res.status(400).json({ message: "Valid Name and 10-digit Phone number are required." });
//     }

//     const [existing] = await pool.query("SELECT id FROM users WHERE phone = ?", [cleanPhone]);
//     if (existing && existing.length > 0) {
//       return res.status(400).json({ message: "This phone number is already registered. Please login." });
//     }

//     const autoPassword = cleanPhone.slice(-4);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(autoPassword, salt);

//     const [userResult] = await pool.query(
//       "INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)",
//       [name.trim(), cleanPhone, hashedPassword, role]
//     );

//     const userId = userResult.insertId;
//     const masterId = `CC-${userId}`;

//     if (role === "care_center") {
//       try {
//         await pool.query(
//           "INSERT INTO care_centers (id, name, phone, address, contact_person, status) VALUES (?, ?, ?, '', '', 'Active')",
//           [masterId, name.trim(), cleanPhone]
//         );
//       } catch (err) {
//         await pool.query(
//           "INSERT INTO care_centers (name, phone, address, contact_person, status) VALUES (?, ?, '', '', 'Active')",
//           [name.trim(), cleanPhone]
//         );
//       }
//     }

//     const token = generateToken(userId, role);

//     return res.status(201).json({
//       message: "Registration successful!",
//       token,
//       user: {
//         id: userId,
//         name: name.trim(),
//         phone: cleanPhone,
//         role,
//         careCenterId: role === "care_center" ? masterId : null,
//         careCenterName: role === "care_center" ? name.trim() : null
//       }
//     });
//   } catch (error) {
//     console.error("REGISTER ERROR:", error);
//     return res.status(500).json({ message: "Database Error: " + (error.sqlMessage || error.message) });
//   }
// };

// const login = async (req, res) => {
//   const { identifier, email, phone, password } = req.body;

//   try {
//     const loginInput = (identifier || email || phone || "").toString().trim();
//     const inputPass = (password || "").toString().trim();

//     if (!loginInput || !inputPass) {
//       return res.status(400).json({ message: "Email/Phone and Password are required." });
//     }

//     if (loginInput.toLowerCase() === "admin" && inputPass === "admin") {
//       const token = generateToken("ADMIN-01", "super_admin");
//       return res.status(200).json({
//         message: "Super Admin Login Successful",
//         token,
//         user: { id: "ADMIN-01", name: "Super Admin", role: "super_admin", email: "admin@chikitsa.com" }
//       });
//     }

//     let user = null;

//     if (loginInput.includes("@")) {
//       user = await User.findByEmail(loginInput);
//     } else {
//       const cleanPhone = loginInput.replace(/\D/g, "");
//       user = await User.findByPhone(cleanPhone);
//     }

//     if (!user) {
//       return res.status(400).json({ message: "User not found. Please check your credentials or register." });
//     }

//     const isMatch = await bcrypt.compare(inputPass, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid Password or Passcode." });
//     }

//     const token = generateToken(user.id, user.role);
//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         careCenterId: user.role === "care_center" ? user.id : null,
//         careCenterName: user.role === "care_center" ? user.name : null
//       }
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// const updateProfile = async (req, res) => {
//   const { id, name, phone, email, address, contactPerson, role } = req.body;
//   const userId = id || req.user?.id;

//   try {
//     const cleanPhone = phone ? phone.toString().replace(/\D/g, "") : null;

//     // 1. Update `users` table
//     await pool.query(
//       `UPDATE users 
//        SET name = COALESCE(?, name), 
//            email = COALESCE(?, email), 
//            phone = COALESCE(?, phone) 
//        WHERE id = ? OR phone = ?`,
//       [name?.trim() || null, email?.trim() || null, cleanPhone, userId, cleanPhone]
//     );

//     if (role === "care_center" || role === "Care Center") {
//       const cleanId = userId ? userId.toString().replace(/\D/g, "") : "";
//       await pool.query(
//         `UPDATE care_centers 
//          SET name = COALESCE(?, name), 
//              phone = COALESCE(?, phone), 
//              address = COALESCE(?, address), 
//              contact_person = COALESCE(?, contact_person) 
//          WHERE id = ? OR id = ? OR phone = ?`,
//         [name?.trim() || null, cleanPhone, address?.trim() || null, contactPerson?.trim() || null, userId, cleanId, cleanPhone]
//       ).catch(() => {});
//     }

//     return res.status(200).json({
//       message: "Profile details updated successfully!",
//       user: { id: userId, name, phone: cleanPhone, email, address, contactPerson, role }
//     });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     return res.status(500).json({ message: "Database Error: " + (error.sqlMessage || error.message) });
//   }
// };

// const changePassword = async (req, res) => {
//   const { userId, phone, currentPassword, newPassword } = req.body;

//   try {
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: "Both current and new password are required." });
//     }

//     if (newPassword.length < 4) {
//       return res.status(400).json({ message: "New password must be at least 4 characters long." });
//     }

//     // 1. Fetch user from DB
//     const [users] = await pool.query(
//       "SELECT * FROM users WHERE id = ? OR phone = ?",
//       [userId || -1, phone || ""]
//     );

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "User account not found." });
//     }

//     const user = users[0];

//     let isMatch = false;
//     if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
//       isMatch = await bcrypt.compare(currentPassword, user.password);
//     } else {
//       isMatch = user.password === currentPassword;
//     }

//     if (!isMatch) {
//       return res.status(400).json({ message: "Current password is incorrect." });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);

//     return res.status(200).json({ message: "Password updated successfully!" });
//   } catch (error) {
//     console.error("Change Password Error:", error);
//     return res.status(500).json({ message: "Database Error: " + (error.sqlMessage || error.message) });
//   }
// };

// module.exports = { 
//   register, 
//   login, 
//   updateProfile, 
//   changePassword 
// };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "chikitsa_secret_key_2026";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" });
};

const cleanDigits = (num) => String(num || "").replace(/\D/g, "").slice(-10);

const register = async (req, res) => {
  return res.status(403).json({
    message: "Direct registration is disabled. Accounts are created directly via Super Admin Master Info."
  });
};

const login = async (req, res) => {
  const { identifier, username, email, phone, password } = req.body;

  try {
    const loginInput = String(identifier || username || email || phone || "").trim();
    const inputPass = String(password || "").trim();

    if (!loginInput || !inputPass) {
      return res.status(400).json({ message: "ID/Mobile Number and Password are required." });
    }

    if (loginInput.toLowerCase() === "admin" && inputPass === "admin") {
      const token = generateToken("ADMIN-01", "super_admin");
      return res.status(200).json({
        message: "Super Admin Login Successful",
        token,
        user: {
          id: "ADMIN-01",
          name: "Super Admin",
          role: "super_admin",
          email: "admin@chikitsa.com"
        }
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR phone = ? OR name = ? LIMIT 1",
      [loginInput, loginInput, loginInput]
    );

    if (users && users.length > 0) {
      const user = users[0];
      let isMatch = false;
      if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
        isMatch = await bcrypt.compare(inputPass, user.password);
      } else {
        isMatch = user.password === inputPass;
      }

      if (isMatch) {
        const token = generateToken(user.id, user.role || "super_admin");
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role || "super_admin",
            careCenterId: user.role === "care_center" ? user.id : null,
            careCenterName: user.role === "care_center" ? user.name : null
          }
        });
      }
    }

    const cleanPhone = cleanDigits(loginInput);

    if (cleanPhone.length === 10) {
      const expectedPassword = cleanPhone.slice(-4);

      if (inputPass === expectedPassword) {
        try {
          const [centers] = await pool.query(
            "SELECT * FROM care_centers WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ? LIMIT 1",
            [`%${cleanPhone}`]
          );

          if (centers && centers.length > 0) {
            const cc = centers[0];
            const token = generateToken(cc.id, "care_center");
            return res.status(200).json({
              message: "Care Center Login Successful",
              token,
              user: {
                id: cc.id,
                careCenterId: cc.id,
                name: cc.name,
                role: "care_center",
                phone: cc.phone,
                address: cc.address
              }
            });
          }
        } catch (e) {}

        try {
          const [executives] = await pool.query(
            "SELECT * FROM delivery_executives WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ? LIMIT 1",
            [`%${cleanPhone}`]
          );

          if (executives && executives.length > 0) {
            const de = executives[0];
            const token = generateToken(de.id, "delivery_executive");
            return res.status(200).json({
              message: "Delivery Executive Login Successful",
              token,
              user: {
                id: de.id,
                name: de.name,
                role: "delivery_executive",
                phone: de.phone
              }
            });
          }
        } catch (e) {}

        try {
          const [refs] = await pool.query(
            "SELECT * FROM references_table WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ? LIMIT 1",
            [`%${cleanPhone}`]
          );

          if (refs && refs.length > 0) {
            const ref = refs[0];
            const token = generateToken(ref.id, "reference");
            return res.status(200).json({
              message: "Reference Login Successful",
              token,
              user: {
                id: ref.id,
                name: ref.doctor_name || ref.name,
                role: "reference",
                phone: ref.phone
              }
            });
          }
        } catch (e) {}
      }
    }

    return res.status(400).json({ message: "Invalid credentials or account not found." });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { id, name, phone, email, address, contactPerson, role } = req.body;
  const userId = id || req.user?.id;

  try {
    const cleanPhone = phone ? cleanDigits(phone) : null;

    await pool.query(
      `UPDATE users 
       SET name = COALESCE(?, name), 
           email = COALESCE(?, email), 
           phone = COALESCE(?, phone) 
       WHERE id = ? OR phone = ?`,
      [name?.trim() || null, email?.trim() || null, cleanPhone, userId, cleanPhone]
    ).catch(() => {});

    if (role === "care_center" || role === "Care Center") {
      await pool.query(
        `UPDATE care_centers 
         SET name = COALESCE(?, name), 
             phone = COALESCE(?, phone), 
             address = COALESCE(?, address), 
             contact_person = COALESCE(?, contact_person) 
         WHERE id = ? OR phone = ?`,
        [name?.trim() || null, cleanPhone, address?.trim() || null, contactPerson?.trim() || null, userId, cleanPhone]
      ).catch(() => {});
    }

    return res.status(200).json({
      message: "Profile details updated successfully!",
      user: { id: userId, name, phone: cleanPhone, email, address, contactPerson, role }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Database Error: " + (error.sqlMessage || error.message) });
  }
};

const changePassword = async (req, res) => {
  const { userId, phone, currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required." });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ message: "New password must be at least 4 characters long." });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE id = ? OR phone = ?",
      [userId || -1, phone || ""]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User account not found." });
    }

    const user = users[0];

    let isMatch = false;
    if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
      isMatch = await bcrypt.compare(currentPassword, user.password);
    } else {
      isMatch = user.password === currentPassword;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Database Error: " + (error.sqlMessage || error.message) });
  }
};

module.exports = { 
  register, 
  login, 
  updateProfile, 
  changePassword 
};