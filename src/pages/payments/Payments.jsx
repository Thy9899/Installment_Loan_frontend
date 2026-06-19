import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import "./Payments.css";
import Receipt from "../receipt/Receipt";

const Payments = () => {
  const [searchParams] = useSearchParams();
  const [contractId, setContractId] = useState(""); // Internal DB primary key
  const [contractNo, setContractNo] = useState("");
  const [installmentNo, setInstallmentNo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle URL route params navigate redirection from PaymentsSchedule component
  useEffect(() => {
    if (searchParams.get("contract")) {
      const targetNo = searchParams.get("contract");
      setContractNo(targetNo);
      setSearchQuery(targetNo);
    }
    if (searchParams.get("installment")) {
      setInstallmentNo(searchParams.get("installment"));
    }
    if (searchParams.get("amount")) {
      setAmount(searchParams.get("amount"));
    }
  }, [searchParams]);

  // Handle auto-fetching DB ID if route params redirected the user here
  useEffect(() => {
    if (contractNo && !contractId) {
      resolveContractIdAndDefaultDue(contractNo, true);
    }
  }, [contractNo]);

  // Helper logic to find contract row details & dynamic monthly amount due
  const resolveContractIdAndDefaultDue = async (
    targetContractNo,
    preservedFromSchedulePage = false,
  ) => {
    try {
      setLoading(true);
      const res = await api.get(`/loan-contracts`);
      const loan = res.data.data.find(
        (item) =>
          item.contract_no?.toLowerCase() === targetContractNo.toLowerCase(),
      );

      if (!loan) {
        alert("Contract asset records not found.");
        return;
      }

      setSelectedLoan(loan);
      setContractId(loan.id);
      setContractNo(loan.contract_no);
      setReceiptData(null);

      // FIX: If arriving from "Go to Pay", use parameters. If searched manually, fetch monthly due.
      if (preservedFromSchedulePage && searchParams.get("amount")) {
        setAmount(searchParams.get("amount"));
      } else {
        // Fetch schedule to discover the true single oldest monthly due balance
        const schedRes = await api.get(`/loan-contracts/schedule/${loan.id}`);
        const activeSchedules = schedRes.data.data.schedules || [];
        const currentMilestone = activeSchedules.find(
          (s) => s.status !== "paid",
        );

        if (currentMilestone) {
          const dynamicMonthlyDue =
            Number(currentMilestone.amount_due) -
            Number(currentMilestone.amount_paid);
          setAmount(dynamicMonthlyDue.toFixed(2));
          setInstallmentNo(currentMilestone.installment_no);
        } else {
          setAmount(loan.remaining_balance || "0.00");
          setInstallmentNo("");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error resolving contract monthly schedule allocations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a contract number or receipt number to search.");
      return;
    }

    if (
      searchQuery.toUpperCase().startsWith("REC-") ||
      searchQuery.toUpperCase().startsWith("POF-")
    ) {
      try {
        setLoading(true);
        const res = await api.get(`/payments/receipt/${searchQuery.trim()}`);
        const payload = res.data.data;

        setReceiptData({
          receiptNo: payload.receipt_no,
          date: new Date(payload.created_at || payload.date).toLocaleString(),
          contractNo: payload.contract_no || payload.contract?.contract_no,
          type: payload.is_payoff
            ? "FULL LEDGER PAY-OFF"
            : `Installment #${payload.installment_no || "N/A"}`,
          amountPaid: Number(payload.amount),
        });

        setContractId("");
        setContractNo("");
        setInstallmentNo("");
        setAmount("");
        setSelectedLoan(null);
        alert("Found historical transaction receipt!");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Receipt lookup failed.");
      } finally {
        setLoading(false);
      }
    } else {
      // Normal contract code search: trigger monthly calculations engine
      await resolveContractIdAndDefaultDue(searchQuery.trim(), false);
    }
  };

  // Central payment transaction processor
  const processTransaction = async (isPayoffSubmission = false) => {
    if (!contractId)
      return alert("Please load a valid active loan contract first.");

    const targetAmount = isPayoffSubmission
      ? Number(selectedLoan.remaining_balance)
      : Number(amount);
    if (targetAmount <= 0)
      return alert("Processed transaction amount must be greater than 0.");

    try {
      setLoading(true);
      const res = await api.post("/payments", {
        contract_id: Number(contractId),
        installment_no: isPayoffSubmission
          ? null
          : installmentNo
            ? Number(installmentNo)
            : null,
        amount: targetAmount,
        payment_method: "cash",
        is_payoff: isPayoffSubmission, // Pass payoff flag down to new backend engine block
      });

      alert(
        isPayoffSubmission
          ? "Loan Account Fully Paid Off!"
          : "Payment Successfully Processed!",
      );

      const returnedData = res.data?.data;

      setReceiptData({
        receiptNo:
          returnedData?.receipt_no ||
          `REC-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString(),
        contractNo: contractNo,
        type: isPayoffSubmission
          ? "FULL LEDGER PAY-OFF"
          : `Installment #${returnedData?.installment_no || installmentNo || "N/A"}`,
        amountPaid: targetAmount,
      });

      // Clear UI Workspace States
      setSelectedLoan(null);
      setContractId("");
      setContractNo("");
      setInstallmentNo("");
      setAmount("");
      setSearchQuery("");
    } catch (err) {
      alert(err.response?.data?.message || "Transaction Submission Denied.");
    } finally {
      setLoading(false);
    }
  };

  const handleStandardPaymentSubmission = (e) => {
    e.preventDefault();
    processTransaction(false);
  };

  return (
    <div className="payment-page-container">
      <div className="payment-page-header no-print">
        <div className="header-title-block">
          <h2>Process Installment Payment</h2>
          <p>Track installments, balances, or search past receipts</p>
        </div>

        <div className="payment-search-container">
          <input
            type="text"
            placeholder="Search Contract or Receipt No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="directory-loader">
          <div className="loading-flex-container">
            <div className="row-spinner"></div>
            <p>Processing payload details...</p>
          </div>
        </div>
      )}

      {!loading && selectedLoan && (
        <div className="summary-card">
          <div>
            <span>Contract</span>
            <h3>{selectedLoan.contract_no}</h3>
          </div>
          <div>
            <span>Customer Details</span>
            <h3>{selectedLoan.full_name || "Active Client"}</h3>
          </div>
          <div>
            <span>Total Financed</span>
            <h3>${Number(selectedLoan.total_amount).toLocaleString()}</h3>
          </div>
          <div>
            <span>Remaining Ledger</span>
            <h3>${Number(selectedLoan.remaining_balance).toLocaleString()}</h3>
          </div>
        </div>
      )}

      {!loading && contractId && (
        <div className="payment-card-layout no-print">
          <form onSubmit={handleStandardPaymentSubmission}>
            <div className="input-group">
              <label>Loaded Contract Code Reference</label>
              <input type="text" value={contractNo} disabled required />
            </div>
            <div className="input-group">
              <label>Installment No Target</label>
              <input
                type="number"
                value={installmentNo}
                placeholder="Auto-find matching open tier"
                onChange={(e) => setInstallmentNo(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Payment Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="payment-actions-flex-row">
              <button type="submit" className="submit-btn" disabled={loading}>
                Post Monthly Installment
              </button>

              <button
                type="button"
                className="payoff-btn"
                disabled={loading}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to completely pay off the remaining contract balance of $${Number(selectedLoan.remaining_balance).toFixed(2)}?`,
                    )
                  ) {
                    processTransaction(true);
                  }
                }}
              >
                Pay Off Full Contract
              </button>
            </div>
          </form>

          {receiptData && (
            <button
              className="print-trigger-btn"
              style={{ marginTop: "15px" }}
              onClick={() => window.print()}
            >
              Print Official Receipt
            </button>
          )}
        </div>
      )}

      {!loading && receiptData && <Receipt data={receiptData} />}
    </div>
  );
};

export default Payments;
