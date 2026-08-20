// import { useMemo, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   Activity, 
//   PackageCheck, 
//   AlertTriangle, 
//   Wallet, 
//   TrendingUp, 
//   Package, 
//   Boxes, 
//   Building2, 
//   Layers, 
//   Truck, 
//   ChevronRight, 
//   ArrowUpRight, 
//   ArrowDownRight, 
//   Phone, 
//   CheckCircle2 
// } from "lucide-react";
// import { 
//   AreaChart, 
//   Area, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   PieChart, 
//   Pie, 
//   Cell 
// } from "recharts";
// import { trendData, DONUT_COLORS } from "../data/MockData";
// import { StatusBadge } from "../components/UiComponents";

// function GlobalPolish() {
//   return (
//     <style>{`
//       html { scroll-behavior: smooth; }
//       .smooth-scroll, .smooth-scroll-x { scroll-behavior: smooth; }
//       .smooth-scroll::-webkit-scrollbar,
//       .smooth-scroll-x::-webkit-scrollbar { width: 6px; height: 6px; }
//       .smooth-scroll::-webkit-scrollbar-track,
//       .smooth-scroll-x::-webkit-scrollbar-track { background: transparent; }
//       .smooth-scroll::-webkit-scrollbar-thumb,
//       .smooth-scroll-x::-webkit-scrollbar-thumb {
//         background-color: rgba(13, 148, 136, 0.25);
//         border-radius: 9999px;
//       }
//       .smooth-scroll:hover::-webkit-scrollbar-thumb,
//       .smooth-scroll-x:hover::-webkit-scrollbar-thumb { background-color: rgba(13, 148, 136, 0.45); }
//       .smooth-scroll, .smooth-scroll-x { scrollbar-width: thin; scrollbar-color: rgba(13,148,136,0.3) transparent; }

//       @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       .rise-in { animation: riseIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }

//       @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.98) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
//       .fade-slide-up { animation: fadeScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both; }

//       /* Card lift on hover, kept subtle so it doesn't feel jumpy */
//       .stat-card {
//         transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
//       }
//       .stat-card:hover {
//         transform: translateY(-3px);
//         border-color: rgba(13, 148, 136, 0.25);
//       }
//       .stat-card:hover .stat-icon {
//         transform: scale(1.08) rotate(-4deg);
//       }
//       .stat-icon {
//         transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
//       }

//       /* Live pulse for the "Active" delta chip / status */
//       @keyframes softPulse {
//         0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35); }
//         50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
//       }
//       .live-dot { animation: softPulse 2.2s ease-in-out infinite; }

//       /* Row stagger for lists */
//       @keyframes rowIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
//       .row-in { animation: rowIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

//       .req-row { transition: background-color 0.2s ease, transform 0.2s ease; }
//       .req-row:hover { transform: translateX(2px); }

//       /* Low stock bar fill animation */
//       @keyframes fillBar { from { width: 0%; } }
//       .stock-fill { animation: fillBar 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }

//       .panel-card { transition: box-shadow 0.28s ease, transform 0.28s ease; }
//       .panel-card:hover { box-shadow: 0 10px 28px -10px rgba(15, 23, 42, 0.1); }

//       /* Page backdrop: a whisper of color, not a wash */
//       .dash-backdrop {
//         background:
//           radial-gradient(60% 50% at 12% 0%, rgba(13, 148, 136, 0.07), transparent 60%),
//           radial-gradient(45% 40% at 100% 8%, rgba(99, 102, 241, 0.06), transparent 60%);
//       }

//       /* Colored top accent + tinted glow per stat tone */
//       .stat-card { position: relative; overflow: hidden; }
//       .stat-card::before {
//         content: "";
//         position: absolute;
//         top: 0; left: 0; right: 0;
//         height: 3px;
//         background: var(--accent-grad);
//         opacity: 0.9;
//       }
//       .stat-card:hover {
//         box-shadow: 0 14px 30px -14px var(--accent-glow, rgba(13, 148, 136, 0.35));
//       }

//       .icon-glow {
//         background: var(--accent-grad);
//         color: white;
//         box-shadow: 0 6px 14px -4px var(--accent-glow, rgba(13, 148, 136, 0.45));
//       }

//       /* Signature card — revenue gets a quiet premium treatment */
//       .signature-card {
//         background: linear-gradient(155deg, #0f172a 0%, #134e4a 55%, #0d9488 130%);
//         border-color: transparent;
//       }
//       .signature-card::before { background: linear-gradient(90deg, #5eead4, #a5b4fc); }
//       .signature-card .stat-label { color: rgba(226, 232, 240, 0.65); }
//       .signature-card .stat-value { color: #f8fafc; }
//       .signature-card .icon-glow {
//         background: rgba(255, 255, 255, 0.14);
//         box-shadow: none;
//         backdrop-filter: blur(2px);
//       }
//       .signature-card .delta-chip {
//         background: rgba(94, 234, 212, 0.16);
//         color: #5eead4;
//       }

//       .eyebrow {
//         display: inline-flex;
//         align-items: center;
//         gap: 0.35rem;
//         font-size: 10px;
//         font-weight: 800;
//         letter-spacing: 0.08em;
//         text-transform: uppercase;
//       }

//       @media (prefers-reduced-motion: reduce) {
//         .rise-in, .fade-slide-up, .row-in, .stock-fill { animation: none !important; }
//         .stat-card, .stat-card:hover, .stat-icon, .req-row, .panel-card { transition: none !important; transform: none !important; }
//         .live-dot { animation: none !important; }
//       }
//     `}</style>
//   );
// }

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

// const todayISO = () => new Date().toISOString().slice(0, 10);

// const getLogStatus = (l) => {
//   if (!l) return "Pending";
//   const rawStatus = String(l.status || l.requisition_status || "").trim().toLowerCase();
//   if (rawStatus === "inactive") return "Inactive";
//   if (rawStatus === "returned" || rawStatus === "closed") return "Closed";

//   const cleanLogout = formatForDateInput(l.logoutDate || l.logout_date || l.end_date);
//   const today = todayISO();

//   if (cleanLogout && cleanLogout <= today) {
//     return "Closed";
//   }
//   return "Active";
// };

