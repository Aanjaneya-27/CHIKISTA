

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const pool = require("../config/database");

// const JWT_SECRET = process.env.JWT_SECRET || "chikitsa_secret_key_2026";

// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" });
// };

// const cleanDigits = (num) => String(num || "").replace(/\D/g, "").slice(-10);

// const register = async (req, res) => {
//   return res.status(403).json({
//     message: "Direct registration is disabled. Accounts are created directly via Super Admin Master Info."
//   });
// };

// const login = async (req, res) => {
//   const { identifier, username, email, phone, password } = req.body;

//   try {
//     const loginInput = String(identifier || username || email || phone || "").trim();
//     const inputPass = String(password || "").trim();

//     if (!loginInput || !inputPass) {
//       return res.status(400).json({ message: "ID/Mobile Number and Password are required." });
//     }

//     if (loginInput.toLowerCase() === "admin" && inputPass === "admin") {
//       const token = generateToken("ADMIN-01", "super_admin");
//       return res.status(200).json({
//         message: "Super Admin Login Successful",
//         token,
//         user: {
//           id: "ADMIN-01",
//           name: "Super Admin",
//           role: "super_admin",
//           email: "admin@chikitsa.com"
//         }
//       });
//     }

//     const [users] = await pool.query(
//       "SELECT * FROM users WHERE email = ? OR phone = ? OR name = ? LIMIT 1",
//       [loginInput, loginInput, loginInput]
//     );

//     if (users && users.length > 0) {
//       const user = users[0];
//       let isMatch = false;
//       if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
//         isMatch = await bcrypt.compare(inputPass, user.password);
//       } else {
//         isMatch = user.password === inputPass;
//       }

//       if (isMatch) {
//         const token = generateToken(user.id, user.role || "super_admin");
//         return res.status(200).json({
//           message: "Login successful",
//           token,
//           user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             phone: user.phone,
//             role: user.role || "super_admin",
//             careCenterId: user.role === "care_center" ? user.id : null,
//             careCenterName: user.role === "care_center" ? user.name : null
//           }
//         });
//       }
//     }

//     const cleanPhone = cleanDigits(loginInput);

//     if (cleanPhone.length === 10) {
//       const expectedPassword = cleanPhone.slice(-4);

//       if (inputPass === expectedPassword) {
//         try {
//           const [centers] = await pool.query(
//             "SELECT * FROM care_centers WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ? LIMIT 1",
//             [`%${cleanPhone}`]
//           );

//           if (centers && centers.length > 0) {
//             const cc = centers[0];
//             const token = generateToken(cc.id, "care_center");
//             return res.status(200).json({
//               message: "Care Center Login Successful",
//               token,
//               user: {
//                 id: cc.id,
//                 careCenterId: cc.id,
//                 name: cc.name,
//                 role: "care_center",
//                 phone: cc.phone,
//                 address: cc.address
//               }
//             });
//           }
//         } catch (e) {}

//         try {
//           const [executives] = await pool.query(
//             "SELECT * FROM delivery_executives WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ? LIMIT 1",
//             [`%${cleanPhone}`]
//           );

//           if (executives && executives.length > 0) {
//             const de = executives[0];
//             const token = generateToken(de.id, "delivery_executive");
//             return res.status(200).json({
//               message: "Delivery Executive Login Successful",
//               token,
//               user: {
//                 id: de.id,
//                 name: de.name,
//                 role: "delivery_executive",
//                 phone: de.phone
//               }
//             });
//           }
//         } catch (e) {}

//         try {
//           const [refs] = await pool.query(
//             "SELECT * FROM references_table WHERE REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE ? LIMIT 1",
//             [`%${cleanPhone}`]
//           );

//           if (refs && refs.length > 0) {
//             const ref = refs[0];
//             const token = generateToken(ref.id, "reference");
//             return res.status(200).json({
//               message: "Reference Login Successful",
//               token,
//               user: {
//                 id: ref.id,
//                 name: ref.doctor_name || ref.name,
//                 role: "reference",
//                 phone: ref.phone
//               }
//             });
//           }
//         } catch (e) {}
//       }
//     }

