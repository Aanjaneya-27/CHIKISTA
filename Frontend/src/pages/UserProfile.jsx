import { useState } from "react";
import { User, Settings, Lock, Bell, Camera, Shield, Save, Key } from "lucide-react";
import { PrimaryButton, Field, TextInput, toast } from "../components/UiComponents";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@chikitsa.com",
    phone: "+91 9876543210",
    role: "Super Admin",
    department: "Management"
  });

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });

  const handleProfileSave = () => {
    toast.success("Profile details updated successfully!");
  };

  const handlePasswordSave = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="fade-slide-up mx-auto max-w-4xl space-y-6">
       <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative group">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-100 text-teal-600 text-2xl font-bold uppercase shadow-inner">
            {profile.name.charAt(0)}
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

      <div className="flex gap-2 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab("profile")} 
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === "profile" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <User className="h-4 w-4" /> My Profile
        </button>
        <button 
          onClick={() => setActiveTab("settings")} 
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === "settings" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <Settings className="h-4 w-4" /> Account Settings
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">        
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600">Personal Information</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name"><TextInput value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} /></Field>
              <Field label="Email Address"><TextInput type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} /></Field>
              <Field label="Phone Number"><TextInput value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} /></Field>
              <Field label="Role (Read Only)"><TextInput readOnly value={profile.role} className="bg-slate-50 text-slate-500" /></Field>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <PrimaryButton onClick={handleProfileSave}><Save className="h-4 w-4" /> Save Profile</PrimaryButton>
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
                <Field label="Current Password"><TextInput type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} /></Field>
                <Field label="New Password"><TextInput type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} /></Field>
                <Field label="Confirm New Password"><TextInput type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} /></Field>
                <PrimaryButton onClick={handlePasswordSave} className="w-fit mt-2"><Lock className="h-4 w-4" /> Update Password</PrimaryButton>
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
                  <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm font-medium text-slate-700">Email Notifications (Updates & Alerts)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({...notifications, push: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm font-medium text-slate-700">Push Notifications (Browser)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({...notifications, sms: e.target.checked})} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
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
              <button className="text-sm font-semibold text-teal-600 hover:text-teal-700">Enable Two-Factor Authentication (2FA)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}