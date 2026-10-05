export const softwareLayers = [
{ id: 'dashboard', title: 'Dashboard', items: ['Forecast maps', 'Weight views', 'Verification'], tech: ['MapLibre', 'Plotly'] },
{ id: 'api', title: 'FastAPI', items: ['REST endpoints', 'Auth', 'Schema validation'], tech: ['FastAPI', 'Pydantic'] },
{
  id: 'services',
  title: 'Services',
  items: ['Forecast Service', 'Weight Service', 'Verification Service', 'Source Service'],
  tech: []
},
{ id: 'core', title: 'Core MausamFusion', items: ['Context builder', 'Orchestration', 'Lineage'], tech: [] },
{
  id: 'modules',
  title: 'Core modules',
  items: ['Adapters', 'Gating', 'Blending', 'Skill Memory'],
  tech: ['XGBoost / LightGBM', 'Xarray', 'Dask']
},
{ id: 'storage', title: 'Scientific Storage', items: ['Gridded cubes', 'Metadata & skill'], tech: ['Zarr', 'PostgreSQL / PostGIS'] }];


export const technologies = [
{ name: 'Xarray', role: 'Labelled multi-dimensional arrays for gridded forecasts' },
{ name: 'Dask', role: 'Parallel, out-of-core computation over large cubes' },
{ name: 'Zarr', role: 'Chunked, cloud-friendly storage for forecast cubes' },
{ name: 'PostgreSQL / PostGIS', role: 'Metadata, skill memory and spatial queries' },
{ name: 'FastAPI', role: 'Typed REST API with automatic schema docs' },
{ name: 'MapLibre', role: 'Open-source vector map rendering' },
{ name: 'Plotly', role: 'Interactive scientific charts' },
{ name: 'XGBoost / LightGBM', role: 'Gradient-boosted trees for the gating model' }];