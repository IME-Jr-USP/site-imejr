"use client";

import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,218,51,0.06) 0%, transparent 70%)",
        }}
      />

      {/* animate-hero aplica stagger fade-in-up nos filhos diretos */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 animate-hero">

        {/* 1 */}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-8" style={{ color: "#5E5E5E" }}>
          Empresa Júnior de Informática, Matemática e Estatística
        </p>

        {/* 2 */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.0] tracking-tight mb-8">
          Computação.
          <br />
          Dados.{" "}
          <span style={{ color: "#FFDA33" }}>Educação.</span>
        </h1>

        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "#FFDA33" }}>
            Talento USP para resolver problemas reais.
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#5E5E5E" }}>
            Apoiados pelo ecossistema de excelência da Universidade de São Paulo,
            criamos soluções sob medida para transformar o seu desafio em resultado.
          </p>
        </div>

        {/* 4 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#servicos" className="btn-primary">
            Nossos serviços
            <ArrowRight size={16} />
          </a>
          <a href="#contato" className="btn-ghost">
            Fale conosco
          </a>
        </div>
      </div>

      {/* Scroll cue — wrapper faz o fadeIn, filho faz o bounce */}
      <a
        href="#sobre"
        aria-label="Rolar para baixo"
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center transition-colors"
        style={{
          color: "#2E2E2E",
          opacity: 0,
          animation: "fadeIn 900ms cubic-bezier(0.16,1,0.3,1) 700ms forwards",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#5E5E5E")}
        onMouseLeave={e => (e.currentTarget.style.color = "#2E2E2E")}
      >
        <ChevronDown size={24} className="animate-bounce" />
      </a>
    </section>
  );
}
