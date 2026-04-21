"use client";

import { useState } from "react";
import JobDetailForm from "@/components/jobs/JobDetailForm";
import ColorTable from "@/components/jobs/ColorTable";
import TechnicalForm from "@/components/jobs/TechnicalForm";
import ContactForm from "@/components/jobs/ContactForm";
import FileUpload from "@/components/jobs/FileUpload";
import { createJob } from "@/services/jobService";

export default function CreateJobPage() {
  const [form, setForm] = useState<any>({
    jobDetail: {},
    colorDetails: [{ color: "", anilox: "", volume: "" }],
    technicalDetails: {},
    contactDetails: {},
  });

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      await createJob(form, file);
      alert("Job Created Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-center border-b pb-3">
          JOB SPECIFICATION FORM
        </h1>

        {/* SECTIONS */}
        <JobDetailForm form={form} setForm={setForm} />
        <ColorTable form={form} setForm={setForm} />
        <TechnicalForm form={form} setForm={setForm} />
        <ContactForm form={form} setForm={setForm} />
        <FileUpload setFile={setFile} />

        {/* SUBMIT */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md shadow"
          >
            Submit Job
          </button>
        </div>

      </div>
    </div>
  );
}