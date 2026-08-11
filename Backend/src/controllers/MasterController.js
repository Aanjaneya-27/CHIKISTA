const CareCenter = require("../models/CareCenter");
const Equipment = require("../models/Equipment");

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
    res.status(200).json({ message: "Care center deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    await pool.query("DELETE FROM equipment WHERE id = ?", [id]);
    res.status(200).json({ message: "Equipment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCareCenters, addCareCenter, deleteCareCenter, getEquipment, addEquipment, deleteEquipment, deleteCategory };