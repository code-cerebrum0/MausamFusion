import type { PipelineStage } from '../types/content';

export const pipelineStages: PipelineStage[] = [
{
  id: 'ingest',
  title: 'Ingest & Harmonize',
  summary:
  'Source adapters pull NWP, ensemble and AI forecasts, regrid them to a common grid, align valid times and units, and run quality control.',
  inputs: ['NWP runs', 'Ensemble members', 'AI model output'],
  outputs: ['Harmonized forecast cube']
},
{
  id: 'context',
  title: 'Build Forecast Context',
  summary:
  'Location, season, lead time, weather regime, historical and recent skill, and inter-model disagreement are assembled into a context vector for every forecast cell.',
  inputs: ['Harmonized cube', 'Skill memory', 'Regime labels'],
  outputs: ['Context features']
},
{
  id: 'weights',
  title: 'Generate Dynamic Model Weights',
  summary:
  'An adaptive gating model maps each context to non-negative weights that sum to one — one weight per available forecast source.',
  inputs: ['Context features'],
  outputs: ['Per-cell weights']
},
{
  id: 'blend',
  title: 'Blend Forecasts',
  summary:
  'Source forecasts are combined cell-by-cell with the generated weights for temperature, rainfall and wind.',
  inputs: ['Harmonized cube', 'Per-cell weights'],
  outputs: ['Blended forecast']
},
{
  id: 'uncertainty',
  title: 'Add Uncertainty & Extreme Guidance',
  summary:
  'Inter-model spread and calibration produce forecast uncertainty; threshold exceedance probabilities produce extreme-weather guidance.',
  inputs: ['Blended forecast', 'Source spread'],
  outputs: ['Uncertainty', 'Exceedance guidance']
},
{
  id: 'verify',
  title: 'Verify & Update Skill Memory',
  summary:
  'When observations arrive, forecasts are scored and historical and recent skill memory is updated for future contexts.',
  inputs: ['Observations', 'Issued forecasts'],
  outputs: ['Verification records', 'Updated skill memory']
}];