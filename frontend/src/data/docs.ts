export const docSections = [
{ id: 'concepts', label: 'Core concepts' },
{ id: 'datasets', label: 'Datasets' },
{ id: 'evaluation', label: 'Evaluation protocol' },
{ id: 'source-code', label: 'Source code' },
{ id: 'references', label: 'References' },
{ id: 'faq', label: 'FAQ' }];


export const glossary = [
{ term: 'Forecast context', definition: 'The combination of location, season, lead time, weather regime, variable, skill history and current model disagreement for a single forecast cell.' },
{ term: 'Adaptive gating model', definition: 'A learned model that maps a forecast context to one score per available source.' },
{ term: 'Dynamic weights', definition: 'Non-negative source weights that sum to one, produced from gating scores for a specific context.' },
{ term: 'Skill memory', definition: 'Stored historical and recent verification skill per source and context bucket, available as gating features.' },
{ term: 'Forecast uncertainty', definition: 'Uncertainty in the blended forecast value, expressed as spread or a calibrated predictive interval.' },
{ term: 'Weight confidence', definition: 'How confident the system is in the generated contributions, lowered by strong disagreement or sparse skill data.' },
{ term: 'Renormalisation', definition: 'Rescaling the weights of the remaining sources so they sum to one when a source is excluded.' }];


export const evaluationSteps = [
{ title: 'Split by time', text: 'Hold out entire periods (rolling-origin or held-out years) so the gating model never trains on evaluation data.' },
{ title: 'Restrict features to issue time', text: 'Skill memory features only use verification that existed before each forecast was issued.' },
{ title: 'Score against references', text: 'Verify blended and baseline forecasts against reanalysis, gridded observations or stations.' },
{ title: 'Compare with baselines', text: 'Best individual model, equal-weight mean, fixed global weight and skill-based weighting on identical cases.' },
{ title: 'Report by context', text: 'Break results down by variable, region, season, lead time and regime rather than one global number.' },
{ title: 'Record for reproducibility', text: 'Write data versions, configuration and code version alongside every score.' }];