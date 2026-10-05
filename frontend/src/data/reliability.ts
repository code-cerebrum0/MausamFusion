import type { ReliabilityCase } from '../types/content';

export const reliabilityCases: ReliabilityCase[] = [
{
  id: 'missing',
  title: 'Missing forecast source',
  detection: 'Source adapter reports no run for the expected cycle.',
  response: 'Exclude the source, renormalise the remaining weights and continue forecast generation. Lineage records the omission.'
},
{
  id: 'corrupt',
  title: 'Corrupt input',
  detection: 'Checksum, schema or physical-range QC fails (for example negative rainfall or impossible temperatures).',
  response: 'Quarantine the affected fields, exclude them from blending for the affected cells and raise an audit event.'
},
{
  id: 'sparse',
  title: 'Sparse skill data',
  detection: 'A context bucket has too few verified samples for a stable skill estimate.',
  response: 'Back off to a broader bucket (for example region instead of cell, or season instead of regime) and lower weight confidence.'
},
{
  id: 'stale',
  title: 'Stale forecasts',
  detection: 'A source run is older than its configured freshness window.',
  response: 'Use the run only at its actual lead time from issue, apply a staleness penalty in the gating features, or exclude it beyond the hard limit.'
},
{
  id: 'delayed',
  title: 'Delayed forecasts',
  detection: 'An expected run arrives after the blend has been issued.',
  response: 'Issue the blend without it, then optionally re-issue an updated version with a new lineage record once the run is ingested.'
}];