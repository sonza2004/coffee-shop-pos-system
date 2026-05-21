import { useEffect, useState } from "react";
import api from "../api/client";

type PaymentSlip = {
  id: string;
  orderId: string;
  imageUrl: string;
  status: string;
};

export default function AdminDashboard() {
  const [slips, setSlips] = useState<PaymentSlip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlips = async () => {
    try {
      const res = await api.get("/payments/pending");
      setSlips(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlips();
  }, []);

  const approve = async (id: string) => {
    await api.post(`/payments/${id}/approve`);
    fetchSlips();
  };

  const reject = async (id: string) => {
    await api.post(`/payments/${id}/reject`);
    fetchSlips();
  };

  if (loading) return <div className="page">Loading admin dashboard...</div>;

  return (
    <div className="page">
      <h1>🛠 Admin Dashboard</h1>

      {slips.length === 0 && <div>No pending payments</div>}

      <div className="grid">
        {slips.map((s) => (
          <div key={s.id} className="card">
            <div>Order: {s.orderId}</div>
            <img src={s.imageUrl} alt="slip" className="img" />

            <div className="actions">
              <button onClick={() => approve(s.id)}>Approve</button>
              <button onClick={() => reject(s.id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .page {
          padding: 16px;
          font-family: monospace;
          background: #f6f0e6;
          min-height: 100vh;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .card {
          border: 3px solid #3b2f2f;
          background: #fff7ed;
          padding: 10px;
        }

        .img {
          width: 100%;
          border: 2px solid #3b2f2f;
          margin-top: 8px;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        button {
          border: 3px solid #3b2f2f;
          background: #d9a066;
          cursor: pointer;
          padding: 6px;
        }
      `}</style>
    </div>
  );
}
