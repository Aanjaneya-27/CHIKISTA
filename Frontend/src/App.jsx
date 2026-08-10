import { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Toaster, toast } from "./components/UiComponents"; 
import { ROLES, initialCareCenters, initialEquipment, initialCategories, initialReferences, initialDeliveryExecutives, initialLogs, initialNotifications } from "./data/MockData";
import { Sidebar, Topbar, NotificationsPanel } from "./components/layout/Layout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import RentalMaster from "./pages/RentalMaster";
import MasterInfo from "./pages/MasterInfo";
import UserProfile from "./pages/UserProfile"; 
import API from "./utils/api"; 

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    html { scroll-behavior: smooth; }
    * { -webkit-tap-highlight-color: transparent; }
    .font-display { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
    .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; text-rendering: optimizeSpeed; -webkit-font-smoothing: antialiased; }
    .smooth-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior-y: contain; scroll-behavior: smooth; }
    .smooth-scroll-x { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; overscroll-behavior-x: contain; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
    .smooth-scroll-x::-webkit-scrollbar { height: 6px; }
    .smooth-scroll-x::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 999px; }
    .smooth-scroll-x::-webkit-scrollbar-track { background: transparent; }
    @keyframes pulseDot { 0%,100% { opacity:1; } 50% { opacity:.35; } }
    .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }
    @keyframes fadeSlideUp { from { opacity:0; transform: translate3d(0,6px,0); } to { opacity:1; transform: translate3d(0,0,0); } }
    .fade-slide-up { animation: fadeSlideUp .15s ease-out; will-change: transform, opacity; }
    @keyframes slideInRight { from { transform: translate3d(100%,0,0); } to { transform: translate3d(0,0,0); } }
    .slide-in-right { animation: slideInRight .2s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform; }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    .fade-in { animation: fadeIn .15s ease-out; }
  `}</style>
);

function AccessDenied({ role }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-rose-50">
        <ShieldCheck className="h-7 w-7 text-rose-500" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-slate-700">Access Restricted</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-400">
        The <span className="font-semibold text-slate-600">{ROLES[role]?.label || role}</span> role does not have permission to view Master Info. Switch to Super Admin to manage care centers and equipment.
      </p>
    </div>
  );
}

function MainAppLayout({ role, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [careCenters, setCareCenters] = useState(initialCareCenters);
  const [equipmentCatalog, setEquipmentCatalog] = useState(initialEquipment);
  const [categories, setCategories] = useState(initialCategories);
  const [references, setReferences] = useState(initialReferences);
  const [deliveryExecutives, setDeliveryExecutives] = useState(initialDeliveryExecutives);
  const [logs, setLogs] = useState(initialLogs);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markNotifRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllNotifRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const permissions = {
    canViewMaster: role === "super_admin",
    canAdd: ["super_admin", "care_center", "reference"].includes(role),
    canEdit: ["super_admin", "care_center", "reference"].includes(role),
    canDelete: role === "super_admin",
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const ccRes = await API.get("/master/carecenters");
        const eqRes = await API.get("/master/equipment");
        
        if (ccRes.data && ccRes.data.length > 0) {
          setCareCenters(ccRes.data.map(c => ({
            id: c.id, 
            name: c.name, 
            address: c.address, 
            contactPerson: c.contact_person, 
            phone: c.phone, 
            gst: c.gst
          })));
        }

        if (eqRes.data && eqRes.data.length > 0) {
          setEquipmentCatalog(eqRes.data.map(e => ({
            id: e.id, 
            name: e.name, 
            category: e.category, 
            dailyRate: e.daily_rate, 
            stock: e.stock
          })));
        }

        const reqRes = await API.get("/rental/requisitions");
        if (reqRes.data && reqRes.data.length > 0) {
          setLogs(reqRes.data.map(r => ({
            id: r.id,
            careCenterId: r.care_center_id,
            careCenterName: r.careCenterName || "Care Center", 
            equipmentId: r.equipment_id,
            equipmentName: r.equipmentName || "Equipment", 
            patientName: r.patient_name,
            quantity: r.quantity,
            startDate: r.start_date,
            logoutDate: r.logout_date || "",
            paymentType: r.payment_type,
            dealType: r.deal_type,
            unit: r.unit,
            mode: r.mode,
            notifyDate: r.notify_date,
            deliveryAddress: r.delivery_address,
            notes: r.notes,
            status: r.status || "Active" 
          })));
        }

        const notifRes = await API.get("/rental/notifications");
        if (notifRes.data && notifRes.data.length > 0) {
          setNotifications(notifRes.data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            time: n.created_at,
            read: false
          })));
        }

      } catch (err) {
        console.error("Failed to fetch Live Data:", err);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="font-body flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar role={role} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unreadCount={unreadCount} onOpenNotifications={() => setNotifOpen(true)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar role={role} setMobileOpen={setMobileOpen} unreadCount={unreadCount} onOpenNotifications={() => setNotifOpen(true)} onLogout={handleLogout} />
        <main className="smooth-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard role={role} logs={logs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} deliveryExecutives={deliveryExecutives} />} />
            <Route path="/rental" element={<RentalMaster role={role} permissions={permissions} logs={logs} setLogs={setLogs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} references={references} categories={categories}/>} />
            
            <Route path="/master" element={
              permissions.canViewMaster ? (
                <MasterInfo careCenters={careCenters} setCareCenters={setCareCenters} equipmentCatalog={equipmentCatalog} setEquipmentCatalog={setEquipmentCatalog} categories={categories} setCategories={setCategories} references={references} setReferences={setReferences} deliveryExecutives={deliveryExecutives} setDeliveryExecutives={setDeliveryExecutives} />
              ) : (
                <AccessDenied role={role} />
              )
            } />

            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} onMarkRead={markNotifRead} onMarkAllRead={markAllNotifRead} />
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    toast.success("Login Successful!"); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout Successful!"); 
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setTimeout(() => {
        setRole(parsedUser.role);
        setIsAuthenticated(true);
      }, 0);
    }
  }, []);

  return (
    <Router>
      <FontImport />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} /> } />
        <Route path="/*" element={ isAuthenticated ? <MainAppLayout role={role} handleLogout={handleLogout} /> : <Navigate to="/login" replace /> } />
      </Routes>
      <Toaster />
    </Router>
  );
}