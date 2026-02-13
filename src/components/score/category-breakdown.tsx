'use client';

import { useState } from 'react';
import type { ScoreCategory } from '@/lib/scorer/types';

function getCategoryColor(index: number): { bar: string; bg: string } {
  const colors = [
    { bar: 'bg-emerald-500', bg: 'bg-emerald-500/20' },
    { bar: 'bg-sky-500', bg: 'bg-sky-500/20' },
    { bar: 'bg-violet-500', bg: 'bg-violet-500/20' },
    { bar: 'bg-amber-500', bg: 'bg-amber-500/20' },
  ];
  return colors[index % colors.length];
}

/** Explains what each category measures and why it matters */
const CATEGORY_INFO: Record<string, { what: string; why: string }> = {
  'Content Structure': {
    what: 'Evalúa cómo de bien está organizado el HTML de tu página: encabezados, jerarquía, etiquetas semánticas y ratio señal/ruido.',
    why: 'Los agentes IA necesitan estructura clara para entender tu contenido. Sin H1, sin secciones, sin semántica = la IA no sabe qué es importante.',
  },
  'Metadata & Structured Data': {
    what: 'Verifica que tu página tenga JSON-LD (Schema.org), Open Graph tags, meta description, canonical, idioma y título.',
    why: 'Los metadatos son el "pasaporte" de tu página. Sin ellos, los agentes IA no pueden clasificar, resumir ni recomendar tu contenido correctamente.',
  },
  'LLM Accessibility': {
    what: 'Mide si un LLM puede extraer contenido limpio: eficiencia de tokens, headings descriptivos, alt text, links con contexto y si necesita JavaScript.',
    why: 'Si tu web requiere JS para mostrar contenido, los LLMs no pueden leerla. Un ratio de tokens alto significa que el 90%+ de tu HTML es ruido para la IA.',
  },
  'Agent Readiness': {
    what: 'Comprueba si tu web está preparada para agentes IA autónomos: MAKO protocol, llms.txt, robots.txt, sitemap, MCP endpoint y acciones detectables.',
    why: 'Los agentes IA (ChatGPT, Perplexity, Claude...) buscan estas señales para decidir si pueden interactuar con tu web. Sin ellas, tu web es invisible para el tráfico IA del futuro.',
  },
};

/** Explains why each individual check matters */
const CHECK_INFO: Record<string, string> = {
  has_h1: 'El H1 es el título principal que los LLMs usan para entender de qué trata la página.',
  has_h2_sections: 'Las secciones H2 ayudan a los agentes a navegar y extraer información específica.',
  heading_hierarchy: 'Una jerarquía correcta (H1→H2→H3) permite a los LLMs entender la estructura del documento.',
  semantic_html: 'Etiquetas como <main>, <article> y <section> indican a los agentes dónde está el contenido importante.',
  content_noise_ratio: 'Un ratio alto de contenido vs ruido significa menos tokens desperdiciados para los LLMs.',
  clean_extraction: 'Si no hay suficiente contenido extraíble, los agentes no pueden generar respuestas útiles sobre tu página.',
  has_json_ld: 'Schema.org en JSON-LD permite a los agentes entender el tipo de contenido (producto, artículo, evento...) sin "adivinar".',
  has_og_tags: 'Los tags OpenGraph son usados por redes sociales Y por agentes IA para previsualizar y clasificar contenido.',
  has_meta_description: 'La meta description es el resumen que los LLMs usan cuando no quieren leer la página completa.',
  has_canonical: 'El canonical evita que los agentes indexen versiones duplicadas de tu contenido.',
  has_lang: 'El atributo lang indica al agente en qué idioma está tu contenido, mejorando la comprensión.',
  has_title: 'El título es lo primero que lee un agente para decidir si tu página es relevante.',
  schema_depth: 'Cuantas más propiedades tenga tu JSON-LD, más contexto tiene el agente sin necesidad de leer todo.',
  token_efficiency: 'Menos tokens = menos coste por consulta. Un HTML limpio puede ahorrar hasta un 93% de tokens a los LLMs.',
  meaningful_headings: 'Headings descriptivos ayudan a los LLMs a hacer "skimming" inteligente del contenido.',
  link_quality: 'Links con texto descriptivo permiten a los agentes navegar tu sitio con propósito, no a ciegas.',
  image_alt_text: 'Sin alt text, las imágenes son invisibles para los LLMs. Con alt text, el agente entiende el contexto visual.',
  no_js_dependency: 'Los LLMs y crawlers no ejecutan JavaScript. Si tu contenido depende de JS, eres invisible para la IA.',
  serves_mako: 'MAKO permite a los agentes obtener tu contenido optimizado en ~7% de los tokens del HTML original.',
  has_llms_txt: 'llms.txt es como robots.txt pero para LLMs: les dice qué contenido tienes y cómo acceder a él.',
  has_robots_txt: 'Un robots.txt permite a crawlers y agentes saber qué pueden y qué no pueden acceder.',
  has_sitemap: 'El sitemap ayuda a los agentes a descubrir todas tus páginas sin tener que crawlear enlace por enlace.',
  has_mcp_endpoint: 'MCP (Model Context Protocol) permite a los agentes IA interactuar directamente con tu servicio como una API.',
  structured_actions: 'Acciones detectables (comprar, reservar, contactar...) permiten a los agentes actuar en nombre del usuario.',
};

