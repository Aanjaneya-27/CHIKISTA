// import { useState, useMemo } from "react";
// import { User, Settings, Lock, Bell, Camera, Shield, Save, Key, } from "lucide-react";
// import { PrimaryButton, Field, TextInput, toast } from "../components/UiComponents";
// import API from "../utils/api";

// export default function UserProfile() {
//   const [activeTab, setActiveTab] = useState("profile");

//   const loggedUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);

//   const isCareCenter = loggedUser?.role === "care_center";
//   const isSuperAdmin = loggedUser?.role === "super_admin" || loggedUser?.role === "admin";

//   const [profile, setProfile] = useState(() => {
//     const defaultName = loggedUser?.name || loggedUser?.careCenterName || (isSuperAdmin ? "Admin" : "User");
//     const defaultPhone = loggedUser?.phone || "";
//     const defaultEmail = loggedUser?.email || (defaultPhone ? `${defaultPhone}@chikitsa.in` : "admin@chikitsa.com");
//     const defaultRole = isCareCenter ? "Care Center" : isSuperAdmin ? "Super Admin" : (loggedUser?.role || "User");
//     const defaultDept = isCareCenter ? "Care Center Partner" : "Management";

//     return {
//       name: defaultName,
//       email: defaultEmail,
//       phone: defaultPhone,
//       role: defaultRole,
//       department: defaultDept,
//       address: loggedUser?.address || "",
//       contactPerson: loggedUser?.contact_person || loggedUser?.contactPerson || ""
//     };
//   });

//   const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
//   const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });
//   const [saving, setSaving] = useState(false);

//   const avatarInitial = (profile.name || "U").trim().charAt(0).toUpperCase();

//   const handleProfileSave = async () => {
//     setSaving(true);
//     try {
//       const updatedUser = {
//         ...loggedUser,
//         name: profile.name,
//         phone: profile.phone,
//         email: profile.email,
//         address: profile.address,
//         contact_person: profile.contactPerson
//       };

//       // Care Center ho toh master database me bhi update karein
//       if (isCareCenter && (loggedUser.careCenterId || loggedUser.id)) {
//         const ccId = loggedUser.careCenterId || loggedUser.id;
//         try {
//           await API.put(`/master/carecenters/${ccId}`, {
//             name: profile.name,
//             phone: profile.phone,
//             address: profile.address,
//             contact_person: profile.contactPerson,
//             status: "Active"
//           });
//         } catch (apiErr) {
//           console.warn("Backend sync notice:", apiErr.message);
//         }
//       }

//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       toast.success("Profile details updated successfully!");
//     } catch (err) {
//       toast.error("Failed to save profile: " + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handlePasswordSave = () => {
//     if (!passwords.current || !passwords.new || !passwords.confirm) {
//       toast.error("Please fill all password fields.");
//       return;
//     }
//     if (passwords.new !== passwords.confirm) {
//       toast.error("New passwords do not match.");
//       return;
//     }
//     toast.success("Password changed successfully!");
//     setPasswords({ current: "", new: "", confirm: "" });
//   };

//   return (
//     <div className="fade-slide-up mx-auto max-w-4xl space-y-6">
//       {/* Dynamic Profile Header */}
//       <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="relative group">
//           <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-100 text-teal-600 text-2xl font-bold uppercase shadow-inner">
//             {avatarInitial}
//           </div>
//           <button className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-teal-600 text-white shadow-md transition hover:bg-teal-700">
//             <Camera className="h-3.5 w-3.5" />
//           </button>
//         </div>
//         <div>
//           <h2 className="font-display text-2xl font-bold text-slate-800">{profile.name}</h2>
//           <p className="text-sm font-medium text-slate-500">{profile.role} · {profile.department}</p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 border-b border-slate-200">
//         <button 
//           onClick={() => setActiveTab("profile")} 
//           className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${activeTab === "profile" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
//         >
//           <User className="h-4 w-4" /> My Profile
//         </button>
//         <button 
//           onClick={() => setActiveTab("settings")} 
//           className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${activeTab === "settings" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
//         >
//           <Settings className="h-4 w-4" /> Account Settings
//         </button>
//       </div>

//       {/* Content Area */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">        
//         {activeTab === "profile" && (
//           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
//             <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600">Personal Information</h3>
//             <div className="grid gap-5 sm:grid-cols-2">
//               <Field label="Full Name / Care Center Name">
//                 <TextInput 
//                   value={profile.name} 
//                   onChange={(e) => setProfile({...profile, name: e.target.value})} 
//                 />
//               </Field>
//               <Field label="Email Address">
//                 <TextInput 
//                   type="email" 
//                   value={profile.email} 
//                   onChange={(e) => setProfile({...profile, email: e.target.value})} 
//                 />
//               </Field>
//               <Field label="Phone Number">
//                 <TextInput 
//                   value={profile.phone} 
//                   onChange={(e) => setProfile({...profile, phone: e.target.value})} 
//                 />
//               </Field>
//               <Field label="Role (Read Only)">
//                 <TextInput 
//                   readOnly 
//                   value={profile.role} 
//                   className="bg-slate-50 text-slate-500 cursor-not-allowed" 
//                 />
//               </Field>

