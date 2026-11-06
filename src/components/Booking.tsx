"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";
import { areaLabels, bookingDate, BookingSlot, calendarKey } from "@/lib/booking";

export default function Booking() {
  const [area, setArea] = useState("geral");
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selected, setSelected] = useState<BookingSlot[]>([]);
  const [day, setDay] = useState("");
  const [today, setToday] = useState("");
  const [until, setUntil] = useState("");
  const [month, setMonth] = useState<[number, number]>([2026, 0]);
  const [csrf, setCsrf] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [reload, setReload] = useState(0);
  const key = useRef("");
  const loadedArea = useRef<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", organization: "", description: "", links: "", website: "", consent: false });

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("area");
    if (requested && requested in areaLabels) setArea(requested);
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    if (loadedArea.current !== area) { setSelected([]); setDay(""); }
    loadedArea.current = area;
    fetch(`/api/booking.php?area=${area}`, { signal: abort.signal, credentials: "same-origin", cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setSlots(data.slots); setCsrf(data.csrf); setToday(data.today); setUntil(data.until);
        const validIds = new Set<string>(data.slots.map((slot: BookingSlot) => slot.id));
        setSelected(current => current.filter(slot => validIds.has(slot.id)));
        setDay(current => data.slots.some((slot: BookingSlot) => slot.date === current) ? current : "");
        setError(current => current.startsWith("Não foi possível carregar") || current.startsWith("A agenda") ? "" : current);
        const [year, currentMonth] = data.today.split("-").map(Number);
        setMonth(current => {
          const currentKey = calendarKey(current[0], current[1], 1).slice(0, 7);
          return currentKey < data.today.slice(0, 7) || currentKey > data.until.slice(0, 7) ? [year, currentMonth - 1] : current;
        });
      })
      .catch(reason => { if (reason.name !== "AbortError") { setSlots([]); setError(reason.message?.startsWith("A agenda") ? reason.message : "Não foi possível carregar a disponibilidade. Tente novamente ou escreva para contato@imejr.com."); } })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [area, reload]);

  useEffect(() => {
    const onFocus = () => { if (step === 1) setReload(value => value + 1); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [step]);

  const grouped = useMemo(() => slots.reduce<Record<string, BookingSlot[]>>((result, slot) => { (result[slot.date] ??= []).push(slot); return result; }, {}), [slots]);
  const [year, monthIndex] = month;
  const first = (new Date(year, monthIndex, 1, 12).getDay() + 6) % 7;
  const days = new Date(year, monthIndex + 1, 0, 12).getDate();
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, monthIndex, 1, 12));
  const canPrev = !!today && calendarKey(year, monthIndex, 1).slice(0, 7) > today.slice(0, 7);
  const canNext = !!until && calendarKey(year, monthIndex, 1).slice(0, 7) < until.slice(0, 7);
  const changeMonth = (delta: number) => { const date = new Date(year, monthIndex + delta, 1, 12); setMonth([date.getFullYear(), date.getMonth()]); setDay(""); };
  const toggle = (slot: BookingSlot) => {
    setError("");
    setSelected(current => current.some(s => s.id === slot.id) ? current.filter(s => s.id !== slot.id) : current.length < 3 ? [...current, slot] : current);
  };
  const field = (name: string, value: string | boolean) => setForm(current => ({ ...current, [name]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSending(true); setError("");
    if (!key.current) key.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/booking.php", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, area, csrf, slots: selected.map(s => s.id), key: key.current }) });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409 && result.reason === "availability_changed") { setStep(1); setReload(current => current + 1); }
        throw new Error(result.message || "Não foi possível enviar. Tente novamente.");
      }
      setReference(result.reference); setStep(3);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível enviar. Tente novamente."); }
    finally { setSending(false); }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="type-secondary text-[#FFDA33] mb-5">Computação e Dados / Primeiro contato</p>
      <h1 className="brand-heading text-4xl sm:text-5xl md:text-6xl mb-6">Vamos conversar sobre seu projeto.</h1>
      <p className="text-[#A0A0A0] text-lg max-w-2xl leading-relaxed mb-10">Escolha de uma a três opções de horário. Nossa equipe analisará a solicitação e confirmará uma delas por e-mail, com o convite para a reunião.</p>
      {step < 3 && <ol aria-label="Etapas do agendamento" className="flex flex-wrap gap-6 border-b border-[#2E2E2E] pb-5 mb-10 text-sm"><li className={step === 1 ? "text-[#FFDA33] font-bold" : "text-[#A0A0A0]"} aria-current={step === 1 ? "step" : undefined}>01 / Horários</li><li className={step === 2 ? "text-[#FFDA33] font-bold" : "text-[#A0A0A0]"} aria-current={step === 2 ? "step" : undefined}>02 / Seu projeto</li></ol>}
      {error && <div role="alert" className="border-l-2 border-[#FFDA33] pl-4 py-2 text-sm text-[#E0E0E0] mb-7">{error}{step === 1 && !sending && <button className="underline ml-2" onClick={() => setReload(value => value + 1)}>Recarregar agenda</button>}</div>}
      {step === 1 && <>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <label className="text-sm font-semibold flex items-center gap-3" htmlFor="booking-area">Sobre qual área?<select id="booking-area" className="booking-input w-auto" value={area} onChange={event => { setError(""); setArea(event.target.value); }}><option value="geral">Ainda não sei</option><option value="computacao">Computação</option><option value="dados">Dados</option></select></label>
          <div className="flex flex-wrap items-center gap-4"><button type="button" disabled={loading} className="text-xs text-[#FFDA33] underline disabled:opacity-40" onClick={() => setReload(value => value + 1)}>Atualizar horários</button><p className="flex items-center gap-2 text-xs text-[#A0A0A0]"><Clock3 size={15} aria-hidden="true" />30 minutos · Horário de Brasília</p></div>
        </div>
        {loading ? <p role="status" className="py-16 text-[#A0A0A0]">Carregando disponibilidade…</p> : <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <section className="lg:col-span-7" aria-label="Calendário de disponibilidade">
            <div className="flex items-center justify-between mb-6"><h2 className="capitalize text-xl font-bold">{today ? monthLabel : "Calendário"}</h2><div className="flex gap-2"><button type="button" aria-label="Mês anterior" disabled={!canPrev} onClick={() => changeMonth(-1)} className="p-2 hover:bg-[#222222] disabled:opacity-25"><ChevronLeft size={20} /></button><button type="button" aria-label="Próximo mês" disabled={!canNext} onClick={() => changeMonth(1)} className="p-2 hover:bg-[#222222] disabled:opacity-25"><ChevronRight size={20} /></button></div></div>
            {today && <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(label => <span key={label} className="text-xs text-[#A0A0A0] py-3">{label}</span>)}
              {Array.from({ length: first }, (_, index) => <span key={`blank-${index}`} />)}
              {Array.from({ length: days }, (_, index) => {
                const date = calendarKey(year, monthIndex, index + 1);
                const enabled = date > today && date <= until && !!grouped[date]?.length && (first + index) % 7 < 5;
                const marked = selected.some(slot => slot.date === date);
                return <button key={date} type="button" disabled={!enabled} aria-label={`${bookingDate(date)}${enabled ? ", com disponibilidade" : ", indisponível"}`} aria-pressed={day === date} onClick={() => setDay(date)} className={`relative min-h-12 sm:min-h-14 rounded-md font-semibold transition-colors disabled:text-[#444444] disabled:cursor-not-allowed ${day === date ? "bg-[#FFDA33] text-black" : enabled ? "bg-[#181818] hover:bg-[#292929] text-white" : "text-[#444444]"}`}>{index + 1}{marked && <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${day === date ? "bg-black" : "bg-[#FFDA33]"}`} aria-hidden="true" />}</button>;
              })}
            </div>}
            <p className="text-xs text-[#777777] mt-5 leading-relaxed">Apenas dias úteis com disponibilidade publicada. Fins de semana, feriados nacionais fixos e datas bloqueadas pela equipe ficam indisponíveis.</p>
          </section>
          <section className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#2E2E2E] pt-6 lg:pt-0 lg:pl-10" aria-label="Horários do dia">
            <h2 className="text-xl font-bold mb-6">{day ? bookingDate(day) : "Selecione um dia"}</h2>
            {day ? <div className="grid grid-cols-2 gap-3">{grouped[day]?.map(slot => { const active = selected.some(s => s.id === slot.id); return <button key={slot.id} type="button" disabled={!active && selected.length === 3} aria-pressed={active} onClick={() => toggle(slot)} className={`border py-3 px-3 text-sm font-semibold transition-colors disabled:opacity-30 ${active ? "border-[#FFDA33] text-[#FFDA33] bg-[#FFDA33]/5" : "border-[#383838] hover:border-[#FFDA33]"}`}>{slot.time}–{slot.end}{active && <Check size={14} className="inline ml-2" aria-hidden="true" />}</button>; })}</div> : <p className="text-sm text-[#A0A0A0] leading-relaxed">{slots.length ? "Os horários disponíveis aparecem aqui. Você pode escolher opções em dias diferentes." : "Não há horários publicados para esta área no momento. Você pode selecionar outra área ou falar com contato@imejr.com."}</p>}
          </section>
        </div>}
        <div className="border-t border-[#2E2E2E] mt-10 pt-7"><h2 className="font-bold mb-4">Suas opções <span className="text-[#A0A0A0] font-normal">({selected.length}/3)</span></h2><ul className="flex flex-wrap gap-3 mb-6">{selected.map((slot, index) => <li key={slot.id} className="flex items-center gap-3 border border-[#383838] px-4 py-3 text-sm"><span className="text-[#FFDA33]">{index + 1}.</span>{bookingDate(slot.date)} · {slot.time}<button type="button" aria-label={`Remover opção ${index + 1}`} onClick={() => toggle(slot)} className="p-1"><X size={15} /></button></li>)}</ul><button type="button" disabled={!selected.length || loading} className="btn-primary disabled:opacity-40" onClick={() => { setStep(2); setError(""); }}>Continuar <ArrowRight size={16} /></button></div>
      </>}
      {step === 2 && <div className="grid lg:grid-cols-12 gap-10 lg:gap-16"><form onSubmit={submit} className="lg:col-span-7 space-y-6">
        <h2 className="text-2xl font-bold">Conte um pouco sobre você e seu projeto.</h2>
        <div className="grid sm:grid-cols-2 gap-5"><label className="booking-label" htmlFor="booking-name">Nome *<input id="booking-name" autoComplete="name" required minLength={2} maxLength={120} className="booking-input mt-2" value={form.name} onChange={e => field("name", e.target.value)} /></label><label className="booking-label" htmlFor="booking-email">E-mail para o convite *<input id="booking-email" autoComplete="email" type="email" required maxLength={254} className="booking-input mt-2" value={form.email} onChange={e => field("email", e.target.value)} /></label></div>
        <label className="booking-label block" htmlFor="booking-organization">Empresa ou instituição<input id="booking-organization" autoComplete="organization" maxLength={160} className="booking-input mt-2" value={form.organization} onChange={e => field("organization", e.target.value)} /></label>
        <label className="booking-label block" htmlFor="booking-description">Descrição do projeto *<textarea id="booking-description" required minLength={30} maxLength={5000} rows={6} className="booking-input mt-2" placeholder="Qual problema você quer resolver? Conte o objetivo, o contexto e, se houver, o prazo do projeto." value={form.description} onChange={e => field("description", e.target.value)} /></label>
        <label className="booking-label block" htmlFor="booking-links">Documentos e referências (opcional)<textarea id="booking-links" maxLength={6000} rows={3} className="booking-input mt-2" placeholder="Um link http ou https por linha, até 5 links." value={form.links} onChange={e => field("links", e.target.value)} /><span className="block text-xs text-[#A0A0A0] leading-relaxed mt-2 font-normal">Se tiver documentos, apresentações ou bases de referência, compartilhe os links. Dê permissão de leitura para contato@imejr.com. Evite incluir senhas ou informações sensíveis.</span></label>
        <div className="hidden" aria-hidden="true"><label htmlFor="booking-website">Site<input id="booking-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => field("website", e.target.value)} /></label></div>
        <label className="flex gap-3 items-start text-sm text-[#A0A0A0] leading-relaxed"><input type="checkbox" required checked={form.consent} onChange={e => field("consent", e.target.checked)} className="mt-1 accent-[#FFDA33]" />Autorizo a IME Jr a usar estes dados para responder ao meu pedido e organizar a reunião. Os dados deste formulário são enviados apenas por e-mail para a equipe, sem histórico de pedidos no painel.</label>
        <div className="flex flex-wrap gap-4"><button type="button" disabled={sending} onClick={() => { setStep(1); setError(""); }} className="btn-ghost"><ArrowLeft size={16} />Voltar</button><button disabled={sending} type="submit" className="btn-primary disabled:opacity-50">{sending ? "Enviando…" : "Enviar solicitação"}<ArrowRight size={16} /></button></div>
      </form><aside className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#2E2E2E] pt-6 lg:pt-0 lg:pl-10"><p className="type-secondary text-[#FFDA33] mb-5">Resumo / {areaLabels[area]}</p><ol className="space-y-5">{selected.map((slot, index) => <li key={slot.id}><span className="text-xs text-[#A0A0A0]">Opção {index + 1}</span><p className="font-bold mt-1">{bookingDate(slot.date)}</p><p className="text-sm text-[#A0A0A0]">{slot.time}–{slot.end} · Brasília</p></li>)}</ol><p className="text-sm text-[#A0A0A0] mt-8 leading-relaxed">Os horários são sugestões. A reunião só estará confirmada quando nossa equipe responder por e-mail e enviar o convite.</p></aside></div>}
      {step === 3 && <div role="status" className="border-t border-[#2E2E2E] pt-10"><Check size={35} className="text-[#FFDA33] mb-5" /><h2 className="text-3xl font-bold mb-4">Solicitação enviada.</h2><p className="text-[#A0A0A0] leading-relaxed max-w-xl">A equipe entrará em contato pelo e-mail <strong className="text-white">{form.email}</strong> para confirmar um horário e enviar o convite. Por enquanto, nenhuma reunião está reservada.</p><p className="type-secondary text-[#FFDA33] mt-6">Referência: {reference}</p><a href="/" className="activity-text-link mt-8">Voltar ao início <ArrowRight size={16} /></a></div>}
    </div>
  );
}
