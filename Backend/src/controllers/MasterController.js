// const pool = require("../config/database");

// const cleanPhone = (num) => String(num || "").replace(/\D/g, "").slice(-10);


// const getCareCenters = async (req, res) => {
//   try {
//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC");
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("Fetch Care Centers Error:", error);
//     res.status(500).json({ message: "Failed to fetch care centers: " + error.message });
//   }
// };

// const addCareCenter = async (req, res) => {
//   try {
//     const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
//     const cleaned = cleanPhone(phone);

//     if (!name || cleaned.length < 10) {
//       return res.status(400).json({ message: "Valid Name and 10-digit Phone number are required." });
//     }

//     const id = `CC-${Math.floor(1000 + Math.random() * 9000)}`;

//     await pool.query(
//       `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [id, name.trim(), contact_person || "", cleaned, address || "", gst || "", status]
//     );

//     res.status(201).json({ id, name, contact_person, phone: cleaned, address, gst, status });
//   } catch (error) {
//     console.error("Add Care Center Error:", error);
//     res.status(500).json({ message: "Failed to add care center: " + error.message });
//   }
// };

// const updateCareCenter = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
//     const cleaned = phone ? cleanPhone(phone) : null;

//     await pool.query(
//       `UPDATE care_centers 
//        SET name = COALESCE(?, name),
//            contact_person = COALESCE(?, contact_person),
//            phone = COALESCE(?, phone),
//            address = COALESCE(?, address),
//            gst = COALESCE(?, gst),
//            status = COALESCE(?, status)
//        WHERE id = ?`,
//       [name?.trim() || null, contact_person || null, cleaned, address || null, gst || null, status, id]
//     );

//     res.status(200).json({ message: "Care Center details updated successfully!" });
//   } catch (error) {
//     console.error("Update Care Center Error:", error);
//     res.status(500).json({ message: "Failed to update care center: " + error.message });
//   }
// };

// const deleteCareCenter = async (req, res) => {
//   const { id } = req.params;
//   const targetId = String(id).trim();
//   const numericOnly = targetId.replace(/\D/g, "");

//   try {
//     await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});

//     await pool.query("DELETE FROM requisitions WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});
//     await pool.query("DELETE FROM notifications WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});
//     await pool.query("DELETE FROM care_centers WHERE id = ? OR id = ?", [targetId, numericOnly || targetId]);

//     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
//     return res.status(200).json({ message: "Care Center deleted successfully." });
//   } catch (error) {
//     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
//     console.error("Delete Care Center Error:", error);
//     return res.status(500).json({ message: "Failed to delete care center: " + error.message });
//   }
// };

// // ==========================================
// // 📦 EQUIPMENT (DEVICES)
// // ==========================================
// const getEquipment = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT *, daily_rate AS dailyRate FROM equipment ORDER BY id DESC");
//     res.status(200).json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const addEquipment = async (req, res) => {
//   try {
//     const { name, category, daily_rate, dailyRate, stock, status } = req.body;
//     const id = req.body.id || `EQ-${Date.now()}`;
//     const rate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

//     await pool.query(
//       "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
//       [id, name?.trim(), category || "General", Number(rate) || 0, Number(stock) || 0, status || "Active"]
//     );

//     res.status(201).json({ message: "Equipment Added!", id });
//   } catch (error) { 
//     console.error("Add Equipment Error:", error);
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const updateEquipment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, category, daily_rate, dailyRate, stock, status } = req.body;
//     const finalRate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

//     await pool.query(
//       "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
//       [name?.trim(), category || "General", Number(finalRate) || 0, Number(stock) || 0, status || "Active", id]
//     );
    
//     res.status(200).json({ message: "Equipment updated successfully" });
//   } catch (error) {
//     console.error("Update Equipment Error:", error);
//     res.status(400).json({ message: error.sqlMessage || error.message });
//   }
// };

