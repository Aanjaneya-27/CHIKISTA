import { useMemo } from "react";
import { Activity, Clock, AlertTriangle, Wallet, TrendingUp, Package, Boxes, Building2, Layers, Truck, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { trendData, DONUT_COLORS } from "../data/MockData";
import { StatusBadge } from "../components/UiComponents";

function DashboardStat({ label, value, icon: Icon, tone, delta, deltaUp }) {
  const toneMap = {
    teal: "bg-teal-50 text-teal-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold text-slate-800 sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

export default function AdminDashboard({ logs, careCenters, equipmentCatalog, deliveryExecutives, setActiveModule }) {
  const activeCount = logs.filter((l) => l.status === "Active").length;
  const pendingCount = logs.filter((l) => l.status === "Pending").length;
  const overdueCount = logs.filter((l) => l.status === "Overdue").length;
  const revenue = logs.reduce((sum, l) => {
    const eq = equipmentCatalog.find((e) => e.id === l.equipmentId);
    return sum + (eq ? eq.dailyRate * l.quantity : 0);
  }, 0);

  const categoryData = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      map[l.category] = (map[l.category] || 0) + l.quantity;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const lowStock = equipmentCatalog.filter((e) => e.stock < 10).sort((a, b) => a.stock - b.stock);
  const careCenterName = (id) => careCenters.find((c) => c.id === id)?.name || "—";
  const recentLogs = [...logs].slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <DashboardStat label="Active Rentals" value={activeCount} icon={Activity} tone="teal" delta="12%" deltaUp />
        <DashboardStat label="Pending Requisitions" value={pendingCount} icon={Clock} tone="amber" delta="4%" deltaUp={false} />
        <DashboardStat label="Overdue Returns" value={overdueCount} icon={AlertTriangle} tone="rose" delta="2%" deltaUp={false} />
        <DashboardStat label="Est. Monthly Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} icon={Wallet} tone="indigo" delta="18%" deltaUp />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Requisition Volume</h3>
              <p className="text-xs text-slate-400">Last 7 days across all care centers</p>
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

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
          <div className="space-y-1.5">
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
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="font-display text-sm font-bold text-slate-700">Recent Requisitions</h3>
            <button 
              onClick={() => {
                if (setActiveModule) {
                  setActiveModule("rental");
                }
              }} 
              className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{log.equipmentName}</p>
                    <p className="text-xs text-slate-400">{log.id} · {careCenterName(log.careCenterId)}</p>
                  </div>
                </div>
                <StatusBadge status={log.status} glow={log.status === "Active"} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-display text-sm font-bold text-slate-700">Network Snapshot</h3>
            <div className="mt-3 space-y-3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}