import React, { useCallback, useState } from 'react';
import { RotateCcwIcon } from 'lucide-react';
import type { ForecastContext } from '../types/forecast';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { defaultContext } from '../utils/forecast';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Notice } from '../components/ui/Notice';
import { Button } from '../components/ui/Button';
import { ForecastControls } from '../components/forecast/ForecastControls';
import { ForecastMap } from '../components/forecast/ForecastMap';
import { LocationSummary } from '../components/forecast/LocationSummary';
import { ExplainPanel } from '../components/forecast/ExplainPanel';
import { UncertaintySection } from '../components/forecast/UncertaintySection';
import { ExtremeWeather } from '../components/forecast/ExtremeWeather';

export function ForecastPage() {
  usePageMeta(
    'Forecast Dashboard · MausamFusion',
    ''
  );
  const [ctx, setCtx] = useState<ForecastContext>(defaultContext);
  const loading = useSimulatedLoad(JSON.stringify(ctx));
  const update = useCallback((patch: Partial<ForecastContext>) => setCtx((c) => ({ ...c, ...patch })), []);

  return (
    <div className="container-page space-y-16 py-10 sm:py-14">
      <div>
        <SectionHeading
          as="h1"
          title="Forecast dashboard"
          description="Choose a forecast context to see the blended field, the point forecast and how much each source contributed."
          actions={
          <Button variant="secondary" size="sm" onClick={() => setCtx(defaultContext)}>
              <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
              Reset context
            </Button>
          } />
        
        

        <div className="panel mt-6 p-4 sm:p-5">
          <ForecastControls ctx={ctx} onChange={update} idPrefix="fc" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <ForecastMap ctx={ctx} loading={loading} onSelectLocation={(id) => update({ locationId: id })} />
          <LocationSummary ctx={ctx} loading={loading} onVariable={(v) => update({ variable: v })} />
        </div>
      </div>

      <ExplainPanel ctx={ctx} />
      <UncertaintySection ctx={ctx} loading={loading} />
      <ExtremeWeather ctx={ctx} loading={loading} onApply={update} />
    </div>);

}