// const deleteEquipment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});
//     await pool.query("DELETE FROM requisitions WHERE equipment_id = ?", [id]).catch(() => {});
//     await pool.query("DELETE FROM equipment WHERE id = ?", [id]);
//     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});

//     res.status(200).json({ message: "Equipment deleted successfully" });
//   } catch (error) { 
//     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
//     res.status(500).json({ message: error.message }); 
//   }
// };

// // ==========================================
// // 🏷️ CATEGORIES (ACCESSORIES)
// // ==========================================
// const getCategories = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
//     res.status(200).json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const addCategory = async (req, res) => {
//   try {
//     const { name, status } = req.body;
//     const id = `CAT-${Date.now()}`; 
//     await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, name?.trim(), status || "Active"]);
//     res.status(201).json({ message: "Category Added!", id });
//   } catch (error) { 
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, status } = req.body;
//     await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [name?.trim(), status || "Active", id]);
//     res.status(200).json({ message: "Category updated successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.sqlMessage || error.message });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;  
//     await pool.query("DELETE FROM categories WHERE id = ?", [id]);
//     res.status(200).json({ message: "Category deleted successfully" });
//   } catch (error) { 
//     res.status(500).json({ message: error.message }); 
//   }
// };

// // ==========================================
// // 👨‍⚕️ REFERENCES (DOCTORS)
// // ==========================================
// const getReferences = async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT id, name AS doctorName, contact AS phone, phone AS altPhone, specialist_domain AS domain, hospital, status FROM `references` ORDER BY id DESC"
//     );
//     res.status(200).json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const addReference = async (req, res) => {
//   try {
//     const { doctorName, name, phone, domain, specialistDomain, hospital, status } = req.body;
//     const finalDoctor = (doctorName || name || "").trim();
//     const finalSpecialist = (domain || specialistDomain || "").trim();
//     const finalHospital = (hospital || "").trim();
//     const cleaned = cleanPhone(phone);
//     const id = `REF-${Date.now()}`;
    
//     await pool.query(
//       "INSERT INTO `references` (id, name, contact, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?)", 
//       [id, finalDoctor, cleaned, finalSpecialist, finalHospital, status || "Active"]
//     );
//     res.status(201).json({ message: "Reference Added!", id });
//   } catch (error) { 
//     console.error("Add Reference Error:", error);
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const updateReference = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { doctorName, name, phone, domain, specialistDomain, hospital, status } = req.body;
//     const finalDoctor = (doctorName || name || "").trim();
//     const finalSpecialist = (domain || specialistDomain || "").trim();
//     const cleaned = phone ? cleanPhone(phone) : null;
    
//     await pool.query(
//       "UPDATE `references` SET name = ?, contact = COALESCE(?, contact), specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
//       [finalDoctor, cleaned, finalSpecialist, hospital || "", status || "Active", id]
//     );
//     res.status(200).json({ message: "Reference updated successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.sqlMessage || error.message });
//   }
// };

// const deleteReference = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM `references` WHERE id = ?", [id]); 
//     res.status(200).json({ message: "Reference deleted successfully" });
//   } catch (error) { 
//     res.status(500).json({ message: error.message }); 
//   }
// };

// // ==========================================
// // 🚚 DELIVERY EXECUTIVES
// // ==========================================
// const getDeliveryExecutives = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT *, name AS driverName FROM delivery_executives ORDER BY id DESC");
//     res.status(200).json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const addDeliveryExecutive = async (req, res) => {
//   try {
//     const { driverName, name, phone, status } = req.body;
//     const cleaned = cleanPhone(phone);
//     const id = `DEL-${Date.now()}`;

//     await pool.query(
//       "INSERT INTO delivery_executives (id, name, phone, status) VALUES (?, ?, ?, ?)", 
//       [id, (driverName || name || "").trim(), cleaned, status || "Active"]
//     );
//     res.status(201).json({ message: "Delivery Executive Added!", id });
//   } catch (error) { 
//     console.error("Add Delivery Exec Error:", error);
//     res.status(500).json({ message: "Server error: " + error.message }); 
//   }
// };

