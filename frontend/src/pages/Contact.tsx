import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MailIcon } from 'lucide-react';
import { site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { useUtm } from '../hooks/useUtm';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ContactForm } from '../components/contact/ContactForm';
import { topics } from '../components/contact/useContactForm';
import { CopyButton } from '../components/ui/CopyButton';

export function ContactPage() {
  usePageMeta('Contact · MausamFusion', 'Contact the MausamFusion team about research collaboration, API access, repository access or general questions.');
  const [params] = useSearchParams();
  const requested = params.get('topic') ?? 'general';
  const initialTopic = topics.some((t) => t.value === requested) ? requested : 'general';
  const utm = useUtm();
  const utmEntries = Object.entries(utm).filter(([k]) => k.startsWith('utm_'));

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHeading
            as="h1"
            title="Contact"
            description="Questions about context-aware blending, collaboration or access to the API and repository — we’d like to hear from you." />
          
          <div className="mt-8 border-t border-line pt-6">
            <p className="text-sm font-medium text-fg">Email</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-base font-medium text-accent hover:underline">
                <MailIcon className="h-4 w-4" aria-hidden="true" />
                {site.email}
              </a>
              <CopyButton text={site.email} label="Copy email" />
            </div>
          </div>
          <div className="mt-6 border-t border-line pt-6">
            <p className="text-sm font-medium text-fg">Helpful to include</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li>The region, variables and lead times you care about</li>
              <li>Forecast sources you already have access to</li>
              <li>Whether you need the API, the code, or both</li>
            </ul>
          </div>
          {utmEntries.length > 0 &&
          <div className="mt-6 border-t border-line pt-6">
              <p className="text-sm font-medium text-fg">Campaign attribution</p>
              <p className="mt-1 text-xs text-muted">Captured from your visit link and added to your message:</p>
              <p className="mt-2 break-all font-mono text-xs text-fg">{utmEntries.map(([k, v]) => `${k}=${v}`).join(' · ')}</p>
            </div>
          }
        </div>
        <ContactForm key={initialTopic} initialTopic={initialTopic} />
      </div>
    </div>);

}