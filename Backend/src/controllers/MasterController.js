// const CareCenter = require("../models/CareCenter");
// const Equipment = require("../models/Equipment");
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

// // const addCareCenter = async (req, res) => {
// //   const { id, name, address, contact_person, phone, gst, status } = req.body;
// //   try {
// //     await CareCenter.create(id, name, address, contact_person, phone, gst);
// //     res.status(201).json({ message: "Care Center Added!" });
// //   } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
// // };
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
//       // ➕ Agar table mein entry nahi thi (sirf user bana tha), toh INSERT karo
//       await pool.query(
//         `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [id, name.trim(), contact_person || "", cleanPhone, address || "", gst || "", status]
//       );
//     }

//     // users table mein bhi name update kar do agar change hua ho
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

// // const deleteCareCenter = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     await pool.query("DELETE FROM care_centers WHERE id = ?", [id]);
// //     res.status(200).json({ message: "Care Center deleted successfully." });
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to delete care center: " + error.message });
// //   }
// // };
// const deleteCareCenter = async (req, res) => {
//   const { id } = req.params;
//   const rawId = id.toString().trim();
//   const numericId = rawId.replace(/\D/g, ""); // "CC006" -> "006"
//   const intId = parseInt(numericId, 10);      // 6

//   let connection;
//   try {
//     connection = await pool.getConnection();
//     await connection.beginTransaction();

//     const [existing] = await connection.query(
//       `SELECT * FROM care_centers 
//        WHERE id = ? 
//           OR id = ? 
//           OR id = ?`,
//       [rawId, numericId, isNaN(intId) ? -1 : intId]
//     );

//     const center = existing[0];
//     const phone = center?.phone;

//     await connection.query(
//       `DELETE FROM notifications 
//        WHERE care_center_id = ? 
//           OR care_center_id = ? 
//           OR care_center_id = ?`,
//       [rawId, numericId, isNaN(intId) ? -1 : intId]
//     ).catch(() => {});

//     await connection.query(
//       `DELETE FROM requisitions 
//        WHERE care_center_id = ? 
//           OR care_center_id = ? 
//           OR care_center_id = ?`,
//       [rawId, numericId, isNaN(intId) ? -1 : intId]
//     ).catch(() => {});

//     await connection.query(
//       `DELETE FROM care_centers 
//        WHERE id = ? 
//           OR id = ? 
//           OR id = ?`,
//       [rawId, numericId, isNaN(intId) ? -1 : intId]
//     );

//     if (phone) {
//       await connection.query("DELETE FROM users WHERE phone = ?", [phone]).catch(() => {});
//     }
//     await connection.query(
//       "DELETE FROM users WHERE id = ? OR id = ?",
//       [rawId, numericId]
//     ).catch(() => {});

//     await connection.commit();
//     res.status(200).json({ message: "Care Center and linked records deleted permanently." });

//   } catch (error) {
//     if (connection) await connection.rollback();
//     console.error("Delete Care Center Crash:", error);
//     res.status(500).json({ 
//       message: "Database Delete Error: " + (error.sqlMessage || error.message) 
//     });
//   } finally {
//     if (connection) connection.release();
//   }
// };


// const getEquipment = async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT *, daily_rate AS dailyRate 
//       FROM equipment
//     `);
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };
// const addEquipment = async (req, res) => {
//   try {
//     const { name, category, daily_rate, stock, status } = req.body;
//         const id = req.body.id || 'EQ-' + Date.now();

//     await pool.query(
//       "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
//       [
//         id, 
//         name, 
//         category || 'General', 
//         daily_rate || 0, 
//         stock || 0, 
//         status || 'Active'
//       ]
//     );

//     res.status(201).json({ message: "Equipment Added!" });
//   } catch (error) { 
//     console.error("Add Equipment Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message, sqlError: error.sqlMessage }); 
//   }
// };

// const updateEquipment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, category, daily_rate, dailyRate, stock, status } = req.body;
//         const finalRate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);
//     const finalCategory = category || 'General';

//     await pool.query(
//       "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
//       [name, finalCategory, finalRate, stock || 0, status || 'Active', id]
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
//     await Equipment.delete(id); 
//     res.status(200).json({ message: "Equipment deleted successfully" });
//   } catch (error) { res.status(500).json({ message: error.message }); }
// };


// const getCategories = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM categories");
//     res.json(rows);
//   } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
// };

// const addCategory = async (req, res) => {
//   try {
//     const { name, status } = req.body;
//     const id = 'CAT-' + Date.now(); 
//     await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, name, status || 'Active']);
//     res.status(201).json({ message: "Category Added!" });
//   } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
// };

// const updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, status } = req.body;
//     await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [name, status || 'Active', id]);
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
//   } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
// };


// const getReferences = async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT id, name AS doctorName, contact AS phone, specialist_domain AS specialistDomain, hospital, status FROM `references`"
//     );
//     res.json(rows);
//   } catch (error) { 
//     res.status(500).json({ message: "Server error", error: error.message }); 
//   }
// };

