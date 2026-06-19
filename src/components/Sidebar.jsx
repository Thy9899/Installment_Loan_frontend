import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyCheckAlt,
  FaHandHoldingUsd,
  FaExchangeAlt,
  FaChevronDown,
  FaChevronRight,
  FaLayerGroup,
  FaRegShareSquare,
  FaUserAltSlash,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  // State to hold dynamic user profile details
  const [userData, setUserData] = useState({
    username: "Loading...",
    email: "",
  });

  // Fetch User Profile Info on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        // If there's no token, don't attempt to fetch (avoids unnecessary console errors)
        if (!token) return;

        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserData({
            username: response.data.user.username,
            email: response.data.user.email,
          });
        }
      } catch (error) {
        console.error("Error fetching user info for sidebar:", error);
        setUserData({ username: "Admin User", email: "Error loading email" });
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },

    // CUSTOMER
    {
      name: "Customers",
      icon: <FaUsers />,
      children: [
        { name: "New Customer", path: "/new-customer" },
        { name: "Customer List", path: "/customer-list" },
      ],
    },

    // PRODUCTS
    {
      name: "Products",
      icon: <FaLayerGroup />,
      children: [
        { name: "New Product", path: "/new-product" },
        { name: "Product List", path: "/product-list" },
      ],
    },

    // LENDING
    {
      name: "Lending",
      icon: <FaMoneyCheckAlt />,
      children: [
        { name: "Loans", path: "/loan-customer" },
        { name: "Payments Schedule", path: "/payments-schedule" },
        { name: "Payments", path: "/payments" },
        { name: "Pay Off", path: "/pay-off" },
        { name: "Print Receipt", path: "/print-receipt" },
      ],
    },

    // REPORTS
    {
      name: "Reports",
      icon: <FaHandHoldingUsd />,
      children: [
        { name: "Loan Portfolio", path: "/reports/loan-portfolio" },
        { name: "Daily Collection", path: "/reports/daily-collection" },
        { name: "Overdue Loan", path: "/reports/overdue-loans" },
        { name: "Customer Statement", path: "/reports/customer-statement" },
        { name: "Outstanding Balancet", path: "/reports/outstanding-balance" },
      ],
    },

    // SETTINGD
    {
      name: "Settings",
      icon: <FaExchangeAlt />,
      children: [
        { name: "Profile", path: "/profile" },
        { name: "New Admin", path: "/new-admin" },
        { name: "COB", path: "/cob" },
      ],
    },
  ];

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  // Clear Token on Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clears auth data from browser storage
    navigate("/");
  };

  // Helper variable to get the first letter of the username for the profile placeholder avatar
  const avatarLetter = userData.username
    ? userData.username.charAt(0).toUpperCase()
    : "A";

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src="/ct_logo.PNG" alt="logo" />
        <div>
          <h3>CT Growth</h3>
          <span>Smart Loan</span>
        </div>
      </div>

      <div className="divider"></div>

      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.name}>
            {item.children ? (
              <>
                <button
                  className="menu-btn"
                  onClick={() => toggleMenu(item.name)}
                >
                  <div className="menu-left">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>

                  {openMenu === item.name ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </button>

                <div
                  className={`submenu ${openMenu === item.name ? "open" : ""}`}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className="submenu-link"
                    >
                      <div>•</div>
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <NavLink to={item.path} className="nav-link">
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      {/* Updated bottom section displaying dynamic API data */}
      <div className="bottom-section">
        <button onClick={handleLogout} className="logout-btn">
          <div className="logout-text">
            <i>
              <FaUserAltSlash />
            </i>
            <span>Logout</span>
          </div>
          <i className="logout-icon">
            <FaRegShareSquare />
          </i>
        </button>

        <div className="user-profile" onClick={() => navigate(`/profile`)}>
          <div className="avatar">{avatarLetter}</div>

          <div className="user-info">
            <h4>{userData.username}</h4>
            <span className="user-email">{userData.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
