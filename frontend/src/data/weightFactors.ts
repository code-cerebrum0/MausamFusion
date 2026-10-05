export const weightFactors = [
{ id: 'location', title: 'Location', text: 'Terrain, coastline and local climate change how each source performs at a grid cell.' },
{ id: 'season', title: 'Season', text: 'Seasonal circulation (monsoon, winter, pre-monsoon) shifts which physics matters most.' },
{ id: 'lead', title: 'Lead time', text: 'Deterministic guidance often holds up at short range; spread-aware sources can matter more later.' },
{ id: 'regime', title: 'Weather regime', text: 'Cyclonic, heat or fog regimes are learned as distinct contexts.' },
{ id: 'historical', title: 'Historical skill', text: 'Long-term verified skill of each source in comparable contexts.' },
{ id: 'recent', title: 'Recent skill', text: 'Exponentially weighted skill over recent cycles captures model upgrades and drift.' },
{ id: 'disagreement', title: 'Model disagreement', text: 'How far sources disagree right now — a signal about trust and weight confidence.' }];