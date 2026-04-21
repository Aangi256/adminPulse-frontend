export default function JobDetailForm({ form, setForm, errors }: any) {

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      jobDetail: {
        ...prev.jobDetail,
        [field]: value,
      },
    }));
  };

  const Input = (label: string, field: string, type = "text") => (
    <div>
      <label className="text-sm font-semibold text-gray-700">
        {label} *
      </label>
      <input
        type={type}
        className="border rounded px-3 py-2 w-full"
        onChange={(e) => handleChange(field, e.target.value)}
      />
      {errors?.[field] && (
        <p className="text-red-500 text-xs">{errors[field]}</p>
      )}
    </div>
  );

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