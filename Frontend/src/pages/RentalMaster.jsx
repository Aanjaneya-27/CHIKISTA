// import { useState, useEffect, useMemo, useCallback } from "react"; 
// import { Search, SlidersHorizontal, Plus, Eye, Pencil, Trash2, PackageCheck, Clock, Activity, AlertTriangle, Building2, User, Tag, CreditCard, Save, X, ClipboardList, ArrowLeft, ChevronRight, ImagePlus, Truck, FileText, Calendar, ChevronDown, Calculator } from "lucide-react"; 
// import { PrimaryButton, GhostButton, IconAction, ConfirmDialog, StatusBadge, Field, Select, TextInput, toast } from "../components/UiComponents";
// import { RENTAL_STATES, DEAL_TYPE_OPTIONS, MODE_OPTIONS, UNIT_OPTIONS, PAYMENT_TYPES } from "../data/MockData";
// import { formatDateShort, todayISO } from "../utils/Helper";
// import API from "../utils/api"; 

// function GlobalPolish() {
//   return (
//     <style>{`
//       html { scroll-behavior: smooth; }
//       .smooth-scroll, .smooth-scroll-x { scroll-behavior: smooth; }
//       .smooth-scroll::-webkit-scrollbar,
//       .smooth-scroll-x::-webkit-scrollbar { width: 8px; height: 8px; }
//       .smooth-scroll::-webkit-scrollbar-track,
//       .smooth-scroll-x::-webkit-scrollbar-track { background: transparent; }
//       .smooth-scroll::-webkit-scrollbar-thumb,
//       .smooth-scroll-x::-webkit-scrollbar-thumb {
//         background-color: rgba(13, 148, 136, 0.25);
//         border-radius: 9999px;
//         transition: background-color 0.2s ease;
//       }
//       .smooth-scroll:hover::-webkit-scrollbar-thumb,
//       .smooth-scroll-x:hover::-webkit-scrollbar-thumb { background-color: rgba(13, 148, 136, 0.45); }
//       .smooth-scroll, .smooth-scroll-x { scrollbar-width: thin; scrollbar-color: rgba(13,148,136,0.3) transparent; }
//       @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       .rise-in { animation: riseIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
//       @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
//       .fade-slide-up { animation: fadeScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
//     `}</style>
//   );
// }

// const getOptionLabel = (item) => {
//   if (!item) return "";
//   if (typeof item === "string") return item;
//   return item.name || item.categoryName || item.category_name || item.title || item.label || item.doctorName || "";
// };

// const filterActive = (list = []) => {
//   if (!Array.isArray(list)) return [];
//   return list.filter((item) => {
//     if (!item) return false;
//     if (typeof item === "string") return true;
//     const st = (item.status || item.state || "").toString().trim().toLowerCase();
//     if (st === "inactive" || st === "disabled" || item.is_active === 0 || item.isActive === false) {
//       return false;
//     }
//     return true;
//   });
// };

// const getCalculatedStatus = (startDateStr, logoutDateStr, currentStatus) => {
//   if (currentStatus && ["returned", "return"].includes(currentStatus.toString().trim().toLowerCase())) {
//     return "Returned";
//   }

//   if (!startDateStr || !logoutDateStr) return "Pending";

//   const parseSafeDate = (dStr) => {
//     if (!dStr) return null;
//     let str = dStr.toString().trim();
//     if (str.includes("T")) str = str.split("T")[0];
//     if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(str)) {
//       const p = str.split(/[-/]/);
//       str = `${p[2]}-${p[1]}-${p[0]}`;
//     }
//     const d = new Date(`${str}T00:00:00`);
//     return isNaN(d.getTime()) ? null : d;
//   };

//   const start = parseSafeDate(startDateStr);
//   const logout = parseSafeDate(logoutDateStr);

//   if (!start || !logout) return currentStatus || "Pending";

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const tTime = today.getTime();
//   const sTime = start.getTime();
//   const lTime = logout.getTime();

//   const overdueLimit = new Date(logout);
//   overdueLimit.setDate(overdueLimit.getDate() + 3);
//   const oTime = overdueLimit.getTime();

//   if (tTime >= sTime && tTime <= lTime) return "Active";
//   if (tTime > lTime && tTime <= oTime) return "Pending";
//   if (tTime > oTime) return "Overdue";

//   return "Pending";
// };

// const formatForDateInput = (d) => {
//   if (!d) return "";
//   if (typeof d === "string") {
//     if (d.includes("T")) return d.split("T")[0];
//     if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
//     const p = d.split("-");
//     if (p.length === 3 && p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`;
//   }
//   return "";
// };

// function MultiSelect({ options = [], selected = [], onChange, placeholder = "Select...", error, disabled }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const safeSelected = useMemo(() => {
//     if (Array.isArray(selected)) {
//       return selected.map(getOptionLabel).filter(Boolean);
//     }
//     if (typeof selected === "string" && selected.trim() !== "") {
//       return selected.split(",").map((item) => item.trim()).filter(Boolean);
//     }
//     return [];
//   }, [selected]);

//   const toggleOption = (optName) => {
//     if (safeSelected.includes(optName)) {
//       onChange(safeSelected.filter((item) => item !== optName));
//     } else {
//       onChange([...safeSelected, optName]);
//     }
//   };

//   const removeOption = (e, optName) => {
//     e.stopPropagation();
//     onChange(safeSelected.filter((item) => item !== optName));
//   };

//   return (
//     <div className="relative text-left">
//       <div 
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//         className={`flex min-h-[42px] w-full flex-wrap items-center justify-between gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-all ${error ? 'border-rose-300 ring-4 ring-rose-500/10' : 'border-slate-200 hover:border-teal-300 focus:border-teal-500'} ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
//       >
//         <div className="flex flex-wrap gap-1.5 items-center flex-1">
//           {safeSelected.length === 0 && <span className="text-slate-400">{placeholder}</span>}
//           {safeSelected.map((sel) => (
//             <span key={sel} className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200 shadow-sm">
//               {sel}
//               {!disabled && (
//                 <X className="h-3.5 w-3.5 cursor-pointer hover:text-amber-900 transition-colors" onClick={(e) => removeOption(e, sel)} />
//               )}
//             </span>
//           ))}
//         </div>
//         <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//       </div>