//               {isCareCenter && (
//                 <>
//                   <div className="sm:col-span-2">
//                     <Field label="Contact Person / Doctor">
//                       <TextInput 
//                         value={profile.contactPerson} 
//                         placeholder="In-charge name"
//                         onChange={(e) => setProfile({...profile, contactPerson: e.target.value})} 
//                       />
//                     </Field>
//                   </div>
//                   <div className="sm:col-span-2">
//                     <Field label="Care Center Address">
//                       <TextInput 
//                         value={profile.address} 
//                         placeholder="Full facility address"
//                         onChange={(e) => setProfile({...profile, address: e.target.value})} 
//                       />
//                     </Field>
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="flex justify-end pt-4 border-t border-slate-100">
//               <PrimaryButton onClick={handleProfileSave} disabled={saving}>
//                 <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Profile"}
//               </PrimaryButton>
//             </div>
//           </div>
//         )}

//         {activeTab === "settings" && (
//           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//             <div className="space-y-5">
//               <div className="flex items-center gap-2">
//                 <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Key className="h-4 w-4" /></div>
//                 <h3 className="font-bold text-slate-800">Change Password</h3>
//               </div>
//               <div className="grid gap-4 sm:max-w-md">
//                 <Field label="Current Password"><TextInput type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} /></Field>
//                 <Field label="New Password"><TextInput type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} /></Field>
//                 <Field label="Confirm New Password"><TextInput type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} /></Field>
//                 <PrimaryButton onClick={handlePasswordSave} className="w-fit mt-2"><Lock className="h-4 w-4" /> Update Password</PrimaryButton>
//               </div>
//             </div>

//             <div className="border-t border-slate-100" />

