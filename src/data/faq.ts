import type { FaqItem } from '../types/content';

export const faqItems: FaqItem[] = [
{
  question: 'What is MausamFusion?',
  answer:
  'MausamFusion is a context-aware multi-model forecast blending system. It ingests NWP, ensemble and AI weather forecasts, learns which source should carry more weight in each forecast context, and produces blended temperature, rainfall and wind forecasts with uncertainty, extreme-weather guidance and automated verification.'
},
{
  question: 'Does it replace weather models?',
  answer:
  'No. MausamFusion depends on existing forecast systems and does not modify them. Its job is to decide how much each available source should contribute for a given location, season, lead time and weather regime.'
},
{
  question: 'How are model weights generated?',
  answer:
  'An adaptive gating model — for example gradient-boosted trees such as XGBoost or LightGBM — takes the forecast context (location, season, lead time, regime, historical and recent skill, model disagreement and current forecast state) and outputs one score per source. Scores are normalised into non-negative weights that sum to one.'
},
{
  question: 'What is forecast uncertainty?',
  answer:
  'Forecast uncertainty describes how uncertain the resulting blended forecast is, for example a predictive interval derived from inter-model spread and residual history. It is distinct from weight confidence, which describes how confident the gating model is in the contributions it generated.'
},
{
  question: 'How does the system prevent data leakage?',
  answer:
  'Training and evaluation use time-ordered splits. Skill memory and gating features only use verification that would have been available before the forecast issue time, and evaluation uses rolling-origin or held-out periods that the gating model never saw during training.'
},
{
  question: 'How is model skill updated?',
  answer:
  'Once observations arrive, the verification service scores each source and the blend. Results are folded into skill memory per context bucket: a long-term historical estimate and an exponentially weighted recent estimate, both versioned with the verification record that produced them.'
},
{
  question: 'What happens if a forecast source is unavailable?',
  answer:
  'The unavailable source is excluded, the remaining weights are renormalised to sum to one, and the forecast continues. The missing source is recorded in forecast lineage and reflected in weight confidence.'
},
{
  question: 'What datasets can be used?',
  answer:
  'Any gridded forecast source with an adapter can be used — for example global or regional NWP, ensemble systems, and openly available AI weather model output. Reanalysis (such as ERA5), gridded observational products (such as IMD gridded rainfall and temperature) and station observations can serve as verification references, subject to each dataset’s licence.'
},
{
  question: 'How is the system evaluated?',
  answer:
  'MausamFusion is compared against the best individual model, an equal-weight mean, a fixed global weighting and skill-based weighting, using MAE, RMSE, bias, skill scores, CRPS, Brier score, reliability and event metrics such as precision, recall and F1. This site does not report any evaluation results; the dashboards use synthetic demonstration data.'
}];