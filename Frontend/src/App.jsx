// import { useState, useEffect, useMemo } from "react"; 
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { ShieldCheck } from "lucide-react";
// import { Toaster, toast } from "./components/UiComponents"; 
// import { ROLES } from "./data/MockData";
// import { Sidebar, Topbar, NotificationsPanel, Footer } from "./components/layout/Layout";
// import WelcomeBanner from "./components/WelcomeBanner"; 
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import RentalMaster from "./pages/RentalMaster";
// import MasterInfo from "./pages/MasterInfo";
// import UserProfile from "./pages/UserProfile"; 
// import API from "./utils/api"; 

// const getSafeUser = () => {
//   try {
//     const rawUser = localStorage.getItem("user");
//     if (!rawUser || rawUser === "undefined" || rawUser === "null") return {};
//     const parsed = JSON.parse(rawUser);
//     return parsed && typeof parsed === "object" ? parsed : {};
//   } catch {
//     return {};
//   }
// };

// const getInitialAuth = () => {
//   try {
//     const user = getSafeUser();
//     if (user && user.role) {
//       return { isAuth: true, role: user.role };
//     }
//     const token = localStorage.getItem("token");
//     if (token) return { isAuth: true, role: "care_center" };
//     return { isAuth: false, role: null };
//   } catch {
//     return { isAuth: false, role: null };
//   }
// };

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
//         The <span className="font-semibold text-slate-600">{ROLES[role]?.label || role}</span> role does not have permission to view Master Info.
//       </p>
//     </div>
//   );
// }

// function MainAppLayout({ role, handleLogout, welcomeUser, setWelcomeUser }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [careCenters, setCareCenters] = useState([]);
//   const [equipmentCatalog, setEquipmentCatalog] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [references, setReferences] = useState([]);
//   const [deliveryExecutives, setDeliveryExecutives] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   const loggedUser = useMemo(() => getSafeUser(), []);
//   const isCareCenter = role === "care_center" || loggedUser?.role === "care_center";
//   const myCenterId = (loggedUser?.careCenterId || loggedUser?.id || "").toString().trim().toLowerCase();
//   const myCenterName = (loggedUser?.careCenterName || loggedUser?.name || "").toLowerCase().trim();

//   const unreadCount = useMemo(() => {
//     if (!notifications || notifications.length === 0) return 0;
//     if (!isCareCenter) return notifications.filter((n) => !n.read).length;

//     return notifications.filter((n) => {
//       if (n.read) return false;
//       const nCcId = (n.care_center_id || n.careCenterId || "").toString().trim().toLowerCase();
//       const nCcName = (n.careCenterName || "").toLowerCase().trim();
//       const nText = `${n.title || ""} ${n.message || ""}`.toLowerCase();

//       return (
//         (nCcId && myCenterId && (nCcId === myCenterId || nCcId.replace(/\D/g, "") === myCenterId.replace(/\D/g, ""))) ||
//         (nCcName && myCenterName && (nCcName.includes(myCenterName) || myCenterName.includes(nCcName))) ||
//         (myCenterName && nText.includes(myCenterName)) ||
//         (!nCcId && !nCcName)
//       );
//     }).length;
//   }, [notifications, isCareCenter, myCenterId, myCenterName]);

//   const markNotifRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
//   const markAllNotifRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  
//   const deleteNotif = async (id) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//     try {
//       await API.delete(`/rental/notifications/${id}`);
//     } catch (err) {
//       console.error("Failed to delete notification:", err);
//     }
//   };

//   const permissions = {
//     canViewMaster: role === "super_admin",
//     canAdd: ["super_admin", "care_center", "reference"].includes(role),
//     canEdit: ["super_admin", "care_center", "reference"].includes(role),
//     canDelete: role === "super_admin",
//   };

//   useEffect(() => {
//     let isMounted = true;

//     const fetchAllData = async () => {
//       try {
//         const [ccRes, eqRes, catRes, refRes, deRes, reqRes] = await Promise.all([
//           API.get("/master/carecenters").catch(() => ({ data: [] })),
//           API.get("/master/equipment").catch(() => ({ data: [] })),
//           API.get("/master/categories").catch(() => ({ data: [] })),
//           API.get("/master/references").catch(() => ({ data: [] })),
//           API.get("/master/delivery-executives").catch(() => ({ data: [] })),
//           API.get("/rental/requisitions").catch(() => ({ data: [] }))
//         ]);

