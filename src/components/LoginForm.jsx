import { useState } from "react";

export default function LoginForm({ onSubmit, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({ email, password });
  }

  return (
    <div className="login-screen">
      <div className="login-shell">
        <div className="login-card">
          <div className="login-logo-wrap">
            <div className="login-logo-mark">M</div>
          </div>

          <h1 className="login-title">CRM Clientes Novos</h1>
          <p className="login-subtitle">Acesse o sistema da Mocelin</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="login-field">
              <input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="login-eye" onClick={() => setShowPassword((prev) => !prev)} aria-label="Mostrar ou ocultar senha">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </button>

            <div className="error-text">{error || ""}</div>
          </form>

          <div className="login-foot">Sistema para gerenciamento de novos leads</div>
        </div>
      </div>
    </div>
  );
}
