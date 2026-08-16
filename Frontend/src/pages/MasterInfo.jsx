// // import { useState } from "react";
// // import { Package, Tag, Building2, Users, Truck, MapPin, Phone, Pencil, Trash2, Plus, X, Save } from "lucide-react";
// // import { PrimaryButton, GhostButton, IconAction, ConfirmDialog, Field, TextInput, Select, StatusBadge, toast } from "../components/UiComponents";
// // import API from "../utils/api";

// // function CareCenterFormModal({ initial, onClose, onSubmit }) {
// //   const [form, setForm] = useState({ 
// //     id: initial?.id || null,
// //     name: initial?.name || "", 
// //     address: initial?.address || "", 
// //     phone: initial?.phone || "", 
// //     altPhone: initial?.altPhone || initial?.contactPerson || "", 
// //     status: initial?.status || "Active" 
// //   });
// //   const [errors, setErrors] = useState({});
// //   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

// //   const validate = () => {
// //     const e = {};
// //     if (!(form.name || "").trim()) e.name = "Care Center Name is required.";
// //     if (!(form.address || "").trim()) e.address = "Address is required.";
// //     if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
// //     if (form.altPhone && !/^\d{10}$/.test(form.altPhone)) e.altPhone = "Invalid 10-digit mobile number.";
    
// //     setErrors(e);
// //     if (Object.keys(e).length > 0) {
// //       toast.error("Validation Failed");
// //       return false;
// //     }
// //     return true;
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
// //       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// //           <h2 className="font-display text-base font-bold text-slate-800">
// //             {initial?.id ? "Edit Care Center Registry Form" : "Care Center Registry Form"}
// //           </h2>
// //           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
// //         </div>
// //         <div className="space-y-4 px-6 py-5">
// //           <Field label="Care Center Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
// //           <Field label="Address" required error={errors.address}><textarea rows={3} value={form.address} onChange={(e) => set({ address: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none ${errors.address ? "border-rose-300" : "border-slate-200 focus:border-teal-500"}`} /></Field>
// //           <div className="grid grid-cols-2 gap-4">
// //             <Field label="Mobile Number" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
// //             <Field label="Alternative Mobile Number" error={errors.altPhone}><TextInput type="tel" value={form.altPhone} error={errors.altPhone} onChange={(e) => set({ altPhone: e.target.value })} /></Field>
// //           </div>
// //           <Field label="Status" required>
// //             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
// //               <option value="Active">Active</option>
// //               <option value="Inactive">Inactive</option>
// //             </Select>
// //           </Field>
// //         </div>
// //         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
// //           <GhostButton onClick={onClose}>Cancel</GhostButton>
// //           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function CategoryFormModal({ initial, onClose, onSubmit }) {
// //   const [form, setForm] = useState({ 
// //     id: initial?.id || null,
// //     name: initial?.name || "", 
// //     status: initial?.status || "Active" 
// //   });
// //   const [errors, setErrors] = useState({});
// //   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

// //   const validate = () => {
// //     const e = {};
// //     if (!(form.name || "").trim()) e.name = "Accessory Component Name is required.";
// //     setErrors(e);
// //     if (Object.keys(e).length > 0) {
// //       toast.error("Validation Failed");
// //       return false;
// //     }
// //     return true;
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
// //       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// //           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Accessory" : "Add New Accessory"}</h2>
// //           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
// //         </div>
// //         <div className="space-y-4 px-6 py-5">
// //           <Field label="Accessory Component Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
// //           <Field label="Status" required>
// //             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
// //               <option value="Active">Active</option>
// //               <option value="Inactive">Inactive</option>
// //             </Select>
// //           </Field>
// //         </div>
// //         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
// //           <GhostButton onClick={onClose}>Cancel</GhostButton>
// //           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function ReferenceFormModal({ initial, onClose, onSubmit }) {
// //   const [form, setForm] = useState({ 
// //     id: initial?.id || null,
// //     doctorName: initial?.doctorName || initial?.name || "", 
// //     domain: initial?.domain || initial?.type || "", 
// //     hospital: initial?.hospital || initial?.address || "", 
// //     phone: initial?.phone || "", 
// //     altPhone: initial?.altPhone || "", 
// //     status: initial?.status || "Active" 
// //   });
// //   const [errors, setErrors] = useState({});
// //   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

// //   const validate = () => {
// //     const e = {};
// //     if (!(form.doctorName || "").trim()) e.doctorName = "Doctor Name is required.";
// //     if (!(form.domain || "").trim()) e.domain = "Specialist Domain is required.";
// //     if (!(form.hospital || "").trim()) e.hospital = "Hospital Institute Name is required.";
// //     if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
// //     if (form.altPhone && !/^\d{10}$/.test(form.altPhone)) e.altPhone = "Invalid 10-digit mobile number.";
    
// //     setErrors(e);
// //     if (Object.keys(e).length > 0) {
// //       toast.error("Validation Failed");
// //       return false;
// //     }
// //     return true;
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
// //       <div className="fade-slide-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// //           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit External Reference" : "Link External Reference Record"}</h2>
// //           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
// //         </div>
// //         <div className="space-y-4 px-6 py-5">
// //           <div className="grid grid-cols-2 gap-4">
// //             <Field label="Doctor Name" required error={errors.doctorName}><TextInput value={form.doctorName} error={errors.doctorName} onChange={(e) => set({ doctorName: e.target.value })} /></Field>
// //             <Field label="Specialist Domain" required error={errors.domain}><TextInput value={form.domain} error={errors.domain} onChange={(e) => set({ domain: e.target.value })} /></Field>
// //           </div>
// //           <Field label="Hospital Institute Name" required error={errors.hospital}><TextInput value={form.hospital} error={errors.hospital} onChange={(e) => set({ hospital: e.target.value })} /></Field>
// //           <div className="grid grid-cols-2 gap-4">
// //             <Field label="Mobile Number" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
// //             <Field label="Alternative Number" error={errors.altPhone}><TextInput type="tel" value={form.altPhone} error={errors.altPhone} onChange={(e) => set({ altPhone: e.target.value })} /></Field>
// //           </div>
// //           <Field label="Status" required>
// //             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
// //               <option value="Active">Active</option>
// //               <option value="Inactive">Inactive</option>
// //             </Select>
// //           </Field>
// //         </div>
// //         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
// //           <GhostButton onClick={onClose}>Cancel</GhostButton>
// //           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function DeliveryExecutiveFormModal({ initial, onClose, onSubmit }) {
// //   const [form, setForm] = useState({ 
// //     id: initial?.id || null,
// //     driverName: initial?.driverName || initial?.name || "", 
// //     phone: initial?.phone || "", 
// //     status: initial?.status || "Active" 
// //   });
// //   const [errors, setErrors] = useState({});
// //   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

// //   const validate = () => {
// //     const e = {};
// //     if (!(form.driverName || "").trim()) e.driverName = "Delivery Agent Name is required.";
// //     if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
    
// //     setErrors(e);
// //     if (Object.keys(e).length > 0) {
// //       toast.error("Validation Failed");
// //       return false;
// //     }
// //     return true;
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
// //       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// //           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Delivery Agent" : "Add Delivery Agent"}</h2>
// //           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
// //         </div>
// //         <div className="space-y-4 px-6 py-5">
// //           <Field label="Delivery Agent Name" required error={errors.driverName}><TextInput value={form.driverName} error={errors.driverName} onChange={(e) => set({ driverName: e.target.value })} /></Field>
// //           <Field label="Active Mobile Hotline" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
// //           <Field label="Status" required>
// //             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
// //               <option value="Active">Active</option>
// //               <option value="Inactive">Inactive</option>
// //             </Select>
// //           </Field>
// //         </div>
// //         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
// //           <GhostButton onClick={onClose}>Cancel</GhostButton>
// //           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function EquipmentFormModal({ initial, onClose, onSubmit }) {
// //   const [form, setForm] = useState({ 
// //     id: initial?.id || null,
// //     name: initial?.name || "", 
// //     category: initial?.category || "Respiratory", 
// //     dailyRate: initial?.dailyRate || "", 
// //     stock: initial?.stock || "", 
// //     status: initial?.status || "Active" 
// //   });
// //   const [errors, setErrors] = useState({});
// //   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

