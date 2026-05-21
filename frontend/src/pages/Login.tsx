import { useState } from "react";
import api from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/products";
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">☕ Pixel Café POS</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />

          {error && <div className="error">{error}</div>}

          <button className="button" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f0e6;
          font-family: monospace;
        }

        .login-card {
          background: #fff7ed;
          border: 4px solid #3b2f2f;
          padding: 24px;
          width: 320px;
          box-shadow: 6px 6px 0 #3b2f2f;
        }

        .title {
          margin: 0;
          font-size: 20px;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          font-size: 12px;
          margin-bottom: 16px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input {
          padding: 10px;
          border: 3px solid #3b2f2f;
          background: #fff;
          font-family: monospace;
        }

        .button {
          padding: 10px;
          border: 3px solid #3b2f2f;
          background: #d9a066;
          cursor: pointer;
          font-weight: bold;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          color: #b00020;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
`