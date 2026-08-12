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
  const { id, name, address, contact_person, phone, gst, status } = req.body;
  try {
    await CareCenter.create(id, name, address, contact_person, phone, gst);
    res.status(201).json({ message: "Care Center Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

const updateCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      address, 
      contact_person, 
      contactPerson, 
      phone, 
      gst, 
      status 
    } = req.body;
    
    const finalContactPerson = contact_person !== undefined ? contact_person : (contactPerson || '');
    const finalPhone = phone || '';
    const finalGst = gst || '';

    await pool.query(
      "UPDATE care_centers SET name = ?, address = ?, contact_person = ?, phone = ?, gst = ?, status = ? WHERE id = ?",
      [
        name || '', 
        address || '', 
        finalContactPerson, 
        finalPhone, 
        finalGst, 
        status || 'Active', 
        id
      ]
    );
    
    res.status(200).json({ message: "Care Center updated successfully" });
  } catch (error) {
    console.error("Update CareCenter Error:", error);
    res.status(400).json({ message: error.sqlMessage || error.message });
  }
};

const deleteCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM care_centers WHERE id = ?", [id]);
    res.status(200).json({ message: "Care center deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
};


const getEquipment = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *, daily_rate AS dailyRate 
      FROM equipment
    `);
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};
const addEquipment = async (req, res) => {
  try {
    const { name, category, daily_rate, stock, status } = req.body;
        const id = req.body.id || 'EQ-' + Date.now();

    await pool.query(
      "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id, 
        name, 
        category || 'General', 
        daily_rate || 0, 
        stock || 0, 
        status || 'Active'
      ]
    );

    res.status(201).json({ message: "Equipment Added!" });
  } catch (error) { 
    console.error("Add Equipment Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, sqlError: error.sqlMessage }); 
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, daily_rate, dailyRate, stock, status } = req.body;
        const finalRate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);
    const finalCategory = category || 'General';

    await pool.query(
      "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
      [name, finalCategory, finalRate, stock || 0, status || 'Active', id]
    );
    
    res.status(200).json({ message: "Equipment updated successfully" });
  } catch (error) {
    console.error("Update Equipment Error:", error);
    res.status(400).json({ message: error.sqlMessage || error.message });
  }
};
const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    await Equipment.delete(id); 
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message }); }
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
    const id = 'CAT-' + Date.now(); 
    await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, name, status || 'Active']);
    res.status(201).json({ message: "Category Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [name, status || 'Active', id]);
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.sqlMessage || error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;  
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
};


const getReferences = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name AS doctorName, contact AS phone, status FROM `references`"
    );
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const addReference = async (req, res) => {
  try {
    const { doctorName, phone, status } = req.body;
    const id = 'REF-' + Date.now();
    await pool.query(
      "INSERT INTO `references` (id, name, contact, status) VALUES (?, ?, ?, ?)", 
      [id, doctorName, phone, status || 'Active']
    );
    res.status(201).json({ message: "Reference Added!" });
  } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
};

const updateReference = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, phone, status } = req.body;
    await pool.query(
      "UPDATE `references` SET name = ?, contact = ?, status = ? WHERE id = ?",
      [doctorName, phone, status || 'Active', id]
    );
    res.status(200).json({ message: "Reference updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.sqlMessage || error.message });
  }
};

const deleteReference = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM `references` WHERE id = ?", [id]); 
    res.status(200).json({ message: "Reference deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
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
  } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
};

const updateDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverName, phone, status } = req.body;
    // db column name 'name'
    await pool.query(
      "UPDATE delivery_executives SET name = ?, phone = ?, status = ? WHERE id = ?",
      [driverName, phone, status || 'Active', id]
    );
    res.status(200).json({ message: "Delivery Executive updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.sqlMessage || error.message });
  }
};

const deleteDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM delivery_executives WHERE id = ?", [id]); 
    res.status(200).json({ message: "Delivery Executive deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
};

module.exports = { 
  getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter, 
  getEquipment, addEquipment, updateEquipment, deleteEquipment, 
  getCategories, addCategory, updateCategory, deleteCategory, 
  getReferences, addReference, updateReference, deleteReference, 
  getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive 
};