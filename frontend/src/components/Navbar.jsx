import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          🎁 Gift Marketplace
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Products</Link>

          {user?.role === "customer" && (
            <>
              <Link to="/cart" className="nav-link">Cart</Link>
              <Link to="/account" className="nav-link">My Account</Link>
            </>
          )}

          {user?.role === "seller" && (
            <Link to="/seller" className="nav-link">Seller Dashboard</Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-primary">Register</Link>
            </>
          ) : (
            <>
              <span className="nav-user">{user.name}</span>
              <button onClick={logout} className="btn-secondary">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}