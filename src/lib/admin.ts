import type { BookingSlot } from "@/lib/booking";
export type SelectionResource = { id: string; title: string; description: string; kind: "case" | "modelo" | "material"; url: string; visible: boolean };
export type SelectionPage = { title: string; edition: string; introduction: string; published: boolean; resources: SelectionResource[]; revision: number };
export type AdminData = { authenticated: boolean; csrf: string; today: string; until: string; first_day: string; business_dates: string[]; slots?: BookingSlot[]; selection?: SelectionPage };
export type AdminAction = (payload: Record<string, unknown>) => Promise<boolean>;
export const resourceLabels = { case: "Case", modelo: "Modelo", material: "Material de apoio" };