//       {isOpen && !disabled && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
//           <div className="absolute z-[99] mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/5">
//             {options.length === 0 ? (
//               <div className="px-4 py-2 text-xs text-slate-400">No active accessories available</div>
//             ) : (
//               options.map((opt) => {
//                 const optName = typeof opt === "string" ? opt : getOptionLabel(opt);
//                 const isSel = safeSelected.includes(optName);
//                 return (
//                   <div 
//                     key={optName} 
//                     onClick={() => toggleOption(optName)} 
//                     className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-teal-50 ${isSel ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700'}`}
//                   >
//                     {optName}
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function KpiCards({ logs }) {
//   const count = (s) => logs.filter((l) => {
//     const rawStatus = l.status || l.requisition_status || l.return_status;
//     const dynamicStatus = getCalculatedStatus(
//       l.startDate || l.start_date, 
//       l.logoutDate || l.logout_date, 
//       rawStatus
//     );
//     return dynamicStatus === s;
//   }).length;

//   const cards = [
//     { label: "Active Rentals", value: count("Active"), icon: Activity, tone: "teal" },
//     { label: "Pending Requisitions", value: count("Pending"), icon: Clock, tone: "amber" },
//     { label: "Overdue Returns", value: count("Overdue"), icon: AlertTriangle, tone: "rose" },
//     { label: "Units Returned", value: count("Returned"), icon: PackageCheck, tone: "slate" },
//   ];
//   const toneMap = {
//     teal: { chip: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30", bar: "from-teal-400 to-teal-600", glow: "bg-teal-400/10" },
//     amber: { chip: "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-500/30", bar: "from-amber-300 to-amber-500", glow: "bg-amber-400/10" },
//     rose: { chip: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/30", bar: "from-rose-400 to-rose-600", glow: "bg-rose-400/10" },
//     slate: { chip: "bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-slate-500/30", bar: "from-slate-400 to-slate-600", glow: "bg-slate-400/10" },
//   };
//   return (
//     <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//       {cards.map((c, i) => {
//         const Icon = c.icon;
//         const t = toneMap[c.tone];
//         return (
//           <div key={c.label} style={{ animationDelay: `${i * 60}ms` }} className="rise-in group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
//             <span className={`absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100 ${t.bar}`} />
//             <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${t.glow}`} />
//             <div className={`relative grid h-11 w-11 place-items-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 ${t.chip}`}>
//               <Icon className="h-5 w-5" strokeWidth={2.25} />
//             </div>
//             <p className="relative mt-3.5 font-display text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">{c.value}</p>
//             <p className="relative mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // 🧮 Temporary Scratchpad Calculator Modal (No DB Changes)
// function CalculateTotalDaysModal({ log, equipmentCatalog, onClose }) {
//   const [tempLoginDate, setTempLoginDate] = useState(() => formatForDateInput(log.startDate || log.start_date) || todayISO());
//   const [tempLogoutDate, setTempLogoutDate] = useState(() => formatForDateInput(log.logoutDate || log.logout_date) || "");

//   const eqId = log.equipmentId || log.equipment_id;
//   const eqName = equipmentCatalog.find(e => e.id === eqId)?.name || log.equipmentName || "Device";
//   const patientName = log.patientName || log.patient_name || "Patient";

//   const calculatedDisplay = useMemo(() => {
//     if (!tempLoginDate) return "—";
//     const login = new Date(tempLoginDate);
//     login.setHours(0, 0, 0, 0);

//     if (tempLogoutDate) {
//       const logout = new Date(tempLogoutDate);
//       logout.setHours(0, 0, 0, 0);
//       const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
//       const endUtc = Date.UTC(logout.getFullYear(), logout.getMonth(), logout.getDate());
//       let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
//       if (diffDays < 0) diffDays = 0;
//       const logoutDay = logout.getDate(); // 👈 Day of Logout Date
//       return `${diffDays} / ${logoutDay}`;
//     }

//     const now = new Date();
//     now.setHours(0, 0, 0, 0);
//     const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
//     const endUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
//     let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
//     if (diffDays < 0) diffDays = 0;
//     const currentDay = now.getDate();
//     return `${diffDays} / ${currentDay}`;
//   }, [tempLoginDate, tempLogoutDate]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
//       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        
//         {/* Header */}
//         <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
//           <div>
//             <h3 className="font-display text-base font-bold text-slate-800">Calculate Total Days</h3>
//             <p className="text-xs text-slate-400 mt-0.5">{patientName} • {eqName}</p>
//           </div>
//           <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Inputs */}
//         <div className="p-6 space-y-4">
//           <div>
//             <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//               Log In Date
//             </label>
//             <input 
//               type="date"
//               value={tempLoginDate}
//               onChange={(e) => setTempLoginDate(e.target.value)}
//               className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
//             />
//           </div>

//           <div>
//             <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//               Log Out Date
//             </label>
//             <input 
//               type="date"
//               value={tempLogoutDate}
//               onChange={(e) => setTempLogoutDate(e.target.value)}
//               className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
//             />
//             <p className="text-[11px] text-slate-400 mt-1">Leave empty to calculate until today</p>
//           </div>

//           {/* Dynamic Result Box */}
//           <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 text-center my-2">
//             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Days</span>
//             <p className="mt-1 font-display text-3xl font-extrabold text-teal-700">
//               {calculatedDisplay}
//             </p>
//           </div>
//         </div>

//         {/* Footer Actions (Purely Closes Modal - No Data Mutation) */}
//         <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
//           <button 
//             type="button" 
//             onClick={onClose}
//             className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 text-xs font-bold shadow-sm transition cursor-pointer"
//           >
//             Done
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// // 👈 Auto Today Date in Empty Form
// const emptyForm = { 
//   careCenterId: "", 
//   address: "", 
//   contactPerson: "", 
//   phone: "", 
//   gst: "", 
//   equipmentId: "", 
//   quantity: 1, 
//   recordDate: todayISO(), 
//   startDate: todayISO(), 
//   loginDate: todayISO(),
//   logoutDate: "", 
//   patientName: "", 
//   paymentType: "Postpaid", 
//   dealType: "B2B", 
//   unit: "ODCOM", 
//   mode: "Postpaid", 
//   notifyDate: "", 
//   deliveryAddress: "", 
//   notes: "", 
//   bedNo: "", 
//   referral: "", 
//   accessory: [] 
// };

// function RequisitionModal({ mode: modalMode, initial, careCenters, equipmentCatalog, references = [], categories = [], onClose, onSubmit }) {
//   const readOnly = modalMode === "view";
  
//   const [form, setForm] = useState(() => {
//     if (initial) {
//       const rawAcc = initial.accessory || initial.accessories;
//       let parsedAcc = [];
      
//       if (Array.isArray(rawAcc)) {
//         parsedAcc = rawAcc.map(getOptionLabel).filter(Boolean);
//       } else if (typeof rawAcc === 'string' && rawAcc.trim() !== "") {
//         parsedAcc = rawAcc.split(',').map(item => item.trim()).filter(Boolean);
//       }

//       const ccId = initial.careCenterId || initial.care_center_id || "";
//       const cc = careCenters.find((c) => c.id === ccId);
//       const mappedRecord = formatForDateInput(initial.recordDate || initial.record_date) || todayISO();
//       const mappedStart = formatForDateInput(initial.startDate || initial.start_date) || todayISO();
//       const mappedLogout = formatForDateInput(initial.logoutDate || initial.logout_date);
//       const mappedNotify = formatForDateInput(initial.notifyDate || initial.notify_date);
//       const initialStatus = initial.status || initial.requisition_status || initial.return_status || "Pending";
//       const initialMode = initial.mode || initial.paymentType || initial.payment_type || "Postpaid";

//       return {
//         ...emptyForm,
//         ...initial,
//         status: initialStatus,
//         careCenterId: ccId,
//         equipmentId: initial.equipmentId || initial.equipment_id || "",
//         patientName: initial.patientName || initial.patient_name || "",
//         recordDate: mappedRecord,
//         startDate: mappedStart,
//         logoutDate: mappedLogout,
//         bedNo: initial.bedNo || initial.bed_no || initial.bed_number || "",
//         referral: initial.referral || initial.referral_doctor || initial.referralDoctor || "",
//         dealType: initial.dealType || initial.deal_type || "B2B",
//         unit: initial.unit || "ODCOM",
//         mode: initialMode,
//         paymentType: initialMode,
//         notifyDate: mappedNotify,
//         deliveryAddress: initial.deliveryAddress || initial.delivery_address || "",
//         notes: initial.notes || "",
//         contactPerson: initial.contactPerson || initial.contact_person || cc?.contactPerson || "",
//         phone: initial.phone || cc?.phone || "",
//         gst: initial.gst || initial.gst_number || initial.gstNumber || cc?.gst || "",
//         address: initial.address || cc?.address || "",
//         accessory: parsedAcc
//       };
//     }
//     return emptyForm;
//   });
  
//   const [errors, setErrors] = useState({});
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const modalCurrentStatus = useMemo(() => {
//     return getCalculatedStatus(form.startDate, form.logoutDate, form.status);
//   }, [form.startDate, form.logoutDate, form.status]);

//   const handleCareCenterChange = (id) => {
//     if (id === "other") {
//       set({ careCenterId: "other", address: "", contactPerson: "", phone: "", gst: "" });
//     } else {
//       const cc = careCenters.find((c) => c.id === id);
//       set({ careCenterId: id, address: cc?.address || "", contactPerson: cc?.contactPerson || "", phone: cc?.phone || "", gst: cc?.gst || "" });
//     }
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.careCenterId) e.careCenterId = "Please select a care center.";
//     if (!form.equipmentId) e.equipmentId = "Please select equipment.";
//     if (!form.quantity || Number(form.quantity) < 1) e.quantity = "Quantity must be at least 1.";
//     if (!form.patientName) e.patientName = "Patient name is required.";
//     if (!form.startDate) e.startDate = "Login date is required.";
//     if (!form.logoutDate) e.logoutDate = "Logout date is required.";
//     if (form.paymentType === "Prepaid" && !form.notifyDate) e.notifyDate = "Notify date is mandatory for Prepaid requisitions.";
//     if (!form.deliveryAddress) e.deliveryAddress = "Delivery address is required.";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (readOnly) return onClose();
//     if (!validate()) {
//       toast.error("Please fill all required fields correctly."); 
//       return;
//     }
//     const equipment = equipmentCatalog.find((eq) => eq.id === form.equipmentId);
//     let careCenterName = "Other";
//     if (form.careCenterId !== "other") {
//       careCenterName = careCenters.find((c) => c.id === form.careCenterId)?.name || "";
//     }
//     onSubmit({ 
//       ...form, 
//       id: initial?.id,
//       equipmentName: equipment?.name || form.equipmentId, 
//       category: equipment?.category || "General", 
//       careCenterName, 
//       status: form.status || "Pending", 
//       deliveryStatus: form.deliveryStatus || "Pending Dispatch" 
//     });
//   };

//   const titles = { add: "New Log Requisition", edit: "Edit Requisition", view: "Requisition Details" };

//   const activeCareCenters = useMemo(() => filterActive(careCenters), [careCenters]);
//   const activeEquipment = useMemo(() => filterActive(equipmentCatalog), [equipmentCatalog]);
//   const activeReferrals = useMemo(() => filterActive(references), [references]);
//   const activeCategories = useMemo(() => filterActive(categories).map(getOptionLabel).filter(Boolean), [categories]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:items-center sm:p-4">
//       <div className="fade-slide-up flex w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-black/5 sm:rounded-2xl" style={{ maxHeight: "92vh" }}>
//         <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-teal-50/70 via-white to-white px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/30"><ClipboardList className="h-4.5 w-4.5" /></div>
//             <div>
//               <h2 className="font-display text-base font-bold tracking-tight text-slate-800">{titles[modalMode]}</h2>
//               {initial?.id && <p className="text-xs font-medium text-slate-400">{initial.id}</p>}
//             </div>
//           </div>
//           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"><X className="h-4 w-4" /></button>
//         </div>

//         <div className="smooth-scroll min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
//           <div>
//             <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><Building2 className="h-3.5 w-3.5" /> Care Center</p>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="sm:col-span-2">
//                 <Field label="Select Care Center" required error={errors.careCenterId}>
//                   <Select disabled={readOnly} value={form.careCenterId} error={errors.careCenterId} onChange={(e) => handleCareCenterChange(e.target.value)}>
//                     <option value="">Choose a care center…</option>
//                     {activeCareCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                     <option value="other">Other (Add New)</option>
//                   </Select>
//                 </Field>
//               </div>
//               <Field label="Contact Person / Doctor"><TextInput disabled={readOnly} value={form.contactPerson} onChange={(e) => set({ contactPerson: e.target.value })} placeholder="Enter name" /></Field>
//               <Field label="Phone"><TextInput disabled={readOnly} value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="Enter phone" /></Field>
//               <Field label="GST / ID Number"><TextInput disabled={readOnly} value={form.gst || form.gst_number || form.gstNumber || ""} onChange={(e) => set({ gst: e.target.value })} placeholder="Enter GST/ID" /></Field>
//               <Field label="Address"><TextInput disabled={readOnly} value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="Enter full address" /></Field>
              
//               <div className="sm:col-span-2 grid grid-cols-2 gap-4">
//                 <Field label="Bed No"><TextInput disabled={readOnly} value={form.bedNo || form.bed_number || form.bedNumber || ""} onChange={(e) => set({ bedNo: e.target.value, bed_number: e.target.value })} /></Field>
//                 <Field label="Referral">
//                   <Select disabled={readOnly} value={form.referral || form.referral_doctor || form.referralDoctor || ""} onChange={(e) => set({ referral: e.target.value, referral_doctor: e.target.value })}>
//                     <option value="">-- Select Referral --</option>
//                     {activeReferrals.map((r) => (
//                       <option key={r.id} value={r.doctorName || r.name}>
//                         {r.doctorName || r.name} {r.domain ? `(${r.domain})` : ""}
//                       </option>
//                     ))}
//                   </Select>
//                 </Field>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-slate-100" />
          
//           <div>
//             <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><Tag className="h-3.5 w-3.5" /> Record Types</p>
//             <div className="grid gap-4 sm:grid-cols-3">
//               <Field label="Deal Type"><Select disabled={readOnly} value={form.dealType} onChange={(e) => set({ dealType: e.target.value })}>{DEAL_TYPE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}</Select></Field>
//               <Field label="Unit"><Select disabled={readOnly} value={form.unit} onChange={(e) => set({ unit: e.target.value })}>{UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}</Select></Field>
//               <Field label="Mode"><Select disabled={readOnly} value={form.mode} onChange={(e) => set({ mode: e.target.value, paymentType: e.target.value })}>{MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
//             </div>
//           </div>

//           <div className="border-t border-slate-100" />

//           <div>
//             <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><User className="h-3.5 w-3.5" /> Patient</p>
//             <Field label="Patient Name" required error={errors.patientName}>
//               <TextInput disabled={readOnly} value={form.patientName} error={errors.patientName} placeholder="Full name of the patient" onChange={(e) => set({ patientName: e.target.value })} />
//             </Field>
//           </div>

//           <div className="border-t border-slate-100" />

//           <div>
//             <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><ClipboardList className="h-3.5 w-3.5" /> Equipment Details</p>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="sm:col-span-2">
//                 <Field label="Equipment" required error={errors.equipmentId}>
//                   <Select disabled={readOnly} value={form.equipmentId} error={errors.equipmentId} onChange={(e) => set({ equipmentId: e.target.value })}>
//                     <option value="">Select equipment…</option>
//                     {activeEquipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.name} — ₹{eq.dailyRate}/day</option>)}
//                   </Select>
//                 </Field>
//               </div>
              
//               <div className="sm:col-span-2">
//                 <Field label="Select Accessory" error={errors.accessory}>
//                   <MultiSelect
//                     options={activeCategories}
//                     selected={form.accessory}
//                     onChange={(newAccessories) => set({ accessory: newAccessories })}
//                     placeholder="-- Choose Accessories --"
//                     error={errors.accessory}
//                     disabled={readOnly}
//                   />
//                 </Field>
//               </div>

//               <Field label="Quantity" required error={errors.quantity}>
//                 <TextInput disabled={readOnly} type="number" min={1} value={form.quantity} error={errors.quantity} onChange={(e) => set({ quantity: e.target.value })} />
//               </Field>
//               <Field label="Login Date (Rental Start)" required error={errors.startDate}>
//                 <TextInput disabled={readOnly} type="date" value={form.startDate} error={errors.startDate} onChange={(e) => set({ startDate: e.target.value })} />
//               </Field>
//               <Field label="Logout Date (Return)" required error={errors.logoutDate}>
//                 <TextInput 
//                   disabled={readOnly} 
//                   type="date" 
//                   value={form.logoutDate || ""} 
//                   error={errors.logoutDate} 
//                   onChange={(e) => set({ logoutDate: e.target.value, logout_date: e.target.value })} 
//                 />
//               </Field>
//               <div className="sm:col-span-2">
//                 <Field label="Delivery Address" required error={errors.deliveryAddress}>
//                   <TextInput disabled={readOnly} value={form.deliveryAddress} error={errors.deliveryAddress} placeholder="Where should the equipment be delivered?" onChange={(e) => set({ deliveryAddress: e.target.value })} />
//                 </Field>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-slate-100" />

//           <div>
//             <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><CreditCard className="h-3.5 w-3.5" /> Payment</p>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-600">Payment Type</label>
//                 <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
//                   {PAYMENT_TYPES.map((pt) => (
//                     <button key={pt} type="button" disabled={readOnly} onClick={() => set({ paymentType: pt, mode: pt })} className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${form.paymentType === pt ? "bg-white text-teal-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
//                       {pt}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <Field label="Notify Date" required={form.paymentType === "Prepaid"} error={errors.notifyDate} hint={form.paymentType === "Postpaid" ? "Optional for postpaid requisitions" : "Required — customer will be notified on this date"}>
//                 <TextInput disabled={readOnly} type="date" value={form.notifyDate} error={errors.notifyDate} onChange={(e) => set({ notifyDate: e.target.value })} />
//               </Field>
//             </div>
//           </div>

//           <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs font-semibold text-slate-500">Current Status</p>
//                 <p className="text-sm font-bold text-slate-800">{modalCurrentStatus}</p>
//               </div>

//               {modalCurrentStatus === "Returned" ? (
//                 <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
//                   ✓ Unit Returned
//                 </span>
//               ) : (
//                 !readOnly && (
//                   <button
//                     type="button"
//                     onClick={() => set({ status: "Returned", requisition_status: "Returned", return_status: "Returned" })}
//                     className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 cursor-pointer"
//                   >
//                     <PackageCheck className="h-4 w-4" /> Mark as Returned
//                   </button>
//                 )
//               )}
//             </div>
//           </div>

//           <Field label="Notes">
//             <textarea disabled={readOnly} rows={2} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Any additional instructions…" className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" />
//           </Field>
//         </div>

//         <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
//           <GhostButton onClick={onClose}>{readOnly ? "Close" : "Cancel"}</GhostButton>
//           {!readOnly && (
//             <PrimaryButton onClick={handleSubmit}>
//               <Save className="h-4 w-4" /> {modalMode === "add" ? "Create Requisition" : "Save Changes"}
//             </PrimaryButton>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SectionHeading({ icon: Icon, children }) {
//   return (
//     <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
//       <span className="grid h-6 w-6 place-items-center rounded-md bg-teal-50 text-teal-600"><Icon className="h-3.5 w-3.5" /></span>
//       {children}
//     </p>
//   );
// }

// function NewRequisitionPage({ careCenters, equipmentCatalog, references = [], categories = [], onCancel, onSubmit }) {
//   // 👈 Default recordDate initialized to Today's date automatically
//   const [form, setForm] = useState(() => ({
//     ...emptyForm,
//     recordDate: todayISO(),
//     loginDate: todayISO()
//   }));
//   const [errors, setErrors] = useState({});
//   const [photos, setPhotos] = useState([]);
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const activeCareCenters = useMemo(() => filterActive(careCenters), [careCenters]);
//   const activeEquipment = useMemo(() => filterActive(equipmentCatalog), [equipmentCatalog]);
//   const activeReferrals = useMemo(() => filterActive(references), [references]);
//   const activeCategories = useMemo(() => filterActive(categories).map(getOptionLabel).filter(Boolean), [categories]);

//   const handleCareCenterChange = (id) => {
//     if (id === "other") {
//       set({ careCenterId: "other", careAddress: "", pocMobile: "" });
//     } else {
//       const cc = careCenters.find((c) => c.id === id);
//       set({ 
//         careCenterId: id, 
//         careAddress: cc?.address || "", 
//         pocMobile: cc?.phone || ""
//       });
//     }
//   };

//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files || []);
//     if (photos.length + newFiles.length > 10) {
//       toast.error("You can upload a maximum of 10 files."); 
//       return;
//     }
//     setPhotos((prev) => [...prev, ...newFiles].slice(0, 10));
//   };

//   const removeFile = (indexToRemove) => {
//     setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.dealType) e.dealType = "Please select a deal type.";
//     if (!form.unit) e.unit = "Please select a unit.";
//     if (!form.mode) e.mode = "Please select a mode.";
//     if (!form.deviceModel) e.deviceModel = "Please choose an equipment model.";
//     if (!form.loginDate) e.loginDate = "Log in date is required.";
//     if (!form.logoutDate) e.logoutDate = "Logout date is required to calculate total days.";
//     if (!form.billingType) e.billingType = "Please select a billing type.";
//     if (!form.patientName) e.patientName = "Patient name is required.";
//     if (form.mode === "Prepaid" && !form.notifyDate) {
//       e.notifyDate = "Notify Date is mandatory for Prepaid!";
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) { 
//       toast.error("Please fill all required fields correctly."); 
//       window.scrollTo({ top: 0, behavior: "smooth" }); 
//       return; 
//     }
//     const equipment = equipmentCatalog.find((eq) => eq.id === form.deviceModel);
//     let careCenterName = "Other";
//     if (form.careCenterId !== "other") {
//       careCenterName = careCenters.find((c) => c.id === form.careCenterId)?.name || "";
//     }
//     onSubmit({
//       ...form, 
//       equipmentId: form.deviceModel, 
//       equipmentName: equipment?.name || form.deviceModel, 
//       category: equipment?.category || "General", 
//       careCenterName, 
//       quantity: 1, 
//       startDate: form.loginDate, 
//       paymentType: form.mode, 
//       deliveryAddress: form.deliveryAddress, 
//       status: "Active", 
//       deliveryStatus: "Pending Dispatch", 
//       photoCount: photos.length,
//     });
//   };

//   return (
//     <div className="fade-slide-up space-y-5">
//       <GlobalPolish />
//       <div className="flex items-center gap-2 text-sm">
//         <button onClick={onCancel} className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-teal-600"><ArrowLeft className="h-4 w-4" /> Rental Master</button>
//         <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
//         <span className="font-semibold text-slate-700">Log Asset Requisition</span>
//       </div>

//       <div className="flex items-center justify-between">
//         <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-800">Log Asset Requisition</h2>
//         <div className="hidden items-center gap-2 sm:flex">
//           <GhostButton onClick={onCancel}>Discard</GhostButton>
//         </div>
//       </div>

//       <div style={{ animationDelay: "40ms" }} className="relative z-40 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
//         <SectionHeading icon={Tag}>Record Types</SectionHeading>
//         <div className="grid gap-4 sm:grid-cols-3">
//           <Field label="Deal Type" required error={errors.dealType}><Select value={form.dealType} error={errors.dealType} onChange={(e) => set({ dealType: e.target.value })}><option value="">--- Select ---</option>{DEAL_TYPE_OPTIONS.map((pt) => <option key={pt} value={pt}>{pt}</option>)}</Select></Field>
//           <Field label="Unit" required error={errors.unit}><Select value={form.unit} error={errors.unit} onChange={(e) => set({ unit: e.target.value })}><option value="">--- Select ---</option>{UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}</Select></Field>
//           <Field label="Payment Mode" required error={errors.mode}><Select value={form.mode} error={errors.mode} onChange={(e) => set({ mode: e.target.value, paymentType: e.target.value })}><option value="">--- Select ---</option>{MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
//         </div>
//       </div>

//       <div style={{ animationDelay: "80ms" }} className="relative z-30 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
//         <SectionHeading icon={Truck}>Asset Allocation &amp; Logistics</SectionHeading>
//         <div className="grid gap-4 sm:grid-cols-4">
//           <Field label="Select Device Model" required error={errors.deviceModel}>
//             <Select value={form.deviceModel} error={errors.deviceModel} onChange={(e) => set({ deviceModel: e.target.value })}>
//               <option value="">-- Choose Equipment Model --</option>
//               {activeEquipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
//             </Select>
//           </Field>
          
//           <Field label="Select Accessory" error={errors.accessory}>
//             <MultiSelect
//               options={activeCategories}
//               selected={form.accessory}
//               onChange={(newAccessories) => set({ accessory: newAccessories })}
//               placeholder="-- Choose Accessories --"
//               error={errors.accessory}
//             />
//           </Field>

//           {/* 👈 Record Date Auto Populated */}
//           <Field label="Record Date">
//             <TextInput type="date" value={form.recordDate} onChange={(e) => set({ recordDate: e.target.value })} />
//           </Field>

//           <Field label="Log In Date" required error={errors.loginDate}>
//             <TextInput type="date" value={form.loginDate} error={errors.loginDate} onChange={(e) => set({ loginDate: e.target.value })} />
//           </Field>
          
//           <Field label="Notify Date" required={form.mode === "Prepaid"} error={errors.notifyDate}>
//             <TextInput type="date" value={form.notifyDate} error={errors.notifyDate} onChange={(e) => set({ notifyDate: e.target.value })} />
//           </Field>
          
//           <Field label="Log Out Date" required error={errors.logoutDate}>
//             <TextInput type="date" value={form.logoutDate} error={errors.logoutDate} onChange={(e) => set({ logoutDate: e.target.value })} />
//           </Field>
//           <Field label="Recall Date"><TextInput type="date" value={form.recallDate} onChange={(e) => set({ recallDate: e.target.value })} /></Field>
//         </div>
//       </div>

//       <div style={{ animationDelay: "120ms" }} className="relative z-20 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
//         <SectionHeading icon={CreditCard}>Commercials &amp; Billing</SectionHeading>
//         <div className="grid gap-4 sm:grid-cols-4">
//           <Field label="Billing Type" required error={errors.billingType}>
//             <Select value={form.billingType} error={errors.billingType} onChange={(e) => set({ billingType: e.target.value })}>
//               <option value="Daily">Daily</option>
//               <option value="Fortnight">Fortnight</option>
//               <option value="Monthly">Monthly</option>
//             </Select>
//           </Field>
//           <Field label="Rental Charge (₹)"><TextInput type="number" min={0} value={form.rentalCharge} onChange={(e) => set({ rentalCharge: e.target.value })} /></Field>
//           <Field label="Deposit / Advance (₹)"><TextInput type="number" min={0} value={form.depositAdvance} onChange={(e) => set({ depositAdvance: e.target.value })} /></Field>
//           <Field label="Installation Charge (₹)"><TextInput type="number" min={0} value={form.installationCharge} onChange={(e) => set({ installationCharge: e.target.value })} /></Field>
//         </div>
//       </div>

//       <div style={{ animationDelay: "160ms" }} className="relative z-10 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
//         <div className="grid gap-8 lg:grid-cols-2">
//           <div>
//             <SectionHeading icon={Building2}>Care Center Context</SectionHeading>
//             <div className="space-y-4">
//               <Field label="Care Center Name">
//                 <Select value={form.careCenterId} onChange={(e) => handleCareCenterChange(e.target.value)}>
//                   <option value="">-- Select Care Center --</option>
//                   {activeCareCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                   <option value="other">Other (Add New)</option>
//                 </Select>
//               </Field>
//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="POC Mobile"><TextInput value={form.pocMobile} onChange={(e) => set({ pocMobile: e.target.value })} /></Field>
//                 <Field label="Alt POC Mobile"><TextInput value={form.altPocMobile} onChange={(e) => set({ altPocMobile: e.target.value })} /></Field>
//               </div>
//               <Field label="Care Address"><textarea rows={2} value={form.careAddress} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none resize-none border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" onChange={(e) => set({ careAddress: e.target.value })} /></Field>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Bed No"><TextInput value={form.bedNo} onChange={(e) => set({ bedNo: e.target.value })} /></Field>
                
//                 <Field label="Referral">
//                   <Select value={form.referral} onChange={(e) => set({ referral: e.target.value })}>
//                     <option value="">-- Select Referral --</option>
//                     {activeReferrals.map((r) => (
//                       <option key={r.id} value={r.doctorName || r.name}>
//                         {r.doctorName || r.name} {r.domain ? `(${r.domain})` : ""}
//                       </option>
//                     ))}
//                   </Select>
//                 </Field>
//               </div>
//             </div>
//           </div>
//           <div>
//             <SectionHeading icon={User}>Patient Identity Details</SectionHeading>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Patient Name" required error={errors.patientName}><TextInput value={form.patientName} error={errors.patientName} onChange={(e) => set({ patientName: e.target.value })} /></Field>
//                 <Field label="Age"><TextInput type="number" min={0} value={form.age} onChange={(e) => set({ age: e.target.value })} /></Field>
//               </div>
//               <Field label="Attendant Name"><TextInput value={form.attendantName} onChange={(e) => set({ attendantName: e.target.value })} /></Field>
//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Mobile Number"><TextInput value={form.mobileNumber} onChange={(e) => set({ mobileNumber: e.target.value })} /></Field>
//                 <Field label="Alt Mobile Number"><TextInput value={form.altMobileNumber} onChange={(e) => set({ altMobileNumber: e.target.value })} /></Field>
//               </div>
//               <Field label="Delivery Address"><textarea rows={3} value={form.deliveryAddress} onChange={(e) => set({ deliveryAddress: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" /></Field>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style={{ animationDelay: "200ms" }} className="relative z-0 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
//         <Field label="Notes"><textarea rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" /></Field>
//       </div>

//       <div style={{ animationDelay: "240ms" }} className="rise-in rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/30">
//         <Field label="Asset Handover Photo Verification (Up to 10 photos/PDFs)">
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-3">
//               <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700">
//                 <ImagePlus className="h-4 w-4" /> Choose files
//                 <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={handleFileChange} />
//               </label>
//               <span className="text-xs font-medium text-slate-400">{photos.length} / 10 files chosen</span>
//             </div>
            
//             {photos.length > 0 && (
//               <div className="flex flex-wrap gap-3">
//                 {photos.map((file, idx) => {
//                   const isImage = file.type.startsWith("image/");
//                   return (
//                     <div key={idx} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:ring-2 hover:ring-teal-500/50">
//                       {isImage ? (
//                         <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />
//                       ) : (
//                         <div className="flex h-full w-full flex-col items-center justify-center bg-rose-50 p-1 text-center text-rose-500">
//                           <FileText className="mb-1 h-6 w-6" />
//                           <span className="w-full truncate text-[9px] font-semibold">{file.name}</span>
//                         </div>
//                       )}
//                       <button type="button" onClick={() => removeFile(idx)} className="absolute right-1 top-1 hidden h-5 w-5 place-items-center rounded-full bg-rose-500 text-white shadow-md transition hover:bg-rose-600 group-hover:grid">
//                         <X className="h-3 w-3" />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </Field>
//       </div>

//       <div className="mt-8 flex items-center justify-end border-t border-slate-200 pt-6 pb-4">
//         <PrimaryButton onClick={handleSubmit} className="px-6 py-2.5 shadow-md hover:shadow-lg transition-all">
//           <Save className="h-4.5 w-4.5" /> Save Requisition &amp; Deploy
//         </PrimaryButton>
//       </div>
//     </div>
//   );
// }

// export default function RentalMaster({ permissions, careCenters, equipmentCatalog, references = [], categories = [] }) {
//   const [logs, setLogs] = useState(() => {
//     try {
//       const cached = localStorage.getItem("cached_requisitions");
//       return cached ? JSON.parse(cached) : [];
//     } catch {
//       return [];
//     }
//   }); 

//   const [loading, setLoading] = useState(() => logs.length === 0);
  
//   const fetchLogs = useCallback(async () => {
//     try {
//       const response = await API.get(`/rental/requisitions?t=${Date.now()}`);
//       setLogs(response.data);
//       localStorage.setItem("cached_requisitions", JSON.stringify(response.data));
//     } catch (error) {
//       console.error("Failed to fetch logs:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     let isMounted = true;

//     const loadData = async () => {
//       try {
//         const response = await API.get(`/rental/requisitions?t=${Date.now()}`);
//         if (isMounted) {
//           setLogs(response.data);
//           localStorage.setItem("cached_requisitions", JSON.stringify(response.data));
//         }
//       } catch (error) {
//         console.error("Failed to fetch logs:", error);
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [dealTypeFilter, setDealTypeFilter] = useState("All");
//   const [unitFilter, setUnitFilter] = useState("All"); 
//   const [modeFilter, setModeFilter] = useState("All");
//   const [monthFilter, setMonthFilter] = useState(0); 
//   const [careCenterFilter, setCareCenterFilter] = useState("All"); 

//   const [modal, setModal] = useState(null); 
//   const [calcModal, setCalcModal] = useState(null); // 👈 Calculator state
//   const [confirmDelete, setConfirmDelete] = useState(null);
//   const [showAddPage, setShowAddPage] = useState(false);

//   const monthOptions = useMemo(() => {
//     const opts = [];
//     const now = new Date();
//     for (let i = 0; i < 4; i++) {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
//       opts.push({ value: i, label: i === 0 ? `Current Month (${label})` : label });
//     }
//     return opts;
//   }, []);

//   // 👈 Updated Total Days logic: Y = Logout Day (Not Month)
//   const getDynamicTotalDays = (loginStr, logoutStr, monthOffset) => {
//     if (!loginStr) return "—";

//     const login = new Date(loginStr);
//     login.setHours(0, 0, 0, 0); 

//     if (logoutStr) {
//       const logout = new Date(logoutStr);
//       logout.setHours(0, 0, 0, 0);

//       const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
//       const endUtc = Date.UTC(logout.getFullYear(), logout.getMonth(), logout.getDate());

//       let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1; 
//       if (diffDays < 0) diffDays = 0; 

//       const logoutDay = logout.getDate(); // 👈 Logout Day of the Month
//       return `${diffDays}/${logoutDay}`;
//     }

//     const now = new Date();
//     now.setHours(0, 0, 0, 0);

//     const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
//     const targetYear = targetDate.getFullYear();
//     const targetMonth = targetDate.getMonth();

//     let end;
//     if (monthOffset === 0) {
//        end = now; 
//     } else {
//        end = new Date(targetYear, targetMonth + 1, 0); 
//     }

//     if (login > end) return "—"; 

//     const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
//     const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

//     const X = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
//     const Y = end.getDate();

//     return `${X}/${Y}`;
//   };

//   const filtered = useMemo(() => {
//     return logs.filter((l) => {
//       const ccId = l.careCenterId || l.care_center_id;
//       const ccName = l.careCenterName || careCenters.find((c) => c.id === ccId)?.name || ccId;
      
//       const eqId = l.equipmentId || l.equipment_id;
//       const eqName = l.equipmentName || equipmentCatalog.find(e => e.id === eqId)?.name || eqId;

//       const rawStatus = l.status || l.requisition_status || l.return_status;
//       const currentCalcStatus = getCalculatedStatus(l.startDate || l.start_date, l.logoutDate || l.logout_date, rawStatus);
//       const currentMode = l.mode || l.paymentType || l.payment_type || "";
//       const currentUnit = l.unit || "";

//       const matchesSearch = !search || 
//         l.id.toString().toLowerCase().includes(search.toLowerCase()) || 
//         (eqName || "").toLowerCase().includes(search.toLowerCase()) || 
//         (l.patientName || l.patient_name || "").toLowerCase().includes(search.toLowerCase()) || 
//         (ccName || "").toLowerCase().includes(search.toLowerCase());
        
//       const matchesStatus = statusFilter === "All" || currentCalcStatus === statusFilter;
//       const matchesDealType = dealTypeFilter === "All" || (l.dealType || l.deal_type) === dealTypeFilter;
//       const matchesUnit = unitFilter === "All" || currentUnit === unitFilter;
//       const matchesMode = modeFilter === "All" || currentMode === modeFilter;
//       const matchesCareCenter = careCenterFilter === "All" || ccId === careCenterFilter;

//       return matchesSearch && matchesStatus && matchesDealType && matchesUnit && matchesMode && matchesCareCenter;
//     });
//   }, [logs, search, statusFilter, dealTypeFilter, unitFilter, modeFilter, careCenterFilter, careCenters, equipmentCatalog]);

//   const handleAdd = async (data) => {
//     try {
//       const accStr = Array.isArray(data.accessory) ? data.accessory.join(", ") : (data.accessory || "");
//       const chosenMode = data.mode || data.paymentType || "Postpaid";
      
//       const backendData = {
//         id: data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
//         care_center_id: data.careCenterId === "other" ? "NEW" : (data.careCenterId || data.care_center_id),
//         equipment_id: data.equipmentId || data.deviceModel,
//         patient_name: data.patientName,
//         quantity: data.quantity || 1,
//         start_date: data.startDate || data.loginDate, 
//         logout_date: data.logoutDate || data.logout_date || data.startDate || data.loginDate, 
//         bed_number: data.bedNo || data.bed_number || "", 
//         referral_doctor: data.referral || data.referralDoctor || data.referral_doctor || "",         
//         gst_number: data.gstNo || data.gstNumber || data.gst_number || "",
//         payment_type: chosenMode,
//         deal_type: data.dealType,
//         unit: data.unit,
//         mode: chosenMode,
//         notify_date: data.notifyDate || null,
//         delivery_address: data.deliveryAddress,
//         notes: data.notes || "",
//         accessory: accStr,
//         accessories: accStr, 
//         status: "Active",
//         requisition_status: "Active"
//       };

//       await API.post("/rental/requisitions", backendData);
//       await fetchLogs();
//       setShowAddPage(false);
//       toast.success("Requisition saved successfully!");
//     } catch (err) {
//       toast.error("Error saving Requisition: " + (err.response?.data?.message || err.message)); 
//     }
//   };

//   const handleEdit = async (data) => {
//     const targetStatus = data.status || data.requisition_status || data.return_status || "Active";
//     const chosenMode = data.mode || data.paymentType || data.payment_type || "Postpaid";
//     const accStr = Array.isArray(data.accessory) ? data.accessory.join(", ") : (data.accessory || "");

//     setLogs((prevLogs) => {
//       const updated = prevLogs.map((l) =>
//         l.id === data.id
//           ? {
//               ...l,
//               ...data,
//               status: targetStatus,
//               requisition_status: targetStatus,
//               return_status: targetStatus,
//               mode: chosenMode,
//               paymentType: chosenMode,
//               accessory: accStr,
//               accessories: accStr
//             }
//           : l
//       );
//       localStorage.setItem("cached_requisitions", JSON.stringify(updated));
//       return updated;
//     });

//     try {
//       const newLogoutDate = data.logoutDate || data.logout_date || null;
//       const newStartDate = data.startDate || data.start_date;
//       const newNotifyDate = data.notifyDate || data.notify_date || null;

//       const backendData = {
//         care_center_id: data.careCenterId === "other" ? "NEW" : (data.careCenterId || data.care_center_id),
//         equipment_id: data.equipmentId || data.equipment_id,
//         patient_name: data.patientName || data.patient_name,
//         quantity: data.quantity || 1,
//         start_date: newStartDate,
//         logout_date: newLogoutDate,
//         bed_number: data.bedNo || data.bed_number || data.bedNumber || "", 
//         referral_doctor: data.referral || data.referral_doctor || data.referralDoctor || "",         
//         gst_number: data.gst || data.gst_number || data.gstNumber || "",
//         payment_type: chosenMode,
//         deal_type: data.dealType || data.deal_type,
//         unit: data.unit,
//         mode: chosenMode,
//         notify_date: newNotifyDate,
//         delivery_address: data.deliveryAddress || data.delivery_address,
//         notes: data.notes || "",
//         status: targetStatus,
//         requisition_status: targetStatus,
//         return_status: targetStatus,
//         returnStatus: targetStatus,
//         accessory: accStr,   
//         accessories: accStr 
//       };
      
//       await API.put(`/rental/requisitions/${data.id}`, backendData); 
//       setModal(null);
//       toast.success(`Requisition updated!`); 
//     } catch (err) {
//       toast.error("Update failed: " + (err.response?.data?.message || err.message));
//       fetchLogs(); 
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await API.delete(`/rental/requisitions/${confirmDelete.id}`);
//       await fetchLogs();
//       setConfirmDelete(null);
//       toast.success("Requisition deleted successfully!"); 
//     } catch (err) {
//       toast.error("Delete failed: " + (err.response?.data?.message || err.message));
//     }
//   };

//   if (showAddPage) {
//     return <NewRequisitionPage careCenters={careCenters} equipmentCatalog={equipmentCatalog} references={references} categories={categories} onCancel={() => setShowAddPage(false)} onSubmit={handleAdd} />;
//   }

//   return (
//     <div className="space-y-5">
//       <GlobalPolish />
      
//       {/* 🏷️ Top Header with Log Requisition Button */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800">Rental Master Sheet</h1>
//           <p className="text-xs font-medium text-slate-400 mt-0.5">Live view &amp; allocation of equipment requisitions</p>
//         </div>

//         {permissions.canAdd && (
//           <PrimaryButton onClick={() => setShowAddPage(true)} className="shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] px-4.5 py-2.5">
//             <Plus className="h-4 w-4" /> New Log Requisition
//           </PrimaryButton>
//         )}
//       </div>

//       {/* 📊 KPI Cards */}
//       <KpiCards logs={logs} />
      
//       {/* 🔍 Full Width Balanced Filter Bar */}
//       <div style={{ animationDelay: "80ms" }} className="rise-in rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm shadow-slate-200/40">
//         <div className="flex flex-wrap items-center gap-2.5 w-full">
          
//           {/* Search Box */}
//           <div className="group relative flex-[2] min-w-[220px]">
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-500" />
//             <input 
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)} 
//               placeholder="Search by ID, patient, device, care center…" 
//               className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20" 
//             />
//           </div>

