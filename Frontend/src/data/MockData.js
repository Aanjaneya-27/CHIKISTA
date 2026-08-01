export const ROLES = {
  super_admin: { label: "Super Admin", color: "teal" },
  care_center: { label: "Care Center", color: "indigo" },
  reference: { label: "Reference Partner", color: "cyan" },
  delivery_executive: { label: "Delivery Executive", color: "amber" },
};

export const DEMO_USER_NAMES = {
  super_admin: "Priya Sharma",
  care_center: "Rakesh Sahoo",
  reference: "Meera Nair",
  delivery_executive: "Suresh Patnaik",
};

export const initialCareCenters = [
  { id: "CC001", name: "Sunrise Home Care", address: "12, MG Road, Bhubaneswar, Odisha 751001", contactPerson: "Anita Das", phone: "+91 98765 43210", gst: "21ABCDE1234F1Z5" },
  { id: "CC002", name: "Apollo Homecare Services", address: "45, Saheed Nagar, Bhubaneswar, Odisha 751007", contactPerson: "Rakesh Sahoo", phone: "+91 90123 45678", gst: "21PQRSX9988K1Z2" },
  { id: "CC003", name: "CarePlus Rehabilitation Center", address: "8, Patia Square, Bhubaneswar, Odisha 751024", contactPerson: "Meera Nair", phone: "+91 99887 66554", gst: "21LMNOP4567Q1Z9" },
  { id: "CC004", name: "Vitality Elder Care", address: "23, Nayapalli, Bhubaneswar, Odisha 751012", contactPerson: "Suresh Patnaik", phone: "+91 97654 32109", gst: "21WXYZP1122R1Z4" },
  { id: "CC005", name: "Harmony Hospice Services", address: "67, Jaydev Vihar, Bhubaneswar, Odisha 751013", contactPerson: "Priya Mohanty", phone: "+91 96543 21098", gst: "21GHIJK3344S1Z7" },
];

export const initialEquipment = [
  { id: "EQ01", name: "Oxygen Concentrator (5L)", category: "Respiratory", dailyRate: 250, stock: 14 },
  { id: "EQ02", name: "BiPAP Machine", category: "Respiratory", dailyRate: 450, stock: 6 },
  { id: "EQ03", name: "Hospital Bed - Electric", category: "Mobility & Bedding", dailyRate: 300, stock: 9 },
  { id: "EQ04", name: "Wheelchair - Standard", category: "Mobility & Bedding", dailyRate: 80, stock: 22 },
  { id: "EQ05", name: "Nebulizer", category: "Respiratory", dailyRate: 60, stock: 30 },
  { id: "EQ06", name: "Suction Machine", category: "Respiratory", dailyRate: 150, stock: 11 },
  { id: "EQ07", name: "Patient Monitor", category: "Monitoring", dailyRate: 400, stock: 5 },
  { id: "EQ08", name: "Infusion Pump", category: "Monitoring", dailyRate: 220, stock: 8 },
];

const mkLog = (o) => ({ deliveryAddress: "", notes: "", patientName: "", logoutDate: "", dealType: "B2B", unit: "ODCOM", mode: "Postpaid", ...o });

export const initialLogs = [
  mkLog({ id: "REQ-1001", careCenterId: "CC001", equipmentId: "EQ01", equipmentName: "Oxygen Concentrator (5L)", category: "Respiratory", quantity: 2, startDate: "2026-07-12", status: "Active", paymentType: "Prepaid", dealType: "B2B", unit: "ODCOM", mode: "Prepaid", notifyDate: "2026-07-10", deliveryStatus: "Delivered", patientName: "Bijoy Mohapatra" }),
  mkLog({ id: "REQ-1002", careCenterId: "CC002", equipmentId: "EQ03", equipmentName: "Hospital Bed - Electric", category: "Mobility & Bedding", quantity: 1, startDate: "2026-07-18", status: "Active", paymentType: "Postpaid", dealType: "B2B", unit: "ODCOM", mode: "Postpaid", notifyDate: "", deliveryStatus: "Dispatched", patientName: "Kanchan Behera" }),
  mkLog({ id: "REQ-1003", careCenterId: "CC003", equipmentId: "EQ04", equipmentName: "Wheelchair - Standard", category: "Mobility & Bedding", quantity: 3, startDate: "2026-07-20", status: "Pending", paymentType: "Prepaid", dealType: "B2C", unit: "BWF", mode: "Prepaid", notifyDate: "2026-07-25", deliveryStatus: "Pending Dispatch", patientName: "Ramesh Nayak" }),
  mkLog({ id: "REQ-1004", careCenterId: "CC001", equipmentId: "EQ02", equipmentName: "BiPAP Machine", category: "Respiratory", quantity: 1, startDate: "2026-06-01", status: "Overdue", paymentType: "Postpaid", dealType: "B2B", unit: "ODCOM", mode: "Postpaid", notifyDate: "", deliveryStatus: "Delivered", patientName: "Subhashree Panda" }),
  mkLog({ id: "REQ-1005", careCenterId: "CC004", equipmentId: "EQ07", equipmentName: "Patient Monitor", category: "Monitoring", quantity: 1, startDate: "2026-05-14", status: "Returned", paymentType: "Prepaid", dealType: "B2C", unit: "BWF", mode: "Prepaid", notifyDate: "2026-05-10", deliveryStatus: "Returned", patientName: "Ajay Kumar Sahu", logoutDate: "2026-05-30" }),
  mkLog({ id: "REQ-1006", careCenterId: "CC005", equipmentId: "EQ05", equipmentName: "Nebulizer", category: "Respiratory", quantity: 4, startDate: "2026-07-22", status: "Active", paymentType: "Postpaid", dealType: "B2B", unit: "ODCOM", mode: "Postpaid", notifyDate: "", deliveryStatus: "Delivered", patientName: "Snehalata Jena" }),
  mkLog({ id: "REQ-1007", careCenterId: "CC002", equipmentId: "EQ06", equipmentName: "Suction Machine", category: "Respiratory", quantity: 2, startDate: "2026-07-24", status: "Pending", paymentType: "Prepaid", dealType: "B2B", unit: "ODCOM", mode: "Prepaid", notifyDate: "2026-07-28", deliveryStatus: "Pending Dispatch", patientName: "Debasish Rout" }),
  mkLog({ id: "REQ-1008", careCenterId: "CC003", equipmentId: "EQ08", equipmentName: "Infusion Pump", category: "Monitoring", quantity: 1, startDate: "2026-06-20", status: "Overdue", paymentType: "Postpaid", dealType: "B2B", unit: "ODCOM", mode: "Postpaid", notifyDate: "", deliveryStatus: "Delivered", patientName: "Manisha Pradhan" }),
];

