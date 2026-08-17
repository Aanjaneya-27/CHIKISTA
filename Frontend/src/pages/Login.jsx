// import { useState } from "react";
// import { HeartPulse, Lock, Mail, User as UserIcon, ArrowRight, Shield } from "lucide-react";
// import { PrimaryButton, TextInput, Field, Select } from "../components/UiComponents";
// import API from "../utils/api";

// export default function Login({ onLogin }) {
//   const [isRegister, setIsRegister] = useState(false); 
  
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("super_admin");
  
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
    
//     try {
      
//       const endpoint = isRegister ? "/users/register" : "/users/login";
//       const payload = isRegister ? { name, email, password, role } : { email, password };
//       const response = await API.post(endpoint, payload);
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
      
//       onLogin(response.data.user.role);
//      } catch (err) {
//       console.log("ASLI ERROR:", err);
//       setError(err.response?.data?.message || err.message || "Server Connect Nahi Hua!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-body">
//       <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50">
        
//         <div className="bg-teal-600 px-8 py-10 text-center">
//           <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
//             <HeartPulse className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="font-display text-2xl font-extrabold text-white">Chikitsa</h1>
//           <p className="mt-1 text-sm font-medium text-teal-100">
//             {isRegister ? "Create New Account" : "Rental Master System"}
//           </p>
//         </div>

//         <div className="px-8 py-8">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {error && (
//               <div className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-600 border border-rose-200">
//                 {error}
//               </div>
//             )}

//             {isRegister && (
//               <Field label="Full Name">
//                 <div className="relative">
//                   <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                   <TextInput required placeholder="Enter your name" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} />
//                 </div>
//               </Field>
//             )}

//             <Field label="Email Address">
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 <TextInput type="email" required placeholder="admin@chikitsa.in" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
//               </div>
//             </Field>

//             <Field label="Password">
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 <TextInput type="password" required placeholder="••••••••" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} />
//               </div>
//             </Field>

//             {isRegister && (
//               <Field label="Select Role">
//                 <div className="relative">
//                   <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                   <Select value={role} onChange={(e) => setRole(e.target.value)} className="pl-9">
//                     <option value="super_admin">Super Admin</option>
//                     <option value="care_center">Care Center</option>
//                     <option value="reference">Reference Partner</option>
//                     <option value="delivery_executive">Delivery Executive</option>
//                   </Select>
//                 </div>
//               </Field>
//             )}

//             <PrimaryButton type="submit" disabled={loading} className="w-full justify-center py-2.5 mt-2 text-base">
//               {loading ? "Processing..." : (isRegister ? "Register & Login" : "Sign In")} <ArrowRight className="h-4 w-4" />
//             </PrimaryButton>
//             <div className="text-center mt-4">
//               <button 
//                 type="button" 
//                 onClick={() => { setIsRegister(!isRegister); setError(""); }} 
//                 className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition"
//               >
//                 {isRegister ? "Already have an account? Sign In" : "Need an account? Register Here"}
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { HeartPulse, Lock, User, ArrowRight } from "lucide-react";
import { PrimaryButton, TextInput, Field } from "../components/UiComponents";
import API from "../utils/api";

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter ID/Mobile Number and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/users/login", {
        identifier: identifier.trim(),
        password: password.trim()
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user.role, response.data.user);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-body">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Teal Header */}
        <div className="bg-teal-600 px-8 py-10 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">Chikitsa</h1>
          <p className="mt-1 text-sm font-medium text-teal-100">
            Rental Master Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-600 border border-rose-200">
                {error}
              </div>
            )}

            {/* Login Identifier */}
            <Field label="User ID / Mobile Number">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput 
                  type="text" 
                  required 
                  placeholder="Superadmin ID or 10-digit Mobile" 
                  className="pl-9" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                />
              </div>
            </Field>

            {/* Password / Passcode */}
            <Field label="Password / Passcode">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput 
                  type="password" 
                  required 
                  placeholder="Password or Last 4 Digits of Mobile" 
                  className="pl-9" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </Field>

            <PrimaryButton type="submit" disabled={loading} className="w-full justify-center py-2.5 mt-2 text-base cursor-pointer">
              {loading ? "Authenticating..." : "Sign In"} <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Authorized access only. Accounts are configured via Master Info.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}