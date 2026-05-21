import { useEffect, useState } from "react";
import api from "../api/client";

type Report = {
  totalSales: number;
  totalOrders: number;
  netRevenue: number;
};

export default function FinancialReport() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/reports/daily");
        setReport(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div className="page">Loading report...</div>;

  if (!report) return <div className="page">No report data</div>;

  return (
    <div className="page">
      <h1>📊 Daily Financial Report</h1>

      <div className="grid">
        <div className="card">
          <div className="label">Total Sales</div>
          <div className="value">฿{report.totalSales}</div>
        </div>

        <div className="card">
          <div className="label">Total Orders</div>
          <div className="value">{report.totalOrders}</div>
        </div>

        <div className="card">
          <div className="label">Net Revenue</div>
          <div className="value">฿{report.netRevenue}</div>
        </div>
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
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .card {
          border: 3px solid #3b2f2f;
          background: #fff7ed;
          padding: 12px;
          box-shadow: 4px 4px 0 #3b2f2f;
        }

        .label {
          font-size: 12px;
          opacity: 0.7;
        }

        .value {
          font-size: 20px;
          font-weight: bold;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
}