//           <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400 hidden sm:block" />
          
//           {/* Calendar Month Picker */}
//           <div className="relative group flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-teal-50 transition cursor-pointer shrink-0 shadow-2xs" title="Filter by Month">
//             <Calendar className="h-4 w-4 text-slate-500 group-hover:text-teal-600" />
//             <select value={monthFilter} onChange={(e) => setMonthFilter(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
//               {monthOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>

//           {/* Care Center Dropdown */}
//           <select value={careCenterFilter} onChange={(e) => setCareCenterFilter(e.target.value)} className="flex-1 min-w-[130px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Care Centers</option>
//             {filterActive(careCenters).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>

//           {/* Status Dropdown */}
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Status</option>
//             {RENTAL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
          
//           {/* Deal Types Dropdown */}
//           <select value={dealTypeFilter} onChange={(e) => setDealTypeFilter(e.target.value)} className="flex-1 min-w-[115px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Deal Types</option>
//             {DEAL_TYPE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
          
//           {/* Units Dropdown */}
//           <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Units</option>
//             {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
//           </select>

//           {/* Modes Dropdown */}
//           <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Modes</option>
//             {MODE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>

//           {/* Reset Button (Cross Mark) */}
//           <button 
//             type="button"
//             onClick={() => {
//               setSearch("");
//               setStatusFilter("All");
//               setDealTypeFilter("All");
//               setUnitFilter("All");
//               setModeFilter("All");
//               setCareCenterFilter("All");
//               setMonthFilter(0);
//               toast.success("Filters reset");
//             }}
//             title="Reset all filters"
//             className="flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer shrink-0"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       <div style={{ animationDelay: "140ms" }} className="rise-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
//         <div className="smooth-scroll-x overflow-x-auto">
//           <table className="w-full text-left text-sm" style={{ minWidth: 800 }}>
//             <thead>
//               <tr className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/90 text-xs font-bold uppercase tracking-wide text-slate-400 backdrop-blur">
//                 <th className="px-5 py-3">Status</th>
//                 <th className="px-5 py-3">Device</th>
//                 <th className="px-5 py-3">Patients</th>
//                 <th className="px-5 py-3">Login Date</th>
//                 <th className="px-5 py-3">Logout Date</th>
//                 <th className="px-5 py-3">Total Days</th>
//                 <th className="px-5 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {loading && filtered.length === 0 ? (
//                 Array.from({ length: 5 }).map((_, idx) => (
//                   <tr key={idx} className="animate-pulse">
//                     <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-28 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-24 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-10 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md ml-auto"></div></td>
//                   </tr>
//                 ))
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-5 py-14 text-center">
//                     <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100"><Search className="h-5 w-5 text-slate-400" /></div>
//                     <p className="mt-3 text-sm font-semibold text-slate-500">No requisitions match your filters</p>
//                     <p className="text-xs text-slate-400">Try adjusting the search or filter criteria</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((log, i) => {
//                   const actualLogoutDate = log.logoutDate || log.logout_date;
//                   const dynamicDays = getDynamicTotalDays(log.startDate || log.start_date, actualLogoutDate, monthFilter);
//                   const rawStatus = log.status || log.requisition_status || log.return_status;
//                   const currentStatus = getCalculatedStatus(log.startDate || log.start_date, actualLogoutDate, rawStatus);
//                   const currentMode = log.mode || log.paymentType || log.payment_type || "Postpaid";

