"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/services/jobService";
import { getCustomers } from "@/services/customerService";
import DatePicker from "@/components/form/date-picker";

export default function CreateJob() {
  const router = useRouter();

  const [form, setForm] = useState({
    jobDetail: {
      customerName: "", jobName: "", poNumber: "", date: "",
      sizeAround: "", sizeAcross: "", cylinder: "", cylinderMM: "",
      subWidth: "", noOfAround: "", noOfAcross: "",
      aroundGap: "", acrossGap: "", totalUps: "",
    },
    colorDetails: [{ color: "", anilox: "", volume: "" }],
    technicalDetails: {
      oldRefNo: "", oldRefDate: "",
      plateThickness: "", screenRuling: "", sensorSpot: "",
      bearer: "", distortion: "", specialInstruction: "",
    },
    contactDetails: { preparedBy: "", mobile: "", email: "" },
    status: "DRAFT",
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);

  // ── Customer Dropdown State ────────────────────────────────
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Fetch Customers ────────────────────────────────────────
  useEffect(() => {
    setCustomersLoading(true);
    getCustomers()
      .then((res) => setCustomers(res.data || []))
      .catch((err) => console.error("Failed to fetch customers:", err))
      .finally(() => setCustomersLoading(false));
  }, []);

  // ── Close dropdown when clicking outside ──────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Filtered customers based on search ────────────────────
  const filteredCustomers = customers.filter((c) =>
    c.fullName?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // ── Select a customer from dropdown ───────────────────────
  const handleSelectCustomer = (fullName: string) => {
    setForm((prev) => ({
      ...prev,
      jobDetail: { ...prev.jobDetail, customerName: fullName },
    }));
    setCustomerSearch(fullName);
    setShowDropdown(false);
    setTouched((prev: any) => ({ ...prev, customerName: true }));
    setErrors((prev: any) => ({ ...prev, customerName: undefined }));
    setShowBanner(false);
  };

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

    if (!jd.customerName.trim()) newErrors.customerName = "Customer Name is required";
    if (!jd.jobName.trim())      newErrors.jobName      = "Job Name is required";
    if (!jd.poNumber.trim())     newErrors.poNumber     = "PO Number is required";
    if (!jd.date.trim())         newErrors.date         = "Date is required";
    if (!cd.preparedBy.trim())   newErrors.preparedBy   = "Prepared By is required";

    if (!cd.mobile.trim())       newErrors.mobile = "Mobile is required";
    else if (!/^[0-9]{10}$/.test(cd.mobile)) newErrors.mobile = "Enter valid 10 digit number";

    if (cd.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cd.email))
      newErrors.email = "Invalid email";

    if (!form.colorDetails.some((c) => c.color.trim()))
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
      await createJob(form, file);
      router.push("/jobs/list");
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // ── Helpers ───────────────────────────────────────────────
  const inputClass = (field: string) =>
    `w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
      touched[field] && errors[field] ? "border-red-500 bg-red-50" : "border-gray-300"
    }`;

  const ErrorMsg = ({ field }: { field: string }) =>
    touched[field] && errors[field] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span> {errors[field]}
      </p>
    ) : null;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">

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

      {/* Job Details */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ✅ CUSTOMER NAME — Searchable Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className={`flex items-center border rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 ${
                touched.customerName && errors.customerName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}>
                <input
                  type="text"
                  placeholder={customersLoading ? "Loading customers..." : "Search or select customer..."}
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowDropdown(true);
                    // If user clears input, clear form value too
                    if (!e.target.value) {
                      setForm((prev) => ({
                        ...prev,
                        jobDetail: { ...prev.jobDetail, customerName: "" },
                      }));
                    }
                  }}
                  onFocus={() => setShowDropdown(true)}
                  disabled={customersLoading}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-transparent disabled:opacity-60"
                />
                {/* Clear button */}
                {customerSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerSearch("");
                      setForm((prev) => ({
                        ...prev,
                        jobDetail: { ...prev.jobDetail, customerName: "" },
                      }));
                      setShowDropdown(true);
                    }}
                    className="px-2 text-gray-400 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                )}
                {/* Chevron */}
                <button
                  type="button"
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="px-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Dropdown List */}
              {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                  {customersLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                      Loading customers...
                    </div>
                  ) : filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer._id}
                        type="button"
                        onClick={() => handleSelectCustomer(customer.fullName)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between ${
                          form.jobDetail.customerName === customer.fullName
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        <span>{customer.fullName}</span>
                        {customer.company && (
                          <span className="text-xs text-gray-400 ml-2">{customer.company}</span>
                        )}
                        {form.jobDetail.customerName === customer.fullName && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 ml-auto shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                      {customerSearch ? `No customer found for "${customerSearch}"` : "No customers available"}
                    </div>
                  )}
                </div>
              )}
            </div>
            <ErrorMsg field="customerName" />
          </div>

          {/* Job Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Job Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="jobName"
              value={form.jobDetail.jobName}
              onChange={handleJobDetail}
              placeholder="Enter job name"
              className={inputClass("jobName")}
            />
            <ErrorMsg field="jobName" />
          </div>

          {/* PO Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              PO Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="poNumber"
              value={form.jobDetail.poNumber}
              onChange={handleJobDetail}
              placeholder="Enter PO number"
              className={inputClass("poNumber")}
            />
            <ErrorMsg field="poNumber" />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className={touched.date && errors.date ? "ring-2 ring-red-500 rounded-lg" : ""}>
              <DatePicker
                id="jobDate"
                defaultDate={form.jobDetail.date}
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

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Size Around</label>
            <input
              type="number" name="sizeAround"
              value={form.jobDetail.sizeAround}
              onChange={handleJobDetail}
              placeholder="Enter size around"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Size Across</label>
            <input
              type="number" name="sizeAcross"
              value={form.jobDetail.sizeAcross}
              onChange={handleJobDetail}
              placeholder="Enter size across"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cylinder</label>
            <input
              type="text" name="cylinder"
              value={form.jobDetail.cylinder}
              onChange={handleJobDetail}
              placeholder="Enter cylinder"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cylinder MM</label>
            <input
              type="number" name="cylinderMM"
              value={form.jobDetail.cylinderMM}
              onChange={handleJobDetail}
              placeholder="Enter cylinder MM"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sub Width</label>
            <input
              type="number" name="subWidth"
              value={form.jobDetail.subWidth}
              onChange={handleJobDetail}
              placeholder="Enter sub width"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">No. of Around</label>
            <input
              type="number" name="noOfAround"
              value={form.jobDetail.noOfAround}
              onChange={handleJobDetail}
              placeholder="Enter no. of around"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">No. of Across</label>
            <input
              type="number" name="noOfAcross"
              value={form.jobDetail.noOfAcross}
              onChange={handleJobDetail}
              placeholder="Enter no. of across"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Around Gap</label>
            <input
              type="number" name="aroundGap"
              value={form.jobDetail.aroundGap}
              onChange={handleJobDetail}
              placeholder="Enter around gap"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Across Gap</label>
            <input
              type="number" name="acrossGap"
              value={form.jobDetail.acrossGap}
              onChange={handleJobDetail}
              placeholder="Enter across gap"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Total Ups</label>
            <input
              type="number" name="totalUps"
              value={form.jobDetail.totalUps}
              onChange={handleJobDetail}
              placeholder="Enter total ups"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

        </div>
      </div>

      {/* Color Details */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Color Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Color <span className="text-red-500">*</span></th>
                <th className="border border-gray-300 px-3 py-2 text-left">Anilox</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Volume</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {form.colorDetails.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                  <td className={`border px-3 py-2 ${touched.color && errors.color && !row.color.trim() ? "border-red-400 bg-red-50" : "border-gray-300"}`}>
                    <input
                      type="text" value={row.color}
                      onChange={(e) => handleColorChange(index, "color", e.target.value)}
                      placeholder="Color name"
                      className="w-full outline-none text-sm px-1 py-0.5 bg-transparent"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text" value={row.anilox}
                      onChange={(e) => handleColorChange(index, "anilox", e.target.value)}
                      placeholder="Anilox"
                      className="w-full outline-none text-sm px-1 py-0.5"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="text" value={row.volume}
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
        <button type="button" onClick={addColorRow}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          + Add Color Row
        </button>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Technical Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Old Ref No</label>
            <input
              type="text" name="oldRefNo"
              value={form.technicalDetails.oldRefNo}
              onChange={handleTechnical}
              placeholder="Enter old ref no"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Old Ref Date</label>
            <DatePicker
              id="oldRefDate"
              defaultDate={form.technicalDetails.oldRefDate}
              onChange={(selectedDates, dateStr) => {
                setForm((prev) => ({ ...prev, technicalDetails: { ...prev.technicalDetails, oldRefDate: dateStr } }));
              }}
              placeholder="Select date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Plate Thickness</label>
            <input
              type="text" name="plateThickness"
              value={form.technicalDetails.plateThickness}
              onChange={handleTechnical}
              placeholder="Enter plate thickness"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Screen Ruling</label>
            <input
              type="text" name="screenRuling"
              value={form.technicalDetails.screenRuling}
              onChange={handleTechnical}
              placeholder="Enter screen ruling"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Sensor Spot</label>
            <input
              type="text" name="sensorSpot"
              value={form.technicalDetails.sensorSpot}
              onChange={handleTechnical}
              placeholder="Enter sensor spot"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Bearer</label>
            <input
              type="text" name="bearer"
              value={form.technicalDetails.bearer}
              onChange={handleTechnical}
              placeholder="Enter bearer"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Distortion</label>
            <input
              type="text" name="distortion"
              value={form.technicalDetails.distortion}
              onChange={handleTechnical}
              placeholder="Enter distortion"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Special Instruction</label>
            <textarea
              name="specialInstruction"
              value={form.technicalDetails.specialInstruction}
              onChange={(e) => setForm((prev) => ({ ...prev, technicalDetails: { ...prev.technicalDetails, specialInstruction: e.target.value } }))}
              placeholder="Enter any special instructions"
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Prepared By <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="preparedBy"
              value={form.contactDetails.preparedBy}
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
              value={form.contactDetails.mobile}
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
              value={form.contactDetails.email}
              onChange={handleContact}
              placeholder="Enter email (optional)"
              className={inputClass("email")}
            />
            <ErrorMsg field="email" />
          </div>

        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded shadow p-6 space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Attach File</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0 file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-400">Accepted: PDF, JPG, PNG, XLSX, DOCX</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          Submit Job
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