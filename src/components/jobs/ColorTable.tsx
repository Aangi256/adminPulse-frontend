export default function ColorTable({ form, setForm }: any) {

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...form.colorDetails];
    updated[index][field] = value;
    setForm({ ...form, colorDetails: updated });
  };

  const addRow = () => {
    setForm({
      ...form,
      colorDetails: [
        ...form.colorDetails,
        { color: "", anilox: "", volume: "" }
      ],
    });
  };

  const removeRow = (index: number) => {
    const updated = form.colorDetails.filter((_: any, i: number) => i !== index);
    setForm({ ...form, colorDetails: updated });
  };

  // 🎨 COLOR OPTIONS
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

      {/* HEADER */}
      <div className="bg-gray-700 text-white px-4 py-2 rounded font-semibold">
        COLOR SCHEME DETAIL
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Color</th>
            <th className="border p-2">Anilox (LPI/LPCM)</th>
            <th className="border p-2">Volume</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {form.colorDetails.map((row: any, index: number) => (
            <tr key={index}>

              {/* COLOR DROPDOWN */}
              <td className="border p-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600"></label>

                  <select
                    value={row.color}
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
                </div>
              </td>

              {/* ANILOX (NEGATIVE → POSITIVE NUMBER) */}
              <td className="border p-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={row.anilox}
                    onChange={(e) =>
                      handleChange(index, "anilox", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="e.g. -1 or 500"
                  />
                </div>
              </td>

              {/* VOLUME (NEGATIVE → POSITIVE NUMBER) */}
              <td className="border p-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={row.volume}
                    onChange={(e) =>
                      handleChange(index, "volume", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="e.g. -2.5 or 3.5"
                  />
                </div>
              </td>

              {/* ACTION BUTTONS */}
              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={addRow}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 rounded"
                >
                  +
                </button>

                <button
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