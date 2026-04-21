export default function TechnicalForm({ form, setForm }: any) {

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      technicalDetails: {
        ...prev.technicalDetails,
        [field]: value,
      },
    }));
  };

  const plateThicknessOptions = [
    "0.66",
    "0.95",
    "1.14",
    "1.70",
    "2.84",
    "4.70"
  ];

  const screenRulingOptions = [
    "#65",
    "#85",
    "#100",
    "#110",
    "#120",
    "#135",
    "#150",
    "#165",
    "#175",
    "#200"
  ];

  const yesNoOptions = ["Yes", "No"];

  const bearerOptions = ["Yes", "No", "Auto Tone"];

  return (
    <div className="space-y-3">

      <div className="bg-gray-700 text-white px-4 py-2 rounded font-semibold text-lg">
        TECHNICAL DETAILS
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Plate Thickness
          </label>
          <select
            className="border rounded px-2 py-2 w-full"
            onChange={(e) => handleChange("plateThickness", e.target.value)}
          >
            <option value="">Select One</option>
            {plateThicknessOptions.map((val, i) => (
              <option key={i} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Screen Ruling (LPI)
          </label>
          <select
            className="border rounded px-2 py-2 w-full"
            onChange={(e) => handleChange("screenRuling", e.target.value)}
          >
            <option value="">Select One</option>
            {screenRulingOptions.map((val, i) => (
              <option key={i} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Sensor Spot
          </label>
          <select
            className="border rounded px-2 py-2 w-full"
            onChange={(e) => handleChange("sensorSpot", e.target.value)}
          >
            <option value="">Select One</option>
            {yesNoOptions.map((val, i) => (
              <option key={i} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Bearer
          </label>
          <select
            className="border rounded px-2 py-2 w-full"
            onChange={(e) => handleChange("bearer", e.target.value)}
          >
            <option value="">Select One</option>
            {bearerOptions.map((val, i) => (
              <option key={i} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Distortion
          </label>
          <select
            className="border rounded px-2 py-2 w-full"
            onChange={(e) => handleChange("distortion", e.target.value)}
          >
            <option value="">Select One</option>
            {yesNoOptions.map((val, i) => (
              <option key={i} value={val}>{val}</option>
            ))}
          </select>
        </div>

      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Special Instruction
        </label>
        <textarea
          className="border rounded px-3 py-2 w-full"
          onChange={(e) => handleChange("specialInstruction", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Old Ref. No.
          </label>
          <input
            className="border rounded px-3 py-2 w-full"
            onChange={(e) => handleChange("oldRefNo", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Old Ref. Date
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            onChange={(e) => handleChange("oldRefDate", e.target.value)}
          />
        </div>

      </div>

    </div>
  );
}