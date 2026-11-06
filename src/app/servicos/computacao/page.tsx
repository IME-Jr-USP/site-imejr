import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Database,
  Globe2,
  LockKeyhole,
  ServerCog,
  Workflow,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const accent = "#FFDA33";

const pillars = [
  {
    title: "Produtos digitais",
    text: "Sites, plataformas, aplicativos e sistemas internos criados para resolver demandas reais, com atenção a usabilidade, manutenção e escala.",
  },
  {
    title: "IA e automação",
    text: "Aplicações com Machine Learning, automações de rotina, integrações com APIs e uso responsável de ferramentas modernas de inteligência artificial.",
  },
  {
    title: "Evolução técnica",
    text: "Revisão de sistemas existentes, melhoria de produtos criados com IA, organização de back-end, bancos de dados, segurança e infraestrutura.",
  },
];

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Machine Learning",
    text: "Modelos de previsão, classificação, recomendação e análise inteligente integrados a produtos e processos.",
  },
  {
    icon: Workflow,
    title: "Automações",
    text: "Fluxos internos, rotinas repetitivas, relatórios, integrações e ferramentas para reduzir trabalho manual.",
  },
  {
    icon: ServerCog,
    title: "Back-end e APIs",
    text: "Arquitetura de serviços, autenticação, regras de negócio, integrações externas e bancos de dados.",
  },
  {
    icon: Globe2,
    title: "Web, apps e plataformas",
    text: "Interfaces modernas em React, Next.js e WordPress, além de sistemas sob medida para operação e atendimento.",
  },
  {
    icon: Wrench,
    title: "Produtos criados com IA",
    text: "Auditoria, correção, refatoração e evolução de protótipos feitos com ferramentas de IA para deixá-los prontos para uso real.",
  },
  {
    icon: LockKeyhole,
    title: "Cybersegurança",
    text: "Revisão de boas práticas, autenticação, permissões, exposição de dados e pontos frágeis em aplicações web.",
  },
  {
    icon: Database,
    title: "Dados e infraestrutura",
    text: "Modelagem de bancos, deploy, serviços em nuvem, pipelines simples e organização técnica para sustentar o produto.",
  },
  {
    icon: Code2,
    title: "Consultoria técnica",
    text: "Diagnóstico de stack, arquitetura, viabilidade, priorização de funcionalidades e caminhos técnicos para o projeto avançar.",
  },
];

const process = [
  "Entendimento do problema e definição do escopo",
  "Proposta técnica com entregáveis, prioridades e cronograma",
  "Desenvolvimento com acompanhamento próximo",
  "Entrega, documentação e orientação para continuidade",
];

const technologies = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "WordPress",
  "SQL",
  "Machine Learning",
  "APIs",
  "Cloud",
  "UX/UI",
];

export const metadata: Metadata = {
  title: "Computação | IME Jr",
  description:
    "Soluções de computação da IME Jr: desenvolvimento web, back-end, Machine Learning, automações, cybersegurança e evolução de produtos digitais.",
  keywords: [
    "computação",
    "tecnologia",
    "desenvolvimento de software",
    "software sob medida",
    "desenvolvimento web",
    "sistemas web",
    "aplicativos",
    "front-end",
    "back-end",
    "APIs",
    "integração de sistemas",
    "automação",
    "automação de processos",
    "machine learning",
    "inteligência artificial",
    "produtos com IA",
    "cybersegurança",
    "segurança da informação",
    "infraestrutura",
    "bancos de dados",
    "cloud",
    "UX/UI",
    "consultoria técnica",
    "consultoria em tecnologia",
    "desenvolvimento React",
    "desenvolvimento Next.js",
    "desenvolvimento Python",
    "WordPress",
    "IME Jr",
    "USP",
  ],
};

