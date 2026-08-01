const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.create(name, email, hashedPassword, role);
    res.status(201).json({ message: "User registered", token: generateToken(userId, role), user: { id: userId, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    res.status(200).json({ message: "Login successful", token: generateToken(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { register, login };