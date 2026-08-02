import { useState } from "react";
import { Package, Tag, Building2, Users, Truck, MapPin, Phone, Mail, Pencil, Trash2, Plus, X, Save } from "lucide-react";
import { PrimaryButton, GhostButton, IconAction, ConfirmDialog, Field, TextInput, Select } from "../components/UiComponents";
import { REFERRAL_OPTIONS } from "../data/mockData";
import API from "../utils/api";

function CareCenterFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || { name: "", address: "", contactPerson: "", phone: "", gst: "" });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required.";
    if (!form.address) e.address = "Address is required.";
    if (!form.contactPerson) e.contactPerson = "Contact person is required.";
    if (!form.phone) e.phone = "Phone number is required.";
    if (!form.gst) e.gst = "GST / ID number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial ? "Edit Care Center" : "Add Care Center"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Care Center Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Sunrise Home Care" /></Field>
          <Field label="Address" required error={errors.address}><TextInput value={form.address} error={errors.address} onChange={(e) => set({ address: e.target.value })} placeholder="Full address" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Person" required error={errors.contactPerson}><TextInput value={form.contactPerson} error={errors.contactPerson} onChange={(e) => set({ contactPerson: e.target.value })} /></Field>
            <Field label="Phone" required error={errors.phone}><TextInput value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          </div>
          <Field label="GST / ID Number" required error={errors.gst}><TextInput value={form.gst} error={errors.gst} onChange={(e) => set({ gst: e.target.value })} /></Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> Save</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function EquipmentFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || { name: "", category: "Respiratory", dailyRate: "", stock: "" });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Equipment name is required.";
    if (!form.dailyRate || Number(form.dailyRate) <= 0) e.dailyRate = "Enter a valid daily rate.";
    if (form.stock === "" || Number(form.stock) < 0) e.stock = "Enter a valid stock count.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial ? "Edit Equipment" : "Add Equipment"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Equipment Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Oxygen Concentrator (5L)" /></Field>
          <Field label="Category" required><Select value={form.category} onChange={(e) => set({ category: e.target.value })}><option>Respiratory</option><option>Mobility & Bedding</option><option>Monitoring</option></Select></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Daily Rate (₹)" required error={errors.dailyRate}><TextInput type="number" value={form.dailyRate} error={errors.dailyRate} onChange={(e) => set({ dailyRate: e.target.value })} /></Field>
            <Field label="Stock" required error={errors.stock}><TextInput type="number" value={form.stock} error={errors.stock} onChange={(e) => set({ stock: e.target.value })} /></Field>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> Save</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function CategoryFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || { name: "", description: "" });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Category name is required.";
    if (!form.description) e.description = "A short description helps staff pick the right category.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Category Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Respiratory" /></Field>
          <Field label="Description" required error={errors.description}><textarea rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} placeholder="What kind of equipment belongs here?" className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-400 resize-none ${errors.description ? "border-rose-300" : "border-slate-200 focus:border-teal-500"}`} /></Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> Save</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function ReferenceFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || { name: "", type: "Doctor Referral", phone: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required.";
    if (!form.phone) e.phone = "Phone number is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.address) e.address = "Address is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial ? "Edit Reference" : "Add Reference"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Dr. Anil Kumar Mishra" /></Field>
          <Field label="Referral Type" required><Select value={form.type} onChange={(e) => set({ type: e.target.value })}>{REFERRAL_OPTIONS.filter((r) => r !== "Self" && r !== "Walk-in" && r !== "Online Inquiry").map((r) => <option key={r} value={r}>{r}</option>)}</Select></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" required error={errors.phone}><TextInput value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
            <Field label="Email" required error={errors.email}><TextInput type="email" value={form.email} error={errors.email} onChange={(e) => set({ email: e.target.value })} placeholder="name@company.com" /></Field>
          </div>
          <Field label="Address" required error={errors.address}><TextInput value={form.address} error={errors.address} onChange={(e) => set({ address: e.target.value })} /></Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> Save</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function DeliveryExecutiveFormModal({ initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || { name: "", phone: "", vehicleNumber: "", zone: "", email: "" });
  const [errors, setErrors] = useState({});
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required.";
    if (!form.phone) e.phone = "Phone number is required.";
    if (!form.vehicleNumber) e.vehicleNumber = "Vehicle number is required.";
    if (!form.zone) e.zone = "Delivery zone is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="fade-slide-up w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-800">{initial ? "Edit Delivery Executive" : "Add Delivery Executive"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <Field label="Name" required error={errors.name}><TextInput value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Suresh Patnaik" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" required error={errors.phone}><TextInput value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
            <Field label="Vehicle Number" required error={errors.vehicleNumber}><TextInput value={form.vehicleNumber} error={errors.vehicleNumber} onChange={(e) => set({ vehicleNumber: e.target.value })} placeholder="e.g. OD-02-AB-4521" /></Field>
          </div>
          <Field label="Delivery Zone" required error={errors.zone}><TextInput value={form.zone} error={errors.zone} onChange={(e) => set({ zone: e.target.value })} placeholder="e.g. Bhubaneswar Central" /></Field>
          <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="name@chikitsa.in" /></Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => validate() && onSubmit(form)}><Save className="h-4 w-4" /> Save</PrimaryButton>
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
      } else { 
        const newId = `CC${String(careCenters.length + 1).padStart(3, "0")}`; 
        await API.post("/master/carecenters", {
          id: newId, name: data.name, address: data.address,
          contact_person: data.contactPerson, phone: data.phone, gst: data.gst
        });
        setCareCenters((prev) => [...prev, { ...data, id: newId }]); 
      } 
      setCcModal(null); 
    } catch (err) { alert("❌ Error: " + err.message); }
  };

  const saveEquipment = async (data) => { 
    try {
      if (data.id) { 
        setEquipmentCatalog((prev) => prev.map((e) => (e.id === data.id ? data : e))); 
      } else { 
        const newId = `EQ${String(equipmentCatalog.length + 1).padStart(2, "0")}`; 
        await API.post("/master/equipment", {
          id: newId, name: data.name, category: data.category,
          daily_rate: data.dailyRate, stock: data.stock
        });
        setEquipmentCatalog((prev) => [...prev, { ...data, id: newId }]); 
      } 
      setEqModal(null); 
    } catch (err) { alert("❌ Error: " + err.message); }
  };

  const saveCategory = (data) => { if (data.id) { setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c))); } else { setCategories((prev) => [...prev, { ...data, id: `CAT${String(prev.length + 1).padStart(2, "0")}` }]); } setCatModal(null); };
  const saveReference = (data) => { if (data.id) { setReferences((prev) => prev.map((r) => (r.id === data.id ? data : r))); } else { setReferences((prev) => [...prev, { ...data, id: `REF${String(prev.length + 1).padStart(2, "0")}` }]); } setRefModal(null); };
  const saveDeliveryExecutive = (data) => { if (data.id) { setDeliveryExecutives((prev) => prev.map((d) => (d.id === data.id ? data : d))); } else { setDeliveryExecutives((prev) => [...prev, { ...data, id: `DE${String(prev.length + 1).padStart(2, "0")}` }]); } setDeModal(null); };

  const handleDelete = () => {
    if (confirmDelete.type === "center") setCareCenters((prev) => prev.filter((c) => c.id !== confirmDelete.item.id));
    else if (confirmDelete.type === "equipment") setEquipmentCatalog((prev) => prev.filter((e) => e.id !== confirmDelete.item.id));
    else if (confirmDelete.type === "category") setCategories((prev) => prev.filter((c) => c.id !== confirmDelete.item.id));
    else if (confirmDelete.type === "reference") setReferences((prev) => prev.filter((r) => r.id !== confirmDelete.item.id));
    else if (confirmDelete.type === "deliveryExecutive") setDeliveryExecutives((prev) => prev.filter((d) => d.id !== confirmDelete.item.id));
    setConfirmDelete(null);
  };

  const deleteLabels = { center: "care center", equipment: "device", category: "accessory", reference: "reference", deliveryExecutive: "delivery executive" };

  const tabDataMap = {
    device: equipmentCatalog,
    accessory: categories,
    careCenter: careCenters,
    reference: references,
    deliveryExecutive: deliveryExecutives,
  };
  const currentTabList = tabDataMap[tab] || [];
  const activeCount = tab === "device" ? currentTabList.filter((e) => Number(e.stock) > 0).length : currentTabList.length;
  const inactiveCount = tab === "device" ? currentTabList.filter((e) => Number(e.stock) <= 0).length : 0;

  const tabAddLabels = {
    device: "Add New Asset",
    accessory: "Add New Asset",
    careCenter: "Add New Asset",
    reference: "Add New Asset",
    deliveryExecutive: "Add New Asset",
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
          { key: "accessory", label: "New Accessories", icon: Tag },
          { key: "careCenter", label: "Care Center", icon: Building2 },
          { key: "reference", label: "Reference", icon: Users },
          { key: "deliveryExecutive", label: "Delivery Executive", icon: Truck },
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
                  <th className="px-5 py-3">Center</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">GST / ID</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {careCenters.map((c) => (
                  <tr key={c.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5"><p className="font-semibold text-slate-700">{c.name}</p><p className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" /> {c.address}</p></td>
                    <td className="px-5 py-3.5"><p className="font-medium text-slate-600">{c.contactPerson}</p><p className="flex items-center gap-1 text-xs text-slate-400"><Phone className="h-3 w-3" /> {c.phone}</p></td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{c.gst}</td>
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
                  <th className="px-5 py-3">Equipment</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Daily Rate</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipmentCatalog.map((eq) => (
                  <tr key={eq.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{eq.name}</td>
                    <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{eq.category}</span></td>
                    <td className="px-5 py-3.5 text-slate-600">₹{eq.dailyRate}/day</td>
                    <td className="px-5 py-3.5"><span className={`text-sm font-semibold ${eq.stock < 8 ? "text-amber-600" : "text-slate-600"}`}>{eq.stock} units</span></td>
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
            <div><h3 className="font-display text-sm font-bold text-slate-700">New Accessories</h3><p className="text-xs text-slate-400">{categories.length} accessories defined</p></div>
          </div>
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><Tag className="h-4 w-4" /></div>
                  <div><p className="font-semibold text-slate-700">{cat.name}</p><p className="text-xs text-slate-400">{cat.description}</p></div>
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
                  <th className="px-5 py-3">Name</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {references.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5"><p className="font-semibold text-slate-700">{r.name}</p><p className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" /> {r.address}</p></td>
                    <td className="px-5 py-3.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{r.type}</span></td>
                    <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {r.phone}</p><p className="flex items-center gap-1 text-xs text-slate-400"><Mail className="h-3 w-3" /> {r.email}</p></td>
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
            <div><h3 className="font-display text-sm font-bold text-slate-700">Delivery Executive</h3><p className="text-xs text-slate-400">{deliveryExecutives.length} delivery executives on record</p></div>
          </div>
          <div className="smooth-scroll-x overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 700 }}>
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Name</th><th className="px-5 py-3">Vehicle</th><th className="px-5 py-3">Zone</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveryExecutives.map((d) => (
                  <tr key={d.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{d.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{d.vehicleNumber}</td>
                    <td className="px-5 py-3.5"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{d.zone}</span></td>
                    <td className="px-5 py-3.5"><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {d.phone}</p>{d.email && <p className="flex items-center gap-1 text-xs text-slate-400"><Mail className="h-3 w-3" /> {d.email}</p>}</td>
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

      <ConfirmDialog open={!!confirmDelete} title={`Delete this ${confirmDelete ? deleteLabels[confirmDelete.type] : ""}?`} message={confirmDelete ? `"${confirmDelete.item.name}" will be permanently removed from Master Info.` : ""} onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} />
    </div>
  );
}
