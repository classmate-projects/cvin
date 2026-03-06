"use client";

import { useEffect, useState } from "react";
import { FiUserPlus, FiUsers, FiTrash2, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";

export default function InviteTeamPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auth Context
    const [currentUser, setCurrentUser] = useState(null);

    // Form
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Viewer"
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (err) { }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const meRes = await fetch("/api/auth/me");
                if (meRes.ok) {
                    const meData = await meRes.json();
                    setCurrentUser(meData.user);
                }
                await fetchUsers();
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Team member invited successfully!");
                setFormData({ name: "", email: "", password: "", role: "Viewer" });
                fetchUsers();
            } else {
                toast.error(data.message || "Failed to invite user");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to revoke access?")) return;
        try {
            const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Access revoked");
                fetchUsers();
            } else {
                toast.error(data.message || "Failed to remove user");
            }
        } catch (err) {
            toast.error("Network error");
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <FiUsers className="text-4xl text-[#00845a] animate-pulse mb-4" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Checking Permissions...</span>
            </div>
        );
    }

    if (currentUser?.role !== "Admin") {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in zoom-in-95 fade-in duration-500">
                <FiShield className="text-6xl text-rose-500 mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]" />
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2">Access Restricted</h2>
                <p className="text-sm text-slate-500 font-medium">Only System Administrators can manage the intelligence team.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Team Intelligence Access
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-gray-400 font-medium">
                        Provision roles and access configurations for new agents.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Invite Form */}
                <div className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleCreateUser} className="card-glass p-6 md:p-8 space-y-6 bg-white dark:bg-[#151515] border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <FiUserPlus className="text-2xl text-[#00845a] dark:text-[#00b37a]" />
                            <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-widest">Invite Member</h2>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Full Name</label>
                            <input
                                name="name" value={formData.name} onChange={handleChange} required
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-[#00845a]/30 transition-all font-bold"
                                placeholder="E.g. Jane Doe"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Email Address</label>
                            <input
                                name="email" type="email" value={formData.email} onChange={handleChange} required
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-[#00845a]/30 transition-all font-medium"
                                placeholder="agent@cvin.system"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Temporary Password</label>
                            <input
                                name="password" type="text" value={formData.password} onChange={handleChange} required minLength={6}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-[#00845a]/30 transition-all font-mono"
                                placeholder="SecurePhrase123"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Access Role</label>
                            <select
                                name="role" value={formData.role} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-[#00845a]/30 transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option value="Viewer">Viewer (Read Only)</option>
                                <option value="Recruiter">Recruiter (Read & Write)</option>
                                <option value="Admin">System Administrator</option>
                            </select>
                        </div>

                        <button
                            type="submit" disabled={isSubmitting}
                            className="w-full bg-[#00845a] hover:bg-[#00b37a] text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-[#00845a]/20"
                        >
                            {isSubmitting ? "Provisioning..." : "Provision Access"}
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-glass p-6 bg-white dark:bg-[#151515] border border-slate-100 dark:border-white/5 overflow-hidden">
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                            Active Agents ({users.length})
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] border-b border-slate-100 dark:border-white/5">
                                        <th className="py-3 px-4">Identity</th>
                                        <th className="py-3 px-4">Role Matrix</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50 dark:divide-white/5">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 px-4 font-bold text-slate-800 dark:text-white text-sm">
                                                {user.name}
                                                <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${user.role === 'Admin' ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20' :
                                                        user.role === 'Recruiter' ? 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20' :
                                                            'bg-slate-100 border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                                                    disabled={user.email === currentUser?.email || user.email === 'admin'}
                                                    title={user.email === 'admin' ? "System Admin cannot be removed" : "Revoke Access"}
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
