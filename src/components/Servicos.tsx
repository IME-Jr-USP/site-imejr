"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const services = [
  {
    slug: "computacao",
    num: "01",
    accent: "#FFDA33",
    title: "Computação",
    description:
      "Criamos, evoluímos e integramos soluções digitais completas, de sistemas web a produtos com Machine Learning e automações inteligentes.",
    body:
      "Atuamos em desenvolvimento de software sob medida, back-end, front-end, aplicativos, automações, integração de APIs, produtos com IA, infraestrutura, segurança e melhoria de sistemas já existentes.",
    highlights: [
      "Machine Learning aplicado a produtos reais",
      "Automações de processos internos",
      "Back-end, APIs e integrações entre sistemas",
      "Sites, plataformas, dashboards e aplicativos",
      "Auditoria, correção e evolução de produtos criados com IA",
      "Cybersegurança, revisão técnica e boas práticas",
      "UX/UI, arquitetura de software e metodologias ágeis",
    ],
    note:
      "Trabalhamos com tecnologias como React, Next.js, Node.js, Python, WordPress, bancos de dados, serviços em nuvem e ferramentas modernas de desenvolvimento.",
  },
  {
    slug: "dados",
    num: "02",
    accent: "#FFDA33",
    title: "Dados",
    description:
      "Transformamos dados em clareza, seja para decisões empresariais, pesquisas acadêmicas ou projetos científicos.",
    body:
      "Apoiamos empresas que querem entender melhor seus indicadores, operações e clientes, e também pesquisadores, alunos e grupos acadêmicos que precisam estruturar, analisar ou interpretar dados com rigor estatístico.",
    highlights: [
      "Análises para negócios, operações e tomada de decisão",
      "Apoio técnico para pesquisas, iniciações científicas e artigos",
      "Limpeza, organização e estruturação de bases de dados",
      "Dashboards, métricas e visualizações",
      "Modelagem estatística e análise exploratória",
      "Machine Learning para previsão, classificação e descoberta de padrões",
      "Python, R, SQL, IA e ferramentas modernas de dados",
    ],
    note:
      "Unimos estatística, programação e visão analítica para entregar resultados compreensíveis, bem fundamentados e úteis para o seu objetivo.",
  },
];

export default function Servicos() {
  return (
    <section id="servicos" style={{ background: "#000000" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <p className="section-label mb-4">O que fazemos</p>
        <h2 className="section-title">Serviços</h2>
      </div>

      {/* Services — full-width rows */}
      <div style={{ borderTop: "1px solid #2E2E2E" }}>
        {services.map((s, i) => (
          <Reveal key={s.num} delay={i * 60} y={20}>
            <div
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-12 gap-12 items-start"
              style={{
                borderBottom: "1px solid #2E2E2E",
              }}
            >
              {/* Number + title */}
              <div className="lg:col-span-4">
                <span
                  className="text-xs font-bold tracking-widest mb-3 block"
                  style={{ color: s.accent }}
                >
                  {s.num}
                </span>
                <h3 className="text-3xl font-black text-white mb-4">{s.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: "#A0A0A0" }}>
                  {s.description}
                </p>
              </div>

              {/* Body */}
              <div className="lg:col-span-5">
                <p className="text-base leading-relaxed mb-4" style={{ color: "#5E5E5E" }}>
                  {s.body}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3E3E3E" }}>
                  {s.note}
                </p>
              </div>

              {/* CTAs */}
              <div className="lg:col-span-3 flex flex-col gap-3 lg:items-end">
                <Link
                  href={`/servicos/${s.slug}`}
                  className="btn-primary text-sm whitespace-nowrap"
                  style={{
                    background: s.accent,
                    color: "#101010",
                  }}
                >
                  Saiba mais
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="pb-8" />
    </section>
  );
}
