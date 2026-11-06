"use client";

import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";

export default function Sobre() {
  return (
    <section id="sobre" className="py-24" style={{ background: "#101010" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <Reveal>
            <p className="section-label mb-4">Quem somos</p>
            <h2 className="section-title">
              A empresa júnior do IME-USP
            </h2>
            <p className="section-subtitle">
              Somos estudantes de graduação da Universidade de São Paulo. Combinamos formação técnica rigorosa, tecnologias atuais e contato com pesquisas recentes para desenvolver soluções práticas, sempre com orientação de professores e especialistas de referência em suas áreas.
            </p>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: "#A0A0A0" }}
            >
              Atendemos pessoas físicas e jurídicas que buscam soluções em
              Computação e Análise de Dados. Também mantemos iniciativas de Educação, como o Cursinho IMEnsina.
            </p>

            <p className="type-secondary mt-8 text-[#A0A0A0]">IME-USP · Desde 1991 · 100% universitários</p>
            <p className="text-xs text-[#777777] mt-3">CNPJ 26.531.013/0001-80</p>
          </Reveal>

          {/* Right: numbers */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:gap-y-16">
            {[
              { end: 3, suffix: "", label: "áreas de atuação" },
              { end: 30, suffix: "+", label: "anos de história" },
              { end: 100, suffix: "+", label: "projetos entregues" },
              { end: 50, suffix: "+", label: "membros do IME" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col justify-center border-t border-[#2E2E2E] pt-6"
              >
                <span className="text-5xl font-black mb-2" style={{ color: "#FFDA33" }}>
                  <CountUp end={s.end} suffix={s.suffix} />
                </span>
                <span className="text-sm" style={{ color: "#5E5E5E" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
