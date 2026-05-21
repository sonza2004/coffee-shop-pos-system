import { useState } from "react";
import api from "../api/client";

export default function PaymentSlipUpload() {
  const [orderId, setOrderId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);

    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const uploadSlip = async () => {
    if (!orderId || !file) {
      setStatus("Order ID and slip are required");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("image", file);

      await api.post("/payments/slip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus("Slip uploaded successfully (pending approval)");
      setOrderId("");
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      setStatus(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>📎 Payment Slip Upload</h1>

      <div className="form">
        <input
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <img src={preview} alt="preview" className="preview" />
        )}

        <button onClick={uploadSlip} disabled={loading}>
          {loading ? "Uploading..." : "Upload Slip"}
        </button>

        {status && <div className="status">{status}</div>}
      </div>

      <style>{`
        .page {
          padding: 16px;
          font-family: monospace;
          background: #f6f0e6;
          min-height: 100vh;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 300px;
        }

        input {
          padding: 8px;
          border: 3px solid #3b2f2f;
          background: #fff;
        }

        button {
          padding: 10px;
          border: 3px solid #3b2f2f;
          background: #d9a066;
          cursor: pointer;
        }

        .preview {
          width: 100%;
          border: 3px solid #3b2f2f;
        }

        .status {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
