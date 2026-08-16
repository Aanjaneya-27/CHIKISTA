const express = require("express");
const { register, login, updateProfile, changePassword } = require("../controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", updateProfile);
router.put("/password", changePassword);

module.exports = router;