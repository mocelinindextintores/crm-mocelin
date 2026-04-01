export default function AppShell({ profile, onLogout }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-top">
          <div className="brand">
            <div className="brand-mark">M</div>
            <div>
              <h1>
                CRM Clientes Novos
                <br />
                Mocelin
              </h1>
              <p>Sistema de Gestão</p>
            </div>
          </div>

          <div className="user-card">
            <div className="name">{profile?.full_name || "Usuário"}</div>
            <div className="badge">{profile?.role || "Sem perfil"}</div>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-btn active" type="button">
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </button>
          <button className="nav-btn" type="button">
            <span className="nav-icon">📊</span>
            <span>Pipeline</span>
          </button>
          <button className="nav-btn" type="button">
            <span className="nav-icon">👥</span>
            <span>Meus Leads</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" type="button" onClick={onLogout}>
            <span className="nav-icon">↩</span>
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="content">
        <section className="hero">
          <h2>CRM Mocelin conectado ao Supabase</h2>
          <p>
            Login real concluído. Próximo passo: migrar leads, pipeline, tarefas
            e relatórios.
          </p>
        </section>

        <section className="grid-2">
          <article className="card panel-body">
            <h3 className="section-title">Usuário logado</h3>
            <p className="section-subtitle">
              Dados vindos da tabela <strong>user_profiles</strong>
            </p>
            <div className="info-list">
              <div><strong>Nome:</strong> {profile?.full_name || "-"}</div>
              <div><strong>E-mail:</strong> {profile?.email || "-"}</div>
              <div><strong>Função:</strong> {profile?.role || "-"}</div>
            </div>
          </article>

          <article className="card panel-body">
            <h3 className="section-title">Próxima etapa</h3>
            <p className="section-subtitle">
              Conectar os módulos do CRM ao banco real.
            </p>
            <ul className="todo-list">
              <li>Clientes</li>
              <li>Leads / orçamentos</li>
              <li>Pipeline</li>
              <li>Tarefas</li>
              <li>Histórico</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
