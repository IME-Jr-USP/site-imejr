import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  FileSpreadsheet,
  LineChart,
  Microscope,
  PieChart,
  SearchCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const accent = "#FFDA33";
const accentText = "#101010";

const pillars = [
  {
    title: "Dados para empresas",
    text: "Ajudamos negócios a entender indicadores, clientes, operações e oportunidades com análises claras, métricas bem definidas e visualizações úteis.",
  },
  {
    title: "Dados para pesquisa",
    text: "Apoiamos pesquisadores, iniciações científicas, grupos acadêmicos e artigos com estruturação, análise e interpretação de dados com rigor estatístico.",
  },
  {
    title: "Modelagem e decisão",
    text: "Transformamos bases dispersas em evidências: dashboards, modelos estatísticos, previsões e relatórios que ajudam a decidir melhor.",
  },
];

const capabilities = [
  {
    icon: BarChart3,
    title: "Análise empresarial",
    text: "Indicadores, funis, desempenho operacional, comportamento de clientes e leitura de resultados para tomada de decisão.",
  },
  {
    icon: Microscope,
    title: "Apoio acadêmico",
    text: "Tratamento e análise de dados para pesquisas, iniciações científicas, TCCs, artigos e projetos de laboratório.",
  },
  {
    icon: Database,
    title: "Bases de dados",
    text: "Limpeza, organização, padronização, cruzamento de tabelas e estruturação de dados para análise confiável.",
  },
  {
    icon: LineChart,
    title: "Dashboards e métricas",
    text: "Painéis, visualizações e relatórios que tornam resultados fáceis de acompanhar, comparar e comunicar.",
  },
  {
    icon: PieChart,
    title: "Estatística aplicada",
    text: "Testes, modelagem, análise exploratória, inferência, desenho de métricas e interpretação de resultados.",
  },
  {
    icon: BrainCircuit,
    title: "Machine Learning",
    text: "Modelos para previsão, classificação, segmentação e descoberta de padrões em dados estruturados.",
  },
  {
    icon: FileSpreadsheet,
    title: "Relatórios técnicos",
    text: "Documentação de metodologia, resultados, limitações e próximos passos para públicos técnicos e não técnicos.",
  },
  {
    icon: SearchCheck,
    title: "Diagnóstico de dados",
    text: "Avaliação de qualidade, disponibilidade, inconsistências e viabilidade antes de avançar para análises mais profundas.",
  },
];

const process = [
  "Entendimento da pergunta e dos dados disponíveis",
  "Organização da base, hipóteses e metodologia de análise",
  "Construção das análises, modelos, dashboards ou relatórios",
  "Entrega dos resultados com interpretação e próximos passos",
];

const technologies = [
  "Python",
  "R",
  "SQL",
  "Pandas",
  "Scikit-learn",
  "Dashboards",
  "Estatística",
  "Machine Learning",
  "IA",
  "Planilhas",
];

export const metadata: Metadata = {
  title: "Dados | IME Jr",
  description:
    "Soluções de análise de dados da IME Jr para empresas, pesquisadores, iniciações científicas e projetos acadêmicos.",
  keywords: [
    "análise de dados",
    "ciência de dados",
    "dados",
    "estatística",
    "estatística aplicada",
    "modelagem estatística",
    "análise exploratória",
    "dashboards",
    "visualização de dados",
    "relatórios técnicos",
    "indicadores",
    "métricas",
    "business intelligence",
    "BI",
    "machine learning",
    "inteligência artificial",
    "Python",
    "R",
    "SQL",
    "Pandas",
    "Scikit-learn",
    "limpeza de dados",
    "tratamento de dados",
    "bases de dados",
    "pesquisa acadêmica",
    "iniciação científica",
    "consultoria em dados",
    "IME Jr",
    "USP",
  ],
};

export default function DadosPage() {
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
                  Serviços / Dados
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight max-w-5xl">
                  Dados bem analisados para decisões melhores e pesquisas mais
                  sólidas.
                </h1>
              </Reveal>

              <Reveal className="lg:col-span-4" delay={120} y={18}>
                <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "#A0A0A0" }}>
                  Unimos estatística, programação e visão analítica para
                  transformar dados empresariais e acadêmicos em resultados
                  claros, confiáveis e acionáveis.
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Link
                    href="#comece-seu-projeto"
                    className="btn-primary justify-center"
                    style={{ background: accent, color: accentText }}
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
              <p className="section-label mb-4" style={{ color: accent }}>Frentes de atuação</p>
              <h2 className="section-title">
                De dashboards a modelos estatísticos, cuidamos do caminho entre
                dado bruto e resposta.
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
                <p className="section-label mb-4" style={{ color: accent }}>Como trabalhamos</p>
                <h2 className="section-title mb-5">
                  Método claro para sair da pergunta e chegar na evidência.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "#A0A0A0" }}>
                  Começamos entendendo a decisão, hipótese ou problema de
                  pesquisa. Depois organizamos os dados e construímos análises
                  que possam ser defendidas tecnicamente e entendidas na prática.
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
                <p className="section-label mb-4" style={{ color: accent }}>Stack flexível</p>
                <h2 className="section-title mb-5">
                  Ferramentas escolhidas pelo tipo de dado e pelo objetivo da
                  análise.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "#A0A0A0" }}>
                  A abordagem muda conforme a base, o prazo, a pergunta e o
                  público final. O foco é entregar uma análise útil, reprodutível
                  e bem comunicada.
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
                  "linear-gradient(135deg, rgba(255,218,51,0.16) 0%, #1A1A1A 42%, rgba(255,218,51,0.07) 62%, #101010 100%)",
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
                    style={{ filter: "brightness(0)" }}
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                  Tem uma base, pergunta ou pesquisa que precisa virar resposta?
                </h2>
                <p className="text-base leading-relaxed max-w-3xl" style={{ color: "#A0A0A0" }}>
                  Conte o objetivo. A gente ajuda a transformar dados em método,
                  análise e resultado compreensível.
                </p>
              </div>

              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Link
                  href="/agendamento?area=dados"
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
