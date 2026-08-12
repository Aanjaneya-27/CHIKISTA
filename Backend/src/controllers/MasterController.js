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

const updateCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contact_person, phone, gst } = req.body;
    await pool.query(
      "UPDATE care_centers SET name = ?, address = ?, contact_person = ?, phone = ?, gst = ? WHERE id = ?",
      [name, address, contact_person, phone, gst, id]
    );
    res.status(200).json({ message: "Care Center updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
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

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, daily_rate, stock } = req.body;
    await pool.query(
      "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ? WHERE id = ?",
      [name, category, daily_rate, stock, id]
    );
    res.status(200).json({ message: "Equipment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
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
    const { name } = req.body;
    const id = 'CAT-' + Date.now(); 
    await pool.query("INSERT INTO categories (id, name) VALUES (?, ?)", [id, name]);
    res.status(201).json({ message: "Category Added!" });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); 
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body; 
    await pool.query(
      "UPDATE categories SET name = ?, status = ? WHERE id = ?", 
      [name, status || 'Active', id]
    );
    
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
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
    const { doctorName, phone } = req.body;
    const id = 'REF-' + Date.now();
      await pool.query(
      "INSERT INTO `references` (id, name, contact) VALUES (?, ?, ?)", 
      [id, doctorName, phone]
    );
    res.status(201).json({ message: "Reference Added!" });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); 
  }
};

const updateReference = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, phone } = req.body;
    await pool.query(
      "UPDATE `references` SET name = ?, contact = ? WHERE id = ?",
      [doctorName, phone, id]
    );
    res.status(200).json({ message: "Reference updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
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
    const id = 'DEL-' + Date.now();
    await pool.query(
      "INSERT INTO delivery_executives (id, name, phone, status) VALUES (?, ?, ?, ?)", 
      [id, driverName, phone, status || 'Active']
    );
    res.status(201).json({ message: "Delivery Executive Added!" });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); 
  }
};

const updateDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverName, phone, status } = req.body;
    await pool.query(
      "UPDATE delivery_executives SET name = ?, phone = ?, status = ? WHERE id = ?",
      [driverName, phone, status || 'Active', id]
    );
    res.status(200).json({ message: "Delivery Executive updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, sqlError: error.sqlMessage });
  }
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
  getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter, 
  getEquipment, addEquipment, updateEquipment, deleteEquipment, 
  getCategories, addCategory, updateCategory, deleteCategory, 
  getReferences, addReference, updateReference, deleteReference, 
  getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive 
};