// const addReference = async (req, res) => {
//   try {
//     const { doctorName, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
//     const finalSpecialist = specialistDomain || specialist_domain || '';
//     const finalHospital = hospital || '';
//     const id = 'REF-' + Date.now();
    
//     await pool.query(
//       "INSERT INTO `references` (id, name, contact, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?)", 
//       [id, doctorName, phone, finalSpecialist, finalHospital, status || 'Active']
//     );
//     res.status(201).json({ message: "Reference Added!" });
//   } catch (error) { 
//     console.error(error);
//     res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); 
//   }
// };

// const updateReference = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { doctorName, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
//     const finalSpecialist = specialistDomain !== undefined ? specialistDomain : (specialist_domain || '');
//     const finalHospital = hospital !== undefined ? hospital : '';
    
//     await pool.query(
//       "UPDATE `references` SET name = ?, contact = ?, specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
//       [doctorName, phone, finalSpecialist, finalHospital, status || 'Active', id]
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
//   } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
// };


// const getDeliveryExecutives = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM delivery_executives");
//     res.json(rows);
//   } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
// };

// const addDeliveryExecutive = async (req, res) => {
//   try {
//     const { driverName, phone, status } = req.body;
//     const id = 'DEL-' + Date.now();
//     await pool.query(
//       "INSERT INTO delivery_executives (id, name, phone, status) VALUES (?, ?, ?, ?)", 
//       [id, driverName, phone, status || 'Active']
//     );
//     res.status(201).json({ message: "Delivery Executive Added!" });
//   } catch (error) { res.status(500).json({ message: "Server error", sqlError: error.sqlMessage }); }
// };

// const updateDeliveryExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { driverName, phone, status } = req.body;
//     // db column name 'name'
//     await pool.query(
//       "UPDATE delivery_executives SET name = ?, phone = ?, status = ? WHERE id = ?",
//       [driverName, phone, status || 'Active', id]
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
//   } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
// };

// module.exports = { 
//   getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter, 
//   getEquipment, addEquipment, updateEquipment, deleteEquipment, 
//   getCategories, addCategory, updateCategory, deleteCategory, 
//   getReferences, addReference, updateReference, deleteReference, 
//   getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive 
// };


const pool = require("../config/database");

// ==========================================
// 🏥 CARE CENTERS
// ==========================================
const getCareCenters = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const [ccRows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC");
    const [userRows] = await pool.query(
      "SELECT id, name, phone, 'Active' as status FROM users WHERE role = 'care_center'"
    );

    const existingPhones = new Set(
      ccRows.map((c) => (c.phone || "").toString().replace(/\D/g, "").slice(-10))
    );
    const mergedList = [...ccRows];

    for (const u of userRows) {
      const uPhone = (u.phone || "").toString().replace(/\D/g, "").slice(-10);
      if (uPhone && !existingPhones.has(uPhone)) {
        mergedList.push({
          id: `CC-${u.id}`,
          name: u.name,
          phone: u.phone,
          address: "",
          contact_person: "",
          status: "Active"
        });
        existingPhones.add(uPhone);
      }
    }

    res.status(200).json(mergedList);
  } catch (error) {
    console.error("Fetch Care Centers Error:", error);
    res.status(500).json({ message: "Failed to fetch care centers: " + error.message });
  }
};

const addCareCenter = async (req, res) => {
  try {
    const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
    const cleanPhone = (phone || "").toString().replace(/\D/g, "");

    if (!name || !cleanPhone) {
      return res.status(400).json({ message: "Name and Phone number are required." });
    }

    const id = `CC-${Math.floor(1000 + Math.random() * 9000)}`;

    await pool.query(
      `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name.trim(), contact_person || "", cleanPhone, address || "", gst || "", status]
    );

    res.status(201).json({ id, name, contact_person, phone: cleanPhone, address, gst, status });
  } catch (error) {
    res.status(500).json({ message: "Failed to add care center: " + error.message });
  }
};

const updateCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
    const cleanPhone = (phone || "").toString().replace(/\D/g, "");

    const [existing] = await pool.query(
      "SELECT * FROM care_centers WHERE id = ? OR phone = ? OR phone LIKE ?",
      [id, cleanPhone, `%${cleanPhone.slice(-10)}`]
    );

    if (existing.length > 0) {
      const targetId = existing[0].id;
      await pool.query(
        `UPDATE care_centers 
         SET name = COALESCE(?, name),
             contact_person = COALESCE(?, contact_person),
             phone = COALESCE(?, phone),
             address = COALESCE(?, address),
             gst = COALESCE(?, gst),
             status = COALESCE(?, status)
         WHERE id = ?`,
        [name, contact_person, phone, address, gst, status, targetId]
      );
    } else {
      await pool.query(
        `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, name.trim(), contact_person || "", cleanPhone, address || "", gst || "", status]
      );
    }

    if (name && cleanPhone) {
      await pool.query(
        "UPDATE users SET name = ? WHERE phone = ? OR phone LIKE ?",
        [name.trim(), cleanPhone, `%${cleanPhone.slice(-10)}`]
      );
    }

    res.status(200).json({ message: "Care Center details updated successfully!" });
  } catch (error) {
    console.error("Update Care Center Error:", error);
    res.status(500).json({ message: "Failed to update care center: " + error.message });
  }
};

