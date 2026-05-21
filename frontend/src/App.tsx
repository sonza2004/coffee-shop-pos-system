import { useState } from "react";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import PaymentSlipUpload from "./pages/PaymentSlipUpload";
import AdminDashboard from "./pages/AdminDashboard";
import FinancialReport from "./pages/FinancialReport";
import { CartProvider } from "./context/CartContext";
import { UIProvider } from "./context/UIContext";
import { isAuthenticated, hasRole } from "./utils/auth";

export default function App() {
  const [route, setRoute] = useState<string>(() => {
    return isAuthenticated() ? "/products" : "/login";
  });

  const navigate = (path: string) => {
    setRoute(path);
    window.history.pushState({}, "", path);
  };

  const renderPage = () => {
    if (!isAuthenticated()) return <Login />;

    switch (route) {
      case "/login":
        return <Login />;
      case "/products":
        return <Products />;
      case "/cart":
        return <Cart />;
      case "/upload":
        return <PaymentSlipUpload />;
      case "/admin":
        return hasRole(["admin"]) ? <AdminDashboard /> : <div>Access Denied</div>;
      case "/report":
        return hasRole(["admin", "owner"]) ? <FinancialReport /> : <div>Access Denied</div>;
      default:
        return <Products />;
    }
  };

  return (
    <UIProvider>
      <CartProvider>
        <div>
          <nav className="nav">
            <button onClick={() => navigate("/products")}>Products</button>
            <button onClick={() => navigate("/cart")}>Cart</button>
            <button onClick={() => navigate("/upload")}>Upload</button>

            {hasRole(["admin"]) && (
              <button onClick={() => navigate("/admin")}>Admin</button>
            )}

            {hasRole(["admin", "owner"]) && (
              <button onClick={() => navigate("/report")}>Report</button>
            )}

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </nav>

          <main>{renderPage()}</main>

          <style>{`
            .nav {
              display: flex;
              gap: 8px;
              padding: 10px;
              background: #3b2f2f;
            }

            button {
              background: #d9a066;
              border: 2px solid #000;
              padding: 6px 10px;
              cursor: pointer;
              font-family: monospace;
            }

            main {
              min-height: 100vh;
            }
          `}</style>
        </div>
      </CartProvider>
    </UIProvider>
  );
}
