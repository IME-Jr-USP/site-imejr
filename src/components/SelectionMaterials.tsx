"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { resourceLabels, SelectionResource } from "@/lib/admin";

type PublicPage = { published: boolean; title?: string; edition?: string; introduction?: string; resources?: Omit<SelectionResource, "visible">[] };
export default function SelectionMaterials() {
  const [page, setPage] = useState<PublicPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setError("");
    fetch("/api/selection.php", { cache: "no-store", credentials: "same-origin", signal: abort.signal })
      .then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.message); setPage(result); })
      .catch(reason => { if (reason.name !== "AbortError") { setPage(null); setError("Não foi possível carregar os materiais. Tente novamente ou fale com a equipe."); } })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [reload]);
  useEffect(() => {
    const onFocus = () => setReload(current => current + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <header className="border-b border-[#2E2E2E] pb-10 mb-10">
      <p className="type-secondary text-[#FFDA33] mb-5">IME Jr / Processo Seletivo{page?.published && page.edition ? ` / ${page.edition}` : ""}</p>
      <h1 className="brand-heading text-4xl sm:text-5xl md:text-6xl max-w-4xl mb-7 break-words">{page?.published ? page.title : "Materiais do Processo Seletivo"}</h1>
      {page?.published && page.introduction && <p className="text-[#A0A0A0] text-base sm:text-lg leading-relaxed whitespace-pre-wrap max-w-3xl">{page.introduction}</p>}
    </header>
    {loading && <p role="status" className="text-[#A0A0A0] py-8">Carregando materiais…</p>}
    {!loading && error && <div role="alert" className="border-l-2 border-[#FFDA33] pl-5"><p className="text-[#A0A0A0]">{error}</p><button type="button" className="text-[#FFDA33] underline text-sm mt-4" onClick={() => setReload(current => current + 1)}>Tentar novamente</button></div>}
    {!loading && !error && (!page?.published || !page.resources?.length) && <p className="text-[#A0A0A0] leading-relaxed max-w-2xl">Os materiais não estão disponíveis no momento. Siga as orientações enviadas pela equipe responsável pelo processo seletivo.</p>}
    {!loading && !error && page?.published && <ol aria-label="Cases e materiais de apoio">{page.resources?.map((item, index) => <li key={item.id} className="border-b border-[#2E2E2E] py-7 sm:py-9"><a href={item.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[32px_1fr_24px] sm:grid-cols-[50px_1fr_24px] gap-4 items-start"><span className="type-secondary text-[#777777] mt-1">{String(index + 1).padStart(2, "0")}</span><div><p className="type-secondary text-[#FFDA33] mb-2">{resourceLabels[item.kind]}</p><h2 className="text-xl sm:text-2xl font-bold group-hover:text-[#FFDA33] transition-colors break-words">{item.title}</h2>{item.description && <p className="mt-3 text-sm text-[#A0A0A0] leading-relaxed whitespace-pre-wrap">{item.description}</p>}<span className="inline-flex items-center gap-2 text-xs text-[#A0A0A0] mt-4"><FileText size={13} aria-hidden="true" />Acessar material<span className="sr-only"> (abre em nova aba)</span></span></div><ArrowUpRight size={22} className="text-[#FFDA33] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" /></a></li>)}</ol>}
    <footer className="mt-12 text-sm text-[#A0A0A0] leading-relaxed"><p className="mb-3">Dúvidas sobre os materiais ou acesso aos arquivos?</p><a href="mailto:contato@imejr.com" className="activity-text-link"><Mail size={15} aria-hidden="true" />contato@imejr.com</a></footer>
  </div>;
}
