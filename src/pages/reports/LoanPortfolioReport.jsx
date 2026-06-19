import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Reports.css";

const LoanPortfolioReport = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/reports/loan-portfolio");
      setRows(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching loan portfolio:", err);
      setError("Failed to load portfolio data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Modern Client-side Filter: Dynamically searches multiple columns instantly on keystroke
  const filteredRows = rows.filter((row) => {
    const term = search.toLowerCase();
    return (
      row.contract_no?.toLowerCase().includes(term) ||
      row.full_name?.toLowerCase().includes(term) ||
      row.product_name?.toLowerCase().includes(term) ||
      row.customer_code?.toLowerCase().includes(term)
    );
  });

  // if (loading) {
  //   return (
  //     <div className="loader-wrapper">
  //       <div className="spinner"></div>
  //       <p>Loading your dashboard details...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="report-container">
      {/* Header Core Panel */}
      <div className="report-header">
        <div className="header-title-block">
          <h2>Loan Portfolio Report</h2>
          <p className="header-subtitle">
            Overview of active asset disbursements and outstanding contract
            exposure
          </p>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search contract, customer, or product..."
            value={search}
            onChange={(e) =>
              setSearch ? setSearch(e.target.value) : setSearch(e.target.value)
            }
            className="search-input"
          />
        </div>
      </div>

      {/* Alert Notifications */}
      {error && <div className="error-message">{error}</div>}

      {/* Main Ledger Content Table */}
      {loading ? (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p className="empty-notice">Aggregating portfolio ledgers...</p>
          </div>
        </div>
      ) : filteredRows.length > 0 ? (
        <div className="table-responsive-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Contract No</th>
                <th>Customer Code</th>
                <th>Customer Name</th>
                <th>Product Type</th>
                <th className="text-right">Principal</th>
                <th className="text-right">Total Owed</th>
                <th className="text-right">Remaining Balance</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.contract_no}</td>
                  <td>{row.customer_code}</td>
                  <td>{row.full_name}</td>
                  {/* <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{row.full_name}</span>
                      <small style={{ color: "#64748b", fontSize: "11px" }}>
                        {row.customer_code}
                      </small>
                    </div>
                  </td> */}
                  <td>{row.product_name}</td>
                  <td className="text-right">
                    ${Number(row.principal_amount || 0).toLocaleString()}
                  </td>
                  <td className="text-right">
                    ${Number(row.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="text-right value-danger">
                    ${Number(row.remaining_balance || 0).toLocaleString()}
                  </td>
                  <td className="text-center">
                    <span className={`report-status-badge ${row.status}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-notice">
          {search
            ? "No records match your search criteria."
            : "No loan portfolio accounts found."}
        </div>
      )}
    </div>
  );
};

export default LoanPortfolioReport;
