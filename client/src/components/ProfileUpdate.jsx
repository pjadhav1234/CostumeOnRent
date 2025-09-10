import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfileUpdate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: ""
  });

  // Prefill user data (if stored in localStorage or context)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact || "",
        location: user.location || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT stored after login
      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">✨ Update Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="form-control"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-control"
            />
          </div>

          {/* Contact */}
          <div className="mb-3">
            <label className="form-label fw-bold">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="form-control"
            />
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label fw-bold">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
              className="form-control"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdate;