// /**
//  * Lightweight count-up used for the stat values. No external deps —
//  * eases from 0 (or the previous value) to the target whenever it changes.
//  * Falls back instantly for non-numeric values (e.g. currency strings handled by caller).
//  */
// function useCountUp(target, duration = 700) {
//   const [value, setValue] = useState(0);
//   const frame = useRef(null);
//   const fromRef = useRef(0);

//   useEffect(() => {
//     const from = fromRef.current;
//     const to = Number(target) || 0;
//     const start = performance.now();

//     const tick = (now) => {
//       const elapsed = now - start;
//       const progress = Math.min(elapsed / duration, 1);
//       // ease-out cubic
//       const eased = 1 - Math.pow(1 - progress, 3);
//       const current = from + (to - from) * eased;
//       setValue(current);
//       if (progress < 1) {
//         frame.current = requestAnimationFrame(tick);
//       } else {
//         fromRef.current = to;
//       }
//     };

//     frame.current = requestAnimationFrame(tick);
//     return () => frame.current && cancelAnimationFrame(frame.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [target]);

//   return value;
// }

// function DashboardStat({ label, value, icon: Icon, tone, delta, deltaUp, numericValue, formatValue, index = 0, signature = false }) {
//   const accentMap = {
//     teal: { grad: "linear-gradient(135deg, #14b8a6, #0d9488)", glow: "rgba(13, 148, 136, 0.35)" },
//     slate: { grad: "linear-gradient(135deg, #64748b, #334155)", glow: "rgba(51, 65, 85, 0.28)" },
//     indigo: { grad: "linear-gradient(135deg, #818cf8, #6366f1)", glow: "rgba(99, 102, 241, 0.35)" },
//     amber: { grad: "linear-gradient(135deg, #fbbf24, #d97706)", glow: "rgba(217, 119, 6, 0.32)" },
//     rose: { grad: "linear-gradient(135deg, #fb7185, #e11d48)", glow: "rgba(225, 29, 72, 0.32)" },
//   };
//   const accent = accentMap[tone] || accentMap.teal;

//   const animated = useCountUp(numericValue ?? 0, 750);
//   const displayValue = typeof numericValue === "number" && formatValue
//     ? formatValue(animated)
//     : value;

//   return (
//     <div
//       className={`stat-card rise-in rounded-2xl border p-5 shadow-xs ${signature ? "signature-card" : "border-slate-200 bg-white"}`}
//       style={{ animationDelay: `${index * 70}ms`, "--accent-grad": accent.grad, "--accent-glow": accent.glow }}
//     >
//       <div className="flex items-start justify-between">
//         <div className="stat-icon icon-glow grid h-11 w-11 place-items-center rounded-xl">
//           <Icon className="h-5 w-5" />
//         </div>
//         {delta && (
//           <span className={`delta-chip flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
//             signature ? "" : deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
//           } ${deltaUp ? "live-dot" : ""}`}>
//             {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
//             {delta}
//           </span>
//         )}
//       </div>
//       <p className={`stat-value mt-4 font-display text-2xl font-extrabold tabular-nums sm:text-3xl ${signature ? "" : "text-slate-800"}`}>
//         {displayValue}
//       </p>
//       <p className={`stat-label mt-0.5 text-xs font-semibold uppercase tracking-wide ${signature ? "" : "text-slate-400"}`}>{label}</p>
//     </div>
//   );
// }

// export default function AdminDashboard({ 
//   logs = [], 
//   careCenters = [], 
//   equipmentCatalog = [], 
//   deliveryExecutives = [], 
//   onNavigate 
// }) {
//   const navigate = useNavigate();

//   const loggedUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);

//   const isCareCenterUser = loggedUser?.role === "care_center";

//   const matchedCareCenter = useMemo(() => {
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
//       id: loggedUser.careCenterId || loggedUser.id || "CC-ME",
//       name: loggedUser.careCenterName || loggedUser.name || "My Care Center",
//       phone: loggedUser.phone || "",
//       address: ""
//     };
//   }, [careCenters, isCareCenterUser, loggedUser]);

//   const scopedLogs = useMemo(() => {
//     if (!isCareCenterUser) return logs || [];

//     const myCenterId = String(matchedCareCenter?.id || loggedUser.careCenterId || loggedUser.id || "").trim().toLowerCase();
//     const myCenterName = String(matchedCareCenter?.name || loggedUser.careCenterName || loggedUser.name || "").trim().toLowerCase();
//     const myCenterIdNumeric = myCenterId.replace(/\D/g, "");

//     return (logs || []).filter((l) => {
//       if (!l) return false;
//       const ccId = String(l.careCenterId || l.care_center_id || "").trim().toLowerCase();
//       const ccIdNumeric = ccId.replace(/\D/g, "");
//       const ccName = String(l.careCenterName || l.care_center_name || careCenters.find((c) => String(c.id) === String(ccId))?.name || ccId || "").trim().toLowerCase();

//       const idMatch = (ccId && myCenterId && ccId === myCenterId) || (ccIdNumeric && myCenterIdNumeric && ccIdNumeric === myCenterIdNumeric);
//       const nameMatch = (ccName && myCenterName && (ccName.includes(myCenterName) || myCenterName.includes(ccName)));

//       return idMatch || nameMatch;
//     });
//   }, [logs, isCareCenterUser, matchedCareCenter, loggedUser, careCenters]);

//   const activeCount = scopedLogs.filter((l) => getLogStatus(l) === "Active").length;
//   const closedCount = scopedLogs.filter((l) => getLogStatus(l) === "Closed").length;
//   const inactiveCount = scopedLogs.filter((l) => getLogStatus(l) === "Inactive").length;

//   const revenue = scopedLogs.reduce((sum, l) => {
//     const eqId = l.equipmentId || l.equipment_id;
//     const eq = equipmentCatalog.find((e) => String(e.id) === String(eqId));
//     const rate = Number(l.rentalCharge ?? l.rental_charge ?? l.rent ?? l.daily_rate ?? eq?.dailyRate ?? eq?.daily_rate ?? 0);
//     return sum + (rate * (Number(l.quantity) || 1));
//   }, 0);

