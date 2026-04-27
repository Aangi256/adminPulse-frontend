interface Props {
  form: any;
  setForm: any;
  errors?: any;
  touched?: any;
  setTouched?: any;
}

export default function ColorTable({
  form,
  setForm,
  errors = {},
  touched = {},
  setTouched = () => {},
}: Props) {

  const handleColorChange = (index: number, field: string, value: string) => {
    // ✅ Must spread prev AND map to update only the changed row
    setForm((prev: any) => ({
      ...prev,
      colorDetails: prev.colorDetails.map((row: any, i: number) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));

    setTouched((prev: any) => ({ ...prev, color: true }));
  };

  const addRow = () => {
    setForm((prev: any) => ({
      ...prev,
      colorDetails: [...prev.colorDetails, { color: "", anilox: "", volume: "" }],
    }));
  };

  const removeRow = (index: number) => {
    if (form.colorDetails.length === 1) return;
    setForm((prev: any) => ({
      ...prev,
      colorDetails: prev.colorDetails.filter((_: any, i: number) => i !== index),
    }));
  };

  return (
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
            {form?.colorDetails?.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.color || ""}
                    onChange={(e) => handleColorChange(index, "color", e.target.value)}
                    placeholder="Color name"
                    className="w-full outline-none text-sm px-1 py-0.5"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.anilox || ""}
                    onChange={(e) => handleColorChange(index, "anilox", e.target.value)}
                    placeholder="Anilox"
                    className="w-full outline-none text-sm px-1 py-0.5"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.volume || ""}
                    onChange={(e) => handleColorChange(index, "volume", e.target.value)}
                    placeholder="Volume"
                    className="w-full outline-none text-sm px-1 py-0.5"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
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
        <p className="text-red-500 text-xs">{errors.color}</p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        + Add Color Row
      </button>
    </div>
  );
}