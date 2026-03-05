import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate("/products");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="nav-left">
          <Link to="/" className="navbar-brand">
            <div className="brand-logo">🎁</div>
            <div className="brand-text">
              <div className="brand-title">Gift Marketplace</div>
              <div className="brand-sub">Unique gifts & curated finds</div>
            </div>
          </Link>

          <div className="nav-search">
            <input 
              placeholder="Search gifts, categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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