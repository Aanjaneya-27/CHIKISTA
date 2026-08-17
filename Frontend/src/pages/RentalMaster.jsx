// import { useState, useEffect, useMemo, useCallback } from "react";
// import { 
//   Search, 
//   SlidersHorizontal, 
//   Plus, 
//   Eye, 
//   Pencil, 
//   Trash2, 
//   PackageCheck, 
//   Clock, 
//   Activity, 
//   AlertTriangle, 
//   Building2, 
//   User, 
//   Tag, 
//   CreditCard, 
//   Save, 
//   X, 
//   ArrowLeft, 
//   ChevronRight, 
//   ImagePlus, 
//   Truck, 
//   FileText, 
//   ChevronDown, 
//   Calculator,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   Phone
// } from "lucide-react";
// import { 
//   PrimaryButton, 
//   GhostButton, 
//   IconAction, 
//   ConfirmDialog, 
//   Field, 
//   Select, 
//   TextInput, 
//   toast 
// } from "../components/UiComponents";
// import { 
//   DEAL_TYPE_OPTIONS, 
//   MODE_OPTIONS, 
//   UNIT_OPTIONS 
// } from "../data/MockData";
// import { todayISO } from "../utils/Helper";
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

// // 📅 Timezone-Safe Date Formatters
// const formatForDateInput = (d) => {
//   if (!d || d === "null" || d === "undefined" || d === "0000-00-00" || String(d).trim() === "") return "";
//   const str = String(d).trim();
//   const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
//   if (match && !match[0].startsWith("0000")) return match[0];
//   try {
//     const dt = new Date(d);
//     if (!isNaN(dt.getTime()) && dt.getFullYear() >= 2000) {
//       const year = dt.getFullYear();
//       const month = String(dt.getMonth() + 1).padStart(2, "0");
//       const day = String(dt.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     }
//   } catch {
//     return "";
//   }
//   return "";
// };

// const formatDisplayDate = (d) => {
//   const clean = formatForDateInput(d);
//   if (!clean) return "—";
//   const [y, m, day] = clean.split("-");
//   return `${day}/${m}/${y}`;
// };

// const getNextDayISO = (dateStr) => {
//   const clean = formatForDateInput(dateStr);
//   if (!clean) return "";
//   const [y, m, d] = clean.split("-").map(Number);
//   const dt = new Date(Date.UTC(y, m - 1, d + 1));
//   return dt.toISOString().split("T")[0];
// };

// const calculateDaysCount = (startStr, endStr) => {
//   const s = formatForDateInput(startStr);
//   if (!s) return 0;
//   const e = formatForDateInput(endStr) || formatForDateInput(new Date());
//   if (!e) return 0;

//   const [sY, sM, sD] = s.split("-").map(Number);
//   const [eY, eM, eD] = e.split("-").map(Number);

//   const startUtc = Date.UTC(sY, sM - 1, sD);
//   const endUtc = Date.UTC(eY, eM - 1, eD);

//   const diff = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
//   return diff > 0 ? diff : 1;
// };

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
//     const st = String(item.status || item.state || "").trim().toLowerCase();
//     if (st === "inactive" || st === "disabled" || item.is_active === 0 || item.isActive === false) {
//       return false;
//     }
//     return true;
//   });
// };

// const getSafeTime = (item, field) => {
//   if (!item) return 0;
//   const raw = field === "logoutDate" 
//     ? (item.logoutDate || item.logout_date) 
//     : (item.startDate || item.start_date || item.loginDate);
//   const clean = formatForDateInput(raw);
//   if (!clean) return 0;
//   const t = new Date(clean).getTime();
//   return isNaN(t) ? 0 : t;
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
//         className={`flex min-h-[42px] w-full flex-wrap items-center justify-between gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-all ${
//           error ? "border-rose-300 ring-4 ring-rose-500/10" : "border-slate-200 hover:border-teal-300 focus:border-teal-500"
//         } ${disabled ? "bg-slate-50 cursor-not-allowed opacity-70" : "cursor-pointer"}`}
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
//         <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
//       </div>

//       {isOpen && !disabled && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
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
//                     className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-teal-50 ${
//                       isSel ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700"
//                     }`}
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

// function KpiCards({ logs = [] }) {
//   const today = todayISO();
//   const countActive = logs.filter((l) => {
//     const cleanOut = formatForDateInput(l?.logoutDate || l?.logout_date);
//     return !cleanOut || cleanOut > today;
//   }).length;

//   const countClosed = logs.filter((l) => {
//     const cleanOut = formatForDateInput(l?.logoutDate || l?.logout_date);
//     return Boolean(cleanOut && cleanOut <= today);
//   }).length;

//   const countInactive = logs.filter((l) => String(l?.status || "").toLowerCase() === "inactive").length;

//   const cards = [
//     { label: "Active Rentals", value: countActive, icon: Activity, tone: "teal" },
//     { label: "Closed", value: countClosed, icon: PackageCheck, tone: "slate" },
//     { label: "Inactive Rentals", value: countInactive, icon: AlertTriangle, tone: "rose" },
//     { label: "Total Requisitions", value: logs.length, icon: Clock, tone: "amber" },
//   ];

//   const toneMap = {
//     teal: { chip: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30", bar: "from-teal-400 to-teal-600", glow: "bg-teal-400/10" },
//     slate: { chip: "bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-slate-500/30", bar: "from-slate-400 to-slate-600", glow: "bg-slate-400/10" },
//     rose: { chip: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/30", bar: "from-rose-400 to-rose-600", glow: "bg-rose-400/10" },
//     amber: { chip: "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-500/30", bar: "from-amber-300 to-amber-500", glow: "bg-amber-400/10" },
//   };

//   return (
//     <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//       {cards.map((c, i) => {
//         const Icon = c.icon;
//         const t = toneMap[c.tone];
//         return (
//           <div 
//             key={c.label} 
//             style={{ animationDelay: `${i * 60}ms` }} 
//             className="rise-in group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5"
//           >
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

// function CalculateTotalDaysModal({ log, equipmentCatalog = [], onClose }) {
//   const isQuick = !log || log?.isQuickCalc;
//   const [tempLoginDate, setTempLoginDate] = useState(() => formatForDateInput(log?.startDate || log?.start_date || log?.loginDate) || todayISO());
//   const [tempLogoutDate, setTempLogoutDate] = useState(() => formatForDateInput(log?.logoutDate || log?.logout_date) || "");
//   const [dailyRate, setDailyRate] = useState(() => Number(log?.rentalCharge ?? log?.rental_charge ?? 0));
//   const [installation, setInstallation] = useState(() => Number(log?.installationCharge ?? log?.installation_charge ?? 0));
//   const [deposit, setDeposit] = useState(() => Number(log?.depositAdvance ?? log?.deposit_advance ?? 0));

//   const eqId = log?.equipmentId || log?.equipment_id;
//   const eqName = equipmentCatalog.find(e => e?.id === eqId)?.name || log?.equipmentName || (isQuick ? "Live Estimator" : "Medical Device");
//   const patientName = log?.patientName || log?.patient_name || (isQuick ? "Instant Calculation" : "Patient");

//   const totalDays = useMemo(() => {
//     return calculateDaysCount(tempLoginDate, tempLogoutDate);
//   }, [tempLoginDate, tempLogoutDate]);

//   const baseRental = useMemo(() => totalDays * Number(dailyRate || 0), [totalDays, dailyRate]);
//   const grandTotal = useMemo(() => baseRental + Number(installation || 0) - Number(deposit || 0), [baseRental, installation, deposit]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
//       <div className="fade-slide-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
//         <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
//           <div>
//             <h3 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
//               <Calculator className="h-4.5 w-4.5 text-teal-600" />
//               {isQuick ? "Live Rental & Days Calculator" : "Requisition Commercial Calculator"}
//             </h3>
//             <p className="text-xs text-slate-400 mt-0.5">{patientName} • {eqName}</p>
//           </div>
//           <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                 Log In Date (Start)
//               </label>
//               <input 
//                 type="date" 
//                 value={tempLoginDate} 
//                 onChange={(e) => setTempLoginDate(e.target.value)} 
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" 
//               />
//             </div>

//             <div>
//               <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                 Log Out Date (End - Optional)
//               </label>
//               <input 
//                 type="date" 
//                 value={tempLogoutDate} 
//                 min={tempLoginDate}
//                 onChange={(e) => setTempLogoutDate(e.target.value)} 
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" 
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-3 pt-2">
//             <div>
//               <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                 Daily Rate (₹)
//               </label>
//               <input 
//                 type="number" 
//                 min={0}
//                 value={dailyRate} 
//                 onChange={(e) => setDailyRate(e.target.value)} 
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500" 
//               />
//             </div>
//             <div>
//               <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                 Install Fee (₹)
//               </label>
//               <input 
//                 type="number" 
//                 min={0}
//                 value={installation} 
//                 onChange={(e) => setInstallation(e.target.value)} 
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500" 
//               />
//             </div>
//             <div>
//               <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                 Advance Dep (₹)
//               </label>
//               <input 
//                 type="number" 
//                 min={0}
//                 value={deposit} 
//                 onChange={(e) => setDeposit(e.target.value)} 
//                 className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500" 
//               />
//             </div>
//           </div>

//           <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4 space-y-2.5">
//             <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
//               <span>Total Billable Days:</span>
//               <span className="font-bold text-teal-800 text-sm">{totalDays} Days</span>
//             </div>
//             <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
//               <span>Base Rent ({totalDays} × ₹{dailyRate}):</span>
//               <span>₹{baseRental}</span>
//             </div>
//             {Number(installation) > 0 && (
//               <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
//                 <span>Installation Fee (+):</span>
//                 <span>+₹{installation}</span>
//               </div>
//             )}
//             {Number(deposit) > 0 && (
//               <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
//                 <span>Advance Deposit Paid (-):</span>
//                 <span>-₹{deposit}</span>
//               </div>
//             )}
//             <div className="border-t border-teal-200/80 pt-2 flex items-center justify-between font-bold text-slate-800 text-base">
//               <span>Estimated Net Balance:</span>
//               <span className="text-teal-700">₹{grandTotal}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
//           <button 
//             type="button" 
//             onClick={onClose} 
//             className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 text-xs font-bold shadow-sm transition cursor-pointer"
//           >
//             Close Calculator
//           </button>
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

// function RequisitionDetailView({ log, equipmentCatalog = [], careCenters = [], onBack }) {
//   const eqId = log?.equipmentId || log?.equipment_id || log?.deviceModel;
//   const equipmentName = equipmentCatalog.find(e => String(e?.id) === String(eqId))?.name || log?.equipmentName || log?.equipment_name || eqId || "—";
  
//   const ccId = log?.careCenterId || log?.care_center_id;
//   const careCenterName = log?.careCenterName || log?.care_center_name || careCenters.find(c => String(c?.id) === String(ccId))?.name || ccId || "—";

//   const cleanLogout = formatForDateInput(log?.logoutDate || log?.logout_date);
//   const today = todayISO();
//   const isCurrentlyActive = !cleanLogout || cleanLogout > today;
//   const statusLabel = isCurrentlyActive ? "Active" : "Closed";

//   const statusColor = isCurrentlyActive
//     ? "bg-amber-50 text-amber-700 border-amber-200"
//     : "bg-emerald-50 text-emerald-700 border-emerald-200";

//   const billingTypeVal = log?.billingType || log?.billing_type || "Daily";
//   const rentalChargeVal = log?.rentalCharge ?? log?.rental_charge ?? 0;
//   const depositAdvanceVal = log?.depositAdvance ?? log?.deposit_advance ?? 0;
//   const installationChargeVal = log?.installationCharge ?? log?.installation_charge ?? 0;

//   const totalDays = calculateDaysCount(log?.startDate || log?.start_date || log?.loginDate, cleanLogout);

//   return (
//     <div className="fade-slide-up space-y-6">
//       <GlobalPolish />
      
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2.5">
//             <span className="text-2xl">🔍</span>
//             <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-800">
//               Requisition Record: #{log?.id || "—"}
//             </h1>
//           </div>
//           <p className="text-xs font-bold tracking-wider text-slate-400 mt-1 uppercase">
//             STATUS: <span className="text-teal-600">{statusLabel}</span> • DURATION: {totalDays} DAYS
//           </p>
//         </div>

//         <button 
//           type="button"
//           onClick={onBack}
//           className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer w-fit"
//         >
//           <ArrowLeft className="h-4 w-4" /> Back to Listing
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
//             📦 Logistics &amp; Device Matrix
//           </p>
          
//           <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
//             <div>
//               <p className="text-xs font-medium text-slate-400">Assigned Model</p>
//               <p className="font-bold text-slate-800 mt-0.5">{equipmentName}</p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400">Accessory</p>
//               <p className="font-bold text-slate-800 mt-0.5">{log?.accessory || log?.accessories || "—"}</p>
//             </div>

//             <div>
//               <p className="text-xs font-medium text-slate-400">Deal Type</p>
//               <p className="font-bold text-slate-800 mt-0.5">{log?.dealType || log?.deal_type || "B2B"}</p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400">Unit</p>
//               <p className="font-bold text-slate-800 mt-0.5">{log?.unit || "ODCOM"}</p>
//             </div>

