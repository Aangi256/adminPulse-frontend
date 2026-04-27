interface Props {
  form: any;
  setForm: any;
  errors?: any;
  touched?: any;
  setTouched?: any;
}

export default function ContactForm({
  form,
  setForm,
  errors = {},
  touched = {},
  setTouched = () => {},
}: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // ✅ Must spread prev AND prev.contactDetails
    setForm((prev: any) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [name]: value,
      },
    }));

    setTouched((prev: any) => ({ ...prev, [name]: true }));
  };

  return (
    <div className="bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Contact Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Prepared By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="preparedBy"
            value={form?.contactDetails?.preparedBy || ""}
            onChange={handleChange}
            placeholder="Enter name"
            className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
              touched.preparedBy && errors.preparedBy ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.preparedBy && errors.preparedBy && (
            <p className="text-red-500 text-xs mt-1">{errors.preparedBy}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="mobile"
            value={form?.contactDetails?.mobile || ""}
            onChange={handleChange}
            placeholder="Enter 10 digit mobile"
            maxLength={10}
            className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
              touched.mobile && errors.mobile ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.mobile && errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form?.contactDetails?.email || ""}
            onChange={handleChange}
            placeholder="Enter email (optional)"
            className={`w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
              touched.email && errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

      </div>
    </div>
  );
}