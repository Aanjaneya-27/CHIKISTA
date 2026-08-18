const pool = require("../config/database");

const cleanPhone = (num) => String(num || "").replace(/\D/g, "").slice(-10);

const getTableColumns = async (tableName) => {
  try {
    const [cols] = await pool.query(`DESCRIBE \`${tableName}\``);
    return cols.map((c) => ({ field: c.Field, type: c.Type.toLowerCase() }));
  } catch (err) {
    console.error(`Error describing table ${tableName}:`, err.message);
    return [];
  }
};



const getCareCenters = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC").catch(() => [[]]);
    
    const formatted = (rows || []).map((c) => ({
      ...c,
      contactPerson: c.contact_person || c.contactPerson || c.incharge_name || "",
      inchargeMobile: c.incharge_mobile || c.inchargeMobile || c.phone || "",
      phone: c.phone || c.incharge_mobile || "",
      careAddress: c.address || c.care_address || "",
      gstNumber: c.gst || c.gst_number || ""
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Fetch Care Centers Error:", error);
    return res.status(200).json([]);
  }
};

const addCareCenter = async (req, res) => {
  try {
    const d = req.body || {};
    const name = String(d.name || d.careCenterName || "").trim();
    if (!name) return res.status(400).json({ message: "Care Center Name is required." });

    const phone = cleanPhone(d.phone || d.incharge_mobile || d.inchargeMobile || d.mobile);
    const address = String(d.address || d.care_address || d.careAddress || "").trim();
    const contactPerson = String(d.contactPerson || d.contact_person || d.incharge_name || "").trim();
    const gst = String(d.gst || d.gst_number || d.gstNumber || "").trim();
    const status = String(d.status || "Active").trim();

    const cols = await getTableColumns("care_centers");
    const colNames = cols.map((c) => c.field);
    const idCol = cols.find((c) => c.field === "id");

    const dataObj = {};
    if (colNames.includes("id") && idCol && !idCol.type.includes("int")) {
      dataObj["id"] = (d.id && String(d.id).trim() !== "null" && String(d.id).trim() !== "")
        ? String(d.id).trim()
        : `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    if (colNames.includes("name")) dataObj["name"] = name;
    if (colNames.includes("phone")) dataObj["phone"] = phone;
    if (colNames.includes("incharge_mobile")) dataObj["incharge_mobile"] = phone;
    if (colNames.includes("address")) dataObj["address"] = address;
    if (colNames.includes("contact_person")) dataObj["contact_person"] = contactPerson;
    if (colNames.includes("gst")) dataObj["gst"] = gst;
    if (colNames.includes("status")) dataObj["status"] = status;

    const keys = Object.keys(dataObj);
    const sql = `INSERT INTO care_centers (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
    const [result] = await pool.query(sql, Object.values(dataObj));

    const finalId = dataObj["id"] || result.insertId;
    return res.status(201).json({ message: "Care Center added successfully!", id: finalId });
  } catch (error) {
    console.error("Add Care Center Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const updateCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body || {};
    const name = String(d.name || d.careCenterName || "").trim();
    const phone = cleanPhone(d.phone || d.incharge_mobile || d.inchargeMobile || d.mobile);
    const address = String(d.address || d.care_address || d.careAddress || "").trim();
    const contactPerson = String(d.contactPerson || d.contact_person || d.incharge_name || "").trim();
    const gst = String(d.gst || d.gst_number || d.gstNumber || "").trim();
    const status = String(d.status || "Active").trim();

    const cols = await getTableColumns("care_centers");
    const colNames = cols.map((c) => c.field);

    const updateObj = {};
    if (colNames.includes("name") && name) updateObj["name"] = name;
    if (colNames.includes("phone") && phone) updateObj["phone"] = phone;
    if (colNames.includes("incharge_mobile") && phone) updateObj["incharge_mobile"] = phone;
    if (colNames.includes("address")) updateObj["address"] = address;
    if (colNames.includes("contact_person")) updateObj["contact_person"] = contactPerson;
    if (colNames.includes("gst")) updateObj["gst"] = gst;
    if (colNames.includes("status")) updateObj["status"] = status;

    const setClauses = Object.keys(updateObj).map((k) => `\`${k}\` = ?`).join(", ");
    if (setClauses) {
      await pool.query(`UPDATE care_centers SET ${setClauses} WHERE id = ?`, [...Object.values(updateObj), id]);
    }

    return res.status(200).json({ message: "Care Center updated successfully!" });
  } catch (error) {
    console.error("Update Care Center Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const deleteCareCenter = async (req, res) => {
  const { id } = req.params;
  const targetId = String(id).trim();
  const numericOnly = targetId.replace(/\D/g, "");

  try {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});
    await pool.query("DELETE FROM requisitions WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});
    await pool.query("DELETE FROM notifications WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});
    await pool.query("DELETE FROM care_centers WHERE id = ? OR id = ?", [targetId, numericOnly || targetId]);
    await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});

    return res.status(200).json({ message: "Care Center deleted successfully." });
  } catch (error) {
    await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
    console.error("Delete Care Center Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};



const getEquipment = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, daily_rate AS dailyRate FROM equipment ORDER BY id DESC").catch(() => [[]]);
    return res.status(200).json(rows || []);
  } catch (error) {
    return res.status(200).json([]);
  }
};

const addEquipment = async (req, res) => {
  try {
    const d = req.body || {};
    const name = String(d.name || "").trim();
    if (!name) return res.status(400).json({ message: "Equipment name is required." });

    const id = String(d.id || `EQ-${Date.now()}`).trim();
    const category = String(d.category || "General").trim();
    const rate = Number(d.dailyRate ?? d.daily_rate ?? 0) || 0;
    const stock = Number(d.stock ?? 1) || 1;
    const status = String(d.status || "Active").trim();

    await pool.query(
      "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, category, rate, stock, status]
    );

    return res.status(201).json({ message: "Equipment Added!", id });
  } catch (error) {
    console.error("Add Equipment Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body || {};
    const name = String(d.name || "").trim();
    const category = String(d.category || "General").trim();
    const rate = Number(d.dailyRate ?? d.daily_rate ?? 0) || 0;
    const stock = Number(d.stock ?? 1) || 1;
    const status = String(d.status || "Active").trim();

    await pool.query(
      "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
      [name, category, rate, stock, status, id]
    );

    return res.status(200).json({ message: "Equipment updated successfully" });
  } catch (error) {
    console.error("Update Equipment Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});
    await pool.query("DELETE FROM requisitions WHERE equipment_id = ?", [id]).catch(() => {});
    await pool.query("DELETE FROM equipment WHERE id = ?", [id]);
    await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});

    return res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
    return res.status(500).json({ message: error.message });
  }
};


const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC").catch(() => [[]]);
    return res.status(200).json(rows || []);
  } catch (error) {
    return res.status(200).json([]);
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, title, status } = req.body || {};
    const catName = String(name || title || "").trim();
    if (!catName) return res.status(400).json({ message: "Category name is required." });

    const id = `CAT-${Date.now()}`;
    await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, catName, status || "Active"]);
    return res.status(201).json({ message: "Category Added!", id });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, status } = req.body || {};
    const catName = String(name || title || "").trim();

    await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [catName, status || "Active", id]);
    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const getReferences = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `references` ORDER BY id DESC").catch(() => [[]]);
    const formatted = (rows || []).map((r) => ({
      id: r.id,
      name: r.name || r.doctor_name || r.doctorName || "",
      doctorName: r.name || r.doctor_name || r.doctorName || "",
      phone: r.phone || r.contact || "",
      contact: r.phone || r.contact || "",
      altPhone: r.alt_phone || r.altPhone || "",
      hospital: r.hospital || "",
      domain: r.domain || r.specialist_domain || r.specialization || "",
      specialistDomain: r.domain || r.specialist_domain || r.specialization || "",
      status: r.status || "Active"
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(200).json([]);
  }
};

const addReference = async (req, res) => {
  try {
    const d = req.body || {};
    const doctorName = String(d.doctorName || d.doctor_name || d.name || "").trim();
    if (!doctorName) return res.status(400).json({ message: "Doctor / Reference name is required." });

    const phone = cleanPhone(d.phone || d.contact || "") || String(d.phone || d.contact || "").trim();
    const altPhone = cleanPhone(d.altPhone || d.alt_phone || "") || String(d.altPhone || d.alt_phone || "").trim();
    const hospital = String(d.hospital || "").trim();
    const domain = String(d.domain || d.specialistDomain || d.specialist_domain || d.specialization || "").trim();
    const status = String(d.status || "Active").trim();

    const cols = await getTableColumns("references");
    const colNames = cols.map((c) => c.field);
    const idCol = cols.find((c) => c.field === "id");

    const dataObj = {};
    if (colNames.includes("id") && idCol && !idCol.type.includes("int")) {
      dataObj["id"] = (d.id && String(d.id).trim() !== "null" && String(d.id).trim() !== "")
        ? String(d.id).trim()
        : `REF-${Date.now()}`;
    }

    if (colNames.includes("name")) dataObj["name"] = doctorName;
    else if (colNames.includes("doctor_name")) dataObj["doctor_name"] = doctorName;

    if (colNames.includes("phone")) dataObj["phone"] = phone;
    else if (colNames.includes("contact")) dataObj["contact"] = phone;

    if (colNames.includes("alt_phone")) dataObj["alt_phone"] = altPhone;
    if (colNames.includes("hospital")) dataObj["hospital"] = hospital;

    if (colNames.includes("specialist_domain")) dataObj["specialist_domain"] = domain;
    else if (colNames.includes("domain")) dataObj["domain"] = domain;
    else if (colNames.includes("specialization")) dataObj["specialization"] = domain;

    if (colNames.includes("status")) dataObj["status"] = status;

    const keys = Object.keys(dataObj);
    const sql = `INSERT INTO \`references\` (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
    const [result] = await pool.query(sql, Object.values(dataObj));

    const finalId = dataObj["id"] || result.insertId;
    return res.status(201).json({ message: "Reference added successfully!", id: finalId });
  } catch (error) {
    console.error("Add Reference Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const updateReference = async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body || {};
    const doctorName = String(d.doctorName || d.doctor_name || d.name || "").trim();
    const phone = cleanPhone(d.phone || d.contact || "") || String(d.phone || d.contact || "").trim();
    const altPhone = cleanPhone(d.altPhone || d.alt_phone || "") || String(d.altPhone || d.alt_phone || "").trim();
    const hospital = String(d.hospital || "").trim();
    const domain = String(d.domain || d.specialistDomain || d.specialist_domain || d.specialization || "").trim();
    const status = String(d.status || "Active").trim();

    const cols = await getTableColumns("references");
    const colNames = cols.map((c) => c.field);

    const updateObj = {};
    if (colNames.includes("name") && doctorName) updateObj["name"] = doctorName;
    else if (colNames.includes("doctor_name") && doctorName) updateObj["doctor_name"] = doctorName;

    if (colNames.includes("phone")) updateObj["phone"] = phone;
    else if (colNames.includes("contact")) updateObj["contact"] = phone;

    if (colNames.includes("alt_phone")) updateObj["alt_phone"] = altPhone;
    if (colNames.includes("hospital")) updateObj["hospital"] = hospital;

    if (colNames.includes("specialist_domain")) updateObj["specialist_domain"] = domain;
    else if (colNames.includes("domain")) updateObj["domain"] = domain;
    else if (colNames.includes("specialization")) updateObj["specialization"] = domain;

    if (colNames.includes("status")) updateObj["status"] = status;

    const setClauses = Object.keys(updateObj).map((k) => `\`${k}\` = ?`).join(", ");
    if (setClauses) {
      await pool.query(`UPDATE \`references\` SET ${setClauses} WHERE id = ?`, [...Object.values(updateObj), id]);
    }

    return res.status(200).json({ message: "Reference updated successfully!" });
  } catch (error) {
    console.error("Update Reference Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const deleteReference = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM `references` WHERE id = ?", [id]);
    return res.status(200).json({ message: "Reference deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const getDeliveryExecutives = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM delivery_executives ORDER BY id DESC").catch(() => [[]]);
    const formatted = (rows || []).map((r) => ({
      id: r.id,
      driverName: r.driver_name || r.name || r.driverName || "",
      name: r.driver_name || r.name || "",
      phone: r.phone || r.mobile || r.contact || "",
      vehicleNumber: r.vehicle_number || r.vehicleNumber || "",
      vehicle_number: r.vehicle_number || r.vehicleNumber || "",
      status: r.status || "Active"
    }));
    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(200).json([]);
  }
};

const addDeliveryExecutive = async (req, res) => {
  try {
    const d = req.body || {};
    const driver = String(d.driverName || d.name || "").trim();
    if (!driver) return res.status(400).json({ message: "Driver Name is required." });

    const phone = cleanPhone(d.phone) || String(d.phone || "").trim();
    const vehicle = String(d.vehicleNumber || d.vehicle_number || "").trim();
    const status = String(d.status || "Active").trim();

    const cols = await getTableColumns("delivery_executives");
    const colNames = cols.map((c) => c.field);
    const idCol = cols.find((c) => c.field === "id");

    const dataObj = {};
    if (colNames.includes("id") && idCol && !idCol.type.includes("int")) {
      dataObj["id"] = (d.id && String(d.id).trim() !== "null" && String(d.id).trim() !== "")
        ? String(d.id).trim()
        : `DEL-${Date.now()}`;
    }

    if (colNames.includes("driver_name")) dataObj["driver_name"] = driver;
    else if (colNames.includes("name")) dataObj["name"] = driver;

    if (colNames.includes("phone")) dataObj["phone"] = phone;
    else if (colNames.includes("mobile")) dataObj["mobile"] = phone;
    else if (colNames.includes("contact")) dataObj["contact"] = phone;

    if (colNames.includes("vehicle_number")) dataObj["vehicle_number"] = vehicle;
    if (colNames.includes("status")) dataObj["status"] = status;

    const keys = Object.keys(dataObj);
    const sql = `INSERT INTO delivery_executives (${keys.map((k) => `\`${k}\``).join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
    const [result] = await pool.query(sql, Object.values(dataObj));

    const finalId = dataObj["id"] || result.insertId;
    return res.status(201).json({ message: "Delivery Executive Added!", id: finalId });
  } catch (error) {
    console.error("Add Delivery Exec Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const updateDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body || {};
    const driver = String(d.driverName || d.name || "").trim();
    const phone = cleanPhone(d.phone) || String(d.phone || "").trim();
    const vehicle = String(d.vehicleNumber || d.vehicle_number || "").trim();
    const status = String(d.status || "Active").trim();

    const cols = await getTableColumns("delivery_executives");
    const colNames = cols.map((c) => c.field);

    const updateObj = {};
    if (colNames.includes("driver_name") && driver) updateObj["driver_name"] = driver;
    else if (colNames.includes("name") && driver) updateObj["name"] = driver;

    if (colNames.includes("phone")) updateObj["phone"] = phone;
    else if (colNames.includes("mobile")) updateObj["mobile"] = phone;
    else if (colNames.includes("contact")) updateObj["contact"] = phone;

    if (colNames.includes("vehicle_number")) updateObj["vehicle_number"] = vehicle;
    if (colNames.includes("status")) updateObj["status"] = status;

    const setClauses = Object.keys(updateObj).map((k) => `\`${k}\` = ?`).join(", ");
    if (setClauses) {
      await pool.query(`UPDATE delivery_executives SET ${setClauses} WHERE id = ?`, [...Object.values(updateObj), id]);
    }

    return res.status(200).json({ message: "Delivery Executive updated successfully" });
  } catch (error) {
    console.error("Update Delivery Executive Error:", error);
    return res.status(500).json({ message: error.sqlMessage || error.message });
  }
};

const deleteDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM delivery_executives WHERE id = ?", [id]);
    return res.status(200).json({ message: "Delivery Executive deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter,
  getEquipment, addEquipment, updateEquipment, deleteEquipment,
  getCategories, addCategory, updateCategory, deleteCategory,
  getReferences, addReference, updateReference, deleteReference,
  getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive
};