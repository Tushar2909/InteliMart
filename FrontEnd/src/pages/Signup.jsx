import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
    gender: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/signup/customer", {
        user: form
      });

      alert("Account created successfully. Please login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={submit}
        className="bg-white p-10 rounded-xl shadow w-[420px]"
      >

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Customer Signup
        </h1>

        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="number"
          placeholder="Phone"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          className="border p-2 w-full mb-6"
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
          <option value="OTHER">OTHER</option>
        </select>

        <button className="bg-black text-white w-full py-2 rounded hover:bg-gray-800">
          Create Account
        </button>

      </form>
    </div>
  );
}
