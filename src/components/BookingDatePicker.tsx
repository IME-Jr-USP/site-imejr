"use client";
import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { calendarKey } from "@/lib/booking";

function brazilianDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split("-").reverse().join("/") : "";
}
function isoDate(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return "";
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? calendarKey(year, month - 1, day) : "";
}

type Props = { id: string; label: string; value: string; min: string; max: string; allowedDates: string[]; onChange: (value: string) => void };
export default function BookingDatePicker({ id, label, value, min, max, allowedDates, onChange }: Props) {
  const [text, setText] = useState(brazilianDate(value));
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const emitted = useRef(value);
  const calendarId = useId();
  useEffect(() => {
    if (value !== emitted.current) { setText(brazilianDate(value)); emitted.current = value; }
  }, [value]);
  useEffect(() => {
    const date = isoDate(text);
    const message = !text ? "" : !date ? "Use uma data válida no formato dd/mm/aaaa." : date < min || date > max || !allowedDates.includes(date) ? "Escolha um dia útil disponível no período permitido." : "";
    input.current?.setCustomValidity(message);
  }, [text, min, max, allowedDates]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const current = month || (value || min).slice(0, 7);
  const [year, monthNumber] = current.split("-").map(Number);
  const monthIndex = monthNumber - 1;
  const validMonth = Number.isFinite(year) && Number.isFinite(monthIndex);
  const first = validMonth ? (new Date(year, monthIndex, 1, 12).getDay() + 6) % 7 : 0;
  const length = validMonth ? new Date(year, monthIndex + 1, 0, 12).getDate() : 0;
  const title = validMonth ? new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, monthIndex, 1, 12)) : "Escolha uma data";
  const move = (delta: number) => { const next = new Date(year, monthIndex + delta, 1, 12); setMonth(calendarKey(next.getFullYear(), next.getMonth(), 1).slice(0, 7)); };
  function choose(date: string) { emitted.current = date; setText(brazilianDate(date)); onChange(date); setOpen(false); toggle.current?.focus(); }
  return <div ref={root} className="relative min-w-0" onKeyDown={event => { if (event.key === "Escape" && open) { event.stopPropagation(); setOpen(false); toggle.current?.focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <label className="booking-label block" htmlFor={id}>{label}</label>
    <div className="relative mt-2">
      <input ref={input} id={id} type="text" inputMode="numeric" autoComplete="off" required maxLength={10} placeholder="dd/mm/aaaa" aria-describedby={`${id}-format`} className="booking-input pr-11" value={text} onInvalid={event => { if (!text) event.currentTarget.setCustomValidity("Escolha uma data."); }} onChange={event => {
        const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
        const formatted = digits.slice(0, 2) + (digits.length > 2 ? "/" + digits.slice(2, 4) : "") + (digits.length > 4 ? "/" + digits.slice(4) : "");
        setText(formatted); const date = isoDate(formatted); emitted.current = date; onChange(date);
      }} />
      <button ref={toggle} type="button" className="absolute right-1 top-1 bottom-1 px-2 text-[#FFDA33]" aria-label={`Abrir calendário: ${label}`} aria-expanded={open} aria-controls={calendarId} onClick={() => { setMonth((value || min).slice(0, 7)); setOpen(!open); }}><CalendarDays size={18} /></button>
    </div>
    <span id={`${id}-format`} className="sr-only">Formato brasileiro: dia, mês e ano. Apenas dias úteis disponíveis.</span>
    {open && <div id={calendarId} role="group" aria-label={`Calendário: ${label}`} lang="pt-BR" className="absolute top-full left-0 z-30 mt-2 w-[min(19rem,calc(100vw-3rem))] border border-[#383838] bg-[#171717] p-4 shadow-2xl rounded-lg">
      <div className="flex items-center justify-between gap-2 mb-3"><button type="button" disabled={!validMonth || current <= min.slice(0, 7)} aria-label="Mês anterior" className="p-1 disabled:opacity-25" onClick={() => move(-1)}><ChevronLeft size={18} /></button><span aria-live="polite" className="text-sm font-bold capitalize">{title}</span><button type="button" disabled={!validMonth || current >= max.slice(0, 7)} aria-label="Próximo mês" className="p-1 disabled:opacity-25" onClick={() => move(1)}><ChevronRight size={18} /></button></div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(day => <span key={day} className="text-[10px] py-2 text-[#A0A0A0]">{day}</span>)}
        {Array.from({ length: first }, (_, index) => <span key={`blank-${index}`} />)}
        {Array.from({ length }, (_, index) => { const date = calendarKey(year, monthIndex, index + 1); const available = date >= min && date <= max && allowedDates.includes(date); return <button key={date} type="button" disabled={!available} aria-label={brazilianDate(date)} aria-pressed={date === value} onClick={() => choose(date)} className={`min-h-8 rounded text-xs disabled:opacity-25 disabled:cursor-not-allowed ${value === date ? "bg-[#FFDA33] text-black font-bold" : "hover:bg-[#333333]"}`}>{index + 1}</button>; })}
      </div><p className="text-[10px] leading-relaxed text-[#A0A0A0] mt-3">Somente dias úteis disponíveis.</p>
    </div>}
  </div>;
}
