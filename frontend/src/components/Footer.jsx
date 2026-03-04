import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Gift Marketplace. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a> |
          <a href="/products">Products</a> |
          <a href="/#">About</a> |
          <a href="/#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
