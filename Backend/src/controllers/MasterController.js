const CareCenter = require("../models/CareCenter");
const Equipment = require("../models/Equipment");
const pool = require("../config/database");


// const getCareCenters = async (req, res) => {
//   try {
//     const rows = await CareCenter.getAll();
//     res.json(rows);
//   } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
// };
const getCareCenters = async (req, res) => {
  try {
    const [ccRows] = await pool.query("SELECT * FROM care_centers ORDER BY id DESC");

    // 2. Users table se registered care centers lo
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

// const addCareCenter = async (req, res) => {
//   const { id, name, address, contact_person, phone, gst, status } = req.body;
//   try {
//     await CareCenter.create(id, name, address, contact_person, phone, gst);
//     res.status(201).json({ message: "Care Center Added!" });
//   } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
// };
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

// const updateCareCenter = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       name, 
//       address, 
//       contact_person, 
//       contactPerson, 
//       phone, 
//       gst, 
//       status 
//     } = req.body;
    
//     const finalContactPerson = contact_person !== undefined ? contact_person : (contactPerson || '');
//     const finalPhone = phone || '';
//     const finalGst = gst || '';

//     await pool.query(
//       "UPDATE care_centers SET name = ?, address = ?, contact_person = ?, phone = ?, gst = ?, status = ? WHERE id = ?",
//       [
//         name || '', 
//         address || '', 
//         finalContactPerson, 
//         finalPhone, 
//         finalGst, 
//         status || 'Active', 
//         id
//       ]
//     );
    
//     res.status(200).json({ message: "Care Center updated successfully" });
//   } catch (error) {
//     console.error("Update CareCenter Error:", error);
//     res.status(400).json({ message: error.sqlMessage || error.message });
//   }
// };
const updateCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, address, gst, status } = req.body;

    await pool.query(
      `UPDATE care_centers 
       SET name = COALESCE(?, name),
           contact_person = COALESCE(?, contact_person),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           gst = COALESCE(?, gst),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [name, contact_person, phone, address, gst, status, id]
    );

    res.status(200).json({ message: "Care Center details updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update care center: " + error.message });
  }
};

// const deleteCareCenter = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM care_centers WHERE id = ?", [id]);
//     res.status(200).json({ message: "Care center deleted successfully" });
//   } catch (error) { res.status(500).json({ message: error.message, sqlError: error.sqlMessage }); }
// };
const deleteCareCenter = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM care_centers WHERE id = ?", [id]);
    res.status(200).json({ message: "Care Center deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete care center: " + error.message });
  }
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
      "SELECT id, name AS doctorName, contact AS phone, specialist_domain AS specialistDomain, hospital, status FROM `references`"
    );
    res.json(rows);
  } catch (error) { 
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
};

const addReference = async (req, res) => {
  try {
    const { doctorName, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
    const finalSpecialist = specialistDomain || specialist_domain || '';
    const finalHospital = hospital || '';
    const id = 'REF-' + Date.now();
    
    await pool.query(
      "INSERT INTO `references` (id, name, contact, specialist_domain, hospital, status) VALUES (?, ?, ?, ?, ?, ?)", 
      [id, doctorName, phone, finalSpecialist, finalHospital, status || 'Active']
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
    const { doctorName, phone, specialistDomain, specialist_domain, hospital, status } = req.body;
    const finalSpecialist = specialistDomain !== undefined ? specialistDomain : (specialist_domain || '');
    const finalHospital = hospital !== undefined ? hospital : '';
    
    await pool.query(
      "UPDATE `references` SET name = ?, contact = ?, specialist_domain = ?, hospital = ?, status = ? WHERE id = ?",
      [doctorName, phone, finalSpecialist, finalHospital, status || 'Active', id]
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