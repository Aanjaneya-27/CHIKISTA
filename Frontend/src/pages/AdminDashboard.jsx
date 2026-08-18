// // import { useMemo } from "react";
// // import { Activity, Clock, AlertTriangle, Wallet, TrendingUp, Package, Boxes, Building2, Layers, Truck, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
// // import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// // import { trendData, DONUT_COLORS } from "../data/MockData";
// // import { StatusBadge } from "../components/UiComponents";

// // const getCalculatedStatus = (startDateStr, logoutDateStr, currentStatus) => {
// //   if (currentStatus && ["returned", "return"].includes(currentStatus.toString().trim().toLowerCase())) {
// //     return "Returned";
// //   }

// //   if (!startDateStr || !logoutDateStr) return "Pending";

// //   const parseSafeDate = (dStr) => {
// //     if (!dStr) return null;
// //     let str = dStr.toString().trim();
// //     if (str.includes("T")) str = str.split("T")[0];
// //     if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(str)) {
// //       const p = str.split(/[-/]/);
// //       str = `${p[2]}-${p[1]}-${p[0]}`;
// //     }
// //     const d = new Date(`${str}T00:00:00`);
// //     return isNaN(d.getTime()) ? null : d;
// //   };

// //   const start = parseSafeDate(startDateStr);
// //   const logout = parseSafeDate(logoutDateStr);

// //   if (!start || !logout) return currentStatus || "Pending";

// //   const today = new Date();
// //   today.setHours(0, 0, 0, 0);

// //   const tTime = today.getTime();
// //   const sTime = start.getTime();
// //   const lTime = logout.getTime();

// //   const overdueLimit = new Date(logout);
// //   overdueLimit.setDate(overdueLimit.getDate() + 3);
// //   const oTime = overdueLimit.getTime();

// //   if (tTime >= sTime && tTime <= lTime) return "Active";
// //   if (tTime > lTime && tTime <= oTime) return "Pending";
// //   if (tTime > oTime) return "Overdue";

// //   return "Pending";
// // };

// // function DashboardStat({ label, value, icon: Icon, tone, delta, deltaUp }) {
// //   const toneMap = {
// //     teal: "bg-teal-50 text-teal-600",
// //     indigo: "bg-indigo-50 text-indigo-600",
// //     amber: "bg-amber-50 text-amber-600",
// //     rose: "bg-rose-50 text-rose-600",
// //   };
// //   return (
// //     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:shadow-md">
// //       <div className="flex items-start justify-between">
// //         <div className={`grid h-11 w-11 place-items-center rounded-xl ${toneMap[tone]}`}>
// //           <Icon className="h-5 w-5" />
// //         </div>
// //         {delta && (
// //           <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
// //             {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
// //             {delta}
// //           </span>
// //         )}
// //       </div>
// //       <p className="mt-4 font-display text-2xl font-extrabold text-slate-800 sm:text-3xl">{value}</p>
// //       <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
// //     </div>
// //   );
// // }

// // export default function AdminDashboard({ logs, careCenters, equipmentCatalog, deliveryExecutives, setActiveModule }) {
// //   // Safe Log Helper
// //   const getLogStatus = (l) => {
// //     const rawStatus = l.status || l.requisition_status || l.return_status;
// //     return getCalculatedStatus(
// //       l.startDate || l.start_date,
// //       l.logoutDate || l.logout_date,
// //       rawStatus
// //     );
// //   };

// //   const activeCount = logs.filter((l) => getLogStatus(l) === "Active").length;
// //   const pendingCount = logs.filter((l) => getLogStatus(l) === "Pending").length;
// //   const overdueCount = logs.filter((l) => getLogStatus(l) === "Overdue").length;

// //   const revenue = logs.reduce((sum, l) => {
// //     const eqId = l.equipmentId || l.equipment_id;
// //     const eq = equipmentCatalog.find((e) => e.id === eqId);
// //     return sum + (eq ? eq.dailyRate * (l.quantity || 1) : 0);
// //   }, 0);

