import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setMessage("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setMessage("Email is required");
      return false;
    }
    if (!formData.password) {
      setMessage("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const res = await axios.post("http://localhost:5000/api/auth/register", submitData);
      
      setMessage("Registration successful! You can now login.");
      setTimeout(() => navigate("/login"), 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center py-4">
              <h3 className="mb-0">👗 Join CostumeRent</h3>
              <p className="mb-0 opacity-75">Create your account</p>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">👤 Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    className="form-control form-control-lg"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold">📧 Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold">🔒 Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    required
                  />
                  <small className="text-muted">Must be at least 6 characters</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">🔒 Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-control-lg"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {message && (
                <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center`}>
                  {message}
                </div>
              )}

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-success text-decoration-none fw-semibold">
                    Sign In
                  </Link>
                </p>
              </div>

              <hr className="my-4" />

              <div className="text-center small text-muted">
                <p className="mb-1">By creating an account, you agree to our</p>
                <a href="#" className="text-muted">Terms of Service</a> and <a href="#" className="text-muted">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;