// //   const validate = () => {
// //     const e = {};
// //     if (!(form.name || "").trim()) e.name = "Equipment name is required.";
// //     if (!form.dailyRate || Number(form.dailyRate) <= 0) e.dailyRate = "Enter a valid daily rate.";
// //     if (form.stock === "" || Number(form.stock) < 0) e.stock = "Enter a valid stock count.";
// //     setErrors(e);
// //     if (Object.keys(e).length > 0) {
// //       toast.error("Validation Failed");
// //       return false;
// //     }
// //     return true;
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
// //       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// //           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Equipment" : "Add Equipment"}</h2>
// //           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
// //         </div>
// //         <div className="space-y-4 px-6 py-5">
// //           <Field label="Equipment Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
// //           <div className="grid grid-cols-2 gap-4">
// //             <Field label="Daily Rate (₹)" required error={errors.dailyRate}><TextInput type="number" value={form.dailyRate} error={errors.dailyRate} onChange={(e) => set({ dailyRate: e.target.value })} /></Field>
// //             <Field label="Stock" required error={errors.stock}><TextInput type="number" value={form.stock} error={errors.stock} onChange={(e) => set({ stock: e.target.value })} /></Field>
// //           </div>
// //           <Field label="Status" required>
// //             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
// //               <option value="Active">Active</option>
// //               <option value="Inactive">Inactive</option>
// //             </Select>
// //           </Field>
// //         </div>
// //         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
// //           <GhostButton onClick={onClose}>Cancel</GhostButton>
// //           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function MasterInfo({ careCenters, setCareCenters, equipmentCatalog, setEquipmentCatalog, categories, setCategories, references, setReferences, deliveryExecutives, setDeliveryExecutives }) {
// //   const [tab, setTab] = useState("device");
// //   const [ccModal, setCcModal] = useState(null);
// //   const [eqModal, setEqModal] = useState(null);
// //   const [catModal, setCatModal] = useState(null);
// //   const [refModal, setRefModal] = useState(null);
// //   const [deModal, setDeModal] = useState(null);
// //   const [confirmDelete, setConfirmDelete] = useState(null);

// //   const saveCareCenter = async (data) => { 
// //     try {
// //       if (data.id) { 
// //         await API.put(`/master/carecenters/${data.id}`, data);
// //       } else { 
// //         await API.post("/master/carecenters", data);
// //       } 
// //       const res = await API.get("/master/carecenters");
// //       setCareCenters(res.data);
// //       setCcModal(null); 
// //       toast.success(data.id ? "Record Updated" : "Record Added");
// //     } catch { toast.error("Unable to Save Record"); }
// //   };

// //   const saveEquipment = async (data) => { 
// //     try {
// //       if (data.id) { 
// //         await API.put(`/master/equipment/${data.id}`, data);
// //       } else { 
// //         await API.post("/master/equipment", data);
// //       } 
// //       const res = await API.get("/master/equipment");
// //       setEquipmentCatalog(res.data);
// //       setEqModal(null); 
// //       toast.success(data.id ? "Record Updated" : "Record Added");
// //     } catch { toast.error("Unable to Save Record"); }
// //   };

// //   const saveCategory = async (data) => { 
// //     try {
// //       if (data.id) {
// //         await API.put(`/master/categories/${data.id}`, data);
// //       } else {
// //         await API.post("/master/categories", data);
// //       }
// //       const res = await API.get("/master/categories");
// //       setCategories(res.data);
// //       setCatModal(null);
// //       toast.success(data.id ? "Record Updated" : "Record Added");
// //     } catch { toast.error("Unable to Save Record"); }
// //   };

// //   const saveReference = async (data) => { 
// //     try {
// //       if (data.id) {
// //         await API.put(`/master/references/${data.id}`, data);
// //       } else {
// //         await API.post("/master/references", data);
// //       }
// //       const res = await API.get("/master/references");
// //       setReferences(res.data);
// //       setRefModal(null);
// //       toast.success(data.id ? "Record Updated" : "Record Added");
// //     } catch { toast.error("Unable to Save Record"); }
// //   };

// //   const saveDeliveryExecutive = async (data) => { 
// //     try {
// //       if (data.id) {
// //         await API.put(`/master/delivery-executives/${data.id}`, data);
// //       } else {
// //         await API.post("/master/delivery-executives", data);
// //       }
// //       const res = await API.get("/master/delivery-executives");
// //       setDeliveryExecutives(res.data);
// //       setDeModal(null);
// //       toast.success(data.id ? "Record Updated" : "Record Added");
// //     } catch { toast.error("Unable to Save Record"); }
// //   };

// //   const handleDelete = async () => {
// //     try {
// //       const id = confirmDelete.item.id;
// //       const type = confirmDelete.type;
      
// //       if (type === "center") {
// //         await API.delete(`/master/carecenters/${id}`);
// //         setCareCenters((prev) => prev.filter((c) => c.id !== id));
// //       } 
// //       else if (type === "equipment") {
// //         await API.delete(`/master/equipment/${id}`);
// //         setEquipmentCatalog((prev) => prev.filter((e) => e.id !== id));
// //       } 
// //       else if (type === "category") {
// //         await API.delete(`/master/categories/${id}`);
// //         setCategories((prev) => prev.filter((c) => c.id !== id));
// //       } 
// //       else if (type === "reference") {
// //         await API.delete(`/master/references/${id}`);
// //         setReferences((prev) => prev.filter((r) => r.id !== id));
// //       } 
// //       else if (type === "deliveryExecutive") {
// //         await API.delete(`/master/delivery-executives/${id}`);
// //         setDeliveryExecutives((prev) => prev.filter((d) => d.id !== id));
// //       }
      
// //       setConfirmDelete(null);
// //       toast.success("Record Deleted From Database Successfully");
// //     } catch (error) {
// //       console.error("Delete Error:", error);
// //       toast.error("Error: " + (error.response?.data?.message || "Could not delete from backend"));
// //     }
// //   };

// //   const deleteLabels = { center: "care center", equipment: "device", category: "accessory", reference: "reference", deliveryExecutive: "delivery agent" };

// //   const tabDataMap = {
// //     device: equipmentCatalog,
// //     accessory: categories,
// //     careCenter: careCenters,
// //     reference: references,
// //     deliveryExecutive: deliveryExecutives,
// //   };
// //   const currentTabList = tabDataMap[tab] || [];
  
// //   const activeCount = currentTabList.filter((item) => item.status === "Active" || !item.status).length;
// //   const inactiveCount = currentTabList.length - activeCount;

// //   const tabAddLabels = {
// //     device: "Add Device",
// //     accessory: "Add New Accessory",
// //     careCenter: "Care Center Form",
// //     reference: "Link Reference",
// //     deliveryExecutive: "Add Delivery Agent",
// //   };

// //   const handleAddNewAsset = () => {
// //     if (tab === "device") setEqModal({});
// //     else if (tab === "accessory") setCatModal({});
// //     else if (tab === "careCenter") setCcModal({});
// //     else if (tab === "reference") setRefModal({});
// //     else if (tab === "deliveryExecutive") setDeModal({});
// //   };

// //   return (
// //     <div className="space-y-5">
// //       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //           <div>
// //             <h2 className="font-display text-2xl font-bold text-slate-800">Global Inventory Ledger</h2>
// //             <p className="mt-1 text-sm text-slate-400">Real-time modular tracking infrastructure.</p>
// //           </div>
// //           <div className="flex flex-wrap items-center gap-3">
// //             <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
// //               Active: <span className="text-teal-600">{activeCount}</span>
// //             </span>
// //             <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
// //               Inactive: <span className="text-rose-500">{inactiveCount}</span>
// //             </span>
// //             <PrimaryButton onClick={handleAddNewAsset}>
// //               <Plus className="h-4 w-4" /> {tabAddLabels[tab]}
// //             </PrimaryButton>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm w-fit overflow-x-auto">
// //         {[
// //           { key: "device", label: "New Device", icon: Package },
// //           { key: "accessory", label: "Accessories", icon: Tag },
// //           { key: "careCenter", label: "Care Center", icon: Building2 },
// //           { key: "reference", label: "Reference", icon: Users },
// //           { key: "deliveryExecutive", label: "Delivery Agent", icon: Truck },
// //         ].map((t) => (
// //           <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === t.key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
// //             <t.icon className="h-4 w-4" /> {t.label}
// //           </button>
// //         ))}
// //       </div>