// //   const categoryData = useMemo(() => {
// //     const map = {};
// //     logs.forEach((l) => {
// //       const cat = l.category || "General";
// //       map[cat] = (map[cat] || 0) + (l.quantity || 1);
// //     });
// //     return Object.entries(map).map(([name, value]) => ({ name, value }));
// //   }, [logs]);

// //   const lowStock = equipmentCatalog.filter((e) => e.stock < 10).sort((a, b) => a.stock - b.stock);
// //   const careCenterName = (id) => careCenters.find((c) => c.id === id)?.name || "—";
// //   const recentLogs = [...logs].slice(0, 5);

// //   return (
// //     <div className="space-y-5">
// //       <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
// //         <DashboardStat label="Active Rentals" value={activeCount} icon={Activity} tone="teal" delta="12%" deltaUp />
// //         <DashboardStat label="Pending Requisitions" value={pendingCount} icon={Clock} tone="amber" delta="4%" deltaUp={false} />
// //         <DashboardStat label="Overdue Returns" value={overdueCount} icon={AlertTriangle} tone="rose" delta="2%" deltaUp={false} />
// //         <DashboardStat label="Est. Monthly Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} icon={Wallet} tone="indigo" delta="18%" deltaUp />
// //       </div>

// //       <div className="grid gap-4 lg:grid-cols-3">
// //         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
// //           <div className="mb-4 flex items-center justify-between">
// //             <div>
// //               <h3 className="font-display text-sm font-bold text-slate-700">Requisition Volume</h3>
// //               <p className="text-xs text-slate-400">Last 7 days across all care centers</p>
// //             </div>
// //             <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-600">
// //               <TrendingUp className="h-3 w-3" /> Trending up
// //             </span>
// //           </div>
// //           <div className="h-64 w-full">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
// //                 <defs>
// //                   <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
// //                     <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
// //                     <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
// //                   </linearGradient>
// //                 </defs>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
// //                 <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
// //                 <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
// //                 <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
// //                 <Area type="monotone" dataKey="requisitions" stroke="#0d9488" strokeWidth={2.5} fill="url(#trendFill)" isAnimationActive={false} />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
// //           <h3 className="font-display text-sm font-bold text-slate-700">Equipment by Category</h3>
// //           <p className="text-xs text-slate-400">Units currently on rent</p>
// //           <div className="h-56 w-full">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <PieChart>
// //                 <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} isAnimationActive={false}>
// //                   {categoryData.map((_, i) => (
// //                     <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </div>
// //           <div className="space-y-1.5">
// //             {categoryData.map((c, i) => (
// //               <div key={c.name} className="flex items-center justify-between text-xs">
// //                 <span className="flex items-center gap-1.5 text-slate-500">
// //                   <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
// //                   {c.name}
// //                 </span>
// //                 <span className="font-semibold text-slate-600">{c.value} units</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid gap-4 lg:grid-cols-3">
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
// //           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //             <h3 className="font-display text-sm font-bold text-slate-700">Recent Requisitions</h3>
// //             <button 
// //               onClick={() => {
// //                 if (setActiveModule) {
// //                   setActiveModule("rental");
// //                 }
// //               }} 
// //               className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
// //             >
// //               <ChevronRight className="h-3.5 w-3.5" />
// //             </button>
// //           </div>
// //           <div className="divide-y divide-slate-100">
// //             {recentLogs.map((log) => {
// //               const currentStatus = getLogStatus(log);
// //               const ccId = log.careCenterId || log.care_center_id;
// //               const eqName = log.equipmentName || equipmentCatalog.find(e => e.id === (log.equipmentId || log.equipment_id))?.name || "Equipment";

