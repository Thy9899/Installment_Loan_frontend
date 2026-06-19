import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./Receipt.css";

const Receipt = ({ data }) => {
  const [searchNo, setSearchNo] = useState("");
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear local searched data state whenever a brand-new transaction prop object drops in
  useEffect(() => {
    if (data) {
      setFetchedData(null);
    }
  }, [data]);

  // Unified parser to normalize either standard prop payloads or manual API fallback structures
  const parseReceiptData = (input) => {
    if (!input) return null;

    // If it's the raw API response array/object structure, extract the target record
    const record = Array.isArray(input) ? input[0] : input.data || input;

    // If it's already structured correctly from a previous lookup or clean props, use it
    if (record.receiptNo) return record;

    return {
      receiptNo: record.receipt_no || record.receiptNo,
      date: new Date(
        record.payment_date || record.created_at || record.date,
      ).toLocaleString(),
      contractNo:
        record.contract_no || record.contract?.contract_no || record.contractNo,
      customerCode:
        record.customer_code ||
        record.customer?.customer_code ||
        record.customerCode,
      fullName:
        record.full_name || record.customer?.full_name || record.fullName,
      type:
        record.is_payoff ||
        String(record.receipt_no || "")
          .toUpperCase()
          .startsWith("POF")
          ? "FULL LEDGER PAY-OFF"
          : `Installment #${record.installment_no || "N/A"}`,
      amountPaid: Number(
        record.amount_paid || record.amount || record.amountPaid || 0,
      ),
    };
  };

  const receiptData = parseReceiptData(data || fetchedData);

  const handleSearchReceipt = async (e) => {
    if (e) e.preventDefault();

    if (!searchNo.trim()) {
      alert("Please enter a receipt number");
      return;
    }

    try {
      setLoading(true);
      setFetchedData(null);

      const res = await api.get(`/payments/history/${searchNo.trim()}`);
      const payload = res.data.data;

      if (!payload || (Array.isArray(payload) && payload.length === 0)) {
        alert("Receipt records not found.");
        return;
      }

      setFetchedData(payload);
    } catch (error) {
      console.error("Receipt Fetch Error:", error);
      alert(
        error.response?.data?.message || "Receipt not found or search failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
      </head>
      <body>
        ${document.querySelector(".receipt-container").outerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="receipt-lookup-page">
      <div className="payment-page-header no-print">
        <div className="header-title-block">
          <h2>Process Installment Payment</h2>
          <p>Track installments, balances, or search past receipts</p>
        </div>

        {/* Search Input Bar */}
        <div className="payment-search-container no-print">
          <input
            type="text"
            placeholder="Enter Receipt No (e.g. REC-00001)..."
            value={searchNo}
            onChange={(e) => setSearchNo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchReceipt();
              }
            }}
          />
          <button
            className="search-btn"
            onClick={handleSearchReceipt}
            disabled={loading}
          >
            {loading ? "Searching..." : "Find"}
          </button>
        </div>
      </div>

      {/* Render Receipt Body if data exists */}
      {receiptData ? (
        <div className="receipt-container">
          <div className="receipt-header">
            {/* Business Logo Holder */}
            <div className="receipt-logo">
              <img src="/ct_logo.PNG" alt="logo" />
            </div>

            <h1 className="business-name">CT Growth</h1>
            <p className="business-description">
              Premium Capital & Asset Management Services
            </p>
            <p className="business-metadata">
              100 Corporate Parkway, Suite 500 • support@nexusfinancial.com
            </p>

            <div className="receipt-title-badge">TRANSACTION RECEIPT</div>
          </div>

          <div className="receipt-body">
            <div className="receipt-line">
              <span className="label">Receipt No:</span>
              <strong className="value highlight">
                {receiptData.receiptNo}
              </strong>
            </div>
            <div className="receipt-line">
              <span className="label">Date/Time:</span>
              <span className="value">{receiptData.date}</span>
            </div>

            <hr className="receipt-divider" />

            {receiptData.fullName && (
              <div className="receipt-line">
                <span className="label">Customer Name:</span>
                <span className="value">{receiptData.fullName}</span>
              </div>
            )}
            {receiptData.customerCode && (
              <div className="receipt-line">
                <span className="label">Customer ID:</span>
                <span className="value">{receiptData.customerCode}</span>
              </div>
            )}

            <div className="receipt-line">
              <span className="label">Contract Target:</span>
              <strong className="value">{receiptData.contractNo}</strong>
            </div>
            <div className="receipt-line">
              <span className="label">Allocation:</span>
              <span className="value">{receiptData.type}</span>
            </div>

            <hr className="receipt-divider" />

            <div className="receipt-line total-line">
              <span className="label">Amount Tendered:</span>
              <strong className="value">
                ${Number(receiptData.amountPaid).toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="receipt-footer">
            <p className="thank-you">Thank you for your business!</p>
            <p className="system-stamp">Verification Document Issued Locally</p>

            <button
              className="print-trigger-btn no-print"
              onClick={handlePrint}
            >
              Print Official Receipt
            </button>
          </div>
        </div>
      ) : (
        !loading && (
          <p className="empty-state no-print">
            Ready for lookups. Enter a receipt identifier above.
          </p>
        )
      )}
    </div>
  );
};

export default Receipt;
