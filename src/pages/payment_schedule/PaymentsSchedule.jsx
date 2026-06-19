import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PaymentsSchedule.css";

const PaymentsSchedule = () => {
  const { contractNo } = useParams(); // Grab contractNo from the URL route
  const navigate = useNavigate();

  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  // React to changes in both loans and contractNo route params
  useEffect(() => {
    if (contractNo && loans.length > 0) {
      setSearch(contractNo);
      triggerAutoSearch(contractNo, loans);
    }
  }, [contractNo, loans]);

  const loadLoans = async () => {
    try {
      const res = await api.get("/loan-contracts");

      setLoans(res.data.data);
      setFilteredLoans(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper method to search programmatically on mount/navigation
  const triggerAutoSearch = async (contractNumber, loanList) => {
    const loan = loanList.find(
      (item) =>
        item.contract_no?.toLowerCase() === contractNumber.toLowerCase(),
    );
    if (loan) {
      await loadSchedules(loan.id);
    }
  };

  const handleSearch = async () => {
    try {
      if (!search.trim()) {
        alert("Please enter contract number");
        return;
      }

      const loan = loans.find(
        (item) => item.contract_no?.toLowerCase() === search.toLowerCase(),
      );

      if (!loan) {
        alert("Contract not found");
        return;
      }

      await loadSchedules(loan.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setSearch("");
    setFilteredLoans(loans);
  };

  const loadSchedules = async (loanId) => {
    try {
      setLoading(true);

      const res = await api.get(`/loan-contracts/schedule/${loanId}`);

      setSelectedLoan(res.data.data.contract);
      setSchedules(res.data.data.schedules);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page-container">
      {/* Header */}
      <div className="payment-page-header">
        <div className="header-title-block">
          <h2>Loan Repayment Schedule</h2>
          <p>Track installments and balances</p>
        </div>

        <div className="payment-loan-selector">
          <select onChange={(e) => loadSchedules(e.target.value)}>
            <option value="">Select Loan Contract</option>

            {filteredLoans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.contract_no}
              </option>
            ))}
          </select>
        </div>

        <div className="payment-search-container">
          <input
            type="text"
            placeholder="Search Contract..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>

          {/* <button className="reset-btn" onClick={handleReset}>
            Reset
          </button> */}
        </div>
      </div>

      {/* Summary */}
      {selectedLoan && (
        <div className="summary-card">
          <div>
            <span>Contract</span>
            <h3>{selectedLoan.contract_no}</h3>
          </div>

          <div>
            <span>Total Loan</span>
            <h3>${Number(selectedLoan.total_amount).toLocaleString()}</h3>
          </div>

          <div>
            <span>Remaining</span>
            <h3>${Number(selectedLoan.remaining_balance).toLocaleString()}</h3>
          </div>

          <div>
            <span>Status</span>
            <h3>{selectedLoan.status}</h3>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      {loading ? (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p>Loading schedules...</p>
          </div>
        </div>
      ) : (
        schedules.length > 0 && (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Due Date</th>
                <th>Amount Due</th>
                <th>Amount Paid</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((schedule) => {
                const remaining =
                  Number(schedule.amount_due) - Number(schedule.amount_paid);

                return (
                  <tr key={schedule.id}>
                    <td>{schedule.installment_no}</td>

                    <td>{new Date(schedule.due_date).toLocaleDateString()}</td>

                    <td>${Number(schedule.amount_due).toFixed(2)}</td>

                    <td>${Number(schedule.amount_paid).toFixed(2)}</td>

                    <td>${remaining.toFixed(2)}</td>

                    <td>
                      <span
                        className={`payment-status-badge ${schedule.status}`}
                      >
                        {schedule.status}
                      </span>
                    </td>

                    <td>
                      {schedule.status !== "paid" && (
                        <button
                          className="pay-btn"
                          onClick={() =>
                            navigate(
                              `/payments?contract=${selectedLoan.contract_no}&installment=${schedule.installment_no}&amount=${remaining}`,
                            )
                          }
                        >
                          Go to Pay
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default PaymentsSchedule;
