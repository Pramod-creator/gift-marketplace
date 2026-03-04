import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
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

  return (
    <div>
      <section className="home-hero">
        <div className="hero-content">
          <h1>Find the Perfect Gift 🎁</h1>
          <p>Discover unique treasures for every occasion.</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      </section>

      <section className="home-featured container py-4">
        <h2>Featured Products</h2>
        <div className="grid grid-3">
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