// //               return (
// //                 <div key={log.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
// //                   <div className="flex items-center gap-3">
// //                     <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
// //                       <Package className="h-4 w-4" />
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-semibold text-slate-700">{eqName}</p>
// //                       <p className="text-xs text-slate-400">{log.id} · {careCenterName(ccId)}</p>
// //                     </div>
// //                   </div>
// //                   <StatusBadge status={currentStatus} glow={currentStatus === "Active"} />
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         <div className="space-y-4">
// //           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
// //             <h3 className="font-display text-sm font-bold text-slate-700">Low Stock Alerts</h3>
// //             <p className="mb-3 text-xs text-slate-400">Equipment below 10 units</p>
// //             <div className="space-y-2.5">
// //               {lowStock.slice(0, 4).map((eq) => (
// //                 <div key={eq.id} className="flex items-center justify-between">
// //                   <div className="flex items-center gap-2">
// //                     <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
// //                       <Boxes className="h-3.5 w-3.5" />
// //                     </div>
// //                     <span className="text-xs font-medium text-slate-600">{eq.name}</span>
// //                   </div>
// //                   <span className="text-xs font-bold text-amber-600">{eq.stock} left</span>
// //                 </div>
// //               ))}
// //               {lowStock.length === 0 && <p className="text-xs text-slate-400">All equipment well stocked.</p>}
// //             </div>
// //           </div>

// //           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
// //             <h3 className="font-display text-sm font-bold text-slate-700">Network Snapshot</h3>
// //             <div className="mt-3 space-y-3">
// //               <div className="flex items-center justify-between text-sm">
// //                 <span className="flex items-center gap-2 text-slate-500"><Building2 className="h-4 w-4 text-teal-500" /> Care Centers</span>
// //                 <span className="font-bold text-slate-700">{careCenters.length}</span>
// //               </div>
// //               <div className="flex items-center justify-between text-sm">
// //                 <span className="flex items-center gap-2 text-slate-500"><Layers className="h-4 w-4 text-indigo-500" /> Equipment SKUs</span>
// //                 <span className="font-bold text-slate-700">{equipmentCatalog.length}</span>
// //               </div>
// //               <div className="flex items-center justify-between text-sm">
// //                 <span className="flex items-center gap-2 text-slate-500"><Truck className="h-4 w-4 text-amber-500" /> Delivery Executives</span>
// //                 <span className="font-bold text-slate-700">{deliveryExecutives.length}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useMemo } from "react";
// import { Activity, Clock, AlertTriangle, Wallet, TrendingUp, Package, Boxes, Building2, Layers, Truck, ChevronRight, ArrowUpRight, ArrowDownRight, Phone, CheckCircle2 } from "lucide-react";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import { trendData, DONUT_COLORS } from "../data/MockData";
// import { StatusBadge } from "../components/UiComponents";

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

// function DashboardStat({ label, value, icon: Icon, tone, delta, deltaUp }) {
//   const toneMap = {
//     teal: "bg-teal-50 text-teal-600",
//     indigo: "bg-indigo-50 text-indigo-600",
//     amber: "bg-amber-50 text-amber-600",
//     rose: "bg-rose-50 text-rose-600",
//   };
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:shadow-md">
//       <div className="flex items-start justify-between">
//         <div className={`grid h-11 w-11 place-items-center rounded-xl ${toneMap[tone]}`}>
//           <Icon className="h-5 w-5" />
//         </div>
//         {delta && (
//           <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
//             {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
//             {delta}
//           </span>
//         )}
//       </div>
//       <p className="mt-4 font-display text-2xl font-extrabold text-slate-800 sm:text-3xl">{value}</p>
//       <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
//     </div>
//   );
// }

// export default function AdminDashboard({ logs = [], careCenters = [], equipmentCatalog = [], deliveryExecutives = [], setActiveModule }) {
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
//     const cleanUserPhone = (loggedUser?.phone || "").toString().replace(/\D/g, "").slice(-10);
//     const cleanUserName = (loggedUser?.careCenterName || loggedUser?.name || "").trim().toLowerCase();

