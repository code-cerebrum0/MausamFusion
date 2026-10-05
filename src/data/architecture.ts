import type { ArchitectureNode } from '../types/content';

export const architectureNodes: ArchitectureNode[] = [
{
  id: 'sources',
  title: 'Forecast Sources',
  responsibility: 'External NWP, ensemble and AI forecast systems. MausamFusion consumes their output and never modifies the source models.',
  inputs: ['Upstream model runs'],
  outputs: ['Raw GRIB / NetCDF / Zarr files']
},
{
  id: 'adapters',
  title: 'Source Adapters',
  responsibility: 'One adapter per source decodes its native format, maps variable names and units, and records run metadata for lineage.',
  inputs: ['Raw source files'],
  outputs: ['Decoded datasets with metadata']
},
{
  id: 'harmonize',
  title: 'Data Harmonization + Quality Control',
  responsibility: 'Regrids every source to a common grid, aligns valid times and lead times, and rejects physically implausible or corrupt values.',
  inputs: ['Decoded datasets'],
  outputs: ['Harmonized forecast cube', 'QC flags']
},
{
  id: 'context',
  title: 'Forecast Context',
  responsibility: 'Builds the context vector: location, season, lead time, weather regime, inter-model disagreement and the current forecast state.',
  inputs: ['Harmonized cube', 'Regime classifier'],
  outputs: ['Context features']
},
{
  id: 'memory',
  title: 'Historical + Recent Skill Memory',
  responsibility: 'Stores long-term and recent verification skill per source and context bucket, using only information available before issue time.',
  inputs: ['Verification records'],
  outputs: ['Skill features']
},
{
  id: 'gating',
  title: 'Adaptive Gating Model',
  responsibility: 'A learned model (for example gradient-boosted trees) that maps context and skill features to source scores.',
  inputs: ['Context features', 'Skill features'],
  outputs: ['Source scores']
},
{
  id: 'weights',
  title: 'Dynamic Weights',
  responsibility: 'Normalises source scores into non-negative weights that sum to one, excluding unavailable sources and renormalising the rest.',
  inputs: ['Source scores', 'Source availability'],
  outputs: ['Per-cell weights', 'Weight confidence']
},
{
  id: 'blending',
  title: 'Hybrid Forecast Blending',
  responsibility: 'Computes the weighted combination of harmonized source forecasts for each variable, cell and lead time.',
  inputs: ['Harmonized cube', 'Per-cell weights'],
  outputs: ['Blended forecast']
},
{
  id: 'calibration',
  title: 'Uncertainty + Calibration',
  responsibility: 'Estimates forecast uncertainty from spread and residual history, and calibrates probabilities so they match observed frequencies.',
  inputs: ['Blended forecast', 'Source spread', 'Calibration history'],
  outputs: ['Predictive distribution']
},
{
  id: 'extremes',
  title: 'Extreme Weather Guidance',
  responsibility: 'Converts the predictive distribution into exceedance probabilities for configured heavy-rain, heat and wind thresholds.',
  inputs: ['Predictive distribution', 'Thresholds'],
  outputs: ['Event probabilities', 'Risk status']
},
{
  id: 'verification',
  title: 'Verification',
  responsibility: 'Scores issued forecasts against observations with continuous, probabilistic and event metrics, and writes reproducible records.',
  inputs: ['Issued forecasts', 'Observations'],
  outputs: ['Verification records']
},
{
  id: 'update',
  title: 'Skill Memory Update',
  responsibility: 'Folds new verification results into recent and historical skill, closing the loop for the next forecast cycle.',
  inputs: ['Verification records'],
  outputs: ['Updated skill memory']
}];