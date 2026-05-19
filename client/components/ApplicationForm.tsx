"use client";

import { useState } from "react";
import api from "@/lib/axios";
import type { Application } from "@/types/application";



type Props = {
  onClose: () => void;
  onSuccess: (app: Application) => void;
  initialData?: Application;
};

const ApplicationForm = ({ onClose, onSuccess, initialData }: Props) => {
  const isEditMode = !!initialData;

  const [company, setCompany] = useState(initialData?.company || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [status, setStatus] = useState(initialData?.status || "APPLIED");
  const [appliedAt, setAppliedAt] = useState(
    initialData?.appliedAt
      ? new Date(initialData.appliedAt).toISOString().split("T")[0]
      : ""
  );
  const [deadline, setDeadline] = useState(
    initialData?.deadline
      ? new Date(initialData.deadline).toISOString().split("T")[0]
      : ""
  );
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        company,
        role,
        status,
        appliedAt,
        deadline: deadline || undefined,
        jobUrl: jobUrl || undefined,
        notes: notes || undefined,
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/api/applications/${initialData.id}`, payload);
      } else {
        res = await api.post("/api/applications", payload);
      }

      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0,
      width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white", padding: "30px",
        borderRadius: "8px", width: "400px",
        maxHeight: "90vh", overflowY: "auto"
      }}>
        <h3>{isEditMode ? "Edit Application" : "Add New Application"}</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Company *</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Role *</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Applied Date *</label>
            <input
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Job URL</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update" : "Add Application"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;