//                   const rowColor = currentMode === "Prepaid" 
//                     ? "bg-emerald-50/70 hover:bg-emerald-100" 
//                     : currentMode === "Postpaid" 
//                     ? "bg-rose-50/70 hover:bg-rose-100"       
//                     : "hover:bg-teal-50/40";                 

//                   const eqId = log.equipmentId || log.equipment_id;
//                   let actualDevice = eqId || log.equipmentName || "—";
                  
//                   const catMatch = equipmentCatalog.find(e => e.id === eqId);
//                   if (catMatch) actualDevice = catMatch.name;

//                   return (
//                     <tr 
//                       key={log.id} 
//                       style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }} 
//                       className={`rise-in group/row relative transition-colors duration-150 ${rowColor}`}
//                     >
//                       <td className="relative px-5 py-3.5">
//                         <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 bg-teal-500 transition-all duration-200 group-hover/row:h-6" />
//                         <StatusBadge status={currentStatus} glow={currentStatus === "Active"} />
//                       </td>
//                       <td className="px-5 py-3.5 font-bold text-slate-800">
//                         {actualDevice}
//                       </td>
//                       <td className="px-5 py-3.5 text-slate-600">{log.patientName || log.patient_name || "—"}</td>
//                       <td className="px-5 py-3.5 text-slate-600">{formatDateShort(log.startDate || log.start_date)}</td>
//                       <td className="px-5 py-3.5 text-slate-600">{actualLogoutDate ? formatDateShort(actualLogoutDate) : "—"}</td>
                      
//                       <td className="px-5 py-3.5">
//                         <span className="font-semibold text-slate-700 bg-slate-50/50 border border-slate-200/60 px-2 py-1 rounded-md shadow-sm">{dynamicDays}</span>
//                       </td>

//                       <td className="px-5 py-3.5">
//                         <div className="flex items-center justify-end gap-1">
                          
//                           <IconAction 
//                             title="Calculate Total Days" 
//                             tone="amber" 
//                             onClick={() => setCalcModal(log)}
//                           >
//                             <Calculator className="h-4 w-4 text-amber-600" />
//                           </IconAction>

//                           {currentStatus !== "Returned" && (
//                             <IconAction 
//                               title="Mark as Returned" 
//                               tone="teal" 
//                               onClick={() => handleEdit({ ...log, status: "Returned", requisition_status: "Returned", return_status: "Returned" })}
//                             >
//                               <PackageCheck className="h-4 w-4 text-emerald-600" />
//                             </IconAction>
//                           )}

