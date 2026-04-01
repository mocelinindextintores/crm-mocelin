export function digitsOnly(value = "") {
  return String(value).replace(/\D/g, "");
}

export function formatPhone(value = "") {
  const d = digitsOnly(value).slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 3) return `(${d.slice(0, 2)})${d.slice(2)}`;
  if (d.length <= 7) return `(${d.slice(0, 2)})${d.slice(2, 3)} ${d.slice(3)}`;
  return `(${d.slice(0, 2)})${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7, 11)}`;
}

export function formatCnpj(value = "") {
  const d = digitsOnly(value).slice(0, 14);
  if (!d) return "";
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

export function parseMoneyInput(value = "") {
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

export function formatMoney(value = 0) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