export default function ComputacaoPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#000000" }}>
        <section
          className="pt-32 pb-24"
          style={{ borderBottom: "1px solid #2E2E2E" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid lg:grid-cols-12 gap-12 items-end">
              <Reveal className="lg:col-span-8" y={18}>
                <p className="section-label mb-4" style={{ color: accent }}>
                  Serviços / Computação
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight max-w-5xl">
                  Tecnologia robusta para tirar ideias do papel e evoluir
                  produtos reais.
                </h1>
              </Reveal>

              <Reveal className="lg:col-span-4" delay={120} y={18}>
                <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "#A0A0A0" }}>
                  Desenvolvemos soluções digitais completas com rigor técnico,
                  visão prática e acesso ao ecossistema de excelência da USP.
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Link
                    href="#comece-seu-projeto"
                    className="btn-primary justify-center"
                    style={{ background: accent, color: "#101010" }}
                  >
                    Conversar sobre um projeto
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "#101010" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-px" style={{ background: "#2E2E2E" }}>
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 80} y={16}>
                <div className="service-panel p-8 h-full" style={{ background: "#101010" }}>
                  <h2 className="text-xl font-black text-white mb-4">
                    {pillar.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
                    {pillar.text}
                  </p>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" style={{ background: "#000000" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl mb-14">
              <p className="section-label mb-4">Frentes de atuação</p>
              <h2 className="section-title">
                Do Machine Learning ao back-end, cuidamos do caminho técnico
                inteiro.
              </h2>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {capabilities.map(({ icon: Icon, title, text }, index) => (
                <Reveal key={title} delay={index * 45} y={16}>
                <article
                  className="service-panel rounded-lg p-6 border h-full"
                  style={{ background: "#1A1A1A", borderColor: "#2E2E2E" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                    style={{ background: "#FFDA3318", border: "1px solid #FFDA3335" }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <h3 className="font-black text-white mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
                    {text}
                  </p>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" style={{ background: "#101010" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-14">
              <Reveal className="lg:col-span-5">
                <p className="section-label mb-4">Como trabalhamos</p>
                <h2 className="section-title mb-5">
                  Método claro para sair do problema e chegar na entrega.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "#A0A0A0" }}>
                  Cada projeto começa com diagnóstico. A partir disso, definimos
                  prioridades, riscos e entregáveis para construir com velocidade
                  sem perder qualidade técnica.
                </p>
              </Reveal>

              <Reveal className="lg:col-span-7" delay={100} y={18} style={{ borderTop: "1px solid #2E2E2E" }}>
                {process.map((step, index) => (
                  <div
                    key={step}
                    className="service-process-row grid grid-cols-[56px_1fr] gap-6 py-6"
                    style={{ borderBottom: "1px solid #2E2E2E" }}
                  >
                    <span className="text-sm font-black" style={{ color: accent }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-semibold text-white">{step}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-24" style={{ background: "#000000" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <Reveal className="lg:col-span-5">
                <p className="section-label mb-4">Stack flexível</p>
                <h2 className="section-title mb-5">
                  Ferramentas modernas escolhidas para o seu contexto.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "#A0A0A0" }}>
                  A tecnologia vem depois do problema. Escolhemos a stack de
                  acordo com custo, prazo, manutenção, integrações e maturidade
                  do produto.
                </p>
              </Reveal>

              <Reveal className="lg:col-span-7 flex flex-wrap gap-3" delay={100} y={18}>
                {technologies.map((tech, index) => (
                  <span
                    key={tech}
                    className="service-pill text-sm font-semibold px-4 py-2 rounded-lg border"
                    style={{
                      borderColor: "#2E2E2E",
                      color: "#A0A0A0",
                      background: "#101010",
                      transitionDelay: `${index * 12}ms`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id="comece-seu-projeto"
          className="py-24"
          style={{ background: "#101010" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal
              y={18}
              className="animated-service-gradient rounded-lg p-8 md:p-12 grid lg:grid-cols-12 gap-10 items-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,218,51,0.18) 0%, #1A1A1A 42%, rgba(255,218,51,0.08) 62%, #101010 100%)",
                border: "1px solid #FFDA3335",
              }}
            >
              <div className="lg:col-span-8">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                  style={{ background: accent, border: "1px solid #FFE578" }}
                >
                  <Image
                    src="/logo.png"
                    alt="IME Jr"
                    width={36}
                    height={20}
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                  Tem uma ideia, sistema ou processo que precisa virar solução?
                </h2>
                <p className="text-base leading-relaxed max-w-3xl" style={{ color: "#A0A0A0" }}>
                  Conte o desafio. A gente ajuda a transformar em escopo,
                  arquitetura e entrega concreta.
                </p>
              </div>

              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Link
                  href="/agendamento?area=computacao"
                  className="btn-primary justify-center w-full sm:w-auto"
                  style={{ background: accent, color: "#101010" }}
                >
                  Solicitar reunião
                  <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
