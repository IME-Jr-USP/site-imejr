"use client";

import { useState, useEffect, useRef, useId, Fragment } from "react";
import { ChevronDown, ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, serviceLinks } from "@/data/navigation";

function ServicesMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const pathname = usePathname();
  const active = pathname.startsWith("/servicos/");

  useEffect(() => {
    const onOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onOutsideClick);
    return () => document.removeEventListener("pointerdown", onOutsideClick);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div
      ref={rootRef}
      className={mobile ? "border-y border-[#2E2E2E] my-1" : "relative"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-2 rounded-lg transition-colors hover:text-white ${mobile ? "w-full px-4 py-3 font-medium" : "px-4 py-2 text-sm font-medium"} ${active || open ? "text-[#FFDA33]" : "text-[#A0A0A0]"}`}
      >
        Serviços
        <ChevronDown size={15} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id={id}
        hidden={!open}
        className={mobile ? "px-4 pb-3" : "absolute left-0 top-full mt-3 w-80 bg-[#171717] border border-[#333333] shadow-2xl p-2 rounded-lg"}
      >
        {serviceLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname.replace(/\/$/, "") === link.href ? "page" : undefined}
            onClick={() => { setOpen(false); onNavigate?.(); }}
            className="group block px-4 py-3 rounded-md hover:bg-white/5 focus-visible:bg-white/5 transition-colors"
          >
            <span className="flex items-center justify-between font-bold text-white">
              {link.label}<ArrowUpRight size={16} aria-hidden="true" className="text-[#FFDA33]" />
            </span>
            <span className="block mt-1 text-xs leading-relaxed text-[#A0A0A0]">{link.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const mainLinks = navigation.filter((link) => !link.href.startsWith("/servicos/"));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const solid = scrolled || open || pathname !== "/";
  const homeHref = (href: string) =>
    pathname === "/" && href.startsWith("/#") ? href.slice(1) : href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: solid ? "rgba(16,16,16,0.97)" : "transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
        borderBottom: `1px solid ${solid ? "#2E2E2E" : "transparent"}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="IME Jr" width={80} height={32} className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity" priority />
            <span className="font-black text-white tracking-tight">IME Jr</span>
          </Link>
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1">
            {mainLinks.map((link, index) => {
              const active = pathname.replace(/\/$/, "") === link.href;
              return (
                <Fragment key={link.href}>
                  <Link
                    href={homeHref(link.href)}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:text-white ${active ? "text-[#FFDA33]" : "text-[#A0A0A0]"}`}
                  >
                    {link.label}
                  </Link>
                  {index === 0 && <ServicesMenu />}
                </Fragment>
              );
            })}
            <Link href={homeHref("/#contato")} className="ml-3 btn-primary text-sm">Fale Conosco</Link>
          </nav>
          <button
            ref={toggleRef}
            type="button"
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        hidden={!open}
        aria-label="Navegação principal no celular"
        className="lg:hidden px-4 py-3 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-[#101010] border-t border-[#2E2E2E]"
      >
        {mainLinks.map((link, index) => {
          const active = pathname.replace(/\/$/, "") === link.href;
          return (
            <Fragment key={link.href}>
              <Link
                href={homeHref(link.href)}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block font-medium px-4 py-3 rounded-lg transition-colors hover:text-white ${active ? "text-[#FFDA33]" : "text-[#A0A0A0]"}`}
              >
                {link.label}
              </Link>
              {index === 0 && <ServicesMenu mobile onNavigate={() => setOpen(false)} />}
            </Fragment>
          );
        })}
        <Link href={homeHref("/#contato")} onClick={() => setOpen(false)} className="mt-2 btn-primary justify-center text-sm w-full">Fale Conosco</Link>
      </nav>
    </header>
  );
}
