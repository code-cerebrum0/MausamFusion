import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon, FolderGit2Icon } from 'lucide-react';
import { docSections, evaluationSteps, glossary } from '../data/docs';
import { datasets, references } from '../data/references';
import { faqItems } from '../data/faq';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';
import { FaqList } from '../components/docs/FaqList';

export function DocumentationPage() {
  usePageMeta(
    'Documentation · MausamFusion',
    'MausamFusion documentation: core concepts, usable datasets, leakage-safe evaluation protocol, source code access, scientific references and FAQ.'
  );
  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeading
        as="h1"
        title="Documentation"
        description="Concepts, data and evaluation practice behind context-aware multi-model blending." />
      
      <div className="mt-10 grid gap-10 lg:grid-cols-[12rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-xs font-medium text-muted">On this page</p>
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {docSections.map((s) =>
            <li key={s.id}>
                <Link to={`/docs#${s.id}`} className="block rounded-lg px-2 py-1.5 text-sm text-muted transition-[background-color,color] duration-150 hover:bg-surface2 hover:text-fg">
                  {s.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="min-w-0 space-y-16">
          <section id="concepts" className="scroll-mt-24" aria-labelledby="concepts-title">
            <h2 id="concepts-title" className="text-2xl font-semibold tracking-tight text-fg">
              Core concepts
            </h2>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {glossary.map((g) =>
              <div key={g.term} className="grid gap-1 py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                  <dt className="text-sm font-medium text-fg">{g.term}</dt>
                  <dd className="text-sm leading-relaxed text-muted">{g.definition}</dd>
                </div>
              )}
            </dl>
          </section>

          <section id="datasets" className="scroll-mt-24" aria-labelledby="datasets-title">
            <h2 id="datasets-title" className="text-2xl font-semibold tracking-tight text-fg">
              Datasets that can be used
            </h2>
            <p className="mt-2 text-sm text-muted">Any source with an adapter can be added. Use of each dataset is subject to its own licence.</p>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {datasets.map((d) =>
              <li key={d.name} className="grid gap-1 py-3.5 sm:grid-cols-[14rem_7rem_1fr] sm:gap-4">
                  <span className="text-sm font-medium text-fg">{d.name}</span>
                  <span className="text-xs text-muted sm:pt-0.5">{d.kind}</span>
                  <span className="text-sm text-muted">{d.role}</span>
                </li>
              )}
            </ul>
          </section>

          <section id="evaluation" className="scroll-mt-24" aria-labelledby="evaluation-title">
            <h2 id="evaluation-title" className="text-2xl font-semibold tracking-tight text-fg">
              Evaluation protocol
            </h2>
            <p className="mt-2 text-sm text-muted">The order matters: each step guards the next against leakage.</p>
            <ol className="mt-6 space-y-5">
              {evaluationSteps.map((s, i) =>
              <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs text-fg">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-fg">{s.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{s.text}</p>
                  </div>
                </li>
              )}
            </ol>
          </section>

          <section id="source-code" className="panel scroll-mt-24 p-6" aria-labelledby="source-title">
            <div className="flex items-start gap-3">
              <FolderGit2Icon className="mt-0.5 h-5 w-5 shrink-0 text-fg" aria-hidden="true" />
              <div>
                <h2 id="source-title" className="text-lg font-semibold text-fg">
                  Source code
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  The GitHub repository is shared directly by the maintainers and is not linked publicly from this site yet. Request access and
                  we’ll reply with the repository link.
                </p>
                <ButtonLink to="/contact?topic=repository" size="sm" className="mt-4">
                  Request repository access
                </ButtonLink>
              </div>
            </div>
          </section>

          <section id="references" className="scroll-mt-24" aria-labelledby="references-title">
            <h2 id="references-title" className="text-2xl font-semibold tracking-tight text-fg">
              References
            </h2>
            <ul className="mt-5 space-y-4">
              {references.map((r) =>
              <li key={r.url} className="text-sm leading-relaxed">
                  <span className="text-muted">
                    {r.authors} ({r.year}).{' '}
                  </span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-fg underline decoration-line underline-offset-4 hover:decoration-accent">
                    {r.title}
                    <ExternalLinkIcon className="ml-1 inline h-3 w-3" aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span className="text-muted">. {r.venue}.</span>
                </li>
              )}
            </ul>
          </section>

          <section id="faq" className="scroll-mt-24" aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-2xl font-semibold tracking-tight text-fg">
              Frequently asked questions
            </h2>
            <div className="mt-4">
              <FaqList items={faqItems} />
            </div>
          </section>
        </div>
      </div>
    </div>);

}