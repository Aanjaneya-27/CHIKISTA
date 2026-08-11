import { useState } from "react";
import { Package, Tag, Building2, Users, Truck, MapPin, Phone, Pencil, Trash2, Plus, X, Save } from "lucide-react";
import { PrimaryButton, GhostButton, IconAction, ConfirmDialog, Field, TextInput, Select, StatusBadge, toast } from "../components/UiComponents";
import API from "../utils/api";


function CareCenterFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    id: initial?.id || null,
    name: initial?.name || "", 
    address: initial?.address || "", 
    phone: initial?.phone || "", 
    altPhone: initial?.altPhone || initial?.contactPerson || "", 
    status: initial?.status || "Active" 
  });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!(form.name || "").trim()) e.name = "Care Center Name is required.";
    if (!(form.address || "").trim()) e.address = "Address is required.";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
    if (form.altPhone && !/^\d{10}$/.test(form.altPhone)) e.altPhone = "Invalid 10-digit mobile number.";
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Validation Failed");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">
            {initial?.id ? "Edit Care Center Registry Form" : "Care Center Registry Form"}
          </h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Care Center Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
          <Field label="Address" required error={errors.address}><textarea rows={3} value={form.address} onChange={(e) => set({ address: e.target.value })} className={`w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none ${errors.address ? "border-rose-300" : "border-slate-200 focus:border-teal-500"}`} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Mobile Number" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
            <Field label="Alternative Mobile Number" error={errors.altPhone}><TextInput type="tel" value={form.altPhone} error={errors.altPhone} onChange={(e) => set({ altPhone: e.target.value })} /></Field>
          </div>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}


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
      toast.error("Validation Failed");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Accessory" : "Add New Accessory"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Accessory Component Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

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
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
    if (form.altPhone && !/^\d{10}$/.test(form.altPhone)) e.altPhone = "Invalid 10-digit mobile number.";
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Validation Failed");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit External Reference" : "Link External Reference Record"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Doctor Name" required error={errors.doctorName}><TextInput value={form.doctorName} error={errors.doctorName} onChange={(e) => set({ doctorName: e.target.value })} /></Field>
            <Field label="Specialist Domain" required error={errors.domain}><TextInput value={form.domain} error={errors.domain} onChange={(e) => set({ domain: e.target.value })} /></Field>
          </div>
          <Field label="Hospital Institute Name" required error={errors.hospital}><TextInput value={form.hospital} error={errors.hospital} onChange={(e) => set({ hospital: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Mobile Number" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
            <Field label="Alternative Number" error={errors.altPhone}><TextInput type="tel" value={form.altPhone} error={errors.altPhone} onChange={(e) => set({ altPhone: e.target.value })} /></Field>
          </div>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}


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
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Invalid 10-digit mobile number.";
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Validation Failed");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Delivery Agent" : "Add Delivery Agent"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          {/* 🔥 UPDATE: Delivery Agent Name label added */}
          <Field label="Delivery Agent Name" required error={errors.driverName}><TextInput value={form.driverName} error={errors.driverName} onChange={(e) => set({ driverName: e.target.value })} /></Field>
          <Field label="Active Mobile Hotline" required error={errors.phone}><TextInput type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}


function EquipmentFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState({ 
    id: initial?.id || null,
    name: initial?.name || "", 
    category: initial?.category || "Respiratory", 
    dailyRate: initial?.dailyRate || "", 
    stock: initial?.stock || "", 
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
      toast.error("Validation Failed");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial?.id ? "Edit Equipment" : "Add Equipment"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Equipment Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} /></Field>
          {/* 🔥 UPDATE: Category Field removed completely */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Daily Rate (₹)" required error={errors.dailyRate}><TextInput type="number" value={form.dailyRate} error={errors.dailyRate} onChange={(e) => set({ dailyRate: e.target.value })} /></Field>
            <Field label="Stock" required error={errors.stock}><TextInput type="number" value={form.stock} error={errors.stock} onChange={(e) => set({ stock: e.target.value })} /></Field>
          </div>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> {initial?.id ? "Update" : "Save"}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default function MasterInfo({ careCenters, setCareCenters, equipmentCatalog, setEquipmentCatalog, categories, setCategories, references, setReferences, deliveryExecutives, setDeliveryExecutives }) {
  const [tab, setTab] = useState("device");
  const [ccModal, setCcModal] = useState(null);
  const [eqModal, setEqModal] = useState(null);
  const [catModal, setCatModal] = useState(null);
  const [refModal, setRefModal] = useState(null);
  const [deModal, setDeModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const saveCareCenter = async (data) => { 
    try {
      if (data.id) { 
        setCareCenters((prev) => prev.map((c) => (c.id === data.id ? data : c))); 
        toast.success("Record Updated Successfully");
      } else { 
        const newId = `CC${String(careCenters.length + 1).padStart(3, "0")}`; 
        await API.post("/master/carecenters", {
          id: newId, name: data.name, address: data.address,
          contact_person: data.altPhone || "N/A", phone: data.phone, gst: "N/A", status: data.status
        });
        setCareCenters((prev) => [...prev, { ...data, id: newId }]); 
        toast.success("Record Added Successfully");
      } 
      setCcModal(null); 
    } catch { toast.error("Unable to Save Record"); }
  };

  const saveEquipment = async (data) => { 
    try {
      if (data.id) { 
        setEquipmentCatalog((prev) => prev.map((e) => (e.id === data.id ? data : e))); 
        toast.success("Record Updated Successfully");
      } else { 
        const newId = `EQ${String(equipmentCatalog.length + 1).padStart(2, "0")}`; 
        await API.post("/master/equipment", {
          id: newId, name: data.name, category: data.category,
          daily_rate: data.dailyRate, stock: data.stock, status: data.status
        });
        setEquipmentCatalog((prev) => [...prev, { ...data, id: newId }]); 
        toast.success("Record Added Successfully");
      } 
      setEqModal(null); 
    } catch { toast.error("Unable to Save Record"); }
  };

  const saveCategory = (data) => { 
    if (data.id) { 
      setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c))); 
      toast.success("Record Updated Successfully");
    } else { 
      setCategories((prev) => [...prev, { ...data, id: `CAT${String(prev.length + 1).padStart(2, "0")}` }]); 
      toast.success("Record Added Successfully");
    } 
    setCatModal(null); 
  };

  const saveReference = (data) => { 
    if (data.id) { 
      setReferences((prev) => prev.map((r) => (r.id === data.id ? data : r))); 
      toast.success("Record Updated Successfully");
    } else { 
      setReferences((prev) => [...prev, { ...data, id: `REF${String(prev.length + 1).padStart(2, "0")}` }]); 
      toast.success("Record Added Successfully");
    } 
    setRefModal(null); 
  };

  const saveDeliveryExecutive = (data) => { 
    if (data.id) { 
      setDeliveryExecutives((prev) => prev.map((d) => (d.id === data.id ? data : d))); 
      toast.success("Record Updated Successfully");
    } else { 
      setDeliveryExecutives((prev) => [...prev, { ...data, id: `DE${String(prev.length + 1).padStart(2, "0")}` }]); 
      toast.success("Record Added Successfully");
    } 
    setDeModal(null); 
  };

  // const handleDelete = () => {
  //   if (confirmDelete.type === "center") setCareCenters((prev) => prev.filter((c) => c.id !== confirmDelete.item.id));
  //   else if (confirmDelete.type === "equipment") setEquipmentCatalog((prev) => prev.filter((e) => e.id !== confirmDelete.item.id));
  //   else if (confirmDelete.type === "category") setCategories((prev) => prev.filter((c) => c.id !== confirmDelete.item.id));
  //   else if (confirmDelete.type === "reference") setReferences((prev) => prev.filter((r) => r.id !== confirmDelete.item.id));
  //   else if (confirmDelete.type === "deliveryExecutive") setDeliveryExecutives((prev) => prev.filter((d) => d.id !== confirmDelete.item.id));
    
  //   setConfirmDelete(null);
  //   toast.success("Record Deleted Successfully");
  // };

  const handleDelete = async () => {
    try {
      const id = confirmDelete.item.id;
      const type = confirmDelete.type;
      if (type === "center") {
        await API.delete(`/master/carecenters/${id}`);
        setCareCenters((prev) => prev.filter((c) => c.id !== id));
      } 
      else if (type === "equipment") {
        await API.delete(`/master/equipment/${id}`);
        setEquipmentCatalog((prev) => prev.filter((e) => e.id !== id));
      } 
      else if (type === "category") {
        await API.delete(`/master/categories/${id}`);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }    
      
      setConfirmDelete(null);
      toast.success("Record Deleted From Database Successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Error: " + (error.response?.data?.message || "Could not delete from backend"));
    }
  };

  const deleteLabels = { center: "care center", equipment: "device", category: "accessory", reference: "reference", deliveryExecutive: "delivery agent" };

  const tabDataMap = {
    device: equipmentCatalog,
    accessory: categories,
    careCenter: careCenters,
    reference: references,
    deliveryExecutive: deliveryExecutives,
  };
  const currentTabList = tabDataMap[tab] || [];
  
  const activeCount = currentTabList.filter((item) => item.status === "Active" || !item.status).length;
  const inactiveCount = currentTabList.length - activeCount;

  const tabAddLabels = {
    device: "Add Device",
    accessory: "Add New Accessory",
    careCenter: "Care Center Form",
    reference: "Link Reference",
    deliveryExecutive: "Add Delivery Agent", // 🔥 Updated label
  };

  const handleAddNewAsset = () => {
    if (tab === "device") setEqModal({});
    else if (tab === "accessory") setCatModal({});
    else if (tab === "careCenter") setCcModal({});
    else if (tab === "reference") setRefModal({});
    else if (tab === "deliveryExecutive") setDeModal({});
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-800">Global Inventory Ledger</h2>
            <p className="mt-1 text-sm text-slate-400">Real-time modular tracking infrastructure.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
              Active: <span className="text-teal-600">{activeCount}</span>
            </span>
            <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
              Inactive: <span className="text-rose-500">{inactiveCount}</span>
            </span>
            <PrimaryButton onClick={handleAddNewAsset}>
              <Plus className="h-4 w-4" /> {tabAddLabels[tab]}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm w-fit overflow-x-auto">
        {[
          { key: "device", label: "New Device", icon: Package },
          { key: "accessory", label: "Accessories", icon: Tag },
          { key: "careCenter", label: "Care Center", icon: Building2 },
          { key: "reference", label: "Reference", icon: Users },
          { key: "deliveryExecutive", label: "Delivery Agent", icon: Truck }, // 🔥 Updated tab label
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === t.key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "careCenter" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h3 className="font-display text-sm font-bold text-slate-700">Registered Care Centers</h3><p className="text-xs text-slate-400">{careCenters.length} centers on record</p></div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Center Name</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {careCenters.map((c) => (
                  <tr key={c.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5"><p className="font-semibold text-slate-700">{c.name}</p><p className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" /> {c.address}</p></td>
                    <td className="px-5 py-3.5"><p className="font-medium text-slate-600">{c.phone}</p><p className="text-xs text-slate-400">{c.altPhone || c.contactPerson}</p></td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status || "Active"} /></td>
                    <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setCcModal(c)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "center", item: c })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "device" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h3 className="font-display text-sm font-bold text-slate-700">New Device</h3><p className="text-xs text-slate-400">{equipmentCatalog.length} devices available</p></div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Equipment</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Daily Rate</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipmentCatalog.map((eq) => (
                  <tr key={eq.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{eq.name}</td>
                    <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{eq.category}</span></td>
                    <td className="px-5 py-3.5 text-slate-600">₹{eq.dailyRate}/day</td>
                    <td className="px-5 py-3.5"><span className={`text-sm font-semibold ${eq.stock < 8 ? "text-amber-600" : "text-slate-600"}`}>{eq.stock} units</span></td>
                    <td className="px-5 py-3.5"><StatusBadge status={eq.status || "Active"} /></td>
                    <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setEqModal(eq)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "equipment", item: eq })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "accessory" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h3 className="font-display text-sm font-bold text-slate-700">Accessories</h3><p className="text-xs text-slate-400">{categories.length} accessories defined</p></div>
          </div>
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><Tag className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-slate-700">{cat.name}</p>
                    <p className="mt-0.5"><StatusBadge status={cat.status || "Active"} /></p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <IconAction title="Edit" tone="teal" onClick={() => setCatModal(cat)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "category", item: cat })}><Trash2 className="h-4 w-4" /></IconAction>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "reference" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h3 className="font-display text-sm font-bold text-slate-700">Reference</h3><p className="text-xs text-slate-400">{references.length} referral partners on record</p></div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Doctor Name & Domain</th><th className="px-5 py-3">Hospital</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {references.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5"><p className="font-semibold text-slate-700">{r.doctorName || r.name}</p><p className="text-xs text-slate-400">{r.domain || r.type}</p></td>
                    <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{r.hospital || r.address}</span></td>
                    <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {r.phone}</p><p className="flex items-center gap-1 text-xs text-slate-400">{r.altPhone}</p></td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status || "Active"} /></td>
                    <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setRefModal(r)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "reference", item: r })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "deliveryExecutive" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            {/* 🔥 Updated record text */}
            <div><h3 className="font-display text-sm font-bold text-slate-700">Delivery Agent</h3><p className="text-xs text-slate-400">{deliveryExecutives.length} agents on record</p></div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {/* 🔥 Updated Table Header */}
                  <th className="px-5 py-3">Delivery Agent Name</th><th className="px-5 py-3">Hotline</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveryExecutives.map((d) => (
                  <tr key={d.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{d.driverName || d.name}</td>
                    <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {d.phone}</p></td>
                    <td className="px-5 py-3.5"><StatusBadge status={d.status || "Active"} /></td>
                    <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><IconAction title="Edit" tone="teal" onClick={() => setDeModal(d)}><Pencil className="h-4 w-4" /></IconAction><IconAction title="Delete" tone="rose" onClick={() => setConfirmDelete({ type: "deliveryExecutive", item: d })}><Trash2 className="h-4 w-4" /></IconAction></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ccModal !== null && <CareCenterFormModal initial={ccModal.id ? ccModal : null} onClose={() => setCcModal(null)} onSubmit={saveCareCenter} />}
      {eqModal !== null && <EquipmentFormModal initial={eqModal.id ? eqModal : null} onClose={() => setEqModal(null)} onSubmit={saveEquipment} />}
      {catModal !== null && <CategoryFormModal initial={catModal.id ? catModal : null} onClose={() => setCatModal(null)} onSubmit={saveCategory} />}
      {refModal !== null && <ReferenceFormModal initial={refModal.id ? refModal : null} onClose={() => setRefModal(null)} onSubmit={saveReference} />}
      {deModal !== null && <DeliveryExecutiveFormModal initial={deModal.id ? deModal : null} onClose={() => setDeModal(null)} onSubmit={saveDeliveryExecutive} />}

      <ConfirmDialog open={!!confirmDelete} title={`Delete this ${confirmDelete ? deleteLabels[confirmDelete.type] : ""}?`} message="Are you sure you want to delete this record? This action cannot be undone." onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} />
    </div>
  );
}