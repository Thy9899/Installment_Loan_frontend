import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./LoanCustomer.css";

const LoanCustomer = () => {
  const [loanCustomer, setLoanCustomer] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Let the backend handle the query matching using your optimized MySQL WHERE clauses!
        const res = await api.get(
          `/customers/directory?search=${search}&payment_status=${paymentStatus}&limit=50`,
        );

        if (res.data && Array.isArray(res.data.data)) {
          setLoanCustomer(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching loan customer:", err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce to avoid spamming the backend database while typing
    // const delayDebounceFn = setTimeout(() => {
    //   fetchData();
    // }, 300);

    fetchData();
  }, [search, paymentStatus]);

  return (
    <div className="customer-directory-container">
      {/* Header */}
      <div className="customer-directory-header">
        <div className="header-title-block">
          <h2>Customer Directory</h2>
          <p>Manage registered accounts and trace real-time balance metrics</p>
        </div>

        <div className="payment-loan-selector">
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="status-filter"
          >
            <option value="">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search code, name, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading && (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p>Loading records from core engine...</p>
          </div>
        </div>
      )}

      {!loading && loanCustomer.length === 0 && (
        <div className="empty-state-card">
          <p>No active accounts found matching "{search}"</p>
        </div>
      )}

      {/* Directory Grid */}
      <div className="customer-directory-grid">
        {!loading &&
          loanCustomer.map((c) => (
            <div
              key={`${c.id}-${c.contract_id || "none"}`}
              className="customer-card"
            >
              {/* Top Row Profile Summary */}
              <div className="card-profile-row">
                <div className="customer-avatar">
                  {c.full_name ? c.full_name.charAt(0).toUpperCase() : "U"}
                </div>

                <div
                  className="customer-identity"
                  onClick={() => {
                    if (c.contract_no) {
                      navigate(`/payments-schedule/${c.contract_no}`);
                    } else {
                      alert("This customer has no active contract.");
                    }
                  }}
                  style={{ cursor: c.contract_no ? "pointer" : "default" }}
                >
                  <h3>{c.full_name || "Unknown Customer"}</h3>
                  <span className="customer-code-tag">{c.customer_code}</span>
                </div>

                <div
                  className={`status-badge ${c.contract_status ? c.contract_status.toLowerCase() : "inactive"}`}
                >
                  {c.contract_status ? c.contract_status : "No Contract"}
                </div>

                {/* Payment Badge */}
                <div
                  className={`payment-badge ${c.payment_status?.toLowerCase()}`}
                >
                  {c.payment_status || "Unknown"}
                </div>
              </div>

              <hr className="card-divider" />

              {/* Core Metadata Fields */}
              <div className="customer-contact-details">
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{c.phone || "—"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value-email">{c.email || "—"}</span>
                </div>
              </div>

              {/* Dynamic Active Loan Balance Subsection */}
              {c.contract_no ? (
                <div className="contract-financials-box">
                  <div className="financial-header">
                    <span className="contract-num">{c.contract_no}</span>
                    <span className="term-duration">
                      {c.term_months} Months
                    </span>
                  </div>
                  <div className="financial-data-grid">
                    <div className="data-node">
                      <span className="node-label">Principal</span>
                      <strong className="node-value">
                        ${Number(c.principal_amount).toLocaleString()}
                      </strong>
                    </div>
                    <div className="data-nodeHighlight">
                      <span className="node-label text-alert">
                        Remaining Balance
                      </span>
                      <strong className="node-value text-alert">
                        ${Number(c.remaining_balance).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="contract-empty-box">
                  <p>No active line of credit mapped to profile</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default LoanCustomer;
