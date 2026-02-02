import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // STEP 1: Verify user identity (Works for Admin, Seller, and Customer)
  const verifyUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const sanitizedEmail = email.toLowerCase().trim();
      // POST is used to securely send the email in the request body
      const res = await api.post('/api/auth/verify-email', { email: sanitizedEmail });
      
      if (res.status === 200) {
        setStep(2); 
      }
    } catch (err) {
      console.error("Verification Error:", err.response?.data);
      setError(err.response?.data?.message || "Identity not found in system records.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Commit the new password to the backend
  const updatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Security mismatch: Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { 
        email: email.toLowerCase().trim(), 
        newPassword 
      });
      alert("Password protocol updated. Use your new credentials to sign in.");
      navigate('/login');
    } catch (err) {
      setError("Reset protocol failed. Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-2">
          {step === 1 ? "Recovery Hub" : "Reset Password"}
        </h2>
        <p className="text-center text-gray-400 text-[10px] uppercase tracking-widest mb-10">
          {step === 1 ? "Identify your account identity" : `Updating password for ${email.toLowerCase()}`}
        </p>

        {error && (
          <div className="bg-rose-50 text-rose-600 text-[10px] font-black uppercase p-4 rounded-xl mb-8 text-center border border-rose-100 italic animate-pulse">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={verifyUser} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-300 tracking-widest ml-4">Account Email</label>
              <input 
                type="email" 
                required 
                value={email}
                placeholder="enter registered email"
                className="w-full border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all text-slate-700"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
              {loading ? "SEARCHING..." : "FIND IDENTITY"}
            </button>
          </form>
        ) : (
          <form onSubmit={updatePassword} className="space-y-6">
            <div className="space-y-4">
              <input 
                type="password" required placeholder="NEW PASSWORD"
                className="w-full border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input 
                type="password" required placeholder="CONFIRM NEW PASSWORD"
                className="w-full border-2 border-slate-50 p-5 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
              {loading ? "UPDATING..." : "COMMIT CHANGES"}
            </button>
          </form>
        )}

        <div className="text-center mt-10">
          <Link to="/login" className="text-[10px] font-black uppercase text-slate-400 hover:text-black transition-all underline underline-offset-8 decoration-slate-100">
            Return to Login Node
          </Link>
        </div>
      </div>
    </div>
  );
}