export type BookingSlot = { id: string; date: string; time: string; end: string; area: string; open: boolean };
export const areaLabels: Record<string, string> = { computacao: "Computação", dados: "Dados", geral: "A definir" };
export function bookingDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "short", day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00-03:00`));
}
export function calendarKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
