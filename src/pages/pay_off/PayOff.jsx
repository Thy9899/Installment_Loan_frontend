import { useState } from "react";
import api from "../../api/axios";
import Receipt from "../receipt/Receipt";
import "./PayOff.css";

const PayOff = () => {
  const [search, setSearch] = useState("");
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const findContract = async () => {
    if (!search.trim()) return alert("Enter Contract Number");
    try {
      setLoading(true);
      const res = await api.get(`/loan-contracts`);
      const found = res.data.data.find(
        (l) => l.contract_no?.toLowerCase() === search.trim().toLowerCase(),
      );

      if (!found) {
        alert("Active contract structure records not found.");
        return;
      }

      setLoan(found);
      setReceiptData(null);
    } catch (err) {
      console.error(err);
      alert("Error finding matching contract records.");
    } finally {
      setLoading(false);
    }
  };

  const executingFullPayoff = async () => {
    if (!loan) return;
    if (Number(loan.remaining_balance) <= 0) {
      alert("This loan contract balance is already settled.");
      return;
    }

    if (
      !window.confirm(
        `Confirm full ledger payoff for contract ${loan.contract_no} in the amount of $${Number(loan.remaining_balance).toLocaleString()}?`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/payments", {
        contract_id: Number(loan.id),
        amount: Number(loan.remaining_balance),
        payment_method: "cash",
        is_payoff: true,
      });

      alert("Contract Settled and Paid Off Successfully!");

      const returnedData = res.data?.data;

      // Extract tracking details accurately from server transaction records
      setReceiptData({
        receiptNo:
          returnedData?.receipt_no ||
          `POF-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString(),
        contractNo: loan.contract_no,
        type: "FULL LEDGER PAY-OFF",
        amountPaid: Number(loan.remaining_balance),
      });

      setLoan(null);
      setSearch("");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Error posting pay-off transaction ledger adjustment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page-container">
      {/* Header Panel */}
      <div className="payment-page-header no-print">
        <div className="header-title-block">
          <h2>Contract Account Pay-Off</h2>
          <p>Settle entire remaining loan balances and close target accounts</p>
        </div>

        <div className="payment-search-container">
          <input
            type="text"
            placeholder="Search Contract..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                findContract();
              }
            }}
          />

          <button
            className="search-btn"
            onClick={findContract}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load Contract"}
          </button>
        </div>
      </div>

      {/* Loading Block */}
      {loading && (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p>Processing request metrics...</p>
          </div>
        </div>
      )}

      {/* Contract Profile Metadata Card */}
      {!loading && loan && (
        <div className="summary-card">
          <div>
            <span>Contract</span>
            <h3>{loan.contract_no}</h3>
          </div>

          <div>
            <span>Total Financed</span>
            <h3>${Number(loan.total_amount).toLocaleString()}</h3>
          </div>

          <div>
            <span>Remaining Balance</span>
            <h3>${Number(loan.remaining_balance).toLocaleString()}</h3>
          </div>

          <div>
            <span>Status</span>
            <h3>{loan.status}</h3>
          </div>
        </div>
      )}

      {/* Payoff Posting Area */}
      {!loading && (loan || receiptData) && (
        <div className="payment-card-layout no-print">
          {loan && (
            <div className="payoff-details">
              <p>
                You are performing a settlement action. This transaction
                automatically pays off all remaining scheduled installments.
              </p>
              <button
                className="payoff-btn"
                onClick={executingFullPayoff}
                disabled={loading}
              >
                Confirm & Settle Account Closeout ($
                {Number(loan.remaining_balance).toLocaleString()})
              </button>
            </div>
          )}

          {receiptData && (
            <button
              className="print-trigger-btn"
              style={{ width: "100%", marginTop: loan ? "15px" : "0px" }}
              onClick={() => window.print()}
            >
              Print Closeout Receipt
            </button>
          )}
        </div>
      )}

      {/* Printed Component View */}
      {!loading && receiptData && <Receipt data={receiptData} />}
    </div>
  );
};

export default PayOff;
