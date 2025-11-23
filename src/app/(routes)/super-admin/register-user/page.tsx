"use client";

import { Outlet } from "@/models/outlet";
import { User } from "@/models/user";
import { register } from "@/services/authentication/auth.service";
import { getAllOutlets } from "@/services/firestore/outlet-collection";
import { saveUser } from "@/services/firestore/user-collection";
import { Role } from "@/types/role";
import { useEffect, useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  outlet: string;
}

export default function RegisterUserForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "pilih",
    outlet: "pilih",
  });

  const [errors, setErrors] = useState<{ role?: string; outlet?: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined }); // clear error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // clear previous message
    setIsError(false);

    const newErrors: { role?: string; outlet?: string } = {};
    if (form.role === "pilih") newErrors.role = "Role harus dipilih!";
    if (form.outlet === "pilih") newErrors.outlet = "Outlet harus dipilih!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const outlet = outlets.find((o) => o.id === form.outlet);
      const userId = await register(form.email, form.password);

      const newUser = new User({
        id: userId,
        name: form.name,
        email: form.email,
        role: form.role as Role,
        outlet: outlet!,
      });

      await saveUser(newUser);

      /** 🔥 Reset Form After Success */
      setForm({
        name: "",
        email: "",
        password: "",
        role: "pilih",
        outlet: "pilih",
      });

      setMessage("User berhasil ditambahkan!");
      setIsError(false);
    } catch (err) {
      console.error("Error: ", err);
      setMessage("Pendaftaran gagal. Coba lagi.");
      setIsError(true);
    }

    setLoading(false);
  };

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const allOutlets = await getAllOutlets();
        setOutlets(allOutlets);
      } catch (err) {
        console.error("Failed to fetch outlets:", err);
      }
    };
    fetchOutlets();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-5"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        Register User Form
      </h2>

      {/* 🌟 Success / Error Message */}
      {message && (
        <p
          className={`text-center px-3 py-2 rounded-lg text-sm ${
            isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Name */}
      <div>
        <label className="block text-gray-600 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-600 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="email@example.com"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-600 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter password"
          required
        />
      </div>

      {/* Dropdown 1 - Role */}
      <div>
        <label className="block text-gray-600 mb-1">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
            ${errors.role ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
        >
          <option value="pilih">Pilih Role</option>
          {Object.values(Role)
            .filter((role) => role !== Role.SuperAdmin)
            .map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
        </select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>

      {/* Dropdown 2 - Outlet */}
      <div>
        <label className="block text-gray-600 mb-1">Outlet</label>
        <select
          name="outlet"
          value={form.outlet}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
            ${errors.outlet ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
        >
          <option value="pilih">Pilih Outlet</option>
          {outlets.map((outlet) => (
            <option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </option>
          ))}
        </select>
        {errors.outlet && (
          <p className="text-red-500 text-sm mt-1">{errors.outlet}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white py-2 rounded-lg transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
