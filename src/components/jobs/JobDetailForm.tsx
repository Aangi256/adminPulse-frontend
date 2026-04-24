"use client";

export default function JobDetailForm({
  form,
  setForm,
  errors,
  touched,
  setTouched,
}: any) {

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      jobDetail: {
        ...prev?.jobDetail,
        [field]: value,
      },
    }));
  };

  const handleBlur = (field: string) => {
    if (!setTouched) return;

    setTouched((prev: any) => ({
      ...prev,
      [field]: true,
    }));
  };

  const Input = (label: string, field: string, type = "text") => {
    const showError = touched?.[field] && errors?.[field];

    return (
      <div>
        <label className="text-sm font-semibold text-gray-700">
          {label} *
        </label>

        <input
          type={type}
          value={form?.jobDetail?.[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          className={`border rounded px-3 py-2 w-full ${
            showError ? "border-red-500" : "border-gray-300"
          }`}
        />

        {showError && (
          <p className="text-red-500 text-xs mt-1">
            {errors?.[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-700 text-white px-4 py-2 rounded font-semibold">
        JOB DETAIL
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Input("Customer Name", "customerName")}
        {Input("Job Name", "jobName")}
        {Input("PO Number", "poNumber")}
        {Input("Date", "date", "date")}
        {Input("Size Around", "sizeAround")}
        {Input("Size Across", "sizeAcross")}
        {Input("Cylinder", "cylinder")}
        {Input("Sub Width", "subWidth")}
      </div>
    </div>
  );
}