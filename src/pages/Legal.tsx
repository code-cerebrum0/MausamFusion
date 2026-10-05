import React from 'react';
import { site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatDate } from '../utils/forecast';

interface LegalSection {
  title: string;
  body: string;
}

function LegalLayout({ title, sections }: {title: string;sections: LegalSection[];}) {
  return (
    <div className="container-page py-10 sm:py-14">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">
          Last updated <time dateTime={site.lastUpdated}>{formatDate(site.lastUpdated)}</time>
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((s) =>
          <section key={s.title}>
              <h2 className="text-lg font-semibold text-fg">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </section>
          )}
          <section>
            <h2 className="text-lg font-semibold text-fg">Contact</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Questions about this page can be sent to{' '}
              <a href={`mailto:${site.email}`} className="font-medium text-accent hover:underline">
                {site.email}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>);

}

export function PrivacyPage() {
  usePageMeta('Privacy · MausamFusion', 'How the MausamFusion website handles browser storage, campaign parameters and contact form drafts.');
  return (
    <LegalLayout
      title="Privacy notice"
      sections={[
      { title: 'What this site stores', body: 'Your theme preference and cookie choice are stored in your browser’s local storage. They never leave your device.' },
      { title: 'Campaign parameters', body: 'If you arrive through a link containing UTM parameters, they are kept in session storage for the current visit and added to contact messages you choose to send. They are cleared when you close the tab.' },
      { title: 'Contact form', body: 'The contact form saves your last few drafts in this browser and opens your own email app to send them. No message is transmitted by this website.' },
      { title: 'Third parties', body: 'No analytics or advertising trackers are loaded. Fonts are served by Google Fonts, which receives standard request information from your browser.' },
      { title: 'Your choices', body: 'You can reset your cookie choice at any time from “Cookie settings” in the footer, and clear site data through your browser settings.' }]
      } />);


}

export function TermsPage() {
  usePageMeta('Terms · MausamFusion', 'Terms of use for the MausamFusion website, including the status of demonstration data.');
  return (
    <LegalLayout
      title="Terms of use"
      sections={[
      { title: 'Demonstration data', body: 'All forecasts, weights, probabilities and verification metrics shown on this site are synthetic and generated in your browser. They are not weather forecasts and must not be used for safety, operational or financial decisions.' },
      { title: 'No warranty', body: 'The site is provided as is, for information about the MausamFusion approach. Content may change without notice.' },
      { title: 'Official warnings', body: 'For weather warnings and official forecasts, always consult your national meteorological service.' },
      { title: 'Third-party references', body: 'Links to publications and datasets are provided for reference. Their use is governed by their own terms and licences.' }]
      } />);


}