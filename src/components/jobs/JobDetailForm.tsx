interface Props {
  form: any;
  setForm: any;
  errors?: any;
  touched?: any;
  setTouched?: any;
}

export default function JobDetailForm({
  form,
  setForm,
  errors = {},
  touched = {},
  setTouched = () => {},
}: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // ✅ This is the critical part — must spread prev AND prev.jobDetail
    setForm((prev: any) => ({
      ...prev,
      jobDetail: {
        ...prev.jobDetail,
        [name]: value,
      },
    }));

    setTouched((prev: any) => ({ ...prev, [name]: true }));
  };

  return (
    <div className="bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Job Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="customerName"
            value={form?.jobDetail?.customerName || ""}
            onChange={handleChange}
            placeholder="Enter customer name"
            className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
              touched.customerName && errors.customerName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.customerName && errors.customerName && (
            <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Job Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jobName"
            value={form?.jobDetail?.jobName || ""}
            onChange={handleChange}
            placeholder="Enter job name"
            className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
              touched.jobName && errors.jobName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.jobName && errors.jobName && (
            <p className="text-red-500 text-xs mt-1">{errors.jobName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            PO Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="poNumber"
            value={form?.jobDetail?.poNumber || ""}
            onChange={handleChange}
            placeholder="Enter PO number"
            className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
              touched.poNumber && errors.poNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.poNumber && errors.poNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.poNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={form?.jobDetail?.date || ""}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
              touched.date && errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.date && errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

      </div>
    </div>
  );
}