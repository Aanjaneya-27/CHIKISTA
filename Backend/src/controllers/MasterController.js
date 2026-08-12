const CareCenter = require("../models/CareCenter");
const Equipment = require("../models/Equipment");
const pool = require("../config/database");


const getCareCenters = async (req, res) => {
  try {
    const rows = await CareCenter.getAll();
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const addCareCenter = async (req, res) => {
  const { id, name, address, contact_person, phone, gst } = req.body;
  try {
    await CareCenter.create(id, name, address, contact_person, phone, gst);
    res.status(201).json({ message: "Care Center Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const deleteCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM care_centers WHERE id = ?", [id]);
    res.status(200).json({ message: "Care center deleted successfully" });
  } catch (error) {
    console.error("SQL Error:", error); 
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); 
  }
};

const getEquipment = async (req, res) => {
  try {
    const rows = await Equipment.getAll();
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const addEquipment = async (req, res) => {
  const { id, name, category, daily_rate, stock } = req.body;
  try {
    await Equipment.create(id, name, category, daily_rate, stock);
    res.status(201).json({ message: "Equipment Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    await Equipment.delete(id); 
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    await pool.query("INSERT INTO categories (name, status) VALUES (?, ?)", [name, status || 'Active']);
    res.status(201).json({ message: "Category Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;  
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: `Failed: Database mein ID '${id}' nahi mili!` });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("SQL Error:", error);
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
};

const getReferences = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `references`");
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const addReference = async (req, res) => {
  try {
    const { doctorName, domain, hospital, phone, altPhone, status } = req.body;
    await pool.query(
      "INSERT INTO `references` (doctorName, domain, hospital, phone, altPhone, status) VALUES (?, ?, ?, ?, ?, ?)", 
      [doctorName, domain, hospital, phone, altPhone, status || 'Active']
    );
    res.status(201).json({ message: "Reference Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
};

const deleteReference = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM `references` WHERE id = ?", [id]); 
    res.status(200).json({ message: "Reference deleted successfully" });
  } catch (error) {
    console.error("SQL Error:", error);
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
};

const getDeliveryExecutives = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM delivery_executives");
    res.json(rows);
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const addDeliveryExecutive = async (req, res) => {
  try {
    const { driverName, phone, status } = req.body;
    await pool.query(
      "INSERT INTO delivery_executives (driverName, phone, status) VALUES (?, ?, ?)", 
      [driverName, phone, status || 'Active']
    );
    res.status(201).json({ message: "Delivery Executive Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
};

const deleteDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM delivery_executives WHERE id = ?", [id]); 
    res.status(200).json({ message: "Delivery Executive deleted successfully" });
  } catch (error) {
    console.error("SQL Error:", error);
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
};


module.exports = { 
  getCareCenters, addCareCenter, deleteCareCenter, 
  getEquipment, addEquipment, deleteEquipment, 
  getCategories, addCategory, deleteCategory, 
  getReferences, addReference, deleteReference, 
  getDeliveryExecutives, addDeliveryExecutive, deleteDeliveryExecutive 
};