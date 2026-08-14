// import { useState, useEffect } from "react"; 
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { ShieldCheck } from "lucide-react";
// import { Toaster, toast } from "./components/UiComponents"; 
// import { ROLES } from "./data/MockData";
// import { Sidebar, Topbar, NotificationsPanel, Footer } from "./components/layout/Layout";
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import RentalMaster from "./pages/RentalMaster";
// import MasterInfo from "./pages/MasterInfo";
// import UserProfile from "./pages/UserProfile"; 
// import API from "./utils/api"; 

// const FontImport = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
//     html { scroll-behavior: smooth; }
//     * { -webkit-tap-highlight-color: transparent; }
//     .font-display { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
//     .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; text-rendering: optimizeSpeed; -webkit-font-smoothing: antialiased; }
//     .smooth-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior-y: contain; scroll-behavior: smooth; }
//     .smooth-scroll-x { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; overscroll-behavior-x: contain; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
//     .smooth-scroll-x::-webkit-scrollbar { height: 6px; }
//     .smooth-scroll-x::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 999px; }
//     .smooth-scroll-x::-webkit-scrollbar-track { background: transparent; }
//     @keyframes pulseDot { 0%,100% { opacity:1; } 50% { opacity:.35; } }
//     .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }
//     @keyframes fadeSlideUp { from { opacity:0; transform: translate3d(0,6px,0); } to { opacity:1; transform: translate3d(0,0,0); } }
//     .fade-slide-up { animation: fadeSlideUp .15s ease-out; will-change: transform, opacity; }
//     @keyframes slideInRight { from { transform: translate3d(100%,0,0); } to { transform: translate3d(0,0,0); } }
//     .slide-in-right { animation: slideInRight .2s cubic-bezier(0.16, 1, 0.3, 1); will-change: transform; }
//     @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
//     .fade-in { animation: fadeIn .15s ease-out; }
//   `}</style>
// );

// function AccessDenied({ role }) {
//   return (
//     <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
//       <div className="grid h-14 w-14 place-items-center rounded-full bg-rose-50">
//         <ShieldCheck className="h-7 w-7 text-rose-500" />
//       </div>
//       <h3 className="mt-4 font-display text-lg font-bold text-slate-700">Access Restricted</h3>
//       <p className="mt-1.5 max-w-sm text-sm text-slate-400">
//         The <span className="font-semibold text-slate-600">{ROLES[role]?.label || role}</span> role does not have permission to view Master Info. Switch to Super Admin to manage care centers and equipment.
//       </p>
//     </div>
//   );
// }

// function MainAppLayout({ role, handleLogout }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [careCenters, setCareCenters] = useState([]);
//   const [equipmentCatalog, setEquipmentCatalog] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [references, setReferences] = useState([]);
//   const [deliveryExecutives, setDeliveryExecutives] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const unreadCount = notifications.filter((n) => !n.read).length;
//   const markNotifRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
//   const markAllNotifRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

//   const permissions = {
//     canViewMaster: role === "super_admin",
//     canAdd: ["super_admin", "care_center", "reference"].includes(role),
//     canEdit: ["super_admin", "care_center", "reference"].includes(role),
//     canDelete: role === "super_admin",
//   };

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const ccRes = await API.get("/master/carecenters").catch(() => ({ data: [] }));
//         const eqRes = await API.get("/master/equipment").catch(() => ({ data: [] }));
//         const catRes = await API.get("/master/categories").catch(() => ({ data: [] }));
//         const refRes = await API.get("/master/references").catch(() => ({ data: [] }));
//         const deRes = await API.get("/master/delivery-executives").catch(() => ({ data: [] }));
        
//         if (ccRes.data) {
//           setCareCenters(ccRes.data.map(c => ({
//             id: c.id, 
//             name: c.name, 
//             address: c.address, 
//             contactPerson: c.contact_person || c.contactPerson, 
//             phone: c.phone, 
//             gst: c.gst,
//             status: c.status
//           })));
//         }

//         if (eqRes.data) {
//           setEquipmentCatalog(eqRes.data.map(e => ({
//             id: e.id, 
//             name: e.name, 
//             category: e.category, 
//             dailyRate: e.daily_rate || e.dailyRate, 
//             stock: e.stock,
//             status: e.status
//           })));
//         }

//         if (catRes.data) setCategories(catRes.data);
//         if (refRes.data) setReferences(refRes.data);
//         if (deRes.data) setDeliveryExecutives(deRes.data);

