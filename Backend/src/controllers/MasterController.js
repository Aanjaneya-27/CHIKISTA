// // const pool = require("../config/database");

// // const cleanPhone = (num) => String(num || "").replace(/\D/g, "").slice(-10);


// // const getCareCenters = async (req, res) => {
// //   try {
// //     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
// //     res.setHeader("Pragma", "no-cache");
// //     res.setHeader("Expires", "0");

// //     const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC");
// //     res.status(200).json(rows);
// //   } catch (error) {
// //     console.error("Fetch Care Centers Error:", error);
// //     res.status(500).json({ message: "Failed to fetch care centers: " + error.message });
// //   }
// // };

// // const addCareCenter = async (req, res) => {
// //   try {
// //     const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
// //     const cleaned = cleanPhone(phone);

// //     if (!name || cleaned.length < 10) {
// //       return res.status(400).json({ message: "Valid Name and 10-digit Phone number are required." });
// //     }

// //     const id = `CC-${Math.floor(1000 + Math.random() * 9000)}`;

// //     await pool.query(
// //       `INSERT INTO care_centers (id, name, contact_person, phone, address, gst, status) 
// //        VALUES (?, ?, ?, ?, ?, ?, ?)`,
// //       [id, name.trim(), contact_person || "", cleaned, address || "", gst || "", status]
// //     );

// //     res.status(201).json({ id, name, contact_person, phone: cleaned, address, gst, status });
// //   } catch (error) {
// //     console.error("Add Care Center Error:", error);
// //     res.status(500).json({ message: "Failed to add care center: " + error.message });
// //   }
// // };

// // const updateCareCenter = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { name, contact_person, phone, address, gst, status = "Active" } = req.body;
// //     const cleaned = phone ? cleanPhone(phone) : null;

// //     await pool.query(
// //       `UPDATE care_centers 
// //        SET name = COALESCE(?, name),
// //            contact_person = COALESCE(?, contact_person),
// //            phone = COALESCE(?, phone),
// //            address = COALESCE(?, address),
// //            gst = COALESCE(?, gst),
// //            status = COALESCE(?, status)
// //        WHERE id = ?`,
// //       [name?.trim() || null, contact_person || null, cleaned, address || null, gst || null, status, id]
// //     );

// //     res.status(200).json({ message: "Care Center details updated successfully!" });
// //   } catch (error) {
// //     console.error("Update Care Center Error:", error);
// //     res.status(500).json({ message: "Failed to update care center: " + error.message });
// //   }
// // };

// // const deleteCareCenter = async (req, res) => {
// //   const { id } = req.params;
// //   const targetId = String(id).trim();
// //   const numericOnly = targetId.replace(/\D/g, "");

// //   try {
// //     await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});

// //     await pool.query("DELETE FROM requisitions WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});
// //     await pool.query("DELETE FROM notifications WHERE care_center_id = ? OR care_center_id = ?", [targetId, numericOnly || targetId]).catch(() => {});
// //     await pool.query("DELETE FROM care_centers WHERE id = ? OR id = ?", [targetId, numericOnly || targetId]);

// //     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
// //     return res.status(200).json({ message: "Care Center deleted successfully." });
// //   } catch (error) {
// //     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
// //     console.error("Delete Care Center Error:", error);
// //     return res.status(500).json({ message: "Failed to delete care center: " + error.message });
// //   }
// // };

