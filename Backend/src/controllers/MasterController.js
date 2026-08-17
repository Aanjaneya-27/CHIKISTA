// const pool = require("../config/database");


// const getCareCenters = async (req, res) => {
//   try {
//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     const [ccRows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC");
//     const [userRows] = await pool.query(
//       "SELECT id, name, phone, 'Active' as status FROM users WHERE role = 'care_center'"
//     );

//     const existingPhones = new Set(
//       ccRows.map((c) => (c.phone || "").toString().replace(/\D/g, "").slice(-10))
//     );
//     const mergedList = [...ccRows];

//     for (const u of userRows) {
//       const uPhone = (u.phone || "").toString().replace(/\D/g, "").slice(-10);
//       if (uPhone && !existingPhones.has(uPhone)) {
//         mergedList.push({
//           id: `CC-${u.id}`,
//           name: u.name,
//           phone: u.phone,
//           address: "",
//           contact_person: "",
//           status: "Active"
//         });
//         existingPhones.add(uPhone);
//       }
//     }

//     res.status(200).json(mergedList);
//   } catch (error) {
//     console.error("Fetch Care Centers Error:", error);
//     res.status(500).json({ message: "Failed to fetch care centers: " + error.message });
//   }
// };

// const addCareCenter = async (req, res) => {
//   try {
//     const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
//     const cleanPhone = (phone || "").toString().replace(/\D/g, "");

//     if (!name || !cleanPhone) {
//       return res.status(400).json({ message: "Name and Phone number are required." });
//     }

//     const id = `CC-${Math.floor(1000 + Math.random() * 9000)}`;

//     await pool.query(
//       `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [id, name.trim(), contact_person || "", cleanPhone, address || "", gst || "", status]
//     );

//     res.status(201).json({ id, name, contact_person, phone: cleanPhone, address, gst, status });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to add care center: " + error.message });
//   }
// };

// const updateCareCenter = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
//     const cleanPhone = (phone || "").toString().replace(/\D/g, "");

//     const [existing] = await pool.query(
//       "SELECT * FROM care_centers WHERE id = ? OR phone = ? OR phone LIKE ?",
//       [id, cleanPhone, `%${cleanPhone.slice(-10)}`]
//     );

//     if (existing.length > 0) {
//       const targetId = existing[0].id;
//       await pool.query(
//         `UPDATE care_centers 
//          SET name = COALESCE(?, name),
//              contact_person = COALESCE(?, contact_person),
//              phone = COALESCE(?, phone),
//              address = COALESCE(?, address),
//              gst = COALESCE(?, gst),
//              status = COALESCE(?, status)
//          WHERE id = ?`,
//         [name, contact_person, phone, address, gst, status, targetId]
//       );
//     } else {
//       await pool.query(
//         `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [id, name.trim(), contact_person || "", cleanPhone, address || "", gst || "", status]
//       );
//     }

//     if (name && cleanPhone) {
//       await pool.query(
//         "UPDATE users SET name = ? WHERE phone = ? OR phone LIKE ?",
//         [name.trim(), cleanPhone, `%${cleanPhone.slice(-10)}`]
//       );
//     }

//     res.status(200).json({ message: "Care Center details updated successfully!" });
//   } catch (error) {
//     console.error("Update Care Center Error:", error);
//     res.status(500).json({ message: "Failed to update care center: " + error.message });
//   }
// };

// // ⚡ 100% CRASH-PROOF DELETE (Handles both "CC-9" and numeric IDs safely)
// const deleteCareCenter = async (req, res) => {
//   const { id } = req.params;
//   const targetId = String(id).trim(); // e.g. "CC-9"
//   const numericOnly = targetId.replace(/\D/g, ""); // e.g. "9"
//   const intId = numericOnly ? parseInt(numericOnly, 10) : null;

//   try {
//     // 1. Phone number dhoondo agar care_centers mein ho
//     let phone = null;
//     try {
//       const [rows] = await pool.query("SELECT phone FROM care_centers WHERE id = ?", [targetId]);
//       if (rows && rows.length > 0) phone = rows[0].phone;
//     } catch (_) {}

//     // 2. Foreign keys bypass karo
//     await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});

//     // 3. Requisitions aur Notifications mein clean karo
//     await pool.query("DELETE FROM requisitions WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});
//     await pool.query("DELETE FROM notifications WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});

//     // 4. Care center delete karo
//     await pool.query("DELETE FROM care_centers WHERE id = ? OR id = ?", [targetId, numericOnly || targetId]).catch(() => {});

//     // 5. Users table se integer ID match karke delete karo (CC-9 crash prevention)
//     if (intId !== null && !isNaN(intId)) {
//       await pool.query("DELETE FROM users WHERE id = ?", [intId]).catch(() => {});
//     }
//     await pool.query("DELETE FROM users WHERE id = ?", [targetId]).catch(() => {});