// const updateDeliveryExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { driverName, name, phone, status } = req.body;
//     const cleaned = phone ? cleanPhone(phone) : null;

//     await pool.query(
//       "UPDATE delivery_executives SET name = ?, phone = COALESCE(?, phone), status = ? WHERE id = ?",
//       [(driverName || name || "").trim(), cleaned, status || "Active", id]
//     );
//     res.status(200).json({ message: "Delivery Executive updated successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.sqlMessage || error.message });
//   }
// };

// const deleteDeliveryExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM delivery_executives WHERE id = ?", [id]); 
//     res.status(200).json({ message: "Delivery Executive deleted successfully" });
//   } catch (error) { 
//     res.status(500).json({ message: error.message }); 
//   }
// };

// module.exports = { 
//   getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter, 
//   getEquipment, addEquipment, updateEquipment, deleteEquipment, 
//   getCategories, addCategory, updateCategory, deleteCategory, 
//   getReferences, addReference, updateReference, deleteReference, 
//   getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive 
// };

const pool = require("../config/database");

// 👨‍⚕️ 1. REFERENCES
const getReferences = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `references` ORDER BY id DESC").catch(() => [[]]);
    const formatted = (rows || []).map((r) => ({
      id: r.id,
      name: r.doctor_name || r.doctorName || r.name || "",
      doctorName: r.doctor_name || r.doctorName || r.name || "",
      phone: r.phone || r.contact || "",
      hospital: r.hospital || "",
      domain: r.specialist_domain || r.domain || r.specialistDomain || "",
      address: r.address || "",
      status: r.status || "Active"
    }));
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Get References Error:", error);
    return res.status(200).json([]); // Fallback to empty list instead of 500
  }
};

// 🏥 2. CARE CENTERS
const getCareCenters = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC").catch(() => [[]]);
    return res.status(200).json(rows || []);
  } catch (error) {
    console.error("Get Care Centers Error:", error);
    return res.status(200).json([]);
  }
};

// 📦 3. EQUIPMENT
const getEquipment = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM equipment ORDER BY id DESC").catch(() => [[]]);
    return res.status(200).json(rows || []);
  } catch (error) {
    console.error("Get Equipment Error:", error);
    return res.status(200).json([]);
  }
};

// 🏷️ 4. CATEGORIES (ACCESSORIES)
const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC").catch(() => [[]]);
    return res.status(200).json(rows || []);
  } catch (error) {
    console.error("Get Categories Error:", error);
    return res.status(200).json([]);
  }
};

// 🚚 5. DELIVERY EXECUTIVES
const getDeliveryExecutives = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM delivery_executives ORDER BY id DESC").catch(() => [[]]);
    return res.status(200).json(rows || []);
  } catch (error) {
    console.error("Get Delivery Execs Error:", error);
    return res.status(200).json([]);
  }
};

