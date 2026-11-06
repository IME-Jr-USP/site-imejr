import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ActivityMedia from "@/components/ActivityMedia";
import { events, initiatives, talksMedia } from "@/data/initiatives";
import { socialLinks } from "@/data/socials";

export const metadata: Metadata = {
  title: "Atividades | IME Jr",
  description: "Conheça o Cursinho IMEnsina, as palestras com empresas, a aMostra de Estatística e a Semana da Computação, atividades da IME Jr no IME-USP.",
};

const activities = [
  initiatives[0],
  {
    id: "palestras",
    category: "Formação e mercado",
    title: "Palestras com empresas",
    description: "Recebemos profissionais e empresas para discutir carreira, empreendedorismo e a realidade do mercado de trabalho. Também realizamos visitas técnicas, aproximando nossos membros da rotina das organizações e das possibilidades de atuação em Computação e Dados.",
    href: "/#contato",
    media: talksMedia,
  },
  ...events,
];

export default function AtividadesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-black">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
          <p className="type-secondary text-[#FFDA33] mb-5">Além dos serviços</p>
          <h1 className="brand-heading text-4xl sm:text-6xl md:text-7xl mb-7">Atividades da IME Jr.</h1>
          <p className="max-w-4xl text-lg md:text-xl leading-relaxed text-[#A0A0A0]">
            Conheça algumas das atividades que realizamos ao longo do ano.
            Nas nossas redes sociais, acompanhe as novidades, os próximos eventos
            e os conteúdos da IME Jr.
          </p>
          <div className="mt-8 border-l-2 border-[#FFDA33] pl-5">
            <p className="type-secondary text-[#A0A0A0] mb-3">Acompanhe a IME Jr</p>
            <nav aria-label="Redes sociais da IME Jr" className="flex flex-wrap gap-x-7 gap-y-3">
              {Object.values(socialLinks).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-white transition-colors hover:text-[#FFDA33]"
                >
                  {social.label}
                  <ArrowUpRight size={14} aria-hidden="true" className="text-[#FFDA33] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              ))}
            </nav>
          </div>
        </section>
        <section aria-label="Nossas atividades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {activities.map((activity, index) => (
            <article id={activity.id} key={activity.id} className="border-t border-[#2E2E2E] py-12 md:py-16">
              <Reveal className="grid md:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center" y={20}>
                <ActivityMedia media={activity.media} wide className={`md:col-span-6 ${index % 2 ? "md:order-2" : ""}`} />
                <div className="md:col-span-6">
                  <p className="type-secondary text-[#A0A0A0] mb-5">{String(index + 1).padStart(2, "0")} / {activity.category}</p>
                  <h2 className="brand-heading text-3xl sm:text-4xl mb-5">
                    <Link
                      href={activity.href}
                      target={activity.href.startsWith("https://") ? "_blank" : undefined}
                      rel={activity.href.startsWith("https://") ? "noopener noreferrer" : undefined}
                      className="group inline hover:text-[#FFDA33] transition-colors"
                    >
                      {activity.title}<ArrowUpRight className="inline-block ml-2 mb-1 text-[#FFDA33] group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" size={25} aria-hidden="true" />
                      {activity.href.startsWith("https://") && <span className="sr-only"> (abre em nova aba)</span>}
                    </Link>
                  </h2>
                  <p className="text-[#A0A0A0] leading-relaxed">{activity.description}</p>
                </div>
              </Reveal>
            </article>
          ))}
          <Link href="/#contato" className="activity-text-link mt-8">Parcerias e informações <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
