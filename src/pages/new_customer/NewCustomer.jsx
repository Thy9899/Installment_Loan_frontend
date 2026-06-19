import React from "react";
import { useLoanApplication } from "../../contexts/LoanApplicationContext";
import "./NewCustomer.css";

const NewCustomer = () => {
  // Destructure everything from our clean Context Provider hook
  const {
    formData,
    products,
    liveCalculations,
    loading,
    message,
    handleChange,
    handleSubmit,
  } = useLoanApplication();

  return (
    <div className="new-customer-container">
      <div className="new-customer-header">
        <div className="header-title-block">
          <h2>Register New Installment Loan</h2>
          <p>
            Create a customer loan contract and generate the repayment schedule.
          </p>
        </div>
      </div>

      {/* Dynamic Success or Error Alert Message */}
      {message.text && (
        <div className={`alert-message ${message.type}`}>
          <span className="alert-message-icon">
            {message.type === "success" ? "✓" : "⚠"}
          </span>
          <p>{message.text}</p>
        </div>
      )}

      <div className="new-customer-layout">
        {/* LEFT SIDE FORM PANEL */}
        <div className="new-customer-loan-card">
          <form className="new-customer-loan-form" onSubmit={handleSubmit}>
            <div className="new-customer-feilds">
              <p className="new-customer-information">Customer Information</p>

              <div className="new-customer-form-grid">
                <div className="new-customer-form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Gender *</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="new-customer-form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>National ID</label>
                  <input
                    type="text"
                    name="national_id"
                    value={formData.national_id}
                    onChange={handleChange}
                    placeholder="Enter national id"
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Enter occupation"
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address location"
                  />
                </div>
              </div>
            </div>

            {/* Installment Information */}
            <div className="new-customer-fields">
              <p className="new-customer-information">
                Installment Information
              </p>

              <div className="new-customer-form-grid">
                <div className="new-customer-form-group">
                  <label>Loan Product *</label>
                  <select
                    name="product_id"
                    required
                    value={formData.product_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Loan Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="new-customer-form-group">
                  <label>Loan Amount ($) *</label>
                  <input
                    type="number"
                    name="principal_amount"
                    required
                    value={formData.principal_amount}
                    onChange={handleChange}
                    placeholder="5000"
                    min="1"
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Interest Rate (% Monthly) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="interest_rate"
                    required
                    value={formData.interest_rate}
                    onChange={handleChange}
                    placeholder="1.5"
                    min="0"
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Loan Term *</label>
                  <select
                    name="term_months"
                    value={formData.term_months}
                    onChange={handleChange}
                  >
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="18">18 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                  </select>
                </div>

                <div className="new-customer-form-group">
                  <label>Contract Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="new-customer-form-group">
                  <label>Processing Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="processing_fee_percentage"
                    value={formData.processing_fee_percentage}
                    onChange={handleChange}
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            <div className="new-customer-button-group">
              <button type="button" className="btn-cancel" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Processing Engine..." : "Create Loan"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE LIVE CALCULATION SUMMARY CARD */}
        <div className="new-customer-summary-card">
          <h3>Live Calculation</h3>

          <div className="new-customer-summary-item">
            <span>Principal</span>
            <strong>
              $
              {liveCalculations.principal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="new-customer-summary-item">
            <span>Total Interest</span>
            <strong>
              $
              {liveCalculations.totalInterest.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="new-customer-summary-item">
            <span>Processing Fee ({formData.processing_fee_percentage}%)</span>
            <strong>
              $
              {liveCalculations.processingFee.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="new-customer-summary-item">
            <span>Total Repayment</span>
            <strong>
              $
              {liveCalculations.totalRepayment.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="new-customer-summary-divider"></div>

          <div className="new-customer-monthly-box">
            <p>Monthly Installment</p>
            <h2>
              $
              {liveCalculations.monthlyInstallment.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <span>Due every month for {formData.term_months} months</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
