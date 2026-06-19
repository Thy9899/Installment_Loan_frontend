import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
          setUsername(response.data.user.username || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: "error", text: "Failed to load profile data." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle Update Form Submission or Toggling Edit Mode
  const handleFormAction = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // If we are NOT in editing mode, clicking the button just turns editing mode ON
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // UX validation: Don't hit backend if nothing actually changed
    if (username === user?.username && !password) {
      setMessage({
        type: "error",
        text: "No changes detected. Update your username or password first.",
      });
      setIsEditing(false); // Turn off editing mode if they didn't change anything
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      const updateData = {};

      if (username && username !== user.username)
        updateData.username = username;
      if (password) updateData.password = password;

      const response = await api.put("/auth/update", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setUser(response.data.user);
        setPassword("");
        setIsEditing(false); // Turn off edit mode after successful save
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "An error occurred while updating.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username || "");
    setPassword("");
    setMessage({ type: "", text: "" });
    setIsEditing(false);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <header className="profile-header">
          <div className="header-title-block">
            <h2>Profile Management</h2>
            <p>
              View your system information and update credentials dynamically.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="directory-loader">
            <div className="loading-flex-container">
              <div className="row-spinner"></div>
              <p className="empty-notice">Loading profile details...</p>
            </div>
          </div>
        ) : (
          //  Dynamic Success or Error Alert Message
          message.text && (
            <div className={`alert-message ${message.type}`}>
              <span className="alert-message-icon">
                {message.type === "success" ? "✓" : "⚠"}
              </span>
              <p>{message.text}</p>
            </div>
          )
        )}

        {user && (
          <div className="profile-content">
            <section className="info-section">
              <h3>Account Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Username</span>
                  <span className="info-value">{user.username}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">System Role</span>
                  <span className="role-tag">{user.role}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span
                    className={`status-tag ${user.status?.toLowerCase() || "active"}`}
                  >
                    {user.status || "Active"}
                  </span>
                </div>
              </div>
            </section>

            <hr className="profile-divider" />

            {/* Changed onSubmit to handle either editing entry OR saving */}
            <form onSubmit={handleFormAction} className="edit-profile-form">
              <h3>Update Credentials</h3>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  required
                  disabled={!isEditing || isUpdating} // Disabled if NOT editing OR if actively updating
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isEditing
                      ? "Leave blank to retain current password"
                      : "••••••••"
                  }
                  disabled={!isEditing || isUpdating} // Disabled if NOT editing OR if actively updating
                />
              </div>
              <div className="new-customer-button-group">
                {/* Dynamic Button UI */}
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn-save ${!isEditing ? "edit-mode-btn" : ""}`}
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? "Saving..."
                    : isEditing
                      ? "Update Profile"
                      : "Edit Profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