//     return careCenters.find((c) => {
//       const cleanCcPhone = (c.phone || "").toString().replace(/\D/g, "").slice(-10);
//       const cleanCcName = (c.name || "").trim().toLowerCase();

//       return (
//         (c.id && loggedUser?.careCenterId && String(c.id) === String(loggedUser.careCenterId)) ||
//         (c.id && loggedUser?.id && String(c.id) === String(loggedUser.id)) ||
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

//     const myCenterId = (matchedCareCenter?.id || loggedUser.careCenterId || loggedUser.id || "").toString().trim().toLowerCase();
//     const myCenterName = (matchedCareCenter?.name || loggedUser.careCenterName || loggedUser.name || "").toString().trim().toLowerCase();
//     const myCenterIdNumeric = myCenterId.replace(/\D/g, "");

//     return (logs || []).filter((l) => {
//       const ccId = (l.careCenterId || l.care_center_id || "").toString().trim().toLowerCase();
//       const ccIdNumeric = ccId.replace(/\D/g, "");
//       const ccName = (l.careCenterName || l.care_center_name || careCenters.find((c) => String(c.id) === String(ccId))?.name || ccId || "").toString().trim().toLowerCase();

//       const idMatch = (ccId && myCenterId && ccId === myCenterId) || (ccIdNumeric && myCenterIdNumeric && ccIdNumeric === myCenterIdNumeric);
//       const nameMatch = (ccName && myCenterName && (ccName.includes(myCenterName) || myCenterName.includes(ccName)));

//       return idMatch || nameMatch;
//     });
//   }, [logs, isCareCenterUser, matchedCareCenter, loggedUser, careCenters]);

//   const getLogStatus = (l) => {
//     const rawStatus = l.status || l.requisition_status || l.return_status;
//     return getCalculatedStatus(
//       l.startDate || l.start_date,
//       l.logoutDate || l.logout_date,
//       rawStatus
//     );
//   };

//   const activeCount = scopedLogs.filter((l) => getLogStatus(l) === "Active").length;
//   const pendingCount = scopedLogs.filter((l) => getLogStatus(l) === "Pending").length;
//   const overdueCount = scopedLogs.filter((l) => getLogStatus(l) === "Overdue").length;

//   const revenue = scopedLogs.reduce((sum, l) => {
//     const eqId = l.equipmentId || l.equipment_id;
//     const eq = equipmentCatalog.find((e) => e.id === eqId);
//     return sum + (eq ? eq.dailyRate * (l.quantity || 1) : 0);
//   }, 0);

//   const categoryData = useMemo(() => {
//     const map = {};
//     scopedLogs.forEach((l) => {
//       const cat = l.category || "General";
//       map[cat] = (map[cat] || 0) + (l.quantity || 1);
//     });
//     const result = Object.entries(map).map(([name, value]) => ({ name, value }));
//     return result.length > 0 ? result : [{ name: "No Active Units", value: 1 }];
//   }, [scopedLogs]);

//   const lowStock = equipmentCatalog.filter((e) => e.stock < 10).sort((a, b) => a.stock - b.stock);
//   const careCenterName = (id) => careCenters.find((c) => c.id === id)?.name || (isCareCenterUser ? (matchedCareCenter?.name || "My Center") : "—");
//   const recentLogs = [...scopedLogs].slice(0, 5);

//   return (
//     <div className="space-y-5">
//       <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//         <DashboardStat label={isCareCenterUser ? "Active Leases" : "Active Rentals"} value={activeCount} icon={Activity} tone="teal" delta="12%" deltaUp />
//         <DashboardStat label={isCareCenterUser ? "Pending Approvals" : "Pending Requisitions"} value={pendingCount} icon={Clock} tone="amber" delta="4%" deltaUp={false} />
//         <DashboardStat label="Overdue Returns" value={overdueCount} icon={AlertTriangle} tone="rose" delta="2%" deltaUp={false} />
//         <DashboardStat label={isCareCenterUser ? "Est. Active Billing" : "Est. Monthly Revenue"} value={`₹${revenue.toLocaleString("en-IN")}`} icon={Wallet} tone="indigo" delta="18%" deltaUp />
//       </div>