//         if (!isMounted) return;

//         if (Array.isArray(ccRes.data)) {
//           setCareCenters(ccRes.data.map((c) => ({
//             id: c.id, 
//             name: c.name, 
//             address: c.address, 
//             contactPerson: c.contact_person || c.contactPerson, 
//             phone: c.phone, 
//             gst: c.gst,
//             status: c.status
//           })));
//         }

//         if (Array.isArray(eqRes.data)) {
//           setEquipmentCatalog(eqRes.data.map((e) => ({
//             id: e.id, 
//             name: e.name, 
//             category: e.category, 
//             dailyRate: e.daily_rate || e.dailyRate, 
//             stock: e.stock,
//             status: e.status
//           })));
//         }

//         if (Array.isArray(catRes.data)) setCategories(catRes.data);
//         if (Array.isArray(refRes.data)) setReferences(refRes.data);
//         if (Array.isArray(deRes.data)) setDeliveryExecutives(deRes.data);

//         if (Array.isArray(reqRes.data)) {
//           setLogs(reqRes.data.map((r) => ({
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

//         const userObj = getSafeUser();
//         const ccId = userObj?.careCenterId || userObj?.id || "";
//         const userRole = userObj?.role || role || "";

//         const notifRes = await API.get(`/rental/notifications?careCenterId=${ccId}&role=${userRole}`).catch(() => ({ data: [] }));
        
//         if (isMounted && Array.isArray(notifRes.data)) {
//           setNotifications(notifRes.data.map((n) => ({
//             id: n.id,
//             title: n.title,
//             message: n.message,
//             type: n.type || "info",
//             care_center_id: n.care_center_id || n.careCenterId || "",
//             careCenterName: n.care_center_name || n.careCenterName || "",
//             time: n.created_at || n.time,
//             read: false
//           })));
//         }

//       } catch (err) {
//         console.error("Data load error:", err);
//       }
//     };

//     fetchAllData();

//     return () => {
//       isMounted = false;
//     };
//   }, [role]);

//   return (
//     <div className="font-body flex h-screen w-full overflow-hidden bg-slate-50 relative">
      
//       {/* 🌟 Modern Floating Welcome Banner */}
//       {welcomeUser && (
//         <WelcomeBanner user={welcomeUser} onClose={() => setWelcomeUser(null)} />
//       )}

//       <Sidebar 
//         role={role} 
//         mobileOpen={mobileOpen} 
//         setMobileOpen={setMobileOpen} 
//         unreadCount={unreadCount} 
//         onOpenNotifications={() => setNotifOpen(true)} 
//       />
      
//       <div className="flex min-h-0 min-w-0 flex-1 flex-col">
//         <Topbar 
//           role={role} 
//           setMobileOpen={setMobileOpen} 
//           unreadCount={unreadCount} 
//           onOpenNotifications={() => setNotifOpen(true)} 
//           onLogout={handleLogout} 
//         />
        
//         <div className="smooth-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
//           <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
//             <Routes>
//               <Route path="/" element={<Navigate to="/dashboard" replace />} />
//               <Route path="/dashboard" element={<AdminDashboard role={role} logs={logs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} deliveryExecutives={deliveryExecutives} />} />
//               <Route path="/rental" element={<RentalMaster role={role} permissions={permissions} logs={logs} setLogs={setLogs} careCenters={careCenters} equipmentCatalog={equipmentCatalog} references={references} categories={categories}/>} />
//               <Route path="/master" element={
//                 permissions.canViewMaster ? (
//                   <MasterInfo careCenters={careCenters} setCareCenters={setCareCenters} equipmentCatalog={equipmentCatalog} setEquipmentCatalog={setEquipmentCatalog} categories={categories} setCategories={setCategories} references={references} setReferences={setReferences} deliveryExecutives={deliveryExecutives} setDeliveryExecutives={setDeliveryExecutives} />
//                 ) : (
//                   <AccessDenied role={role} />
//                 )
//               } />
//               <Route path="/profile" element={<UserProfile />} />
//               <Route path="*" element={<Navigate to="/dashboard" replace />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </div>

