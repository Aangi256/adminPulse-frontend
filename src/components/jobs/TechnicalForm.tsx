interface Props {
  form: any;
  setForm: any;
}

export default function TechnicalForm({ form, setForm }: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // ✅ Must spread prev AND prev.technicalDetails
    setForm((prev: any) => ({
      ...prev,
      technicalDetails: {
        ...prev.technicalDetails,
        [name]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Technical Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Old Ref No</label>
          <input
            type="text"
            name="oldRefNo"
            value={form?.technicalDetails?.oldRefNo || ""}
            onChange={handleChange}
            placeholder="Enter old ref no"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Old Ref Date</label>
          <input
            type="date"
            name="oldRefDate"
            value={form?.technicalDetails?.oldRefDate || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

      </div>
    </div>
  );
}