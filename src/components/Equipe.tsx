"use client";

import { Linkedin } from "lucide-react";
import Reveal from "@/components/Reveal";

type Lider = {
  id: string;
  nome: string;
  cargo: string;
  areas: string[];
  linkedin?: string;
  foto: string;
  fotoClassName?: string;
};

const AREA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Computação: { bg: "#FFDA3318", text: "#FFDA33", border: "#FFDA3330" },
  Dados: { bg: "#FFDA3318", text: "#FFDA33", border: "#FFDA3330" },
  Educação: { bg: "#FFDA3318", text: "#FFDA33", border: "#FFDA3330" },
};

const TEAM_PHOTO_URL =
  "/fotos-lideres/equipe.jpeg";

const lideres: Lider[] = [
  {
    id: "joel-landim",
    nome: "Joel Landim",
    cargo: "Presidente",
    areas: ["Computação", "Dados", "Educação"],
    linkedin: "https://www.linkedin.com/in/joel-landim/",
    foto: "/fotos-lideres/Joel.png",
    fotoClassName: "h-[88%] w-[88%]",
  },
  {
    id: "ana-ferreira",
    nome: "Ana Beatriz",
    cargo: "Diretora Financeira",
    areas: ["Dados"],
    linkedin: "https://www.linkedin.com/in/ana-beatriz-alves-ferreira-7064862a1/",
    foto: "/fotos-lideres/Ana.png",
    fotoClassName: "h-[104%] w-[146%]",
  },
  {
    id: "arthur-yudji",
    nome: "Arthur Yudji",
    cargo: "Diretor de Negócios",
    areas: ["Computação"],
    linkedin: "https://www.linkedin.com/in/arthur-yudji-i-586748299/",
    foto: "/fotos-lideres/Arthur.png",
  },
  {
    id: "bruno-henrique",
    nome: "Bruno Henrique",
    cargo: "Diretor de Negócios",
    areas: ["Dados"],
    linkedin: "https://www.linkedin.com/in/bruno-henrique-alves-santos/",
    foto: "/fotos-lideres/Bruno.png",
  },
  {
    id: "felipe-faria",
    nome: "Felipe Faria",
    cargo: "Líder de Educação",
    areas: ["Educação", "Dados"],
    linkedin: "https://www.linkedin.com/in/felipe-segantine-de-faria-3a9b45237/",
    foto: "/fotos-lideres/Felipe.png",
  },
  {
    id: "isaque-nascimento",
    nome: "Isaque Nascimento",
    cargo: "Líder de Computação",
    areas: ["Computação"],
    linkedin: "https://www.linkedin.com/in/ionascimento/?locale=pt",
    foto: "/fotos-lideres/Isaque.png",
  },
  {
    id: "jose-fernando",
    nome: "José Fernando",
    cargo: "Diretor de RH",
    areas: ["Computação", "Dados"],
    linkedin: "https://www.linkedin.com/in/jnandolima",
    foto: "/fotos-lideres/José.png",
  },
  {
    id: "julia-isabelly",
    nome: "Julia Isabelly",
    cargo: "Diretora Jurídica",
    areas: ["Dados"],
    linkedin: "https://www.linkedin.com/in/julia-isabelly-a18154195",
    foto: "/fotos-lideres/Julia.png",
  },
  {
    id: "lucas-toshioka",
    nome: "Lucas Toshioka",
    cargo: "Diretor de Marketing",
    areas: ["Computação"],
    linkedin: "https://www.linkedin.com/in/lucas-toshioka-tenório-08562134a/",
    foto: "/fotos-lideres/Lucas.png",
  },
  {
    id: "marina-murilla",
    nome: "Marina Murilla",
    cargo: "Líder de Dados",
    areas: ["Dados"],
    linkedin: "https://www.linkedin.com/in/marina-dos-santos-murilla/",
    foto: "/fotos-lideres/Marina.png",
  },
];

function getAreaColor(area: string) {
  return AREA_COLORS[area] ?? { bg: "#4ADE8018", text: "#4ADE80", border: "#4ADE8030" };
}

export default function Equipe() {
  return (
    <section id="equipe" className="py-24" style={{ background: "#101010" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
            <div className="lg:col-span-5">
              <p className="section-label mb-4">Time</p>
              <h2 className="section-title mb-4">Nossa Equipe</h2>
              <p className="text-lg leading-relaxed" style={{ color: "#A0A0A0" }}>
                Mais de 50 membros unidos pelo IME-USP e pela vontade de transformar
                conhecimento técnico em projetos reais. A liderança organiza as frentes,
                mas o trabalho da IME Jr nasce do time completo.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="relative max-w-3xl lg:ml-auto">
                <div
                  className="absolute -inset-3 rounded-2xl"
                  style={{ border: "1px solid #2E2E2E", background: "#0B0B0B" }}
                />
                <div
                  className="relative overflow-hidden rounded-xl border aspect-[16/10] md:aspect-[16/9]"
                  style={{ borderColor: "#3E3E3E", background: "#000000" }}
                >
                  <img
                    src={TEAM_PHOTO_URL}
                    alt="Equipe da IME Jr"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: "center 45%" }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.42) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div style={{ borderTop: "1px solid #2E2E2E" }} className="pt-8">
          <div className="flex items-end justify-between gap-8 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#3E3E3E" }}>
                Liderança
              </p>
              <h3 className="text-xl md:text-2xl font-black text-white">
                Quem coordena as frentes da IME Jr
              </h3>
            </div>
            <p className="hidden md:block text-sm max-w-sm leading-relaxed" style={{ color: "#5E5E5E" }}>
              Abaixo destacamos as pessoas responsáveis por orientar áreas,
              projetos e decisões.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {lideres.map((lider, index) => (
              <Reveal key={lider.id} delay={index * 60} y={16}>
                <article
                  className="rounded-lg border overflow-hidden transition-all duration-200 group h-full"
                  style={{ background: "#1A1A1A", borderColor: "#2E2E2E" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#3E3E3E")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#2E2E2E")}
                >
                  <div
                    className="relative aspect-[4/5] overflow-hidden"
                    style={{
                      background: "#101010",
                      borderBottom: "1px solid #2E2E2E",
                    }}
                  >
                    <div
                      className="absolute left-4 right-4 bottom-0 h-px"
                      style={{ background: "#3E3E3E" }}
                    />
                    <img
                      src={lider.foto}
                      alt={`Foto de ${lider.nome}`}
                      loading="lazy"
                      className={`absolute inset-x-0 bottom-0 mx-auto object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.03] ${lider.fotoClassName ?? "h-[92%] w-[92%]"}`}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-base leading-tight min-h-10">
                          {lider.nome}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: "#FFDA33" }}>
                          {lider.cargo}
                        </p>
                      </div>

                      {lider.linkedin ? (
                        <a
                          href={lider.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn de ${lider.nome}`}
                          className="flex-shrink-0 transition-colors mt-0.5"
                          style={{ color: "#3E3E3E" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#3E3E3E")}
                        >
                          <Linkedin size={15} />
                        </a>
                      ) : null}
                    </div>

                    {lider.areas.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {lider.areas.map((area) => {
                          const color = getAreaColor(area);

                          return (
                            <span
                              key={area}
                              className="text-[10px] font-semibold px-2 py-1 rounded"
                              style={{
                                background: color.bg,
                                color: color.text,
                                border: `1px solid ${color.border}`,
                              }}
                            >
                              {area}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