//     return res.status(400).json({ message: "Invalid credentials or account not found." });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// const updateProfile = async (req, res) => {
//   const { id, name, phone, email, address, contactPerson, role } = req.body;
//   const userId = id || req.user?.id;

//   try {
//     const cleanPhone = phone ? cleanDigits(phone) : null;

//     await pool.query(
//       `UPDATE users 
//        SET name = COALESCE(?, name), 
//            email = COALESCE(?, email), 
//            phone = COALESCE(?, phone) 
//        WHERE id = ? OR phone = ?`,
//       [name?.trim() || null, email?.trim() || null, cleanPhone, userId, cleanPhone]
//     ).catch(() => {});

//     if (role === "care_center" || role === "Care Center") {
//       await pool.query(
//         `UPDATE care_centers 
//          SET name = COALESCE(?, name), 
//              phone = COALESCE(?, phone), 
//              address = COALESCE(?, address), 
//              contact_person = COALESCE(?, contact_person) 
//          WHERE id = ? OR phone = ?`,
//         [name?.trim() || null, cleanPhone, address?.trim() || null, contactPerson?.trim() || null, userId, cleanPhone]
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

const extract10Digits = (num) => {
  const digitsOnly = String(num || "").replace(/\D/g, "");
  return digitsOnly.slice(-10);
};

const register = async (req, res) => {
  return res.status(403).json({
    message: "Direct registration is disabled. Accounts are managed via Master Info."
  });
};

// const login = async (req, res) => {
//   const { identifier, username, email, phone, password } = req.body;

//   try {
//     const loginInput = String(identifier || username || email || phone || "").trim();
//     const inputPass = String(password || "").trim();

//     if (!loginInput || !inputPass) {
//       return res.status(400).json({ message: "ID/Phone and Password are required." });
//     }

//     console.log(`[LOGIN ATTEMPT] Input: ${loginInput}, Password: ${inputPass}`);

//     // 1. Super Admin Hardcoded Shortcut
//     if (loginInput.toLowerCase() === "admin" && inputPass === "admin") {
//       const token = generateToken("ADMIN-01", "super_admin");
//       return res.status(200).json({
//         message: "Super Admin Login Successful",
//         token,
//         user: {
//           id: "ADMIN-01",
//           name: "Super Admin",
//           role: "super_admin",
//           email: "admin@chikitsa.com"
//         }
//       });
//     }

//     // 2. Check Database 'users' Table (Super Admin & Staff)
//     try {
//       const [users] = await pool.query(
//         "SELECT * FROM users WHERE email = ? OR phone = ? OR name = ? LIMIT 1",
//         [loginInput, loginInput, loginInput]
//       );

//       if (users && users.length > 0) {
//         const user = users[0];
//         let isMatch = false;
//         if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
//           isMatch = await bcrypt.compare(inputPass, user.password);
//         } else {
//           isMatch = user.password === inputPass;
//         }

//         if (isMatch) {
//           const token = generateToken(user.id, user.role || "super_admin");
//           return res.status(200).json({
//             message: "Login successful",
//             token,
//             user: {
//               id: user.id,
//               name: user.name,
//               email: user.email,
//               phone: user.phone,
//               role: user.role || "super_admin",
//               careCenterId: user.role === "care_center" ? user.id : null,
//               careCenterName: user.role === "care_center" ? user.name : null
//             }
//           });
//         }
//       }
//     } catch (e) {
//       console.warn("User table check notice:", e.message);
//     }

//     // 3. MASTER INFO AUTO-LOGIN (Mobile Number = ID, Last 4 digits = Password)
//     const cleanMobile = extract10Digits(loginInput);

//     if (cleanMobile.length === 10) {
//       const expectedPassword = cleanMobile.slice(-4);

//       if (inputPass === expectedPassword) {
//         // A. CARE CENTERS TABLE
//         try {
//           const [centers] = await pool.query(
//             "SELECT * FROM care_centers WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') LIKE ? LIMIT 1",
//             [`%${cleanMobile}`]
//           );

