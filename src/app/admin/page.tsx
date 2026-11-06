import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";
export const metadata: Metadata = { title: "Painel administrativo | IME Jr", robots: { index: false, follow: false, noimageindex: true, googleBot: { index: false, follow: false, noimageindex: true } } };
export default function AdminPage() { return <><Navbar /><main className="bg-black min-h-screen pt-28 pb-24"><AdminPanel /></main></>; }
