"use client";

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import { navigation } from "@/data/navigation";
import { socialLinks } from "@/data/socials";

const socials = [
  { icon: Facebook, ...socialLinks.facebook },
  { icon: Instagram, ...socialLinks.instagram },
  { icon: Linkedin, ...socialLinks.linkedin },
  { icon: Youtube, ...socialLinks.youtube },
];

const navLinks = [
  ...navigation,
  { label: "Contato", href: "/#contato" },
  { label: "Área da equipe", href: "/admin" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#000000", borderTop: "1px solid #1A1A1A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="IME Jr"
                width={100}
                height={40}
                className="h-9 w-auto object-contain"
              />
              <span className="font-black text-white text-md tracking-tight">
                IME Jr
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#5E5E5E" }}>
              Empresa Júnior do Instituto de Matemática e Estatística da
              Universidade de São Paulo.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background: "#1A1A1A", color: "#5E5E5E" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#FFDA33";
                    e.currentTarget.style.color = "#101010";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#1A1A1A";
                    e.currentTarget.style.color = "#5E5E5E";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="type-secondary mb-4" style={{ color: "#3E3E3E" }}>
              Navegação
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm transition-colors"
                    style={{ color: "#5E5E5E" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#5E5E5E")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="type-secondary mb-4" style={{ color: "#3E3E3E" }}>
              Contatos
            </h4>
            <div className="space-y-2.5 text-sm" style={{ color: "#5E5E5E" }}>
              <p>
                <a
                  href="https://maps.app.goo.gl/RMpqiJx4gpfB848v6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors inline-block"
                  style={{ color: "#5E5E5E" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#5E5E5E")}
                >
                  R. do Matão, 1010<br />
                  Cidade Universitária<br />
                  São Paulo, SP
                </a>
              </p>
              <p>
                <a
                  href="tel:+551130916241"
                  className="transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#5E5E5E")}
                >
                  +55 11 3091-6241
                </a>
              </p>
              <div className="space-y-2.5 text-sm" style={{ color: "#5E5E5E" }}>
                <p>
                  <a
                    href="mailto:contato@imejr.com"
                    className="transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#5E5E5E")}
                  >
                    contato@imejr.com
                  </a>
                </p>
                <p style={{ color: "#3E3E3E" }}>CNPJ: 26.531.013/0001-80</p>
              </div>
            </div>
          </div>
          </div>
        </div>
    </footer>
  );
}
