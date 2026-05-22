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
    initialData?.appliedAt ? new Date(initialData.appliedAt).toISOString().split("T")[0] : ""
  );
  const [deadline, setDeadline] = useState(
    initialData?.deadline ? new Date(initialData.deadline).toISOString().split("T")[0] : ""
  );
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors";
  const labelClass = "text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1.5 block";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        company, role, status, appliedAt,
        deadline: deadline || undefined,
        jobUrl: jobUrl || undefined,
        notes: notes || undefined,
      };
      const res = isEditMode
        ? await api.put(`/api/applications/${initialData.id}`, payload)
        : await api.post("/api/applications", payload);
      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-neutral-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h3 className="font-semibold text-white">
            {isEditMode ? "Edit Application" : "Add New Application"}
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors text-xl leading-none">
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Company *</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Role *</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Engineer" required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Status *</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Applied Date *</label>
            <input type="date" value={appliedAt} onChange={(e) => setAppliedAt(e.target.value)} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Job URL</label>
            <input type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes about this application..." rows={3} className={inputClass} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black font-medium text-sm py-2.5 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditMode ? "Update" : "Add Application"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent text-neutral-400 font-medium text-sm py-2.5 rounded-lg border border-neutral-800 hover:border-neutral-600 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;