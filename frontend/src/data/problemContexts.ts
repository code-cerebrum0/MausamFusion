export const forecastDimensions = [
{ id: 'region', title: 'Region', text: 'Coastal, mountainous and plains terrain stress models differently.' },
{ id: 'season', title: 'Season', text: 'Monsoon, winter and pre-monsoon conditions change which physics dominates.' },
{ id: 'lead', title: 'Lead time', text: 'Short-range and medium-range skill degrade at different rates per source.' },
{ id: 'regime', title: 'Weather regime', text: 'Cyclones, heat waves and western disturbances favour different sources.' },
{ id: 'variable', title: 'Variable', text: 'A source that suits temperature may not suit rainfall or wind.' },
{ id: 'state', title: 'Current atmospheric state', text: 'Disagreement between sources today signals how much to trust each.' }];


export const problemContexts = [
{
  id: 'monsoon-rain',
  context: 'Monsoon rainfall',
  detail: 'Day 3 · West Coast',
  strength: { nwp: 0.35, ensemble: 0.85, ai: 0.5 },
  adaptive: { nwp: 22, ensemble: 56, ai: 22 }
},
{
  id: 'fog-temp',
  context: 'Winter fog temperature',
  detail: '24 h · North plains',
  strength: { nwp: 0.85, ensemble: 0.45, ai: 0.4 },
  adaptive: { nwp: 58, ensemble: 22, ai: 20 }
},
{
  id: 'heat',
  context: 'Pre-monsoon heat',
  detail: 'Day 5 · Central India',
  strength: { nwp: 0.45, ensemble: 0.55, ai: 0.8 },
  adaptive: { nwp: 24, ensemble: 30, ai: 46 }
},
{
  id: 'cyclone-wind',
  context: 'Cyclone wind',
  detail: '48 h · East coast',
  strength: { nwp: 0.6, ensemble: 0.8, ai: 0.4 },
  adaptive: { nwp: 33, ensemble: 47, ai: 20 }
}];


export const exploreLinks = [
{ to: '/forecast', title: 'Forecast dashboard', text: 'Explore the blended field, location cards, uncertainty and extreme-weather guidance.' },
{ to: '/weights', title: 'Model weights', text: 'See how NWP, ensemble and AI contributions shift with context, and compare blending methods.' },
{ to: '/verification', title: 'Verification', text: 'Continuous, probabilistic and event metrics with calibration and reproducible records.' },
{ to: '/architecture', title: 'Architecture', text: 'Click through the system loop, software services, failure handling and governance.' },
{ to: '/api', title: 'API reference', text: 'Thirteen REST endpoints with example requests and JSON responses.' }];