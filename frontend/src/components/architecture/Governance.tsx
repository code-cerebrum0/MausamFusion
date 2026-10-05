import React from "react";
import { FileCheck2Icon, FileClockIcon, GitBranchIcon, KeyRoundIcon, ListChecksIcon, LockIcon, ScrollTextIcon, ShieldCheckIcon, WorkflowIcon, BoxIcon } from "lucide-react";
import { governanceItems } from "../../data/governance";
import { SectionHeading } from "../ui/SectionHeading";
const ICONS: Record<string, BoxIcon> = {
  secrets: KeyRoundIcon,
  input: ShieldCheckIcon,
  schema: ListChecksIcon,
  auth: LockIcon,
  audit: ScrollTextIcon,
  models: GitBranchIcon,
  config: FileClockIcon,
  records: FileCheck2Icon,
  lineage: WorkflowIcon
};
export function Governance() {
  return <section id="governance" className="scroll-mt-24" aria-labelledby="governance-title">
      <SectionHeading titleId="governance-title" title="Security and governance" description="Controls that make every forecast traceable and every score reproducible." />
      <ul className="mt-8 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {governanceItems.map((g) => {
        const Icon = ICONS[g.id];
        return <li key={g.id} className="flex gap-3 border-b border-line py-5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-fg">{g.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{g.description}</p>
              </div>
            </li>;
      })}
      </ul>
    </section>;
}