"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import ApplicationForm from "@/components/ApplicationForm";
import { useAuth } from "@/context/AuthContext";
import type { Application } from "@/types/application";

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
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = async () => {
    await api.post("/api/auth/logout");
    logout();
    router.push("/login");
  };

  const handleCreateSuccess = (newApp: Application) => {
    setApplications([...applications, newApp]);
  };

  const handleUpdateSuccess = (updatedApp: Application) => {
    setApplications(applications.map((app) =>
      app.id === updatedApp.id ? updatedApp : app
    ));
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/applications/${id}`);
      setApplications(applications.filter((app) => app.id !== id));
    } catch (err: any) {
      alert("Failed to delete application");
    }
  };

  // --- Stats ---
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "APPLIED").length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
    offer: applications.filter((a) => a.status === "OFFER").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  };

  // --- Filter ---
  const filteredApplications = filter === "ALL"
    ? applications
    : applications.filter((a) => a.status === filter);

  // --- Overdue ---
  const isOverdue = (app: Application) => {
    if (!app.deadline) return false;
    return new Date(app.deadline) < new Date() && app.status !== "OFFER" && app.status !== "REJECTED";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Applications</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowModal(true)}>+ Add Application</button>
          <button onClick={handleLogout} style={{ background: "red", color: "white" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        {[
          { label: "Total", value: stats.total, color: "#333" },
          { label: "Applied", value: stats.applied, color: "blue" },
          { label: "Interview", value: stats.interview, color: "orange" },
          { label: "Offer", value: stats.offer, color: "green" },
          { label: "Rejected", value: stats.rejected, color: "red" },
        ].map((stat) => (
          <div key={stat.label} style={{
            padding: "15px 20px",
            border: "1px solid #eee",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "80px"
          }}>
            <p style={{ color: stat.color, fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              {stat.value}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {["ALL", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              background: filter === f ? "#333" : "white",
              color: filter === f ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredApplications.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No applications found</p>
      ) : (
        <table border={1} cellPadding={10} style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td>{app.company}</td>
                <td>{app.role}</td>
                <td>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    background:
                      app.status === "APPLIED" ? "#dbeafe" :
                      app.status === "INTERVIEW" ? "#fef9c3" :
                      app.status === "OFFER" ? "#dcfce7" :
                      "#fee2e2",
                    color:
                      app.status === "APPLIED" ? "blue" :
                      app.status === "INTERVIEW" ? "orange" :
                      app.status === "OFFER" ? "green" :
                      "red"
                  }}>
                    {app.status}
                  </span>
                </td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td>
                  {app.deadline ? (
                    <span>
                      {new Date(app.deadline).toLocaleDateString()}
                      {isOverdue(app) && (
                        <span style={{
                          marginLeft: "8px",
                          background: "red",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "11px"
                        }}>
                          Overdue
                        </span>
                      )}
                    </span>
                  ) : "-"}
                </td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setEditingApp(app)}>Edit</button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modals */}
      {showModal && (
        <ApplicationForm
          onClose={() => setShowModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {editingApp && (
        <ApplicationForm
          onClose={() => setEditingApp(null)}
          onSuccess={(updatedApp) => {
            handleUpdateSuccess(updatedApp);
            setEditingApp(null);
          }}
          initialData={editingApp}
        />
      )}
    </div>
  );
};

export default DashboardPage;