"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth";
import { Eye, EyeOff, Shield, Activity } from "lucide-react";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/30"
    >
      {pending ? "Authenticating…" : "Access Platform"}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState(login, null);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">BSV Platform</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Equestrian Event Management System</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Secure Access Portal</span>
          </div>

          {state?.error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-400 font-medium">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@equievent.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 pr-12 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <SubmitButton />
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 text-center font-medium uppercase tracking-widest">
              Demo Credentials
            </p>
            <p className="text-xs text-slate-500 text-center mt-1">
              <span className="font-mono text-slate-400">admin@equievent.com</span>
              {" / "}
              <span className="font-mono text-slate-400">Admin@123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-6 uppercase tracking-widest font-medium">
          BSV v4.0 · Production Environment
        </p>
      </div>
    </div>
  );
}
