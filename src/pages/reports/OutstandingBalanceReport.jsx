import { useEffect, useState } from "react";
import api from "../../api/axios";

import { FaHandHoldingUsd, FaCheck } from "react-icons/fa";

const OutstandingBalanceReport = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    totalLoans: 0,
    totalOutstanding: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/outstanding-balances");

      setRows(res.data.data);

      setSummary({
        totalLoans: res.data.totalLoans,
        totalOutstanding: res.data.totalOutstanding,
      });
    } catch (err) {
      console.error("Error loading outstanding entries:", err);
      setError(
        "Failed to fetch late accounts record tracking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="report-header">
        <div className="header-title-block">
          <h2>Outstanding Balance Report</h2>
          <p>text description</p>
        </div>
      </div>

      {loading ? (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p className="empty-notice">Loading loan outstanding balance...</p>
          </div>
        </div>
      ) : (
        <div>
          {/* Summary Metrics Cards Grid */}
          <div className="report-summary-grid">
            {/* Total Payments */}
            <div className="report-card">
              <div className="report-icon icon-success">
                <FaCheck />
              </div>
              <div className="report-body">
                <div className="report-label">Active Loans</div>
                <div className="report-value">
                  {Number(summary.totalLoans).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="report-card">
              <div className="report-icon icon-warning">
                <FaHandHoldingUsd />
              </div>
              <div className="report-body">
                <div className="report-label">Total Outstanding</div>
                <div className="report-value">
                  $
                  {Number(summary.totalOutstanding).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Contract No</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Principal</th>
                <th>Total Loan</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.contract_no}</td>

                  <td>{row.full_name}</td>

                  <td>{row.phone}</td>

                  <td>{row.product_name}</td>

                  <td>${Number(row.principal_amount).toLocaleString()}</td>

                  <td>${Number(row.total_amount).toLocaleString()}</td>

                  <td>${Number(row.remaining_balance).toLocaleString()}</td>

                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OutstandingBalanceReport;
