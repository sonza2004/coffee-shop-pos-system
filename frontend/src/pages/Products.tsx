import { useEffect, useState } from "react";
import api from "../api/client";

type Product = {
  id: string;
  name: string;
  price: number;
  stockQty: number;
};

type CartItem = {
  product: Product;
  qty: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);

      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id
            ? { ...c, qty: c.qty + 1 }
            : c
        );
      }

      return [...prev, { product, qty: 1 }];
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  if (loading) {
    return <div className="page">Loading products...</div>;
  }

  return (
    <div className="page">
      <div className="header">
        <h1>☕ Products</h1>
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

        <div className="cart">
          <h2>Cart</h2>

          {cart.length === 0 && <div>No items</div>}

          {cart.map((item) => (
            <div key={item.product.id} className="cart-item">
              <span>{item.product.name}</span>
              <span>x{item.qty}</span>
            </div>
          ))}

          <div className="total">Total: ฿{total}</div>

          <button
            disabled={cart.length === 0}
            onClick={() => (window.location.href = "/cart")}
          >
            Checkout
          </button>
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
          margin-bottom: 16px;
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

        .cart {
          border: 3px solid #3b2f2f;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          margin: 6px 0;
        }

        .total {
          margin-top: 12px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