//   const categoryData = useMemo(() => {
//     const map = {};
//     scopedLogs.forEach((l) => {
//       const cat = l.category || "General";
//       map[cat] = (map[cat] || 0) + (Number(l.quantity) || 1);
//     });
//     const result = Object.entries(map).map(([name, value]) => ({ name, value }));
//     return result.length > 0 ? result : [{ name: "No Active Units", value: 1 }];
//   }, [scopedLogs]);

//   const lowStock = equipmentCatalog.filter((e) => Number(e.stock || 0) < 10).sort((a, b) => (a.stock || 0) - (b.stock || 0));
//   const careCenterName = (id) => careCenters.find((c) => String(c.id) === String(id))?.name || (isCareCenterUser ? (matchedCareCenter?.name || "My Center") : "—");
//   const recentLogs = [...scopedLogs].slice(0, 5);

//   const handleNavigateToRental = () => {
//     if (typeof onNavigate === "function") {
//       onNavigate("/rental");
//     } else {
//       navigate("/rental");
//     }
//   };

//   return (
//     <div className="dash-backdrop -m-4 space-y-5 rounded-3xl p-4 fade-slide-up sm:-m-6 sm:p-6">
//       <GlobalPolish />
      
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className="icon-glow grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
//             style={{ "--accent-grad": "linear-gradient(135deg, #14b8a6, #0d9488)", "--accent-glow": "rgba(13,148,136,0.35)" }}
//           >
//             <Activity className="h-5 w-5" />
//           </div>
//           <div>
//             <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800">
//               {isCareCenterUser ? `${matchedCareCenter?.name || "Facility"} Dashboard` : "Analytics Overview"}
//             </h1>
//             <p className="text-xs font-medium text-slate-400">
//               Live overview of medical asset allocations and billing metrics
//             </p>
//           </div>
//         </div>
//         <span className="live-dot eyebrow w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-600">
//           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//           Live data
//         </span>
//       </div>

//       <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//         <DashboardStat 
//           index={0}
//           label={isCareCenterUser ? "Active Leases" : "Active Rentals"} 
//           value={activeCount} 
//           numericValue={activeCount}
//           formatValue={(v) => Math.round(v).toLocaleString("en-IN")}
//           icon={Activity} 
//           tone="teal" 
//           delta="Active" 
//           deltaUp 
//         />
//         <DashboardStat 
//           index={1}
//           label="Closed / Returned" 
//           value={closedCount} 
//           numericValue={closedCount}
//           formatValue={(v) => Math.round(v).toLocaleString("en-IN")}
//           icon={PackageCheck} 
//           tone="slate" 
//           delta="Completed" 
//           deltaUp 
//         />
//         <DashboardStat 
//           index={2}
//           label="Inactive Alerts" 
//           value={inactiveCount} 
//           numericValue={inactiveCount}
//           formatValue={(v) => Math.round(v).toLocaleString("en-IN")}
//           icon={AlertTriangle} 
//           tone="rose" 
//           delta="Review" 
//           deltaUp={false} 
//         />
//         <DashboardStat 
//           index={3}
//           label={isCareCenterUser ? "Active Billing" : "Est. Rental Revenue"} 
//           value={`₹${revenue.toLocaleString("en-IN")}`} 
//           numericValue={revenue}
//           formatValue={(v) => `₹${Math.round(v).toLocaleString("en-IN")}`}
//           icon={Wallet} 
//           tone="indigo" 
//           delta="Live" 
//           deltaUp 
//           signature
//         />
//       </div>

//       <div className="grid gap-4 lg:grid-cols-3">
//         <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2" style={{ animationDelay: "120ms" }}>
//           <div className="mb-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div
//                 className="icon-glow grid h-9 w-9 shrink-0 place-items-center rounded-xl"
//                 style={{ "--accent-grad": "linear-gradient(135deg, #14b8a6, #0d9488)", "--accent-glow": "rgba(13,148,136,0.35)" }}
//               >
//                 <TrendingUp className="h-4 w-4" />
//               </div>
//               <div>
//                 <h3 className="font-display text-sm font-bold text-slate-700">Requisition Volume</h3>
//                 <p className="text-xs text-slate-400">
//                   {isCareCenterUser ? `Activity for ${matchedCareCenter?.name || "your care center"}` : "Last 7 days across all care centers"}
//                 </p>
//               </div>
//             </div>
//             <span className="hidden items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-600 sm:flex">
//               <ArrowUpRight className="h-3 w-3" /> Trending up
//             </span>
//           </div>
//           <div className="h-64 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
//                     <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
//                 <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
//                 <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
//                 <Area
//                   type="monotone"
//                   dataKey="requisitions"
//                   stroke="#0d9488"
//                   strokeWidth={2.5}
//                   fill="url(#trendFill)"
//                   isAnimationActive={true}
//                   animationDuration={900}
//                   animationEasing="ease-out"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "170ms" }}>
//           <div className="flex items-center gap-3">
//             <div
//               className="icon-glow grid h-9 w-9 shrink-0 place-items-center rounded-xl"
//               style={{ "--accent-grad": "linear-gradient(135deg, #818cf8, #6366f1)", "--accent-glow": "rgba(99,102,241,0.35)" }}
//             >
//               <Layers className="h-4 w-4" />
//             </div>
//             <div>
//               <h3 className="font-display text-sm font-bold text-slate-700">Equipment by Category</h3>
//               <p className="text-xs text-slate-400">Units currently on rent</p>
//             </div>
//           </div>
//           <div className="h-56 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   dataKey="value"
//                   nameKey="name"
//                   innerRadius={50}
//                   outerRadius={75}
//                   paddingAngle={3}
//                   isAnimationActive={true}
//                   animationBegin={100}
//                   animationDuration={700}
//                   animationEasing="ease-out"
//                 >
//                   {categoryData.map((_, i) => (
//                     <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="space-y-1.5 max-h-24 overflow-y-auto smooth-scroll pr-1">
//             {categoryData.map((c, i) => (
//               <div key={c.name} className="flex items-center justify-between text-xs transition-colors hover:text-slate-700">
//                 <span className="flex items-center gap-1.5 text-slate-500">
//                   <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
//                   {c.name}
//                 </span>
//                 <span className="font-semibold text-slate-600">{c.value} units</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-4 lg:grid-cols-3">
//         <div className="panel-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2 rise-in" style={{ animationDelay: "220ms" }}>
          
