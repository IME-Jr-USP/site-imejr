import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";
// Keep the previous address usable with the same session and the new central panel.
export const metadata: Metadata = { title: "Painel administrativo | IME Jr", robots: { index: false, follow: false, noimageindex: true } };
export default function BookingAdminPage() { return <><Navbar /><main className="bg-black min-h-screen pt-28 pb-24"><AdminPanel /></main></>; }
