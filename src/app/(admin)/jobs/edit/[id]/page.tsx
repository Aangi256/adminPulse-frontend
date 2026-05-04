"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJobById, updateJob } from "@/services/jobService";
import DatePicker from "@/components/form/date-picker";

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    jobDetail: { customerName: "", jobName: "", poNumber: "", date: "" },
    colorDetails: [{ color: "", anilox: "", volume: "" }],
    technicalDetails: { oldRefNo: "", oldRefDate: "" },
    contactDetails: { preparedBy: "", mobile: "", email: "" },
    status: "DRAFT",
  });

  const [file, setFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null); // ✅ existing uploaded file
  const [removeExistingFile, setRemoveExistingFile] = useState(false);   // ✅ track if user removed it
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Fetch job on load ─────────────────────────────────────
  useEffect(() => {
    if (id) {
      getJobById(id)
        .then((res) => {
          if (res.data) {
            const formatForDateInput = (isoString: string) => {
              if (!isoString) return "";
              return new Date(isoString).toISOString().split("T")[0];
            };

            setForm({
              jobDetail: {
                ...res.data.jobDetail,
                date: formatForDateInput(res.data.jobDetail?.date),
              },
              colorDetails:
                res.data.colorDetails?.length > 0
                  ? res.data.colorDetails
                  : [{ color: "", anilox: "", volume: "" }],
              technicalDetails: {
                ...res.data.technicalDetails,
                oldRefDate: formatForDateInput(res.data.technicalDetails?.oldRefDate),
              },
              contactDetails: res.data.contactDetails || {
                preparedBy: "",
                mobile: "",
                email: "",
              },
              status: res.data.status || "DRAFT",
            });

            // ✅ Set existing file name if present
            if (res.data.fileUrl) {
              setExistingFile(res.data.fileUrl);
            } else if (res.data.fileName || res.data.file) {
              setExistingFile(res.data.fileName || res.data.file);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to fetch job details");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  // ── Handlers ──────────────────────────────────────────────
  const handleJobDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, jobDetail: { ...prev.jobDetail, [name]: value } }));
    setTouched((prev: any) => ({ ...prev, [name]: true }));
    setShowBanner(false);
  };

  const handleContact = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, contactDetails: { ...prev.contactDetails, [name]: value } }));
    setTouched((prev: any) => ({ ...prev, [name]: true }));
    setShowBanner(false);
  };

  const handleTechnical = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, technicalDetails: { ...prev.technicalDetails, [name]: value } }));
  };

  const handleColorChange = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      colorDetails: prev.colorDetails.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
    setTouched((prev: any) => ({ ...prev, color: true }));
    setShowBanner(false);
  };

  const addColorRow = () => {
    setForm((prev) => ({
      ...prev,
      colorDetails: [...prev.colorDetails, { color: "", anilox: "", volume: "" }],
    }));
  };

  const removeColorRow = (index: number) => {
    if (form.colorDetails.length === 1) return;
    setForm((prev) => ({
      ...prev,
      colorDetails: prev.colorDetails.filter((_, i) => i !== index),
    }));
  };

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const newErrors: any = {};
    const jd = form.jobDetail;
    const cd = form.contactDetails;

    if (!jd.customerName?.trim()) newErrors.customerName = "Customer Name is required";
    if (!jd.jobName?.trim())      newErrors.jobName      = "Job Name is required";
    if (!jd.poNumber?.trim())     newErrors.poNumber     = "PO Number is required";
    if (!jd.date?.trim())         newErrors.date         = "Date is required";
    if (!cd.preparedBy?.trim())   newErrors.preparedBy   = "Prepared By is required";

    if (!cd.mobile?.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^[0-9]{10}$/.test(cd.mobile))
      newErrors.mobile = "Enter valid 10 digit number";

    if (cd.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cd.email))
      newErrors.email = "Invalid email";

    if (!form.colorDetails?.some((c) => c.color?.trim()))
      newErrors.color = "At least one color is required";

    setErrors(newErrors);
    return newErrors;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    setTouched({
      customerName: true, jobName: true, poNumber: true,
      date: true, preparedBy: true, mobile: true, email: true, color: true,
    });

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setShowBanner(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setShowBanner(false);

    try {
      const payload = { ...form, removeExistingFile };
      await updateJob(id, payload, file);
      router.push("/jobs/list");
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // ── Helpers ───────────────────────────────────────────────
  const inputClass = (field: string) =>
    `w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
      touched[field] && errors[field]
        ? "border-red-500 bg-red-50"
        : "border-gray-300"
    }`;

  const ErrorMsg = ({ field }: { field: string }) =>
    touched[field] && errors[field] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span> {errors[field]}
      </p>
    ) : null;

  // ── Status badge color ────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":               return "bg-gray-100 text-gray-700";
      case "WORKING_IN_PROGRESS": return "bg-yellow-100 text-yellow-700";
      case "ASSIGNED":            return "bg-blue-100 text-blue-700";
      case "COMPLETED":           return "bg-green-100 text-green-700";
      default:                    return "bg-gray-100 text-gray-700";
    }
  };

  // ── Render ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading job details...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">Edit Job</h1>

      {/* ✅ VALIDATION BANNER */}
      {showBanner && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-400 text-red-700 rounded-lg px-5 py-4 shadow-sm">
          <span className="text-xl mt-0.5">❌</span>
          <div>
            <p className="font-semibold text-sm">
              Please fill in all required fields before submitting.
            </p>
            <ul className="mt-1 list-disc list-inside text-xs space-y-0.5">
              {Object.values(errors).map((msg: any, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-auto text-red-400 hover:text-red-600 text-lg font-bold leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Job Details ───────────────────────────────────── */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="customerName"
              value={form.jobDetail?.customerName || ""}
              onChange={handleJobDetail}
              placeholder="Enter customer name"
              className={inputClass("customerName")}
            />
            <ErrorMsg field="customerName" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Job Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="jobName"
              value={form.jobDetail?.jobName || ""}
              onChange={handleJobDetail}
              placeholder="Enter job name"
              className={inputClass("jobName")}
            />
            <ErrorMsg field="jobName" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              PO Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="poNumber"
              value={form.jobDetail?.poNumber || ""}
              onChange={handleJobDetail}
              placeholder="Enter PO number"
              className={inputClass("poNumber")}
            />
            <ErrorMsg field="poNumber" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className={touched.date && errors.date ? "ring-2 ring-red-500 rounded-lg" : ""}>
              <DatePicker
                id="jobDate"
                defaultDate={form.jobDetail?.date || ""}
                onChange={(selectedDates, dateStr) => {
                  setForm((prev) => ({ ...prev, jobDetail: { ...prev.jobDetail, date: dateStr } }));
                  setTouched((prev: any) => ({ ...prev, date: true }));
                  setShowBanner(false);
                }}
                placeholder="Select date"
              />
            </div>
            <ErrorMsg field="date" />
          </div>

        </div>
      </div>

      {/* ── Color Details ─────────────────────────────────── */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Color Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Color <span className="text-red-500">*</span>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">Anilox</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Volume</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {form.colorDetails?.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className={`border px-3 py-2 ${
                    touched.color && errors.color && !row.color?.trim()
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}>
                    <input
                      type="text" value={row.color || ""}
                      onChange={(e) => handleColorChange(index, "color", e.target.value)}
                      placeholder="Color name"
                      className="w-full outline-none text-sm px-1 py-0.5 bg-transparent"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text" value={row.anilox || ""}
                      onChange={(e) => handleColorChange(index, "anilox", e.target.value)}
                      placeholder="Anilox"
                      className="w-full outline-none text-sm px-1 py-0.5"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text" value={row.volume || ""}
                      onChange={(e) => handleColorChange(index, "volume", e.target.value)}
                      placeholder="Volume"
                      className="w-full outline-none text-sm px-1 py-0.5"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeColorRow(index)}
                      disabled={form.colorDetails.length === 1}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {touched.color && errors.color && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <span>⚠</span> {errors.color}
          </p>
        )}
        <button
          type="button" onClick={addColorRow}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add Color Row
        </button>
      </div>

      {/* ── Technical Details ─────────────────────────────── */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Technical Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Old Ref No</label>
            <input
              type="text" name="oldRefNo"
              value={form.technicalDetails?.oldRefNo || ""}
              onChange={handleTechnical}
              placeholder="Enter old ref no"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Old Ref Date</label>
            <DatePicker
              id="oldRefDate"
              defaultDate={form.technicalDetails?.oldRefDate || ""}
              onChange={(selectedDates, dateStr) => {
                setForm((prev) => ({ ...prev, technicalDetails: { ...prev.technicalDetails, oldRefDate: dateStr } }));
              }}
              placeholder="Select date"
            />
          </div>

        </div>
      </div>

      {/* ── Contact Details ───────────────────────────────── */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Prepared By <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="preparedBy"
              value={form.contactDetails?.preparedBy || ""}
              onChange={handleContact}
              placeholder="Enter name"
              className={inputClass("preparedBy")}
            />
            <ErrorMsg field="preparedBy" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="mobile"
              value={form.contactDetails?.mobile || ""}
              onChange={handleContact}
              placeholder="Enter 10 digit mobile"
              maxLength={10}
              className={inputClass("mobile")}
            />
            <ErrorMsg field="mobile" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email" name="email"
              value={form.contactDetails?.email || ""}
              onChange={handleContact}
              placeholder="Enter email (optional)"
              className={inputClass("email")}
            />
            <ErrorMsg field="email" />
          </div>

        </div>
      </div>

      {/* ── ✅ STATUS (inside form) ───────────────────────── */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Job Status</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { value: "DRAFT",               label: "Draft" },
            { value: "WORKING_IN_PROGRESS", label: "Working in Progress" },
            { value: "ASSIGNED",            label: "Assigned" },
            { value: "COMPLETED",           label: "Completed" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, status: option.value }))}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                form.status === option.value
                  ? getStatusColor(option.value) + " border-transparent ring-2 ring-offset-1 ring-blue-400"
                  : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Current status:{" "}
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(form.status)}`}>
            {form.status.replace(/_/g, " ")}
          </span>
        </p>
      </div>

      {/* ── ✅ FILE UPLOAD with existing file preview ─────── */}
      <div className="bg-white rounded shadow p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Attach File</h2>

        {/* Show existing file with remove button */}
        {existingFile && !removeExistingFile && !file && (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded px-4 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <a 
              href={`http://localhost:5000/${existingFile.replace(/\\/g, '/')}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline truncate flex-1 block"
            >
              {existingFile.split(/[/\\]/).pop()}
            </a>
            <button
              type="button"
              onClick={() => setRemoveExistingFile(true)}
              className="text-red-400 hover:text-red-600 transition"
              title="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Show newly selected file with remove button */}
        {file && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded px-4 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-sm text-blue-700 truncate flex-1">{file.name}</span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-red-400 hover:text-red-600 transition"
              title="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Upload input — shown when no new file selected */}
        {!file && (
          <div>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setRemoveExistingFile(true); // replacing old file
              }}
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0 file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-1">Accepted: PDF, JPG, PNG, XLSX, DOCX</p>
          </div>
        )}

      </div>

      {/* ── Action Buttons ────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          Update Job
        </button>
        <button
          type="button"
          onClick={() => router.push("/jobs/list")}
          className="bg-gray-100 text-gray-600 px-6 py-2 rounded hover:bg-gray-200 transition font-medium"
        >
          Cancel
        </button>
      </div>

    </div>
  );
}