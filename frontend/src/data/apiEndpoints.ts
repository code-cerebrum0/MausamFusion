import type { ApiEndpoint } from '../types/content';

const j = (o: unknown) => JSON.stringify(o, null, 2);

export const apiEndpoints: ApiEndpoint[] = [
{
  id: 'get-health',
  method: 'GET',
  path: '/health',
  summary: 'Service health',
  description: 'Returns service status, version and the availability of each registered forecast source.',
  params: [],
  response: j({ status: 'ok', version: '0.1.0', sources: { nwp: 'available', ensemble: 'available', ai: 'delayed' }, checked_at: '2026-10-03T00:05:00Z' })
},
{
  id: 'get-sources',
  method: 'GET',
  path: '/sources',
  summary: 'List forecast sources',
  description: 'Lists registered forecast sources with their adapter, grid, cadence and latest ingested run.',
  params: [],
  response: j({
    sources: [
    { id: 'nwp', name: 'Deterministic NWP', adapter: 'grib2', cadence_hours: 6, latest_run: '2026-10-03T00:00:00Z' },
    { id: 'ensemble', name: 'Ensemble mean + spread', adapter: 'netcdf', cadence_hours: 12, latest_run: '2026-10-02T12:00:00Z' },
    { id: 'ai', name: 'AI weather model', adapter: 'zarr', cadence_hours: 6, latest_run: '2026-10-02T18:00:00Z' }]

  })
},
{
  id: 'get-forecasts',
  method: 'GET',
  path: '/forecasts',
  summary: 'List blended forecasts',
  description: 'Lists blended forecasts filtered by variable, issue time and lead time.',
  params: [
  { name: 'variable', location: 'query', type: 'temperature | rainfall | wind', required: false, description: 'Forecast variable.' },
  { name: 'issued', location: 'query', type: 'date', required: false, description: 'Issue date (UTC).' },
  { name: 'lead_hours', location: 'query', type: 'integer', required: false, description: 'Forecast lead time in hours.' }],

  response: j({ items: [{ id: 'fc_20261003_00_t2m', variable: 'temperature', issued: '2026-10-03T00:00:00Z', lead_hours: [6, 12, 24, 48], status: 'complete' }], next: null })
},
{
  id: 'get-forecast',
  method: 'GET',
  path: '/forecasts/{id}',
  summary: 'Get a forecast',
  description: 'Returns a single blended forecast, optionally sampled at a point, with lineage metadata.',
  params: [
  { name: 'id', location: 'path', type: 'string', required: true, description: 'Forecast identifier.' },
  { name: 'lat', location: 'query', type: 'number', required: false, description: 'Latitude for point sampling.' },
  { name: 'lon', location: 'query', type: 'number', required: false, description: 'Longitude for point sampling.' }],

  response: j({
    id: 'fc_20261003_00_t2m',
    variable: 'temperature',
    units: 'degC',
    point: { lat: 28.61, lon: 77.21, lead_hours: 24, value: 'number', spread: 'number' },
    lineage: { sources: ['nwp@2026-10-03T00Z', 'ensemble@2026-10-02T12Z', 'ai@2026-10-02T18Z'], gating_model: 'gate-v0.3.1', config: 'cfg-7f2a' }
  })
},
{
  id: 'get-weights',
  method: 'GET',
  path: '/weights',
  summary: 'Weights for a context',
  description: 'Returns the dynamic source weights for a forecast context. Weights are relative contributions for that context, not a ranking of model quality.',
  params: [
  { name: 'lat', location: 'query', type: 'number', required: true, description: 'Latitude.' },
  { name: 'lon', location: 'query', type: 'number', required: true, description: 'Longitude.' },
  { name: 'variable', location: 'query', type: 'string', required: true, description: 'Forecast variable.' },
  { name: 'lead_hours', location: 'query', type: 'integer', required: true, description: 'Lead time in hours.' }],

  response: j({ context: { lat: 28.61, lon: 77.21, variable: 'temperature', lead_hours: 24, regime: 'post-monsoon' }, weights: { nwp: 0.52, ensemble: 0.31, ai: 0.17 }, weight_confidence: 'moderate', example: true })
},
{
  id: 'get-weights-map',
  method: 'GET',
  path: '/weights/map',
  summary: 'Spatial weight map',
  description: 'Returns gridded weights for every cell in a bounding box as a compact array or Zarr reference.',
  params: [
  { name: 'bbox', location: 'query', type: 'minLon,minLat,maxLon,maxLat', required: true, description: 'Bounding box.' },
  { name: 'variable', location: 'query', type: 'string', required: true, description: 'Forecast variable.' },
  { name: 'lead_hours', location: 'query', type: 'integer', required: true, description: 'Lead time in hours.' }],

  response: j({ grid: { shape: [24, 30], resolution_deg: 1.0 }, sources: ['nwp', 'ensemble', 'ai'], weights_ref: 'zarr://weights/2026-10-03T00/t2m/024', example: true })
},
{
  id: 'get-uncertainty',
  method: 'GET',
  path: '/uncertainty',
  summary: 'Forecast uncertainty',
  description: 'Returns inter-model spread, predictive interval and weight confidence for a point and lead time.',
  params: [
  { name: 'forecast_id', location: 'query', type: 'string', required: true, description: 'Forecast identifier.' },
  { name: 'lat', location: 'query', type: 'number', required: true, description: 'Latitude.' },
  { name: 'lon', location: 'query', type: 'number', required: true, description: 'Longitude.' }],

  response: j({ spread: 'number', interval_80: ['number', 'number'], weight_confidence: 'high | moderate | low', calibrated: true })
},
{
  id: 'get-extremes',
  method: 'GET',
  path: '/extremes',
  summary: 'Extreme-weather guidance',
  description: 'Returns exceedance probabilities for configured event thresholds over a forecast horizon.',
  params: [
  { name: 'event', location: 'query', type: 'heavy_rain | heat_wave | high_wind', required: true, description: 'Event type.' },
  { name: 'lat', location: 'query', type: 'number', required: true, description: 'Latitude.' },
  { name: 'lon', location: 'query', type: 'number', required: true, description: 'Longitude.' }],

  response: j({ event: 'heavy_rain', threshold: { value: 115.6, units: 'mm/24h' }, horizon: [{ lead_hours: 24, probability: 'number' }], risk_status: 'low | elevated | high' })
},
{
  id: 'get-verification',
  method: 'GET',
  path: '/verification',
  summary: 'Verification metrics',
  description: 'Returns verification metrics for a method, variable, region, season and evaluation period.',
  params: [
  { name: 'variable', location: 'query', type: 'string', required: true, description: 'Forecast variable.' },
  { name: 'region', location: 'query', type: 'string', required: false, description: 'Region identifier.' },
  { name: 'period', location: 'query', type: '30d | 90d | 1y', required: false, description: 'Evaluation period.' }],

  response: j({ record_id: 'ver_2026_09_q3_t2m', method: 'mausamfusion', metrics: { mae: 'number', rmse: 'number', bias: 'number', crps: 'number', brier: 'number' }, config: 'cfg-7f2a' })
},
{
  id: 'get-skill',
  method: 'GET',
  path: '/skill',
  summary: 'Skill memory',
  description: 'Returns historical and recent skill for each source in a context bucket.',
  params: [
  { name: 'variable', location: 'query', type: 'string', required: true, description: 'Forecast variable.' },
  { name: 'region', location: 'query', type: 'string', required: true, description: 'Region identifier.' },
  { name: 'lead_hours', location: 'query', type: 'integer', required: true, description: 'Lead time in hours.' }],

  response: j({ bucket: 'north|post-monsoon|024', historical: { nwp: 'number', ensemble: 'number', ai: 'number' }, recent: { nwp: 'number', ensemble: 'number', ai: 'number' }, samples: 'integer', updated_at: '2026-10-02T06:00:00Z' })
},
{
  id: 'post-ingest',
  method: 'POST',
  path: '/ingest',
  summary: 'Ingest a source run',
  description: 'Registers a new forecast source run for adapter processing, harmonization and QC.',
  params: [],
  requestBody: j({ source: 'nwp', run: '2026-10-03T06:00:00Z', uri: 's3://bucket/nwp/2026100306.grib2' }),
  response: j({ job_id: 'ing_8c41', status: 'queued', source: 'nwp', run: '2026-10-03T06:00:00Z' })
},
{
  id: 'post-verify',
  method: 'POST',
  path: '/verify',
  summary: 'Run verification',
  description: 'Starts a reproducible verification job for a period, writing a versioned record.',
  params: [],
  requestBody: j({ variable: 'rainfall', region: 'west-coast', start: '2026-09-01', end: '2026-09-30' }),
  response: j({ job_id: 'ver_3e19', status: 'queued', config: 'cfg-7f2a' })
},
{
  id: 'post-skill-update',
  method: 'POST',
  path: '/skill/update',
  summary: 'Update skill memory',
  description: 'Folds completed verification records into recent and historical skill memory.',
  params: [],
  requestBody: j({ record_ids: ['ver_3e19'], recent_halflife_days: 14 }),
  response: j({ job_id: 'skl_51d0', status: 'queued', buckets_affected: 'integer' })
}];