// //       {tab === "careCenter" && (
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //             <div><h3 className="font-display text-sm font-bold text-slate-700">Registered Care Centers</h3><p className="text-xs text-slate-400">{careCenters.length} centers on record</p></div>
// //           </div>
// //           <div className="smooth-scroll-x overflow-x-auto">
// //             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
// //                   <th className="px-5 py-3">Center Name</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-100">
// //                 {careCenters.map((c) => (
// //                   <tr key={c.id} className="transition hover:bg-slate-50/60">
// //                     <td className="px-5 py-3.5"><p className="font-semibold text-slate-700">{c.name}</p><p className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" /> {c.address}</p></td>
// //                     <td className="px-5 py-3.5"><p className="font-medium text-slate-600">{c.phone}</p><p className="text-xs text-slate-400">{c.altPhone || c.contactPerson}</p></td>
// //                     <td className="px-5 py-3.5"><StatusBadge status={c.status || "Active"} /></td>
// //                     <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setCcModal(c)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "center", item: c })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {tab === "device" && (
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //             <div><h3 className="font-display text-sm font-bold text-slate-700">New Device</h3><p className="text-xs text-slate-400">{equipmentCatalog.length} devices available</p></div>
// //           </div>
// //           <div className="smooth-scroll-x overflow-x-auto">
// //             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
// //                   <th className="px-5 py-3">Equipment</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Daily Rate</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-100">
// //                 {equipmentCatalog.map((eq) => (
// //                   <tr key={eq.id} className="transition hover:bg-slate-50/60">
// //                     <td className="px-5 py-3.5 font-semibold text-slate-700">{eq.name}</td>
// //                     <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{eq.category}</span></td>
// //                     <td className="px-5 py-3.5 text-slate-600">₹{eq.dailyRate}/day</td>
// //                     <td className="px-5 py-3.5"><span className={`text-sm font-semibold ${eq.stock < 8 ? "text-amber-600" : "text-slate-600"}`}>{eq.stock} units</span></td>
// //                     <td className="px-5 py-3.5"><StatusBadge status={eq.status || "Active"} /></td>
// //                     <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setEqModal(eq)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "equipment", item: eq })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {tab === "accessory" && (
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //             <div><h3 className="font-display text-sm font-bold text-slate-700">Accessories</h3><p className="text-xs text-slate-400">{categories.length} accessories defined</p></div>
// //           </div>
// //           <div className="divide-y divide-slate-100">
// //             {categories.map((cat) => (
// //               <div key={cat.id} className="flex items-center justify-between gap-4 px-5 py-4">
// //                 <div className="flex items-center gap-3">
// //                   <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><Tag className="h-4 w-4" /></div>
// //                   <div>
// //                     <p className="font-semibold text-slate-700">{cat.name}</p>
// //                     <p className="mt-0.5"><StatusBadge status={cat.status || "Active"} /></p>
// //                   </div>
// //                 </div>
// //                 <div className="flex shrink-0 items-center gap-1">
// //                   <IconAction title="Edit" tone="teal" onClick={() => setCatModal(cat)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "category", item: cat })}><Trash2 className="h-4 w-4" /></IconAction>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {tab === "reference" && (
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //             <div><h3 className="font-display text-sm font-bold text-slate-700">Reference</h3><p className="text-xs text-slate-400">{references.length} referral partners on record</p></div>
// //           </div>
// //           <div className="smooth-scroll-x overflow-x-auto">
// //             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
// //                   <th className="px-5 py-3">Doctor Name & Domain</th><th className="px-5 py-3">Hospital</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-100">
// //                 {references.map((r) => (
// //                   <tr key={r.id} className="transition hover:bg-slate-50/60">
// //                     <td className="px-5 py-3.5"><p className="font-semibold text-slate-700">{r.doctorName || r.name}</p><p className="text-xs text-slate-400">{r.domain || r.type}</p></td>
// //                     <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{r.hospital || r.address}</span></td>
// //                     <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {r.phone}</p><p className="flex items-center gap-1 text-xs text-slate-400">{r.altPhone}</p></td>
// //                     <td className="px-5 py-3.5"><StatusBadge status={r.status || "Active"} /></td>
// //                     <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setRefModal(r)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "reference", item: r })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {tab === "deliveryExecutive" && (
// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
// //           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
// //             <div><h3 className="font-display text-sm font-bold text-slate-700">Delivery Agent</h3><p className="text-xs text-slate-400">{deliveryExecutives.length} agents on record</p></div>
// //           </div>
// //           <div className="smooth-scroll-x overflow-x-auto">
// //             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
// //                   <th className="px-5 py-3">Delivery Agent Name</th><th className="px-5 py-3">Hotline</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-100">
// //                 {deliveryExecutives.map((d) => (
// //                   <tr key={d.id} className="transition hover:bg-slate-50/60">
// //                     <td className="px-5 py-3.5 font-semibold text-slate-700">{d.driverName || d.name}</td>
// //                     <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {d.phone}</p></td>
// //                     <td className="px-5 py-3.5"><StatusBadge status={d.status || "Active"} /></td>
// //                     <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setDeModal(d)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "deliveryExecutive", item: d })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {ccModal !== null && <CareCenterFormModal initial={ccModal.id ? ccModal : null} onClose={() => setCcModal(null)} onSubmit={saveCareCenter} />}
// //       {eqModal !== null && <EquipmentFormModal initial={eqModal.id ? eqModal : null} onClose={() => setEqModal(null)} onSubmit={saveEquipment} />}
// //       {catModal !== null && <CategoryFormModal initial={catModal.id ? catModal : null} onClose={() => setCatModal(null)} onSubmit={saveCategory} />}
// //       {refModal !== null && <ReferenceFormModal initial={refModal.id ? refModal : null} onClose={() => setRefModal(null)} onSubmit={saveReference} />}
// //       {deModal !== null && <DeliveryExecutiveFormModal initial={deModal.id ? deModal : null} onClose={() => setDeModal(null)} onSubmit={saveDeliveryExecutive} />}

// //       <ConfirmDialog open={!!confirmDelete} title={`Delete this ${confirmDelete ? deleteLabels[confirmDelete.type] : ""}?`} message="Are you sure you want to delete this record? This action cannot be undone." onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} />
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { Package, Tag, Building2, Users, Truck, MapPin, Phone, Pencil, Trash2, Plus, X, Save, AlertCircle } from "lucide-react";
// import { PrimaryButton, GhostButton, IconAction, ConfirmDialog, Field, TextInput, Select, StatusBadge, toast } from "../components/UiComponents";
// import API from "../utils/api";