// POST / PUT / DELETE Handlers
const addReference = async (req, res) => {
  try {
    const data = req.body;
    const doctorName = (data.doctorName || data.doctor_name || data.name || "").trim();
    const phone = (data.phone || data.contact || "").trim();
    const hospital = (data.hospital || "").trim();
    const domain = (data.specialistDomain || data.specialist_domain || data.domain || "").trim();
    const address = (data.address || "").trim();
    const status = data.status || "Active";

    if (!doctorName) return res.status(400).json({ message: "Doctor name required." });

    const [result] = await pool.query(
      "INSERT INTO `references` (doctor_name, phone, contact, hospital, specialist_domain, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [doctorName, phone, phone, hospital, domain, address, status]
    );
    return res.status(201).json({ message: "Reference added!", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateReference = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await pool.query(
      "UPDATE `references` SET doctor_name = ?, phone = ?, contact = ?, hospital = ?, specialist_domain = ?, address = ?, status = ? WHERE id = ?",
      [data.doctorName || data.name, data.phone, data.phone, data.hospital, data.specialistDomain, data.address, data.status || "Active", id]
    );
    return res.status(200).json({ message: "Reference updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteReference = async (req, res) => {
  try {
    await pool.query("DELETE FROM `references` WHERE id = ?", [req.params.id]);
    return res.status(200).json({ message: "Reference deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addCareCenter = async (req, res) => {
  try {
    const { name, phone, address, contactPerson, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO care_centers (name, phone, address, contact_person, status) VALUES (?, ?, ?, ?, ?)",
      [name?.trim(), phone?.trim(), address?.trim() || "", contactPerson?.trim() || "", status || "Active"]
    );
    return res.status(201).json({ message: "Care center added!", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateCareCenter = async (req, res) => {
  try {
    const { name, phone, address, contactPerson, status } = req.body;
    await pool.query(
      "UPDATE care_centers SET name = ?, phone = ?, address = ?, contact_person = ?, status = ? WHERE id = ?",
      [name?.trim(), phone?.trim(), address?.trim() || "", contactPerson?.trim() || "", status || "Active", req.params.id]
    );
    return res.status(200).json({ message: "Care center updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteCareCenter = async (req, res) => {
  try {
    await pool.query("DELETE FROM care_centers WHERE id = ?", [req.params.id]);
    return res.status(200).json({ message: "Care center deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addEquipment = async (req, res) => {
  try {
    const { name, category, model, serialNumber, stock, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO equipment (name, category, model, serial_number, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
      [name?.trim(), category?.trim() || "General", model?.trim() || "", serialNumber || "", Number(stock) || 1, status || "Active"]
    );
    return res.status(201).json({ message: "Equipment added!", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { name, category, model, serialNumber, stock, status } = req.body;
    await pool.query(
      "UPDATE equipment SET name = ?, category = ?, model = ?, serial_number = ?, stock = ?, status = ? WHERE id = ?",
      [name?.trim(), category?.trim() || "General", model?.trim() || "", serialNumber || "", Number(stock) || 1, status || "Active", req.params.id]
    );
    return res.status(200).json({ message: "Equipment updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    await pool.query("DELETE FROM equipment WHERE id = ?", [req.params.id]);
    return res.status(200).json({ message: "Equipment deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const [result] = await pool.query("INSERT INTO categories (name, status) VALUES (?, ?)", [name?.trim(), status || "Active"]);
    return res.status(201).json({ message: "Category added!", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [req.body.name?.trim(), req.body.status || "Active", req.params.id]);
    return res.status(200).json({ message: "Category updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    return res.status(200).json({ message: "Category deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addDeliveryExecutive = async (req, res) => {
  try {
    const { name, driverName, phone, vehicleNumber, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO delivery_executives (driver_name, phone, vehicle_number, status) VALUES (?, ?, ?, ?)",
      [(driverName || name)?.trim(), phone?.trim(), vehicleNumber || "", status || "Active"]
    );
    return res.status(201).json({ message: "Delivery Executive added!", id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateDeliveryExecutive = async (req, res) => {
  try {
    const { name, driverName, phone, vehicleNumber, status } = req.body;
    await pool.query(
      "UPDATE delivery_executives SET driver_name = ?, phone = ?, vehicle_number = ?, status = ? WHERE id = ?",
      [(driverName || name)?.trim(), phone?.trim(), vehicleNumber || "", status || "Active", req.params.id]
    );
    return res.status(200).json({ message: "Delivery Executive updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteDeliveryExecutive = async (req, res) => {
  try {
    await pool.query("DELETE FROM delivery_executives WHERE id = ?", [req.params.id]);
    return res.status(200).json({ message: "Delivery Executive deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getReferences, addReference, updateReference, deleteReference,
  getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter,
  getEquipment, addEquipment, updateEquipment, deleteEquipment,
  getCategories, addCategory, updateCategory, deleteCategory,
  getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive
};