//     // 6. Phone number se match hone wala user delete karo
//     if (phone) {
//       const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
//       if (cleanPhone) {
//         await pool.query("DELETE FROM users WHERE phone LIKE ?", [`%${cleanPhone}`]).catch(() => {});
//       }
//     }

//     // 7. Foreign keys re-enable karo
//     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});

//     return res.status(200).json({ message: "Care Center deleted successfully." });
//   } catch (error) {
//     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
//     console.error("Delete Care Center Error:", error);
//     return res.status(500).json({ message: "Failed to delete care center", error: error.message });
//   }
// };

// // ==========================================
// // 📦 EQUIPMENT
// // ==========================================
// const getEquipment = async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT *, daily_rate AS dailyRate 
//       FROM equipment 
//       ORDER BY id DESC
//     `);
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const addEquipment = async (req, res) => {
//   try {
//     const { name, category, daily_rate, dailyRate, stock, status } = req.body;
//     const id = req.body.id || `EQ-${Date.now()}`;
//     const rate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

//     await pool.query(
//       "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
//       [id, name, category || "General", rate, stock || 0, status || "Active"]
//     );

//     res.status(201).json({ message: "Equipment Added!", id });
//   } catch (error) { 
//     console.error("Add Equipment Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const updateEquipment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, category, daily_rate, dailyRate, stock, status } = req.body;
//     const finalRate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);
//     const finalCategory = category || "General";

//     await pool.query(
//       "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
//       [name, finalCategory, finalRate, stock || 0, status || "Active", id]
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
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const addCategory = async (req, res) => {
//   try {
//     const { name, status } = req.body;
//     const id = `CAT-${Date.now()}`; 
//     await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, name, status || "Active"]);
//     res.status(201).json({ message: "Category Added!", id });
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, status } = req.body;
//     await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [name, status || "Active", id]);
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
//       "SELECT id, name AS doctorName, contact AS phone, specialist_domain AS specialistDomain, hospital, status FROM `references` ORDER BY id DESC"
//     );
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const addReference = async (req, res) => {
//   try {
//     const { doctorName, name, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
//     const finalDoctor = doctorName || name || "";
//     const finalSpecialist = specialistDomain || specialist_domain || "";
//     const finalHospital = hospital || "";
//     const id = `REF-${Date.now()}`;
    
//     await pool.query(
//       "INSERT INTO `references` (id, name, contact, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?)", 
//       [id, finalDoctor, phone, finalSpecialist, finalHospital, status || "Active"]
//     );
//     res.status(201).json({ message: "Reference Added!", id });
//   } catch (error) { 
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const updateReference = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { doctorName, name, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
//     const finalDoctor = doctorName || name || "";
//     const finalSpecialist = specialistDomain !== undefined ? specialistDomain : (specialist_domain || "");
//     const finalHospital = hospital !== undefined ? hospital : "";
    
//     await pool.query(
//       "UPDATE `references` SET name = ?, contact = ?, specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
//       [finalDoctor, phone, finalSpecialist, finalHospital, status || "Active", id]
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
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const addDeliveryExecutive = async (req, res) => {
//   try {
//     const { driverName, name, phone, status } = req.body;
//     const id = `DEL-${Date.now()}`;
//     await pool.query(
//       "INSERT INTO delivery_executives (id, name, phone, status) VALUES (?, ?, ?, ?)", 
//       [id, driverName || name, phone, status || "Active"]
//     );
//     res.status(201).json({ message: "Delivery Executive Added!", id });
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const updateDeliveryExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { driverName, name, phone, status } = req.body;
//     await pool.query(
//       "UPDATE delivery_executives SET name = ?, phone = ?, status = ? WHERE id = ?",
//       [driverName || name, phone, status || "Active", id]
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

const cleanPhone = (num) => String(num || "").replace(/\D/g, "").slice(-10);


const getCareCenters = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Fetch Care Centers Error:", error);
    res.status(500).json({ message: "Failed to fetch care centers: " + error.message });
  }
};

const addCareCenter = async (req, res) => {
  try {
    const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
    const cleaned = cleanPhone(phone);

    if (!name || cleaned.length < 10) {
      return res.status(400).json({ message: "Valid Name and 10-digit Phone number are required." });
    }

    const id = `CC-${Math.floor(1000 + Math.random() * 9000)}`;

    await pool.query(
      `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name.trim(), contact_person || "", cleaned, address || "", gst || "", status]
    );

    res.status(201).json({ id, name, contact_person, phone: cleaned, address, gst, status });
  } catch (error) {
    console.error("Add Care Center Error:", error);
    res.status(500).json({ message: "Failed to add care center: " + error.message });
  }
};

const updateCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
    const cleaned = phone ? cleanPhone(phone) : null;

    await pool.query(
      `UPDATE care_centers 
       SET name = COALESCE(?, name),
           contact_person = COALESCE(?, contact_person),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           gst = COALESCE(?, gst),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [name?.trim() || null, contact_person || null, cleaned, address || null, gst || null, status, id]
    );

    res.status(200).json({ message: "Care Center details updated successfully!" });
  } catch (error) {
    console.error("Update Care Center Error:", error);
    res.status(500).json({ message: "Failed to update care center: " + error.message });
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
    return res.status(500).json({ message: "Failed to delete care center: " + error.message });
  }
};

// ==========================================
// 📦 EQUIPMENT (DEVICES)
// ==========================================
const getEquipment = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, daily_rate AS dailyRate FROM equipment ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const addEquipment = async (req, res) => {
  try {
    const { name, category, daily_rate, dailyRate, stock, status } = req.body;
    const id = req.body.id || `EQ-${Date.now()}`;
    const rate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

    await pool.query(
      "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name?.trim(), category || "General", Number(rate) || 0, Number(stock) || 0, status || "Active"]
    );

    res.status(201).json({ message: "Equipment Added!", id });
  } catch (error) { 
    console.error("Add Equipment Error:", error);
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, daily_rate, dailyRate, stock, status } = req.body;
    const finalRate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

    await pool.query(
      "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
      [name?.trim(), category || "General", Number(finalRate) || 0, Number(stock) || 0, status || "Active", id]
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
    await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});
    await pool.query("DELETE FROM requisitions WHERE equipment_id = ?", [id]).catch(() => {});
    await pool.query("DELETE FROM equipment WHERE id = ?", [id]);
    await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});

    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) { 
    await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
    res.status(500).json({ message: error.message }); 
  }
};