interface CategoryBreakdownProps {
  categories: ScoreCategory[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const [showCheckInfo, setShowCheckInfo] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {categories.map((cat, i) => {
        const colors = getCategoryColor(i);
        const pct = cat.maxPoints > 0 ? (cat.earned / cat.maxPoints) * 100 : 0;
        const isOpen = expanded === i;
        const info = CATEGORY_INFO[cat.name];
        const isInfoOpen = showInfo === i;

        return (
          <div key={cat.name}>
            {/* Category header bar */}
            <div className="flex items-center gap-2 mb-1.5">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="flex-1 text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-slate-400">
                      {cat.earned}/{cat.maxPoints}
                    </span>
                    <svg
                      className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              {/* Info (i) button */}
              {info && (
                <button
                  onClick={() => setShowInfo(isInfoOpen ? null : i)}
                  className={`shrink-0 flex items-center justify-center h-5 w-5 rounded-full border text-[10px] font-bold transition ${
                    isInfoOpen
                      ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                      : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'
                  }`}
                  aria-label="Info"
                >
                  i
                </button>
              )}
            </div>

            {/* Category info tooltip */}
            {isInfoOpen && info && (
              <div className="mb-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-xs space-y-1.5">
                <p className="text-slate-300"><span className="text-emerald-400 font-medium">Qué mide:</span> {info.what}</p>
                <p className="text-slate-300"><span className="text-amber-400 font-medium">Por qué importa:</span> {info.why}</p>
              </div>
            )}

            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full"
            >
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bar-animate ${colors.bar}`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </button>

            {/* Expanded checks */}
            {isOpen && (
              <div className="mt-3 ml-1 space-y-2 border-l-2 border-slate-800 pl-4">
                {cat.checks.map((check) => {
                  const checkInfo = CHECK_INFO[check.id];
                  const isCheckInfoOpen = showCheckInfo === check.id;

                  return (
                    <div key={check.id} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 ${check.passed ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {check.passed ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm ${check.passed ? 'text-slate-300' : 'text-slate-500'}`}>
                              {check.name}
                            </span>
                            {checkInfo && (
                              <button
                                onClick={() => setShowCheckInfo(isCheckInfoOpen ? null : check.id)}
                                className={`shrink-0 flex items-center justify-center h-4 w-4 rounded-full border text-[9px] font-bold transition ${
                                  isCheckInfoOpen
                                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                                    : 'border-slate-700 text-slate-600 hover:text-slate-400 hover:border-slate-500'
                                }`}
                                aria-label="Info"
                              >
                                i
                              </button>
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-500">
                            {check.earned}/{check.maxPoints}
                          </span>
                        </div>
                        {check.details && (
                          <p className="text-xs text-slate-600 mt-0.5">{check.details}</p>
                        )}
                        {isCheckInfoOpen && checkInfo && (
                          <p className="text-xs text-slate-400 mt-1 pl-0.5 border-l-2 border-emerald-500/30 ml-0.5 pl-2">
                            {checkInfo}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
