export default function DashboardPage({ profile }) {
  return (
    <>
      <section className="hero">
        <h2>CRM Mocelin conectado ao Supabase</h2>
        <p>Login real concluído. Usuário: <strong>{profile?.full_name || "-"}</strong></p>
      </section>

      <section className="grid-2">
        <article className="card panel-body">
          <h3 className="section-title">Usuário logado</h3>
          <p className="section-subtitle">Dados vindos da tabela user_profiles</p>
          <div className="info-list">
            <div><strong>Nome:</strong> {profile?.full_name || "-"}</div>
            <div><strong>E-mail:</strong> {profile?.email || "-"}</div>
            <div><strong>Função:</strong> {profile?.role || "-"}</div>
          </div>
        </article>

        <article className="card panel-body">
          <h3 className="section-title">Próxima etapa</h3>
          <p className="section-subtitle">Módulo Novo Lead já conectado ao banco.</p>
          <ul className="todo-list">
            <li>Clientes</li>
            <li>Leads / orçamentos</li>
            <li>Pipeline</li>
            <li>Tarefas</li>
            <li>Histórico</li>
          </ul>
        </article>
      </section>
    </>
  );
}
