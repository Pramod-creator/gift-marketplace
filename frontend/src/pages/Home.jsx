import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProducts();
        setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };
    fetch();
  }, []);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCategories();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setCategories([]);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="home-hero">
        <div className="hero-content">
          <h1>Find the Perfect Gift 🎁</h1>
          <p>Discover unique treasures for every occasion.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
            <button className="btn-secondary" onClick={() => navigate('/products')}>Browse</button>
          </div>
        </div>
      </section>

      <div className="container py-3">
        <div className="category-pills">
          {categories.map(c => (
            <button key={c.id} className="cat-pill" onClick={() => navigate(`/products?category=${c.id}`)}>{c.name}</button>
          ))}
        </div>
      </div>

      <section className="home-featured container py-4">
        <h2>Featured Products</h2>
        <div className="featured-grid grid grid-3">
          {products.slice(0,6).map(p => (
            <div key={p.id} className="card product-card">
              <div className="product-image">
                {p.image_url ? (
                  <img src={`http://localhost:5000/uploads/products/${p.image_url}`} alt={p.name} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>
              <div className="product-content">
                <h3>{p.name}</h3>
                <p className="text-gray-600 text-sm mb-2">Rs {parseFloat(p.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}