//           {/* Header with Direct Route Navigation */}
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <h3 className="font-display text-sm font-bold text-slate-700">
//               {isCareCenterUser ? "My Center's Recent Requisitions" : "Recent Requisitions"}
//             </h3>
//             <button 
//               type="button"
//               onClick={handleNavigateToRental} 
//               className="group flex items-center gap-1 text-xs font-bold text-teal-600 transition hover:text-teal-700 hover:underline cursor-pointer"
//             >
//               View All <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
//             </button>
//           </div>

//           <div className="divide-y divide-slate-100">
//             {recentLogs.length === 0 ? (
//               <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
//                 <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-300">
//                   <Package className="h-5 w-5" />
//                 </div>
//                 <p className="text-xs text-slate-400">No recent requisitions logged yet.</p>
//               </div>
//             ) : (
//               recentLogs.map((log, i) => {
//                 const currentStatus = getLogStatus(log);
//                 const ccId = log.careCenterId || log.care_center_id;
//                 const eqId = log.equipmentId || log.equipment_id;
//                 const eqName = log.equipmentName || equipmentCatalog.find(e => String(e.id) === String(eqId))?.name || eqId || "Equipment";
//                 const pName = log.patientName || log.patient_name || log.patient || "Patient";

//                 return (
//                   <div
//                     key={log.id}
//                     className="req-row row-in flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/70"
//                     style={{ animationDelay: `${260 + i * 60}ms` }}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 ring-1 ring-teal-100/70">
//                         <Package className="h-4.5 w-4.5" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-slate-800">
//                           {eqName} <span className="font-normal text-slate-400">({pName})</span>
//                         </p>
//                         <p className="text-xs text-slate-400">
//                           {log.id} · {careCenterName(ccId)}
//                         </p>
//                       </div>
//                     </div>
//                     <StatusBadge status={currentStatus} glow={currentStatus === "Active"} />
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>

//         <div className="space-y-4">
//           {!isCareCenterUser ? (
//             <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "260ms" }}>
//               <h3 className="font-display text-sm font-bold text-slate-700">Low Stock Alerts</h3>
//               <p className="mb-3 text-xs text-slate-400">Equipment below 10 units</p>
//               <div className="space-y-3">
//                 {lowStock.slice(0, 4).map((eq, i) => {
//                   const pct = Math.min(100, Math.max(6, (Number(eq.stock) || 0) * 10));
//                   return (
//                     <div key={eq.id} className="row-in" style={{ animationDelay: `${300 + i * 70}ms` }}>
//                       <div className="mb-1 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
//                             <Boxes className="h-3.5 w-3.5" />
//                           </div>
//                           <span className="text-xs font-medium text-slate-600">{eq.name}</span>
//                         </div>
//                         <span className="text-xs font-bold text-amber-600">{eq.stock} left</span>
//                       </div>
//                       <div className="ml-9 h-1.5 w-[calc(100%-2.25rem)] overflow-hidden rounded-full bg-amber-50">
//                         <div
//                           className="stock-fill h-full rounded-full bg-amber-400"
//                           style={{ width: `${pct}%`, animationDelay: `${340 + i * 70}ms` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//                 {lowStock.length === 0 && <p className="text-xs text-slate-400">All equipment well stocked.</p>}
//               </div>
//             </div>
//           ) : (
//             <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "260ms" }}>
//               <h3 className="font-display text-sm font-bold text-slate-700">Facility Information</h3>
//               <p className="mb-3 text-xs text-slate-400">Registered center credentials</p>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-slate-500">Center Name</span>
//                   <span className="font-bold text-slate-700 truncate max-w-[140px]">{matchedCareCenter?.name}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-slate-500">Registered Hotline</span>
//                   <span className="font-semibold text-slate-700 flex items-center gap-1">
//                     <Phone className="h-3 w-3 text-slate-400" /> {matchedCareCenter?.phone || loggedUser?.phone || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-slate-500">Account Status</span>
//                   <span className="live-dot inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
//                     <CheckCircle2 className="h-3 w-3" /> Active Partner
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "320ms" }}>
//             <h3 className="font-display text-sm font-bold text-slate-700">
//               {isCareCenterUser ? "Facility Summary" : "Network Snapshot"}
//             </h3>
//             <div className="mt-3 space-y-3">
//               {!isCareCenterUser ? (
//                 <>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-slate-500"><Building2 className="h-4 w-4 text-teal-500" /> Care Centers</span>
//                     <span className="font-bold text-slate-700">{careCenters.length}</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-slate-500"><Layers className="h-4 w-4 text-indigo-500" /> Equipment SKUs</span>
//                     <span className="font-bold text-slate-700">{equipmentCatalog.length}</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-slate-500"><Truck className="h-4 w-4 text-amber-500" /> Delivery Executives</span>
//                     <span className="font-bold text-slate-700">{deliveryExecutives.length}</span>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-slate-500"><Activity className="h-4 w-4 text-teal-500" /> Active Devices</span>
//                     <span className="font-bold text-slate-700">{activeCount}</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-slate-500"><Package className="h-4 w-4 text-indigo-500" /> Total Requisitions</span>
//                     <span className="font-bold text-slate-700">{scopedLogs.length}</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-2 text-slate-500"><PackageCheck className="h-4 w-4 text-slate-500" /> Completed Returns</span>
//                     <span className="font-bold text-slate-700">{closedCount}</span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  PackageCheck, 
  AlertTriangle, 
  Wallet, 
  TrendingUp, 
  Package, 
  Boxes, 
  Building2, 
  Layers, 
  Truck, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Phone, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { trendData, DONUT_COLORS } from "../data/MockData";
import { StatusBadge } from "../components/UiComponents";