//         const reqRes = await API.get("/rental/requisitions").catch(() => ({ data: [] }));
//         if (reqRes.data) {
//           setLogs(reqRes.data.map(r => ({
//             id: r.id,
//             careCenterId: r.care_center_id || r.careCenterId,
//             careCenterName: r.careCenterName || "Care Center", 
//             equipmentId: r.equipment_id || r.equipmentId,
//             equipmentName: r.equipmentName || "Equipment", 
//             patientName: r.patient_name || r.patientName,
//             quantity: r.quantity,
//             startDate: r.start_date || r.startDate,
//             logoutDate: r.logout_date || r.logoutDate || "",
//             paymentType: r.payment_type || r.paymentType,
//             dealType: r.deal_type || r.dealType,
//             unit: r.unit,
//             mode: r.mode,
//             notifyDate: r.notify_date || r.notifyDate,
//             deliveryAddress: r.delivery_address || r.deliveryAddress,
//             notes: r.notes,
//             status: r.status || "Active" 
//           })));
//         }

//         const notifRes = await API.get("/rental/notifications").catch(() => ({ data: [] }));
//         if (notifRes.data) {
//           setNotifications(notifRes.data.map(n => ({
//             id: n.id,
//             title: n.title,
//             message: n.message,
//             type: n.type,
//             time: n.created_at || n.time,
//             read: false
//           })));
//         }

//       } catch (err) {
//         console.error("Failed to fetch Live Data:", err);
//       }
//     };

//     fetchAllData();
//   }, []);

 
//   return (
//   <div className="font-body flex h-screen w-full overflow-hidden bg-slate-50">
//     <Sidebar role={role} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unreadCount={unreadCount} onOpenNotifications={() => setNotifOpen(true)} />
    
//     <div className="flex min-h-0 min-w-0 flex-1 flex-col">
//       <Topbar role={role} setMobileOpen={setMobileOpen} unreadCount={unreadCount} onOpenNotifications={() => setNotifOpen(true)} onLogout={handleLogout} />
      
//       <div className="smooth-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
        
//         <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />
//             <Route path="/dashboard" element={<AdminDashboard role={role} logs={logs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} deliveryExecutives={deliveryExecutives} />} />
//             <Route path="/rental" element={<RentalMaster role={role} permissions={permissions} logs={logs} setLogs={setLogs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} references={references} categories={categories}/>} />
//             <Route path="/master" element={
//               permissions.canViewMaster ? (
//                 <MasterInfo careCenters={careCenters} setCareCenters={setCareCenters} equipmentCatalog={equipmentCatalog} setEquipmentCatalog={setEquipmentCatalog} categories={categories} setCategories={setCategories} references={references} setReferences={setReferences} deliveryExecutives={deliveryExecutives} setDeliveryExecutives={setDeliveryExecutives} />
//               ) : (
//                 <AccessDenied role={role} />
//               )
//             } />
//             <Route path="/profile" element={<UserProfile />} />
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </div>

//     <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} onMarkRead={markNotifRead} onMarkAllRead={markAllNotifRead} />
//   </div>
// );
//   //   <div className="font-body flex h-screen w-full overflow-hidden bg-slate-50">
//   //     <Sidebar role={role} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} unreadCount={unreadCount} onOpenNotifications={() => setNotifOpen(true)} />
//   //     <div className="flex min-h-0 min-w-0 flex-1 flex-col">
//   //       <Topbar role={role} setMobileOpen={setMobileOpen} unreadCount={unreadCount} onOpenNotifications={() => setNotifOpen(true)} onLogout={handleLogout} />
        
//   //       <main className="smooth-scroll flex min-h-0 flex-1 flex-col justify-between overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
//   //         <div className="flex-1 pb-6">
//   //           <Routes>
//   //             <Route path="/" element={<Navigate to="/dashboard" replace />} />
//   //             <Route path="/dashboard" element={<AdminDashboard role={role} logs={logs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} deliveryExecutives={deliveryExecutives} />} />
//   //             <Route path="/rental" element={<RentalMaster role={role} permissions={permissions} logs={logs} setLogs={setLogs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} references={references} categories={categories}/>} />
              
//   //             <Route path="/master" element={
//   //               permissions.canViewMaster ? (
//   //                 <MasterInfo careCenters={careCenters} setCareCenters={setCareCenters} equipmentCatalog={equipmentCatalog} setEquipmentCatalog={setEquipmentCatalog} categories={categories} setCategories={setCategories} references={references} setReferences={setReferences} deliveryExecutives={deliveryExecutives} setDeliveryExecutives={setDeliveryExecutives} />
//   //               ) : (
//   //                 <AccessDenied role={role} />
//   //               )
//   //             } />