//           if (centers && centers.length > 0) {
//             const cc = centers[0];
//             const token = generateToken(cc.id, "care_center");
//             return res.status(200).json({
//               message: "Care Center Login Successful",
//               token,
//               user: {
//                 id: cc.id,
//                 careCenterId: cc.id,
//                 careCenterName: cc.name,
//                 name: cc.name,
//                 role: "care_center",
//                 phone: cc.phone,
//                 address: cc.address,
//                 contactPerson: cc.contact_person || cc.contactPerson
//               }
//             });
//           }
//         } catch (err) {
//           console.error("Care Center DB Check Error:", err);
//         }

//         // B. DELIVERY EXECUTIVES TABLE
//         try {
//           const [execs] = await pool.query(
//             "SELECT * FROM delivery_executives WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') LIKE ? LIMIT 1",
//             [`%${cleanMobile}`]
//           );

//           if (execs && execs.length > 0) {
//             const de = execs[0];
//             const token = generateToken(de.id, "delivery_executive");
//             return res.status(200).json({
//               message: "Delivery Agent Login Successful",
//               token,
//               user: {
//                 id: de.id,
//                 name: de.driverName || de.name,
//                 role: "delivery_executive",
//                 phone: de.phone
//               }
//             });
//           }
//         } catch (err) {
//           console.error("Delivery Exec DB Check Error:", err);
//         }

//         // C. REFERENCES (DOCTORS) TABLE
//         try {
//           const [refs] = await pool.query(
//             "SELECT * FROM `references` WHERE REPLACE(REPLACE(REPLACE(contact, ' ', ''), '-', ''), '+91', '') LIKE ? OR REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') LIKE ? LIMIT 1",
//             [`%${cleanMobile}`, `%${cleanMobile}`]
//           );

//           if (refs && refs.length > 0) {
//             const ref = refs[0];
//             const token = generateToken(ref.id, "reference");
//             return res.status(200).json({
//               message: "Reference Doctor Login Successful",
//               token,
//               user: {
//                 id: ref.id,
//                 name: ref.doctorName || ref.name,
//                 role: "reference",
//                 phone: ref.contact || ref.phone,
//                 hospital: ref.hospital,
//                 specialistDomain: ref.specialist_domain
//               }
//             });
//           }
//         } catch (err) {
//           console.error("References DB Check Error:", err);
//         }
//       }
//     }

//     return res.status(400).json({ 
//       message: "Account not found or password incorrect. Enter your 10-digit mobile and last 4 digits as passcode." 
//     });
//   } catch (error) {
//     console.error("Login Server Error:", error);
//     return res.status(500).json({ message: "Server Error: " + error.message });
//   }
// };

// 👤 PROFILE UPDATE