//             <div>
//               <p className="text-xs font-medium text-slate-400">Mode</p>
//               <p className="font-bold text-slate-800 mt-0.5">{log?.mode || log?.paymentType || "Postpaid"}</p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400">Log In Date</p>
//               <p className="font-bold text-slate-800 mt-0.5">
//                 {formatDisplayDate(log?.startDate || log?.start_date || log?.loginDate)}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-medium text-slate-400">Log Out Date</p>
//               <p className="font-bold text-slate-800 mt-0.5">
//                 {formatDisplayDate(cleanLogout)}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400">Recall Date</p>
//               <p className="font-bold text-slate-800 mt-0.5">
//                 {formatDisplayDate(log?.recallDate || log?.recall_date)}
//               </p>
//             </div>

//             <div className="col-span-2 pt-1">
//               <p className="text-xs font-medium text-slate-400 mb-1">Status</p>
//               <span className={`inline-block rounded-md px-3 py-1 text-xs font-bold border ${statusColor}`}>
//                 {statusLabel}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
//             💳 Commercial Parameters
//           </p>

//           <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
//             <div>
//               <p className="text-xs font-medium text-slate-400">Billing Type</p>
//               <p className="font-extrabold text-teal-600 uppercase mt-0.5">
//                 {billingTypeVal}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400">Rental Charge</p>
//               <p className="font-extrabold text-slate-800 mt-0.5">
//                 ₹{rentalChargeVal}/day
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-medium text-slate-400">Deposit / Advance</p>
//               <p className="font-extrabold text-slate-800 mt-0.5">
//                 ₹{depositAdvanceVal}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-slate-400">Installation Charge</p>
//               <p className="font-extrabold text-slate-800 mt-0.5">
//                 ₹{installationChargeVal}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
//             👤 Patient Identity Details
//           </p>

//           <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
//             <div><p className="text-xs font-medium text-slate-400">Patient Name:</p></div>
//             <div><p className="font-bold text-slate-800">{log?.patientName || log?.patient_name || "—"}</p></div>

//             <div><p className="text-xs font-medium text-slate-400">Mobile:</p></div>
//             <div><p className="font-bold text-slate-800">{log?.mobileNumber || log?.mobile_number || "—"}</p></div>

//             <div><p className="text-xs font-medium text-slate-400">Attendant:</p></div>
//             <div><p className="font-bold text-slate-800">{log?.attendantName || log?.attendant_name || "—"}</p></div>

//             <div className="col-span-2 pt-2">
//               <p className="text-xs font-medium text-slate-400 mb-1.5">Delivery Address:</p>
//               <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-medium text-slate-700">
//                 {log?.deliveryAddress || log?.delivery_address || "—"}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
//             🏥 Care Center Context
//           </p>

//           <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
//             <div><p className="text-xs font-medium text-slate-400">Care Center:</p></div>
//             <div><p className="font-bold text-slate-800">{careCenterName}</p></div>

//             <div><p className="text-xs font-medium text-slate-400">Incharge Mobile:</p></div>
//             <div><p className="font-bold text-slate-800">{log?.inchargeMobile || log?.incharge_mobile || log?.phone || "—"}</p></div>

//             <div><p className="text-xs font-medium text-slate-400">Bed No:</p></div>
//             <div><p className="font-bold text-slate-800">{log?.bedNumber || log?.bed_number || log?.bedNo || "—"}</p></div>

//             <div className="col-span-2 pt-2">
//               <p className="text-xs font-medium text-slate-400 mb-1.5">Care Address:</p>
//               <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-medium text-slate-700">
//                 {log?.careAddress || log?.care_address || log?.address || "—"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RequisitionFormPage({ initial = null, mode = "add", careCenters = [], equipmentCatalog = [], references = [], categories = [], onCancel, onSubmit }) {
//   const isEdit = mode === "edit";

//   const loggedUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);
//   const isCareCenterUser = loggedUser?.role === "care_center";

//   const matchedUserCenter = useMemo(() => {
//     if (!isCareCenterUser) return null;
//     return careCenters.find((c) => 
//       c?.id === loggedUser?.careCenterId || 
//       c?.id === loggedUser?.id || 
//       (c?.phone && loggedUser?.phone && String(c.phone).replace(/\D/g, "").slice(-10) === String(loggedUser.phone).replace(/\D/g, "").slice(-10)) ||
//       (c?.name && loggedUser?.name && c.name.trim().toLowerCase() === loggedUser.name.trim().toLowerCase())
//     ) || {
//       id: loggedUser?.careCenterId || loggedUser?.id || "CC-ME",
//       name: loggedUser?.careCenterName || loggedUser?.name || "My Care Center"
//     };
//   }, [careCenters, isCareCenterUser, loggedUser]);

//   const pageDropdownCareCenters = useMemo(() => {
//     if (isCareCenterUser && matchedUserCenter) {
//       return [matchedUserCenter];
//     }
//     return filterActive(careCenters);
//   }, [careCenters, isCareCenterUser, matchedUserCenter]);

//   const [form, setForm] = useState(() => {
//     if (initial) {
//       const rawAcc = initial.accessory || initial.accessories;
//       let parsedAcc = [];
//       if (Array.isArray(rawAcc)) {
//         parsedAcc = rawAcc.map(getOptionLabel).filter(Boolean);
//       } else if (typeof rawAcc === "string" && rawAcc.trim() !== "") {
//         parsedAcc = rawAcc.split(",").map(item => item.trim()).filter(Boolean);
//       }

//       const ccId = initial.careCenterId || initial.care_center_id || "";
//       const cc = careCenters.find((c) => c?.id === ccId);
//       const parsedLogoutDate = formatForDateInput(initial.logoutDate || initial.logout_date);

//       return {
//         id: initial.id || null,
//         dealType: initial.dealType || initial.deal_type || "B2B",
//         unit: initial.unit || "ODCOM",
//         mode: initial.mode || initial.paymentType || initial.payment_type || "Postpaid",
//         deviceModel: initial.equipmentId || initial.equipment_id || initial.deviceModel || "",
//         accessory: parsedAcc,
//         recordDate: formatForDateInput(initial.recordDate || initial.record_date) || todayISO(),
//         loginDate: formatForDateInput(initial.startDate || initial.start_date || initial.loginDate) || todayISO(),
//         notifyDate: formatForDateInput(initial.notifyDate || initial.notify_date) || "",
//         logoutDate: parsedLogoutDate || "",
//         recallDate: formatForDateInput(initial.recallDate || initial.recall_date) || "",
//         billingType: initial.billingType || initial.billing_type || "Daily",
//         rentalCharge: initial.rentalCharge ?? initial.rental_charge ?? "",
//         depositAdvance: initial.depositAdvance ?? initial.deposit_advance ?? "",
//         installationCharge: initial.installationCharge ?? initial.installation_charge ?? "",
//         careCenterId: ccId || matchedUserCenter?.id || "",
//         inchargeMobile: initial.inchargeMobile || initial.incharge_mobile || initial.phone || cc?.phone || "",
//         altMobile: initial.altMobile || initial.alt_mobile || "",
//         careAddress: initial.careAddress || initial.care_address || initial.address || cc?.address || "",
//         bedNo: initial.bedNumber || initial.bed_number || initial.bedNo || "",
//         referral: initial.referralDoctor || initial.referral_doctor || initial.referral || "",
//         patientName: initial.patientName || initial.patient_name || "",
//         age: initial.age || "",
//         attendantName: initial.attendantName || initial.attendant_name || "",
//         mobileNumber: initial.mobileNumber || initial.mobile_number || "",
//         altMobileNumber: initial.altMobileNumber || initial.alt_mobile_number || "",
//         deliveryAddress: initial.deliveryAddress || initial.delivery_address || "",
//         notes: initial.notes || ""
//       };
//     }

//     return {
//       dealType: "B2B",
//       unit: "ODCOM",
//       mode: "Postpaid",
//       deviceModel: "",
//       accessory: [],
//       recordDate: todayISO(),
//       loginDate: todayISO(),
//       notifyDate: "",
//       logoutDate: "",
//       recallDate: "",
//       billingType: "Daily",
//       rentalCharge: "",
//       depositAdvance: "",
//       installationCharge: "",
//       careCenterId: matchedUserCenter?.id || "",
//       inchargeMobile: matchedUserCenter?.phone || loggedUser?.phone || "",
//       altMobile: "",
//       careAddress: matchedUserCenter?.address || "",
//       bedNo: "",
//       referral: "",
//       patientName: "",
//       age: "",
//       attendantName: "",
//       mobileNumber: "",
//       altMobileNumber: "",
//       deliveryAddress: "",
//       notes: ""
//     };
//   });

//   const [errors, setErrors] = useState({});
//   const [photos, setPhotos] = useState([]);
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const activeEquipment = useMemo(() => filterActive(equipmentCatalog), [equipmentCatalog]);
//   const activeReferrals = useMemo(() => filterActive(references), [references]);
//   const activeCategories = useMemo(() => filterActive(categories).map(getOptionLabel).filter(Boolean), [categories]);

//   const minRecallDateAllowed = useMemo(() => {
//     if (form.logoutDate && form.logoutDate.trim() !== "") {
//       return getNextDayISO(form.logoutDate);
//     }
//     return "";
//   }, [form.logoutDate]);

//   const handleCareCenterChange = (id) => {
//     if (id === "other") {
//       set({ careCenterId: "other", careAddress: "", inchargeMobile: "", altMobile: "" });
//     } else {
//       const cc = careCenters.find((c) => c?.id === id);
//       set({ 
//         careCenterId: id, 
//         careAddress: cc?.address || "", 
//         inchargeMobile: cc?.phone || "", 
//         altMobile: ""
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
//     if (!form.billingType) e.billingType = "Please select a billing type.";
//     if (!form.patientName) e.patientName = "Patient name is required.";
    
//     if (form.mode === "Prepaid" && !form.notifyDate) {
//       e.notifyDate = "Notify Date is mandatory for Prepaid!";
//     }

//     if (form.inchargeMobile && !/^\d{10}$/.test(String(form.inchargeMobile).trim())) {
//       e.inchargeMobile = "Enter a valid 10-digit mobile number.";
//     }

//     const cleanLogIn = formatForDateInput(form.loginDate);
//     const cleanLogOut = formatForDateInput(form.logoutDate);
//     const cleanRecall = formatForDateInput(form.recallDate);

//     if (cleanLogIn && cleanLogOut && cleanLogOut < cleanLogIn) {
//       e.logoutDate = `Log Out Date cannot be before Log In Date (${formatDisplayDate(cleanLogIn)}).`;
//     }