// function CareCenterFormModal({ initial, onClose, onSubmit }) {
//   const [form, setForm] = useState({ 
//     id: initial?.id || null,
//     name: initial?.name || "", 
//     address: initial?.address || "", 
//     phone: initial?.phone || "", 
//     contact_person: initial?.contact_person || initial?.contactPerson || initial?.altPhone || "", 
//     status: initial?.status || "Active" 
//   });
//   const [errors, setErrors] = useState({});
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const validate = () => {
//     const e = {};
//     if (!(form.name || "").trim()) e.name = "Care Center Name is required.";
//     if (!(form.address || "").trim()) e.address = "Address is required.";
//     if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
    
//     setErrors(e);
//     if (Object.keys(e).length > 0) {
//       toast.error("Validation Failed. Please fill required fields.");
//       return false;
//     }
//     return true;
//   };

//   return (
//     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
//       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//           <h2 className="font-display text-base font-bold text-slate-800">
//             {initial?.id ? "Edit Care Center Registry Form" : "Care Center Registry Form"}
//           </h2>
//           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//         <div className="space-y-4 px-6 py-5">
//           <Field label="Care Center Name" required error={errors.name}>
//             <TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} />
//           </Field>
//           <Field label="Address" required error={errors.address}>
//             <textarea 
//               rows={3} 
//               placeholder="Enter complete facility address..."
//               value={form.address} 
//               onChange={(e) => set({ address: e.target.value })} 
//               className={`w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none ${errors.address ? "border-rose-300 bg-rose-50/20" : "border-slate-200 focus:border-teal-500"}`} 
//             />
//           </Field>
//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Mobile Number" required error={errors.phone}>
//               <TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} />
//             </Field>
//             <Field label="Contact Person / Alt Contact" error={errors.contact_person}>
//               <TextInput 
//                 placeholder="e.g. Dr. Verma / Manager"
//                 value={form.contact_person} 
//                 onChange={(e) => set({ contact_person: e.target.value })} 
//               />
//             </Field>
//           </div>
//           <Field label="Status" required>
//             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </Select>
//           </Field>
//         </div>
//         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
//           <GhostButton onClick={onClose}>Cancel</GhostButton>
//           <PrimaryButton onClick={() => validate() && onSubmit(form)}>
//             <Save className="h-4 w-4" /> {initial?.id ? "Update Details" : "Save"}
//           </PrimaryButton>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CategoryFormModal({ initial, onClose, onSubmit }) {
//   const [form, setForm] = useState({ 
//     id: initial?.id || null,
//     name: initial?.name || "", 
//     status: initial?.status || "Active" 
//   });
//   const [errors, setErrors] = useState({});
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const validate = () => {
//     const e = {};
//     if (!(form.name || "").trim()) e.name = "Accessory Component Name is required.";
//     setErrors(e);
//     if (Object.keys(e).length > 0) {
//       toast.error("Validation Failed");
//       return false;
//     }
//     return true;
//   };

//   return (
//     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
//       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Accessory" : "Add New Accessory"}</h2>
//           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X className="h-4 w-4" /></button>
//         </div>
//         <div className="space-y-4 px-6 py-5">
//           <Field label="Accessory Component Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
//           <Field label="Status" required>
//             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </Select>
//           </Field>
//         </div>
//         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
//           <GhostButton onClick={onClose}>Cancel</GhostButton>
//           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ReferenceFormModal({ initial, onClose, onSubmit }) {
//   const [form, setForm] = useState({ 
//     id: initial?.id || null,
//     doctorName: initial?.doctorName || initial?.name || "", 
//     domain: initial?.domain || initial?.type || "", 
//     hospital: initial?.hospital || initial?.address || "", 
//     phone: initial?.phone || "", 
//     altPhone: initial?.altPhone || "", 
//     status: initial?.status || "Active" 
//   });
//   const [errors, setErrors] = useState({});
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const validate = () => {
//     const e = {};
//     if (!(form.doctorName || "").trim()) e.doctorName = "Doctor Name is required.";
//     if (!(form.domain || "").trim()) e.domain = "Specialist Domain is required.";
//     if (!(form.hospital || "").trim()) e.hospital = "Hospital Institute Name is required.";
//     if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
    
//     setErrors(e);
//     if (Object.keys(e).length > 0) {
//       toast.error("Validation Failed");
//       return false;
//     }
//     return true;
//   };

//   return (
//     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
//       <div className="fade-slide-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit External Reference" : "Link External Reference Record"}</h2>
//           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X className="h-4 w-4" /></button>
//         </div>
//         <div className="space-y-4 px-6 py-5">
//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Doctor Name" required error={errors.doctorName}><TextInput value={form.doctorName} error={errors.doctorName} onChange={(e) => set({ doctorName: e.target.value })} /></Field>
//             <Field label="Specialist Domain" required error={errors.domain}><TextInput value={form.domain} error={errors.domain} onChange={(e) => set({ domain: e.target.value })} /></Field>
//           </div>
//           <Field label="Hospital Institute Name" required error={errors.hospital}><TextInput value={form.hospital} error={errors.hospital} onChange={(e) => set({ hospital: e.target.value })} /></Field>
//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Mobile Number" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
//             <Field label="Alternative Number" error={errors.altPhone}><TextInput type="tel" value={form.altPhone} error={errors.altPhone} onChange={(e) => set({ altPhone: e.target.value })} /></Field>
//           </div>
//           <Field label="Status" required>
//             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </Select>
//           </Field>
//         </div>
//         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
//           <GhostButton onClick={onClose}>Cancel</GhostButton>
//           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
//         </div>
//       </div>
//     </div>
//   );
// }

// function DeliveryExecutiveFormModal({ initial, onClose, onSubmit }) {
//   const [form, setForm] = useState({ 
//     id: initial?.id || null,
//     driverName: initial?.driverName || initial?.name || "", 
//     phone: initial?.phone || "", 
//     status: initial?.status || "Active" 
//   });
//   const [errors, setErrors] = useState({});
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const validate = () => {
//     const e = {};
//     if (!(form.driverName || "").trim()) e.driverName = "Delivery Agent Name is required.";
//     if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
    
//     setErrors(e);
//     if (Object.keys(e).length > 0) {
//       toast.error("Validation Failed");
//       return false;
//     }
//     return true;
//   };

//   return (
//     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
//       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Delivery Agent" : "Add Delivery Agent"}</h2>
//           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X className="h-4 w-4" /></button>
//         </div>
//         <div className="space-y-4 px-6 py-5">
//           <Field label="Delivery Agent Name" required error={errors.driverName}><TextInput value={form.driverName} error={errors.driverName} onChange={(e) => set({ driverName: e.target.value })} /></Field>
//           <Field label="Active Mobile Hotline" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
//           <Field label="Status" required>
//             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </Select>
//           </Field>
//         </div>
//         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
//           <GhostButton onClick={onClose}>Cancel</GhostButton>
//           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
//         </div>
//       </div>
//     </div>
//   );
// }

// function EquipmentFormModal({ initial, onClose, onSubmit }) {
//   const [form, setForm] = useState({ 
//     id: initial?.id || null,
//     name: initial?.name || "", 
//     category: initial?.category || "Respiratory", 
//     dailyRate: initial?.dailyRate || "", 
//     stock: initial?.stock || "", 
//     status: initial?.status || "Active" 
//   });
//   const [errors, setErrors] = useState({});
//   const set = (patch) => setForm((f) => ({ ...f, ...patch }));

//   const validate = () => {
//     const e = {};
//     if (!(form.name || "").trim()) e.name = "Equipment name is required.";
//     if (!form.dailyRate || Number(form.dailyRate) <= 0) e.dailyRate = "Enter a valid daily rate.";
//     if (form.stock === "" || Number(form.stock) < 0) e.stock = "Enter a valid stock count.";
//     setErrors(e);
//     if (Object.keys(e).length > 0) {
//       toast.error("Validation Failed");
//       return false;
//     }
//     return true;
//   };

//   return (
//     <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
//       <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//           <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Equipment" : "Add Equipment"}</h2>
//           <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X className="h-4 w-4" /></button>
//         </div>
//         <div className="space-y-4 px-6 py-5">
//           <Field label="Equipment Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Daily Rate (₹)" required error={errors.dailyRate}><TextInput type="number" value={form.dailyRate} error={errors.dailyRate} onChange={(e) => set({ dailyRate: e.target.value })} /></Field>
//             <Field label="Stock" required error={errors.stock}><TextInput type="number" value={form.stock} error={errors.stock} onChange={(e) => set({ stock: e.target.value })} /></Field>
//           </div>
//           <Field label="Status" required>
//             <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </Select>
//           </Field>
//         </div>
//         <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
//           <GhostButton onClick={onClose}>Cancel</GhostButton>
//           <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function MasterInfo({ careCenters = [], setCareCenters, equipmentCatalog = [], setEquipmentCatalog, categories = [], setCategories, references = [], setReferences, deliveryExecutives = [], setDeliveryExecutives }) {
//   const [tab, setTab] = useState("careCenter");
//   const [ccModal, setCcModal] = useState(null);
//   const [eqModal, setEqModal] = useState(null);
//   const [catModal, setCatModal] = useState(null);
//   const [refModal, setRefModal] = useState(null);
//   const [deModal, setDeModal] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);

//   const saveCareCenter = async (data) => { 
//     try {
//       if (data.id) { 
//         await API.put(`/master/carecenters/${data.id}`, data);
//       } else { 
//         await API.post("/master/carecenters", data);
//       } 
//       const res = await API.get("/master/carecenters");
//       setCareCenters(res.data);
//       setCcModal(null); 
//       toast.success(data.id ? "Care Center details updated" : "Care Center registered");
//     } catch { toast.error("Unable to Save Record"); }
//   };

//   const saveEquipment = async (data) => { 
//     try {
//       if (data.id) { 
//         await API.put(`/master/equipment/${data.id}`, data);
//       } else { 
//         await API.post("/master/equipment", data);
//       } 
//       const res = await API.get("/master/equipment");
//       setEquipmentCatalog(res.data);
//       setEqModal(null); 
//       toast.success(data.id ? "Record Updated" : "Record Added");
//     } catch { toast.error("Unable to Save Record"); }
//   };

//   const saveCategory = async (data) => { 
//     try {
//       if (data.id) {
//         await API.put(`/master/categories/${data.id}`, data);
//       } else { 
//         await API.post("/master/categories", data);
//       } 
//       const res = await API.get("/master/categories");
//       setCategories(res.data);
//       setCatModal(null); 
//       toast.success(data.id ? "Record Updated" : "Record Added");
//     } catch { toast.error("Unable to Save Record"); }
//   };

//   const saveReference = async (data) => { 
//     try {
//       if (data.id) { 
//         await API.put(`/master/references/${data.id}`, data);
//       } else { 
//         await API.post("/master/references", data);
//       } 
//       const res = await API.get("/master/references");
//       setReferences(res.data);
//       setRefModal(null); 
//       toast.success(data.id ? "Record Updated" : "Record Added");
//     } catch { toast.error("Unable to Save Record"); }
//   };

//   const saveDeliveryExecutive = async (data) => { 
//     try {
//       if (data.id) { 
//         await API.put(`/master/delivery-executives/${data.id}`, data);
//       } else { 
//         await API.post("/master/delivery-executives", data);
//       } 
//       const res = await API.get("/master/delivery-executives");
//       setDeliveryExecutives(res.data);
//       setDeModal(null); 
//       toast.success(data.id ? "Record Updated" : "Record Added");
//     } catch { toast.error("Unable to Save Record"); }
//   };

//   const handleDelete = async () => {
//     try {
//       const id = confirmDelete.item.id;
//       const type = confirmDelete.type;
      
//       if (type === "center") {
//         await API.delete(`/master/carecenters/${id}`);
//         setCareCenters((prev) => prev.filter((c) => c.id !== id));
//       } 
//       else if (type === "equipment") {
//         await API.delete(`/master/equipment/${id}`);
//         setEquipmentCatalog((prev) => prev.filter((e) => e.id !== id));
//       } 
//       else if (type === "category") {
//         await API.delete(`/master/categories/${id}`);
//         setCategories((prev) => prev.filter((c) => c.id !== id));
//       } 
//       else if (type === "reference") {
//         await API.delete(`/master/references/${id}`);
//         setReferences((prev) => prev.filter((r) => r.id !== id));
//       } 
//       else if (type === "deliveryExecutive") {
//         await API.delete(`/master/delivery-executives/${id}`);
//         setDeliveryExecutives((prev) => prev.filter((d) => d.id !== id));
//       } 
      
//       setConfirmDelete(null);
//       toast.success("Record Deleted Successfully");
//     } catch (error) {
//       console.error("Delete Error:", error);
//       toast.error("Error: " + (error.response?.data?.message || "Could not delete from backend"));
//     }
//   };

//   const deleteLabels = { center: "care center", equipment: "device", category: "accessory", reference: "reference", deliveryExecutive: "delivery agent" };

//   const tabDataMap = {
//     careCenter: careCenters,
//     device: equipmentCatalog,
//     accessory: categories,
//     reference: references,
//     deliveryExecutive: deliveryExecutives,
//   };
//   const currentTabList = tabDataMap[tab] || [];
  
//   const activeCount = currentTabList.filter((item) => item.status === "Active" || !item.status).length;
//   const inactiveCount = currentTabList.length - activeCount;

//   const tabAddLabels = {
//     careCenter: "Register Care Center",
//     device: "Add Device",
//     accessory: "Add New Accessory",
//     reference: "Link Reference",
//     deliveryExecutive: "Add Delivery Agent",
//   };

//   const handleAddNewAsset = () => {
//     if (tab === "careCenter") setCcModal({});
//     else if (tab === "device") setEqModal({});
//     else if (tab === "accessory") setCatModal({});
//     else if (tab === "reference") setRefModal({});
//     else if (tab === "deliveryExecutive") setDeModal({});
//   };

//   return (
//     <div className="space-y-5">
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h2 className="font-display text-2xl font-bold text-slate-800">Global Inventory Ledger</h2>
//             <p className="mt-1 text-sm text-slate-400">Real-time modular tracking infrastructure.</p>
//           </div>
//           <div className="flex flex-wrap items-center gap-3">
//             <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
//               Active: <span className="text-teal-600">{activeCount}</span>
//             </span>
//             <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
//               Inactive: <span className="text-rose-500">{inactiveCount}</span>
//             </span>
//             <PrimaryButton onClick={handleAddNewAsset}>
//               <Plus className="h-4 w-4" /> {tabAddLabels[tab]}
//             </PrimaryButton>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm w-fit overflow-x-auto">
//         {[
//           { key: "careCenter", label: "Care Center", icon: Building2 },
//           { key: "device", label: "New Device", icon: Package },
//           { key: "accessory", label: "Accessories", icon: Tag },
//           { key: "reference", label: "Reference", icon: Users },
//           { key: "deliveryExecutive", label: "Delivery Agent", icon: Truck },
//         ].map((t) => (
//           <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer ${tab === t.key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
//             <t.icon className="h-4 w-4" /> {t.label}
//           </button>
//         ))}
//       </div>

//       {/* CARE CENTERS TAB */}
//       {tab === "careCenter" && (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <div><h3 className="font-display text-sm font-bold text-slate-700">Registered Care Centers</h3><p className="text-xs text-slate-400">{careCenters.length} centers on record</p></div>
//           </div>
//           <div className="smooth-scroll-x overflow-x-auto">
//             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
//                   <th className="px-5 py-3">Center Name & Address</th>
//                   <th className="px-5 py-3">Contact</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {careCenters.map((c) => {
//                   const hasAddress = (c.address || "").trim().length > 0;
//                   return (
//                     <tr key={c.id} className="transition hover:bg-slate-50/60">
//                       <td className="px-5 py-3.5">
//                         <p className="font-semibold text-slate-700">{c.name}</p>
//                         {hasAddress ? (
//                           <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
//                             <MapPin className="h-3 w-3 shrink-0" /> {c.address}
//                           </p>
//                         ) : (
//                           <p className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-0.5">
//                             <AlertCircle className="h-3 w-3 shrink-0" /> Address pending update (Click Edit)
//                           </p>
//                         )}
//                       </td>
//                       <td className="px-5 py-3.5">
//                         <p className="font-medium text-slate-600 flex items-center gap-1">
//                           <Phone className="h-3 w-3 text-slate-400" /> {c.phone}
//                         </p>
//                         <p className="text-xs text-slate-400">
//                           {c.contact_person || c.contactPerson || c.altPhone || "No contact person"}
//                         </p>
//                       </td>
//                       <td className="px-5 py-3.5"><StatusBadge status={c.status || "Active"} /></td>
//                       <td className="px-5 py-3.5">
//                         <div className="flex items-center justify-end gap-1">
//                           <IconAction title="Edit" tone="teal" onClick={() => setCcModal(c)}>
//                             <Pencil className="h-4 w-4" />
//                           </IconAction>
//                           <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "center", item: c })}>
//                             <Trash2 className="h-4 w-4" />
//                           </IconAction>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* DEVICES TAB */}
//       {tab === "device" && (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <div><h3 className="font-display text-sm font-bold text-slate-700">New Device</h3><p className="text-xs text-slate-400">{equipmentCatalog.length} devices available</p></div>
//           </div>
//           <div className="smooth-scroll-x overflow-x-auto">
//             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
//                   <th className="px-5 py-3">Equipment</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Daily Rate</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {equipmentCatalog.map((eq) => (
//                   <tr key={eq.id} className="transition hover:bg-slate-50/60">
//                     <td className="px-5 py-3.5 font-semibold text-slate-700">{eq.name}</td>
//                     <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{eq.category}</span></td>
//                     <td className="px-5 py-3.5 text-slate-600">₹{eq.dailyRate}/day</td>
//                     <td className="px-5 py-3.5"><span className={`text-sm font-semibold ${eq.stock < 8 ? "text-amber-600" : "text-slate-600"}`}>{eq.stock} units</span></td>
//                     <td className="px-5 py-3.5"><StatusBadge status={eq.status || "Active"} /></td>
//                     <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setEqModal(eq)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "equipment", item: eq })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ACCESSORIES TAB */}
//       {tab === "accessory" && (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <div><h3 className="font-display text-sm font-bold text-slate-700">Accessories</h3><p className="text-xs text-slate-400">{categories.length} accessories defined</p></div>
//           </div>
//           <div className="divide-y divide-slate-100">
//             {categories.map((cat) => (
//               <div key={cat.id} className="flex items-center justify-between gap-4 px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><Tag className="h-4 w-4" /></div>
//                   <div>
//                     <p className="font-semibold text-slate-700">{cat.name}</p>
//                     <p className="mt-0.5"><StatusBadge status={cat.status || "Active"} /></p>
//                   </div>
//                 </div>
//                 <div className="flex shrink-0 items-center gap-1">
//                   <IconAction title="Edit" tone="teal" onClick={() => setCatModal(cat)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "category", item: cat })}><Trash2 className="h-4 w-4" /></IconAction>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* REFERENCE TAB */}
//       {tab === "reference" && (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <div><h3 className="font-display text-sm font-bold text-slate-700">Reference</h3><p className="text-xs text-slate-400">{references.length} referral partners on record</p></div>
//           </div>
//           <div className="smooth-scroll-x overflow-x-auto">
//             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
//                   <th className="px-5 py-3">Doctor Name & Domain</th><th className="px-5 py-3">Hospital</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {references.map((r) => (
//                   <tr key={r.id} className="transition hover:bg-slate-50/60">
//                     <td className="px-5 py-3.5"><p className="font-semibold text-slate-700">{r.doctorName || r.name}</p><p className="text-xs text-slate-400">{r.domain || r.type}</p></td>
//                     <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{r.hospital || r.address}</span></td>
//                     <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {r.phone}</p><p className="flex items-center gap-1 text-xs text-slate-400">{r.altPhone}</p></td>
//                     <td className="px-5 py-3.5"><StatusBadge status={r.status || "Active"} /></td>
//                     <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setRefModal(r)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "reference", item: r })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* DELIVERY EXECUTIVES TAB */}
//       {tab === "deliveryExecutive" && (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//             <div><h3 className="font-display text-sm font-bold text-slate-700">Delivery Agent</h3><p className="text-xs text-slate-400">{deliveryExecutives.length} agents on record</p></div>
//           </div>
//           <div className="smooth-scroll-x overflow-x-auto">
//             <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
//                   <th className="px-5 py-3">Delivery Agent Name</th><th className="px-5 py-3">Hotline</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {deliveryExecutives.map((d) => (
//                   <tr key={d.id} className="transition hover:bg-slate-50/60">
//                     <td className="px-5 py-3.5 font-semibold text-slate-700">{d.driverName || d.name}</td>
//                     <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {d.phone}</p></td>
//                     <td className="px-5 py-3.5"><StatusBadge status={d.status || "Active"} /></td>
//                     <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setDeModal(d)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "deliveryExecutive", item: d })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* MODALS */}
//       {ccModal !== null && <CareCenterFormModal initial={ccModal.id ? ccModal : null} onClose={() => setCcModal(null)} onSubmit={saveCareCenter} />}
//       {eqModal !== null && <EquipmentFormModal initial={eqModal.id ? eqModal : null} onClose={() => setEqModal(null)} onSubmit={saveEquipment} />}
//       {catModal !== null && <CategoryFormModal initial={catModal.id ? catModal : null} onClose={() => setCatModal(null)} onSubmit={saveCategory} />}
//       {refModal !== null && <ReferenceFormModal initial={refModal.id ? refModal : null} onClose={() => setRefModal(null)} onSubmit={saveReference} />}
//       {deModal !== null && <DeliveryExecutiveFormModal initial={deModal.id ? deModal : null} onClose={() => setDeModal(null)} onSubmit={saveDeliveryExecutive} />}

//       <ConfirmDialog open={!!confirmDelete} title={`Delete this ${confirmDelete ? deleteLabels[confirmDelete.type] : ""}?`} message="Are you sure you want to delete this record? This action cannot be undone." onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} />
//     </div>
//   );
// }

import { useState } from "react";
import { 
  Package, 
  Tag, 
  Building2, 
  Users, 
  Truck, 
  MapPin, 
  Phone, 
  Pencil, 
  Trash2, 
  Plus, 
  X, 
  Save, 
  AlertCircle 
} from "lucide-react";
import { 
  PrimaryButton, 
  GhostButton, 
  IconAction, 
  ConfirmDialog, 
  Field, 
  TextInput, 
  Select, 
  StatusBadge, 
  toast 
} from "../components/UiComponents";
import API from "../utils/api";

// 🏥 1. CARE CENTER MODAL
function CareCenterFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    id: initial?.id || null,
    name: initial?.name || "", 
    address: initial?.address || "", 
    phone: initial?.phone || "", 
    contact_person: initial?.contact_person || initial?.contactPerson || initial?.altPhone || "", 
    status: initial?.status || "Active" 
  });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!(form.name || "").trim()) e.name = "Care Center Name is required.";
    if (!(form.address || "").trim()) e.address = "Address is required.";
    if (!/^\d{10}$/.test((form.phone || "").trim())) e.phone = "Enter a valid 10-digit mobile number.";
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fill all required fields correctly.");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="fade-slide-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-slate-800 truncate">
            {initial?.id ? "Edit Care Center Registry" : "Register Care Center"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6 overflow-y-auto flex-1">
          <Field label="Care Center Name" required error={errors.name}>
            <TextInput 
              value={form.name} 
              placeholder="e.g. City Hospital Care Center"
              error={errors.name} 
              onChange={(e) => set({ name: e.target.value })} 
            />
          </Field>

          <Field label="Address" required error={errors.address}>
            <textarea 
              rows={3} 
              placeholder="Enter complete facility address..."
              value={form.address} 
              onChange={(e) => set({ address: e.target.value })} 
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none resize-none transition focus:ring-4 focus:ring-teal-500/10 ${
                errors.address ? "border-rose-300 bg-rose-50/20" : "border-slate-200 focus:border-teal-500"
              }`} 
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mobile Number" required error={errors.phone}>
              <TextInput 
                type="tel" 
                maxLength={10}
                placeholder="10-digit number"
                value={form.phone} 
                error={errors.phone} 
                onChange={(e) => set({ phone: e.target.value })} 
              />
            </Field>
            <Field label="Contact Person / In-charge" error={errors.contact_person}>
              <TextInput 
                placeholder="e.g. Dr. Verma / Manager"
                value={form.contact_person} 
                onChange={(e) => set({ contact_person: e.target.value })} 
              />
            </Field>
          </div>

          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-6 bg-slate-50/50">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}>
            <Save className="h-4 w-4" /> {initial?.id ? "Update Details" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// 🏷️ 2. CATEGORY / ACCESSORY MODAL
function CategoryFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    id: initial?.id || null,
    name: initial?.name || "", 
    status: initial?.status || "Active" 
  });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!(form.name || "").trim()) e.name = "Accessory Component Name is required.";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please enter the accessory name.");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-slate-800">
            {initial?.id ? "Edit Accessory" : "Add New Accessory"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <Field label="Accessory Component Name" required error={errors.name}>
            <TextInput 
              placeholder="e.g. Oxygen Mask / Humidifier Tube"
              value={form.name} 
              error={errors.name} 
              onChange={(e) => set({ name: e.target.value })} 
            />
          </Field>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-6 bg-slate-50/50">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}>
            <Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// 👨‍⚕️ 3. REFERENCE MODAL
function ReferenceFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    id: initial?.id || null,
    doctorName: initial?.doctorName || initial?.name || "", 
    domain: initial?.domain || initial?.type || "", 
    hospital: initial?.hospital || initial?.address || "", 
    phone: initial?.phone || "", 
    altPhone: initial?.altPhone || "", 
    status: initial?.status || "Active" 
  });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!(form.doctorName || "").trim()) e.doctorName = "Doctor Name is required.";
    if (!(form.domain || "").trim()) e.domain = "Specialist Domain is required.";
    if (!(form.hospital || "").trim()) e.hospital = "Hospital Institute Name is required.";
    if (!/^\d{10}$/.test((form.phone || "").trim())) e.phone = "Enter a valid 10-digit mobile number.";
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fill all required reference fields.");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="fade-slide-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-slate-800">
            {initial?.id ? "Edit External Reference" : "Link External Reference Record"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Doctor Name" required error={errors.doctorName}>
              <TextInput 
                placeholder="e.g. Dr. Rajesh Sharma"
                value={form.doctorName} 
                error={errors.doctorName} 
                onChange={(e) => set({ doctorName: e.target.value })} 
              />
            </Field>
            <Field label="Specialist Domain" required error={errors.domain}>
              <TextInput 
                placeholder="e.g. Pulmonology / ICU"
                value={form.domain} 
                error={errors.domain} 
                onChange={(e) => set({ domain: e.target.value })} 
              />
            </Field>
          </div>

          <Field label="Hospital / Institute Name" required error={errors.hospital}>
            <TextInput 
              placeholder="e.g. Apollo Hospital"
              value={form.hospital} 
              error={errors.hospital} 
              onChange={(e) => set({ hospital: e.target.value })} 
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mobile Number" required error={errors.phone}>
              <TextInput 
                type="tel" 
                maxLength={10}
                placeholder="10-digit number"
                value={form.phone} 
                error={errors.phone} 
                onChange={(e) => set({ phone: e.target.value })} 
              />
            </Field>
            <Field label="Alternative Number" error={errors.altPhone}>
              <TextInput 
                type="tel" 
                maxLength={10}
                placeholder="Optional"
                value={form.altPhone} 
                error={errors.altPhone} 
                onChange={(e) => set({ altPhone: e.target.value })} 
              />
            </Field>
          </div>

          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-6 bg-slate-50/50">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}>
            <Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// 🚚 4. DELIVERY AGENT MODAL
function DeliveryExecutiveFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    id: initial?.id || null,
    driverName: initial?.driverName || initial?.name || "", 
    phone: initial?.phone || "", 
    status: initial?.status || "Active" 
  });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!(form.driverName || "").trim()) e.driverName = "Delivery Agent Name is required.";
    if (!/^\d{10}$/.test((form.phone || "").trim())) e.phone = "Enter a valid 10-digit mobile number.";
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fill all required agent fields.");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-slate-800">
            {initial?.id ? "Edit Delivery Agent" : "Add Delivery Agent"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <Field label="Delivery Agent Name" required error={errors.driverName}>
            <TextInput 
              placeholder="e.g. Ramesh Kumar"
              value={form.driverName} 
              error={errors.driverName} 
              onChange={(e) => set({ driverName: e.target.value })} 
            />
          </Field>
          <Field label="Active Mobile Hotline" required error={errors.phone}>
            <TextInput 
              type="tel" 
              maxLength={10}
              placeholder="10-digit mobile number"
              value={form.phone} 
              error={errors.phone} 
              onChange={(e) => set({ phone: e.target.value })} 
            />
          </Field>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-6 bg-slate-50/50">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}>
            <Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// 📦 5. EQUIPMENT MODAL
function EquipmentFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    id: initial?.id || null,
    name: initial?.name || "", 
    category: initial?.category || "Respiratory", 
    dailyRate: initial?.dailyRate || "", 
    stock: initial?.stock ?? "", 
    status: initial?.status || "Active" 
  });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!(form.name || "").trim()) e.name = "Equipment name is required.";
    if (!form.dailyRate || Number(form.dailyRate) <= 0) e.dailyRate = "Enter a valid daily rate.";
    if (form.stock === "" || Number(form.stock) < 0) e.stock = "Enter a valid stock count.";
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Please fill all equipment fields properly.");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-display text-base font-bold text-slate-800">
            {initial?.id ? "Edit Equipment" : "Add Equipment"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6 overflow-y-auto flex-1">
          <Field label="Equipment Name" required error={errors.name}>
            <TextInput 
              placeholder="e.g. Oxygen Concentrator 5L"
              value={form.name} 
              error={errors.name} 
              onChange={(e) => set({ name: e.target.value })} 
            />
          </Field>

          <Field label="Category" required>
            <Select value={form.category} onChange={(e) => set({ category: e.target.value })}>
              <option value="Respiratory">Respiratory</option>
              <option value="Critical Care">Critical Care</option>
              <option value="Mobility">Mobility</option>
              <option value="Monitoring">Monitoring</option>
              <option value="General">General</option>
            </Select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Daily Rate (₹)" required error={errors.dailyRate}>
              <TextInput 
                type="number" 
                placeholder="Rate/day"
                value={form.dailyRate} 
                error={errors.dailyRate} 
                onChange={(e) => set({ dailyRate: e.target.value })} 
              />
            </Field>
            <Field label="Stock Units" required error={errors.stock}>
              <TextInput 
                type="number" 
                placeholder="Quantity"
                value={form.stock} 
                error={errors.stock} 
                onChange={(e) => set({ stock: e.target.value })} 
              />
            </Field>
          </div>

          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-6 bg-slate-50/50">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}>
            <Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// 🏢 6. MAIN MASTER INFO PAGE COMPONENT
export default function MasterInfo({ 
  careCenters = [], 
  setCareCenters, 
  equipmentCatalog = [], 
  setEquipmentCatalog, 
  categories = [], 
  setCategories, 
  references = [], 
  setReferences, 
  deliveryExecutives = [], 
  setDeliveryExecutives 
}) {
  const [tab, setTab] = useState("careCenter");
  const [ccModal, setCcModal] = useState(null);
  const [eqModal, setEqModal] = useState(null);
  const [catModal, setCatModal] = useState(null);
  const [refModal, setRefModal] = useState(null);
  const [deModal, setDeModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const saveCareCenter = async (data) => { 
    try {
      if (data.id) { 
        await API.put(`/master/carecenters/${data.id}`, data);
      } else { 
        await API.post("/master/carecenters", data);
      } 
      const res = await API.get("/master/carecenters");
      setCareCenters && setCareCenters(res.data);
      setCcModal(null); 
      toast.success(data.id ? "Care Center details updated" : "Care Center registered");
    } catch { 
      toast.error("Unable to Save Care Center Record"); 
    }
  };

  const saveEquipment = async (data) => { 
    try {
      if (data.id) { 
        await API.put(`/master/equipment/${data.id}`, data);
      } else { 
        await API.post("/master/equipment", data);
      } 
      const res = await API.get("/master/equipment");
      setEquipmentCatalog && setEquipmentCatalog(res.data);
      setEqModal(null); 
      toast.success(data.id ? "Equipment Updated" : "Equipment Added");
    } catch { 
      toast.error("Unable to Save Equipment Record"); 
    }
  };

  const saveCategory = async (data) => { 
    try {
      if (data.id) { 
        await API.put(`/master/categories/${data.id}`, data);
      } else { 
        await API.post("/master/categories", data);
      }
      const res = await API.get("/master/categories");
      setCategories && setCategories(res.data);
      setCatModal(null);
      toast.success(data.id ? "Accessory Updated" : "Accessory Added");
    } catch { 
      toast.error("Unable to Save Accessory Record"); 
    }
  };

  const saveReference = async (data) => { 
    try {
      if (data.id) { 
        await API.put(`/master/references/${data.id}`, data);
      } else { 
        await API.post("/master/references", data);
      }
      const res = await API.get("/master/references");
      setReferences && setReferences(res.data);
      setRefModal(null);
      toast.success(data.id ? "Reference Updated" : "Reference Added");
    } catch { 
      toast.error("Unable to Save Reference Record"); 
    }
  };

  const saveDeliveryExecutive = async (data) => { 
    try {
      if (data.id) { 
        await API.put(`/master/delivery-executives/${data.id}`, data);
      } else { 
        await API.post("/master/delivery-executives", data);
      }
      const res = await API.get("/master/delivery-executives");
      setDeliveryExecutives && setDeliveryExecutives(res.data);
      setDeModal(null);
      toast.success(data.id ? "Delivery Agent Updated" : "Delivery Agent Added");
    } catch { 
      toast.error("Unable to Save Delivery Agent"); 
    }
  };

  // const handleDelete = async () => {
  //   try {
  //     const id = confirmDelete?.item?.id;
  //     const type = confirmDelete?.type;
      
  //     if (type === "center") {
  //       await API.delete(`/master/carecenters/${id}`);
  //       setCareCenters && setCareCenters((prev) => prev.filter((c) => c.id !== id));
  //     } else if (type === "equipment") {
  //       await API.delete(`/master/equipment/${id}`);
  //       setEquipmentCatalog && setEquipmentCatalog((prev) => prev.filter((e) => e.id !== id));
  //     } else if (type === "category") {
  //       await API.delete(`/master/categories/${id}`);
  //       setCategories && setCategories((prev) => prev.filter((c) => c.id !== id));
  //     } else if (type === "reference") {
  //       await API.delete(`/master/references/${id}`);
  //       setReferences && setReferences((prev) => prev.filter((r) => r.id !== id));
  //     } else if (type === "deliveryExecutive") {
  //       await API.delete(`/master/delivery-executives/${id}`);
  //       setDeliveryExecutives && setDeliveryExecutives((prev) => prev.filter((d) => d.id !== id));
  //     }
      
  //     setConfirmDelete(null);
  //     toast.success("Record Deleted Successfully");
  //   } catch (error) {
  //     console.error("Delete Error:", error);
  //     toast.error("Error: " + (error.response?.data?.message || "Could not delete from backend"));
  //   }
  // };
const handleDelete = async () => {
    const id = confirmDelete?.item?.id;
    const type = confirmDelete?.type;

    if (!id) {
      setConfirmDelete(null);
      return;
    }

    try {
      if (type === "center") {
        await API.delete(`/master/carecenters/${id}`);
        setCareCenters && setCareCenters((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "equipment") {
        await API.delete(`/master/equipment/${id}`);
        setEquipmentCatalog && setEquipmentCatalog((prev) => prev.filter((e) => e.id !== id));
      } else if (type === "category") {
        await API.delete(`/master/categories/${id}`);
        setCategories && setCategories((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "reference") {
        await API.delete(`/master/references/${id}`);
        setReferences && setReferences((prev) => prev.filter((r) => r.id !== id));
      } else if (type === "deliveryExecutive") {
        await API.delete(`/master/delivery-executives/${id}`);
        setDeliveryExecutives && setDeliveryExecutives((prev) => prev.filter((d) => d.id !== id));
      }

      setConfirmDelete(null);
      toast.success("Record Deleted Successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      const serverMsg = error.response?.data?.message;
      toast.error(serverMsg || "Could not delete. Related requisitions exist for this record.");
      setConfirmDelete(null);
    }
  };
  const deleteLabels = { 
    center: "care center", 
    equipment: "device", 
    category: "accessory", 
    reference: "reference", 
    deliveryExecutive: "delivery agent" 
  };

  const tabDataMap = {
    careCenter: careCenters,
    device: equipmentCatalog,
    accessory: categories,
    reference: references,
    deliveryExecutive: deliveryExecutives,
  };
  const currentTabList = tabDataMap[tab] || [];
  
  const activeCount = currentTabList.filter((item) => item.status === "Active" || !item.status).length;
  const inactiveCount = currentTabList.length - activeCount;

  const tabAddLabels = {
    careCenter: "Register Care Center",
    device: "Add Device",
    accessory: "Add New Accessory",
    reference: "Link Reference",
    deliveryExecutive: "Add Delivery Agent",
  };

  const handleAddNewAsset = () => {
    if (tab === "careCenter") setCcModal({});
    else if (tab === "device") setEqModal({});
    else if (tab === "accessory") setCatModal({});
    else if (tab === "reference") setRefModal({});
    else if (tab === "deliveryExecutive") setDeModal({});
  };

  return (
    <div className="space-y-4 sm:space-y-5 fade-slide-up">
      {/* Top Banner Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-800">Global Master Directory</h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-400">Real-time inventory and partner master ledger.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="rounded-xl border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600">
              Active: <span className="text-teal-600 font-bold">{activeCount}</span>
            </span>
            <span className="rounded-xl border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600">
              Inactive: <span className="text-rose-500 font-bold">{inactiveCount}</span>
            </span>
            <PrimaryButton onClick={handleAddNewAsset} className="w-full sm:w-auto">
              <Plus className="h-4 w-4" /> {tabAddLabels[tab]}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm max-w-full overflow-x-auto smooth-scroll-x">
        {[
          { key: "careCenter", label: "Care Center", icon: Building2 },
          { key: "device", label: "Devices", icon: Package },
          { key: "accessory", label: "Accessories", icon: Tag },
          { key: "reference", label: "Reference", icon: Users },
          { key: "deliveryExecutive", label: "Delivery Agent", icon: Truck },
        ].map((t) => (
          <button 
            key={t.key} 
            onClick={() => setTab(t.key)} 
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
              tab === t.key ? "bg-teal-600 text-white shadow-sm font-bold" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <t.icon className="h-4 w-4 shrink-0" /> {t.label}
          </button>
        ))}
      </div>

      {/* 🏥 CARE CENTERS TAB */}
      {tab === "careCenter" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Registered Care Centers</h3>
              <p className="text-xs text-slate-400">{careCenters.length} facilities on record</p>
            </div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 650 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Center Name & Address</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {careCenters.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">No care centers registered yet.</td>
                  </tr>
                ) : (
                  careCenters.map((c) => {
                    const hasAddress = (c.address || "").trim().length > 0;
                    return (
                      <tr key={c.id} className="transition hover:bg-slate-50/60">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-700">{c.name}</p>
                          {hasAddress ? (
                            <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" /> {c.address}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-0.5">
                              <AlertCircle className="h-3 w-3 shrink-0" /> Address pending (Click Edit)
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-600 flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" /> {c.phone}
                          </p>
                          <p className="text-xs text-slate-400">
                            {c.contact_person || c.contactPerson || c.altPhone || "No contact person"}
                          </p>
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={c.status || "Active"} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <IconAction title="Edit" tone="teal" onClick={() => setCcModal(c)}>
                              <Pencil className="h-4 w-4" />
                            </IconAction>
                            <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "center", item: c })}>
                              <Trash2 className="h-4 w-4" />
                            </IconAction>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📦 DEVICES TAB */}
      {tab === "device" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Medical Devices Catalog</h3>
              <p className="text-xs text-slate-400">{equipmentCatalog.length} devices available</p>
            </div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 650 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Equipment</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Daily Rate</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipmentCatalog.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">No equipment added yet.</td>
                  </tr>
                ) : (
                  equipmentCatalog.map((eq) => (
                    <tr key={eq.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{eq.name}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                          {eq.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">₹{eq.dailyRate || eq.daily_rate}/day</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-semibold ${Number(eq.stock) < 8 ? "text-amber-600" : "text-slate-600"}`}>
                          {eq.stock} units
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={eq.status || "Active"} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <IconAction title="Edit" tone="teal" onClick={() => setEqModal(eq)}>
                            <Pencil className="h-4 w-4" />
                          </IconAction>
                          <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "equipment", item: eq })}>
                            <Trash2 className="h-4 w-4" />
                          </IconAction>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🏷️ ACCESSORIES TAB */}
      {tab === "accessory" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Accessories</h3>
              <p className="text-xs text-slate-400">{categories.length} accessories defined</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">No accessories found.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4 transition hover:bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                      <Tag className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{cat.name}</p>
                      <p className="mt-0.5"><StatusBadge status={cat.status || "Active"} /></p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <IconAction title="Edit" tone="teal" onClick={() => setCatModal(cat)}>
                      <Pencil className="h-4 w-4" />
                    </IconAction>
                    <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "category", item: cat })}>
                      <Trash2 className="h-4 w-4" />
                    </IconAction>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 👨‍⚕️ REFERENCE TAB */}
      {tab === "reference" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Referral Partners</h3>
              <p className="text-xs text-slate-400">{references.length} partners on record</p>
            </div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 650 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Doctor Name & Domain</th>
                  <th className="px-5 py-3">Hospital</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {references.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">No references registered yet.</td>
                  </tr>
                ) : (
                  references.map((r) => (
                    <tr key={r.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-700">{r.doctorName || r.name}</p>
                        <p className="text-xs text-slate-400">{r.domain || r.type}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                          {r.hospital || r.address}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                          <Phone className="h-3 w-3 text-slate-400" /> {r.phone}
                        </p>
                        <p className="text-xs text-slate-400">{r.altPhone}</p>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status || "Active"} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <IconAction title="Edit" tone="teal" onClick={() => setRefModal(r)}>
                            <Pencil className="h-4 w-4" />
                          </IconAction>
                          <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "reference", item: r })}>
                            <Trash2 className="h-4 w-4" />
                          </IconAction>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🚚 DELIVERY AGENTS TAB */}
      {tab === "deliveryExecutive" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-700">Delivery Fleet</h3>
              <p className="text-xs text-slate-400">{deliveryExecutives.length} agents on record</p>
            </div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 650 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Delivery Agent Name</th>
                  <th className="px-5 py-3">Hotline</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveryExecutives.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">No delivery agents added yet.</td>
                  </tr>
                ) : (
                  deliveryExecutives.map((d) => (
                    <tr key={d.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{d.driverName || d.name}</td>
                      <td className="px-5 py-3.5">
                        <p className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                          <Phone className="h-3 w-3 text-slate-400" /> {d.phone}
                        </p>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={d.status || "Active"} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <IconAction title="Edit" tone="teal" onClick={() => setDeModal(d)}>
                            <Pencil className="h-4 w-4" />
                          </IconAction>
                          <IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "deliveryExecutive", item: d })}>
                            <Trash2 className="h-4 w-4" />
                          </IconAction>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🚀 ACTIVE MODALS */}
      {ccModal !== null && (
        <CareCenterFormModal 
          initial={ccModal?.id ? ccModal : null} 
          onClose={() => setCcModal(null)} 
          onSubmit={saveCareCenter} 
        />
      )}
      {eqModal !== null && (
        <EquipmentFormModal 
          initial={eqModal?.id ? eqModal : null} 
          onClose={() => setEqModal(null)} 
          onSubmit={saveEquipment} 
        />
      )}
      {catModal !== null && (
        <CategoryFormModal 
          initial={catModal?.id ? catModal : null} 
          onClose={() => setCatModal(null)} 
          onSubmit={saveCategory} 
        />
      )}
      {refModal !== null && (
        <ReferenceFormModal 
          initial={refModal?.id ? refModal : null} 
          onClose={() => setRefModal(null)} 
          onSubmit={saveReference} 
        />
      )}
      {deModal !== null && (
        <DeliveryExecutiveFormModal 
          initial={deModal?.id ? deModal : null} 
          onClose={() => setDeModal(null)} 
          onSubmit={saveDeliveryExecutive} 
        />
      )}

      {/* 🗑️ DELETE CONFIRM DIALOG */}
      <ConfirmDialog 
        open={!!confirmDelete} 
        title={`Delete this ${confirmDelete ? deleteLabels[confirmDelete.type] : ""}?`} 
        message="Are you sure you want to delete this record? This action cannot be undone." 
        onCancel={() => setConfirmDelete(null)} 
        onConfirm={handleDelete} 
      />
    </div>
  );
}