//   //             <Route path="/profile" element={<UserProfile />} />
//   //             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//   //           </Routes>
//   //         </div>
//   //         <Footer />
//   //       </main>
//   //     </div>

//   //     <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} onMarkRead={markNotifRead} onMarkAllRead={markAllNotifRead} />
//   //   </div>
//   // );
// }

// export default function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState(null);

//   const handleLogin = (selectedRole) => {
//     setRole(selectedRole);
//     setIsAuthenticated(true);
//     toast.success("Login Successful!"); 
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setRole(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     toast.success("Logout Successful!"); 
//   };

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (user) {
//       const parsedUser = JSON.parse(user);
//       setTimeout(() => {
//         setRole(parsedUser.role);
//         setIsAuthenticated(true);
//       }, 0);
//     }
//   }, []);

//   return (
//     <Router>
//       <FontImport />
//       <Routes>
//         <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} /> } />
//         <Route path="/*" element={ isAuthenticated ? <MainAppLayout role={role} handleLogout={handleLogout} /> : <Navigate to="/login" replace /> } />
//       </Routes>
//       <Toaster />
//     </Router>
//   );
// }

import { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Toaster, toast } from "./components/UiComponents"; 
import { ROLES } from "./data/MockData";
import { Sidebar, Topbar, NotificationsPanel, Footer } from "./components/layout/Layout";
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
  const [careCenters, setCareCenters] = useState([]);
  const [equipmentCatalog, setEquipmentCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [references, setReferences] = useState([]);
  const [deliveryExecutives, setDeliveryExecutives] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markNotifRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllNotifRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const permissions = {
    canViewMaster: role === "super_admin",
    canAdd: ["super_admin", "care_center", "reference"].includes(role),
    canEdit: ["super_admin", "care_center", "reference"].includes(role),
    canDelete: role === "super_admin",
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const ccRes = await API.get("/master/carecenters").catch(() => ({ data: [] }));
        const eqRes = await API.get("/master/equipment").catch(() => ({ data: [] }));
        const catRes = await API.get("/master/categories").catch(() => ({ data: [] }));
        const refRes = await API.get("/master/references").catch(() => ({ data: [] }));
        const deRes = await API.get("/master/delivery-executives").catch(() => ({ data: [] }));
        
        if (ccRes.data) {
          setCareCenters(ccRes.data.map(c => ({
            id: c.id, 
            name: c.name, 
            address: c.address, 
            contactPerson: c.contact_person || c.contactPerson, 
            phone: c.phone, 
            gst: c.gst,
            status: c.status
          })));
        }

        if (eqRes.data) {
          setEquipmentCatalog(eqRes.data.map(e => ({
            id: e.id, 
            name: e.name, 
            category: e.category, 
            dailyRate: e.daily_rate || e.dailyRate, 
            stock: e.stock,
            status: e.status
          })));
        }

        if (catRes.data) setCategories(catRes.data);
        if (refRes.data) setReferences(refRes.data);
        if (deRes.data) setDeliveryExecutives(deRes.data);

        const reqRes = await API.get("/rental/requisitions").catch(() => ({ data: [] }));
        if (reqRes.data) {
          setLogs(reqRes.data.map(r => ({
            id: r.id,
            careCenterId: r.care_center_id || r.careCenterId,
            careCenterName: r.careCenterName || "Care Center", 
            equipmentId: r.equipment_id || r.equipmentId,
            equipmentName: r.equipmentName || "Equipment", 
            patientName: r.patient_name || r.patientName,
            quantity: r.quantity,
            startDate: r.start_date || r.startDate,
            logoutDate: r.logout_date || r.logoutDate || "",
            paymentType: r.payment_type || r.paymentType,
            dealType: r.deal_type || r.dealType,
            unit: r.unit,
            mode: r.mode,
            notifyDate: r.notify_date || r.notifyDate,
            deliveryAddress: r.delivery_address || r.deliveryAddress,
            notes: r.notes,
            status: r.status || "Active" 
          })));
        }

        const notifRes = await API.get("/rental/notifications").catch(() => ({ data: [] }));
        if (notifRes.data) {
          setNotifications(notifRes.data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            time: n.created_at || n.time,
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
        
        <div className="smooth-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
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
          <Footer />
        </div>
      </div>

      <NotificationsPanel 
        open={notifOpen} 
        onClose={() => setNotifOpen(false)} 
        notifications={notifications} 
        onMarkRead={markNotifRead} 
        onMarkAllRead={markAllNotifRead} 
        onDeleteNotif={deleteNotif}
      />
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