//     if (cleanLogOut && cleanRecall && cleanRecall <= cleanLogOut) {
//       e.recallDate = `Recall Date must be after Log Out Date (at least ${formatDisplayDate(getNextDayISO(cleanLogOut))}).`;
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) { 
//       toast.error("Please fix the validation errors before saving."); 
//       window.scrollTo({ top: 0, behavior: "smooth" }); 
//       return; 
//     }

//     const equipment = equipmentCatalog.find((eq) => eq?.id === form.deviceModel);
//     let careCenterName = isCareCenterUser ? (matchedUserCenter?.name || loggedUser?.careCenterName || loggedUser?.name || "") : "Other";
//     if (form.careCenterId !== "other" && !isCareCenterUser) {
//       careCenterName = careCenters.find((c) => c?.id === form.careCenterId)?.name || "";
//     }

//     const cleanLogout = formatForDateInput(form.logoutDate);
//     const today = todayISO();
//     // 🔒 Status is Closed ONLY if logoutDate is entered AND <= today
//     const finalCalculatedStatus = (cleanLogout && cleanLogout <= today) ? "Closed" : "Active";

//     onSubmit({
//       ...form, 
//       id: form.id,
//       recordDate: formatForDateInput(form.recordDate) || todayISO(),
//       startDate: formatForDateInput(form.loginDate) || todayISO(),
//       logoutDate: cleanLogout || null,
//       notifyDate: formatForDateInput(form.notifyDate) || null,
//       recallDate: formatForDateInput(form.recallDate) || null,
//       equipmentId: form.deviceModel, 
//       equipmentName: equipment?.name || form.deviceModel, 
//       category: equipment?.category || "General", 
//       careCenterName, 
//       quantity: 1, 
//       paymentType: form.mode, 
//       deliveryAddress: form.deliveryAddress, 
//       status: finalCalculatedStatus, 
//       deliveryStatus: "Pending Dispatch",
//       photoCount: photos.length
//     });
//   };

//   return (
//     <div className="fade-slide-up space-y-5">
//       <GlobalPolish />
//       <div className="flex items-center gap-2 text-sm">
//         <button onClick={onCancel} className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-teal-600 cursor-pointer">
//           <ArrowLeft className="h-4 w-4" /> Rental Master
//         </button>
//         <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
//         <span className="font-semibold text-slate-700">
//           {isEdit ? "Edit Asset Requisition" : "Log Asset Requisition"}
//         </span>
//       </div>

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-800">
//             {isEdit ? "Edit Asset Requisition" : "Log Asset Requisition"}
//           </h2>
//           {form.id && <p className="text-xs text-slate-400 mt-0.5">Requisition ID: {form.id}</p>}
//         </div>
//         <div className="flex items-center gap-2">
//           <GhostButton onClick={onCancel}>Discard</GhostButton>
//         </div>
//       </div>

//       {/* Section 1: Record Types */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <SectionHeading icon={Tag}>Record Types</SectionHeading>
//         <div className="grid gap-4 sm:grid-cols-3">
//           <Field label="Deal Type" required error={errors.dealType}>
//             <Select value={form.dealType} error={errors.dealType} onChange={(e) => set({ dealType: e.target.value })}>
//               <option value="">--- Select ---</option>
//               {DEAL_TYPE_OPTIONS.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
//             </Select>
//           </Field>
//           <Field label="Unit" required error={errors.unit}>
//             <Select value={form.unit} error={errors.unit} onChange={(e) => set({ unit: e.target.value })}>
//               <option value="">--- Select ---</option>
//               {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
//             </Select>
//           </Field>
//           <Field label="Payment Mode" required error={errors.mode}>
//             <Select value={form.mode} error={errors.mode} onChange={(e) => set({ mode: e.target.value, paymentType: e.target.value })}>
//               <option value="">--- Select ---</option>
//               {MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
//             </Select>
//           </Field>
//         </div>
//       </div>

//       {/* Section 2: Asset Allocation & Logistics */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

//           <Field label="Record Date">
//             <TextInput type="date" value={form.recordDate || ""} onChange={(e) => set({ recordDate: e.target.value })} />
//           </Field>

//           <Field label="Log In Date" required error={errors.loginDate}>
//             <TextInput 
//               type="date" 
//               value={form.loginDate || ""} 
//               error={errors.loginDate} 
//               onChange={(e) => set({ loginDate: e.target.value })} 
//             />
//           </Field>
          
//           <Field label="Notify Date" required={form.mode === "Prepaid"} error={errors.notifyDate}>
//             <TextInput type="date" value={form.notifyDate || ""} error={errors.notifyDate} onChange={(e) => set({ notifyDate: e.target.value })} />
//           </Field>
          
//           <Field label="Log Out Date (Optional)" error={errors.logoutDate}>
//             <TextInput 
//               type="date" 
//               value={form.logoutDate || ""} 
//               min={formatForDateInput(form.loginDate)}
//               error={errors.logoutDate}
//               onChange={(e) => set({ logoutDate: e.target.value })} 
//             />
//           </Field>

//           <Field label="Recall Date (Optional)" error={errors.recallDate}>
//             <TextInput 
//               type="date" 
//               value={form.recallDate || ""} 
//               min={minRecallDateAllowed || undefined}
//               error={errors.recallDate}
//               onChange={(e) => set({ recallDate: e.target.value })} 
//             />
//             {form.logoutDate && (
//               <p className="mt-1 text-[11px] font-medium text-amber-600">
//                 Must be on or after {formatDisplayDate(minRecallDateAllowed)}
//               </p>
//             )}
//           </Field>
//         </div>
//       </div>

//       {/* Section 3: Commercials & Billing */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <SectionHeading icon={CreditCard}>Commercials &amp; Billing</SectionHeading>
//         <div className="grid gap-4 sm:grid-cols-4">
//           <Field label="Billing Type" required error={errors.billingType}>
//             <Select value={form.billingType} error={errors.billingType} onChange={(e) => set({ billingType: e.target.value })}>
//               <option value="Daily">Daily</option>
//               <option value="Fortnight">Fortnight</option>
//               <option value="Monthly">Monthly</option>
//             </Select>
//           </Field>
//           <Field label="Rental Charge (₹/Day)">
//             <TextInput type="number" min={0} value={form.rentalCharge} onChange={(e) => set({ rentalCharge: e.target.value })} />
//           </Field>
//           <Field label="Deposit / Advance (₹)">
//             <TextInput type="number" min={0} value={form.depositAdvance} onChange={(e) => set({ depositAdvance: e.target.value })} />
//           </Field>
//           <Field label="Installation Charge (₹)">
//             <TextInput type="number" min={0} value={form.installationCharge} onChange={(e) => set({ installationCharge: e.target.value })} />
//           </Field>
//         </div>
//       </div>

//       {/* Section 4: Care Center & Patient Details */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="grid gap-8 lg:grid-cols-2">
//           <div>
//             <SectionHeading icon={Building2}>Care Center Contact Info</SectionHeading>
//             <div className="space-y-4">
//               <Field label="Care Center Name">
//                 <Select value={form.careCenterId} onChange={(e) => handleCareCenterChange(e.target.value)}>
//                   {!isCareCenterUser && <option value="">-- Select Care Center --</option>}
//                   {pageDropdownCareCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                   {!isCareCenterUser && <option value="other">Other (Add New)</option>}
//                 </Select>
//               </Field>

//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Incharge Mobile" error={errors.inchargeMobile}>
//                   <TextInput maxLength={10} value={form.inchargeMobile} error={errors.inchargeMobile} onChange={(e) => set({ inchargeMobile: e.target.value })} placeholder="10-digit number" />
//                 </Field>
//                 <Field label="Alt Mobile">
//                   <TextInput maxLength={10} value={form.altMobile} onChange={(e) => set({ altMobile: e.target.value })} placeholder="Alternative mobile" />
//                 </Field>
//               </div>

//               <Field label="Care Address">
//                 <textarea rows={2} value={form.careAddress} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none resize-none border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" onChange={(e) => set({ careAddress: e.target.value })} />
//               </Field>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Bed No">
//                   <TextInput value={form.bedNo} onChange={(e) => set({ bedNo: e.target.value })} />
//                 </Field>
                
//                 <Field label="Referral Doctor">
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
//                 <Field label="Patient Name" required error={errors.patientName}>
//                   <TextInput value={form.patientName} error={errors.patientName} onChange={(e) => set({ patientName: e.target.value })} />
//                 </Field>
//                 <Field label="Age">
//                   <TextInput type="number" min={0} value={form.age} onChange={(e) => set({ age: e.target.value })} />
//                 </Field>
//               </div>
//               <Field label="Attendant Name">
//                 <TextInput value={form.attendantName} onChange={(e) => set({ attendantName: e.target.value })} />
//               </Field>
//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Mobile Number">
//                   <TextInput maxLength={10} value={form.mobileNumber} onChange={(e) => set({ mobileNumber: e.target.value })} />
//                 </Field>
//                 <Field label="Alt Mobile Number">
//                   <TextInput maxLength={10} value={form.altMobileNumber} onChange={(e) => set({ altMobileNumber: e.target.value })} />
//                 </Field>
//               </div>
//               <Field label="Delivery Address">
//                 <textarea rows={3} value={form.deliveryAddress} onChange={(e) => set({ deliveryAddress: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" />
//               </Field>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section 5: Notes */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <Field label="Notes">
//           <textarea rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" />
//         </Field>
//       </div>

//       {/* Section 6: Photo Verification */}
//       <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/30">
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
//                   const isImage = file.type?.startsWith("image/");
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
//                       <button type="button" onClick={() => removeFile(idx)} className="absolute right-1 top-1 hidden h-5 w-5 place-items-center rounded-full bg-rose-500 text-white shadow-md transition hover:bg-rose-600 group-hover:grid cursor-pointer">
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
//         <PrimaryButton onClick={handleSubmit} className="px-6 py-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer">
//           <Save className="h-4.5 w-4.5" /> {isEdit ? "Update Requisition Details" : "Save Requisition & Deploy"}
//         </PrimaryButton>
//       </div>
//     </div>
//   );
// }

// export default function RentalMaster({ permissions = { canAdd: true, canEdit: true, canDelete: true }, careCenters = [], equipmentCatalog = [], references = [], categories = [] }) {
//   const loggedUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);
//   const isCareCenterUser = loggedUser?.role === "care_center";

//   const matchedUserCenter = useMemo(() => {
//     if (!isCareCenterUser) return null;
//     const cleanUserPhone = String(loggedUser?.phone || "").replace(/\D/g, "").slice(-10);
//     const cleanUserName = String(loggedUser?.careCenterName || loggedUser?.name || "").trim().toLowerCase();

//     return careCenters.find((c) => {
//       const cleanCcPhone = String(c?.phone || "").replace(/\D/g, "").slice(-10);
//       const cleanCcName = String(c?.name || "").trim().toLowerCase();

//       return (
//         (c?.id && loggedUser?.careCenterId && String(c.id) === String(loggedUser.careCenterId)) ||
//         (c?.id && loggedUser?.id && String(c.id) === String(loggedUser.id)) ||
//         (cleanUserPhone && cleanCcPhone && cleanUserPhone === cleanCcPhone) ||
//         (cleanUserName && cleanCcName && (cleanCcName.includes(cleanUserName) || cleanUserName.includes(cleanCcName)))
//       );
//     }) || {
//       id: loggedUser?.careCenterId || loggedUser?.id || "CC-ME",
//       name: loggedUser?.careCenterName || loggedUser?.name || "My Care Center"
//     };
//   }, [careCenters, isCareCenterUser, loggedUser]);

//   const filterBarDropdownCareCenters = useMemo(() => {
//     if (isCareCenterUser && matchedUserCenter) {
//       return [matchedUserCenter];
//     }
//     return filterActive(careCenters);
//   }, [careCenters, isCareCenterUser, matchedUserCenter]);

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
//       setLogs(response.data || []);
//       localStorage.setItem("cached_requisitions", JSON.stringify(response.data || []));
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
//           setLogs(response.data || []);
//           localStorage.setItem("cached_requisitions", JSON.stringify(response.data || []));
//         }
//       } catch (error) {
//         console.error("Failed to fetch logs:", error);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };
//     loadData();
//     return () => { isMounted = false; };
//   }, []);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("Both");
//   const [dealTypeFilter, setDealTypeFilter] = useState("All");
//   const [unitFilter, setUnitFilter] = useState("All"); 
//   const [modeFilter, setModeFilter] = useState("All");
//   const [careCenterFilter, setCareCenterFilter] = useState("All"); 
  
//   const [sortField, setSortField] = useState("startDate");
//   const [sortOrder, setSortOrder] = useState("desc");

//   const [viewDetailLog, setViewDetailLog] = useState(null); 
//   const [pageForm, setPageForm] = useState(null); 

//   const [calcModal, setCalcModal] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
//     } else {
//       setSortField(field);
//       setSortOrder("desc");
//     }
//   };

//   const scopedLogs = useMemo(() => {
//     if (!isCareCenterUser) return logs;

//     const myCenterId = String(matchedUserCenter?.id || loggedUser?.careCenterId || loggedUser?.id || "").trim().toLowerCase();
//     const myCenterName = String(matchedUserCenter?.name || loggedUser?.careCenterName || loggedUser?.name || "").trim().toLowerCase();
//     const myCenterIdNumeric = myCenterId.replace(/\D/g, "");

//     return logs.filter((l) => {
//       if (!l) return false;
//       const ccId = String(l.careCenterId || l.care_center_id || "").trim().toLowerCase();
//       const ccIdNumeric = ccId.replace(/\D/g, "");
//       const ccName = String(l.careCenterName || l.care_center_name || careCenters.find((c) => String(c?.id) === String(ccId))?.name || ccId || "").trim().toLowerCase();

//       const idMatch = (ccId && myCenterId && ccId === myCenterId) || (ccIdNumeric && myCenterIdNumeric && ccIdNumeric === myCenterIdNumeric);
//       const nameMatch = (ccName && myCenterName && (ccName.includes(myCenterName) || myCenterName.includes(ccName)));

//       return idMatch || nameMatch;
//     });
//   }, [logs, isCareCenterUser, matchedUserCenter, loggedUser, careCenters]);

//   const filtered = useMemo(() => {
//     const q = String(search || "").toLowerCase().trim();
//     const sFilter = String(statusFilter || "Both").trim().toLowerCase();
//     const today = todayISO();

//     return (scopedLogs || [])
//       .filter((l) => {
//         if (!l) return false;

//         const ccId = String(l.careCenterId || l.care_center_id || "");
//         const ccObj = careCenters.find((c) => c && String(c.id) === ccId);
//         const ccName = String(l.careCenterName || ccObj?.name || ccId || "");

//         const eqId = String(l.equipmentId || l.equipment_id || "");
//         const eqObj = equipmentCatalog.find((e) => e && String(e.id) === eqId);
//         const eqName = String(l.equipmentName || eqObj?.name || eqId || "");

//         const patient = String(l.patientName || l.patient_name || "");
//         const inchargeMobile = String(l.inchargeMobile || l.incharge_mobile || l.phone || "");
//         const logId = String(l.id || "");

//         const matchesSearch = !q || 
//           logId.toLowerCase().includes(q) || 
//           eqName.toLowerCase().includes(q) || 
//           patient.toLowerCase().includes(q) || 
//           ccName.toLowerCase().includes(q) || 
//           inchargeMobile.includes(q);
          
//         const cleanLogout = formatForDateInput(l.logoutDate || l.logout_date);
//         const isClosed = Boolean(cleanLogout && cleanLogout <= today);
//         const computedStatus = isClosed ? "closed" : "active";
        
//         const isStatusMatch = (sFilter === "both" || sFilter === "all")
//           ? true
//           : (sFilter === computedStatus);

//         const dType = String(l.dealType || l.deal_type || "");
//         const matchesDealType = dealTypeFilter === "All" || dType === dealTypeFilter;

//         const unitVal = String(l.unit || "");
//         const matchesUnit = unitFilter === "All" || unitVal === unitFilter;

//         const modeVal = String(l.mode || l.paymentType || l.payment_type || "");
//         const matchesMode = modeFilter === "All" || modeVal === modeFilter;

//         const matchesCareCenter = isCareCenterUser || careCenterFilter === "All" || ccId === careCenterFilter;

//         return matchesSearch && isStatusMatch && matchesDealType && matchesUnit && matchesMode && matchesCareCenter;
//       })
//       .sort((a, b) => {
//         const tA = getSafeTime(a, sortField);
//         const tB = getSafeTime(b, sortField);
//         return sortOrder === "desc" ? tB - tA : tA - tB;
//       });
//   }, [scopedLogs, search, statusFilter, dealTypeFilter, unitFilter, modeFilter, careCenterFilter, sortField, sortOrder, careCenters, equipmentCatalog, isCareCenterUser]);

//   const handleFormSubmit = async (data) => {
//     try {
//       const accStr = Array.isArray(data.accessory) ? data.accessory.join(", ") : (data.accessory || "");
//       const chosenMode = data.mode || data.paymentType || "Postpaid";
      
//       const finalCareCenterId = isCareCenterUser 
//         ? (matchedUserCenter?.id || loggedUser?.careCenterId || loggedUser?.id || "CC-ME")
//         : (data.careCenterId === "other" ? "NEW" : (data.careCenterId || data.care_center_id));

//       const finalCareCenterName = isCareCenterUser
//         ? (matchedUserCenter?.name || loggedUser?.careCenterName || loggedUser?.name || "")
//         : (data.careCenterName || "");

//       const cleanLogout = formatForDateInput(data.logoutDate);
//       const cleanRecord = formatForDateInput(data.recordDate) || todayISO();
//       const cleanStart = formatForDateInput(data.startDate || data.loginDate) || todayISO();
//       const cleanRecall = formatForDateInput(data.recallDate);
//       const cleanNotify = formatForDateInput(data.notifyDate);
//       const today = todayISO();

//       const payload = {
//         careCenterId: finalCareCenterId,
//         careCenterName: finalCareCenterName,
//         equipmentId: data.equipmentId || data.deviceModel,
//         patientName: data.patientName,
//         quantity: 1,
//         startDate: cleanStart,
//         logoutDate: cleanLogout || null,
//         status: (cleanLogout && cleanLogout <= today) ? "Closed" : "Active",
        
//         billingType: data.billingType || "Daily",
//         rentalCharge: data.rentalCharge !== "" ? Number(data.rentalCharge) : 0,
//         depositAdvance: data.depositAdvance !== "" ? Number(data.depositAdvance) : 0,
//         installationCharge: data.installationCharge !== "" ? Number(data.installationCharge) : 0,
        
//         age: data.age || "",
//         attendantName: data.attendantName || "",
//         mobileNumber: data.mobileNumber || "",
//         altMobileNumber: data.altMobileNumber || "",
//         deliveryAddress: data.deliveryAddress || "",

//         inchargeMobile: data.inchargeMobile || "",
//         altMobile: data.altMobile || "",
//         careAddress: data.careAddress || "",
//         bedNo: data.bedNo || "",
//         referral: data.referral || "",
        
//         dealType: data.dealType || "B2B",
//         unit: data.unit || "ODCOM",
//         mode: chosenMode,
//         recordDate: cleanRecord,
//         notifyDate: cleanNotify,
//         recallDate: cleanRecall,
//         notes: data.notes || "",
//         accessory: accStr
//       };

//       if (data.id) {
//         await API.put(`/rental/requisitions/${data.id}`, payload);
//         toast.success("Requisition updated!");
//       } else {
//         await API.post("/rental/requisitions", payload);
//         toast.success("Requisition created & deployed!");
//       }

//       await fetchLogs();
//       setPageForm(null);
//     } catch (err) {
//       toast.error("Error: " + (err.response?.data?.message || err.message)); 
//     }
//   };

//   const handleFastClose = async (log) => {
//     try {
//       const today = todayISO();
//       await API.put(`/rental/requisitions/${log.id}`, {
//         ...log,
//         status: "Closed",
//         requisition_status: "Closed",
//         logoutDate: today,
//         logout_date: today
//       });
//       toast.success("Requisition marked as Closed!");
//       await fetchLogs();
//     } catch (err) {
//       toast.error("Failed to close: " + (err.response?.data?.message || err.message));
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

//   if (viewDetailLog !== null) {
//     return (
//       <RequisitionDetailView 
//         log={viewDetailLog} 
//         equipmentCatalog={equipmentCatalog}
//         careCenters={careCenters}
//         onBack={() => setViewDetailLog(null)}
//       />
//     );
//   }

//   if (pageForm !== null) {
//     return (
//       <RequisitionFormPage 
//         initial={pageForm.data} 
//         mode={pageForm.mode}
//         careCenters={careCenters} 
//         equipmentCatalog={equipmentCatalog} 
//         references={references} 
//         categories={categories} 
//         onCancel={() => setPageForm(null)} 
//         onSubmit={handleFormSubmit} 
//       />
//     );
//   }

//   return (
//     <div className="space-y-4 sm:space-y-5 fade-slide-up">
//       <GlobalPolish />
      
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800">Rental Master Sheet</h1>
//           <p className="text-xs font-medium text-slate-400 mt-0.5">Live view &amp; allocation of equipment requisitions</p>
//         </div>

//         {permissions.canAdd && (
//           <PrimaryButton onClick={() => setPageForm({ mode: "add", data: null })} className="shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] px-4.5 py-2.5 cursor-pointer">
//             <Plus className="h-4 w-4" /> New Log Requisition
//           </PrimaryButton>
//         )}
//       </div>

//       <KpiCards logs={scopedLogs} />
      
//       {/* Filter Bar */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
//         <div className="flex flex-wrap items-center gap-2.5 w-full">
          
//           <div className="group relative flex-[2] min-w-[200px]">
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-500" />
//             <input 
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)} 
//               autoComplete="off"
//               placeholder="Search by ID, patient, device, mobile…" 
//               className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20" 
//             />
//           </div>

