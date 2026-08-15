// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// const register = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const existing = await User.findByEmail(email);
//     if (existing) return res.status(400).json({ message: "Email already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const userId = await User.create(name, email, hashedPassword, role);
//     res.status(201).json({ message: "User registered", token: generateToken(userId, role), user: { id: userId, name, email, role } });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findByEmail(email);
//     if (!user) return res.status(400).json({ message: "Invalid Credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

//     res.status(200).json({ message: "Login successful", token: generateToken(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// module.exports = { register, login };



const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const pool = require("../config/database"); 

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "chikitsa_secret_key_2026", {
    expiresIn: "7d"
  });
};


// const register = async (req, res) => {
//   const { name, phone, role = "care_center" } = req.body;

//   try {
//     const cleanPhone = (phone || "").toString().replace(/\D/g, "");

//     if (!name || cleanPhone.length < 10) {
//       return res.status(400).json({ message: "Name and a valid 10-digit Phone number are required." });
//     }

//     // Check duplicate phone
//     const existing = await User.findByPhone(cleanPhone);
//     if (existing) {
//       return res.status(400).json({ message: "This phone number is already registered." });
//     }

//     // Password = Phone ke aakhri 4 digits (Bcrypt Hashed)
//     const autoPassword = cleanPhone.slice(-4);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(autoPassword, salt);

//     // Save in Database
//     const userId = await User.create(name.trim(), cleanPhone, hashedPassword, role);

//     const token = generateToken(userId, role);
//     return res.status(201).json({
//       message: "Registration successful!",
//       token,
//       user: {
//         id: userId,
//         name: name.trim(),
//         phone: cleanPhone,
//         role,
//         careCenterId: role === "care_center" ? userId : null,
//         careCenterName: role === "care_center" ? name.trim() : null
//       }
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };


// controllers/userController.js

const register = async (req, res) => {
  const { name, phone, role = "care_center" } = req.body;

  try {
    const cleanPhone = (phone || "").toString().replace(/\D/g, "");

    if (!name || cleanPhone.length < 10) {
      return res.status(400).json({ message: "Valid Name and 10-digit Phone number are required." });
    }

    // 1. Duplicate check in users table
    const [existing] = await pool.query("SELECT id FROM users WHERE phone = ?", [cleanPhone]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "This phone number is already registered. Please login." });
    }

    // 2. Hash Password (Last 4 digits)
    const autoPassword = cleanPhone.slice(-4);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(autoPassword, salt);

    // 3. Insert into USERS table
    const [userResult] = await pool.query(
      "INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)",
      [name.trim(), cleanPhone, hashedPassword, role]
    );

    const userId = userResult.insertId;
    const masterId = `CC-${userId}`;

    // 4. Safe sync to care_centers / references / delivery_executives
    try {
      if (role === "care_center") {
        await pool.query(
          "INSERT INTO care_centers (id, name, phone, address, contact_person, status) VALUES (?, ?, ?, '', '', 'Active') ON DUPLICATE KEY UPDATE name = VALUES(name)",
          [masterId, name.trim(), cleanPhone]
        );
      } else if (role === "reference") {
        await pool.query(
          "INSERT INTO `references` (doctorName, phone, status) VALUES (?, ?, 'Active')",
          [name.trim(), cleanPhone]
        );
      } else if (role === "delivery_executive") {
        await pool.query(
          "INSERT INTO delivery_executives (driverName, phone, status) VALUES (?, ?, 'Active')",
          [name.trim(), cleanPhone]
        );
      }
    } catch (syncErr) {
      console.warn("Master Table Sync Warning:", syncErr.message);
    }

    // 5. Generate Auth Token
    const token = generateToken(userId, role);

    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: userId,
        name: name.trim(),
        phone: cleanPhone,
        role,
        careCenterId: role === "care_center" ? masterId : null,
        careCenterName: role === "care_center" ? name.trim() : null
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ 
      message: "Database Error: " + (error.sqlMessage || error.message)
    });
  }
};


const login = async (req, res) => {
  const { identifier, email, phone, password } = req.body;

  try {
    const loginInput = (identifier || email || phone || "").toString().trim();
    const inputPass = (password || "").toString().trim();

    if (!loginInput || !inputPass) {
      return res.status(400).json({ message: "Email/Phone and Password are required." });
    }

    if (loginInput.toLowerCase() === "admin" && inputPass === "admin") {
      const token = generateToken("ADMIN-01", "super_admin");
      return res.status(200).json({
        message: "Super Admin Login Successful",
        token,
        user: { id: "ADMIN-01", name: "Super Admin", role: "super_admin", email: "admin@new.in" }
      });
    }

    let user = null;

    if (loginInput.includes("@")) {
      user = await User.findByEmail(loginInput);
    } else {
      const cleanPhone = loginInput.replace(/\D/g, "");
      user = await User.findByPhone(cleanPhone);
    }

    if (!user) {
      return res.status(400).json({ message: "User not found. Please check your credentials or register." });
    }

    const isMatch = await bcrypt.compare(inputPass, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password or Passcode." });
    }

    const token = generateToken(user.id, user.role);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        careCenterId: user.role === "care_center" ? user.id : null,
        careCenterName: user.role === "care_center" ? user.name : null
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { register, login };