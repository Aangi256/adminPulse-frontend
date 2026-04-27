"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JobDetailForm from "@/components/jobs/JobDetailForm";
import ColorTable from "@/components/jobs/ColorTable";
import TechnicalForm from "@/components/jobs/TechnicalForm";
import ContactForm from "@/components/jobs/ContactForm";
import FileUpload from "@/components/jobs/FileUpload";
import { createJob } from "@/services/jobService";

export default function CreateJobPage() {
  const router = useRouter();

  const [form, setForm] = useState<any>({
    jobDetail: { customerName: "", jobName: "", poNumber: "", date: "" },
    colorDetails: [{ color: "", anilox: "", volume: "" }],
    technicalDetails: { oldRefNo: "", oldRefDate: "" },
    contactDetails: { preparedBy: "", mobile: "", email: "" },
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const newErrors: any = {};
    const jd = form.jobDetail || {};
    const cd = form.contactDetails || {};

    if (!jd.customerName?.trim()) newErrors.customerName = "Customer Name is required";
    if (!jd.jobName?.trim())      newErrors.jobName      = "Job Name is required";
    if (!jd.poNumber?.trim())     newErrors.poNumber     = "PO Number is required";
    if (!jd.date?.trim())         newErrors.date         = "Date is required";
    if (!cd.preparedBy?.trim())   newErrors.preparedBy   = "Prepared By is required";

    if (!cd.mobile?.trim())       newErrors.mobile = "Mobile is required";
    else if (!/^[0-9]{10}$/.test(cd.mobile)) newErrors.mobile = "Enter valid 10 digit number";

    if (cd.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cd.email))
      newErrors.email = "Invalid email";

    if (!form.colorDetails?.some((c: any) => c.color?.trim()))
      newErrors.color = "At least one color is required";

    setErrors(newErrors);
    return newErrors;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    // Mark all fields as touched to show inline errors
    const allTouched = {
      customerName: true, jobName: true, poNumber: true,
      date: true, preparedBy: true, mobile: true, email: true, color: true,
    };
    setTouched(allTouched);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setShowBanner(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return; // ✅ Stop — do NOT call API
    }

    setShowBanner(false);

    try {
      await createJob(form, file);
      router.push("/jobs/list"); // ✅ Redirect to list on success
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-center border-b pb-3">
          JOB SPECIFICATION FORM
        </h1>

        {/* ✅ TOP-LEVEL VALIDATION BANNER */}
        {showBanner && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-400 text-red-700 rounded-lg px-5 py-4 shadow-sm">
            <span className="text-xl mt-0.5">❌</span>
            <div>
              <p className="font-semibold text-sm">Please fill in all required fields before submitting.</p>
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

        {/* SECTIONS — pass errors, touched, setTouched to each component */}
        <JobDetailForm
          form={form}
          setForm={setForm}
          errors={errors}
          touched={touched}
          setTouched={setTouched}
        />
        <ColorTable
          form={form}
          setForm={setForm}
          errors={errors}
          touched={touched}
          setTouched={setTouched}
        />
        <TechnicalForm form={form} setForm={setForm} />
        <ContactForm
          form={form}
          setForm={setForm}
          errors={errors}
          touched={touched}
          setTouched={setTouched}
        />
        <FileUpload setFile={setFile} />

        {/* SUBMIT */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md shadow font-medium transition"
          >
            Submit Job
          </button>
          <button
            onClick={() => router.push("/jobs/list")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-2 rounded-md shadow font-medium transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}