//           <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400 hidden sm:block" />

//           <select 
//             value={careCenterFilter} 
//             onChange={(e) => setCareCenterFilter(e.target.value)} 
//             className="flex-1 min-w-[130px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer"
//           >
//             {!isCareCenterUser && <option value="All">All Care Centers</option>}
//             {filterBarDropdownCareCenters.map((c) => (
//               <option key={c.id} value={c.id}>{c.name}</option>
//             ))}
//           </select>

//           <select 
//             value={statusFilter} 
//             onChange={(e) => setStatusFilter(e.target.value)} 
//             className="flex-1 min-w-[120px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer"
//           >
//             <option value="Both">Status: Both</option>
//             <option value="Active">Active</option>
//             <option value="Closed">Closed</option>
//           </select>
          
//           <select value={dealTypeFilter} onChange={(e) => setDealTypeFilter(e.target.value)} className="flex-1 min-w-[110px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Deals</option>
//             {DEAL_TYPE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
          
//           <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="flex-1 min-w-[100px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Units</option>
//             {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
//           </select>

//           <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
//             <option value="All">All Modes</option>
//             {MODE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>

//           <button 
//             type="button"
//             onClick={() => setCalcModal({ isQuickCalc: true })}
//             title="Open Quick Total Days & Billing Calculator"
//             className="flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:border-teal-300 transition cursor-pointer shrink-0 shadow-2xs"
//           >
//             <Calculator className="h-4 w-4" />
//           </button>

//           <button 
//             type="button"
//             onClick={() => {
//               setSearch("");
//               setStatusFilter("Both");
//               setDealTypeFilter("All");
//               setUnitFilter("All");
//               setModeFilter("All");
//               setCareCenterFilter("All");
//               setSortField("startDate");
//               setSortOrder("desc");
//               toast.success("Filters reset");
//             }}
//             title="Reset all filters"
//             className="flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer shrink-0"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* Main Table */}
//       <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="smooth-scroll-x overflow-x-auto">
//           <table className="w-full text-left text-sm" style={{ minWidth: 800 }}>
//             <thead>
//               <tr className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/90 text-xs font-bold uppercase tracking-wide text-slate-400 backdrop-blur">
//                 <th className="px-5 py-3">Device</th>
//                 <th className="px-5 py-3">Patient</th>
                
//                 <th 
//                   onClick={() => handleSort("startDate")}
//                   className="px-5 py-3 cursor-pointer hover:text-teal-700 transition select-none"
//                   title="Click to sort by Login Date"
//                 >
//                   <div className="flex items-center gap-1.5">
//                     <span>Login Date</span>
//                     {sortField === "startDate" ? (
//                       sortOrder === "desc" ? <ArrowDown className="h-3.5 w-3.5 text-teal-600" /> : <ArrowUp className="h-3.5 w-3.5 text-teal-600" />
//                     ) : (
//                       <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
//                     )}
//                   </div>
//                 </th>

//                 <th 
//                   onClick={() => handleSort("logoutDate")}
//                   className="px-5 py-3 cursor-pointer hover:text-teal-700 transition select-none"
//                   title="Click to sort by Logout Date"
//                 >
//                   <div className="flex items-center gap-1.5">
//                     <span>Logout Date</span>
//                     {sortField === "logoutDate" ? (
//                       sortOrder === "desc" ? <ArrowDown className="h-3.5 w-3.5 text-teal-600" /> : <ArrowUp className="h-3.5 w-3.5 text-teal-600" />
//                     ) : (
//                       <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
//                     )}
//                   </div>
//                 </th>

//                 <th className="px-5 py-3">Total Days</th>
//                 <th className="px-5 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {loading && filtered.length === 0 ? (
//                 Array.from({ length: 5 }).map((_, idx) => (
//                   <tr key={idx} className="animate-pulse">
//                     <td className="px-5 py-4"><div className="h-5 w-28 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-32 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-10 bg-slate-100 rounded-md"></div></td>
//                     <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md ml-auto"></div></td>
//                   </tr>
//                 ))
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-5 py-14 text-center">
//                     <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100"><Search className="h-5 w-5 text-slate-400" /></div>
//                     <p className="mt-3 text-sm font-semibold text-slate-500">No requisitions match your filters</p>
//                     <p className="text-xs text-slate-400">Try adjusting the search or filter criteria</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((log, i) => {
//                   const actualLogoutDate = formatForDateInput(log?.logoutDate || log?.logout_date);
//                   const today = todayISO();
//                   // 🔒 Row status is closed ONLY if actualLogoutDate <= today
//                   const isClosed = Boolean(actualLogoutDate && actualLogoutDate <= today);
//                   const dynamicDays = calculateDaysCount(log?.startDate || log?.start_date || log?.loginDate, actualLogoutDate);
//                   const currentMode = log?.mode || log?.paymentType || log?.payment_type || "Postpaid";

//                   const rowColor = currentMode === "Prepaid" 
//                     ? "bg-emerald-50/70 hover:bg-emerald-100" 
//                     : currentMode === "Postpaid" 
//                     ? "bg-rose-50/70 hover:bg-rose-100"       
//                     : "hover:bg-teal-50/40";                  

//                   const eqId = log?.equipmentId || log?.equipment_id;
//                   let actualDevice = eqId || log?.equipmentName || "—";
                  
//                   const catMatch = equipmentCatalog.find(e => e?.id === eqId);
//                   if (catMatch) actualDevice = catMatch.name;

//                   const inchargePhone = log?.inchargeMobile || log?.incharge_mobile || log?.phone || "";
//                   const altPhone = log?.altMobile || log?.alt_mobile || "";

//                   return (
//                     <tr 
//                       key={log?.id || i} 
//                       className={`rise-in group/row relative transition-colors duration-150 ${rowColor}`}
//                     >
//                       <td className="px-5 py-3.5 font-bold text-slate-800">
//                         {actualDevice}
//                       </td>
//                       <td className="px-5 py-3.5">
//                         <p className="font-semibold text-slate-800">{log?.patientName || log?.patient_name || "—"}</p>
//                         {inchargePhone && (
//                           <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
//                             <Phone className="h-3 w-3 text-slate-400 shrink-0" /> {inchargePhone}
//                             {altPhone && <span className="text-slate-400">/ {altPhone}</span>}
//                           </p>
//                         )}
//                       </td>
//                       <td className="px-5 py-3.5 text-slate-600 font-medium">
//                         {formatDisplayDate(log?.startDate || log?.start_date || log?.loginDate)}
//                       </td>
//                       <td className="px-5 py-3.5 text-slate-600">
//                         {actualLogoutDate ? formatDisplayDate(actualLogoutDate) : "—"}
//                       </td>
                      
//                       <td className="px-5 py-3.5">
//                         <span className={`font-semibold px-2.5 py-1 rounded-md text-xs border shadow-xs ${
//                           isClosed 
//                             ? "bg-slate-100 text-slate-700 border-slate-200" 
//                             : "bg-teal-50 text-teal-800 border-teal-200"
//                         }`}>
//                           {dynamicDays} {dynamicDays === 1 ? "Day" : "Days"} {isClosed ? "(Closed)" : "(Active)"}
//                         </span>
//                       </td>

//                       <td className="px-5 py-3.5">
//                         <div className="flex items-center justify-end gap-1">

//                           {!isClosed && (
//                             <IconAction 
//                               title="Mark as Closed (Return Device)" 
//                               tone="teal" 
//                               onClick={() => handleFastClose(log)}
//                             >
//                               <PackageCheck className="h-4 w-4 text-emerald-600" />
//                             </IconAction>
//                           )}

