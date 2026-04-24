"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/services/jobService";

import JobDetailForm from "@/components/jobs/JobDetailForm";
import ColorTable from "@/components/jobs/ColorTable";
import TechnicalForm from "@/components/jobs/TechnicalForm";
import ContactForm from "@/components/jobs/ContactForm";
import FileUpload from "@/components/jobs/FileUpload";

export default function CreateJob() {
  const router = useRouter();

  // ✅ SAFE INITIAL STATE (VERY IMPORTANT)
  const [form, setForm] = useState<any>({
    jobDetail: {
      customerName: "",
      jobName: "",
      poNumber: "",
      date: "",
    },
    colorDetails: [{ color: "", anilox: "", volume: "" }],
    technicalDetails: {
      oldRefNo: "",
      oldRefDate: "",
    },
    contactDetails: {
      preparedBy: "",
      mobile: "",
      email: "",
    },
  });

  const [file, setFile] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});

  // ✅ VALIDATION
  const validate = () => {
    let newErrors: any = {};

    if (!form?.jobDetail?.customerName?.trim())
      newErrors.customerName = "Customer Name is required";

    if (!form?.jobDetail?.jobName?.trim())
      newErrors.jobName = "Job Name is required";

    if (!form?.jobDetail?.poNumber?.trim())
      newErrors.poNumber = "PO Number is required";

    if (!form?.jobDetail?.date)
      newErrors.date = "Date is required";

    if (!form?.contactDetails?.preparedBy?.trim())
      newErrors.preparedBy = "Prepared By is required";

    if (!form?.contactDetails?.mobile?.trim())
      newErrors.mobile = "Mobile is required";
    else if (!/^[0-9]{10}$/.test(form.contactDetails.mobile))
      newErrors.mobile = "Enter valid 10 digit number";

    if (
      form?.contactDetails?.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactDetails.email)
    )
      newErrors.email = "Invalid email";

    const hasValidColor = form?.colorDetails?.some(
      (c: any) => c?.color?.trim()
    );

    if (!hasValidColor) {
      newErrors.color = "At least one color required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    const isValid = validate();

    setTouched({
      customerName: true,
      jobName: true,
      poNumber: true,
      date: true,
      preparedBy: true,
      mobile: true,
      email: true,
      color: true,
    });

    if (!isValid) return;

    try {
      await createJob(form, file);

      alert("Job Created Successfully");

      router.push("/jobs");
      router.refresh();

    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ PREVENT RENDER CRASH
  if (!form) return null;

  return (
    <div className="p-6 space-y-6">

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