// // // ==========================================
// // // 📦 EQUIPMENT (DEVICES)
// // // ==========================================
// // const getEquipment = async (req, res) => {
// //   try {
// //     const [rows] = await pool.query("SELECT *, daily_rate AS dailyRate FROM equipment ORDER BY id DESC");
// //     res.status(200).json(rows);
// //   } catch (error) { 
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const addEquipment = async (req, res) => {
// //   try {
// //     const { name, category, daily_rate, dailyRate, stock, status } = req.body;
// //     const id = req.body.id || `EQ-${Date.now()}`;
// //     const rate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

// //     await pool.query(
// //       "INSERT INTO equipment (id, name, category, daily_rate, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
// //       [id, name?.trim(), category || "General", Number(rate) || 0, Number(stock) || 0, status || "Active"]
// //     );

// //     res.status(201).json({ message: "Equipment Added!", id });
// //   } catch (error) { 
// //     console.error("Add Equipment Error:", error);
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const updateEquipment = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { name, category, daily_rate, dailyRate, stock, status } = req.body;
// //     const finalRate = dailyRate !== undefined ? dailyRate : (daily_rate || 0);

// //     await pool.query(
// //       "UPDATE equipment SET name = ?, category = ?, daily_rate = ?, stock = ?, status = ? WHERE id = ?",
// //       [name?.trim(), category || "General", Number(finalRate) || 0, Number(stock) || 0, status || "Active", id]
// //     );
    
// //     res.status(200).json({ message: "Equipment updated successfully" });
// //   } catch (error) {
// //     console.error("Update Equipment Error:", error);
// //     res.status(400).json({ message: error.sqlMessage || error.message });
// //   }
// // };

// // const deleteEquipment = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     await pool.query("SET FOREIGN_KEY_CHECKS = 0").catch(() => {});
// //     await pool.query("DELETE FROM requisitions WHERE equipment_id = ?", [id]).catch(() => {});
// //     await pool.query("DELETE FROM equipment WHERE id = ?", [id]);
// //     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});

// //     res.status(200).json({ message: "Equipment deleted successfully" });
// //   } catch (error) { 
// //     await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
// //     res.status(500).json({ message: error.message }); 
// //   }
// // };

// // // ==========================================
// // // 🏷️ CATEGORIES (ACCESSORIES)
// // // ==========================================
// // const getCategories = async (req, res) => {
// //   try {
// //     const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
// //     res.status(200).json(rows);
// //   } catch (error) { 
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const addCategory = async (req, res) => {
// //   try {
// //     const { name, status } = req.body;
// //     const id = `CAT-${Date.now()}`; 
// //     await pool.query("INSERT INTO categories (id, name, status) VALUES (?, ?, ?)", [id, name?.trim(), status || "Active"]);
// //     res.status(201).json({ message: "Category Added!", id });
// //   } catch (error) { 
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const updateCategory = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { name, status } = req.body;
// //     await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [name?.trim(), status || "Active", id]);
// //     res.status(200).json({ message: "Category updated successfully" });
// //   } catch (error) {
// //     res.status(400).json({ message: error.sqlMessage || error.message });
// //   }
// // };

// // const deleteCategory = async (req, res) => {
// //   try {
// //     const { id } = req.params;  
// //     await pool.query("DELETE FROM categories WHERE id = ?", [id]);
// //     res.status(200).json({ message: "Category deleted successfully" });
// //   } catch (error) { 
// //     res.status(500).json({ message: error.message }); 
// //   }
// // };

// // // ==========================================
// // // 👨‍⚕️ REFERENCES (DOCTORS)
// // // ==========================================
// // const getReferences = async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       "SELECT id, name AS doctorName, contact AS phone, phone AS altPhone, specialist_domain AS domain, hospital, status FROM `references` ORDER BY id DESC"
// //     );
// //     res.status(200).json(rows);
// //   } catch (error) { 
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const addReference = async (req, res) => {
// //   try {
// //     const { doctorName, name, phone, domain, specialistDomain, hospital, status } = req.body;
// //     const finalDoctor = (doctorName || name || "").trim();
// //     const finalSpecialist = (domain || specialistDomain || "").trim();
// //     const finalHospital = (hospital || "").trim();
// //     const cleaned = cleanPhone(phone);
// //     const id = `REF-${Date.now()}`;
    
// //     await pool.query(
// //       "INSERT INTO `references` (id, name, contact, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?)", 
// //       [id, finalDoctor, cleaned, finalSpecialist, finalHospital, status || "Active"]
// //     );
// //     res.status(201).json({ message: "Reference Added!", id });
// //   } catch (error) { 
// //     console.error("Add Reference Error:", error);
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const updateReference = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { doctorName, name, phone, domain, specialistDomain, hospital, status } = req.body;
// //     const finalDoctor = (doctorName || name || "").trim();
// //     const finalSpecialist = (domain || specialistDomain || "").trim();
// //     const cleaned = phone ? cleanPhone(phone) : null;
    
// //     await pool.query(
// //       "UPDATE `references` SET name = ?, contact = COALESCE(?, contact), specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
// //       [finalDoctor, cleaned, finalSpecialist, hospital || "", status || "Active", id]
// //     );
// //     res.status(200).json({ message: "Reference updated successfully" });
// //   } catch (error) {
// //     res.status(400).json({ message: error.sqlMessage || error.message });
// //   }
// // };

// // const deleteReference = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     await pool.query("DELETE FROM `references` WHERE id = ?", [id]); 
// //     res.status(200).json({ message: "Reference deleted successfully" });
// //   } catch (error) { 
// //     res.status(500).json({ message: error.message }); 
// //   }
// // };

// // // ==========================================
// // // 🚚 DELIVERY EXECUTIVES
// // // ==========================================
// // const getDeliveryExecutives = async (req, res) => {
// //   try {
// //     const [rows] = await pool.query("SELECT *, name AS driverName FROM delivery_executives ORDER BY id DESC");
// //     res.status(200).json(rows);
// //   } catch (error) { 
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const addDeliveryExecutive = async (req, res) => {
// //   try {
// //     const { driverName, name, phone, status } = req.body;
// //     const cleaned = cleanPhone(phone);
// //     const id = `DEL-${Date.now()}`;

// //     await pool.query(
// //       "INSERT INTO delivery_executives (id, name, phone, status) VALUES (?, ?, ?, ?)", 
// //       [id, (driverName || name || "").trim(), cleaned, status || "Active"]
// //     );
// //     res.status(201).json({ message: "Delivery Executive Added!", id });
// //   } catch (error) { 
// //     console.error("Add Delivery Exec Error:", error);
// //     res.status(500).json({ message: "Server error: " + error.message }); 
// //   }
// // };

// // const updateDeliveryExecutive = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { driverName, name, phone, status } = req.body;
// //     const cleaned = phone ? cleanPhone(phone) : null;

// //     await pool.query(
// //       "UPDATE delivery_executives SET name = ?, phone = COALESCE(?, phone), status = ? WHERE id = ?",
// //       [(driverName || name || "").trim(), cleaned, status || "Active", id]
// //     );
// //     res.status(200).json({ message: "Delivery Executive updated successfully" });
// //   } catch (error) {
// //     res.status(400).json({ message: error.sqlMessage || error.message });
// //   }
// // };

// // const deleteDeliveryExecutive = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     await pool.query("DELETE FROM delivery_executives WHERE id = ?", [id]); 
// //     res.status(200).json({ message: "Delivery Executive deleted successfully" });
// //   } catch (error) { 
// //     res.status(500).json({ message: error.message }); 
// //   }
// // };

// // module.exports = { 
// //   getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter, 
// //   getEquipment, addEquipment, updateEquipment, deleteEquipment, 
// //   getCategories, addCategory, updateCategory, deleteCategory, 
// //   getReferences, addReference, updateReference, deleteReference, 
// //   getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive 
// // };

// const pool = require("../config/database");

// // 🛠️ Table Auto-Creator Function
// const ensureReferencesTable = async () => {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS \`references\` (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         doctor_name VARCHAR(255) NULL,
//         name VARCHAR(255) NULL,
//         phone VARCHAR(50) NULL,
//         contact VARCHAR(50) NULL,
//         hospital VARCHAR(255) NULL,
//         specialist_domain VARCHAR(255) NULL,
//         address TEXT NULL,
//         status VARCHAR(50) DEFAULT 'Active',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);
//   } catch (err) {
//     console.warn("References table check:", err.message);
//   }
// };

// // Start table check
// ensureReferencesTable();

// // ==========================================
// // 👨‍⚕️ 1. REFERENCES (DOCTORS / PARTNERS)
// // ==========================================

// const getReferences = async (req, res) => {
//   try {
//     await ensureReferencesTable();
//     const [rows] = await pool.query("SELECT * FROM `references` ORDER BY id DESC");
    
//     const formatted = (rows || []).map((r) => ({
//       id: r.id,
//       name: r.doctor_name || r.doctorName || r.name || "",
//       doctorName: r.doctor_name || r.doctorName || r.name || "",
//       doctor_name: r.doctor_name || r.doctorName || r.name || "",
//       phone: r.phone || r.contact || "",
//       contact: r.contact || r.phone || "",
//       hospital: r.hospital || "",
//       domain: r.specialist_domain || r.domain || r.specialistDomain || "",
//       specialistDomain: r.specialist_domain || r.domain || r.specialistDomain || "",
//       address: r.address || "",
//       status: r.status || "Active"
//     }));

//     return res.status(200).json(formatted);
//   } catch (error) {
//     console.error("References GET safe fallback:", error.message);
//     // 🔒 500 error kabhi nahi aayega, frontend ko hamesha 200 OK milega
//     return res.status(200).json([]);
//   }
// };

// const addReference = async (req, res) => {
//   try {
//     await ensureReferencesTable();
//     const data = req.body;
//     const doctorName = (data.doctorName || data.doctor_name || data.name || "").trim();
//     const phone = (data.phone || data.contact || "").trim();
//     const hospital = (data.hospital || "").trim();
//     const domain = (data.specialistDomain || data.specialist_domain || data.domain || "").trim();
//     const address = (data.address || "").trim();
//     const status = data.status || "Active";

//     if (!doctorName) {
//       return res.status(400).json({ message: "Doctor / Reference name is required." });
//     }

//     const [result] = await pool.query(
//       "INSERT INTO `references` (doctor_name, name, phone, contact, hospital, specialist_domain, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
//       [doctorName, doctorName, phone, phone, hospital, domain, address, status]
//     );

//     return res.status(201).json({
//       message: "Reference added successfully!",
//       id: result.insertId,
//       reference: { id: result.insertId, doctorName, phone, hospital, specialistDomain: domain, address, status }
//     });
//   } catch (error) {
//     console.error("Add Reference Error:", error.message);
//     return res.status(500).json({ message: "Failed to add reference: " + error.message });
//   }
// };

// const updateReference = async (req, res) => {
//   try {
//     await ensureReferencesTable();
//     const { id } = req.params;
//     const data = req.body;
//     const doctorName = (data.doctorName || data.doctor_name || data.name || "").trim();
//     const phone = (data.phone || data.contact || "").trim();
//     const hospital = (data.hospital || "").trim();
//     const domain = (data.specialistDomain || data.specialist_domain || data.domain || "").trim();
//     const address = (data.address || "").trim();
//     const status = data.status || "Active";

//     await pool.query(
//       "UPDATE `references` SET doctor_name = ?, name = ?, phone = ?, contact = ?, hospital = ?, specialist_domain = ?, address = ?, status = ? WHERE id = ?",
//       [doctorName, doctorName, phone, phone, hospital, domain, address, status, id]
//     );

//     return res.status(200).json({ message: "Reference updated successfully!" });
//   } catch (error) {
//     console.error("Update Reference Error:", error.message);
//     return res.status(500).json({ message: "Failed to update reference: " + error.message });
//   }
// };

// const deleteReference = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM `references` WHERE id = ?", [id]);
//     return res.status(200).json({ message: "Reference deleted successfully!" });
//   } catch (error) {
//     console.error("Delete Reference Error:", error.message);
//     return res.status(500).json({ message: "Failed to delete reference: " + error.message });
//   }
// };

// // ==========================================
// // 🏥 2. CARE CENTERS
// // ==========================================

// const getCareCenters = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC").catch(() => [[]]);
//     return res.status(200).json(rows || []);
//   } catch (error) {
//     return res.status(200).json([]);
//   }
// };

// const addCareCenter = async (req, res) => {
//   try {
//     const { name, phone, address, contactPerson, contact_person, status } = req.body;
//     const [result] = await pool.query(
//       "INSERT INTO care_centers (name, phone, address, contact_person, status) VALUES (?, ?, ?, ?, ?)",
//       [name?.trim(), phone?.trim(), address?.trim() || "", (contactPerson || contact_person || "")?.trim(), status || "Active"]
//     );
//     return res.status(201).json({ message: "Care Center added!", id: result.insertId });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const updateCareCenter = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, phone, address, contactPerson, contact_person, status } = req.body;
//     await pool.query(
//       "UPDATE care_centers SET name = ?, phone = ?, address = ?, contact_person = ?, status = ? WHERE id = ?",
//       [name?.trim(), phone?.trim(), address?.trim() || "", (contactPerson || contact_person || "")?.trim(), status || "Active", id]
//     );
//     return res.status(200).json({ message: "Care Center updated!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const deleteCareCenter = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM care_centers WHERE id = ?", [id]);
//     return res.status(200).json({ message: "Care Center deleted!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // ==========================================
// // 📦 3. EQUIPMENT
// // ==========================================

// const getEquipment = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM equipment ORDER BY id DESC").catch(() => [[]]);
//     return res.status(200).json(rows || []);
//   } catch (error) {
//     return res.status(200).json([]);
//   }
// };

// const addEquipment = async (req, res) => {
//   try {
//     const { name, category, model, serialNumber, serial_number, stock, status } = req.body;
//     const [result] = await pool.query(
//       "INSERT INTO equipment (name, category, model, serial_number, stock, status) VALUES (?, ?, ?, ?, ?, ?)",
//       [name?.trim(), category?.trim() || "General", model?.trim() || "", serialNumber || serial_number || "", Number(stock) || 1, status || "Active"]
//     );
//     return res.status(201).json({ message: "Equipment added!", id: result.insertId });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const updateEquipment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, category, model, serialNumber, serial_number, stock, status } = req.body;
//     await pool.query(
//       "UPDATE equipment SET name = ?, category = ?, model = ?, serial_number = ?, stock = ?, status = ? WHERE id = ?",
//       [name?.trim(), category?.trim() || "General", model?.trim() || "", serialNumber || serial_number || "", Number(stock) || 1, status || "Active", id]
//     );
//     return res.status(200).json({ message: "Equipment updated!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const deleteEquipment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM equipment WHERE id = ?", [id]);
//     return res.status(200).json({ message: "Equipment deleted!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // ==========================================
// // 🏷️ 4. CATEGORIES (ACCESSORIES)
// // ==========================================

// const getCategories = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC").catch(() => [[]]);
//     return res.status(200).json(rows || []);
//   } catch (error) {
//     return res.status(200).json([]);
//   }
// };

// const addCategory = async (req, res) => {
//   try {
//     const { name, title, status } = req.body;
//     const catName = (name || title || "").trim();
//     const [result] = await pool.query("INSERT INTO categories (name, status) VALUES (?, ?)", [catName, status || "Active"]);
//     return res.status(201).json({ message: "Category added!", id: result.insertId });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, title, status } = req.body;
//     const catName = (name || title || "").trim();
//     await pool.query("UPDATE categories SET name = ?, status = ? WHERE id = ?", [catName, status || "Active", id]);
//     return res.status(200).json({ message: "Category updated!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM categories WHERE id = ?", [id]);
//     return res.status(200).json({ message: "Category deleted!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // ==========================================
// // 🚚 5. DELIVERY EXECUTIVES
// // ==========================================

// const getDeliveryExecutives = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM delivery_executives ORDER BY id DESC").catch(() => [[]]);
//     return res.status(200).json(rows || []);
//   } catch (error) {
//     return res.status(200).json([]);
//   }
// };

// const addDeliveryExecutive = async (req, res) => {
//   try {
//     const { name, driverName, phone, vehicleNumber, vehicle_number, status } = req.body;
//     const driver = (driverName || name || "").trim();
//     const [result] = await pool.query(
//       "INSERT INTO delivery_executives (driver_name, phone, vehicle_number, status) VALUES (?, ?, ?, ?)",
//       [driver, phone?.trim(), vehicleNumber || vehicle_number || "", status || "Active"]
//     );
//     return res.status(201).json({ message: "Delivery Executive added!", id: result.insertId });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const updateDeliveryExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, driverName, phone, vehicleNumber, vehicle_number, status } = req.body;
//     const driver = (driverName || name || "").trim();
//     await pool.query(
//       "UPDATE delivery_executives SET driver_name = ?, phone = ?, vehicle_number = ?, status = ? WHERE id = ?",
//       [driver, phone?.trim(), vehicleNumber || vehicle_number || "", status || "Active", id]
//     );
//     return res.status(200).json({ message: "Delivery Executive updated!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const deleteDeliveryExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM delivery_executives WHERE id = ?", [id]);
//     return res.status(200).json({ message: "Delivery Executive deleted!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getReferences, addReference, updateReference, deleteReference,
//   getCareCenters, addCareCenter, updateCareCenter, deleteCareCenter,
//   getEquipment, addEquipment, updateEquipment, deleteEquipment,
//   getCategories, addCategory, updateCategory, deleteCategory,
//   getDeliveryExecutives, addDeliveryExecutive, updateDeliveryExecutive, deleteDeliveryExecutive
// };

const pool = require("../config/database");

const cleanPhone = (num) => String(num || "").replace(/\D/g, "").slice(-10);



const getCareCenters = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    const [rows] = await pool.query("SELECT * FROM care_centers ORDER BY created_at DESC, id DESC").catch(async () => {
      const [r] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC");
      return [r];
    });
    
    const formatted = (rows || []).map((c) => ({
      ...c,
      contactPerson: c.contact_person || c.incharge_name || "",
      inchargeMobile: c.incharge_mobile || c.phone || "",
      phone: c.phone || c.incharge_mobile || ""
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
    if (!name) {
      return res.status(400).json({ message: "Care Center Name is required." });
    }

    const id = String(d.id || `CC-${Math.floor(1000 + Math.random() * 9000)}`).trim();
    const rawPhone = d.phone || d.incharge_mobile || d.inchargeMobile || d.mobile || "";
    const phone = cleanPhone(rawPhone) || String(rawPhone).trim();
    const contactPerson = String(d.contactPerson || d.contact_person || d.incharge_name || d.inchargeName || "").trim();
    const address = String(d.address || d.care_address || d.careAddress || "").trim();
    const gst = String(d.gst || d.gst_number || d.gstNumber || "").trim();
    const status = d.status || "Active";

    // Dynamic Safe Insert (supports multiple schema variants)
    try {
      await pool.query(
        `INSERT INTO care_centers (id, name, phone, incharge_mobile, contact_person, incharge_name, address, gst, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, phone, phone, contactPerson, contactPerson, address, gst, status]
      );
    } catch (insertErr) {
      // Fallback for minimal table schema
      await pool.query(
        `INSERT INTO care_centers (id, name, phone, address, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, name, phone, address, status]
      );
    }

    return res.status(201).json({
      message: "Care Center added successfully!",
      id,
      name,
      phone,
      contactPerson,
      address,
      status
    });
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
    const rawPhone = d.phone || d.incharge_mobile || d.inchargeMobile || d.mobile || "";
    const phone = rawPhone ? (cleanPhone(rawPhone) || String(rawPhone).trim()) : null;
    const contactPerson = String(d.contactPerson || d.contact_person || d.incharge_name || d.inchargeName || "").trim();
    const address = String(d.address || d.care_address || d.careAddress || "").trim();
    const gst = String(d.gst || d.gst_number || d.gstNumber || "").trim();
    const status = d.status || "Active";

    await pool.query(
      `UPDATE care_centers 
       SET name = COALESCE(NULLIF(?, ''), name),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [name, phone, address, status, id]
    );

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

// ==========================================
// 📦 2. EQUIPMENT
// ==========================================

const getEquipment = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, daily_rate AS dailyRate FROM equipment ORDER BY id DESC");
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
    const status = d.status || "Active";

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
    const status = d.status || "Active";

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

// ==========================================
// 🏷️ 3. CATEGORIES (ACCESSORIES)
// ==========================================

const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
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

// ==========================================
// 👨‍⚕️ 4. REFERENCES (DOCTORS)
// ==========================================

const getReferences = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `references` ORDER BY id DESC").catch(() => [[]]);
    const formatted = (rows || []).map((r) => ({
      id: r.id,
      name: r.doctor_name || r.doctorName || r.name || "",
      doctorName: r.doctor_name || r.doctorName || r.name || "",
      phone: r.phone || r.contact || "",
      contact: r.contact || r.phone || "",
      hospital: r.hospital || "",
      domain: r.specialist_domain || r.domain || r.specialistDomain || "",
      specialistDomain: r.specialist_domain || r.domain || r.specialistDomain || "",
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
    const hospital = String(d.hospital || "").trim();
    const domain = String(d.specialistDomain || d.specialist_domain || d.domain || "").trim();
    const status = d.status || "Active";
    const id = `REF-${Date.now()}`;

    await pool.query(
      "INSERT INTO `references` (id, name, doctor_name, contact, phone, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, doctorName, doctorName, phone, phone, domain, hospital, status]
    );

    return res.status(201).json({ message: "Reference added successfully!", id });
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
    const hospital = String(d.hospital || "").trim();
    const domain = String(d.specialistDomain || d.specialist_domain || d.domain || "").trim();
    const status = d.status || "Active";

    await pool.query(
      "UPDATE `references` SET name = ?, doctor_name = ?, contact = ?, phone = ?, specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
      [doctorName, doctorName, phone, phone, domain, hospital, status, id]
    );

    return res.status(200).json({ message: "Reference updated successfully!" });
  } catch (error) {
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

// ==========================================
// 🚚 5. DELIVERY EXECUTIVES
// ==========================================

const getDeliveryExecutives = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT *, name AS driverName FROM delivery_executives ORDER BY id DESC").catch(() => [[]]);
    return res.status(200).json(rows || []);
  } catch (error) {
    return res.status(200).json([]);
  }
};

const addDeliveryExecutive = async (req, res) => {
  try {
    const d = req.body || {};
    const driver = String(d.driverName || d.name || "").trim();
    const phone = cleanPhone(d.phone) || String(d.phone || "").trim();
    const id = `DEL-${Date.now()}`;
    const vehicle = String(d.vehicleNumber || d.vehicle_number || "").trim();
    const status = d.status || "Active";

    await pool.query(
      "INSERT INTO delivery_executives (id, name, driver_name, phone, vehicle_number, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, driver, driver, phone, vehicle, status]
    );

    return res.status(201).json({ message: "Delivery Executive Added!", id });
  } catch (error) {
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
    const status = d.status || "Active";

    await pool.query(
      "UPDATE delivery_executives SET name = ?, driver_name = ?, phone = ?, vehicle_number = ?, status = ? WHERE id = ?",
      [driver, driver, phone, vehicle, status, id]
    );

    return res.status(200).json({ message: "Delivery Executive updated successfully" });
  } catch (error) {
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