//       <NotificationsPanel 
//         open={notifOpen} 
//         onClose={() => setNotifOpen(false)} 
//         notifications={notifications} 
//         onMarkRead={markNotifRead} 
//         onMarkAllRead={markAllNotifRead} 
//         onDeleteNotif={deleteNotif}
//       />
//     </div>
//   );
// }

// export default function App() {
//   const [auth, setAuth] = useState(getInitialAuth);
//   const [welcomeUser, setWelcomeUser] = useState(null);

//   const handleLogin = (selectedRole, customUser = null) => {
//     const user = customUser || getSafeUser();
//     const effectiveRole = selectedRole || user?.role || "care_center";

//     setAuth({ isAuth: true, role: effectiveRole });
//     setWelcomeUser(user); 
//   };

//   const handleLogout = () => {
//     setAuth({ isAuth: false, role: null });
//     setWelcomeUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     toast.success("Logged out securely."); 
//   };

//   return (
//     <Router>
//       <FontImport />
//       <Routes>
//         <Route path="/login" element={auth.isAuth ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} /> } />
//         <Route 
//           path="/*" 
//           element={
//             auth.isAuth ? (
//               <MainAppLayout 
//                 role={auth.role} 
//                 handleLogout={handleLogout} 
//                 welcomeUser={welcomeUser}
//                 setWelcomeUser={setWelcomeUser}
//               />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           } 
//         />
//       </Routes>
//       <Toaster />
//     </Router>
//   );
// }

import { useState, useEffect, useMemo } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Toaster, toast } from "./components/UiComponents"; 
import { ROLES } from "./data/MockData";
import { Sidebar, Topbar, NotificationsPanel, Footer } from "./components/layout/Layout";
import WelcomeBanner from "./components/WelcomeBanner"; 
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import RentalMaster from "./pages/RentalMaster";
import MasterInfo from "./pages/MasterInfo";
import UserProfile from "./pages/UserProfile"; 
import API from "./utils/api"; 

const getSafeUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser || rawUser === "undefined" || rawUser === "null") return {};
    const parsed = JSON.parse(rawUser);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const getInitialAuth = () => {
  try {
    const user = getSafeUser();
    if (user && user.role) {
      return { isAuth: true, role: user.role };
    }
    const token = localStorage.getItem("token");
    if (token) return { isAuth: true, role: "care_center" };
    return { isAuth: false, role: null };
  } catch {
    return { isAuth: false, role: null };
  }
};

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
        The <span className="font-semibold text-slate-600">{ROLES?.[role]?.label || role}</span> role does not have permission to view Master Info.
      </p>
    </div>
  );
}