// ⚡ 100% FIXED & SAFE DELETE CARE CENTER
const deleteCareCenter = async (req, res) => {
  const { id } = req.params;
  const targetId = String(id).trim();

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT id, phone FROM care_centers WHERE id = ?",
      [targetId]
    );

    const phone = existing[0]?.phone;
    await connection.query("DELETE FROM notifications WHERE care_center_id = ?", [targetId]);
    await connection.query("DELETE FROM requisitions WHERE care_center_id = ?", [targetId]);

    const [result] = await connection.query("DELETE FROM care_centers WHERE id = ?", [targetId]);
    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
      if (cleanPhone) {
        await connection.query(
          "DELETE FROM users WHERE phone = ? OR phone LIKE ?",
          [phone, `%${cleanPhone}`]
        );
      }
    }
    await connection.query("DELETE FROM users WHERE id = ?", [targetId]);

    await connection.commit();

    if (result.affectedRows === 0 && (!existing || existing.length === 0)) {
      return res.status(404).json({ message: "Care center not found." });
    }

    res.status(200).json({ message: "Care Center and linked records deleted permanently." });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Delete Care Center Crash:", error);
    res.status(500).json({ 
      message: "Database Delete Error: " + (error.sqlMessage || error.message) 
    });
  } finally {
    if (connection) connection.release();
  }
};


const getEquipment = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *, daily_rate AS dailyRate 
      FROM equipment 
      ORDER BY id DESC
    `);
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const addEquipment = async (req, res) => {
  try {
    const { name, category, daily_rate, dailyRate, stock, status } = req.body;
    const id = req.body.id || `EQ-${Date.now()}`;
    const rate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

    await pool.query(
      "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, category || "General", rate, stock || 0, status || "Active"]
    );

    res.status(201).json({ message: "Equipment Added!", id });
  } catch (error) { 
    console.error("Add Equipment Error:", error);
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, daily_rate, dailyRate, stock, status } = req.body;
    const finalRate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);
    const finalCategory = category || "General";

    await pool.query(
      "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
      [name, finalCategory, finalRate, stock || 0, status || "Active", id]
    );
    
    res.status(200).json({ message: "Equipment updated successfully" });
  } catch (error) {
    console.error("Update Equipment Error:", error);
    res.status(400).json({ message: error.sqlMessage || error.message });
  }
};

const deleteEquipment = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query("DELETE FROM requisitions WHERE equipment_id = ?", [id]);
    const [result] = await connection.query("DELETE FROM equipment WHERE id = ?", [id]);

    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) { 
    if (connection) await connection.rollback();
    res.status(500).json({ message: error.message }); 
  } finally {
    if (connection) connection.release();
  }
};


const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const id = `CAT-${Date.now()}`; 
    await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, name, status || "Active"]);
    res.status(201).json({ message: "Category Added!", id });
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [name, status || "Active", id]);
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


const getReferences = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name AS doctorName, contact AS phone, specialist_domain AS specialistDomain, hospital, status FROM `references` ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const addReference = async (req, res) => {
  try {
    const { doctorName, name, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
    const finalDoctor = doctorName || name || "";
    const finalSpecialist = specialistDomain || specialist_domain || "";
    const finalHospital = hospital || "";
    const id = `REF-${Date.now()}`;
    
    await pool.query(
      "INSERT INTO `references` (id, name, contact, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?)", 
      [id, finalDoctor, phone, finalSpecialist, finalHospital, status || "Active"]
    );
    res.status(201).json({ message: "Reference Added!", id });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const updateReference = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, name, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
    const finalDoctor = doctorName || name || "";
    const finalSpecialist = specialistDomain !== undefined ? specialistDomain : (specialist_domain || "");
    const finalHospital = hospital !== undefined ? hospital : "";
    
    await pool.query(
      "UPDATE `references` SET name = ?, contact = ?, specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
      [finalDoctor, phone, finalSpecialist, finalHospital, status || "Active", id]
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


const getDeliveryExecutives = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, name AS driverName FROM delivery_executives ORDER BY id DESC");
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const addDeliveryExecutive = async (req, res) => {
  try {
    const { driverName, name, phone, status } = req.body;
    const id = `DEL-${Date.now()}`;
    await pool.query(
      "INSERT INTO delivery_executives (id, name, phone, status) VALUES (?, ?, ?, ?)", 
      [id, driverName || name, phone, status || "Active"]
    );
    res.status(201).json({ message: "Delivery Executive Added!", id });
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const updateDeliveryExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverName, name, phone, status } = req.body;
    await pool.query(
      "UPDATE delivery_executives SET name = ?, phone = ?, status = ? WHERE id = ?",
      [driverName || name, phone, status || "Active", id]
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