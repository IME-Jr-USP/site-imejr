import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SelectionMaterials from "@/components/SelectionMaterials";
export const metadata: Metadata = { title: "Processo Seletivo | IME Jr", robots: { index: false, follow: false, noimageindex: true, googleBot: { index: false, follow: false, noimageindex: true } } };
export default function ProcessoSeletivoPage() { return <><Navbar /><main className="bg-black min-h-screen pt-32 pb-24"><SelectionMaterials /></main><Footer /></>; }
