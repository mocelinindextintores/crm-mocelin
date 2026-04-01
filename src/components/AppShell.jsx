export default function AppShell({ profile, activeView, setActiveView, onLogout, children }) {
  const isSeller = profile?.role === "Vendedor";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-top">
          <div className="brand">
            <div className="brand-mark">M</div>
            <div>
              <h1>CRM Clientes Novos<br />Mocelin</h1>
              <p>Sistema de Gestão</p>
            </div>
          </div>

          <div className="user-card">
            <div className="name">{profile?.full_name || "Usuário"}</div>
            <div className="badge">{profile?.role || "Sem perfil"}</div>
          </div>
        </div>

        <nav className="nav">
          <button className={`nav-btn ${activeView === "dashboard" ? "active" : ""}`} type="button" onClick={() => setActiveView("dashboard")}>
            <span className="nav-icon">🏠</span><span>Dashboard</span>
          </button>

          <button className={`nav-btn ${activeView === "pipeline" ? "active" : ""}`} type="button" onClick={() => setActiveView("pipeline")}>
            <span className="nav-icon">📊</span><span>Pipeline</span>
          </button>

          {!isSeller && (
            <button className={`nav-btn ${activeView === "novo-lead" ? "active" : ""}`} type="button" onClick={() => setActiveView("novo-lead")}>
              <span className="nav-icon">➕</span><span>Novo Lead</span>
            </button>
          )}

          <button className={`nav-btn ${activeView === "meus-leads" ? "active" : ""}`} type="button" onClick={() => setActiveView("meus-leads")}>
            <span className="nav-icon">👥</span><span>Meus Leads</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" type="button" onClick={onLogout}>
            <span className="nav-icon">↩</span>
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
