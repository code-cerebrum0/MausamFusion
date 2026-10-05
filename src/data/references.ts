import type { Dataset, Reference } from '../types/content';

export const references: Reference[] = [
{
  authors: 'Krishnamurti, T. N., et al.',
  year: 1999,
  title: 'Improved weather and seasonal climate forecasts from multimodel superensemble',
  venue: 'Science 285(5433)',
  url: 'https://doi.org/10.1126/science.285.5433.1548'
},
{
  authors: 'Raftery, A. E., Gneiting, T., Balabdaoui, F., Polakowski, M.',
  year: 2005,
  title: 'Using Bayesian model averaging to calibrate forecast ensembles',
  venue: 'Monthly Weather Review 133(5)',
  url: 'https://doi.org/10.1175/MWR2906.1'
},
{
  authors: 'Gneiting, T., Raftery, A. E.',
  year: 2007,
  title: 'Strictly proper scoring rules, prediction, and estimation',
  venue: 'Journal of the American Statistical Association 102(477)',
  url: 'https://doi.org/10.1198/016214506000001437'
},
{
  authors: 'Hersbach, H.',
  year: 2000,
  title: 'Decomposition of the continuous ranked probability score for ensemble prediction systems',
  venue: 'Weather and Forecasting 15(5)',
  url: 'https://doi.org/10.1175/1520-0434(2000)015%3C0559:DOTCRP%3E2.0.CO;2'
},
{
  authors: 'Brier, G. W.',
  year: 1950,
  title: 'Verification of forecasts expressed in terms of probability',
  venue: 'Monthly Weather Review 78(1)',
  url: 'https://doi.org/10.1175/1520-0493(1950)078%3C0001:VOFEIT%3E2.0.CO;2'
},
{
  authors: 'Lam, R., et al.',
  year: 2023,
  title: 'Learning skillful medium-range global weather forecasting',
  venue: 'Science 382(6677)',
  url: 'https://doi.org/10.1126/science.adi2336'
},
{
  authors: 'Bi, K., et al.',
  year: 2023,
  title: 'Accurate medium-range global weather forecasting with 3D neural networks',
  venue: 'Nature 619',
  url: 'https://doi.org/10.1038/s41586-023-06185-3'
}];


export const datasets: Dataset[] = [
{ name: 'Global deterministic NWP', kind: 'Forecast source', role: 'Physics-based deterministic guidance (for example GFS or ECMWF open data).' },
{ name: 'Regional NWP', kind: 'Forecast source', role: 'Higher-resolution regional runs where available.' },
{ name: 'Global ensemble systems', kind: 'Forecast source', role: 'Ensemble mean and spread (for example GEFS or ECMWF ENS open data).' },
{ name: 'AI weather models', kind: 'Forecast source', role: 'Openly available ML forecasts (for example GraphCast or Pangu-Weather output).' },
{ name: 'ERA5 reanalysis', kind: 'Reference', role: 'Gridded reference for training and verification.' },
{ name: 'IMD gridded rainfall & temperature', kind: 'Reference', role: 'Observation-based gridded products over India.' },
{ name: 'Station observations', kind: 'Reference', role: 'Point verification for cities and extreme events.' }];