//                           <IconAction 
//                             title="Calculate Balance & Days" 
//                             tone="teal" 
//                             onClick={() => setCalcModal(log)}
//                           >
//                             <Calculator className="h-4 w-4 text-teal-600" />
//                           </IconAction>

//                           <IconAction 
//                             title="View Details" 
//                             tone="teal" 
//                             onClick={() => setViewDetailLog(log)}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </IconAction>
                          
//                           {permissions.canEdit && (
//                             <IconAction 
//                               title="Edit Requisition" 
//                               tone="teal" 
//                               onClick={() => setPageForm({ mode: "edit", data: log })}
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </IconAction>
//                           )}

//                           {permissions.canDelete && (
//                             <IconAction 
//                               title="Delete" 
//                               tone="rose" 
//                               onClick={() => setConfirmDelete(log)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </IconAction>
//                           )}
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
//           <span>Showing {filtered.length} of {scopedLogs.length} requisitions</span>
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

//       <ConfirmDialog 
//         open={!!confirmDelete} 
//         title="Delete this requisition?" 
//         message={confirmDelete ? `${confirmDelete.id} will be permanently removed. This cannot be undone.` : ""} 
//         onCancel={() => setConfirmDelete(null)} 
//         onConfirm={handleDelete} 
//       />
//     </div>
//   );
// }

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  PackageCheck, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Building2, 
  User, 
  Tag, 
  CreditCard, 
  Save, 
  X, 
  ArrowLeft, 
  ChevronRight, 
  ImagePlus, 
  Truck, 
  FileText, 
  ChevronDown, 
  Calculator,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Phone
} from "lucide-react";
import { 
  PrimaryButton, 
  GhostButton, 
  IconAction, 
  ConfirmDialog, 
  Field, 
  Select, 
  TextInput, 
  toast 
} from "../components/UiComponents";
import { 
  DEAL_TYPE_OPTIONS, 
  MODE_OPTIONS, 
  UNIT_OPTIONS 
} from "../data/MockData";
import { todayISO } from "../utils/Helper";
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

// 📅 Timezone-Safe Date Formatters
const formatForDateInput = (d) => {
  if (!d || d === "null" || d === "undefined" || d === "0000-00-00" || String(d).trim() === "") return "";
  const str = String(d).trim();
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match && !match[0].startsWith("0000")) return match[0];
  try {
    const dt = new Date(d);
    if (!isNaN(dt.getTime()) && dt.getFullYear() >= 2000) {
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch {
    return "";
  }
  return "";
};

const formatDisplayDate = (d) => {
  const clean = formatForDateInput(d);
  if (!clean) return "—";
  const [y, m, day] = clean.split("-");
  return `${day}/${m}/${y}`;
};

const getNextDayISO = (dateStr) => {
  const clean = formatForDateInput(dateStr);
  if (!clean) return "";
  const [y, m, d] = clean.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().split("T")[0];
};

// 🧮 Dynamic Total Days / Day of Month Calculator (e.g. 71 / 6)
const getDynamicTotalDays = (loginStr, logoutStr) => {
  const s = formatForDateInput(loginStr);
  if (!s) return "—";

  const [sY, sM, sD] = s.split("-").map(Number);
  const startUtc = Date.UTC(sY, sM - 1, sD);

  const cleanOut = formatForDateInput(logoutStr);
  if (cleanOut) {
    const [eY, eM, eD] = cleanOut.split("-").map(Number);
    const endUtc = Date.UTC(eY, eM - 1, eD);
    let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) diffDays = 0;
    const logoutDay = eD;
    return `${diffDays} / ${logoutDay}`;
  } else {
    const now = new Date();
    const endUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    let diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) diffDays = 0;
    const currentDay = now.getDate();
    return `${diffDays} / ${currentDay}`;
  }
};

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
    const st = String(item.status || item.state || "").trim().toLowerCase();
    if (st === "inactive" || st === "disabled" || item.is_active === 0 || item.isActive === false) {
      return false;
    }
    return true;
  });
};