//       <div className="grid gap-4 lg:grid-cols-3">
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <h3 className="font-display text-sm font-bold text-slate-700">Requisition Volume</h3>
//               <p className="text-xs text-slate-400">
//                 {isCareCenterUser ? `Activity for ${matchedCareCenter?.name || "your care center"}` : "Last 7 days across all care centers"}
//               </p>
//             </div>
//             <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-600">
//               <TrendingUp className="h-3 w-3" /> Trending up
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
//                 <Area type="monotone" dataKey="requisitions" stroke="#0d9488" strokeWidth={2.5} fill="url(#trendFill)" isAnimationActive={false} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <h3 className="font-display text-sm font-bold text-slate-700">Equipment by Category</h3>
//           <p className="text-xs text-slate-400">Units currently on rent</p>
//           <div className="h-56 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} isAnimationActive={false}>
//                   {categoryData.map((_, i) => (
//                     <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="space-y-1.5">
//             {categoryData.map((c, i) => (
//               <div key={c.name} className="flex items-center justify-between text-xs">
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
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <h3 className="font-display text-sm font-bold text-slate-700">
//               {isCareCenterUser ? "My Center's Recent Requisitions" : "Recent Requisitions"}
//             </h3>
//             <button 
//               onClick={() => {
//                 if (setActiveModule) {
//                   setActiveModule("rental");
//                 }
//               }} 
//               className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition cursor-pointer"
//             >
//               View All <ChevronRight className="h-3.5 w-3.5" />
//             </button>
//           </div>
//           <div className="divide-y divide-slate-100">
//             {recentLogs.length === 0 ? (
//               <div className="px-5 py-8 text-center text-xs text-slate-400">
//                 No recent requisitions logged yet.
//               </div>
//             ) : (
//               recentLogs.map((log) => {
//                 const currentStatus = getLogStatus(log);
//                 const ccId = log.careCenterId || log.care_center_id;
//                 const eqName = log.equipmentName || equipmentCatalog.find(e => e.id === (log.equipmentId || log.equipment_id))?.name || "Equipment";

//                 return (
//                   <div key={log.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
//                     <div className="flex items-center gap-3">
//                       <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
//                         <Package className="h-4 w-4" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-slate-700">{eqName}</p>
//                         <p className="text-xs text-slate-400">{log.id} · {careCenterName(ccId)}</p>
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
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <h3 className="font-display text-sm font-bold text-slate-700">Low Stock Alerts</h3>
//               <p className="mb-3 text-xs text-slate-400">Equipment below 10 units</p>
//               <div className="space-y-2.5">
//                 {lowStock.slice(0, 4).map((eq) => (
//                   <div key={eq.id} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
//                         <Boxes className="h-3.5 w-3.5" />
//                       </div>
//                       <span className="text-xs font-medium text-slate-600">{eq.name}</span>
//                     </div>
//                     <span className="text-xs font-bold text-amber-600">{eq.stock} left</span>
//                   </div>
//                 ))}
//                 {lowStock.length === 0 && <p className="text-xs text-slate-400">All equipment well stocked.</p>}
//               </div>
//             </div>
//           ) : (
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
//                   <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
//                     <CheckCircle2 className="h-3 w-3" /> Active Partner
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
//                     <span className="flex items-center gap-2 text-slate-500"><AlertTriangle className="h-4 w-4 text-rose-500" /> Overdue Alerts</span>
//                     <span className="font-bold text-rose-600">{overdueCount}</span>
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
import { useMemo } from "react";
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
  CheckCircle2 
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
      @keyframes riseIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .rise-in { animation: riseIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
      @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.98) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .fade-slide-up { animation: fadeScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both; }
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

