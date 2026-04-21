"use client";

import { useState } from "react";
import { createJob } from "@/services/jobService";

import JobDetailForm from "@/components/jobs/JobDetailForm";
import ColorTable from "@/components/jobs/ColorTable";
import TechnicalForm from "@/components/jobs/TechnicalForm";
import ContactForm from "@/components/jobs/ContactForm";
import FileUpload from "@/components/jobs/FileUpload";

export default function CreateJob() {
  const [form, setForm] = useState<any>({
    jobDetail: {},
    colorDetails: [{ color: "", anilox: "", volume: "" }],
    technicalDetails: {
      oldRefNo: "",
      oldRefDate: "",
    },
    contactDetails: {},
  });

  const [file, setFile] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});

  // ✅ FINAL VALIDATION (FIXED)
  const validate = () => {
    let newErrors: any = {};

    if (!form.jobDetail?.customerName?.trim())
      newErrors.customerName = "Customer Name is required";

    if (!form.jobDetail?.jobName?.trim())
      newErrors.jobName = "Job Name is required";

    if (!form.jobDetail?.poNumber?.trim())
      newErrors.poNumber = "PO Number is required";

    if (!form.jobDetail?.date)
      newErrors.date = "Date is required";

    if (!form.contactDetails?.preparedBy?.trim())
      newErrors.preparedBy = "Prepared By is required";

    if (!form.contactDetails?.mobile?.trim())
      newErrors.mobile = "Mobile is required";
    else if (!/^[0-9]{10}$/.test(form.contactDetails.mobile))
      newErrors.mobile = "Enter valid 10 digit number";

    if (
      form.contactDetails?.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactDetails.email)
    )
      newErrors.email = "Invalid email";

    if (!form.colorDetails?.length || !form.colorDetails[0]?.color)
      newErrors.color = "At least one color required";

    setErrors(newErrors);

    console.log("VALIDATION ERRORS:", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ FINAL SUBMIT (BLOCKING FIXED)
  const handleSubmit = async () => {
    const isValid = validate();

    if (!isValid) {
      console.log("Blocked due to validation");
      return;
    }

    try {
      await createJob(form, file);
      alert("Job Created Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">

      <JobDetailForm form={form} setForm={setForm} errors={errors} />
      <ColorTable form={form} setForm={setForm} errors={errors} />
      <TechnicalForm form={form} setForm={setForm} />
      <ContactForm form={form} setForm={setForm} errors={errors} />
      <FileUpload setFile={setFile} />

      {/* 🔥 IMPORTANT FIX */}
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Submit Job
      </button>

    </div>
  );
}