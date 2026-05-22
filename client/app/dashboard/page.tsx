"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import ApplicationForm from "@/components/ApplicationForm";
import { useAuth } from "@/context/AuthContext";
import type { Application } from "@/types/application";

const statusStyles: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  INTERVIEW: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  OFFER: "bg-green-500/10 text-green-400 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const DashboardPage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [filter, setFilter] = useState("ALL");

  const fetchApplications = async () => {
    try {
      const res = await api.get("/api/applications");
      setApplications(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleLogout = async () => {
    await api.post("/api/auth/logout");
    logout();
    router.push("/login");
  };

  const handleCreateSuccess = (newApp: Application) => {
    setApplications([...applications, newApp]);
  };

  const handleUpdateSuccess = (updatedApp: Application) => {
    setApplications(applications.map((a) => a.id === updatedApp.id ? updatedApp : a));
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/applications/${id}`);
      setApplications(applications.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const isOverdue = (app: Application) => {
    if (!app.deadline) return false;
    return new Date(app.deadline) < new Date() &&
      app.status !== "OFFER" && app.status !== "REJECTED";
  };

  const stats = [
    { label: "Total", value: applications.length, color: "text-white" },
    { label: "Applied", value: applications.filter(a => a.status === "APPLIED").length, color: "text-blue-400" },
    { label: "Interview", value: applications.filter(a => a.status === "INTERVIEW").length, color: "text-yellow-400" },
    { label: "Offers", value: applications.filter(a => a.status === "OFFER").length, color: "text-green-400" },
    { label: "Rejected", value: applications.filter(a => a.status === "REJECTED").length, color: "text-red-400" },
  ];

  const filtered = filter === "ALL" ? applications : applications.filter(a => a.status === filter);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <nav className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">J</span>
            </div>
            <span className="font-semibold text-white">JobTrackr</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-neutral-400 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Applications</h1>
            <p className="text-neutral-500 text-sm mt-1">Track and manage all your job applications</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Application
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#111] border border-neutral-800 rounded-xl p-4">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-neutral-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["ALL", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                filter === f
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-[#111] border border-neutral-800 rounded-xl p-12 text-center">
            <p className="text-neutral-500">No applications found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm text-white underline underline-offset-4"
            >
              Add your first application
            </button>
          </div>
        ) : (
          <div className="bg-[#111] border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  {["Company", "Role", "Status", "Applied Date", "Deadline", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{app.company}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400">{app.role}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-400">
                      {app.deadline ? (
                        <span className="flex items-center gap-2">
                          {new Date(app.deadline).toLocaleDateString()}
                          {isOverdue(app) && (
                            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
                              Overdue
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-neutral-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingApp(app)}
                          className="text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-3 py-1 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-xs text-red-500/70 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 px-3 py-1 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ApplicationForm onClose={() => setShowModal(false)} onSuccess={handleCreateSuccess} />
      )}
      {editingApp && (
        <ApplicationForm
          onClose={() => setEditingApp(null)}
          onSuccess={(updatedApp) => { handleUpdateSuccess(updatedApp); setEditingApp(null); }}
          initialData={editingApp}
        />
      )}
    </div>
  );
};

export default DashboardPage;