function GlobalPolish() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      .smooth-scroll, .smooth-scroll-x { scroll-behavior: smooth; }
      .smooth-scroll::-webkit-scrollbar,
      .smooth-scroll-x::-webkit-scrollbar { width: 6px; height: 6px; }
      .smooth-scroll::-webkit-scrollbar-track,
      .smooth-scroll-x::-webkit-scrollbar-track { background: transparent; }
      .smooth-scroll::-webkit-scrollbar-thumb,
      .smooth-scroll-x::-webkit-scrollbar-thumb {
        background-color: rgba(13, 148, 136, 0.25);
        border-radius: 9999px;
      }
      .smooth-scroll:hover::-webkit-scrollbar-thumb,
      .smooth-scroll-x:hover::-webkit-scrollbar-thumb { background-color: rgba(13, 148, 136, 0.45); }
      .smooth-scroll, .smooth-scroll-x { scrollbar-width: thin; scrollbar-color: rgba(13,148,136,0.3) transparent; }

      @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .rise-in { animation: riseIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }

      @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.98) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .fade-slide-up { animation: fadeScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .stat-card {
        transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
      }
      .stat-card:hover {
        transform: translateY(-3px);
        border-color: rgba(13, 148, 136, 0.25);
      }
      .stat-card:hover .stat-icon {
        transform: scale(1.08) rotate(-4deg);
      }
      .stat-icon {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      @keyframes softPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35); }
        50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
      }
      .live-dot { animation: softPulse 2.2s ease-in-out infinite; }

      @keyframes rowIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
      .row-in { animation: rowIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .req-row { transition: background-color 0.2s ease, transform 0.2s ease; }
      .req-row:hover { transform: translateX(2px); }

      @keyframes fillBar { from { width: 0%; } }
      .stock-fill { animation: fillBar 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .panel-card { transition: box-shadow 0.28s ease, transform 0.28s ease; }
      .panel-card:hover { box-shadow: 0 10px 28px -10px rgba(15, 23, 42, 0.1); }

      .dash-backdrop {
        background:
          radial-gradient(60% 50% at 12% 0%, rgba(13, 148, 136, 0.07), transparent 60%),
          radial-gradient(45% 40% at 100% 8%, rgba(99, 102, 241, 0.06), transparent 60%);
      }

      .stat-card { position: relative; overflow: hidden; }
      .stat-card::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: var(--accent-grad);
        opacity: 0.9;
      }
      .stat-card:hover {
        box-shadow: 0 14px 30px -14px var(--accent-glow, rgba(13, 148, 136, 0.35));
      }

      .icon-glow {
        background: var(--accent-grad);
        color: white;
        box-shadow: 0 6px 14px -4px var(--accent-glow, rgba(13, 148, 136, 0.45));
      }

      .signature-card {
        background: linear-gradient(155deg, #0f172a 0%, #134e4a 55%, #0d9488 130%);
        border-color: transparent;
      }
      .signature-card::before { background: linear-gradient(90deg, #5eead4, #a5b4fc); }
      .signature-card .stat-label { color: rgba(226, 232, 240, 0.65); }
      .signature-card .stat-value { color: #f8fafc; }
      .signature-card .icon-glow {
        background: rgba(255, 255, 255, 0.14);
        box-shadow: none;
        backdrop-filter: blur(2px);
      }
      .signature-card .delta-chip {
        background: rgba(94, 234, 212, 0.16);
        color: #5eead4;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      @media (prefers-reduced-motion: reduce) {
        .rise-in, .fade-slide-up, .row-in, .stock-fill { animation: none !important; }
        .stat-card, .stat-card:hover, .stat-icon, .req-row, .panel-card { transition: none !important; transform: none !important; }
        .live-dot { animation: none !important; }
      }
    `}</style>
  );
}

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
  const parts = clean.split("-");
  if (parts.length !== 3) return "—";
  const [y, m, day] = parts;
  return `${day}/${m}/${y}`;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const calculateRentalDays = (loginStr, logoutStr, recallStr = null) => {
  const cleanLogin = formatForDateInput(loginStr);
  if (!cleanLogin) return "—";

  const [sY, sM, sD] = cleanLogin.split("-").map(Number);
  const startUtc = Date.UTC(sY, sM - 1, sD);

  const cleanRecall = formatForDateInput(recallStr);
  const cleanLogout = formatForDateInput(logoutStr);

  const todayStr = todayISO();
  const [tY, tM, tD] = todayStr.split("-").map(Number);
  const todayUtc = Date.UTC(tY, tM - 1, tD);

  let endUtc = todayUtc;
  if (cleanRecall) {
    const [rY, rM, rD] = cleanRecall.split("-").map(Number);
    endUtc = Date.UTC(rY, rM - 1, rD);
  } else if (cleanLogout) {
    const [lY, lM, lD] = cleanLogout.split("-").map(Number);
    endUtc = Date.UTC(lY, lM - 1, lD);
  }

  let totalDays = Math.floor((endUtc - startUtc) / 86400000) + 1;
  if (totalDays < 1) totalDays = 1;

  let actualUsageEndUtc = todayUtc;
  if (cleanRecall) {
    const [rY, rM, rD] = cleanRecall.split("-").map(Number);
    actualUsageEndUtc = Date.UTC(rY, rM - 1, rD);
  } else if (cleanLogout) {
    const [lY, lM, lD] = cleanLogout.split("-").map(Number);
    const logoutUtc = Date.UTC(lY, lM - 1, lD);
    actualUsageEndUtc = logoutUtc < todayUtc ? logoutUtc : todayUtc;
  }

  const curMonthStartUtc = Date.UTC(tY, tM - 1, 1);
  const nextMonthFirstUtc = Date.UTC(tY, tM, 1);
  const curMonthEndUtc = nextMonthFirstUtc - 86400000;

  const overlapStartUtc = Math.max(startUtc, curMonthStartUtc);
  const overlapEndUtc = Math.min(actualUsageEndUtc, curMonthEndUtc);

  let currentMonthDays = 0;
  if (overlapStartUtc <= overlapEndUtc && startUtc <= curMonthEndUtc && actualUsageEndUtc >= curMonthStartUtc) {
    currentMonthDays = Math.floor((overlapEndUtc - overlapStartUtc) / 86400000) + 1;
    if (currentMonthDays < 0) currentMonthDays = 0;
  }

  return `${totalDays} / ${currentMonthDays}`;
};

const getDynamicTotalDays = (loginStr, logoutStr, recallStr = null) => {
  return calculateRentalDays(loginStr, logoutStr, recallStr);
};

const getLogStatus = (l) => {
  if (!l) return "Pending";
  const rawStatus = String(l.status || l.requisition_status || "").trim().toLowerCase();
  if (rawStatus === "inactive") return "Inactive";
  if (rawStatus === "returned" || rawStatus === "closed") return "Closed";

  const cleanLogout = formatForDateInput(l.logoutDate || l.logout_date || l.end_date);
  const today = todayISO();

  if (cleanLogout && cleanLogout <= today) {
    return "Closed";
  }
  return "Active";
};

// 🔍 Dedicated Details Page for clicked requisition
function RequisitionDetailView({ log, equipmentCatalog = [], careCenters = [], onBack }) {
  const eqId = log?.equipmentId || log?.equipment_id || log?.deviceModel;
  const equipmentName = equipmentCatalog.find(e => String(e?.id) === String(eqId))?.name || log?.equipmentName || log?.equipment_name || eqId || "—";
  
  const ccId = log?.careCenterId || log?.care_center_id;
  const careCenterObj = careCenters.find(c => String(c?.id) === String(ccId));
  const careCenterName = log?.careCenterName || log?.care_center_name || careCenterObj?.name || ccId || "—";

  const cleanLogout = formatForDateInput(log?.logoutDate || log?.logout_date || log?.end_date);
  const cleanRecall = formatForDateInput(log?.recallDate || log?.recall_date);
  const today = todayISO();
  const isInactive = String(log?.status || "").toLowerCase() === "inactive";
  const isClosed = Boolean(cleanRecall && cleanRecall <= today);
  
  const statusLabel = isInactive ? "Inactive" : (isClosed ? "Closed" : "Active");

  const statusColor = isInactive
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : isClosed
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const billingTypeVal = log?.billingType || log?.billing_type || log?.billing || "Daily";
  const rentalChargeVal = Number(log?.rentalCharge ?? log?.rental_charge ?? log?.rent ?? log?.daily_rate ?? log?.dailyRate ?? 0).toFixed(2);
  const depositAdvanceVal = Number(log?.depositAdvance ?? log?.deposit_advance ?? log?.deposit ?? log?.advance ?? 0).toFixed(2);
  const installationChargeVal = Number(log?.installationCharge ?? log?.installation_charge ?? log?.installation ?? 0).toFixed(2);

  const patientNameVal = log?.patientName || log?.patient_name || log?.patient || "—";
  const mobileNumberVal = log?.mobileNumber || log?.mobile_number || log?.mobile || log?.phone || "—";
  const attendantNameVal = log?.attendantName || log?.attendant_name || log?.attendant || "—";
  const deliveryAddressVal = log?.deliveryAddress || log?.delivery_address || log?.address || "—";

  const startDateVal = log?.startDate || log?.start_date || log?.loginDate || log?.login_date || log?.recordDate || log?.record_date;
  const totalDaysFormatted = getDynamicTotalDays(startDateVal, cleanLogout, cleanRecall);

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

        <button 
          type="button" 
          onClick={onBack} 
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
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
                {formatDisplayDate(startDateVal)}
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            👤 Patient Identity Details
          </p>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
            <div><p className="text-xs font-medium text-slate-400">Patient Name:</p></div>
            <div><p className="font-bold text-slate-800">{patientNameVal}</p></div>

            <div><p className="text-xs font-medium text-slate-400">Mobile:</p></div>
            <div><p className="font-bold text-slate-800">{mobileNumberVal}</p></div>

            <div><p className="text-xs font-medium text-slate-400">Attendant:</p></div>
            <div><p className="font-bold text-slate-800">{attendantNameVal}</p></div>

            <div className="col-span-2 pt-2">
              <p className="text-xs font-medium text-slate-400 mb-1.5">Delivery Address:</p>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-medium text-slate-700">
                {deliveryAddressVal}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
            🏥 Care Center Context
          </p>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
            <div><p className="text-xs font-medium text-slate-400">Care Center:</p></div>
            <div><p className="font-bold text-slate-800">{careCenterName}</p></div>

            <div><p className="text-xs font-medium text-slate-400">Incharge Mobile:</p></div>
            <div><p className="font-bold text-slate-800">{log?.inchargeMobile || log?.incharge_mobile || log?.phone || careCenterObj?.phone || "—"}</p></div>

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

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(target) || 0;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setValue(current);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => frame.current && cancelAnimationFrame(frame.current);
  }, [target]);

  return value;
}

function DashboardStat({ label, value, icon: Icon, tone, delta, deltaUp, numericValue, formatValue, index = 0, signature = false }) {
  const accentMap = {
    teal: { grad: "linear-gradient(135deg, #14b8a6, #0d9488)", glow: "rgba(13, 148, 136, 0.35)" },
    slate: { grad: "linear-gradient(135deg, #64748b, #334155)", glow: "rgba(51, 65, 85, 0.28)" },
    indigo: { grad: "linear-gradient(135deg, #818cf8, #6366f1)", glow: "rgba(99, 102, 241, 0.35)" },
    amber: { grad: "linear-gradient(135deg, #fbbf24, #d97706)", glow: "rgba(217, 119, 6, 0.32)" },
    rose: { grad: "linear-gradient(135deg, #fb7185, #e11d48)", glow: "rgba(225, 29, 72, 0.32)" },
  };
  const accent = accentMap[tone] || accentMap.teal;

  const animated = useCountUp(numericValue ?? 0, 750);
  const displayValue = typeof numericValue === "number" && formatValue
    ? formatValue(animated)
    : value;

  return (
    <div
      className={`stat-card rise-in rounded-2xl border p-5 shadow-xs ${signature ? "signature-card" : "border-slate-200 bg-white"}`}
      style={{ animationDelay: `${index * 70}ms`, "--accent-grad": accent.grad, "--accent-glow": accent.glow }}
    >
      <div className="flex items-start justify-between">
        <div className="stat-icon icon-glow grid h-11 w-11 place-items-center rounded-xl">
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span className={`delta-chip flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
            signature ? "" : deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          } ${deltaUp ? "live-dot" : ""}`}>
            {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
      <p className={`stat-value mt-4 font-display text-2xl font-extrabold tabular-nums sm:text-3xl ${signature ? "" : "text-slate-800"}`}>
        {displayValue}
      </p>
      <p className={`stat-label mt-0.5 text-xs font-semibold uppercase tracking-wide ${signature ? "" : "text-slate-400"}`}>{label}</p>
    </div>
  );
}

export default function AdminDashboard({ 
  logs = [], 
  careCenters = [], 
  equipmentCatalog = [], 
  deliveryExecutives = [], 
  onNavigate 
}) {
  const navigate = useNavigate();
  const [viewDetailLog, setViewDetailLog] = useState(null);

  const loggedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isCareCenterUser = loggedUser?.role === "care_center";

  const matchedCareCenter = useMemo(() => {
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
      id: loggedUser.careCenterId || loggedUser.id || "CC-ME",
      name: loggedUser.careCenterName || loggedUser.name || "My Care Center",
      phone: loggedUser.phone || "",
      address: ""
    };
  }, [careCenters, isCareCenterUser, loggedUser]);

  const scopedLogs = useMemo(() => {
    if (!isCareCenterUser) return logs || [];

    const myCenterId = String(matchedCareCenter?.id || loggedUser.careCenterId || loggedUser.id || "").trim().toLowerCase();
    const myCenterName = String(matchedCareCenter?.name || loggedUser.careCenterName || loggedUser.name || "").trim().toLowerCase();
    const myCenterIdNumeric = myCenterId.replace(/\D/g, "");

    return (logs || []).filter((l) => {
      if (!l) return false;
      const ccId = String(l.careCenterId || l.care_center_id || "").trim().toLowerCase();
      const ccIdNumeric = ccId.replace(/\D/g, "");
      const ccName = String(l.careCenterName || l.care_center_name || careCenters.find((c) => String(c.id) === String(ccId))?.name || ccId || "").trim().toLowerCase();

      const idMatch = (ccId && myCenterId && ccId === myCenterId) || (ccIdNumeric && myCenterIdNumeric && ccIdNumeric === myCenterIdNumeric);
      const nameMatch = (ccName && myCenterName && (ccName.includes(myCenterName) || myCenterName.includes(ccName)));

      return idMatch || nameMatch;
    });
  }, [logs, isCareCenterUser, matchedCareCenter, loggedUser, careCenters]);

  const activeCount = scopedLogs.filter((l) => getLogStatus(l) === "Active").length;
  const closedCount = scopedLogs.filter((l) => getLogStatus(l) === "Closed").length;
  const inactiveCount = scopedLogs.filter((l) => getLogStatus(l) === "Inactive").length;

  const revenue = scopedLogs.reduce((sum, l) => {
    const eqId = l.equipmentId || l.equipment_id;
    const eq = equipmentCatalog.find((e) => String(e.id) === String(eqId));
    const rate = Number(l.rentalCharge ?? l.rental_charge ?? l.rent ?? l.daily_rate ?? eq?.dailyRate ?? eq?.daily_rate ?? 0);
    return sum + (rate * (Number(l.quantity) || 1));
  }, 0);

  const categoryData = useMemo(() => {
    const map = {};
    scopedLogs.forEach((l) => {
      const cat = l.category || "General";
      map[cat] = (map[cat] || 0) + (Number(l.quantity) || 1);
    });
    const result = Object.entries(map).map(([name, value]) => ({ name, value }));
    return result.length > 0 ? result : [{ name: "No Active Units", value: 1 }];
  }, [scopedLogs]);

  const lowStock = equipmentCatalog.filter((e) => Number(e.stock || 0) < 10).sort((a, b) => (a.stock || 0) - (b.stock || 0));
  const careCenterName = (id) => careCenters.find((c) => String(c.id) === String(id))?.name || (isCareCenterUser ? (matchedCareCenter?.name || "My Center") : "—");
  const recentLogs = [...scopedLogs].slice(0, 5);

  const handleNavigateToRental = () => {
    if (typeof onNavigate === "function") {
      onNavigate("/rental");
    } else {
      navigate("/rental");
    }
  };

  // If a user clicks on any requisition name, show the full details view
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

  return (
    <div className="dash-backdrop -m-4 space-y-5 rounded-3xl p-4 fade-slide-up sm:-m-6 sm:p-6">
      <GlobalPolish />
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="icon-glow grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            style={{ "--accent-grad": "linear-gradient(135deg, #14b8a6, #0d9488)", "--accent-glow": "rgba(13,148,136,0.35)" }}
          >
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800">
              {isCareCenterUser ? `${matchedCareCenter?.name || "Facility"} Dashboard` : "Analytics Overview"}
            </h1>
            <p className="text-xs font-medium text-slate-400">
              Live overview of medical asset allocations and billing metrics
            </p>
          </div>
        </div>
        <span className="live-dot eyebrow w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live data
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <DashboardStat 
          index={0}
          label={isCareCenterUser ? "Active Leases" : "Active Rentals"} 
          value={activeCount} 
          numericValue={activeCount}
          formatValue={(v) => Math.round(v).toLocaleString("en-IN")}
          icon={Activity} 
          tone="teal" 
          delta="Active" 
          deltaUp 
        />
        <DashboardStat 
          index={1}
          label="Closed / Returned" 
          value={closedCount} 
          numericValue={closedCount}
          formatValue={(v) => Math.round(v).toLocaleString("en-IN")}
          icon={PackageCheck} 
          tone="slate" 
          delta="Completed" 
          deltaUp 
        />
        <DashboardStat 
          index={2}
          label="Inactive Alerts" 
          value={inactiveCount} 
          numericValue={inactiveCount}
          formatValue={(v) => Math.round(v).toLocaleString("en-IN")}
          icon={AlertTriangle} 
          tone="rose" 
          delta="Review" 
          deltaUp={false} 
        />
        <DashboardStat 
          index={3}
          label={isCareCenterUser ? "Active Billing" : "Est. Rental Revenue"} 
          value={`₹${revenue.toLocaleString("en-IN")}`} 
          numericValue={revenue}
          formatValue={(v) => `₹${Math.round(v).toLocaleString("en-IN")}`}
          icon={Wallet} 
          tone="indigo" 
          delta="Live" 
          deltaUp 
          signature
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2" style={{ animationDelay: "120ms" }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="icon-glow grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                style={{ "--accent-grad": "linear-gradient(135deg, #14b8a6, #0d9488)", "--accent-glow": "rgba(13,148,136,0.35)" }}
              >
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-700">Requisition Volume</h3>
                <p className="text-xs text-slate-400">
                  {isCareCenterUser ? `Activity for ${matchedCareCenter?.name || "your care center"}` : "Last 7 days across all care centers"}
                </p>
              </div>
            </div>
            <span className="hidden items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-600 sm:flex">
              <ArrowUpRight className="h-3 w-3" /> Trending up
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Area
                  type="monotone"
                  dataKey="requisitions"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fill="url(#trendFill)"
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "170ms" }}>
          <div className="flex items-center gap-3">
            <div
              className="icon-glow grid h-9 w-9 shrink-0 place-items-center rounded-xl"
              style={{ "--accent-grad": "linear-gradient(135deg, #818cf8, #6366f1)", "--accent-glow": "rgba(99,102,241,0.35)" }}
            >
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Equipment by Category</h3>
              <p className="text-xs text-slate-400">Units currently on rent</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  isAnimationActive={true}
                  animationBegin={100}
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 max-h-24 overflow-y-auto smooth-scroll pr-1">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs transition-colors hover:text-slate-700">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  {c.name}
                </span>
                <span className="font-semibold text-slate-600">{c.value} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2 rise-in" style={{ animationDelay: "220ms" }}>
          
          {/* Header with Direct Route Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="font-display text-sm font-bold text-slate-700">
              {isCareCenterUser ? "My Center's Recent Requisitions" : "Recent Requisitions"}
            </h3>
            <button 
              type="button"
              onClick={handleNavigateToRental} 
              className="group flex items-center gap-1 text-xs font-bold text-teal-600 transition hover:text-teal-700 hover:underline cursor-pointer"
            >
              View All <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentLogs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-300">
                  <Package className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-400">No recent requisitions logged yet.</p>
              </div>
            ) : (
              recentLogs.map((log, i) => {
                const currentStatus = getLogStatus(log);
                const ccId = log.careCenterId || log.care_center_id;
                const eqId = log.equipmentId || log.equipment_id;
                const eqName = log.equipmentName || equipmentCatalog.find(e => String(e.id) === String(eqId))?.name || eqId || "Equipment";
                const pName = log.patientName || log.patient_name || log.patient || "Patient";

                return (
                  <div
                    key={log.id}
                    className="req-row row-in flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/70"
                    style={{ animationDelay: `${260 + i * 60}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 ring-1 ring-teal-100/70">
                        <Package className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        {/* 🔍 Clickable Name with Cursor Pointer */}
                        <p 
                          onClick={() => setViewDetailLog(log)}
                          title="Click to view full requisition details"
                          className="text-sm font-semibold text-slate-800 hover:text-teal-600 hover:underline cursor-pointer transition-colors inline-block"
                        >
                          {eqName} <span className="font-normal text-slate-400">({pName})</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          {log.id} · {careCenterName(ccId)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={currentStatus} glow={currentStatus === "Active"} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          {!isCareCenterUser ? (
            <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "260ms" }}>
              <h3 className="font-display text-sm font-bold text-slate-700">Low Stock Alerts</h3>
              <p className="mb-3 text-xs text-slate-400">Equipment below 10 units</p>
              <div className="space-y-3">
                {lowStock.slice(0, 4).map((eq, i) => {
                  const pct = Math.min(100, Math.max(6, (Number(eq.stock) || 0) * 10));
                  return (
                    <div key={eq.id} className="row-in" style={{ animationDelay: `${300 + i * 70}ms` }}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
                            <Boxes className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{eq.name}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-600">{eq.stock} left</span>
                      </div>
                      <div className="ml-9 h-1.5 w-[calc(100%-2.25rem)] overflow-hidden rounded-full bg-amber-50">
                        <div
                          className="stock-fill h-full rounded-full bg-amber-400"
                          style={{ width: `${pct}%`, animationDelay: `${340 + i * 70}ms` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {lowStock.length === 0 && <p className="text-xs text-slate-400">All equipment well stocked.</p>}
              </div>
            </div>
          ) : (
            <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "260ms" }}>
              <h3 className="font-display text-sm font-bold text-slate-700">Facility Information</h3>
              <p className="mb-3 text-xs text-slate-400">Registered center credentials</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Center Name</span>
                  <span className="font-bold text-slate-700 truncate max-w-[140px]">{matchedCareCenter?.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Registered Hotline</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" /> {matchedCareCenter?.phone || loggedUser?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Account Status</span>
                  <span className="live-dot inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Active Partner
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="panel-card rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs" style={{ animationDelay: "320ms" }}>
            <h3 className="font-display text-sm font-bold text-slate-700">
              {isCareCenterUser ? "Facility Summary" : "Network Snapshot"}
            </h3>
            <div className="mt-3 space-y-3">
              {!isCareCenterUser ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Building2 className="h-4 w-4 text-teal-500" /> Care Centers</span>
                    <span className="font-bold text-slate-700">{careCenters.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Layers className="h-4 w-4 text-indigo-500" /> Equipment SKUs</span>
                    <span className="font-bold text-slate-700">{equipmentCatalog.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Truck className="h-4 w-4 text-amber-500" /> Delivery Executives</span>
                    <span className="font-bold text-slate-700">{deliveryExecutives.length}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Activity className="h-4 w-4 text-teal-500" /> Active Devices</span>
                    <span className="font-bold text-slate-700">{activeCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><Package className="h-4 w-4 text-indigo-500" /> Total Requisitions</span>
                    <span className="font-bold text-slate-700">{scopedLogs.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><PackageCheck className="h-4 w-4 text-slate-500" /> Completed Returns</span>
                    <span className="font-bold text-slate-700">{closedCount}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}