function MainAppLayout({ role, handleLogout, welcomeUser, setWelcomeUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [careCenters, setCareCenters] = useState([]);
  const [equipmentCatalog, setEquipmentCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [references, setReferences] = useState([]);
  const [deliveryExecutives, setDeliveryExecutives] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const loggedUser = useMemo(() => getSafeUser(), []);
  const isCareCenter = role === "care_center" || loggedUser?.role === "care_center";
  const myCenterId = (loggedUser?.careCenterId || loggedUser?.id || "").toString().trim().toLowerCase();
  const myCenterName = (loggedUser?.careCenterName || loggedUser?.name || "").toLowerCase().trim();

  const unreadCount = useMemo(() => {
    if (!notifications || notifications.length === 0) return 0;
    if (!isCareCenter) return notifications.filter((n) => !n.read).length;

    return notifications.filter((n) => {
      if (n.read) return false;
      const nCcId = (n.care_center_id || n.careCenterId || "").toString().trim().toLowerCase();
      const nCcName = (n.careCenterName || "").toLowerCase().trim();
      const nText = `${n.title || ""} ${n.message || ""}`.toLowerCase();

      return (
        (nCcId && myCenterId && (nCcId === myCenterId || nCcId.replace(/\D/g, "") === myCenterId.replace(/\D/g, ""))) ||
        (nCcName && myCenterName && (nCcName.includes(myCenterName) || myCenterName.includes(nCcName))) ||
        (myCenterName && nText.includes(myCenterName)) ||
        (!nCcId && !nCcName)
      );
    }).length;
  }, [notifications, isCareCenter, myCenterId, myCenterName]);

  const markNotifRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllNotifRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  
  const deleteNotif = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await API.delete(`/rental/notifications/${id}`);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const permissions = {
    canViewMaster: role === "super_admin",
    canAdd: ["super_admin", "care_center", "reference"].includes(role),
    canEdit: ["super_admin", "care_center", "reference"].includes(role),
    canDelete: role === "super_admin",
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const [ccRes, eqRes, catRes, refRes, deRes, reqRes] = await Promise.all([
          API.get("/master/carecenters").catch(() => ({ data: [] })),
          API.get("/master/equipment").catch(() => ({ data: [] })),
          API.get("/master/categories").catch(() => ({ data: [] })),
          API.get("/master/references").catch(() => ({ data: [] })),
          API.get("/master/delivery-executives").catch(() => ({ data: [] })),
          API.get("/rental/requisitions").catch(() => ({ data: [] }))
        ]);

        if (!isMounted) return;

        if (Array.isArray(ccRes.data)) {
          setCareCenters(ccRes.data.map((c) => ({
            id: c.id, 
            name: c.name, 
            address: c.address, 
            contactPerson: c.contact_person || c.contactPerson, 
            phone: c.phone, 
            gst: c.gst,
            status: c.status
          })));
        }

        if (Array.isArray(eqRes.data)) {
          setEquipmentCatalog(eqRes.data.map((e) => ({
            id: e.id, 
            name: e.name, 
            category: e.category, 
            dailyRate: e.daily_rate || e.dailyRate, 
            stock: e.stock,
            status: e.status
          })));
        }

        if (Array.isArray(catRes.data)) setCategories(catRes.data);
        if (Array.isArray(refRes.data)) setReferences(refRes.data);
        if (Array.isArray(deRes.data)) setDeliveryExecutives(deRes.data);

        if (Array.isArray(reqRes.data)) {
          setLogs(reqRes.data.map((r) => ({
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

        const userObj = getSafeUser();
        const ccId = userObj?.careCenterId || userObj?.id || "";
        const userRole = userObj?.role || role || "";

        const notifRes = await API.get(`/rental/notifications?careCenterId=${ccId}&role=${userRole}`).catch(() => ({ data: [] }));
        
        if (isMounted && Array.isArray(notifRes.data)) {
          setNotifications(notifRes.data.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || "info",
            care_center_id: n.care_center_id || n.careCenterId || "",
            careCenterName: n.care_center_name || n.careCenterName || "",
            time: n.created_at || n.time,
            read: false
          })));
        }

      } catch (err) {
        console.error("Data load error:", err);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [role]);

  return (
    <div className="font-body flex h-screen w-full overflow-hidden bg-slate-50 relative">
      
      {welcomeUser && (
        <WelcomeBanner user={welcomeUser} onClose={() => setWelcomeUser(null)} />
      )}

      <Sidebar 
        role={role} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        unreadCount={unreadCount} 
        onOpenNotifications={() => setNotifOpen(true)} 
      />
      
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar 
          role={role} 
          setMobileOpen={setMobileOpen} 
          unreadCount={unreadCount} 
          onOpenNotifications={() => setNotifOpen(true)} 
          onLogout={handleLogout} 
        />
        
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
  const [auth, setAuth] = useState(getInitialAuth);
  const [welcomeUser, setWelcomeUser] = useState(null);

  const handleLogin = (selectedRole, customUser = null) => {
    const user = customUser || getSafeUser();
    const effectiveRole = selectedRole || user?.role || "care_center";

    setAuth({ isAuth: true, role: effectiveRole });
    setWelcomeUser(user); 
  };

  const handleLogout = () => {
    setAuth({ isAuth: false, role: null });
    setWelcomeUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out securely."); 
  };

  return (
    <Router>
      <FontImport />
      <Routes>
        <Route path="/login" element={auth.isAuth ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} /> } />
        <Route 
          path="/*" 
          element={
            auth.isAuth ? (
              <MainAppLayout 
                role={auth.role} 
                handleLogout={handleLogout} 
                welcomeUser={welcomeUser}
                setWelcomeUser={setWelcomeUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}