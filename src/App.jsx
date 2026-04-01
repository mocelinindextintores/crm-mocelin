import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import LoginForm from "./components/LoginForm";
import AppShell from "./components/AppShell";
import DashboardPage from "./pages/DashboardPage";
import PipelinePage from "./pages/PipelinePage";
import MyLeadsPage from "./pages/MyLeadsPage";
import NewLeadPage from "./pages/NewLeadPage";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function bootstrap() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.id) await loadProfile(session.user.id);
      setLoading(false);
    }

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setError("");
      if (currentSession?.user?.id) await loadProfile(currentSession.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, full_name, email, role, is_active")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error.message);
      setProfile(null);
      return;
    }
    setProfile(data);
  }

  async function handleLogin({ email, password }) {
    setLoginLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Não foi possível entrar. Verifique e-mail e senha.");
    setLoginLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <div className="loading-screen"><div className="loading-box">Carregando CRM Mocelin...</div></div>;
  }

  if (!session) {
    return <LoginForm onSubmit={handleLogin} loading={loginLoading} error={error} />;
  }

  return (
    <AppShell profile={profile} activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout}>
      {activeView === "dashboard" && <DashboardPage profile={profile} />}
      {activeView === "pipeline" && <PipelinePage />}
      {activeView === "meus-leads" && <MyLeadsPage />}
      {activeView === "novo-lead" && <NewLeadPage profile={profile} />}
    </AppShell>
  );
}
