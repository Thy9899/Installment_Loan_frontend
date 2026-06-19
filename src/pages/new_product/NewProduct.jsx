import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./NewProduct.css";

const NewProduct = () => {
  const { id } = useParams();

  const isEditMode = !!id;

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [productData, setProdauctData] = useState({
    product_name: "",
    description: "",
    interest_rate: "",
    processing_fee: "",
    max_amount: "",
    min_amount: "",
    max_term_months: "",
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/loan-products/${id}`);

      if (res.data.success) {
        const product = res.data.data;

        setProdauctData({
          product_name: product.product_name || "",
          description: product.description || "",
          interest_rate: product.interest_rate || "",
          processing_fee: product.processing_fee || "",
          max_amount: product.max_amount || "",
          min_amount: product.min_amount || "",
          max_term_months: product.max_term_months || "",
        });
      }
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: "Unable to load product information",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdauctData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        const response = await api.put(`/loan-products/${id}`, productData);

        if (response.data.success) {
          setMessage({
            type: "success",
            text: "Product updated successfully",
          });
        }
      } else {
        const response = await api.post("/loan-products", productData);

        if (response.data.success) {
          setMessage({
            type: "success",
            text: "Product created successfully",
          });

          setProdauctData({
            product_name: "",
            description: "",
            interest_rate: "",
            processing_fee: "",
            max_amount: "",
            min_amount: "",
            max_term_months: "",
          });
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Internal server communication error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-product-container">
      <div className="form-card">
        {/* HEADER */}
        <div className="new-product-header">
          <div className="header-title-block">
            <h2>{isEditMode ? "Update Product" : "New Product"}</h2>
            <p>View all information products</p>
          </div>

          {/* <div className="search-wrapper">
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
          </div> */}
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

        <form className="new-product-form" onSubmit={submitProduct}>
          <p className="new-product-information">Product Information</p>

          <div className="new-customer-form-grid">
            <div className="new-customer-form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="product_name"
                required
                value={productData.product_name}
                onChange={handleChange}
                placeholder="Product Name"
              />
            </div>

            <div className="new-customer-form-group">
              <label>Product Description</label>
              <textarea
                rows="4"
                name="description"
                required
                value={productData.description}
                onChange={handleChange}
                placeholder="Enter product description"
              />
            </div>
          </div>

          <p className="new-product-information">Installment Information</p>

          <div className="new-customer-form-grid">
            <div className="new-customer-form-group">
              <label>Interest Rate (%)</label>

              <input
                type="number"
                name="interest_rate"
                required
                value={productData.interest_rate}
                onChange={handleChange}
                placeholder="1.5"
              />
            </div>

            <div className="new-customer-form-group">
              <label>Processing Fee (%)</label>
              <input
                type="number"
                name="processing_fee"
                required
                value={productData.processing_fee}
                onChange={handleChange}
                placeholder="2"
              />
            </div>

            <div className="new-customer-form-group">
              <label>Minimum Loan Amount</label>
              <input
                type="number"
                name="min_amount"
                required
                value={productData.min_amount}
                onChange={handleChange}
                placeholder="1000"
              />
            </div>

            <div className="new-customer-form-group">
              <label>Maximum Loan Amount</label>
              <input
                type="number"
                name="max_amount"
                required
                value={productData.max_amount}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>

            <div className="new-customer-form-group">
              <label>Maximum Loan Term</label>

              <select
                name="max_term_months"
                value={productData.max_term_months}
                onChange={handleChange}
              >
                <option value="">Select Loan Term</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            </div>
          </div>

          <div className="new-product-button-group">
            <button type="button" className="btn-secondary">
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
