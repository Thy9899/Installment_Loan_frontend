import React, { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  FaUsers,
  FaHandHoldingUsd,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";

import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <p>Loading your dashboard details...</p>
      </div>
    );
  }

  const topCards = [
    {
      title: "Total Amount",
      value: `$${Number(data.totalAmount || 0).toLocaleString()}`,
      description: "Total loan portfolio",
      icon: <FaMoneyBillWave />,
      type: "success",
    },
    {
      title: "Collection Today",
      value: `$${Number(data.collectedToday || 0).toLocaleString()}`,
      description: "Collected today",
      icon: <FaChartLine />,
      type: "primary",
    },
    {
      title: "Outstanding Balance",
      value: `$${Number(data.outstanding || 0).toLocaleString()}`,
      description: "Remaining unpaid balance",
      icon: <FaHandHoldingUsd />,
      type: "warning",
    },
  ];

  const healthCards = [
    {
      title: "Total Customers",
      value: data.totalCustomers || 0,
      description: "Registered customers",
      icon: <FaUsers />,
      type: "primary",
    },
    {
      title: "Active Loans",
      value: data.activeLoans || 0,
      description: "Currently active loans",
      icon: <FaHandHoldingUsd />,
      type: "success",
    },
    {
      title: "Overdue Accounts",
      value: data.overdueAccounts || 0,
      description: "Past due accounts",
      icon: <FaExclamationTriangle />,
      type: "danger",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* HEADER */}

      <div className="dashboard-header">
        <div className="header-title-block">
          <h2>Executive Loan Dashboard</h2>
          <p>
            Overview of capital deployment, installment collections, and
            portfolio performance.
          </p>
        </div>

        <div className="dashboard-badge">● Live Data</div>
      </div>

      {/* TOP STATISTICS */}

      <div className="dashboard-stats">
        {topCards.map((card, index) => (
          <div key={index} className="dashboard-card">
            <div className={`card-icon ${card.type}`}>{card.icon}</div>

            <div className="card-content">
              <div className="card-label">{card.title}</div>

              <div className="card-value">{card.value}</div>

              <div className="card-description">{card.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY SECTION */}

      <div className="summary-layout">
        {/* SYSTEM HEALTH */}

        <div className="health-ledger">
          <div className="section-header">
            <h3>System Health Ledger</h3>

            <p>Current operational metrics</p>
          </div>

          <div className="health-grid">
            {healthCards.map((card, index) => (
              <div key={index} className="dashboard-card">
                <div className={`card-icon ${card.type}`}>{card.icon}</div>

                <div className="card-content">
                  <div className="card-label">{card.title}</div>

                  <div className="card-value">{card.value}</div>

                  <div className="card-description">{card.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RULE PANEL */}

        <div className="standard-rule">
          <h3>Standard Rules</h3>

          <div className="term-card">
            <h4>6 Month Term</h4>
            <p>1.5% Interest / Month</p>
          </div>

          <div className="term-card">
            <h4>12 Month Term</h4>
            <p>2.0% Interest / Month</p>
          </div>

          <div className="term-card">
            <h4>24 Month Term</h4>
            <p>3.0% Interest / Month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
