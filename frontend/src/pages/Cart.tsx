import { useState } from "react";
import api from "../api/client";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const createOrder = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          qty: item.qty,
        })),
      };

      const res = await api.post("/orders", payload);

      setOrderId(res.data.id);
      setStatus("pending");

      clearCart();
    } catch (err: any) {
      setStatus(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>🧾 Cart / Order</h1>

      {cart.length === 0 ? (
        <div>No items in cart</div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.product.id} className="row">
              <span>{item.product.name}</span>
              <span>x{item.qty}</span>
              <span>฿{item.product.price * item.qty}</span>
            </div>
          ))}

          <div className="total">Total: ฿{total}</div>

          <button onClick={createOrder} disabled={loading}>
            {loading ? "Creating..." : "Create Order"}
          </button>
        </>
      )}

      {orderId && (
        <div className="status">
          Order ID: {orderId} <br />
          Status: {status}
        </div>
      )}

      <style>{`
        .page {
          padding: 16px;
          font-family: monospace;
          background: #f6f0e6;
          min-height: 100vh;
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px dashed #3b2f2f;
        }

        .total {
          margin-top: 12px;
          font-weight: bold;
        }

        button {
          margin-top: 12px;
          padding: 10px;
          border: 3px solid #3b2f2f;
          background: #d9a066;
          cursor: pointer;
        }

        .status {
          margin-top: 16px;
          padding: 10px;
          border: 3px solid #3b2f2f;
          background: #fff7ed;
        }
      `}</style>
    </div>
  );
}
