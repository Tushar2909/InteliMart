import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CustomerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // ✅ UPDATED: Uses the secure /me endpoint instead of email in URL
      const res = await api.get('/api/customers/me');
      setProfile(res.data);
      setFormData(res.data.user); // Syncs with your nested UserDto structure
    } catch (err) {
      console.error("Failed to load identity node");
    }
  };

  const handleSave = async () => {
    try {
      // ✅ UPDATED: Matches the @PutMapping("/me") in your Controller
      await api.put('/api/customers/me', { user: formData });
      setIsEditing(false);
      loadProfile(); // Refresh data
      alert("Profile Updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!profile) return <div className="p-20 text-center font-black uppercase italic text-slate-300">Syncing Identity...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* PROFILE CARD */}
      <div className="bg-white shadow-2xl rounded-[3rem] p-10 border border-slate-100">
        <h2 className="text-3xl font-black italic uppercase mb-8 border-b-4 border-black">Identity Node</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</label>
              {isEditing ? (
                <input className="w-full border-2 p-3 rounded-xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              ) : (
                <p className="font-bold text-xl uppercase italic">{profile.user.name}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Number</label>
              {isEditing ? (
                <input className="w-full border-2 p-3 rounded-xl font-bold" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
              ) : (
                <p className="font-bold text-xl">{profile.user.number}</p>
              )}
            </div>

            <div className="pt-4">
              {isEditing ? (
                <button onClick={handleSave} className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all">Save Profile</button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Edit Details</button>
              )}
            </div>
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="flex flex-col gap-4 justify-center">
            <button 
              onClick={() => navigate('/customer/orders')}
              className="group bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent hover:border-black transition-all text-left"
            >
              <p className="text-[9px] font-black uppercase text-slate-400 group-hover:text-black">Order Logbook</p>
              <p className="text-xl font-black uppercase italic">View Purchases</p>
            </button>

            <button 
              onClick={() => navigate('/customer/payments')}
              className="group bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent hover:border-emerald-500 transition-all text-left"
            >
              <p className="text-[9px] font-black uppercase text-slate-400 group-hover:text-emerald-500">Finance Ledger</p>
              <p className="text-xl font-black uppercase italic">Payment History</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}