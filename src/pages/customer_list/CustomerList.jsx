import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [search]); // Triggers immediately whenever 'search' changes

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetches instantly on every single keystroke
      const res = await api.get(`/customers?search=${search}&limit=50`);

      if (res.data && Array.isArray(res.data.data)) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching customer directory:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-list-container">
      {/* Header & Search stay mounted so you never lose keyboard focus */}
      <div className="customer-list-header">
        <div className="header-title-block">
          <h2>Customer Directory</h2>
          <p>View and manage all customer accounts</p>
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

      {/* Dims the table container smoothly when typing / searching */}
      <div className={`table-responsive ${loading ? "table-searching" : ""}`}>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Date Of Birth</th>
              <th>Phone</th>
              <th>Email</th>
              <th>National ID</th>
              <th>Occupation</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              /* Loading State */
              <tr>
                <td colSpan="9" className="loading-row">
                  <div className="loading-flex-container">
                    <div className="row-spinner"></div>
                    <p>Loading your customers details...</p>
                  </div>
                </td>
              </tr>
            ) : customers.length > 0 ? (
              /* Populated State */
              customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.customer_code}</strong>
                  </td>
                  <td>{c.full_name}</td>
                  <td>{c.gender}</td>
                  <td>{new Date(c.date_of_birth).toLocaleDateString()}</td>
                  <td>{c.phone}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.national_id}</td>
                  <td>{c.occupation}</td>
                  <td>{c.address}</td>
                </tr>
              ))
            ) : (
              /* Empty Search / No Results State */
              <tr>
                <td colSpan="9" className="empty-row">
                  No customers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
