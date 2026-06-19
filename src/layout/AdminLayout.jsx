import React from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <div className="content">{children}</div>
    </div>
  );
};

export default AdminLayout;
