"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ApplicationForm from "@/components/ApplicationForm";

type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedAt: string;
  deadline?: string;
  jobUrl?: string;
  notes?: string;
};

const DashboardPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Applications</h2>
        <button onClick={() => setShowModal(true)}>+ Add Application</button>
      </div>

      {applications.length === 0 ? (
        <p>No applications found</p>
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
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.company}</td>
                <td>{app.role}</td>
                <td>{app.status}</td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td>{app.deadline ? new Date(app.deadline).toLocaleDateString() : "-"}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setEditingApp(app)}>Edit</button>
                  <button onClick={() => handleDelete(app.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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