//             <div className="space-y-5">
//               <div className="flex items-center gap-2">
//                 <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600"><Bell className="h-4 w-4" /></div>
//                 <h3 className="font-bold text-slate-800">Notification Preferences</h3>
//               </div>
//               <div className="space-y-3">
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
//                   <span className="text-sm font-medium text-slate-700">Email Notifications (Updates & Alerts)</span>
//                 </label>
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({...notifications, push: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
//                   <span className="text-sm font-medium text-slate-700">Push Notifications (Browser)</span>
//                 </label>
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({...notifications, sms: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
//                   <span className="text-sm font-medium text-slate-700">SMS Notifications (Billing & Overdue)</span>
//                 </label>
//               </div>
//             </div>

//             <div className="border-t border-slate-100" />

//             <div className="space-y-5">
//               <div className="flex items-center gap-2">
//                 <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600"><Shield className="h-4 w-4" /></div>
//                 <h3 className="font-bold text-slate-800">Security</h3>
//               </div>
//               <p className="text-sm text-slate-500">Protect your account with extra security layers.</p>
//               <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">Enable Two-Factor Authentication (2FA)</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import { User, Settings, Lock, Bell, Camera, Shield, Save, Key } from "lucide-react";
import { PrimaryButton, Field, TextInput, toast } from "../components/UiComponents";
import API from "../utils/api";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  const loggedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isCareCenter = loggedUser?.role === "care_center";
  const isSuperAdmin = loggedUser?.role === "super_admin" || loggedUser?.role === "admin";

  const [profile, setProfile] = useState(() => {
    const defaultName = loggedUser?.name || loggedUser?.careCenterName || (isSuperAdmin ? "Admin" : "User");
    const defaultPhone = loggedUser?.phone || "";
    const defaultEmail = loggedUser?.email || (defaultPhone ? `${defaultPhone}@chikitsa.in` : "admin@chikitsa.com");
    const defaultRole = isCareCenter ? "Care Center" : isSuperAdmin ? "Super Admin" : (loggedUser?.role || "User");
    const defaultDept = isCareCenter ? "Care Center Partner" : "Management";

    return {
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
      role: defaultRole,
      department: defaultDept,
      address: loggedUser?.address || "",
      contactPerson: loggedUser?.contact_person || loggedUser?.contactPerson || ""
    };
  });

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const avatarInitial = (profile.name || "U").trim().charAt(0).toUpperCase();

  //  1. SAVE PROFILE TO BACKEND
  const handleProfileSave = async () => {
    if (!profile.name.trim()) {
      toast.error("Full Name / Care Center Name is required.");
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        id: loggedUser?.id || loggedUser?.careCenterId,
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        email: profile.email.trim(),
        address: profile.address?.trim() || "",
        contactPerson: profile.contactPerson?.trim() || "",
        role: loggedUser?.role
      };

      const res = await API.put("/users/profile", payload);

      const updatedUser = {
        ...loggedUser,
        name: profile.name.trim(),
        careCenterName: isCareCenter ? profile.name.trim() : (loggedUser?.careCenterName || profile.name.trim()),
        phone: profile.phone.trim(),
        email: profile.email.trim(),
        address: profile.address?.trim() || "",
        contact_person: profile.contactPerson?.trim() || "",
        contactPerson: profile.contactPerson?.trim() || ""
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success(res.data?.message || "Profile details updated successfully!");
    } catch (err) {
      console.error("Profile Save Error:", err);
      toast.error(err.response?.data?.message || "Failed to save profile details.");
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. CHANGE PASSWORD TO BACKEND
  const handlePasswordSave = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.new.length < 4) {
      toast.error("New password must be at least 4 characters long.");
      return;
    }

    setSavingPassword(true);
    try {
      const payload = {
        userId: loggedUser?.id || loggedUser?.careCenterId,
        phone: loggedUser?.phone || profile.phone,
        currentPassword: passwords.current,
        newPassword: passwords.new
      };

      const res = await API.put("/users/change-password", payload);

      toast.success(res.data?.message || "Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error("Password Change Error:", err);
      toast.error(err.response?.data?.message || "Failed to update password. Check current password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="fade-slide-up mx-auto max-w-4xl space-y-6">
      {/* Dynamic Profile Header */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative group">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-100 text-teal-600 text-2xl font-bold uppercase shadow-inner">
            {avatarInitial}
          </div>
          <button className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-teal-600 text-white shadow-md transition hover:bg-teal-700">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">{profile.name}</h2>
          <p className="text-sm font-medium text-slate-500">{profile.role} · {profile.department}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab("profile")} 
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${activeTab === "profile" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <User className="h-4 w-4" /> My Profile
        </button>
        <button 
          onClick={() => setActiveTab("settings")} 
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${activeTab === "settings" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <Settings className="h-4 w-4" /> Account Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">        
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600">Personal Information</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name / Care Center Name">
                <TextInput 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                />
              </Field>
              <Field label="Email Address">
                <TextInput 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                />
              </Field>
              <Field label="Phone Number">
                <TextInput 
                  value={profile.phone} 
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                />
              </Field>
              <Field label="Role (Read Only)">
                <TextInput 
                  readOnly 
                  value={profile.role} 
                  className="bg-slate-50 text-slate-500 cursor-not-allowed" 
                />
              </Field>

              {isCareCenter && (
                <>
                  <div className="sm:col-span-2">
                    <Field label="Contact Person / Doctor">
                      <TextInput 
                        value={profile.contactPerson} 
                        placeholder="In-charge name"
                        onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })} 
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Care Center Address">
                      <TextInput 
                        value={profile.address} 
                        placeholder="Full facility address"
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })} 
                      />
                    </Field>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <PrimaryButton onClick={handleProfileSave} disabled={savingProfile}>
                <Save className="h-4 w-4" /> {savingProfile ? "Saving..." : "Save Profile"}
              </PrimaryButton>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Key className="h-4 w-4" /></div>
                <h3 className="font-bold text-slate-800">Change Password</h3>
              </div>
              <div className="grid gap-4 sm:max-w-md">
                <Field label="Current Password">
                  <TextInput 
                    type="password" 
                    placeholder="Enter current password"
                    value={passwords.current} 
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} 
                  />
                </Field>
                <Field label="New Password">
                  <TextInput 
                    type="password" 
                    placeholder="Enter new password"
                    value={passwords.new} 
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} 
                  />
                </Field>
                <Field label="Confirm New Password">
                  <TextInput 
                    type="password" 
                    placeholder="Re-enter new password"
                    value={passwords.confirm} 
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} 
                  />
                </Field>
                <PrimaryButton onClick={handlePasswordSave} disabled={savingPassword} className="w-fit mt-2">
                  <Lock className="h-4 w-4" /> {savingPassword ? "Updating..." : "Update Password"}
                </PrimaryButton>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600"><Bell className="h-4 w-4" /></div>
                <h3 className="font-bold text-slate-800">Notification Preferences</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm font-medium text-slate-700">Email Notifications (Updates & Alerts)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm font-medium text-slate-700">Push Notifications (Browser)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm font-medium text-slate-700">SMS Notifications (Billing & Overdue)</span>
                </label>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600"><Shield className="h-4 w-4" /></div>
                <h3 className="font-bold text-slate-800">Security</h3>
              </div>
              <p className="text-sm text-slate-500">Protect your account with extra security layers.</p>
              <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">Enable Two-Factor Authentication (2FA)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}