export const DELIVERY_STATES = ["Pending Dispatch", "Dispatched", "Delivered", "Returned"];
export const RENTAL_STATES = ["Active", "Pending", "Overdue", "Returned"];
export const PAYMENT_TYPES = ["Prepaid", "Postpaid"];
export const DEAL_TYPE_OPTIONS = ["B2B", "B2C"];
export const UNIT_OPTIONS = ["BWF", "ODCOM"];
export const MODE_OPTIONS = ["Prepaid", "Postpaid"];
export const ACCESSORY_OPTIONS = ["None", "Extra Mask", "Spare Tubing", "Battery Backup", "Carrying Case", "Humidifier Bottle"];
export const REFERRAL_OPTIONS = ["Self", "Doctor Referral", "Hospital Referral", "Agent", "Walk-in", "Online Inquiry"];
export const BILLING_TYPES = ["Monthly", "Daily", "Weekly"];

export const initialCategories = [
  { id: "CAT01", name: "Respiratory", description: "Oxygen therapy, breathing support and airway clearance devices" },
  { id: "CAT02", name: "Mobility & Bedding", description: "Hospital beds, wheelchairs and patient mobility aids" },
  { id: "CAT03", name: "Monitoring", description: "Vitals tracking and diagnostic monitoring equipment" },
];

export const initialReferences = [
  { id: "REF01", name: "Dr. Anil Kumar Mishra", type: "Doctor Referral", phone: "+91 98140 22334", email: "anil.mishra@carehospital.in", address: "Care Hospital, Chandrasekharpur, Bhubaneswar" },
  { id: "REF02", name: "Kalinga Hospital", type: "Hospital Referral", phone: "+91 674 2740000", email: "frontdesk@kalingahospital.com", address: "Chandrasekharpur, Bhubaneswar, Odisha" },
  { id: "REF03", name: "Sanjay Behera (Agent)", type: "Agent", phone: "+91 90111 22334", email: "sanjay.agent@gmail.com", address: "Patia, Bhubaneswar, Odisha" },
];

export const initialDeliveryExecutives = [
  { id: "DE01", name: "Suresh Patnaik", phone: "+91 96789 11223", vehicleNumber: "OD-02-AB-4521", zone: "Bhubaneswar Central", email: "suresh.patnaik@chikitsa.in" },
  { id: "DE02", name: "Bikash Rout", phone: "+91 95678 33221", vehicleNumber: "OD-02-CD-7788", zone: "Patia / Chandrasekharpur", email: "bikash.rout@chikitsa.in" },
  { id: "DE03", name: "Manoj Swain", phone: "+91 94567 44556", vehicleNumber: "OD-02-EF-9932", zone: "Saheed Nagar / Nayapalli", email: "manoj.swain@chikitsa.in" },
];

export const trendData = [
  { day: "Mon", requisitions: 4 }, { day: "Tue", requisitions: 7 }, { day: "Wed", requisitions: 5 },
  { day: "Thu", requisitions: 9 }, { day: "Fri", requisitions: 6 }, { day: "Sat", requisitions: 8 }, { day: "Sun", requisitions: 3 },
];

export const DONUT_COLORS = ["#0d9488", "#6366f1", "#f59e0b", "#f43f5e"];

export const initialNotifications = [
  { id: 1, type: "warning", title: "Requisition Overdue", message: "REQ-1004 (BiPAP Machine) for Sunrise Home Care is overdue for return.", time: "10 min ago", read: false },
  { id: 2, type: "info", title: "New Requisition Submitted", message: "CarePlus Rehabilitation Center requested 3x Wheelchair - Standard.", time: "1 hr ago", read: false },
  { id: 3, type: "success", title: "Delivery Completed", message: "Oxygen Concentrator delivered to Sunrise Home Care.", time: "3 hr ago", read: false },
  { id: 4, type: "warning", title: "Low Stock Alert", message: "Patient Monitor stock is below 5 units.", time: "5 hr ago", read: true },
  { id: 5, type: "info", title: "Notify Date Reminder", message: "Notify date for REQ-1003 falls tomorrow.", time: "1 day ago", read: true },
  { id: 6, type: "success", title: "Requisition Returned", message: "Patient Monitor from Vitality Elder Care marked as returned.", time: "2 days ago", read: true },
];