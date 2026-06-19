import { useState } from "react";
import api from "../../api/axios";

const CustomerStatementReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!searchTerm.trim()) return; // Don't search if the input is empty

    setLoading(true);
    setError("");

    try {
      // Adjusted API route to pass the search term as a query parameter or path variable
      const res = await api.get(
        `/reports/customer-statement?search=${encodeURIComponent(searchTerm.trim())}`,
      );

      const reportData = res.data.data;

      if (!reportData || !reportData.loanInfo) {
        setError("No records found for that search term.");
        setData(null);
      } else {
        setData(reportData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch statement. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search Header */}
      <div className="report-header" style={{ marginBottom: "24px" }}>
        <div className="header-title-block">
          <h2>Customer Statement</h2>
          <p>Search by Contract ID, Contract No, or Customer Name</p>
        </div>

        <div className="payment-search-container">
          <input
            type="text"
            placeholder="Search contract, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadData()} // Search on pressing Enter
          />

          <button className="search-btn" onClick={loadData} disabled={loading}>
            Search
          </button>
        </div>
      </div>

      {/* Error / Feedback Message */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {/* Conditional Rendering Blocks */}
      {loading ? (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p>Loading customer statement...</p>
          </div>
        </div>
      ) : (
        /* Main Data Display */
        data &&
        data.loanInfo && (
          <div className="statement-content-wrapper">
            {/* Metadata Display Cards */}
            <div className="info-cards-grid">
              <div className="info-card">
                <h3 className="card-heading">Customer Profile</h3>
                <div className="info-group">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{data.loanInfo.full_name}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Customer Code</span>
                  <span className="info-value value-highlight">
                    {data.loanInfo.customer_code}
                  </span>
                </div>
                <div className="info-group">
                  <span className="info-label">Phone Reference</span>
                  <span className="info-value">{data.loanInfo.phone}</span>
                </div>
              </div>

              <div className="info-card">
                <h3 className="card-heading">Loan Contract Summary</h3>
                <div className="info-group">
                  <span className="info-label">Contract Number</span>
                  <span className="info-value value-highlight">
                    {data.loanInfo.contract_no}
                  </span>
                </div>
                <div className="info-group">
                  <span className="info-label">Product Option</span>
                  <span className="info-value">
                    {data.loanInfo.product_name}
                  </span>
                </div>
                <div className="info-group">
                  <span className="info-label">Principal Amount</span>
                  <span className="info-value">
                    ${Number(data.loanInfo.principal_amount).toLocaleString()}
                  </span>
                </div>
                <div className="info-group">
                  <span className="info-label">Remaining Balance</span>
                  <span className="info-value value-danger">
                    ${Number(data.loanInfo.remaining_balance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Table 1: Payment Schedules */}
            <div className="table-section">
              <h3 className="section-title">Amortization Schedule</h3>
              {data.schedules && data.schedules.length > 0 ? (
                <div className="table-responsive-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Installment No</th>
                        <th>Due Date</th>
                        <th className="text-right">Amount Due</th>
                        <th className="text-right">Amount Paid</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.schedules.map((s, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{s.installment_no}</strong>
                          </td>
                          <td>{new Date(s.due_date).toLocaleDateString()}</td>
                          <td className="text-right">
                            ${Number(s.amount_due).toLocaleString()}
                          </td>
                          <td className="text-right">
                            ${Number(s.amount_paid).toLocaleString()}
                          </td>
                          <td className="text-center">
                            <span
                              className={`payment-status-badge ${s.status}`}
                            >
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty-notice">
                  No schedules generated for this contract.
                </p>
              )}
            </div>

            {/* Table 2: Actual Payment History */}
            <div className="table-section">
              <h3 className="section-title">Payment History Collection</h3>
              {data.payments && data.payments.length > 0 ? (
                <div className="table-responsive-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Receipt No</th>
                        <th>Payment Date</th>
                        <th className="text-right">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.payments.map((p, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{p.receipt_no}</strong>
                          </td>
                          <td>
                            {new Date(p.payment_date).toLocaleDateString()}
                          </td>
                          <td className="text-right value-success">
                            +${Number(p.amount_paid).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty-notice">
                  No transactions logged on this ledger.
                </p>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CustomerStatementReport;