const getSafeTime = (item, field) => {
  if (!item) return 0;
  const raw = field === "logoutDate" 
    ? (item.logoutDate || item.logout_date) 
    : (item.startDate || item.start_date || item.loginDate);
  const clean = formatForDateInput(raw);
  if (!clean) return 0;
  const t = new Date(clean).getTime();
  return isNaN(t) ? 0 : t;
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
        className={`flex min-h-[42px] w-full flex-wrap items-center justify-between gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-all ${
          error ? "border-rose-300 ring-4 ring-rose-500/10" : "border-slate-200 hover:border-teal-300 focus:border-teal-500"
        } ${disabled ? "bg-slate-50 cursor-not-allowed opacity-70" : "cursor-pointer"}`}
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
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
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
                    className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-teal-50 ${
                      isSel ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700"
                    }`}
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

function KpiCards({ logs = [] }) {
  const today = todayISO();
  const countActive = logs.filter((l) => {
    const cleanOut = formatForDateInput(l?.logoutDate || l?.logout_date);
    return !cleanOut || cleanOut > today;
  }).length;

  const countClosed = logs.filter((l) => {
    const cleanOut = formatForDateInput(l?.logoutDate || l?.logout_date);
    return Boolean(cleanOut && cleanOut <= today);
  }).length;

  const countInactive = logs.filter((l) => String(l?.status || "").toLowerCase() === "inactive").length;

  const cards = [
    { label: "Active Rentals", value: countActive, icon: Activity, tone: "teal" },
    { label: "Closed", value: countClosed, icon: PackageCheck, tone: "slate" },
    { label: "Inactive Rentals", value: countInactive, icon: AlertTriangle, tone: "rose" },
    { label: "Total Requisitions", value: logs.length, icon: Clock, tone: "amber" },
  ];

  const toneMap = {
    teal: { chip: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30", bar: "from-teal-400 to-teal-600", glow: "bg-teal-400/10" },
    slate: { chip: "bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-slate-500/30", bar: "from-slate-400 to-slate-600", glow: "bg-slate-400/10" },
    rose: { chip: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/30", bar: "from-rose-400 to-rose-600", glow: "bg-rose-400/10" },
    amber: { chip: "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-500/30", bar: "from-amber-300 to-amber-500", glow: "bg-amber-400/10" },
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const t = toneMap[c.tone];
        return (
          <div 
            key={c.label} 
            style={{ animationDelay: `${i * 60}ms` }} 
            className="rise-in group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5"
          >
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

function CalculateTotalDaysModal({ onClose }) {
  const [tempLoginDate, setTempLoginDate] = useState(() => todayISO());
  const [tempLogoutDate, setTempLogoutDate] = useState("");

  const totalDaysDisplay = useMemo(() => {
    return getDynamicTotalDays(tempLoginDate, tempLogoutDate);
  }, [tempLoginDate, tempLogoutDate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4.5">
          <div>
            <h3 className="font-display text-base font-bold text-slate-800">
              Calculate Total Days
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              LOG IN DATE
            </label>
            <input 
              type="date" 
              value={tempLoginDate} 
              onChange={(e) => setTempLoginDate(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              LOG OUT DATE
            </label>
            <input 
              type="date" 
              value={tempLogoutDate} 
              min={tempLoginDate}
              onChange={(e) => setTempLogoutDate(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" 
            />
            <p className="text-[11px] text-slate-400 mt-1">Leave empty to calculate until today</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 text-center my-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL DAYS
            </span>
            <p className="mt-1 font-display text-3xl font-extrabold text-teal-800">
              {totalDaysDisplay}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={onClose} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 text-xs font-bold shadow-sm transition cursor-pointer">
            Apply Changes
          </button>
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

function RequisitionDetailView({ log, equipmentCatalog = [], careCenters = [], onBack }) {
  const eqId = log?.equipmentId || log?.equipment_id || log?.deviceModel;
  const equipmentName = equipmentCatalog.find(e => String(e?.id) === String(eqId))?.name || log?.equipmentName || log?.equipment_name || eqId || "—";
  
  const ccId = log?.careCenterId || log?.care_center_id;
  const careCenterObj = careCenters.find(c => String(c?.id) === String(ccId));
  const careCenterName = log?.careCenterName || log?.care_center_name || careCenterObj?.name || ccId || "—";

  const cleanLogout = formatForDateInput(log?.logoutDate || log?.logout_date);
  const today = todayISO();
  const isCurrentlyActive = !cleanLogout || cleanLogout > today;
  const statusLabel = isCurrentlyActive ? "Active" : "Closed";

  const statusColor = isCurrentlyActive
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const billingTypeVal = log?.billingType || log?.billing_type || log?.billing || "Daily";
  const rentalChargeVal = Number(log?.rentalCharge ?? log?.rental_charge ?? log?.rental ?? log?.rent ?? 0).toFixed(2);
  const depositAdvanceVal = Number(log?.depositAdvance ?? log?.deposit_advance ?? log?.deposit ?? log?.advance ?? 0).toFixed(2);
  const installationChargeVal = Number(log?.installationCharge ?? log?.installation_charge ?? log?.installation ?? 0).toFixed(2);

  const totalDaysFormatted = getDynamicTotalDays(log?.startDate || log?.start_date || log?.loginDate, cleanLogout);

  return (
    <div className="fade-slide-up space-y-6">
      <GlobalPolish />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔍</span>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-800">
              Requisition Record: #{log?.id || "—"}
            </h1>
          </div>
          <p className="text-xs font-bold tracking-wider text-slate-400 mt-1 uppercase">
            STATUS: <span className="text-teal-600">{statusLabel}</span> • TOTAL DAYS: {totalDaysFormatted}
          </p>
        </div>

        <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Listing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
            📦 Logistics &amp; Device Matrix
          </p>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-400">Assigned Model</p>
              <p className="font-bold text-slate-800 mt-0.5">{equipmentName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Accessory</p>
              <p className="font-bold text-slate-800 mt-0.5">{log?.accessory || log?.accessories || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Deal Type</p>
              <p className="font-bold text-slate-800 mt-0.5">{log?.dealType || log?.deal_type || "B2B"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Unit</p>
              <p className="font-bold text-slate-800 mt-0.5">{log?.unit || "ODCOM"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Mode</p>
              <p className="font-bold text-slate-800 mt-0.5">{log?.mode || log?.paymentType || log?.payment_type || "Postpaid"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Log In Date</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {formatDisplayDate(log?.startDate || log?.start_date || log?.loginDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Log Out Date</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {formatDisplayDate(cleanLogout)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Total Days</p>
              <p className="font-bold text-teal-700 mt-0.5">
                {totalDaysFormatted}
              </p>
            </div>

            <div className="col-span-2 pt-1">
              <p className="text-xs font-medium text-slate-400 mb-1">Status</p>
              <span className={`inline-block rounded-md px-3 py-1 text-xs font-bold border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
            💳 Commercial Parameters
          </p>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-400">Billing Type</p>
              <p className="font-extrabold text-teal-600 uppercase mt-0.5">
                {billingTypeVal}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Rental Charge</p>
              <p className="font-extrabold text-slate-800 mt-0.5">
                ₹{rentalChargeVal}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">Deposit / Advance</p>
              <p className="font-extrabold text-slate-800 mt-0.5">
                ₹{depositAdvanceVal}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Installation Charge</p>
              <p className="font-extrabold text-slate-800 mt-0.5">
                ₹{installationChargeVal}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            👤 Patient Identity Details
          </p>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
            <div><p className="text-xs font-medium text-slate-400">Patient Name:</p></div>
            <div><p className="font-bold text-slate-800">{log?.patientName || log?.patient_name || "—"}</p></div>

            <div><p className="text-xs font-medium text-slate-400">Mobile:</p></div>
            <div><p className="font-bold text-slate-800">{log?.mobileNumber || log?.mobile_number || log?.mobile || "—"}</p></div>

            <div><p className="text-xs font-medium text-slate-400">Attendant:</p></div>
            <div><p className="font-bold text-slate-800">{log?.attendantName || log?.attendant_name || "—"}</p></div>

            <div className="col-span-2 pt-2">
              <p className="text-xs font-medium text-slate-400 mb-1.5">Delivery Address:</p>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-medium text-slate-700">
                {log?.deliveryAddress || log?.delivery_address || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
            🏥 Care Center Context
          </p>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
            <div><p className="text-xs font-medium text-slate-400">Care Center:</p></div>
            <div><p className="font-bold text-slate-800">{careCenterName}</p></div>

            <div><p className="text-xs font-medium text-slate-400">Incharge Mobile:</p></div>
            <div><p className="font-bold text-slate-800">{log?.inchargeMobile || log?.incharge_mobile || log?.phone || careCenterObj?.phone || careCenterObj?.incharge_mobile || "—"}</p></div>

            <div><p className="text-xs font-medium text-slate-400">Bed No:</p></div>
            <div><p className="font-bold text-slate-800">{log?.bedNumber || log?.bed_number || log?.bedNo || "—"}</p></div>

            <div className="col-span-2 pt-2">
              <p className="text-xs font-medium text-slate-400 mb-1.5">Care Address:</p>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-medium text-slate-700">
                {log?.careAddress || log?.care_address || log?.address || careCenterObj?.address || "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequisitionFormPage({ initial = null, mode = "add", careCenters = [], equipmentCatalog = [], references = [], categories = [], onCancel, onSubmit }) {
  const isEdit = mode === "edit";

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
      c?.id === loggedUser?.careCenterId || 
      c?.id === loggedUser?.id || 
      (c?.phone && loggedUser?.phone && String(c.phone).replace(/\D/g, "").slice(-10) === String(loggedUser.phone).replace(/\D/g, "").slice(-10)) ||
      (c?.name && loggedUser?.name && c.name.trim().toLowerCase() === loggedUser.name.trim().toLowerCase())
    ) || {
      id: loggedUser?.careCenterId || loggedUser?.id || "CC-ME",
      name: loggedUser?.careCenterName || loggedUser?.name || "My Care Center"
    };
  }, [careCenters, isCareCenterUser, loggedUser]);

  const pageDropdownCareCenters = useMemo(() => {
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
      } else if (typeof rawAcc === "string" && rawAcc.trim() !== "") {
        parsedAcc = rawAcc.split(",").map(item => item.trim()).filter(Boolean);
      }

      const ccId = initial.careCenterId || initial.care_center_id || "";
      const cc = careCenters.find((c) => c?.id === ccId);
      const parsedLogoutDate = formatForDateInput(initial.logoutDate || initial.logout_date);

      const rCharge = initial.rentalCharge !== undefined && initial.rentalCharge !== null ? initial.rentalCharge : (initial.rental_charge !== undefined ? initial.rental_charge : "");
      const dAdvance = initial.depositAdvance !== undefined && initial.depositAdvance !== null ? initial.depositAdvance : (initial.deposit_advance !== undefined ? initial.deposit_advance : "");
      const iCharge = initial.installationCharge !== undefined && initial.installationCharge !== null ? initial.installationCharge : (initial.installation_charge !== undefined ? initial.installation_charge : "");

      return {
        id: initial.id || null,
        dealType: initial.dealType || initial.deal_type || "B2B",
        unit: initial.unit || "ODCOM",
        mode: initial.mode || initial.paymentType || initial.payment_type || "Postpaid",
        deviceModel: initial.equipmentId || initial.equipment_id || initial.deviceModel || "",
        accessory: parsedAcc,
        recordDate: formatForDateInput(initial.recordDate || initial.record_date) || todayISO(),
        loginDate: formatForDateInput(initial.startDate || initial.start_date || initial.loginDate) || todayISO(),
        notifyDate: formatForDateInput(initial.notifyDate || initial.notify_date) || "",
        logoutDate: parsedLogoutDate || "",
        recallDate: formatForDateInput(initial.recallDate || initial.recall_date) || "",
        billingType: initial.billingType || initial.billing_type || "Daily",
        rentalCharge: rCharge,
        depositAdvance: dAdvance,
        installationCharge: iCharge,
        careCenterId: ccId || matchedUserCenter?.id || "",
        inchargeMobile: initial.inchargeMobile || initial.incharge_mobile || initial.phone || cc?.phone || "",
        altMobile: initial.altMobile || initial.alt_mobile || "",
        careAddress: initial.careAddress || initial.care_address || initial.address || cc?.address || "",
        bedNo: initial.bedNumber || initial.bed_number || initial.bedNo || "",
        referral: initial.referralDoctor || initial.referral_doctor || initial.referral || "",
        patientName: initial.patientName || initial.patient_name || "",
        age: initial.age || "",
        attendantName: initial.attendantName || initial.attendant_name || "",
        mobileNumber: initial.mobileNumber || initial.mobile_number || initial.mobile || "",
        altMobileNumber: initial.altMobileNumber || initial.alt_mobile_number || "",
        deliveryAddress: initial.deliveryAddress || initial.delivery_address || "",
        notes: initial.notes || ""
      };
    }

    return {
      dealType: "B2B",
      unit: "ODCOM",
      mode: "Postpaid",
      deviceModel: "",
      accessory: [],
      recordDate: todayISO(),
      loginDate: todayISO(),
      notifyDate: "",
      logoutDate: "",
      recallDate: "",
      billingType: "Daily",
      rentalCharge: "",
      depositAdvance: "",
      installationCharge: "",
      careCenterId: matchedUserCenter?.id || "",
      inchargeMobile: matchedUserCenter?.phone || loggedUser?.phone || "",
      altMobile: "",
      careAddress: matchedUserCenter?.address || "",
      bedNo: "",
      referral: "",
      patientName: "",
      age: "",
      attendantName: "",
      mobileNumber: "",
      altMobileNumber: "",
      deliveryAddress: "",
      notes: ""
    };
  });

  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const activeEquipment = useMemo(() => filterActive(equipmentCatalog), [equipmentCatalog]);
  const activeReferrals = useMemo(() => filterActive(references), [references]);
  const activeCategories = useMemo(() => filterActive(categories).map(getOptionLabel).filter(Boolean), [categories]);

  const minRecallDateAllowed = useMemo(() => {
    if (form.logoutDate && form.logoutDate.trim() !== "") {
      return getNextDayISO(form.logoutDate);
    }
    return "";
  }, [form.logoutDate]);

  const handleCareCenterChange = (id) => {
    if (id === "other") {
      set({ careCenterId: "other", careAddress: "", inchargeMobile: "", altMobile: "" });
    } else {
      const cc = careCenters.find((c) => c?.id === id);
      set({ 
        careCenterId: id, 
        careAddress: cc?.address || "", 
        inchargeMobile: cc?.phone || "", 
        altMobile: ""
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
    if (!form.billingType) e.billingType = "Please select a billing type.";
    if (!form.patientName) e.patientName = "Patient name is required.";
    
    if (form.mode === "Prepaid" && !form.notifyDate) {
      e.notifyDate = "Notify Date is mandatory for Prepaid!";
    }

    if (form.inchargeMobile && !/^\d{10}$/.test(String(form.inchargeMobile).trim())) {
      e.inchargeMobile = "Enter a valid 10-digit mobile number.";
    }

    const cleanLogIn = formatForDateInput(form.loginDate);
    const cleanLogOut = formatForDateInput(form.logoutDate);
    const cleanRecall = formatForDateInput(form.recallDate);

    if (cleanLogIn && cleanLogOut && cleanLogOut < cleanLogIn) {
      e.logoutDate = `Log Out Date cannot be before Log In Date (${formatDisplayDate(cleanLogIn)}).`;
    }

    if (cleanLogOut && cleanRecall && cleanRecall <= cleanLogOut) {
      e.recallDate = `Recall Date must be after Log Out Date (at least ${formatDisplayDate(getNextDayISO(cleanLogOut))}).`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // const handleSubmit = () => {
  //   if (!validate()) { 
  //     toast.error("Please fix the validation errors before saving."); 
  //     window.scrollTo({ top: 0, behavior: "smooth" }); 
  //     return; 
  //   }

  //   const equipment = equipmentCatalog.find((eq) => eq?.id === form.deviceModel);
  //   let careCenterName = isCareCenterUser ? (matchedUserCenter?.name || loggedUser?.careCenterName || loggedUser?.name || "") : "Other";
  //   if (form.careCenterId !== "other" && !isCareCenterUser) {
  //     careCenterName = careCenters.find((c) => c?.id === form.careCenterId)?.name || "";
  //   }

  //   const cleanLogout = formatForDateInput(form.logoutDate);
  //   const today = todayISO();
  //   const finalCalculatedStatus = (cleanLogout && cleanLogout <= today) ? "Closed" : "Active";

  //   const rCharge = form.rentalCharge !== "" && form.rentalCharge !== undefined && form.rentalCharge !== null ? parseFloat(form.rentalCharge) : 0;
  //   const dAdvance = form.depositAdvance !== "" && form.depositAdvance !== undefined && form.depositAdvance !== null ? parseFloat(form.depositAdvance) : 0;
  //   const iCharge = form.installationCharge !== "" && form.installationCharge !== undefined && form.installationCharge !== null ? parseFloat(form.installationCharge) : 0;

  //   onSubmit({
  //     ...form, 
  //     id: form.id,
  //     recordDate: formatForDateInput(form.recordDate) || todayISO(),
  //     startDate: formatForDateInput(form.loginDate) || todayISO(),
  //     logoutDate: cleanLogout || null,
  //     notifyDate: formatForDateInput(form.notifyDate) || null,
  //     recallDate: formatForDateInput(form.recallDate) || null,
  //     equipmentId: form.deviceModel, 
  //     equipmentName: equipment?.name || form.deviceModel, 
  //     category: equipment?.category || "General", 
  //     careCenterName, 
  //     quantity: 1, 
  //     paymentType: form.mode, 
  //     rentalCharge: isNaN(rCharge) ? 0 : rCharge,
  //     depositAdvance: isNaN(dAdvance) ? 0 : dAdvance,
  //     installationCharge: isNaN(iCharge) ? 0 : iCharge,
  //     billingType: form.billingType || "Daily",
  //     deliveryAddress: form.deliveryAddress, 
  //     status: finalCalculatedStatus, 
  //     deliveryStatus: "Pending Dispatch",
  //     photoCount: photos.length
  //   });
  // };


  const handleSubmit = () => {
    if (!validate()) { 
      toast.error("Please fix the validation errors before saving."); 
      window.scrollTo({ top: 0, behavior: "smooth" }); 
      return; 
    }

    const deviceId = form.deviceModel || form.equipmentId || form.equipment_id;
    const equipment = equipmentCatalog.find((eq) => eq?.id === deviceId);
    
    let careCenterName = isCareCenterUser ? (matchedUserCenter?.name || loggedUser?.careCenterName || loggedUser?.name || "") : "Other";
    if (form.careCenterId !== "other" && !isCareCenterUser) {
      careCenterName = careCenters.find((c) => c?.id === (form.careCenterId || form.care_center_id))?.name || "";
    }

    const cleanLogout = formatForDateInput(form.logoutDate || form.logout_date);
    const today = todayISO();
    const finalCalculatedStatus = (cleanLogout && cleanLogout <= today) ? "Closed" : "Active";

    // 🛠️ Safe number parsing (Dono camelCase & snake_case check karega)
    const parseNum = (v1, v2) => {
      const val = (v1 !== undefined && v1 !== null && v1 !== "") ? v1 : v2;
      if (val === undefined || val === null || val === "") return 0;
      const n = parseFloat(val);
      return isNaN(n) ? 0 : n;
    };

    const rCharge = parseNum(form.rentalCharge, form.rental_charge);
    const dAdvance = parseNum(form.depositAdvance, form.deposit_advance);
    const iCharge = parseNum(form.installationCharge, form.installation_charge);

    onSubmit({
      ...form, 
      id: form.id,
      
      // Dates
      recordDate: formatForDateInput(form.recordDate || form.record_date) || todayISO(),
      record_date: formatForDateInput(form.recordDate || form.record_date) || todayISO(),
      startDate: formatForDateInput(form.loginDate || form.startDate || form.start_date) || todayISO(),
      start_date: formatForDateInput(form.loginDate || form.startDate || form.start_date) || todayISO(),
      logoutDate: cleanLogout || null,
      logout_date: cleanLogout || null,
      notifyDate: formatForDateInput(form.notifyDate || form.notify_date) || null,
      notify_date: formatForDateInput(form.notifyDate || form.notify_date) || null,
      recallDate: formatForDateInput(form.recallDate || form.recall_date) || null,
      recall_date: formatForDateInput(form.recallDate || form.recall_date) || null,

      // Equipment & Center
      careCenterId: form.careCenterId || form.care_center_id || null,
      care_center_id: form.careCenterId || form.care_center_id || null,
      careCenterName, 
      care_center_name: careCenterName,
      equipmentId: deviceId,
      equipment_id: deviceId, 
      equipmentName: equipment?.name || form.equipmentName || deviceId, 
      equipment_name: equipment?.name || form.equipmentName || deviceId, 
      category: equipment?.category || "General", 
      quantity: 1, 

      // 💳 Commercials (Dono keys provide kar di hain)
      billingType: form.billingType || form.billing_type || "Daily",
      billing_type: form.billingType || form.billing_type || "Daily",
      rentalCharge: rCharge,
      rental_charge: rCharge,
      depositAdvance: dAdvance,
      deposit_advance: dAdvance,
      installationCharge: iCharge,
      installation_charge: iCharge,

      // 👤 Patient Identity & Contact
      patientName: form.patientName || form.patient_name || "",
      patient_name: form.patientName || form.patient_name || "",
      age: form.age || "",
      attendantName: form.attendantName || form.attendant_name || "",
      attendant_name: form.attendantName || form.attendant_name || "",
      mobileNumber: form.mobileNumber || form.mobile_number || form.mobile || "",
      mobile_number: form.mobileNumber || form.mobile_number || form.mobile || "",
      altMobileNumber: form.altMobileNumber || form.alt_mobile_number || form.alternativeMobile || "",
      alt_mobile_number: form.altMobileNumber || form.alt_mobile_number || form.alternativeMobile || "",
      inchargeMobile: form.inchargeMobile || form.incharge_mobile || "",
      incharge_mobile: form.inchargeMobile || form.incharge_mobile || "",
      altMobile: form.altMobile || form.alt_mobile || "",
      alt_mobile: form.altMobile || form.alt_mobile || "",
      careAddress: form.careAddress || form.care_address || "",
      care_address: form.careAddress || form.care_address || "",
      deliveryAddress: form.deliveryAddress || form.delivery_address || "",
      delivery_address: form.deliveryAddress || form.delivery_address || "",
      bedNumber: form.bedNumber || form.bed_number || form.bedNo || "",
      bed_number: form.bedNumber || form.bed_number || form.bedNo || "",
      referralDoctor: form.referralDoctor || form.referral_doctor || form.referral || "",
      referral_doctor: form.referralDoctor || form.referral_doctor || form.referral || "",
      gstNumber: form.gstNumber || form.gst_number || form.gstNo || "",
      gst_number: form.gstNumber || form.gst_number || form.gstNo || "",
      accessory: form.accessory || form.accessories || form.selectAccessory || "",
      accessories: form.accessory || form.accessories || form.selectAccessory || "",
      notes: form.notes || form.note || "",

      // Status
      dealType: form.dealType || form.deal_type || "B2B",
      deal_type: form.dealType || form.deal_type || "B2B",
      unit: form.unit || "ODCOM",
      mode: form.mode || form.paymentType || "Postpaid",
      paymentType: form.mode || form.paymentType || "Postpaid",
      payment_type: form.mode || form.paymentType || "Postpaid",
      status: finalCalculatedStatus, 
      deliveryStatus: form.deliveryStatus || form.delivery_status || "Pending Dispatch",
      delivery_status: form.deliveryStatus || form.delivery_status || "Pending Dispatch",
      photoCount: photos.length
    });
  };
  return (
    <div className="fade-slide-up space-y-5">
      <GlobalPolish />
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onCancel} className="flex items-center gap-1.5 font-semibold text-slate-500 transition-colors hover:text-teal-600 cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Rental Master
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-semibold text-slate-700">
          {isEdit ? "Edit Asset Requisition" : "Log Asset Requisition"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-800">
            {isEdit ? "Edit Asset Requisition" : "Log Asset Requisition"}
          </h2>
          {form.id && <p className="text-xs text-slate-400 mt-0.5">Requisition ID: {form.id}</p>}
        </div>
        <div className="flex items-center gap-2">
          <GhostButton onClick={onCancel}>Discard</GhostButton>
        </div>
      </div>

      {/* Section 1: Record Types */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeading icon={Tag}>Record Types</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Deal Type" required error={errors.dealType}>
            <Select value={form.dealType} error={errors.dealType} onChange={(e) => set({ dealType: e.target.value })}>
              <option value="">--- Select ---</option>
              {DEAL_TYPE_OPTIONS.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
            </Select>
          </Field>
          <Field label="Unit" required error={errors.unit}>
            <Select value={form.unit} error={errors.unit} onChange={(e) => set({ unit: e.target.value })}>
              <option value="">--- Select ---</option>
              {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
            </Select>
          </Field>
          <Field label="Payment Mode" required error={errors.mode}>
            <Select value={form.mode} error={errors.mode} onChange={(e) => set({ mode: e.target.value, paymentType: e.target.value })}>
              <option value="">--- Select ---</option>
              {MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
          </Field>
        </div>
      </div>

      {/* Section 2: Asset Allocation & Logistics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
            <TextInput type="date" value={form.recordDate || ""} onChange={(e) => set({ recordDate: e.target.value })} />
          </Field>

          <Field label="Log In Date" required error={errors.loginDate}>
            <TextInput 
              type="date" 
              value={form.loginDate || ""} 
              error={errors.loginDate} 
              onChange={(e) => set({ loginDate: e.target.value })} 
            />
          </Field>
          
          <Field label="Notify Date" required={form.mode === "Prepaid"} error={errors.notifyDate}>
            <TextInput type="date" value={form.notifyDate || ""} error={errors.notifyDate} onChange={(e) => set({ notifyDate: e.target.value })} />
          </Field>
          
          <Field label="Log Out Date (Optional)" error={errors.logoutDate}>
            <TextInput 
              type="date" 
              value={form.logoutDate || ""} 
              min={formatForDateInput(form.loginDate)}
              error={errors.logoutDate}
              onChange={(e) => set({ logoutDate: e.target.value })} 
            />
          </Field>

          <Field label="Recall Date (Optional)" error={errors.recallDate}>
            <TextInput 
              type="date" 
              value={form.recallDate || ""} 
              min={minRecallDateAllowed || undefined}
              error={errors.recallDate}
              onChange={(e) => set({ recallDate: e.target.value })} 
            />
            {form.logoutDate && (
              <p className="mt-1 text-[11px] font-medium text-amber-600">
                Must be on or after {formatDisplayDate(minRecallDateAllowed)}
              </p>
            )}
          </Field>
        </div>
      </div>

      {/* Section 3: Commercials & Billing */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeading icon={CreditCard}>Commercials &amp; Billing</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Billing Type" required error={errors.billingType}>
            <Select value={form.billingType} error={errors.billingType} onChange={(e) => set({ billingType: e.target.value })}>
              <option value="Daily">Daily</option>
              <option value="Fortnight">Fortnight</option>
              <option value="Monthly">Monthly</option>
            </Select>
          </Field>
          <Field label="Rental Charge (₹)">
            <TextInput type="number" min={0} value={form.rentalCharge} onChange={(e) => set({ rentalCharge: e.target.value })} />
          </Field>
          <Field label="Deposit / Advance (₹)">
            <TextInput type="number" min={0} value={form.depositAdvance} onChange={(e) => set({ depositAdvance: e.target.value })} />
          </Field>
          <Field label="Installation Charge (₹)">
            <TextInput type="number" min={0} value={form.installationCharge} onChange={(e) => set({ installationCharge: e.target.value })} />
          </Field>
        </div>
      </div>

      {/* Section 4: Care Center & Patient Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading icon={Building2}>Care Center Contact Info</SectionHeading>
            <div className="space-y-4">
              <Field label="Care Center Name">
                <Select value={form.careCenterId} onChange={(e) => handleCareCenterChange(e.target.value)}>
                  {!isCareCenterUser && <option value="">-- Select Care Center --</option>}
                  {pageDropdownCareCenters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  {!isCareCenterUser && <option value="other">Other (Add New)</option>}
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Incharge Mobile" error={errors.inchargeMobile}>
                  <TextInput maxLength={10} value={form.inchargeMobile} error={errors.inchargeMobile} onChange={(e) => set({ inchargeMobile: e.target.value })} placeholder="10-digit number" />
                </Field>
                <Field label="Alt Mobile">
                  <TextInput maxLength={10} value={form.altMobile} onChange={(e) => set({ altMobile: e.target.value })} placeholder="Alternative mobile" />
                </Field>
              </div>

              <Field label="Care Address">
                <textarea rows={2} value={form.careAddress} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none resize-none border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" onChange={(e) => set({ careAddress: e.target.value })} />
              </Field>
              
              <div className="grid grid-cols-2 gap-4">
                <Field label="Bed No">
                  <TextInput value={form.bedNo} onChange={(e) => set({ bedNo: e.target.value })} />
                </Field>
                
                <Field label="Referral Doctor">
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
                <Field label="Patient Name" required error={errors.patientName}>
                  <TextInput value={form.patientName} error={errors.patientName} onChange={(e) => set({ patientName: e.target.value })} />
                </Field>
                <Field label="Age">
                  <TextInput type="number" min={0} value={form.age} onChange={(e) => set({ age: e.target.value })} />
                </Field>
              </div>
              <Field label="Attendant Name">
                <TextInput value={form.attendantName} onChange={(e) => set({ attendantName: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile Number">
                  <TextInput maxLength={10} value={form.mobileNumber} onChange={(e) => set({ mobileNumber: e.target.value })} />
                </Field>
                <Field label="Alt Mobile Number">
                  <TextInput maxLength={10} value={form.altMobileNumber} onChange={(e) => set({ altMobileNumber: e.target.value })} />
                </Field>
              </div>
              <Field label="Delivery Address">
                <textarea rows={3} value={form.deliveryAddress} onChange={(e) => set({ deliveryAddress: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Notes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Notes">
          <textarea rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })} className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 border-slate-200 focus:border-teal-500 resize-none" />
        </Field>
      </div>

      {/* Section 6: Photo Verification */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/30">
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
                  const isImage = file.type?.startsWith("image/");
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
        <PrimaryButton onClick={handleSubmit} className="px-6 py-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer">
          <Save className="h-4.5 w-4.5" /> {isEdit ? "Update Requisition Details" : "Save Requisition & Deploy"}
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
    const cleanUserPhone = String(loggedUser?.phone || "").replace(/\D/g, "").slice(-10);
    const cleanUserName = String(loggedUser?.careCenterName || loggedUser?.name || "").trim().toLowerCase();

    return careCenters.find((c) => {
      const cleanCcPhone = String(c?.phone || "").replace(/\D/g, "").slice(-10);
      const cleanCcName = String(c?.name || "").trim().toLowerCase();

      return (
        (c?.id && loggedUser?.careCenterId && String(c.id) === String(loggedUser.careCenterId)) ||
        (c?.id && loggedUser?.id && String(c.id) === String(loggedUser.id)) ||
        (cleanUserPhone && cleanCcPhone && cleanUserPhone === cleanCcPhone) ||
        (cleanUserName && cleanCcName && (cleanCcName.includes(cleanUserName) || cleanUserName.includes(cleanCcName)))
      );
    }) || {
      id: loggedUser?.careCenterId || loggedUser?.id || "CC-ME",
      name: loggedUser?.careCenterName || loggedUser?.name || "My Care Center"
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
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Both");
  const [dealTypeFilter, setDealTypeFilter] = useState("All");
  const [unitFilter, setUnitFilter] = useState("All"); 
  const [modeFilter, setModeFilter] = useState("All");
  const [careCenterFilter, setCareCenterFilter] = useState("All"); 
  
  const [sortField, setSortField] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const [viewDetailLog, setViewDetailLog] = useState(null); 
  const [pageForm, setPageForm] = useState(null); 

  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const scopedLogs = useMemo(() => {
    if (!isCareCenterUser) return logs;

    const myCenterId = String(matchedUserCenter?.id || loggedUser?.careCenterId || loggedUser?.id || "").trim().toLowerCase();
    const myCenterName = String(matchedUserCenter?.name || loggedUser?.careCenterName || loggedUser?.name || "").trim().toLowerCase();
    const myCenterIdNumeric = myCenterId.replace(/\D/g, "");

    return logs.filter((l) => {
      if (!l) return false;
      const ccId = String(l.careCenterId || l.care_center_id || "").trim().toLowerCase();
      const ccIdNumeric = ccId.replace(/\D/g, "");
      const ccName = String(l.careCenterName || l.care_center_name || careCenters.find((c) => String(c?.id) === String(ccId))?.name || ccId || "").trim().toLowerCase();

      const idMatch = (ccId && myCenterId && ccId === myCenterId) || (ccIdNumeric && myCenterIdNumeric && ccIdNumeric === myCenterIdNumeric);
      const nameMatch = (ccName && myCenterName && (ccName.includes(myCenterName) || myCenterName.includes(ccName)));

      return idMatch || nameMatch;
    });
  }, [logs, isCareCenterUser, matchedUserCenter, loggedUser, careCenters]);

  const filtered = useMemo(() => {
    const q = String(search || "").toLowerCase().trim();
    const sFilter = String(statusFilter || "Both").trim().toLowerCase();
    const today = todayISO();

    return (scopedLogs || [])
      .filter((l) => {
        if (!l) return false;

        const ccId = String(l.careCenterId || l.care_center_id || "");
        const ccObj = careCenters.find((c) => c && String(c.id) === ccId);
        const ccName = String(l.careCenterName || ccObj?.name || ccId || "");

        const eqId = String(l.equipmentId || l.equipment_id || "");
        const eqObj = equipmentCatalog.find((e) => e && String(e.id) === eqId);
        const eqName = String(l.equipmentName || eqObj?.name || eqId || "");

        const patient = String(l.patientName || l.patient_name || "");
        const inchargeMobile = String(l.inchargeMobile || l.incharge_mobile || l.phone || "");
        const logId = String(l.id || "");

        const matchesSearch = !q || 
          logId.toLowerCase().includes(q) || 
          eqName.toLowerCase().includes(q) || 
          patient.toLowerCase().includes(q) || 
          ccName.toLowerCase().includes(q) || 
          inchargeMobile.includes(q);
          
        const cleanLogout = formatForDateInput(l.logoutDate || l.logout_date);
        const isClosed = Boolean(cleanLogout && cleanLogout <= today);
        const computedStatus = isClosed ? "closed" : "active";
        
        const isStatusMatch = (sFilter === "both" || sFilter === "all")
          ? true
          : (sFilter === computedStatus);

        const dType = String(l.dealType || l.deal_type || "");
        const matchesDealType = dealTypeFilter === "All" || dType === dealTypeFilter;

        const unitVal = String(l.unit || "");
        const matchesUnit = unitFilter === "All" || unitVal === unitFilter;

        const modeVal = String(l.mode || l.paymentType || l.payment_type || "");
        const matchesMode = modeFilter === "All" || modeVal === modeFilter;

        const matchesCareCenter = isCareCenterUser || careCenterFilter === "All" || ccId === careCenterFilter;

        return matchesSearch && isStatusMatch && matchesDealType && matchesUnit && matchesMode && matchesCareCenter;
      })
      .sort((a, b) => {
        const tA = getSafeTime(a, sortField);
        const tB = getSafeTime(b, sortField);
        return sortOrder === "desc" ? tB - tA : tA - tB;
      });
  }, [scopedLogs, search, statusFilter, dealTypeFilter, unitFilter, modeFilter, careCenterFilter, sortField, sortOrder, careCenters, equipmentCatalog, isCareCenterUser]);

  const handleFormSubmit = async (data) => {
    try {
      let accStr = data.accessory || data.accessories || "";
      if (Array.isArray(accStr)) accStr = accStr.join(", ");

      const chosenMode = data.mode || data.paymentType || data.payment_type || "Postpaid";
      
      const rawCenterId = data.careCenterId || data.care_center_id || data.centerId || "";
      const finalCareCenterId = isCareCenterUser 
        ? (matchedUserCenter?.id || loggedUser?.careCenterId || loggedUser?.id || null)
        : (rawCenterId === "other" || rawCenterId === "NEW" ? null : rawCenterId || null);

      const finalCareCenterName = isCareCenterUser
        ? (matchedUserCenter?.name || loggedUser?.careCenterName || loggedUser?.name || "")
        : (data.careCenterName || data.care_center_name || "");

      const cleanLogout = formatForDateInput(data.logoutDate || data.logout_date);
      const cleanRecord = formatForDateInput(data.recordDate || data.record_date) || todayISO();
      const cleanStart = formatForDateInput(data.startDate || data.start_date || data.loginDate) || todayISO();
      const cleanRecall = formatForDateInput(data.recallDate || data.recall_date);
      const cleanNotify = formatForDateInput(data.notifyDate || data.notify_date);
      const today = todayISO();

      const parseVal = (v1, v2) => {
        const val = (v1 !== undefined && v1 !== null && v1 !== "") ? v1 : v2;
        if (val === undefined || val === null || val === "") return 0;
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
      };

      const rCharge = parseVal(data.rentalCharge, data.rental_charge);
      const dAdvance = parseVal(data.depositAdvance, data.deposit_advance);
      const iCharge = parseVal(data.installationCharge, data.installation_charge);
      const bType = data.billingType || data.billing_type || "Daily";

      const payload = {
        id: data.id,
        care_center_id: finalCareCenterId,
        careCenterId: finalCareCenterId,
        care_center_name: finalCareCenterName,
        careCenterName: finalCareCenterName,

        equipment_id: data.equipmentId || data.equipment_id || data.deviceModel || null,
        equipmentId: data.equipmentId || data.equipment_id || data.deviceModel || null,
        
        patient_name: String(data.patientName || data.patient_name || "").trim(),
        patientName: String(data.patientName || data.patient_name || "").trim(),
        quantity: 1,
        
        start_date: cleanStart,
        startDate: cleanStart,
        logout_date: cleanLogout || null,
        logoutDate: cleanLogout || null,
        status: (cleanLogout && cleanLogout <= today) ? "Closed" : "Active",
        
        billing_type: bType,
        billingType: bType,
        rental_charge: rCharge,
        rentalCharge: rCharge,
        deposit_advance: dAdvance,
        depositAdvance: dAdvance,
        installation_charge: iCharge,
        installationCharge: iCharge,
        
        age: String(data.age || "").trim(),
        attendant_name: String(data.attendantName || data.attendant_name || "").trim(),
        attendantName: String(data.attendantName || data.attendant_name || "").trim(),
        mobile_number: String(data.mobileNumber || data.mobile_number || data.mobile || "").trim(),
        mobileNumber: String(data.mobileNumber || data.mobile_number || data.mobile || "").trim(),
        alt_mobile_number: String(data.altMobileNumber || data.alt_mobile_number || "").trim(),
        altMobileNumber: String(data.altMobileNumber || data.alt_mobile_number || "").trim(),
        delivery_address: String(data.deliveryAddress || data.delivery_address || "").trim(),
        deliveryAddress: String(data.deliveryAddress || data.delivery_address || "").trim(),

        incharge_mobile: String(data.inchargeMobile || data.incharge_mobile || data.phone || "").trim(),
        inchargeMobile: String(data.inchargeMobile || data.incharge_mobile || data.phone || "").trim(),
        alt_mobile: String(data.altMobile || data.alt_mobile || "").trim(),
        altMobile: String(data.altMobile || data.alt_mobile || "").trim(),
        care_address: String(data.careAddress || data.care_address || "").trim(),
        careAddress: String(data.careAddress || data.care_address || "").trim(),
        bed_number: String(data.bedNo || data.bedNumber || data.bed_number || "").trim(),
        bedNo: String(data.bedNo || data.bedNumber || data.bed_number || "").trim(),
        referral_doctor: String(data.referral || data.referralDoctor || data.referral_doctor || "").trim(),
        referral: String(data.referral || data.referralDoctor || data.referral_doctor || "").trim(),
        gst_number: String(data.gstNo || data.gstNumber || data.gst_number || "").trim(),
        gstNo: String(data.gstNo || data.gstNumber || data.gst_number || "").trim(),
        
        deal_type: data.dealType || data.deal_type || "B2B",
        dealType: data.dealType || data.deal_type || "B2B",
        unit: data.unit || "ODCOM",
        mode: chosenMode,
        payment_type: chosenMode,
        paymentType: chosenMode,
        record_date: cleanRecord,
        recordDate: cleanRecord,
        notify_date: cleanNotify,
        notifyDate: cleanNotify,
        recall_date: cleanRecall,
        recallDate: cleanRecall,
        notes: data.notes || "",
        accessory: accStr,
        accessories: accStr
      };

      if (data.id) {
        await API.put(`/rental/requisitions/${data.id}`, payload);
        toast.success("Requisition updated successfully!");
      } else {
        await API.post("/rental/requisitions", payload);
        toast.success("Requisition created successfully!");
      }

      await fetchLogs();
      setPageForm(null);
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message)); 
    }
  };
  
  const handleFastClose = async (log) => {
    try {
      const today = todayISO();
      await API.put(`/rental/requisitions/${log.id}`, {
        ...log,
        status: "Closed",
        requisition_status: "Closed",
        logoutDate: today,
        logout_date: today
      });
      toast.success("Requisition marked as Closed!");
      await fetchLogs();
    } catch (err) {
      toast.error("Failed to close: " + (err.response?.data?.message || err.message));
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

  if (viewDetailLog !== null) {
    return (
      <RequisitionDetailView 
        log={viewDetailLog} 
        equipmentCatalog={equipmentCatalog}
        careCenters={careCenters}
        onBack={() => setViewDetailLog(null)}
      />
    );
  }

  if (pageForm !== null) {
    return (
      <RequisitionFormPage 
        initial={pageForm.data} 
        mode={pageForm.mode}
        careCenters={careCenters} 
        equipmentCatalog={equipmentCatalog} 
        references={references} 
        categories={categories} 
        onCancel={() => setPageForm(null)} 
        onSubmit={handleFormSubmit} 
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 fade-slide-up">
      <GlobalPolish />
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800">Rental Master Sheet</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Live view &amp; allocation of equipment requisitions</p>
        </div>

        {permissions.canAdd && (
          <PrimaryButton onClick={() => setPageForm({ mode: "add", data: null })} className="shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] px-4.5 py-2.5 cursor-pointer">
            <Plus className="h-4 w-4" /> New Log Requisition
          </PrimaryButton>
        )}
      </div>

      <KpiCards logs={scopedLogs} />
      
      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 w-full">
          
          <div className="group relative flex-[2] min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-500" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              autoComplete="off"
              placeholder="Search by ID, patient, device, mobile…" 
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20" 
            />
          </div>

          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400 hidden sm:block" />

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

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="flex-1 min-w-[120px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer"
          >
            <option value="Both">Status: Both</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          
          <select value={dealTypeFilter} onChange={(e) => setDealTypeFilter(e.target.value)} className="flex-1 min-w-[110px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
            <option value="All">All Deals</option>
            {DEAL_TYPE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="flex-1 min-w-[100px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
            <option value="All">All Units</option>
            {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>

          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="flex-1 min-w-[105px] rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-xs font-semibold text-slate-600 outline-none transition hover:border-teal-300 focus:border-teal-500 cursor-pointer">
            <option value="All">All Modes</option>
            {MODE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <button 
            type="button"
            onClick={() => setIsCalcModalOpen(true)}
            title="Open Total Days Calculator"
            className="flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:border-teal-300 transition cursor-pointer shrink-0 shadow-2xs"
          >
            <Calculator className="h-4 w-4" />
          </button>

          <button 
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("Both");
              setDealTypeFilter("All");
              setUnitFilter("All");
              setModeFilter("All");
              setCareCenterFilter("All");
              setSortField("startDate");
              setSortOrder("desc");
              fetchLogs();
              toast.success("Filters reset");
            }}
            title="Reset all filters"
            className="flex items-center justify-center h-9.5 w-9.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="smooth-scroll-x overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/90 text-xs font-bold uppercase tracking-wide text-slate-400 backdrop-blur">
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">Patient</th>
                
                <th 
                  onClick={() => handleSort("startDate")}
                  className="px-5 py-3 cursor-pointer hover:text-teal-700 transition select-none"
                  title="Click to sort by Login Date"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Login Date</span>
                    {sortField === "startDate" ? (
                      sortOrder === "desc" ? <ArrowDown className="h-3.5 w-3.5 text-teal-600" /> : <ArrowUp className="h-3.5 w-3.5 text-teal-600" />
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                    )}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort("logoutDate")}
                  className="px-5 py-3 cursor-pointer hover:text-teal-700 transition select-none"
                  title="Click to sort by Logout Date"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Logout Date</span>
                    {sortField === "logoutDate" ? (
                      sortOrder === "desc" ? <ArrowDown className="h-3.5 w-3.5 text-teal-600" /> : <ArrowUp className="h-3.5 w-3.5 text-teal-600" />
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                    )}
                  </div>
                </th>

                <th className="px-5 py-3">Total Days</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && filtered.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-5 w-28 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-32 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-10 bg-slate-100 rounded-md"></div></td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md ml-auto"></div></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100"><Search className="h-5 w-5 text-slate-400" /></div>
                    <p className="mt-3 text-sm font-semibold text-slate-500">No requisitions match your filters</p>
                    <p className="text-xs text-slate-400">Try adjusting the search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log, i) => {
                  const actualLogoutDate = formatForDateInput(log?.logoutDate || log?.logout_date);
                  const today = todayISO();
                  const isClosed = Boolean(actualLogoutDate && actualLogoutDate <= today);
                  const dynamicDaysFormatted = getDynamicTotalDays(log?.startDate || log?.start_date || log?.loginDate, actualLogoutDate);
                  const currentMode = log?.mode || log?.paymentType || log?.payment_type || "Postpaid";

                  const rowColor = currentMode === "Prepaid" 
                    ? "bg-emerald-50/70 hover:bg-emerald-100" 
                    : currentMode === "Postpaid" 
                    ? "bg-rose-50/70 hover:bg-rose-100"       
                    : "hover:bg-teal-50/40";                  

                  const eqId = log?.equipmentId || log?.equipment_id;
                  let actualDevice = eqId || log?.equipmentName || "—";
                  
                  const catMatch = equipmentCatalog.find(e => e?.id === eqId);
                  if (catMatch) actualDevice = catMatch.name;

                  const inchargePhone = log?.inchargeMobile || log?.incharge_mobile || log?.phone || "";
                  const altPhone = log?.altMobile || log?.alt_mobile || "";

                  return (
                    <tr 
                      key={log?.id || i} 
                      className={`rise-in group/row relative transition-colors duration-150 ${rowColor}`}
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-800">
                        {actualDevice}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800">{log?.patientName || log?.patient_name || "—"}</p>
                        {inchargePhone && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" /> {inchargePhone}
                            {altPhone && <span className="text-slate-400">/ {altPhone}</span>}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">
                        {formatDisplayDate(log?.startDate || log?.start_date || log?.loginDate)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {actualLogoutDate ? formatDisplayDate(actualLogoutDate) : "—"}
                      </td>
                      
                      <td className="px-5 py-3.5">
                        <span className={`font-bold px-2.5 py-1 rounded-md text-xs border shadow-xs ${
                          isClosed 
                            ? "bg-slate-100 text-slate-700 border-slate-200" 
                            : "bg-teal-50 text-teal-800 border-teal-200"
                        }`}>
                          {dynamicDaysFormatted}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">

                          {!isClosed && (
                            <IconAction 
                              title="Mark as Closed" 
                              tone="teal" 
                              onClick={() => handleFastClose(log)}
                            >
                              <PackageCheck className="h-4 w-4 text-emerald-600" />
                            </IconAction>
                          )}

                          <IconAction 
                            title="View Details" 
                            tone="teal" 
                            onClick={() => setViewDetailLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </IconAction>
                          
                          {permissions.canEdit && (
                            <IconAction 
                              title="Edit Requisition" 
                              tone="teal" 
                              onClick={() => setPageForm({ mode: "edit", data: log })}
                            >
                              <Pencil className="h-4 w-4" />
                            </IconAction>
                          )}

                          {permissions.canDelete && (
                            <IconAction 
                              title="Delete" 
                              tone="rose" 
                              onClick={() => setConfirmDelete(log)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </IconAction>
                          )}
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

      {isCalcModalOpen && (
        <CalculateTotalDaysModal 
          onClose={() => setIsCalcModalOpen(false)} 
        />
      )}

      <ConfirmDialog 
        open={!!confirmDelete} 
        title="Delete this requisition?" 
        message={confirmDelete ? `${confirmDelete.id} will be permanently removed. This cannot be undone.` : ""} 
        onCancel={() => setConfirmDelete(null)} 
        onConfirm={handleDelete} 
      />
    </div>
  );
}