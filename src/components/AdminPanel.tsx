"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import BookingDatePicker from "@/components/BookingDatePicker";
import SelectionAdmin from "@/components/SelectionAdmin";
import type { AdminData } from "@/lib/admin";
import { areaLabels, bookingDate } from "@/lib/booking";

const endpoint = "/api/admin.php";
const halfHours = Array.from({ length: 24 }, (_, index) => `${String(8 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`);
export default function AdminPanel() {
  const [data, setData] = useState<AdminData | null>(null);
  const [user, setUser] = useState("equipe");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [feedbackAction, setFeedbackAction] = useState("");
  const feedbackRef = useRef<HTMLDivElement>(null);
  const publishFeedbackRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"agenda" | "selection">("agenda");
  const [date, setDate] = useState("");
  const [range, setRange] = useState({ from: "", until: "", start: "09:00", end: "12:00", area: "geral" });
  const load = useCallback(async () => {
    const response = await fetch(endpoint, { cache: "no-store", credentials: "same-origin" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Painel indisponível.");
    setData(result);
    return result as AdminData;
  }, []);
  useEffect(() => { load().catch(() => setError("Não foi possível abrir o painel. Verifique a configuração privada do painel no servidor.")); }, [load]);

  useEffect(() => {
    if (!message && !error) return;
    const element = feedbackAction === "add" && data?.authenticated ? publishFeedbackRef.current : feedbackRef.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom > window.innerHeight || bounds.top < 70) element.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [message, error, feedbackAction, data?.authenticated]);

  function publish(event: React.FormEvent) {
    event.preventDefault();
    if (!data) return;
    setFeedbackAction("add"); setMessage("");
    if (!data.business_dates.includes(range.from) || !data.business_dates.includes(range.until)) {
      setError("Escolha datas úteis futuras, dentro do período permitido. Fins de semana e feriados bloqueados não são aceitos."); return;
    }
    if (range.until < range.from) { setError("A data final não pode ser anterior à inicial."); return; }
    if (range.start >= range.end) { setError("O horário final deve ser posterior ao inicial."); return; }
    action({ action: "add", ...range });
  }

  async function action(payload: Record<string, unknown>): Promise<boolean> {
    if (!data || busy) return false;
    setBusy(true); setFeedbackAction(String(payload.action)); setError(""); setMessage("");
    try {
      const response = await fetch(endpoint, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, csrf: data.csrf }) });
      const result = await response.json();
      if (!response.ok) { if (response.status === 401 || response.status === 403 || response.status === 409) await load(); throw new Error(result.message || "Não foi possível concluir a operação."); }
      setPassword("");
      const updated = await load();
      if (payload.action === "add") {
        const first = updated.slots?.find(slot => slot.date >= String(payload.from) && slot.date <= String(payload.until) && slot.area === payload.area);
        if (first) setDate(first.date);
      }
      setMessage(result.message || (payload.action === "login" ? "Acesso autorizado." : "Alteração salva."));
      return true;
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Falha de conexão."); return false; }
    finally { setBusy(false); }
  }
  const chosenDate = date || data?.slots?.[0]?.date || "";
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p className="type-secondary text-[#FFDA33] mb-4">IME Jr / Uso interno</p><h1 className="brand-heading text-4xl sm:text-5xl mb-6">Painel administrativo.</h1>
    <div ref={feedbackRef}>
    {error && (feedbackAction !== "add" || !data?.authenticated) && <p role="alert" className="border-l-2 border-[#FFDA33] py-3 pl-4 text-sm mb-6">{error}</p>}
    {message && (feedbackAction !== "add" || !data?.authenticated) && <p role="status" className="text-[#FFDA33] text-sm mb-6">{message}</p>}
    </div>
    {!data && !error && <p role="status" className="text-[#A0A0A0]">Carregando…</p>}
    {data && !data.authenticated && <form onSubmit={event => { event.preventDefault(); action({ action: "login", user, password }); }} className="max-w-md space-y-5 border-t border-[#2E2E2E] pt-8"><p className="text-sm text-[#A0A0A0]">Entre com o acesso compartilhado da equipe para gerenciar a agenda e os materiais do processo seletivo.</p><label className="booking-label block" htmlFor="admin-user">Usuário<input id="admin-user" autoComplete="username" required maxLength={80} className="booking-input mt-2" value={user} onChange={e => setUser(e.target.value)} /></label><label className="booking-label block" htmlFor="admin-password">Senha<input id="admin-password" autoComplete="current-password" type="password" required maxLength={256} className="booking-input mt-2" value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy} type="submit" className="btn-primary disabled:opacity-50">{busy ? "Entrando…" : "Entrar"}</button></form>}
    {data?.authenticated && <>
      <div className="flex flex-wrap gap-4 items-center justify-between border-b border-[#2E2E2E] pb-5 mb-8"><div role="group" aria-label="Áreas do painel" className="flex flex-wrap gap-2"><button type="button" aria-pressed={tab === "agenda"} disabled={busy} onClick={() => { setTab("agenda"); setMessage(""); setError(""); }} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === "agenda" ? "text-[#FFDA33] border-[#FFDA33]" : "text-[#A0A0A0] border-transparent hover:text-white"}`}>Agendamentos</button><button type="button" aria-pressed={tab === "selection"} disabled={busy} onClick={() => { setTab("selection"); setMessage(""); setError(""); }} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === "selection" ? "text-[#FFDA33] border-[#FFDA33]" : "text-[#A0A0A0] border-transparent hover:text-white"}`}>Processo Seletivo</button></div><button disabled={busy} onClick={() => action({ action: "logout" })} className="btn-ghost text-sm">Sair</button></div>
      <div hidden={tab !== "agenda"}>
      <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-3xl mb-8">Publique a disponibilidade conjunta da equipe. As solicitações chegam apenas em contato@imejr.com: confirme uma opção por e-mail, envie o convite e feche o horário escolhido aqui. A seleção do visitante não reserva horários automaticamente.</p>
      <section aria-labelledby="publish-title" className="border-b border-[#2E2E2E] pb-10 mb-10"><h2 id="publish-title" className="text-2xl font-bold mb-4">Publicar disponibilidade</h2><p className="text-sm text-[#A0A0A0] mb-6">Reuniões de 30 minutos, nos próximos 45 dias. O intervalo inclui somente dias úteis; cadastre feriados locais e recessos na configuração privada. Horários já fechados não são reabertos por esta ação.</p>
        <form onSubmit={publish} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <BookingDatePicker id="range-from" label="Data inicial" value={range.from} min={data.first_day} max={data.until} allowedDates={data.business_dates} onChange={from => setRange(r => ({ ...r, from, until: from && (!r.until || r.until < from) ? from : r.until }))} />
          <BookingDatePicker id="range-until" label="Data final" value={range.until} min={range.from || data.first_day} max={data.until} allowedDates={data.business_dates} onChange={until => setRange(r => ({ ...r, until }))} />
          <label className="booking-label" htmlFor="range-start">Horário inicial<select id="range-start" className="booking-input mt-2" value={range.start} onChange={e => { const start = e.target.value; const next = halfHours[halfHours.indexOf(start) + 1]; setRange(r => ({ ...r, start, end: r.end <= start ? next : r.end })); }}>{halfHours.slice(0, -1).map(time => <option key={time} value={time}>{time}</option>)}</select></label>
          <label className="booking-label" htmlFor="range-end">Horário final<select id="range-end" className="booking-input mt-2" value={range.end} onChange={e => setRange(r => ({ ...r, end: e.target.value }))}>{halfHours.filter(time => time > range.start).map(time => <option key={time} value={time}>{time}</option>)}</select></label>
          <label className="booking-label" htmlFor="range-area">Área<select id="range-area" className="booking-input mt-2" value={range.area} onChange={e => setRange(r => ({ ...r, area: e.target.value }))}><option value="geral">Ambas as áreas</option><option value="computacao">Computação</option><option value="dados">Dados</option></select></label>
          <button type="submit" disabled={busy} className="btn-primary justify-center sm:col-span-2 lg:col-span-1 disabled:opacity-50">{busy && feedbackAction === "add" ? "Publicando…" : "Publicar horários"}</button>
        </form>
        <div ref={publishFeedbackRef} className="mt-4">
          {feedbackAction === "add" && error && <p role="alert" className="border-l-2 border-[#FFDA33] py-3 pl-4 text-sm">{error}</p>}
          {feedbackAction === "add" && message && <p role="status" className="text-[#FFDA33] text-sm">{message}</p>}
        </div>
      </section>
      <section aria-labelledby="slots-title" className="border-b border-[#2E2E2E] pb-10 mb-10"><div className="flex flex-wrap gap-5 items-center justify-between mb-6"><h2 id="slots-title" className="text-2xl font-bold">Horários publicados</h2><label htmlFor="slot-day" className="booking-label">Dia<select id="slot-day" className="booking-input mt-2" value={chosenDate} onChange={e => setDate(e.target.value)}>{Array.from(new Set(data.slots?.map(slot => slot.date))).map(day => <option key={day} value={day}>{bookingDate(day)}</option>)}</select></label></div>
        {!data.slots?.length && <p className="text-sm text-[#A0A0A0]">Nenhum horário publicado.</p>}
        {chosenDate && <button type="button" disabled={busy} onClick={() => action({ action: "close-day", date: chosenDate })} className="text-sm text-[#FFDA33] underline mb-5 disabled:opacity-50">Fechar todos os horários deste dia</button>}
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8">{data.slots?.filter(slot => slot.date === chosenDate).map(slot => <li key={slot.id} className="flex gap-4 items-center justify-between border-t border-[#2E2E2E] py-4"><div><p className="font-bold">{slot.time}–{slot.end}</p><p className="text-xs text-[#A0A0A0] mt-1">{slot.area === "geral" ? "Ambas as áreas" : areaLabels[slot.area]} · {slot.open ? "Aberto" : "Fechado"}</p></div><button type="button" disabled={busy} onClick={() => action({ action: "toggle", id: slot.id })} className="text-sm text-[#FFDA33] underline disabled:opacity-50">{slot.open ? "Fechar" : "Reabrir"}</button></li>)}</ul>
      </section>
      </div>
      {data.selection && <div hidden={tab !== "selection"}><SelectionAdmin page={data.selection} busy={busy} action={action} /></div>}
    </>}
  </div>;
}