//                           <IconAction title="View" tone="teal" onClick={() => setModal({ mode: "view", data: log })}><Eye className="h-4 w-4" /></IconAction>
//                           {permissions.canEdit && <IconAction title="Edit" tone="teal" onClick={() => setModal({ mode: "edit", data: log })}><Pencil className="h-4 w-4" /></IconAction>}
//                           {permissions.canDelete && <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete(log)}><Trash2 className="h-4 w-4" /></IconAction>}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-5 py-3 text-xs text-slate-400">
//           <span>Showing {filtered.length} of {logs.length} requisitions</span>
//           <span className="hidden sm:inline">Chikitsa · Live data</span>
//         </div>
//       </div>

//       {calcModal && (
//         <CalculateTotalDaysModal 
//           log={calcModal} 
//           equipmentCatalog={equipmentCatalog}
//           onClose={() => setCalcModal(null)} 
//         />
//       )}

//       {modal && (
//         <RequisitionModal 
//           mode={modal.mode} 
//           initial={modal.data} 
//           careCenters={careCenters} 
//           equipmentCatalog={equipmentCatalog} 
//           references={references} 
//           categories={categories} 
//           onClose={() => setModal(null)} 
//           onSubmit={modal.mode === "add" ? handleAdd : handleEdit} 
//         />
//       )}

//       <ConfirmDialog open={!!confirmDelete} title="Delete this requisition?" message={confirmDelete ? `${confirmDelete.id} will be permanently removed. This cannot be undone.` : ""} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} />
//     </div>
//   );
// }

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, Plus, Eye, Pencil, Trash2, PackageCheck, Clock, Activity, AlertTriangle, Building2, User, Tag, CreditCard, Save, X, ClipboardList, ArrowLeft, ChevronRight, ImagePlus, Truck, FileText, Calendar, ChevronDown, Calculator } from "lucide-react";
import { PrimaryButton, GhostButton, IconAction, ConfirmDialog, StatusBadge, Field, Select, TextInput, toast } from "../components/UiComponents";
import { RENTAL_STATES, DEAL_TYPE_OPTIONS, MODE_OPTIONS, UNIT_OPTIONS, PAYMENT_TYPES } from "../data/MockData";
import { formatDateShort, todayISO } from "../utils/Helper";
import API from "../utils/api";

function GlobalPolish() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      .smooth-scroll, .smooth-scroll-x { scroll-behavior: smooth; }
      .smooth-scroll::-webkit-scrollbar,
      .smooth-scroll-x::-webkit-scrollbar { width: 8px; height: 8px; }
      .smooth-scroll::-webkit-scrollbar-track,
      .smooth-scroll-x::-webkit-scrollbar-track { background: transparent; }
      .smooth-scroll::-webkit-scrollbar-thumb,
      .smooth-scroll-x::-webkit-scrollbar-thumb {
        background-color: rgba(13, 148, 136, 0.25);
        border-radius: 9999px;
        transition: background-color 0.2s ease;
      }
      .smooth-scroll:hover::-webkit-scrollbar-thumb,
      .smooth-scroll-x:hover::-webkit-scrollbar-thumb { background-color: rgba(13, 148, 136, 0.45); }
      .smooth-scroll, .smooth-scroll-x { scrollbar-width: thin; scrollbar-color: rgba(13,148,136,0.3) transparent; }
      @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .rise-in { animation: riseIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
      @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .fade-slide-up { animation: fadeScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
    `}</style>
  );
}

const getOptionLabel = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.name || item.categoryName || item.category_name || item.title || item.label || item.doctorName || "";
};

const filterActive = (list = []) => {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => {
    if (!item) return false;
    if (typeof item === "string") return true;
    const st = (item.status || item.state || "").toString().trim().toLowerCase();
    if (st === "inactive" || st === "disabled" || item.is_active === 0 || item.isActive === false) {
      return false;
    }
    return true;
  });
};

const getCalculatedStatus = (startDateStr, logoutDateStr, currentStatus) => {
  if (currentStatus && ["returned", "return"].includes(currentStatus.toString().trim().toLowerCase())) {
    return "Returned";
  }

  if (!startDateStr || !logoutDateStr) return "Pending";

  const parseSafeDate = (dStr) => {
    if (!dStr) return null;
    let str = dStr.toString().trim();
    if (str.includes("T")) str = str.split("T")[0];
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(str)) {
      const p = str.split(/[-/]/);
      str = `${p[2]}-${p[1]}-${p[0]}`;
    }
    const d = new Date(`${str}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  };

  const start = parseSafeDate(startDateStr);
  const logout = parseSafeDate(logoutDateStr);

  if (!start || !logout) return currentStatus || "Pending";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tTime = today.getTime();
  const sTime = start.getTime();
  const lTime = logout.getTime();

  const overdueLimit = new Date(logout);
  overdueLimit.setDate(overdueLimit.getDate() + 3);
  const oTime = overdueLimit.getTime();

  if (tTime >= sTime && tTime <= lTime) return "Active";
  if (tTime > lTime && tTime <= oTime) return "Pending";
  if (tTime > oTime) return "Overdue";

  return "Pending";
};