const login = async (req, res) => {
  try {
    const { identifier, username, email, phone, password } = req.body;
    const inputId = String(identifier || username || email || phone || "").trim();
    const inputPass = String(password || "").trim();

    if (!inputId || !inputPass) {
      return res.status(400).json({ message: "Mobile Number / ID and Password are required." });
    }

    // 1. Super Admin Hardcoded Access
    if (inputId.toLowerCase() === "admin" && inputPass === "admin") {
      const token = generateToken("ADMIN-01", "super_admin");
      return res.status(200).json({
        message: "Super Admin Login Successful",
        token,
        user: { id: "ADMIN-01", name: "Super Admin", role: "super_admin", email: "admin@chikitsa.com" }
      });
    }

    // 2. Users Table Check (Super Admin / Staff)
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR phone = ? OR name = ? LIMIT 1",
      [inputId, inputId, inputId]
    ).catch(() => [[]]);

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
            role: user.role || "super_admin"
          }
        });
      }
    }

    // 3. 10-Digit Master Auto-Login (Last 10 Digits as ID, Last 4 as Password)
    const cleanMobile = inputId.replace(/\D/g, "").slice(-10);

    if (cleanMobile.length === 10) {
      const expectedPassword = cleanMobile.slice(-4);

      if (inputPass !== expectedPassword) {
        return res.status(400).json({
          message: `Password incorrect. Password must be the last 4 digits (${expectedPassword}) of mobile number.`
        });
      }

      // Check Care Centers
      const [careCenters] = await pool.query(
        "SELECT * FROM care_centers WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') LIKE ? LIMIT 1",
        [`%${cleanMobile}`]
      ).catch(() => [[]]);

      if (careCenters && careCenters.length > 0) {
        const cc = careCenters[0];
        const token = generateToken(cc.id, "care_center");
        return res.status(200).json({
          message: "Care Center Login Successful",
          token,
          user: {
            id: cc.id,
            careCenterId: cc.id,
            careCenterName: cc.name,
            name: cc.name,
            role: "care_center",
            phone: cc.phone,
            address: cc.address
          }
        });
      }

      // Check Delivery Executives
      const [execs] = await pool.query(
        "SELECT * FROM delivery_executives WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') LIKE ? LIMIT 1",
        [`%${cleanMobile}`]
      ).catch(() => [[]]);

      if (execs && execs.length > 0) {
        const de = execs[0];
        const token = generateToken(de.id, "delivery_executive");
        return res.status(200).json({
          message: "Delivery Executive Login Successful",
          token,
          user: {
            id: de.id,
            name: de.driverName || de.name,
            role: "delivery_executive",
            phone: de.phone
          }
        });
      }

      // Check References (Doctors)
      const [refs] = await pool.query(
        "SELECT * FROM `references` WHERE REPLACE(REPLACE(REPLACE(contact, ' ', ''), '-', ''), '+91', '') LIKE ? OR REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') LIKE ? LIMIT 1",
        [`%${cleanMobile}`, `%${cleanMobile}`]
      ).catch(() => [[]]);

      if (refs && refs.length > 0) {
        const ref = refs[0];
        const token = generateToken(ref.id, "reference");
        return res.status(200).json({
          message: "Reference Login Successful",
          token,
          user: {
            id: ref.id,
            name: ref.doctorName || ref.name,
            role: "reference",
            phone: ref.contact || ref.phone
          }
        });
      }
    }

    return res.status(400).json({
      message: "No registered account found with this number. Please verify the mobile number entered in Master Info."
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error: " + error.message });
  }
};

const updateProfile = async (req, res) => {
  const { id, name, phone, email, address, contactPerson, role } = req.body;
  const userId = id || req.user?.id;

  try {
    const cleanPhone = phone ? extract10Digits(phone) : null;

    if (role === "care_center" || role === "Care Center") {
      await pool.query(
        `UPDATE care_centers 
         SET name = COALESCE(?, name), 
             phone = COALESCE(?, phone), 
             address = COALESCE(?, address), 
             contact_person = COALESCE(?, contact_person) 
         WHERE id = ? OR phone LIKE ?`,
        [name?.trim() || null, cleanPhone, address?.trim() || null, contactPerson?.trim() || null, userId, `%${cleanPhone}`]
      ).catch(() => {});
    }

    await pool.query(
      `UPDATE users 
       SET name = COALESCE(?, name), 
           email = COALESCE(?, email), 
           phone = COALESCE(?, phone) 
       WHERE id = ? OR phone LIKE ?`,
      [name?.trim() || null, email?.trim() || null, cleanPhone, userId, `%${cleanPhone}`]
    ).catch(() => {});

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: { id: userId, name, phone: cleanPhone, email, address, contactPerson, role }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Database Error: " + error.message });
  }
};

// 🔑 CHANGE PASSWORD
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
      "SELECT * FROM users WHERE id = ? OR phone LIKE ?",
      [userId || -1, `%${extract10Digits(phone)}`]
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
    return res.status(500).json({ message: "Database Error: " + error.message });
  }
};

module.exports = { 
  register, 
  login, 
  updateProfile, 
  changePassword 
};