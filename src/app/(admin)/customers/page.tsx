"use client";

import { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
} from "@/services/customerService";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  const [errors, setErrors] = useState<any>({});

  const fetchCustomers = async () => {
    const res = await getCustomers();
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔹 Validation function
  const validate = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Minimum 3 characters required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // remove error on typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createCustomer(formData);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        address: "",
      });

      setErrors({});
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Customer Management
      </h1>

      {/* FORM */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Add Customer</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Full Name */}
          <div>
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Company */}
          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
          />

          {/* Address */}
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border rounded-md p-2 col-span-1 md:col-span-2 w-full focus:ring-2 focus:ring-blue-400"
          />

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Customer List</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Company</th>
                <th className="p-3 border">Address</th>
              </tr>
            </thead>

            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{c.fullName}</td>
                    <td className="p-3 border">{c.email}</td>
                    <td className="p-3 border">{c.phone}</td>
                    <td className="p-3 border">{c.company}</td>
                    <td className="p-3 border">{c.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}