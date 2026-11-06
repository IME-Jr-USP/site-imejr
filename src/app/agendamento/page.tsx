import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Booking from "@/components/Booking";
export const metadata: Metadata = { title: "Solicitar reunião | IME Jr", description: "Escolha até três opções de horário e conte sobre seu projeto para conversar com a equipe de Computação e Dados da IME Jr." };
export default function AgendamentoPage() {
  return <><Navbar /><main className="bg-black min-h-screen pt-32 pb-24"><Booking /></main><Footer /></>;
}
