"use client";

export default function ColorTable({ form, setForm, errors }: any) {

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...form.colorDetails];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setForm((prev: any) => ({
      ...prev,
      colorDetails: updated,
    }));
  };

  const addRow = () => {
    setForm((prev: any) => ({
      ...prev,
      colorDetails: [
        ...prev.colorDetails,
        { color: "", anilox: "", volume: "" }
      ],
    }));
  };

  const removeRow = (index: number) => {
    if (form.colorDetails.length === 1) return; // ✅ prevent empty

    const updated = form.colorDetails.filter((_: any, i: number) => i !== index);

    setForm((prev: any) => ({
      ...prev,
      colorDetails: updated,
    }));
  };

  const colorOptions = [
    "Cyan",
    "Magenta",
    "Yellow",
    "Black",
    "White",
    "Orange",
    "Green",
    "Blue",
    "Red",
    "Violet",
    "Gold",
    "Silver"
  ];

  return (
    <div className="space-y-3">

      <div className="bg-gray-700 text-white px-4 py-2 rounded font-semibold">
        COLOR SCHEME DETAIL
      </div>

      {/* ✅ GLOBAL ERROR */}
      {errors?.color && (
        <p className="text-red-500 text-sm">{errors.color}</p>
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Color</th>
            <th className="border p-2">Anilox</th>
            <th className="border p-2">Volume</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {form.colorDetails.map((row: any, index: number) => (
            <tr key={index}>

              {/* COLOR */}
              <td className="border p-2">
                <select
                  value={row.color || ""} // ✅ controlled
                  onChange={(e) =>
                    handleChange(index, "color", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select Color</option>
                  {colorOptions.map((color, i) => (
                    <option key={i} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </td>

              {/* ANILOX */}
              <td className="border p-2">
                <input
                  type="number"
                  step="any"
                  value={row.anilox || ""} // ✅ controlled
                  onChange={(e) =>
                    handleChange(index, "anilox", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                  placeholder="e.g. 500"
                />
              </td>

              {/* VOLUME */}
              <td className="border p-2">
                <input
                  type="number"
                  step="any"
                  value={row.volume || ""} // ✅ controlled
                  onChange={(e) =>
                    handleChange(index, "volume", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                  placeholder="e.g. 3.5"
                />
              </td>

              {/* ACTION */}
              <td className="border p-2 text-center space-x-2">
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 rounded"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 rounded"
                >
                  -
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}