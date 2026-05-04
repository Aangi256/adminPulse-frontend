"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

// ─── Exact types matching Job model & create form ────────────────────────────
interface ColorDetail {
  color: string;
  anilox: string;
  volume: string;
}

interface Job {
  _id: string;
  jobId: string;
  jobDetail: {
    customerName: string;
    jobName: string;
    poNumber: string;
    date: string;
    sizeAround?: number;
    sizeAcross?: number;
    cylinder?: string;
    cylinderMM?: number;
    subWidth?: number;
    noOfAround?: number;
    noOfAcross?: number;
    aroundGap?: number;
    acrossGap?: number;
    totalUps?: number;
  };
  colorDetails: ColorDetail[];
  technicalDetails: {
    plateThickness?: string;
    screenRuling?: string;
    sensorSpot?: string;
    bearer?: string;
    distortion?: string;
    specialInstruction?: string;
    oldRefNo?: string;
    oldRefDate?: string;
  };
  contactDetails: {
    preparedBy: string;
    mobile: string;
    email?: string;
  };
  fileUrl?: string;
  status: string;
  employeeStatus?: string;
  assignmentHistory?: {
    user: string | { _id: string };
    jobRole: string;
    assignedAt: string;
  }[];
}

const API = "http://localhost:5000/api/jobs";

// Employee status options (matches backend enum)
const STATUS_OPTIONS = ["Assigned", "Working in Progress", "Completed"];

// Helper to get file URL
const resolveFileUrl = (fileUrl?: string) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("http")) return fileUrl;
  const clean = fileUrl.replace(/\\/g, "/").replace(/^uploads\//, "");
  return `http://localhost:5000/uploads/${clean}`;
};

// Helper to get logged-in userId from localStorage
const getStoredUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  const direct = localStorage.getItem("userId");
  if (direct) return direct;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user._id || null;
  } catch {
    return null;
  }
};

