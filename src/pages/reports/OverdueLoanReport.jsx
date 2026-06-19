import { useEffect, useState } from "react";
import api from "../../api/axios";

import { FaExclamationTriangle, FaSmile } from "react-icons/fa";

const OverdueLoanReport = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    totalAccounts: 0,
    totalOverdueAmount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/reports/overdue-loans");
      const fetchedRows = res.data?.data || [];
      setRows(fetchedRows);

      setSummary({
        totalAccounts: res.data?.totalAccounts ?? fetchedRows.length,
        totalOverdueAmount: res.data?.totalOverdueAmount ?? 0,
      });
    } catch (err) {
      console.error("Error loading overdue entries:", err);
      setError(
        "Failed to fetch late accounts record tracking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Client-side instant filter processing
  const filteredRows = rows.filter((row) => {
    const term = search.toLowerCase().trim();
    return (
      row.contract_no?.toLowerCase().includes(term) ||
      row.full_name?.toLowerCase().includes(term) ||
      row.customer_code?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="report-header">
        <div className="header-title-block">
          <h2>Overdue Loan Report</h2>
          <p>text decription</p>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search contract or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Error Notices */}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p className="empty-notice">Loading overdue loan...</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="report-summary-grid">
            {/* Total Accounts */}
            <div className="report-card">
              <div className="report-icon icon-blue">
                <FaSmile />
              </div>
              <div className="report-body">
                <div className="report-label">Total Accounts</div>
                <div className="report-value">
                  {summary?.totalAccounts || 0}
                </div>
              </div>
            </div>

            {/* Total Overdue */}
            <div className="report-card">
              <div className="report-icon icon-danger">
                <FaExclamationTriangle />
              </div>
              <div className="report-body">
                <div className="report-label">Total Overdue</div>
                <div className="report-value">
                  ${Number(summary?.totalOverdueAmount || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Installment</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th>Amount Due</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.contract_no}</td>

                  <td>{row.full_name}</td>

                  <td>{row.phone}</td>

                  <td>#{row.installment_no}</td>

                  <td>{new Date(row.due_date).toLocaleDateString()}</td>

                  <td>{row.days_overdue}</td>

                  <td>${row.amount_due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OverdueLoanReport;