const todayISO = () => new Date().toISOString().slice(0, 10);

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

function DashboardStat({ label, value, icon: Icon, tone, delta, deltaUp }) {
  const toneMap = {
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="rise-in rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl border ${toneMap[tone] || toneMap.teal}`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
            deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold text-slate-800 sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
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

  return (
    <div className="space-y-5 fade-slide-up">
      <GlobalPolish />
      
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-800">
            {isCareCenterUser ? `${matchedCareCenter?.name || "Facility"} Dashboard` : "Analytics Overview"}
          </h1>
          <p className="text-xs font-medium text-slate-400">
            Live overview of medical asset allocations and billing metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <DashboardStat 
          label={isCareCenterUser ? "Active Leases" : "Active Rentals"} 
          value={activeCount} 
          icon={Activity} 
          tone="teal" 
          delta="Active" 
          deltaUp 
        />
        <DashboardStat 
          label="Closed / Returned" 
          value={closedCount} 
          icon={PackageCheck} 
          tone="slate" 
          delta="Completed" 
          deltaUp 
        />
        <DashboardStat 
          label="Inactive Alerts" 
          value={inactiveCount} 
          icon={AlertTriangle} 
          tone="rose" 
          delta="Review" 
          deltaUp={false} 
        />
        <DashboardStat 
          label={isCareCenterUser ? "Active Billing" : "Est. Rental Revenue"} 
          value={`₹${revenue.toLocaleString("en-IN")}`} 
          icon={Wallet} 
          tone="indigo" 
          delta="Live" 
          deltaUp 
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Requisition Volume</h3>
              <p className="text-xs text-slate-400">
                {isCareCenterUser ? `Activity for ${matchedCareCenter?.name || "your care center"}` : "Last 7 days across all care centers"}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-600">
              <TrendingUp className="h-3 w-3" /> Trending up
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
                <Area type="monotone" dataKey="requisitions" stroke="#0d9488" strokeWidth={2.5} fill="url(#trendFill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="font-display text-sm font-bold text-slate-700">Equipment by Category</h3>
          <p className="text-xs text-slate-400">Units currently on rent</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} isAnimationActive={false}>
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
              <div key={c.name} className="flex items-center justify-between text-xs">
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
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
          
          {/* Header with Direct Route Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="font-display text-sm font-bold text-slate-700">
              {isCareCenterUser ? "My Center's Recent Requisitions" : "Recent Requisitions"}
            </h3>
            <button 
              type="button"
              onClick={handleNavigateToRental} 
              className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline transition cursor-pointer"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentLogs.length === 0 ? (
              <div className="px-5 py-10 text-center text-xs text-slate-400">
                No recent requisitions logged yet.
              </div>
            ) : (
              recentLogs.map((log) => {
                const currentStatus = getLogStatus(log);
                const ccId = log.careCenterId || log.care_center_id;
                const eqId = log.equipmentId || log.equipment_id;
                const eqName = log.equipmentName || equipmentCatalog.find(e => String(e.id) === String(eqId))?.name || eqId || "Equipment";
                const pName = log.patientName || log.patient_name || log.patient || "Patient";

                return (
                  <div key={log.id} className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-slate-50/70">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
                        <Package className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="font-display text-sm font-bold text-slate-700">Low Stock Alerts</h3>
              <p className="mb-3 text-xs text-slate-400">Equipment below 10 units</p>
              <div className="space-y-2.5">
                {lowStock.slice(0, 4).map((eq) => (
                  <div key={eq.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
                        <Boxes className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{eq.name}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-600">{eq.stock} left</span>
                  </div>
                ))}
                {lowStock.length === 0 && <p className="text-xs text-slate-400">All equipment well stocked.</p>}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Active Partner
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
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