// ─── Read-only field component ───────────────────────────────────────────────
const ReadField = ({
  label,
  value,
  colSpan,
}: {
  label: string;
  value?: string | number | null;
  colSpan?: boolean;
}) => (
  <div className={colSpan ? "md:col-span-2" : ""}>
    <label
      style={{
        display: "block",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#6b7280",
        marginBottom: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </label>
    <div
      style={{
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        padding: "8px 12px",
        fontSize: "0.875rem",
        color: value ? "#111827" : "#9ca3af",
        backgroundColor: "#f9fafb",
        minHeight: "38px",
      }}
    >
      {value ?? <em style={{ fontStyle: "italic" }}>—</em>}
    </div>
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      padding: "24px",
      marginBottom: "20px",
    }}
  >
    <h2
      style={{
        fontSize: "1rem",
        fontWeight: 600,
        color: "#374151",
        marginBottom: "16px",
        paddingBottom: "12px",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Block admin from accessing this page
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "Admin") {
      router.replace("/jobs/list");
    }
  }, [router]);

  // Fetch job by ID
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API}/${id}`)
      .then((res) => {
        setJob(res.data);
        setSelectedStatus(res.data.employeeStatus || "Assigned");
      })
      .catch(() => setError("Could not load job details. Please go back and try again."))
      .finally(() => setLoading(false));
  }, [id]);

  // Get this employee's assigned role from history
  const getMyRole = () => {
    if (!job?.assignmentHistory?.length) return "—";
    const userId = getStoredUserId();
    const match = [...job.assignmentHistory]
      .reverse()
      .find((a) => {
        const uid = typeof a.user === "string" ? a.user : a.user?._id;
        return uid === userId;
      });
    return match?.jobRole?.toUpperCase() || "—";
  };

  // Update employee status
  const handleStatusUpdate = async () => {
    if (!job || selectedStatus === job.employeeStatus) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await axios.put(`${API}/${job._id}/employee-status`, {
        employeeStatus: selectedStatus,
      });
      setJob((prev) => (prev ? { ...prev, employeeStatus: selectedStatus } : prev));
      setSaveMsg({ type: "success", text: "Status updated successfully!" });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg({ type: "error", text: "Failed to update status. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const fileUrl = resolveFileUrl(job?.fileUrl);
  const isImage = !!fileUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);

  const empStatusColor: Record<string, { bg: string; text: string }> = {
    Assigned: { bg: "#eff6ff", text: "#1d4ed8" },
    "Working in Progress": { bg: "#fefce8", text: "#92400e" },
    Completed: { bg: "#f0fdf4", text: "#166534" },
  };
  const currentStatusStyle = empStatusColor[job?.employeeStatus || "Assigned"] || {
    bg: "#f3f4f6",
    text: "#374151",
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div
          style={{
            width: 36,
            height: 36,
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #4f46e5",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ──
  if (error || !job) {
    return (
      <div style={{ padding: "24px" }}>
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          {error || "Job not found."}
        </div>
        <button
          onClick={() => router.back()}
          style={{
            color: "#4f46e5",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => router.back()}
          style={{
            color: "#4f46e5",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
            marginBottom: "8px",
            display: "block",
            padding: 0,
          }}
        >
          ← Back to My Jobs
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: 0 }}>
              {job.jobDetail?.jobName || "Job Details"}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "4px" }}>
              Job ID: <strong>{job.jobId}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {getMyRole() !== "—" && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#4f46e5",
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "999px",
                  padding: "4px 12px",
                }}
              >
                Your Role: {getMyRole()}
              </span>
            )}
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                background: currentStatusStyle.bg,
                color: currentStatusStyle.text,
                borderRadius: "999px",
                padding: "4px 12px",
              }}
            >
              {job.employeeStatus || "Assigned"}
            </span>
          </div>
        </div>
      </div>

      {/* ── 1. JOB DETAILS (mirrors the Job Details section in create form) ── */}
      <Section title="Job Details">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <ReadField label="Customer Name *" value={job.jobDetail?.customerName} />
          <ReadField label="Job Name *" value={job.jobDetail?.jobName} />
          <ReadField label="PO Number *" value={job.jobDetail?.poNumber} />
          <ReadField
            label="Date *"
            value={
              job.jobDetail?.date
                ? new Date(job.jobDetail.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : undefined
            }
          />
          <ReadField label="Size Around" value={job.jobDetail?.sizeAround} />
          <ReadField label="Size Across" value={job.jobDetail?.sizeAcross} />
          <ReadField label="Cylinder" value={job.jobDetail?.cylinder} />
          <ReadField label="Cylinder MM" value={job.jobDetail?.cylinderMM} />
          <ReadField label="Sub Width" value={job.jobDetail?.subWidth} />
          <ReadField label="No. of Around" value={job.jobDetail?.noOfAround} />
          <ReadField label="No. of Across" value={job.jobDetail?.noOfAcross} />
          <ReadField label="Around Gap" value={job.jobDetail?.aroundGap} />
          <ReadField label="Across Gap" value={job.jobDetail?.acrossGap} />
          <ReadField label="Total Ups" value={job.jobDetail?.totalUps} />
        </div>
      </Section>

      {/* ── 2. COLOR DETAILS (mirrors the Color Details table in create form) ── */}
      <Section title="Color Details">
        {job.colorDetails && job.colorDetails.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  {["#", "Color *", "Anilox", "Volume"].map((h) => (
                    <th
                      key={h}
                      style={{
                        border: "1px solid #e5e7eb",
                        padding: "8px 12px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#6b7280",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {job.colorDetails.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px 12px", color: "#9ca3af" }}>
                      {i + 1}
                    </td>
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px 12px", fontWeight: 500, color: "#111827" }}>
                      {row.color || <em style={{ color: "#9ca3af" }}>—</em>}
                    </td>
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px 12px", color: "#374151" }}>
                      {row.anilox || <em style={{ color: "#9ca3af" }}>—</em>}
                    </td>
                    <td style={{ border: "1px solid #e5e7eb", padding: "8px 12px", color: "#374151" }}>
                      {row.volume || <em style={{ color: "#9ca3af" }}>—</em>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>No color details added.</p>
        )}
      </Section>

      {/* ── 3. TECHNICAL DETAILS (mirrors the Technical Details section in create form) ── */}
      <Section title="Technical Details">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <ReadField label="Old Ref No" value={job.technicalDetails?.oldRefNo} />
          <ReadField
            label="Old Ref Date"
            value={
              job.technicalDetails?.oldRefDate
                ? new Date(job.technicalDetails.oldRefDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : undefined
            }
          />
          <ReadField label="Plate Thickness" value={job.technicalDetails?.plateThickness} />
          <ReadField label="Screen Ruling" value={job.technicalDetails?.screenRuling} />
          <ReadField label="Sensor Spot" value={job.technicalDetails?.sensorSpot} />
          <ReadField label="Bearer" value={job.technicalDetails?.bearer} />
          <ReadField label="Distortion" value={job.technicalDetails?.distortion} />
          <ReadField label="Special Instruction" value={job.technicalDetails?.specialInstruction} colSpan />
        </div>
      </Section>

      {/* ── 4. CONTACT DETAILS (mirrors the Contact Details section in create form) ── */}
      <Section title="Contact Details">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <ReadField label="Prepared By *" value={job.contactDetails?.preparedBy} />
          <ReadField label="Mobile *" value={job.contactDetails?.mobile} />
          <ReadField label="Email" value={job.contactDetails?.email} colSpan />
        </div>
      </Section>

      {/* ── 5. ATTACHED FILE (mirrors the Attach File section in create form) ── */}
      <Section title="Attached File">
        {fileUrl ? (
          <div>
            {isImage ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <img
                  src={fileUrl}
                  alt="Attached file"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "320px",
                    objectFit: "contain",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4f46e5", fontSize: "0.875rem", textDecoration: "none" }}
                >
                  Open full size ↗
                </a>
              </div>
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                  border: "1px solid #c7d2fe",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Download Attached File
              </a>
            )}
          </div>
        ) : (
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>No file was attached to this job.</p>
        )}
      </Section>

      {/* ── 6. UPDATE YOUR STATUS (employee-only action) ── */}
      <Section title="Update Your Status">
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "16px" }}>
          Select your current progress on this job and click <strong>Save Status</strong>.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
          {STATUS_OPTIONS.map((opt) => {
            const isActive = selectedStatus === opt;
            return (
              <button
                key={opt}
                onClick={() => setSelectedStatus(opt)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  border: isActive ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                  background: isActive ? "#4f46e5" : "#ffffff",
                  color: isActive ? "#ffffff" : "#374151",
                  transition: "all 0.15s ease",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={handleStatusUpdate}
            disabled={saving || selectedStatus === job.employeeStatus}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              background: saving || selectedStatus === job.employeeStatus ? "#a5b4fc" : "#4f46e5",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: saving || selectedStatus === job.employeeStatus ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            {saving ? "Saving…" : "Save Status"}
          </button>

          {saveMsg && (
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: saveMsg.type === "success" ? "#16a34a" : "#dc2626",
              }}
            >
              {saveMsg.type === "success" ? "✓ " : "⚠ "}
              {saveMsg.text}
            </span>
          )}
        </div>
      </Section>
    </div>
  );
}
