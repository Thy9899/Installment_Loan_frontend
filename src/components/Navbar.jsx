import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import api from "../api/axios";
import "./Navbar.css";

const Navbar = () => {
  const [systemInfo, setSystemInfo] = useState(null);

  useEffect(() => {
    fetchSystemDate();
  }, []);

  const fetchSystemDate = async () => {
    try {
      const res = await api.get("/cob/date");

      setSystemInfo(res.data.data);
    } catch (error) {
      console.error("System Date Error:", error);
    }
  };

  const formatBusinessDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>Smart Loan System</h2>
      </div>

      <div className="navbar-right">
        <div className="system-card">
          <div className="system-icon">
            <FaCalendarAlt />
          </div>

          <div className="system-content">
            <span>ACTIVE BUSINESS DATE</span>

            <strong>{formatBusinessDate(systemInfo?.businessDate)}</strong>
          </div>

          <div
            className={`system-status ${
              systemInfo?.cobStatus === "OPEN" ? "active" : "closed"
            }`}
          >
            <FaCheckCircle />

            {systemInfo?.cobStatus || "Loading"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
