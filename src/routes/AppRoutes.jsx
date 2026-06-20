import { Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login";

import AdminLayout from "../layout/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";

import NewCustomer from "../pages/new_customer/NewCustomer";
import CustomerList from "../pages/customer_list/CustomerList";

import NewProduct from "../pages/new_product/NewProduct";
import ProductList from "../pages/product_list/ProductList";

// LENDING
import LoanCustomer from "../pages/loan_customer/LoanCustomer";
import PaymentsSchedule from "../pages/payment_schedule/PaymentsSchedule";
import Payments from "../pages/payments/Payments";
import PayOff from "../pages/pay_off/PayOff";
import PrintReceipt from "../pages/receipt/Receipt";

import { LoanApplicationProvider } from "../contexts/LoanApplicationContext";

// REPORTS
import LoanPortfolioReport from "../pages/reports/LoanPortfolioReport";
import DailyCollectionReport from "../pages/reports/DailyCollectionReport";
import OverdueLoanReport from "../pages/reports/OverdueLoanReport";
import CustomerStatementReport from "../pages/reports/CustomerStatementReport";
import OutstandingBalanceReport from "../pages/reports/OutstandingBalanceReport";

// SETTINGS
import Profile from "../pages/profile/Profile";
import NewAdmin from "../pages/new_admin/NewAdmin";
import COB from "../pages/cob/COB";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Login />;
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/new-customer"
        element={
          <PrivateRoute>
            <AdminLayout>
              <LoanApplicationProvider>
                <NewCustomer />
              </LoanApplicationProvider>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/customer-list"
        element={
          <PrivateRoute>
            <AdminLayout>
              <CustomerList />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/new-product"
        element={
          <PrivateRoute>
            <AdminLayout>
              <NewProduct />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/product-list"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ProductList />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* LENDING */}
      <Route
        path="/loan-customer"
        element={
          <PrivateRoute>
            <AdminLayout>
              <LoanCustomer />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/payments-schedule/:contractNo?"
        element={
          <PrivateRoute>
            <AdminLayout>
              <PaymentsSchedule />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/payments/:contractNo?"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Payments />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/pay-off"
        element={
          <PrivateRoute>
            <AdminLayout>
              <PayOff />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/print-receipt"
        element={
          <PrivateRoute>
            <AdminLayout>
              <PrintReceipt />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* PRODUCTS */}
      <Route
        path="/new-product/edit/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <NewProduct />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* REPORTS */}
      <Route
        path="/reports/loan-portfolio"
        element={
          <AdminLayout>
            <LoanPortfolioReport />
          </AdminLayout>
        }
      />

      <Route
        path="/reports/daily-collection"
        element={
          <AdminLayout>
            <DailyCollectionReport />
          </AdminLayout>
        }
      />

      <Route
        path="/reports/overdue-loans"
        element={
          <AdminLayout>
            <OverdueLoanReport />
          </AdminLayout>
        }
      />

      <Route
        path="/reports/customer-statement"
        element={
          <AdminLayout>
            <CustomerStatementReport />
          </AdminLayout>
        }
      />

      <Route
        path="/reports/outstanding-balance"
        element={
          <AdminLayout>
            <OutstandingBalanceReport />
          </AdminLayout>
        }
      />

      {/* SETTINGS */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Profile />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/new-admin"
        element={
          <PrivateRoute>
            <AdminLayout>
              <NewAdmin />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/cob"
        element={
          <PrivateRoute>
            <AdminLayout>
              <COB />
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
