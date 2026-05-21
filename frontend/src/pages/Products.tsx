import { useEffect, useState } from "react";
import api from "../api/client";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  stockQty: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return <div className="page">Loading products...</div>;
  }

  return (
    <div className="page">
      <div className="header">
        <h1>☕ Products</h1>
        <div className="cart-indicator">Cart: {totalItems}</div>
      </div>

      <div className="grid">
        <div className="product-list">
          {products.map((p) => (
            <div key={p.id} className="card">
              <div className="name">{p.name}</div>
              <div className="price">฿{p.price}</div>
              <div className="stock">Stock: {p.stockQty}</div>

              <button onClick={() => addToCart(p)}>
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .page {
          padding: 16px;
          font-family: monospace;
          background: #f6f0e6;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .cart-indicator {
          padding: 6px 10px;
          border: 2px solid #3b2f2f;
          background: #fff7ed;
        }

        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
        }

        .product-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }

        .card {
          border: 3px solid #3b2f2f;
          background: #fff7ed;
          padding: 10px;
          box-shadow: 4px 4px 0 #3b2f2f;
        }

        .name {
          font-weight: bold;
        }

        .price {
          color: #7a4e2d;
        }

        button {
          margin-top: 6px;
          padding: 6px;
          border: 2px solid #3b2f2f;
          background: #d9a066;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
