import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SystemDiagram } from '../components/architecture/SystemDiagram';
import { SoftwareStack } from '../components/architecture/SoftwareStack';
import { ReliabilityFlow } from '../components/architecture/ReliabilityFlow';
import { Governance } from '../components/architecture/Governance';

export function ArchitecturePage() {
  usePageMeta(
    'Architecture · MausamFusion',
    'Interactive MausamFusion system architecture: source adapters, harmonization, context, skill memory, adaptive gating, blending, calibration, verification, failure handling and governance.'
  );
  return (
    <div className="container-page space-y-24 py-10 sm:py-14">
      <SystemDiagram />
      <SoftwareStack />
      <ReliabilityFlow />
      <Governance />
    </div>);

}