import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  digitsOnly,
  formatCnpj,
  formatMoney,
  formatPhone,
  parseMoneyInput,
} from "../lib/utils";

const emptyForm = {
  contact_name: "",
  company_name: "",
  cnpj: "",
  segment: "",
  city: "",
  state: "",
  phone: "",
  email: "",
  observations: "",
  channel_id: "",
  product_id: "",
  source_detail: "",
  campaign: "",
  profile: "",
  potential: "Médio",
  customer_type: "",
  has_demand: false,
  has_budget: false,
  summary: "",
  budget_amount: "",
  sold_amount: "",
};

export default function NewLeadPage({ profile }) {
  console.log("VERSAO NOVA NEWLEADPAGE 02");

  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [existingCustomer, setExistingCustomer] = useState(null);

  useEffect(() => {
    loadSelects();
  }, []);

  async function loadSelects() {
    const [{ data: productsData }, { data: channelsData }] = await Promise.all([
      supabase
        .from("products")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("channels")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order"),
    ]);

    setProducts(productsData || []);
    setChannels(channelsData || []);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function searchExistingCustomer() {
    const cnpjDigits = digitsOnly(form.cnpj);
    const phoneDigits = digitsOnly(form.phone);
    const email = form.email.trim().toLowerCase();

    if (!cnpjDigits && !phoneDigits && !email) return;

    const parts = [];
    if (cnpjDigits) parts.push(`cnpj_digits.eq.${cnpjDigits}`);
    if (phoneDigits) parts.push(`phone_digits.eq.${phoneDigits}`);
    if (email) parts.push(`email.eq.${email}`);

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .or(parts.join(","))
      .limit(1);

    if (error) {
      console.error("Erro ao buscar cliente existente:", error);
      return;
    }

    if (data?.length) {
      const customer = data[0];
      setExistingCustomer(customer);
      setForm((prev) => ({
        ...prev,
        contact_name: customer.contact_name || prev.contact_name,
        company_name: customer.company_name || prev.company_name,
        cnpj: customer.cnpj || prev.cnpj,
        segment: customer.segment || prev.segment,
        city: customer.city || prev.city,
        state: customer.state || prev.state,
        phone: customer.phone || prev.phone,
        email: customer.email || prev.email,
        observations: customer.observations || prev.observations,
      }));
      setFeedback(
        "Cliente já cadastrado encontrado. Os dados foram carregados automaticamente."
      );
    }
  }

async function ensureCustomer() {
  console.log("PROFILE ATUAL:", profile);

  if (!profile?.id) {
    throw new Error(
      "Perfil do usuário não carregado. Verifique a tabela user_profiles."
    );
  }

  if (existingCustomer?.id) {
    console.log("Usando customer existente:", existingCustomer.id);
    return existingCustomer.id;
  }

  const payload = {
    company_name: form.company_name.trim(),
    contact_name: form.contact_name.trim(),
    cnpj: digitsOnly(form.cnpj),
    segment: form.segment.trim() || null,
    city: form.city.trim() || null,
    state: form.state || null,
    phone: digitsOnly(form.phone),
    email: form.email.trim().toLowerCase(),
    observations: form.observations.trim() || null,
    created_by: profile.id,
  };

  console.log("PAYLOAD CUSTOMER:", payload);

  const { error: insertError } = await supabase
    .from("customers")
    .insert(payload);

  if (insertError) {
    console.error("Erro no insert customer:", insertError);
    throw insertError;
  }

  const cnpjDigits = digitsOnly(form.cnpj);
  const phoneDigits = digitsOnly(form.phone);
  const email = form.email.trim().toLowerCase();

  const parts = [];
  if (cnpjDigits) parts.push(`cnpj_digits.eq.${cnpjDigits}`);
  if (phoneDigits) parts.push(`phone_digits.eq.${phoneDigits}`);
  if (email) parts.push(`email.eq.${email}`);

  const { data, error: fetchError } = await supabase
    .from("customers")
    .select("id")
    .or(parts.join(","))
    .order("created_at", { ascending: false })
    .limit(1);

  console.log("Resposta customer após insert:", data, fetchError);

  if (fetchError) throw fetchError;

  const customerId = data?.[0]?.id;

  if (!customerId) {
    throw new Error("Customer salvo, mas não foi possível recuperar o ID.");
  }

  return customerId;
}

  function validateForm() {
    if (!form.contact_name.trim()) return "Informe o nome do contato.";
    if (!form.company_name.trim()) return "Informe a empresa.";
    if (!digitsOnly(form.cnpj)) return "Informe o CNPJ.";
    if (!form.phone.trim()) return "Informe o WhatsApp.";
    if (!form.email.trim()) return "Informe o e-mail.";
    if (!form.profile) return "Selecione o perfil do lead.";
    if (!form.customer_type) return "Selecione o tipo de cliente.";
    if (!form.summary.trim()) return "Informe o resumo do atendimento.";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!profile?.id) {
      setFeedback("Sessão inválida. Saia e entre novamente no sistema.");
      setLoading(false);
      return;
    }

    setFeedback("");

    const validationError = validateForm();
    if (validationError) {
      setFeedback(validationError);
      return;
    }

    setLoading(true);

    try {
      console.log("=== INICIANDO SALVAMENTO ===");

      const customerId = await ensureCustomer();

      console.log("Criando lead...");

      const leadPayload = {
        customer_id: customerId,
        product_id: form.product_id || null,
        channel_id: form.channel_id || null,
        source_detail: form.source_detail || null,
        campaign: form.campaign || null,
        profile: form.profile,
        potential: form.potential || null,
        customer_type: form.customer_type,
        has_demand: form.has_demand,
        has_budget: form.has_budget,
        summary: form.summary,
        budget_amount: parseMoneyInput(form.budget_amount),
        sold_amount: parseMoneyInput(form.sold_amount),
        status: "Em atendimento SDR",
        created_by: profile.id,
        updated_by: profile.id,
      };

      console.log("PAYLOAD LEAD:", leadPayload);

      const leadRequest = supabase
        .from("leads")
        .insert(leadPayload)
        .select("id, code, quote_number");

      const leadTimeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout ao criar lead no Supabase")),
          10000
        )
      );

      let leadResult;

      try {
        leadResult = await Promise.race([leadRequest, leadTimeout]);
        console.log("Resposta lead:", leadResult);
      } catch (error) {
        console.error("Erro lead:", error);
        throw error;
      }

      const { data: leadData, error: leadError } = leadResult;

      if (leadError) throw leadError;

      const lead = Array.isArray(leadData) ? leadData[0] : leadData;

      if (!lead?.id) {
        throw new Error("Lead criado sem retornar ID.");
      }

      setFeedback(
        `Lead salvo com sucesso. Código ${lead.code} • Orçamento ${lead.quote_number}.`
      );
      setForm(emptyForm);
      setExistingCustomer(null);
    } catch (error) {
      console.error("ERRO GERAL AO SALVAR:", error);
      setFeedback(
        "Erro inesperado: " + (error.message || "Falha ao salvar o lead.")
      );
    } finally {
      setLoading(false);
    }
  }

  const productOptions = useMemo(
    () =>
      products.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      )),
    [products]
  );

  const channelOptions = useMemo(
    () =>
      channels.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      )),
    [channels]
  );

  return (
    <>
      <section>
        <h2 className="section-title">Novo Lead</h2>
        <p className="section-subtitle">
          Cadastre um novo lead conectado ao Supabase.
        </p>
      </section>

      <form className="card panel-body form-section" onSubmit={handleSubmit}>
        <div className="form-divider">
          <h3>1. Dados do Cliente</h3>
          <p>
            Ao informar CNPJ, telefone ou e-mail, o sistema tenta localizar o
            cliente existente.
          </p>
        </div>

        <div className="form-grid-3">
          <div>
            <label>Nome do Contato *</label>
            <input
              value={form.contact_name}
              onChange={(e) => updateField("contact_name", e.target.value)}
              placeholder="Nome do contato"
            />
          </div>

          <div>
            <label>Empresa *</label>
            <input
              value={form.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
              placeholder="Empresa"
            />
          </div>

          <div>
            <label>CNPJ *</label>
            <input
              value={formatCnpj(form.cnpj)}
              onChange={(e) => updateField("cnpj", digitsOnly(e.target.value))}
              onBlur={searchExistingCustomer}
              placeholder="CNPJ"
            />
          </div>

          <div>
            <label>Segmento</label>
            <input
              value={form.segment}
              onChange={(e) => updateField("segment", e.target.value)}
              placeholder="Segmento"
            />
          </div>

          <div>
            <label>Cidade</label>
            <input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Cidade"
            />
          </div>

          <div>
            <label>Estado</label>
            <input
              value={form.state}
              onChange={(e) =>
                updateField("state", e.target.value.toUpperCase().slice(0, 2))
              }
              placeholder="UF"
            />
          </div>

          <div>
            <label>WhatsApp *</label>
            <input
              value={formatPhone(form.phone)}
              onChange={(e) => updateField("phone", digitsOnly(e.target.value))}
              onBlur={searchExistingCustomer}
              placeholder="WhatsApp"
            />
          </div>

          <div>
            <label>E-mail *</label>
            <input
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={searchExistingCustomer}
              placeholder="E-mail"
            />
          </div>

          <div>
            <label>Observações</label>
            <input
              value={form.observations}
              onChange={(e) => updateField("observations", e.target.value)}
              placeholder="Observações"
            />
          </div>
        </div>

        <div className="form-divider">
          <h3>2. Origem do Lead</h3>
        </div>

        <div className="form-grid">
          <div>
            <label>Canal</label>
            <select
              value={form.channel_id}
              onChange={(e) => updateField("channel_id", e.target.value)}
            >
              <option value="">Selecione</option>
              {channelOptions}
            </select>
          </div>

          <div>
            <label>Produto</label>
            <select
              value={form.product_id}
              onChange={(e) => updateField("product_id", e.target.value)}
            >
              <option value="">Selecione</option>
              {productOptions}
            </select>
          </div>

          <div>
            <label>Origem detalhada</label>
            <input
              value={form.source_detail}
              onChange={(e) => updateField("source_detail", e.target.value)}
              placeholder="Origem detalhada"
            />
          </div>

          <div>
            <label>Campanha</label>
            <input
              value={form.campaign}
              onChange={(e) => updateField("campaign", e.target.value)}
              placeholder="Campanha"
            />
          </div>
        </div>

        <div className="form-divider">
          <h3>3. Qualificação do Lead</h3>
        </div>

        <div className="form-grid-3">
          <div>
            <label>Perfil *</label>
            <select
              value={form.profile}
              onChange={(e) => updateField("profile", e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Frio">Frio</option>
              <option value="Morno">Morno</option>
              <option value="Quente">Quente</option>
            </select>
          </div>

          <div>
            <label>Potencial</label>
            <select
              value={form.potential}
              onChange={(e) => updateField("potential", e.target.value)}
            >
              <option value="Alto">Alto</option>
              <option value="Médio">Médio</option>
              <option value="Baixo">Baixo</option>
            </select>
          </div>

          <div>
            <label>Tipo de Cliente *</label>
            <select
              value={form.customer_type}
              onChange={(e) => updateField("customer_type", e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Novo">Novo</option>
              <option value="Recorrente">Recorrente</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label>Valor Orçado</label>
            <input
              value={form.budget_amount}
              onChange={(e) => updateField("budget_amount", e.target.value)}
              onBlur={() =>
                updateField(
                  "budget_amount",
                  form.budget_amount
                    ? formatMoney(parseMoneyInput(form.budget_amount))
                    : ""
                )
              }
              placeholder="R$ 0,00"
            />
          </div>

          <div>
            <label>Valor Fechado</label>
            <input
              value={form.sold_amount}
              onChange={(e) => updateField("sold_amount", e.target.value)}
              onBlur={() =>
                updateField(
                  "sold_amount",
                  form.sold_amount
                    ? formatMoney(parseMoneyInput(form.sold_amount))
                    : ""
                )
              }
              placeholder="R$ 0,00"
            />
          </div>

          <div>
            <label>Resumo do Atendimento *</label>
            <input
              value={form.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              placeholder="Resumo"
            />
          </div>
        </div>

        <div className="check-row">
          <label>
            <input
              type="checkbox"
              checked={form.has_demand}
              onChange={(e) => updateField("has_demand", e.target.checked)}
            />
            Possui demanda real?
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.has_budget}
              onChange={(e) => updateField("has_budget", e.target.checked)}
            />
            Possui orçamento definido?
          </label>
        </div>

        {existingCustomer && (
          <div className="info-banner">
            Cliente existente localizado:{" "}
            <strong>{existingCustomer.company_name}</strong>. Um novo orçamento
            será criado para ele.
          </div>
        )}

        <div className="actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Lead"}
          </button>
        </div>

        <p className={`feedback ${feedback ? "show" : ""}`}>{feedback}</p>
      </form>
    </>
  );
}
