import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Hero } from '../components/home/Hero';
import { ProblemSection } from '../components/home/ProblemSection';
import { PipelineSection } from '../components/home/PipelineSection';
import { ExploreLinks } from '../components/home/ExploreLinks';

export function OverviewPage() {
  usePageMeta(
    'MausamFusion · Context-Aware Hybrid AI–NWP Forecast Blending',
    'MausamFusion combines NWP, ensemble and AI weather forecasts into an adaptive multi-model forecast that learns which source should matter for each forecast context.'
  );
  return (
    <>
      <Hero />
      <ProblemSection />
      <PipelineSection />
      <ExploreLinks />
    </>);

}