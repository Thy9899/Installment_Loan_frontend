import { useEffect, useState, useCallback } from "react";
import {
  FaSmile,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";
import api from "../../api/axios";
import "./Reports.css";

const DailyCollectionReport = () => {
  // Initialize date directly with today's local date string (avoids a double-render flash)
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
  });

  // Wrapped in useCallback to prevent unneeded function recreation
  const loadData = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/reports/daily-collection?date=${date}`);

      // Handle instances where API returns nested data arrays
      const responseData = res.data?.data || [];
      setRows(responseData);

      setSummary({
        totalPayments: res.data?.totalPayments ?? responseData.length,
        totalAmount: res.data?.totalAmount ?? 0,
      });
    } catch (err) {
      console.error("Error loading collection report:", err);
      setError("Failed to load collection data for this date.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setDate(today);
  }, []);

  // Synchronize query execution smoothly when date changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if (loading) {
  //   return (
  //     <div className="loader-wrapper">
  //       <div className="spinner"></div>
  //       <p>Loading your dashboard details...</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* Header Block */}
      <div className="report-header">
        <div className="header-title-block">
          <h2>Daily Collection Report</h2>
          <p>text decription</p>
        </div>

        <div className="rrr">
          <input
            className="report-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Error Feedback Display */}
      {error && (
        <p
          style={{ color: "#ef4444", fontWeight: "600", marginBottom: "16px" }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p>Loading daily collection...</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="report-summary-grid">
            {/* Total Payments */}
            <div className="report-card">
              <div className="report-icon icon-blue">
                <FaChartLine />
              </div>
              <div className="report-body">
                <div className="report-label">Total Payments</div>
                <div className="report-value">
                  {Number(summary.totalPayments).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="report-card">
              <div className="report-icon icon-success">
                <FaMoneyBillWave />
              </div>
              <div className="report-body">
                <div className="report-label">Total Amount</div>
                <div className="report-value">
                  $
                  {Number(summary.totalAmount).toLocaleString(undefined, {
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
                <th>Receipt</th>
                <th>Customer</th>
                <th>Contract</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id || row.receipt_no}>
                  <td>{row.receipt_no}</td>
                  <td>{row.full_name}</td>
                  <td>{row.contract_no}</td>
                  {/* Clean inline currency display styling format */}
                  <td>
                    $
                    {Number(row.amount_paid).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{new Date(row.payment_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DailyCollectionReport;
