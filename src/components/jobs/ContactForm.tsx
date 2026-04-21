export default function ContactForm({ form, setForm, errors }: any) {

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-3">

      <div className="bg-gray-700 text-white px-4 py-2 rounded font-semibold">
        CONTACT DETAILS
      </div>

      <div className="grid grid-cols-3 gap-4">

        <div>
          <label className="text-sm font-semibold">Prepared By *</label>
          <input className="border p-2 w-full"
            onChange={(e) => handleChange("preparedBy", e.target.value)}
          />
          {errors?.preparedBy && <p className="text-red-500 text-xs">{errors.preparedBy}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold">Mobile *</label>
          <input className="border p-2 w-full"
            onChange={(e) => handleChange("mobile", e.target.value)}
          />
          {errors?.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold">Email</label>
          <input className="border p-2 w-full"
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors?.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

      </div>

    </div>
  );
}