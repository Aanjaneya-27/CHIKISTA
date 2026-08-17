// const Requisition = require("../models/Requisition");
// const Notification = require("../models/Notification");

// // Clean YYYY-MM-DD Date Formatter (Prevents 1-day shift timezone bug)
// const cleanDate = (dateVal) => {
//   if (!dateVal || dateVal === "null" || dateVal === "undefined" || String(dateVal).trim() === "") {
//     return null;
//   }
//   const str = String(dateVal).trim();
//   if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
//   try {
//     const d = new Date(dateVal);
//     if (isNaN(d.getTime())) return null;
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   } catch {
//     return null;
//   }
// };

// // Auto-align Status, Dates & Commercials (Fixes 0 charges bug)
// const sanitizeRequisitionData = (data) => {
//   const startDate = cleanDate(data.start_date || data.startDate) || new Date().toISOString().split("T")[0];
//   const logoutDate = cleanDate(data.logout_date || data.logoutDate);
//   const notifyDate = cleanDate(data.notify_date || data.notifyDate);

//   // Logout date hone par hi Closed hoga, warna strictly Active
//   const status = logoutDate ? "Closed" : "Active";

//   // 🔒 Explicit number parsing for commercial fields so they never become 0 or blank
//   const rentalCharge = Number(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge) || 0;
//   const depositAdvance = Number(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance) || 0;
//   const installationCharge = Number(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge) || 0;
//   const billingType = data.billing_type || data.billingType || "Daily";

//   return {
//     ...data,
//     start_date: startDate,
//     startDate: startDate,
//     logout_date: logoutDate,
//     logoutDate: logoutDate,
//     notify_date: notifyDate,
//     notifyDate: notifyDate,
//     status: status,
//     requisition_status: status,
//     quantity: Number(data.quantity) > 0 ? Number(data.quantity) : 1,
//     // 🔒 Sync both camelCase & snake_case for backend model
//     billing_type: billingType,
//     billingType: billingType,
//     rental_charge: rentalCharge,
//     rentalCharge: rentalCharge,
//     deposit_advance: depositAdvance,
//     depositAdvance: depositAdvance,
//     installation_charge: installationCharge,
//     installationCharge: installationCharge
//   };
// };

// // 1. GET ALL REQUISITIONS
// const getRequisitions = async (req, res) => {
//   try {
//     const rows = await Requisition.getAll();
//     res.status(200).json(rows);
//   } catch (error) { 
//     console.error("Fetch Requisitions Error:", error);
//     res.status(500).json({ message: "Server error while fetching requisitions", error: error.message }); 
//   }
// };

// // 2. CREATE REQUISITION
// const createRequisition = async (req, res) => {
//   try {
//     const sanitizedData = sanitizeRequisitionData(req.body);
//     const reqId = await Requisition.create(sanitizedData);

//     const patientName = sanitizedData.patient_name || sanitizedData.patientName || "Patient";
//     const equipName = sanitizedData.equipmentName || sanitizedData.equipment_id || "Medical Equipment";
//     const careCenterId = sanitizedData.care_center_id || sanitizedData.careCenterId || null;
//     const careCenterName = sanitizedData.care_center_name || sanitizedData.careCenterName || "Care Center";

//     try {
//       if (Notification && typeof Notification.create === "function") {
//         await Notification.create(
//           "success",
//           `New Requisition: ${patientName}`,
//           `Allocation created for ${equipName} (Patient: ${patientName}) by ${careCenterName}.`,
//           careCenterId
//         );
//       }
//     } catch (notifErr) {
//       console.warn("Notification insert warning:", notifErr.message);
//     }

//     res.status(201).json({ message: "Requisition created successfully!", id: reqId, status: sanitizedData.status });
//   } catch (error) {
//     console.error("Create Requisition Error:", error);
//     res.status(400).json({ message: error.sqlMessage || error.message || "Failed to create requisition" });
//   }
// };

// // 3. UPDATE REQUISITION
// const updateRequisition = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const sanitizedData = sanitizeRequisitionData(req.body);
//     await Requisition.update(id, sanitizedData); 

//     const patientName = sanitizedData.patient_name || sanitizedData.patientName || "Patient";
//     const careCenterId = sanitizedData.care_center_id || sanitizedData.careCenterId || null;
//     const status = sanitizedData.status;

//     try {
//       if (Notification && typeof Notification.create === "function") {
//         await Notification.create(
//           status === "Closed" ? "warning" : "info",
//           `Requisition ${status}: ${patientName}`,
//           `Requisition ${id} for ${patientName} is now ${status}.`,
//           careCenterId
//         );
//       }
//     } catch (notifErr) {
//       console.warn("Notification update warning:", notifErr.message);
//     }

//     res.status(200).json({ message: "Requisition updated successfully!", status });
//   } catch (error) {
//     console.error("Update Requisition Error:", error);
//     res.status(400).json({ message: error.sqlMessage || error.message || "Failed to update requisition" });
//   }
// };

// // 4. DELETE REQUISITION
// const deleteRequisition = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await Requisition.delete(id); 

//     try {
//       if (Notification && typeof Notification.create === "function") {
//         await Notification.create(
//           "warning", 
//           "Requisition Deleted", 
//           `Requisition ${id} was removed from the system.`,
//           null
//         );
//       }
//     } catch (notifErr) {
//       console.warn("Notification delete warning:", notifErr.message);
//     }

//     res.status(200).json({ message: "Requisition deleted successfully!" });
//   } catch (error) {
//     console.error("Delete Requisition Error:", error);
//     res.status(500).json({ message: "Server error while deleting requisition", error: error.message });
//   }
// };

// // 5. GET NOTIFICATIONS
// const getNotifications = async (req, res) => {
//   try {
//     const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id || null;
//     const role = req.query.role || req.user?.role || null;

//     let data = [];
//     if (Notification && typeof Notification.getAll === "function") {
//       data = await Notification.getAll(careCenterId, role);
//     }
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Get Notifications Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { 
//   getRequisitions, 
//   createRequisition, 
//   updateRequisition, 
//   deleteRequisition, 
//   getNotifications 
// };

const Requisition = require("../models/Requisition");
const Notification = require("../models/Notification");

// Clean YYYY-MM-DD Date Formatter (Prevents 1-day shift timezone bug)
const cleanDate = (dateVal) => {
  if (!dateVal || dateVal === "null" || dateVal === "undefined" || String(dateVal).trim() === "") {
    return null;
  }
  const str = String(dateVal).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
};

// Auto-align Status, Dates & Commercials (Fixes 0 charges bug)
const sanitizeRequisitionData = (data) => {
  const startDate = cleanDate(data.start_date || data.startDate) || new Date().toISOString().split("T")[0];
  const logoutDate = cleanDate(data.logout_date || data.logoutDate);
  const notifyDate = cleanDate(data.notify_date || data.notifyDate);
  const recordDate = cleanDate(data.record_date || data.recordDate) || startDate;
  const recallDate = cleanDate(data.recall_date || data.recallDate);

  // Logout date hone par hi Closed hoga, warna strictly Active
  const status = logoutDate ? "Closed" : "Active";

  // 🔒 Explicit number parsing for commercial fields so they never become 0 or blank
  const rentalCharge = Number(data.rental_charge !== undefined ? data.rental_charge : data.rentalCharge) || 0;
  const depositAdvance = Number(data.deposit_advance !== undefined ? data.deposit_advance : data.depositAdvance) || 0;
  const installationCharge = Number(data.installation_charge !== undefined ? data.installation_charge : data.installationCharge) || 0;
  const billingType = data.billing_type || data.billingType || "Daily";

  return {
    ...data,
    start_date: startDate,
    startDate: startDate,
    logout_date: logoutDate,
    logoutDate: logoutDate,
    notify_date: notifyDate,
    notifyDate: notifyDate,
    record_date: recordDate,
    recordDate: recordDate,
    recall_date: recallDate,
    recallDate: recallDate,
    status: status,
    requisition_status: status,
    quantity: Number(data.quantity) > 0 ? Number(data.quantity) : 1,
    // 🔒 Sync both camelCase & snake_case for backend model
    billing_type: billingType,
    billingType: billingType,
    rental_charge: rentalCharge,
    rentalCharge: rentalCharge,
    deposit_advance: depositAdvance,
    depositAdvance: depositAdvance,
    installation_charge: installationCharge,
    installationCharge: installationCharge
  };
};

// 1. GET ALL REQUISITIONS
const getRequisitions = async (req, res) => {
  try {
    const rows = await Requisition.getAll();
    res.status(200).json(rows);
  } catch (error) { 
    console.error("Fetch Requisitions Error:", error);
    res.status(500).json({ message: "Server error while fetching requisitions", error: error.message }); 
  }
};

// 2. CREATE REQUISITION
const createRequisition = async (req, res) => {
  try {
    const sanitizedData = sanitizeRequisitionData(req.body);
    const reqId = await Requisition.create(sanitizedData);

    const patientName = sanitizedData.patient_name || sanitizedData.patientName || "Patient";
    const equipName = sanitizedData.equipmentName || sanitizedData.equipment_id || "Medical Equipment";
    const careCenterId = sanitizedData.care_center_id || sanitizedData.careCenterId || null;
    const careCenterName = sanitizedData.care_center_name || sanitizedData.careCenterName || "Care Center";

    try {
      if (Notification && typeof Notification.create === "function") {
        await Notification.create(
          "success",
          `New Requisition: ${patientName}`,
          `Allocation created for ${equipName} (Patient: ${patientName}) by ${careCenterName}.`,
          careCenterId
        );
      }
    } catch (notifErr) {
      console.warn("Notification insert warning:", notifErr.message);
    }

    res.status(201).json({ message: "Requisition created successfully!", id: reqId, status: sanitizedData.status });
  } catch (error) {
    console.error("Create Requisition Error:", error);
    res.status(400).json({ message: error.sqlMessage || error.message || "Failed to create requisition" });
  }
};

// 3. UPDATE REQUISITION
const updateRequisition = async (req, res) => {
  const { id } = req.params;
  try {
    const sanitizedData = sanitizeRequisitionData(req.body);
    await Requisition.update(id, sanitizedData); 

    const patientName = sanitizedData.patient_name || sanitizedData.patientName || "Patient";
    const careCenterId = sanitizedData.care_center_id || sanitizedData.careCenterId || null;
    const status = sanitizedData.status;

    try {
      if (Notification && typeof Notification.create === "function") {
        await Notification.create(
          status === "Closed" ? "warning" : "info",
          `Requisition ${status}: ${patientName}`,
          `Requisition ${id} for ${patientName} is now ${status}.`,
          careCenterId
        );
      }
    } catch (notifErr) {
      console.warn("Notification update warning:", notifErr.message);
    }

    res.status(200).json({ message: "Requisition updated successfully!", status });
  } catch (error) {
    console.error("Update Requisition Error:", error);
    res.status(400).json({ message: error.sqlMessage || error.message || "Failed to update requisition" });
  }
};

// 4. DELETE REQUISITION
const deleteRequisition = async (req, res) => {
  const { id } = req.params;
  try {
    await Requisition.delete(id); 

    try {
      if (Notification && typeof Notification.create === "function") {
        await Notification.create(
          "warning", 
          "Requisition Deleted", 
          `Requisition ${id} was removed from the system.`,
          null
        );
      }
    } catch (notifErr) {
      console.warn("Notification delete warning:", notifErr.message);
    }

    res.status(200).json({ message: "Requisition deleted successfully!" });
  } catch (error) {
    console.error("Delete Requisition Error:", error);
    res.status(500).json({ message: "Server error while deleting requisition", error: error.message });
  }
};

// 5. GET NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const careCenterId = req.query.careCenterId || req.user?.careCenterId || req.user?.id || null;
    const role = req.query.role || req.user?.role || null;

    let data = [];
    if (Notification && typeof Notification.getAll === "function") {
      data = await Notification.getAll(careCenterId, role);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getRequisitions, 
  createRequisition, 
  updateRequisition, 
  deleteRequisition, 
  getNotifications 
};