// ==========================================
// 🏷️ CATEGORIES (ACCESSORIES)
// ==========================================
const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const id = `CAT-${Date.now()}`; 
    await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, name?.trim(), status || "Active"]);
    res.status(201).json({ message: "Category Added!", id });
  } catch (error) { 
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [name?.trim(), status || "Active", id]);
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
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// ==========================================
// 👨‍⚕️ REFERENCES (DOCTORS)
// ==========================================
const getReferences = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name AS doctorName, contact AS phone, phone AS altPhone, specialist_domain AS domain, hospital, status FROM `references` ORDER BY id DESC"
    );
    res.status(200).json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const addReference = async (req, res) => {
  try {
    const { doctorName, name, phone, domain, specialistDomain, hospital, status } = req.body;
    const finalDoctor = (doctorName || name || "").trim();
    const finalSpecialist = (domain || specialistDomain || "").trim();
    const finalHospital = (hospital || "").trim();
    const cleaned = cleanPhone(phone);
    const id = `REF-${Date.now()}`;
    
    await pool.query(
      "INSERT INTO `references` (id, name, contact, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?)", 
      [id, finalDoctor, cleaned, finalSpecialist, finalHospital, status || "Active"]
    );
    res.status(201).json({ message: "Reference Added!", id });
  } catch (error) { 
    console.error("Add Reference Error:", error);
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const updateReference = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, name, phone, domain, specialistDomain, hospital, status } = req.body;
    const finalDoctor = (doctorName || name || "").trim();
    const finalSpecialist = (domain || specialistDomain || "").trim();
    const cleaned = phone ? cleanPhone(phone) : null;
    
    await pool.query(
      "UPDATE `references` SET name = ?, contact = COALESCE(?, contact), specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
      [finalDoctor, cleaned, finalSpecialist, hospital || "", status || "Active", id]
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
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// ==========================================
// 🚚 DELIVERY EXECUTIVES
// ==========================================
const getDeliveryExecutives = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, name AS driverName FROM delivery_executives ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const addDeliveryExecutive = async (req, res) => {
  try {
    const { driverName, name, phone, status } = req.body;
    const cleaned = cleanPhone(phone);
    const id = `DEL-${Date.now()}`;

    await pool.query(
      "INSERT INTO delivery_executives (id, name, phone, status) VALUES (?, ?, ?, ?)", 
      [id, (driverName || name || "").trim(), cleaned, status || "Active"]
    );
    res.status(201).json({ message: "Delivery Executive Added!", id });
  } catch (error) { 
    console.error("Add Delivery Exec Error:", error);
    res.status(500).json({ message: "Server error: " + error.message }); 
  }
};

const updateDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverName, name, phone, status } = req.body;
    const cleaned = phone ? cleanPhone(phone) : null;

    await pool.query(
      "UPDATE delivery_executives SET name = ?, phone = COALESCE(?, phone), status = ? WHERE id = ?",
      [(driverName || name || "").trim(), cleaned, status || "Active", id]
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
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

module.exports = { 
  getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter, 
  getEquipment, addEquipment, updateEquipment, deleteEquipment, 
  getCategories, addCategory, updateCategory, deleteCategory, 
  getReferences, addReference, updateReference, deleteReference, 
  getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive 
};