const formatForDateInput = (d) => {
  if (!d) return "";
  if (typeof d === "string") {
    if (d.includes("T")) return d.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const p = d.split("-");
    if (p.length === 3 && p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`;
  }
  return "";
};

function MultiSelect({ options = [], selected = [], onChange, placeholder = "Select...", error, disabled }) {
  const [isOpen, setIsOpen] = useState(false);

  const safeSelected = useMemo(() => {
    if (Array.isArray(selected)) {
      return selected.map(getOptionLabel).filter(Boolean);
    }
    if (typeof selected === "string" && selected.trim() !== "") {
      return selected.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  }, [selected]);

  const toggleOption = (optName) => {
    if (safeSelected.includes(optName)) {
      onChange(safeSelected.filter((item) => item !== optName));
    } else {
      onChange([...safeSelected, optName]);
    }
  };

  const removeOption = (e, optName) => {
    e.stopPropagation();
    onChange(safeSelected.filter((item) => item !== optName));
  };

  return (
    <div className="relative text-left">
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex min-h-[42px] w-full flex-wrap items-center justify-between gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-all ${error ? 'border-rose-300 ring-4 ring-rose-500/10' : 'border-slate-200 hover:border-teal-300 focus:border-teal-500'} ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      >
        <div className="flex flex-wrap gap-1.5 items-center flex-1">
          {safeSelected.length === 0 && <span className="text-slate-400">{placeholder}</span>}
          {safeSelected.map((sel) => (
            <span key={sel} className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200 shadow-sm">
              {sel}
              {!disabled && (
                <X className="h-3.5 w-3.5 cursor-pointer hover:text-amber-900 transition-colors" onClick={(e) => removeOption(e, sel)} />
              )}
            </span>
          ))}
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
          <div className="absolute z-[99] mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/5">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-xs text-slate-400">No active accessories available</div>
            ) : (
              options.map((opt) => {
                const optName = typeof opt === "string" ? opt : getOptionLabel(opt);
                const isSel = safeSelected.includes(optName);
                return (
                  <div 
                    key={optName} 
                    onClick={() => toggleOption(optName)} 
                    className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-teal-50 ${isSel ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700'}`}
                  >
                    {optName}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

function KpiCards({ logs }) {
  const count = (s) => logs.filter((l) => {
    const rawStatus = l.status || l.requisition_status || l.return_status;
    const dynamicStatus = getCalculatedStatus(
      l.startDate || l.start_date, 
      l.logoutDate || l.logout_date, 
      rawStatus
    );
    return dynamicStatus === s;
  }).length;

  const cards = [
    { label: "Active Rentals", value: count("Active"), icon: Activity, tone: "teal" },
    { label: "Pending Requisitions", value: count("Pending"), icon: Clock, tone: "amber" },
    { label: "Overdue Returns", value: count("Overdue"), icon: AlertTriangle, tone: "rose" },
    { label: "Units Returned", value: count("Returned"), icon: PackageCheck, tone: "slate" },
  ];
  const toneMap = {
    teal: { chip: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30", bar: "from-teal-400 to-teal-600", glow: "bg-teal-400/10" },
    amber: { chip: "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-500/30", bar: "from-amber-300 to-amber-500", glow: "bg-amber-400/10" },
    rose: { chip: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/30", bar: "from-rose-400 to-rose-600", glow: "bg-rose-400/10" },
    slate: { chip: "bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-slate-500/30", bar: "from-slate-400 to-slate-600", glow: "bg-slate-400/10" },
  };
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const t = toneMap[c.tone];
        return (
          <div key={c.label} style={{ animationDelay: `${i * 60}ms` }} className="rise-in group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
            <span className={`absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100 ${t.bar}`} />
            <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${t.glow}`} />
            <div className={`relative grid h-11 w-11 place-items-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 ${t.chip}`}>
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <p className="relative mt-3.5 font-display text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">{c.value}</p>
            <p className="relative mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function CalculateTotalDaysModal({ log, equipmentCatalog, onClose }) {
  const [tempLoginDate, setTempLoginDate] = useState(() => formatForDateInput(log.startDate || log.start_date) || todayISO());
  const [tempLogoutDate, setTempLogoutDate] = useState(() => formatForDateInput(log.logoutDate || log.logout_date) || "");

  const eqId = log.equipmentId || log.equipment_id;
  const eqName = equipmentCatalog.find(e => e.id === eqId)?.name || log.equipmentName || "Device";
  const patientName = log.patientName || log.patient_name || "Patient";

  const calculatedDisplay = useMemo(() => {
    if (!tempLoginDate) return "—";
    const login = new Date(tempLoginDate);
    login.setHours(0, 0, 0, 0);

    if (tempLogoutDate) {
      const logout = new Date(tempLogoutDate);
      logout.setHours(0, 0, 0, 0);
      const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
      const endUtc = Date.UTC(logout.getFullYear(), logout.getMonth(), logout.getDate());
      let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays < 0) diffDays = 0;
      const logoutDay = logout.getDate();
      return `${diffDays} / ${logoutDay}`;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
    const endUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays < 0) diffDays = 0;
    const currentDay = now.getDate();
    return `${diffDays} / ${currentDay}`;
  }, [tempLoginDate, tempLogoutDate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="font-display text-base font-bold text-slate-800">Calculate Total Days</h3>
            <p className="text-xs text-slate-400 mt-0.5">{patientName} • {eqName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Log In Date
            </label>
            <input 
              type="date" 
              value={tempLoginDate} 
              onChange={(e) => setTempLoginDate(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Log Out Date
            </label>
            <input 
              type="date" 
              value={tempLogoutDate} 
              onChange={(e) => setTempLogoutDate(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" 
            />
            <p className="text-[11px] text-slate-400 mt-1">Leave empty to calculate until today</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 text-center my-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Days</span>
            <p className="mt-1 font-display text-3xl font-extrabold text-teal-700">
              {calculatedDisplay}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

const emptyForm = { 
  careCenterId: "", 
  address: "", 
  contactPerson: "", 
  phone: "", 
  gst: "", 
  equipmentId: "", 
  quantity: 1, 
  recordDate: todayISO(), 
  startDate: todayISO(), 
  loginDate: todayISO(),
  logoutDate: "", 
  patientName: "", 
  paymentType: "Postpaid", 
  dealType: "B2B", 
  unit: "ODCOM", 
  mode: "Postpaid", 
  notifyDate: "", 
  deliveryAddress: "", 
  notes: "", 
  bedNo: "", 
  referral: "", 
  accessory: [] 
};

function RequisitionModal({ mode: modalMode, initial, careCenters, equipmentCatalog, references = [], categories = [], onClose, onSubmit }) {
  const readOnly = modalMode === "view";

  const loggedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
  const isCareCenterUser = loggedUser?.role === "care_center";

  const matchedUserCenter = useMemo(() => {
    if (!isCareCenterUser) return null;
    return careCenters.find((c) => 
      c.id === loggedUser.careCenterId || 
      c.id === loggedUser.id || 
      (c.phone && loggedUser.phone && String(c.phone).replace(/\D/g, "").slice(-10) === String(loggedUser.phone).replace(/\D/g, "").slice(-10)) ||
      (c.name && loggedUser.name && c.name.trim().toLowerCase() === loggedUser.name.trim().toLowerCase())
    ) || {
      id: loggedUser.careCenterId || loggedUser.id || "CC-ME",
      name: loggedUser.careCenterName || loggedUser.name || "My Care Center"
    };
  }, [careCenters, isCareCenterUser, loggedUser]);

  const modalDropdownCareCenters = useMemo(() => {
    if (isCareCenterUser && matchedUserCenter) {
      return [matchedUserCenter];
    }
    return filterActive(careCenters);
  }, [careCenters, isCareCenterUser, matchedUserCenter]);
  
  const [form, setForm] = useState(() => {
    if (initial) {
      const rawAcc = initial.accessory || initial.accessories;
      let parsedAcc = [];
      
      if (Array.isArray(rawAcc)) {
        parsedAcc = rawAcc.map(getOptionLabel).filter(Boolean);
      } else if (typeof rawAcc === 'string' && rawAcc.trim() !== "") {
        parsedAcc = rawAcc.split(',').map(item => item.trim()).filter(Boolean);
      }

      const ccId = initial.careCenterId || initial.care_center_id || "";
      const cc = careCenters.find((c) => c.id === ccId);
      const mappedRecord = formatForDateInput(initial.recordDate || initial.record_date) || todayISO();
      const mappedStart = formatForDateInput(initial.startDate || initial.start_date) || todayISO();
      const mappedLogout = formatForDateInput(initial.logoutDate || initial.logout_date);
      const mappedNotify = formatForDateInput(initial.notifyDate || initial.notify_date);
      const initialStatus = initial.status || initial.requisition_status || initial.return_status || "Pending";
      const initialMode = initial.mode || initial.paymentType || initial.payment_type || "Postpaid";

      return {
        ...emptyForm,
        ...initial,
        status: initialStatus,
        careCenterId: ccId,
        equipmentId: initial.equipmentId || initial.equipment_id || "",
        patientName: initial.patientName || initial.patient_name || "",
        recordDate: mappedRecord,
        startDate: mappedStart,
        logoutDate: mappedLogout,
        bedNo: initial.bedNo || initial.bed_no || initial.bed_number || "",
        referral: initial.referral || initial.referral_doctor || initial.referralDoctor || "",
        dealType: initial.dealType || initial.deal_type || "B2B",
        unit: initial.unit || "ODCOM",
        mode: initialMode,
        paymentType: initialMode,
        notifyDate: mappedNotify,
        deliveryAddress: initial.deliveryAddress || initial.delivery_address || "",
        notes: initial.notes || "",
        contactPerson: initial.contactPerson || initial.contact_person || cc?.contactPerson || cc?.contact_person || "",
        phone: initial.phone || cc?.phone || "",
        gst: initial.gst || initial.gst_number || initial.gstNumber || cc?.gst || "",
        address: initial.address || cc?.address || "",
        accessory: parsedAcc
      };
    }

    const defaultCcId = matchedUserCenter?.id || "";
    return {
      ...emptyForm,
      careCenterId: defaultCcId,
      address: matchedUserCenter?.address || "",
      phone: matchedUserCenter?.phone || loggedUser.phone || "",
      contactPerson: matchedUserCenter?.contact_person || matchedUserCenter?.contactPerson || "",
      gst: matchedUserCenter?.gst || ""
    };
  });
  
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const modalCurrentStatus = useMemo(() => {
    return getCalculatedStatus(form.startDate, form.logoutDate, form.status);
  }, [form.startDate, form.logoutDate, form.status]);

  const handleCareCenterChange = (id) => {
    if (id === "other") {
      set({ careCenterId: "other", address: "", contactPerson: "", phone: "", gst: "" });
    } else {
      const cc = careCenters.find((c) => c.id === id);
      set({ careCenterId: id, address: cc?.address || "", contactPerson: cc?.contactPerson || cc?.contact_person || "", phone: cc?.phone || "", gst: cc?.gst || "" });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.careCenterId) e.careCenterId = "Please select a care center.";
    if (!form.equipmentId) e.equipmentId = "Please select equipment.";
    if (!form.quantity || Number(form.quantity) < 1) e.quantity = "Quantity must be at least 1.";
    if (!form.patientName) e.patientName = "Patient name is required.";
    if (!form.startDate) e.startDate = "Login date is required.";
    if (!form.logoutDate) e.logoutDate = "Logout date is required.";
    if (form.paymentType === "Prepaid" && !form.notifyDate) e.notifyDate = "Notify date is mandatory for Prepaid requisitions.";
    if (!form.deliveryAddress) e.deliveryAddress = "Delivery address is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (readOnly) return onClose();
    if (!validate()) {
      toast.error("Please fill all required fields correctly."); 
      return;
    }
    const equipment = equipmentCatalog.find((eq) => eq.id === form.equipmentId);
    let careCenterName = isCareCenterUser ? (matchedUserCenter?.name || loggedUser.careCenterName || loggedUser.name || "") : "Other";
    if (form.careCenterId !== "other" && !isCareCenterUser) {
      careCenterName = careCenters.find((c) => c.id === form.careCenterId)?.name || "";
    }
    onSubmit({ 
      ...form, 
      id: initial?.id,
      equipmentName: equipment?.name || form.equipmentId, 
      category: equipment?.category || "General", 
      careCenterName, 
      status: form.status || "Pending", 
      deliveryStatus: form.deliveryStatus || "Pending Dispatch" 
    });
  };

  const titles = { add: "New Log Requisition", edit: "Edit Requisition", view: "Requisition Details" };

  const activeEquipment = useMemo(() => filterActive(equipmentCatalog), [equipmentCatalog]);
  const activeReferrals = useMemo(() => filterActive(references), [references]);
  const activeCategories = useMemo(() => filterActive(categories).map(getOptionLabel).filter(Boolean), [categories]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:items-center sm:p-4">
      <div className="fade-slide-up flex w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-black/5 sm:rounded-2xl" style={{ maxHeight: "92vh" }}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-teal-50/70 via-white to-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/30"><ClipboardList className="h-4.5 w-4.5" /></div>
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-slate-800">{titles[modalMode]}</h2>
              {initial?.id && <p className="text-xs font-medium text-slate-400">{initial.id}</p>}
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>

        <div className="smooth-scroll min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><Building2 className="h-3.5 w-3.5" /> Care Center</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Select Care Center" required error={errors.careCenterId}>
                  <Select disabled={readOnly} value={form.careCenterId} error={errors.careCenterId} onChange={(e) => handleCareCenterChange(e.target.value)}>
                    {!isCareCenterUser && <option value="">Choose a care center…</option>}
                    {modalDropdownCareCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    {!isCareCenterUser && <option value="other">Other (Add New)</option>}
                  </Select>
                </Field>
              </div>
              <Field label="Contact Person / Doctor"><TextInput disabled={readOnly} value={form.contactPerson} onChange={(e) => set({ contactPerson: e.target.value })} placeholder="Enter name" /></Field>
              <Field label="Phone"><TextInput disabled={readOnly} value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="Enter phone" /></Field>
              <Field label="GST / ID Number"><TextInput disabled={readOnly} value={form.gst || form.gst_number || form.gstNumber || ""} onChange={(e) => set({ gst: e.target.value })} placeholder="Enter GST/ID" /></Field>
              <Field label="Address"><TextInput disabled={readOnly} value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="Enter full address" /></Field>
              
              <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                <Field label="Bed No"><TextInput disabled={readOnly} value={form.bedNo || form.bed_number || form.bedNumber || ""} onChange={(e) => set({ bedNo: e.target.value, bed_number: e.target.value })} /></Field>
                <Field label="Referral">
                  <Select disabled={readOnly} value={form.referral || form.referral_doctor || form.referralDoctor || ""} onChange={(e) => set({ referral: e.target.value, referral_doctor: e.target.value })}>
                    <option value="">-- Select Referral --</option>
                    {activeReferrals.map((r) => (
                      <option key={r.id} value={r.doctorName || r.name}>
                        {r.doctorName || r.name} {r.domain ? `(${r.domain})` : ""}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />
          
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><Tag className="h-3.5 w-3.5" /> Record Types</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Deal Type"><Select disabled={readOnly} value={form.dealType} onChange={(e) => set({ dealType: e.target.value })}>{DEAL_TYPE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}</Select></Field>
              <Field label="Unit"><Select disabled={readOnly} value={form.unit} onChange={(e) => set({ unit: e.target.value })}>{UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}</Select></Field>
              <Field label="Mode"><Select disabled={readOnly} value={form.mode} onChange={(e) => set({ mode: e.target.value, paymentType: e.target.value })}>{MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><User className="h-3.5 w-3.5" /> Patient</p>
            <Field label="Patient Name" required error={errors.patientName}>
              <TextInput disabled={readOnly} value={form.patientName} error={errors.patientName} placeholder="Full name of the patient" onChange={(e) => set({ patientName: e.target.value })} />
            </Field>
          </div>

          <div className="border-t border-slate-100" />

          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><ClipboardList className="h-3.5 w-3.5" /> Equipment Details</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Equipment" required error={errors.equipmentId}>
                  <Select disabled={readOnly} value={form.equipmentId} error={errors.equipmentId} onChange={(e) => set({ equipmentId: e.target.value })}>
                    <option value="">Select equipment…</option>
                    {activeEquipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.name} — ₹{eq.dailyRate}/day</option>)}
                  </Select>
                </Field>
              </div>
              
              <div className="sm:col-span-2">
                <Field label="Select Accessory" error={errors.accessory}>
                  <MultiSelect
                    options={activeCategories}
                    selected={form.accessory}
                    onChange={(newAccessories) => set({ accessory: newAccessories })}
                    placeholder="-- Choose Accessories --"
                    error={errors.accessory}
                    disabled={readOnly}
                  />
                </Field>
              </div>

              <Field label="Quantity" required error={errors.quantity}>
                <TextInput disabled={readOnly} type="number" min={1} value={form.quantity} error={errors.quantity} onChange={(e) => set({ quantity: e.target.value })} />
              </Field>
              <Field label="Login Date (Rental Start)" required error={errors.startDate}>
                <TextInput disabled={readOnly} type="date" value={form.startDate} error={errors.startDate} onChange={(e) => set({ startDate: e.target.value })} />
              </Field>
              <Field label="Logout Date (Return)" required error={errors.logoutDate}>
                <TextInput 
                  disabled={readOnly} 
                  type="date" 
                  value={form.logoutDate || ""} 
                  error={errors.logoutDate} 
                  onChange={(e) => set({ logoutDate: e.target.value, logout_date: e.target.value })} 
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Delivery Address" required error={errors.deliveryAddress}>
                  <TextInput disabled={readOnly} value={form.deliveryAddress} error={errors.deliveryAddress} placeholder="Where should the equipment be delivered?" onChange={(e) => set({ deliveryAddress: e.target.value })} />
                </Field>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600"><CreditCard className="h-3.5 w-3.5" /> Payment</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Payment Type</label>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  {PAYMENT_TYPES.map((pt) => (
                    <button key={pt} type="button" disabled={readOnly} onClick={() => set({ paymentType: pt, mode: pt })} className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${form.paymentType === pt ? "bg-white text-teal-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Notify Date" required={form.paymentType === "Prepaid"} error={errors.notifyDate} hint={form.paymentType === "Postpaid" ? "Optional for postpaid requisitions" : "Required — customer will be notified on this date"}>
                <TextInput disabled={readOnly} type="date" value={form.notifyDate} error={errors.notifyDate} onChange={(e) => set({ notifyDate: e.target.value })} />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Current Status</p>
                <p className="text-sm font-bold text-slate-800">{modalCurrentStatus}</p>
              </div>

              {modalCurrentStatus === "Returned" ? (
                <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  ✓ Unit Returned
                </span>
              ) : (
                !readOnly && (
                  <button
                    type="button"
                    onClick={() => set({ status: "Returned", requisition_status: "Returned", return_status: "Returned" })}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 cursor-pointer"
                  >
                    <PackageCheck className="h-4 w-4" /> Mark as Returned
                  </button>
                )
              )}
            </div>
          </div>

          <Field label="Notes">
            <textarea disabled={readOnly} rows={2} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Any additional instructions…" className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <GhostButton onClick={onClose}>{readOnly ? "Close" : "Cancel"}</GhostButton>
          {!readOnly && (
            <PrimaryButton onClick={handleSubmit}>
              <Save className="h-4 w-4" /> {modalMode === "add" ? "Create Requisition" : "Save Changes"}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, children }) {
  return (
    <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-teal-50 text-teal-600"><Icon className="h-3.5 w-3.5" /></span>
      {children}
    </p>
  );
}

function NewRequisitionPage({ careCenters, equipmentCatalog, references = [], categories = [], onCancel, onSubmit }) {
  const loggedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
  const isCareCenterUser = loggedUser?.role === "care_center";

  const matchedUserCenter = useMemo(() => {
    if (!isCareCenterUser) return null;
    return careCenters.find((c) => 
      c.id === loggedUser.careCenterId || 
      c.id === loggedUser.id || 
      (c.phone && loggedUser.phone && String(c.phone).replace(/\D/g, "").slice(-10) === String(loggedUser.phone).replace(/\D/g, "").slice(-10)) ||
      (c.name && loggedUser.name && c.name.trim().toLowerCase() === loggedUser.name.trim().toLowerCase())
    ) || {
      id: loggedUser.careCenterId || loggedUser.id || "CC-ME",
      name: loggedUser.careCenterName || loggedUser.name || "My Care Center"
    };
  }, [careCenters, isCareCenterUser, loggedUser]);

  const pageDropdownCareCenters = useMemo(() => {
    if (isCareCenterUser && matchedUserCenter) {
      return [matchedUserCenter];
    }
    return filterActive(careCenters);
  }, [careCenters, isCareCenterUser, matchedUserCenter]);

  const [form, setForm] = useState(() => {
    const defaultCcId = matchedUserCenter?.id || "";
    return {
      ...emptyForm,
      careCenterId: defaultCcId,
      careAddress: matchedUserCenter?.address || "",
      pocMobile: matchedUserCenter?.phone || loggedUser.phone || "",
      recordDate: todayISO(),
      loginDate: todayISO()
    };
  });

  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const activeEquipment = useMemo(() => filterActive(equipmentCatalog), [equipmentCatalog]);
  const activeReferrals = useMemo(() => filterActive(references), [references]);
  const activeCategories = useMemo(() => filterActive(categories).map(getOptionLabel).filter(Boolean), [categories]);

  const handleCareCenterChange = (id) => {
    if (id === "other") {
      set({ careCenterId: "other", careAddress: "", pocMobile: "" });
    } else {
      const cc = careCenters.find((c) => c.id === id);
      set({ 
        careCenterId: id, 
        careAddress: cc?.address || "", 
        pocMobile: cc?.phone || ""
      });
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (photos.length + newFiles.length > 10) {
      toast.error("You can upload a maximum of 10 files."); 
      return;
    }
    setPhotos((prev) => [...prev, ...newFiles].slice(0, 10));
  };

  const removeFile = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = () => {
    const e = {};
    if (!form.dealType) e.dealType = "Please select a deal type.";
    if (!form.unit) e.unit = "Please select a unit.";
    if (!form.mode) e.mode = "Please select a mode.";
    if (!form.deviceModel) e.deviceModel = "Please choose an equipment model.";
    if (!form.loginDate) e.loginDate = "Log in date is required.";
    if (!form.logoutDate) e.logoutDate = "Logout date is required to calculate total days.";
    if (!form.billingType) e.billingType = "Please select a billing type.";
    if (!form.patientName) e.patientName = "Patient name is required.";
    if (form.mode === "Prepaid" && !form.notifyDate) {
      e.notifyDate = "Notify Date is mandatory for Prepaid!";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { 
      toast.error("Please fill all required fields correctly."); 
      window.scrollTo({ top: 0, behavior: "smooth" }); 
      return; 
    }
    const equipment = equipmentCatalog.find((eq) => eq.id === form.deviceModel);
    let careCenterName = isCareCenterUser ? (matchedUserCenter?.name || loggedUser.careCenterName || loggedUser.name || "") : "Other";
    if (form.careCenterId !== "other" && !isCareCenterUser) {
      careCenterName = careCenters.find((c) => c.id === form.careCenterId)?.name || "";
    }
    onSubmit({
      ...form, 
      equipmentId: form.deviceModel, 
      equipmentName: equipment?.name || form.deviceModel, 
      category: equipment?.category || "General", 
      careCenterName, 
      quantity: 1, 
      startDate: form.loginDate, 
      paymentType: form.mode, 
      deliveryAddress: form.deliveryAddress, 
      status: "Active", 
      deliveryStatus: "Pending Dispatch", 
      photoCount: photos.length,
    });
  };

  return (
    <div className="fade-slide-up space-y-5">
      <GlobalPolish />
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onCancel} className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-teal-600 cursor-pointer"><ArrowLeft className="h-4 w-4" /> Rental Master</button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-semibold text-slate-700">Log Asset Requisition</span>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-800">Log Asset Requisition</h2>
        <div className="hidden items-center gap-2 sm:flex">
          <GhostButton onClick={onCancel}>Discard</GhostButton>
        </div>
      </div>

      <div style={{ animationDelay: "40ms" }} className="relative z-40 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
        <SectionHeading icon={Tag}>Record Types</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Deal Type" required error={errors.dealType}><Select value={form.dealType} error={errors.dealType} onChange={(e) => set({ dealType: e.target.value })}><option value="">--- Select ---</option>{DEAL_TYPE_OPTIONS.map((pt) => <option key={pt} value={pt}>{pt}</option>)}</Select></Field>
          <Field label="Unit" required error={errors.unit}><Select value={form.unit} error={errors.unit} onChange={(e) => set({ unit: e.target.value })}><option value="">--- Select ---</option>{UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}</Select></Field>
          <Field label="Payment Mode" required error={errors.mode}><Select value={form.mode} error={errors.mode} onChange={(e) => set({ mode: e.target.value, paymentType: e.target.value })}><option value="">--- Select ---</option>{MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
        </div>
      </div>

      <div style={{ animationDelay: "80ms" }} className="relative z-30 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
        <SectionHeading icon={Truck}>Asset Allocation &amp; Logistics</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Select Device Model" required error={errors.deviceModel}>
            <Select value={form.deviceModel} error={errors.deviceModel} onChange={(e) => set({ deviceModel: e.target.value })}>
              <option value="">-- Choose Equipment Model --</option>
              {activeEquipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
            </Select>
          </Field>
          
          <Field label="Select Accessory" error={errors.accessory}>
            <MultiSelect
              options={activeCategories}
              selected={form.accessory}
              onChange={(newAccessories) => set({ accessory: newAccessories })}
              placeholder="-- Choose Accessories --"
              error={errors.accessory}
            />
          </Field>

          <Field label="Record Date">
            <TextInput type="date" value={form.recordDate} onChange={(e) => set({ recordDate: e.target.value })} />
          </Field>

          <Field label="Log In Date" required error={errors.loginDate}>
            <TextInput type="date" value={form.loginDate} error={errors.loginDate} onChange={(e) => set({ loginDate: e.target.value })} />
          </Field>
          
          <Field label="Notify Date" required={form.mode === "Prepaid"} error={errors.notifyDate}>
            <TextInput type="date" value={form.notifyDate} error={errors.notifyDate} onChange={(e) => set({ notifyDate: e.target.value })} />
          </Field>
          
          <Field label="Log Out Date" required error={errors.logoutDate}>
            <TextInput type="date" value={form.logoutDate} error={errors.logoutDate} onChange={(e) => set({ logoutDate: e.target.value })} />
          </Field>
          <Field label="Recall Date"><TextInput type="date" value={form.recallDate} onChange={(e) => set({ recallDate: e.target.value })} /></Field>
        </div>
      </div>

      <div style={{ animationDelay: "120ms" }} className="relative z-20 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
        <SectionHeading icon={CreditCard}>Commercials &amp; Billing</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Billing Type" required error={errors.billingType}>
            <Select value={form.billingType} error={errors.billingType} onChange={(e) => set({ billingType: e.target.value })}>
              <option value="Daily">Daily</option>
              <option value="Fortnight">Fortnight</option>
              <option value="Monthly">Monthly</option>
            </Select>
          </Field>
          <Field label="Rental Charge (₹)"><TextInput type="number" min={0} value={form.rentalCharge} onChange={(e) => set({ rentalCharge: e.target.value })} /></Field>
          <Field label="Deposit / Advance (₹)"><TextInput type="number" min={0} value={form.depositAdvance} onChange={(e) => set({ depositAdvance: e.target.value })} /></Field>
          <Field label="Installation Charge (₹)"><TextInput type="number" min={0} value={form.installationCharge} onChange={(e) => set({ installationCharge: e.target.value })} /></Field>
        </div>
      </div>

      <div style={{ animationDelay: "160ms" }} className="relative z-10 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading icon={Building2}>Care Center Context</SectionHeading>
            <div className="space-y-4">
              <Field label="Care Center Name">
                <Select value={form.careCenterId} onChange={(e) => handleCareCenterChange(e.target.value)}>
                  {!isCareCenterUser && <option value="">-- Select Care Center --</option>}
                  {pageDropdownCareCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  {!isCareCenterUser && <option value="other">Other (Add New)</option>}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="POC Mobile"><TextInput value={form.pocMobile} onChange={(e) => set({ pocMobile: e.target.value })} /></Field>
                <Field label="Alt POC Mobile"><TextInput value={form.altPocMobile} onChange={(e) => set({ altPocMobile: e.target.value })} /></Field>
              </div>
              <Field label="Care Address"><textarea rows={2} value={form.careAddress} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none resize-none border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" onChange={(e) => set({ careAddress: e.target.value })} /></Field>
              
              <div className="grid grid-cols-2 gap-4">
                <Field label="Bed No"><TextInput value={form.bedNo} onChange={(e) => set({ bedNo: e.target.value })} /></Field>
                
                <Field label="Referral">
                  <Select value={form.referral} onChange={(e) => set({ referral: e.target.value })}>
                    <option value="">-- Select Referral --</option>
                    {activeReferrals.map((r) => (
                      <option key={r.id} value={r.doctorName || r.name}>
                        {r.doctorName || r.name} {r.domain ? `(${r.domain})` : ""}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>
          </div>
          <div>
            <SectionHeading icon={User}>Patient Identity Details</SectionHeading>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Patient Name" required error={errors.patientName}><TextInput value={form.patientName} error={errors.patientName} onChange={(e) => set({ patientName: e.target.value })} /></Field>
                <Field label="Age"><TextInput type="number" min={0} value={form.age} onChange={(e) => set({ age: e.target.value })} /></Field>
              </div>
              <Field label="Attendant Name"><TextInput value={form.attendantName} onChange={(e) => set({ attendantName: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile Number"><TextInput value={form.mobileNumber} onChange={(e) => set({ mobileNumber: e.target.value })} /></Field>
                <Field label="Alt Mobile Number"><TextInput value={form.altMobileNumber} onChange={(e) => set({ altMobileNumber: e.target.value })} /></Field>
              </div>
              <Field label="Delivery Address"><textarea rows={3} value={form.deliveryAddress} onChange={(e) => set({ deliveryAddress: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" /></Field>
            </div>
          </div>
        </div>
      </div>

      <div style={{ animationDelay: "200ms" }} className="relative z-0 rise-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 transition-shadow hover:shadow-md hover:shadow-slate-200/50">
        <Field label="Notes"><textarea rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" /></Field>
      </div>

      <div style={{ animationDelay: "240ms" }} className="rise-in rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/30">
        <Field label="Asset Handover Photo Verification (Up to 10 photos/PDFs)">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700">
                <ImagePlus className="h-4 w-4" /> Choose files
                <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={handleFileChange} />
              </label>
              <span className="text-xs font-medium text-slate-400">{photos.length} / 10 files chosen</span>
            </div>
            
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {photos.map((file, idx) => {
                  const isImage = file.type.startsWith("image/");
                  return (
                    <div key={idx} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:ring-2 hover:ring-teal-500/50">
                      {isImage ? (
                        <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-rose-50 p-1 text-center text-rose-500">
                          <FileText className="mb-1 h-6 w-6" />
                          <span className="w-full truncate text-[9px] font-semibold">{file.name}</span>
                        </div>
                      )}
                      <button type="button" onClick={() => removeFile(idx)} className="absolute right-1 top-1 hidden h-5 w-5 place-items-center rounded-full bg-rose-500 text-white shadow-md transition hover:bg-rose-600 group-hover:grid cursor-pointer">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Field>
      </div>

      <div className="mt-8 flex items-center justify-end border-t border-slate-200 pt-6 pb-4">
        <PrimaryButton onClick={handleSubmit} className="px-6 py-2.5 shadow-md hover:shadow-lg transition-all">
          <Save className="h-4.5 w-4.5" /> Save Requisition &amp; Deploy
        </PrimaryButton>
      </div>
    </div>
  );
}

export default function RentalMaster({ permissions = { canAdd: true, canEdit: true, canDelete: true }, careCenters = [], equipmentCatalog = [], references = [], categories = [] }) {
  const loggedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
  const isCareCenterUser = loggedUser?.role === "care_center";

  const matchedUserCenter = useMemo(() => {
    if (!isCareCenterUser) return null;
    const cleanUserPhone = (loggedUser?.phone || "").toString().replace(/\D/g, "").slice(-10);
    const cleanUserName = (loggedUser?.careCenterName || loggedUser?.name || "").trim().toLowerCase();

    return careCenters.find((c) => {
      const cleanCcPhone = (c.phone || "").toString().replace(/\D/g, "").slice(-10);
      const cleanCcName = (c.name || "").trim().toLowerCase();

      return (
        (c.id && loggedUser?.careCenterId && String(c.id) === String(loggedUser.careCenterId)) ||
        (c.id && loggedUser?.id && String(c.id) === String(loggedUser.id)) ||
        (cleanUserPhone && cleanCcPhone && cleanUserPhone === cleanCcPhone) ||
        (cleanUserName && cleanCcName && (cleanCcName.includes(cleanUserName) || cleanUserName.includes(cleanCcName)))
      );
    }) || {
      id: loggedUser.careCenterId || loggedUser.id || "CC-ME",
      name: loggedUser.careCenterName || loggedUser.name || "My Care Center"
    };
  }, [careCenters, isCareCenterUser, loggedUser]);

  const filterBarDropdownCareCenters = useMemo(() => {
    if (isCareCenterUser && matchedUserCenter) {
      return [matchedUserCenter];
    }
    return filterActive(careCenters);
  }, [careCenters, isCareCenterUser, matchedUserCenter]);

  const [logs, setLogs] = useState(() => {
    try {
      const cached = localStorage.getItem("cached_requisitions");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }); 

  const [loading, setLoading] = useState(() => logs.length === 0);
  
  const fetchLogs = useCallback(async () => {
    try {
      const response = await API.get(`/rental/requisitions?t=${Date.now()}`);
      setLogs(response.data || []);
      localStorage.setItem("cached_requisitions", JSON.stringify(response.data || []));
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const response = await API.get(`/rental/requisitions?t=${Date.now()}`);
        if (isMounted) {
          setLogs(response.data || []);
          localStorage.setItem("cached_requisitions", JSON.stringify(response.data || []));
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dealTypeFilter, setDealTypeFilter] = useState("All");
  const [unitFilter, setUnitFilter] = useState("All"); 
  const [modeFilter, setModeFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState(0); 
  const [careCenterFilter, setCareCenterFilter] = useState("All"); 

  const [modal, setModal] = useState(null); 
  const [calcModal, setCalcModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false);

  const scopedLogs = useMemo(() => {
    if (!isCareCenterUser) return logs;

    const myCenterId = (matchedUserCenter?.id || loggedUser.careCenterId || loggedUser.id || "").toString().trim().toLowerCase();
    const myCenterName = (matchedUserCenter?.name || loggedUser.careCenterName || loggedUser.name || "").toString().trim().toLowerCase();
    const myCenterIdNumeric = myCenterId.replace(/\D/g, "");

    return logs.filter((l) => {
      const ccId = (l.careCenterId || l.care_center_id || "").toString().trim().toLowerCase();
      const ccIdNumeric = ccId.replace(/\D/g, "");
      const ccName = (l.careCenterName || l.care_center_name || careCenters.find((c) => String(c.id) === String(ccId))?.name || ccId || "").toString().trim().toLowerCase();

      const idMatch = (ccId && myCenterId && ccId === myCenterId) || (ccIdNumeric && myCenterIdNumeric && ccIdNumeric === myCenterIdNumeric);
      const nameMatch = (ccName && myCenterName && (ccName.includes(myCenterName) || myCenterName.includes(ccName)));

      return idMatch || nameMatch;
    });
  }, [logs, isCareCenterUser, matchedUserCenter, loggedUser, careCenters]);

  const monthOptions = useMemo(() => {
    const opts = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      opts.push({ value: i, label: i === 0 ? `Current Month (${label})` : label });
    }
    return opts;
  }, []);

  const getDynamicTotalDays = (loginStr, logoutStr, monthOffset) => {
    if (!loginStr) return "—";

    const login = new Date(loginStr);
    login.setHours(0, 0, 0, 0); 

    if (logoutStr) {
      const logout = new Date(logoutStr);
      logout.setHours(0, 0, 0, 0);

      const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
      const endUtc = Date.UTC(logout.getFullYear(), logout.getMonth(), logout.getDate());

      let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1; 
      if (diffDays < 0) diffDays = 0; 

      const logoutDay = logout.getDate();
      return `${diffDays}/${logoutDay}`;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();

    let end;
    if (monthOffset === 0) {
       end = now; 
    } else {
       end = new Date(targetYear, targetMonth + 1, 0); 
    }

    if (login > end) return "—"; 

    const startUtc = Date.UTC(login.getFullYear(), login.getMonth(), login.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    const X = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
    const Y = end.getDate();

    return `${X}/${Y}`;
  };

  const filtered = useMemo(() => {
    return scopedLogs.filter((l) => {
      const ccId = l.careCenterId || l.care_center_id;
      const ccName = l.careCenterName || careCenters.find((c) => c.id === ccId)?.name || ccId || "";

      const eqId = l.equipmentId || l.equipment_id;
      const eqName = l.equipmentName || equipmentCatalog.find(e => e.id === eqId)?.name || eqId;

      const rawStatus = l.status || l.requisition_status || l.return_status;
      const currentCalcStatus = getCalculatedStatus(l.startDate || l.start_date, l.logoutDate || l.logout_date, rawStatus);
      const currentMode = l.mode || l.paymentType || l.payment_type || "";
      const currentUnit = l.unit || "";

      const matchesSearch = !search || 
        l.id.toString().toLowerCase().includes(search.toLowerCase()) || 
        (eqName || "").toLowerCase().includes(search.toLowerCase()) || 
        (l.patientName || l.patient_name || "").toLowerCase().includes(search.toLowerCase()) || 
        (ccName || "").toLowerCase().includes(search.toLowerCase());
        
      const matchesStatus = statusFilter === "All" || currentCalcStatus === statusFilter;
      const matchesDealType = dealTypeFilter === "All" || (l.dealType || l.deal_type) === dealTypeFilter;
      const matchesUnit = unitFilter === "All" || currentUnit === unitFilter;
      const matchesMode = modeFilter === "All" || currentMode === modeFilter;
      
      const matchesCareCenter = isCareCenterUser || careCenterFilter === "All" || ccId === careCenterFilter;

      return matchesSearch && matchesStatus && matchesDealType && matchesUnit && matchesMode && matchesCareCenter;
    });
  }, [scopedLogs, search, statusFilter, dealTypeFilter, unitFilter, modeFilter, careCenterFilter, careCenters, equipmentCatalog, isCareCenterUser]);

  const handleAdd = async (data) => {
    try {
      const accStr = Array.isArray(data.accessory) ? data.accessory.join(", ") : (data.accessory || "");
      const chosenMode = data.mode || data.paymentType || "Postpaid";
      
      const finalCareCenterId = isCareCenterUser 
        ? (matchedUserCenter?.id || loggedUser.careCenterId || loggedUser.id || "CC-ME")
        : (data.careCenterId === "other" ? "NEW" : (data.careCenterId || data.care_center_id));

      const finalCareCenterName = isCareCenterUser
        ? (matchedUserCenter?.name || loggedUser.careCenterName || loggedUser.name || "")
        : (data.careCenterName || "");

      const backendData = {
        id: data.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        care_center_id: finalCareCenterId,
        care_center_name: finalCareCenterName,
        equipment_id: data.equipmentId || data.deviceModel,
        patient_name: data.patientName,
        quantity: data.quantity || 1,
        start_date: data.startDate || data.loginDate, 
        logout_date: data.logoutDate || data.logout_date || data.startDate || data.loginDate, 
        bed_number: data.bedNo || data.bed_number || "", 
        referral_doctor: data.referral || data.referralDoctor || data.referral_doctor || "",         
        gst_number: data.gstNo || data.gstNumber || data.gst_number || "",
        payment_type: chosenMode,
        deal_type: data.dealType,
        unit: data.unit,
        mode: chosenMode,
        notify_date: data.notifyDate || null,
        delivery_address: data.deliveryAddress,
        notes: data.notes || "",
        accessory: accStr,
        accessories: accStr, 
        status: "Active",
        requisition_status: "Active"
      };

      await API.post("/rental/requisitions", backendData);
      await fetchLogs();
      setShowAddPage(false);
      toast.success("Requisition saved successfully!");
    } catch (err) {
      toast.error("Error saving Requisition: " + (err.response?.data?.message || err.message)); 
    }
  };

  const handleEdit = async (data) => {
    const targetStatus = data.status || data.requisition_status || data.return_status || "Active";
    const chosenMode = data.mode || data.paymentType || data.payment_type || "Postpaid";
    const accStr = Array.isArray(data.accessory) ? data.accessory.join(", ") : (data.accessory || "");

    setLogs((prevLogs) => {
      const updated = prevLogs.map((l) =>
        l.id === data.id
          ? {
              ...l,
              ...data,
              status: targetStatus,
              requisition_status: targetStatus,
              return_status: targetStatus,
              mode: chosenMode,
              paymentType: chosenMode,
              accessory: accStr,
              accessories: accStr
            }
          : l
      );
      localStorage.setItem("cached_requisitions", JSON.stringify(updated));
      return updated;
    });

    try {
      const newLogoutDate = data.logoutDate || data.logout_date || null;
      const newStartDate = data.startDate || data.start_date;
      const newNotifyDate = data.notifyDate || data.notify_date || null;

      const backendData = {
        care_center_id: data.careCenterId === "other" ? "NEW" : (data.careCenterId || data.care_center_id),
        care_center_name: data.careCenterName || data.care_center_name || "",
        equipment_id: data.equipmentId || data.equipment_id,
        patient_name: data.patientName || data.patient_name,
        quantity: data.quantity || 1,
        start_date: newStartDate,
        logout_date: newLogoutDate,
        bed_number: data.bedNo || data.bed_number || data.bedNumber || "", 
        referral_doctor: data.referral || data.referral_doctor || data.referralDoctor || "",         
        gst_number: data.gst || data.gst_number || data.gstNumber || "",
        payment_type: chosenMode,
        deal_type: data.dealType || data.deal_type,
        unit: data.unit,
        mode: chosenMode,
        notify_date: newNotifyDate,
        delivery_address: data.deliveryAddress || data.delivery_address,
        notes: data.notes || "",
        status: targetStatus,
        requisition_status: targetStatus,
        return_status: targetStatus,
        returnStatus: targetStatus,
        accessory: accStr,   
        accessories: accStr 
      };
      
      await API.put(`/rental/requisitions/${data.id}`, backendData); 
      setModal(null);
      toast.success(`Requisition updated!`); 
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.message || err.message));
      fetchLogs(); 
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/rental/requisitions/${confirmDelete.id}`);
      await fetchLogs();
      setConfirmDelete(null);
      toast.success("Requisition deleted successfully!"); 
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (showAddPage) {
    return <NewRequisitionPage careCenters={careCenters} equipmentCatalog={equipmentCatalog} references={references} categories={categories} onCancel={() => setShowAddPage(false)} onSubmit={handleAdd} />;
  }

  return (
    <div className="space-y-5">
      <GlobalPolish />
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800">Rental Master Sheet</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Live view &amp; allocation of equipment requisitions</p>
        </div>

        {permissions.canAdd && (
          <PrimaryButton onClick={() => setShowAddPage(true)} className="shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] px-4.5 py-2.5">
            <Plus className="h-4 w-4" /> New Log Requisition
          </PrimaryButton>
        )}
      </div>

      <KpiCards logs={scopedLogs} />
      
      <div style={{ animationDelay: "80ms" }} className="rise-in rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm shadow-slate-200/40">
        <div className="flex flex-wrap items-center gap-2.5 w-full">
          
          <div className="group relative flex-[2] min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-500" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              autoComplete="off"
              placeholder="Search by ID, patient, device, care center…" 
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20" 
            />
          </div>

          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400 hidden sm:block" />
          
          <div className="relative group flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-teal-50 transition cursor-pointer shrink-0 shadow-2xs" title="Filter by Month">
            <Calendar className="h-4 w-4 text-slate-500 group-hover:text-teal-600" />
            <select value={monthFilter} onChange={(e) => setMonthFilter(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Care Center Dropdown: Super Admin sees All + List, Care Center sees ONLY their Center */}
          <select 
            value={careCenterFilter} 
            onChange={(e) => setCareCenterFilter(e.target.value)} 
            className="flex-1 min-w-[130px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer"
          >
            {!isCareCenterUser && <option value="All">All Care Centers</option>}
            {filterBarDropdownCareCenters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
            <option value="All">All Status</option>
            {RENTAL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <select value={dealTypeFilter} onChange={(e) => setDealTypeFilter(e.target.value)} className="flex-1 min-w-[115px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
            <option value="All">All Deal Types</option>
            {DEAL_TYPE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
            <option value="All">All Units</option>
            {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>

          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
            <option value="All">All Modes</option>
            {MODE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <button 
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setDealTypeFilter("All");
              setUnitFilter("All");
              setModeFilter("All");
              setCareCenterFilter("All");
              setMonthFilter(0);
              toast.success("Filters reset");
            }}
            title="Reset all filters"
            className="flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div style={{ animationDelay: "140ms" }} className="rise-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="smooth-scroll-x overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/90 text-xs font-bold uppercase tracking-wide text-slate-400 backdrop-blur">
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">Patients</th>
                <th className="px-5 py-3">Login Date</th>
                <th className="px-5 py-3">Logout Date</th>
                <th className="px-5 py-3">Total Days</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && filtered.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-28 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-24 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-10 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md ml-auto"></div></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100"><Search className="h-5 w-5 text-slate-400" /></div>
                    <p className="mt-3 text-sm font-semibold text-slate-500">No requisitions match your filters</p>
                    <p className="text-xs text-slate-400">Try adjusting the search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log, i) => {
                  const actualLogoutDate = log.logoutDate || log.logout_date;
                  const dynamicDays = getDynamicTotalDays(log.startDate || log.start_date, actualLogoutDate, monthFilter);
                  const rawStatus = log.status || log.requisition_status || log.return_status;
                  const currentStatus = getCalculatedStatus(log.startDate || log.start_date, actualLogoutDate, rawStatus);
                  const currentMode = log.mode || log.paymentType || log.payment_type || "Postpaid";

                  const rowColor = currentMode === "Prepaid" 
                    ? "bg-emerald-50/70 hover:bg-emerald-100" 
                    : currentMode === "Postpaid" 
                    ? "bg-rose-50/70 hover:bg-rose-100"       
                    : "hover:bg-teal-50/40";                  

                  const eqId = log.equipmentId || log.equipment_id;
                  let actualDevice = eqId || log.equipmentName || "—";
                  
                  const catMatch = equipmentCatalog.find(e => e.id === eqId);
                  if (catMatch) actualDevice = catMatch.name;

                  return (
                    <tr 
                      key={log.id} 
                      style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }} 
                      className={`rise-in group/row relative transition-colors duration-150 ${rowColor}`}
                    >
                      <td className="relative px-5 py-3.5">
                        <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 bg-teal-500 transition-all duration-200 group-hover/row:h-6" />
                        <StatusBadge status={currentStatus} glow={currentStatus === "Active"} />
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">
                        {actualDevice}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{log.patientName || log.patient_name || "—"}</td>
                      <td className="px-5 py-3.5 text-slate-600">{formatDateShort(log.startDate || log.start_date)}</td>
                      <td className="px-5 py-3.5 text-slate-600">{actualLogoutDate ? formatDateShort(actualLogoutDate) : "—"}</td>
                      
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-700 bg-slate-50/50 border border-slate-200/60 px-2 py-1 rounded-md shadow-sm">{dynamicDays}</span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          
                          <IconAction 
                            title="Calculate Total Days" 
                            tone="amber" 
                            onClick={() => setCalcModal(log)}
                          >
                            <Calculator className="h-4 w-4 text-amber-600" />
                          </IconAction>

                          {currentStatus !== "Returned" && (
                            <IconAction 
                              title="Mark as Returned" 
                              tone="teal" 
                              onClick={() => handleEdit({ ...log, status: "Returned", requisition_status: "Returned", return_status: "Returned" })}
                            >
                              <PackageCheck className="h-4 w-4 text-emerald-600" />
                            </IconAction>
                          )}

                          <IconAction title="View" tone="teal" onClick={() => setModal({ mode: "view", data: log })}><Eye className="h-4 w-4" /></IconAction>
                          {permissions.canEdit && <IconAction title="Edit" tone="teal" onClick={() => setModal({ mode: "edit", data: log })}><Pencil className="h-4 w-4" /></IconAction>}
                          {permissions.canDelete && <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete(log)}><Trash2 className="h-4 w-4" /></IconAction>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-5 py-3 text-xs text-slate-400">
          <span>Showing {filtered.length} of {scopedLogs.length} requisitions</span>
          <span className="hidden sm:inline">Chikitsa · Live data</span>
        </div>
      </div>

      {calcModal && (
        <CalculateTotalDaysModal 
          log={calcModal} 
          equipmentCatalog={equipmentCatalog}
          onClose={() => setCalcModal(null)} 
        />
      )}

      {modal && (
        <RequisitionModal 
          mode={modal.mode} 
          initial={modal.data} 
          careCenters={careCenters} 
          equipmentCatalog={equipmentCatalog} 
          references={references} 
          categories={categories} 
          onClose={() => setModal(null)} 
          onSubmit={modal.mode === "add" ? handleAdd : handleEdit} 
        />
      )}

      <ConfirmDialog open={!!confirmDelete} title="Delete this requisition?" message={confirmDelete ? `${confirmDelete.id} will be permanently removed. This cannot be undone.` : ""} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} />
    </div>
  );
}