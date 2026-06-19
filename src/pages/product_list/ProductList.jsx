import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./ProductList.css";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initial Load
  useEffect(() => {
    loadProducts();
  }, []);

  // Real-time Search Filter Effect
  useEffect(() => {
    const filtered = productList.filter(
      (product) =>
        product.product_code?.toLowerCase().includes(search.toLowerCase()) ||
        product.product_name?.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [search, productList]); // Runs automatically whenever 'search' or 'productList' changes

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/loan-products");

      if (res.data.success) {
        setProductList(res.data.data);
        setFilteredProducts(res.data.data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Add a Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/loan-products/${id}`);
        alert("Product deleted successfully");
        loadProducts(); // Refresh data
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="productList-container">
      {/* Header */}
      <div className="productList-header">
        <div className="header-title-block">
          <h2>Product Lists</h2>
          <p>View all information products</p>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search product code or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Typing triggers the useEffect filter
            className="search-input"
          />
        </div>
      </div>

      {/* Table */}

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Interest Rate</th>
            <th>Processing Fee</th>
            <th>Min Amount</th>
            <th>Max Amount</th>
            <th>Max Term</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              {/* Add colSpan="9" here to cross all headers */}
              <td colSpan="9" className="loading-row">
                <div className="loading-flex-container">
                  <div className="row-spinner"></div>
                  <p>Loading your products details...</p>
                </div>
              </td>
            </tr>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product_code}</td>
                <td>{product.product_name}</td>
                <td>{product.interest_rate}%</td>
                <td>{product.processing_fee}%</td>
                <td>${Number(product.min_amount).toLocaleString()}</td>
                <td>${Number(product.max_amount).toLocaleString()}</td>
                <td>{product.max_term_months} Months</td>
                <td>
                  <div className="btn-productList">
                    <button
                      className="btn-productList-edit"
                      onClick={() =>
                        navigate(`/new-product/edit/${product.id}`)
                      }
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="btn-productList-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
