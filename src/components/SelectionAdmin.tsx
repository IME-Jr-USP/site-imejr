"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Copy, Pencil, Plus, X } from "lucide-react";
import { AdminAction, SelectionPage, SelectionResource, resourceLabels } from "@/lib/admin";

const emptyResource = { id: "", title: "", description: "", kind: "case" as SelectionResource["kind"], url: "", visible: true };
export default function SelectionAdmin({ page, busy, action }: { page: SelectionPage; busy: boolean; action: AdminAction }) {
  const [settings, setSettings] = useState({ title: page.title, edition: page.edition, introduction: page.introduction });
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState(emptyResource);
  const [remove, setRemove] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  useEffect(() => { if (!dirty) setSettings({ title: page.title, edition: page.edition, introduction: page.introduction }); }, [page.title, page.edition, page.introduction, dirty]);
  const active = page.resources.filter(item => item.visible).length;
  const run = (payload: Record<string, unknown>) => action({ ...payload, revision: page.revision });

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    if (await run({ action: "selection-settings", ...settings })) setDirty(false);
  }
  async function saveResource(event: React.FormEvent) {
    event.preventDefault();
    if (await run({ action: "selection-save-resource", ...form })) setForm(emptyResource);
  }
  function edit(item: SelectionResource) {
    setForm({ ...item }); setRemove("");
    document.getElementById("selection-resource-form")?.scrollIntoView({ block: "center", behavior: "smooth" });
    document.getElementById("resource-title")?.focus({ preventScroll: true });
  }
  async function copy() {
    setCopyError("");
    try { await navigator.clipboard.writeText(`${window.location.origin}/processo-seletivo/`); setCopied(true); }
    catch { setCopyError("Não foi possível copiar automaticamente. O endereço da página é /processo-seletivo/."); }
  }
  return <div>
    <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-7 border-b border-[#2E2E2E] pb-8 mb-10">
      <div className="max-w-2xl"><h2 className="text-2xl sm:text-3xl font-bold mb-3">Processo Seletivo</h2><p className="text-[#A0A0A0] text-sm leading-relaxed">Gerencie os links dos cases, modelos de apresentação e outros materiais. Os candidatos acessam os arquivos pela página pública, seguindo a ordem definida aqui.</p><p className="type-secondary mt-4 text-[#FFDA33]">{page.published ? "Página publicada" : "Página oculta"} · {active} material(is) visível(is)</p></div>
      <div className="flex flex-col items-start gap-3"><a href="/processo-seletivo/" target="_blank" rel="noopener noreferrer" className="activity-text-link">Ver página pública <ArrowUpRight size={15} /><span className="sr-only"> (nova aba)</span></a><button type="button" onClick={copy} className="text-sm text-[#A0A0A0] inline-flex gap-2 items-center hover:text-white">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Link copiado" : "Copiar link da página"}</button>{copyError && <p role="status" className="text-xs text-[#A0A0A0] max-w-xs">{copyError}</p>}</div>
    </header>
    <section aria-labelledby="selection-settings-title" className="border-b border-[#2E2E2E] pb-10 mb-10">
      <h3 id="selection-settings-title" className="text-xl font-bold mb-5">Apresentação da página</h3>
      <form onSubmit={saveSettings} className="max-w-3xl"><fieldset disabled={busy} className="space-y-5">
        <div className="grid sm:grid-cols-3 gap-5"><label htmlFor="selection-title" className="booking-label sm:col-span-2">Título<input id="selection-title" required minLength={2} maxLength={160} value={settings.title} onChange={e => { setDirty(true); setSettings(s => ({ ...s, title: e.target.value })); }} className="booking-input mt-2" /></label><label htmlFor="selection-edition" className="booking-label">Edição (opcional)<input id="selection-edition" maxLength={80} placeholder="Ex.: 2026.2" value={settings.edition} onChange={e => { setDirty(true); setSettings(s => ({ ...s, edition: e.target.value })); }} className="booking-input mt-2" /></label></div>
        <label htmlFor="selection-introduction" className="booking-label block">Orientações para os candidatos<textarea id="selection-introduction" maxLength={2500} rows={4} value={settings.introduction} onChange={e => { setDirty(true); setSettings(s => ({ ...s, introduction: e.target.value })); }} className="booking-input mt-2" /></label>
        <button disabled={busy || !dirty} className="btn-primary disabled:opacity-40">Salvar apresentação</button>
      </fieldset></form>
    </section>
    <section aria-labelledby="selection-links-title" className="mb-10">
      <h3 id="selection-links-title" className="text-xl font-bold mb-5">Cases e materiais</h3>
      <form id="selection-resource-form" onSubmit={saveResource} className="max-w-3xl"><fieldset disabled={busy} className="space-y-5">
        <div className="flex items-center justify-between gap-3"><p className="type-secondary text-[#A0A0A0]">{form.id ? "Editar material" : "Adicionar link"}</p>{form.id && <button type="button" onClick={() => setForm(emptyResource)} className="text-sm text-[#A0A0A0] inline-flex gap-2"><X size={15} />Cancelar edição</button>}</div>
        <div className="grid sm:grid-cols-3 gap-5"><label htmlFor="resource-title" className="booking-label sm:col-span-2">Nome do material *<input id="resource-title" required minLength={2} maxLength={160} placeholder="Ex.: Case A" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} className="booking-input mt-2" /></label><label htmlFor="resource-kind" className="booking-label">Tipo<select id="resource-kind" value={form.kind} onChange={e => setForm(s => ({ ...s, kind: e.target.value as SelectionResource["kind"] }))} className="booking-input mt-2"><option value="case">Case</option><option value="modelo">Modelo</option><option value="material">Material de apoio</option></select></label></div>
        <label htmlFor="resource-url" className="booking-label block">Link do arquivo *<input id="resource-url" type="url" required maxLength={2000} placeholder="https://..." value={form.url} onChange={e => setForm(s => ({ ...s, url: e.target.value }))} className="booking-input mt-2" /><span className="block text-xs text-[#A0A0A0] font-normal leading-relaxed mt-2">Cole o link do Drive, documento, PDF ou apresentação. Confira se os candidatos têm permissão de acesso. O arquivo continua hospedado no serviço do link.</span></label>
        <label htmlFor="resource-description" className="booking-label block">Descrição (opcional)<textarea id="resource-description" maxLength={1000} rows={3} value={form.description} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} className="booking-input mt-2" /></label>
        <label className="flex items-center gap-3 text-sm text-[#A0A0A0]"><input type="checkbox" checked={form.visible} onChange={e => setForm(s => ({ ...s, visible: e.target.checked }))} className="accent-[#FFDA33]" />Exibir este material quando a página estiver publicada</label>
        <button disabled={busy} className="btn-primary disabled:opacity-40"><Plus size={16} />{form.id ? "Salvar material" : "Adicionar material"}</button>
      </fieldset></form>
      <ol className="mt-10">{page.resources.map((item, index) => <li key={item.id} className="border-t border-[#2E2E2E] py-5"><div className="flex flex-col sm:flex-row gap-5 sm:items-start justify-between"><div className="min-w-0"><p className="type-secondary text-[#A0A0A0] mb-2">{String(index + 1).padStart(2, "0")} / {resourceLabels[item.kind]} · {item.visible ? "Visível" : "Oculto"}</p><h4 className="font-bold mb-1">{item.title}</h4><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#A0A0A0] hover:text-white underline break-all">{item.url}<span className="sr-only"> (nova aba)</span></a>{item.description && <p className="text-sm text-[#A0A0A0] mt-2 whitespace-pre-wrap">{item.description}</p>}</div><div className="flex flex-wrap items-center gap-4 shrink-0"><div className="flex gap-1"><button type="button" disabled={busy || index === 0} aria-label={`Mover ${item.title} para cima`} onClick={() => run({ action: "selection-move-resource", id: item.id, direction: "up" })} className="p-2 disabled:opacity-25"><ArrowUp size={16} /></button><button type="button" disabled={busy || index === page.resources.length - 1} aria-label={`Mover ${item.title} para baixo`} onClick={() => run({ action: "selection-move-resource", id: item.id, direction: "down" })} className="p-2 disabled:opacity-25"><ArrowDown size={16} /></button></div><button type="button" disabled={busy} onClick={() => edit(item)} className="inline-flex items-center gap-1 text-sm text-[#FFDA33] disabled:opacity-40"><Pencil size={14} />Editar</button><button type="button" disabled={busy} onClick={() => run({ action: "selection-toggle-resource", id: item.id })} className="text-sm text-[#A0A0A0] disabled:opacity-40">{item.visible ? "Ocultar" : "Mostrar"}</button><button type="button" disabled={busy} onClick={() => setRemove(item.id)} className="text-sm text-[#A0A0A0] disabled:opacity-40">Excluir</button></div></div>{remove === item.id && <div className="flex flex-wrap items-center gap-4 mt-4 text-sm"><span>Remover este link da página?</span><button type="button" disabled={busy} onClick={async () => { if (await run({ action: "selection-remove-resource", id: item.id })) { setRemove(""); if (form.id === item.id) setForm(emptyResource); } }} className="text-[#FFDA33] font-semibold">Confirmar exclusão</button><button type="button" onClick={() => setRemove("")} className="text-[#A0A0A0]">Cancelar</button></div>}</li>)}</ol>
      {!page.resources.length && <p className="mt-8 text-sm text-[#A0A0A0]">Nenhum material cadastrado. Adicione os links dos cases e modelos acima.</p>}
    </section>
    <section aria-labelledby="selection-publish-title" className="border-t border-[#2E2E2E] pt-8"><h3 id="selection-publish-title" className="text-xl font-bold mb-3">Publicação</h3><p className="text-sm text-[#A0A0A0] max-w-2xl leading-relaxed mb-5">A página começa oculta. Quando os materiais estiverem prontos, publique e compartilhe o link com os candidatos. Ocultar a página não altera as permissões dos arquivos nos serviços externos.</p>{dirty && <p className="text-sm text-[#FFDA33] mb-4">Salve as alterações da apresentação antes de publicar.</p>}<button type="button" disabled={busy || (!page.published && (dirty || active === 0))} onClick={() => run({ action: "selection-publish", published: !page.published })} className={`${page.published ? "btn-ghost" : "btn-primary"} disabled:opacity-40`}>{page.published ? "Ocultar página" : "Publicar página"}</button></section>
  </div>;
}
