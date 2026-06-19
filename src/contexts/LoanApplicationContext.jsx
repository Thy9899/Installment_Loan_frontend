import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const LoanApplicationContext = createContext();

export const LoanApplicationProvider = ({ children }) => {
  // Unified Form State Object
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    email: "",
    national_id: "",
    occupation: "",
    address: "",
    product_id: "",
    principal_amount: "",
    interest_rate: "",
    term_months: "12",
    start_date: new Date().toISOString().split("T")[0],
    processing_fee_percentage: "2",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Metrics Calculations State
  const [liveCalculations, setLiveCalculations] = useState({
    principal: 0,
    totalInterest: 0,
    processingFee: 0,
    totalRepayment: 0,
    monthlyInstallment: 0,
  });

  // Input Value Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Automatic Live Math Calculator Hook Engine
  useEffect(() => {
    const principal = Number(formData.principal_amount) || 0;
    const rate = Number(formData.interest_rate) || 0;
    const terms = Number(formData.term_months) || 1;
    const feePercent = Number(formData.processing_fee_percentage) || 0;

    const totalInterest = (principal * rate * terms) / 100;
    const processingFee = (principal * feePercent) / 100;
    const totalRepayment = principal + totalInterest + processingFee;
    const monthlyInstallment = terms > 0 ? totalRepayment / terms : 0;

    setLiveCalculations({
      principal,
      totalInterest,
      processingFee,
      totalRepayment,
      monthlyInstallment,
    });
  }, [formData]);

  // Fetch Active Database Loan Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/loan-products", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch loan products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  // Submit Multi-Service Application Handler Form Actions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        full_name: formData.full_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        phone: formData.phone,
        email: formData.email,
        national_id: formData.national_id,
        occupation: formData.occupation,
        address: formData.address,
        product_id: Number(formData.product_id),
        principal_amount: Number(formData.principal_amount),
        interest_rate: Number(formData.interest_rate),
        term_months: Number(formData.term_months),
        start_date: formData.start_date,
      };

      const response = await api.post("/applications/submit", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `Application created! Customer Code: ${response.data.data.customer_code}, Loan ID: ${response.data.data.contract_no}`,
        });

        // Reset state values safely
        setFormData({
          full_name: "",
          gender: "",
          date_of_birth: "",
          phone: "",
          email: "",
          national_id: "",
          occupation: "",
          address: "",
          product_id: "",
          principal_amount: "",
          interest_rate: "",
          term_months: "12",
          start_date: new Date().toISOString().split("T")[0],
          processing_fee_percentage: "2",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Internal server communication error.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoanApplicationContext.Provider
      value={{
        formData,
        products,
        liveCalculations,
        loading,
        message,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </LoanApplicationContext.Provider>
  );
};

// Custom layout hook to make importing cleaner later
export const useLoanApplication = () => {
  const context = useContext(LoanApplicationContext);
  if (!context) {
    throw new Error(
      "useLoanApplication must be wrapped inside a LoanApplicationProvider.",
    );
  }
  return context;
};
