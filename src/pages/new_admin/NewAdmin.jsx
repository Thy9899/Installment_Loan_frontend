import React, { useState } from "react";
import api from "../../api/axios";
import "./NewAdmin.css";

const NewAdmin = () => {
  // State variables for form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  // UI feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle Form Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/auth/register",
        { username, email, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: response.data.message || "Admin registered successfully!",
        });

        // Clear form fields on successful registration
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("admin");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to register admin account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("admin");
  };

  return (
    <div className="new-admin-wrapper">
      <div className="new-admin-container">
        <header className="admin-header">
          <div className="header-title-block">
            <h2>Create New Account</h2>
            <p>
              Register a new administrative user with system access privileges.
            </p>
          </div>
        </header>

        {/* Dynamic Success or Error Alert Message */}
        {message.text && (
          <div className={`alert-message ${message.type}`}>
            <span className="alert-message-icon">
              {message.type === "success" ? "✓" : "⚠"}
            </span>
            <p>{message.text}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                autoComplete="off"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="e.g., jack@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Assign Role</label>
              <div className="select-wrapper">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="loan_officer">Loan Officer</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>
            </div>
          </div>

          <div className="new-customer-button-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              // disabled={isUpdating}
            >
              Cancel
            </button>

            <button type="submit" className="btn-save" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Registering Account...</span>
                </>
              ) : (
                "Register Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAdmin;
