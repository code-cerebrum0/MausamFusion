import type {
  ExtremeEvent,
  LocationInfo,
  RegimeInfo,
  RegionInfo,
  SourceInfo,
  VariableInfo } from
'../types/forecast';

export const sources: SourceInfo[] = [
{
  id: 'nwp',
  label: 'NWP',
  name: 'Numerical Weather Prediction',
  description: 'Deterministic, physics-based model runs from a global or regional NWP system.'
},
{
  id: 'ensemble',
  label: 'Ensemble',
  name: 'Ensemble forecast',
  description: 'Ensemble mean and spread from perturbed model runs.'
},
{
  id: 'ai',
  label: 'AI',
  name: 'AI weather model',
  description: 'Data-driven forecast from a machine-learned global weather model.'
}];


export const variables: VariableInfo[] = [
{ id: 'temperature', label: 'Temperature', unit: '°C', long: '2 m air temperature' },
{ id: 'rainfall', label: 'Rainfall', unit: 'mm', long: '24 h accumulated rainfall' },
{ id: 'wind', label: 'Wind', unit: 'km/h', long: '10 m wind speed' }];


export const locations: LocationInfo[] = [
{ id: 'delhi', name: 'New Delhi', lat: 28.61, lon: 77.21, region: 'north' },
{ id: 'mumbai', name: 'Mumbai', lat: 19.08, lon: 72.88, region: 'west-coast' },
{ id: 'kolkata', name: 'Kolkata', lat: 22.57, lon: 88.36, region: 'east' },
{ id: 'chennai', name: 'Chennai', lat: 13.08, lon: 80.27, region: 'south' },
{ id: 'bengaluru', name: 'Bengaluru', lat: 12.97, lon: 77.59, region: 'south' },
{ id: 'guwahati', name: 'Guwahati', lat: 26.14, lon: 91.74, region: 'northeast' },
{ id: 'ahmedabad', name: 'Ahmedabad', lat: 23.02, lon: 72.57, region: 'west-coast' },
{ id: 'bhubaneswar', name: 'Bhubaneswar', lat: 20.3, lon: 85.82, region: 'east' }];


export const regions: RegionInfo[] = [
{ id: 'all', label: 'All-India domain', lat: 22, lon: 80 },
{ id: 'north', label: 'North India', lat: 28, lon: 78 },
{ id: 'west-coast', label: 'West Coast', lat: 17, lon: 73.5 },
{ id: 'east', label: 'East India', lat: 22, lon: 87 },
{ id: 'south', label: 'South Peninsula', lat: 12.5, lon: 78 },
{ id: 'northeast', label: 'Northeast', lat: 26, lon: 92 }];


export const leadTimes: number[] = [6, 12, 24, 48, 72, 120, 168, 240];

export const regimes: RegimeInfo[] = [
{
  id: 'pre-monsoon-heat',
  label: 'Pre-monsoon heat',
  season: 'Pre-monsoon (MAM)',
  description: 'Hot, dry continental air with strong daytime heating and isolated convection.',
  tempOffset: 5,
  rainFactor: 0.15,
  windFactor: 1,
  bias: { nwp: 0, ensemble: 0, ai: 0.25 }
},
{
  id: 'monsoon-active',
  label: 'Active monsoon',
  season: 'Monsoon (JJAS)',
  description: 'Strong monsoon flow with widespread, organised convective rainfall.',
  tempOffset: -3,
  rainFactor: 1.6,
  windFactor: 1.2,
  bias: { nwp: -0.1, ensemble: 0.35, ai: 0 }
},
{
  id: 'monsoon-break',
  label: 'Monsoon break',
  season: 'Monsoon (JJAS)',
  description: 'Weakened monsoon trough with suppressed rainfall over central India.',
  tempOffset: 1,
  rainFactor: 0.45,
  windFactor: 0.9,
  bias: { nwp: 0.1, ensemble: 0.05, ai: 0.15 }
},
{
  id: 'western-disturbance',
  label: 'Western disturbance',
  season: 'Winter (DJF)',
  description: 'Mid-latitude trough bringing winter rain and snow to the north.',
  tempOffset: -7,
  rainFactor: 0.6,
  windFactor: 1.1,
  bias: { nwp: 0.2, ensemble: 0.15, ai: -0.05 }
},
{
  id: 'cyclonic',
  label: 'Cyclonic circulation',
  season: 'Post-monsoon (OND)',
  description: 'Organised low-pressure system over the Bay of Bengal or Arabian Sea.',
  tempOffset: -1,
  rainFactor: 1.4,
  windFactor: 2,
  bias: { nwp: 0, ensemble: 0.4, ai: -0.1 }
},
{
  id: 'post-monsoon',
  label: 'Post-monsoon transition',
  season: 'Post-monsoon (OND)',
  description: 'Monsoon withdrawal with clearing skies and gradual cooling.',
  tempOffset: -1.5,
  rainFactor: 0.5,
  windFactor: 0.9,
  bias: { nwp: 0.15, ensemble: 0, ai: -0.05 }
},
{
  id: 'winter-fog',
  label: 'Winter fog / cold',
  season: 'Winter (DJF)',
  description: 'Shallow, stable boundary layer with fog and cold-wave conditions.',
  tempOffset: -11,
  rainFactor: 0.1,
  windFactor: 0.6,
  bias: { nwp: 0.3, ensemble: -0.05, ai: 0.05 }
}];


export const seasons: string[] = [
'All seasons',
'Winter (DJF)',
'Pre-monsoon (MAM)',
'Monsoon (JJAS)',
'Post-monsoon (OND)'];


export const evaluationPeriods = [
{ id: '30d', label: 'Last 30 days', points: 30, days: 30 },
{ id: '90d', label: 'Last 90 days', points: 45, days: 90 },
{ id: '1y', label: 'Last 12 months', points: 60, days: 365 }];


export const modelChoices = [
{ value: 'blend', label: 'MausamFusion blend' },
{ value: 'nwp', label: 'NWP only' },
{ value: 'ensemble', label: 'Ensemble only' },
{ value: 'ai', label: 'AI only' }];


export const comparisonMethods = [
{ id: 'best', label: 'Best individual model' },
{ id: 'equal', label: 'Equal-weight mean' },
{ id: 'fixed', label: 'Fixed global weight' },
{ id: 'skill', label: 'Skill-based weighting' },
{ id: 'fusion', label: 'MausamFusion' }] as
const;

export const fixedGlobalWeights = { nwp: 0.4, ensemble: 0.35, ai: 0.25 };

export const extremeEvents: ExtremeEvent[] = [
{
  id: 'heavy-rain',
  label: 'Heavy rainfall',
  variable: 'rainfall',
  threshold: 115.6,
  unit: 'mm / 24 h',
  basis:
  'Example threshold aligned with the IMD “very heavy rainfall” category (115.6 mm in 24 h). Configurable per deployment.'
},
{
  id: 'heat-wave',
  label: 'Heat wave',
  variable: 'temperature',
  threshold: 40,
  unit: '°C',
  basis:
  'Example threshold based on the IMD plains criterion of a maximum temperature of at least 40 °C. Operational criteria also consider departure from normal.'
},
{
  id: 'high-wind',
  label: 'High wind',
  variable: 'wind',
  threshold: 62,
  unit: 'km/h',
  basis: 'Example threshold at gale force (Beaufort 8, about 62 km/h). Configurable per deployment.'
}];