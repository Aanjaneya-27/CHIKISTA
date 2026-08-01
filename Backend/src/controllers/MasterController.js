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

module.exports = { getCareCenters, addCareCenter, getEquipment, addEquipment };