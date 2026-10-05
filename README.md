# MausamFusion

## Context-Aware Hybrid AI–NWP Multi-Model Forecast Blending

> **We do not replace weather models — we learn when each model should
> matter.**

## Table of Contents

- [Problem](#1-problem)
- [Solution](#2-solution)
- [Core Forecasting Model](#3-core-forecasting-model)
- [System Architecture](#4-system-architecture)
- [Forecast Source Adapters](#5-forecast-source-adapters)
- [Data Harmonization and Quality Control](#6-data-harmonization-and-quality-control)
- [Forecast Context](#7-forecast-context)
- [Historical and Recent Skill Memory](#8-historical-and-recent-skill-memory)
- [Adaptive Gating and Dynamic Weights](#9-adaptive-gating-and-dynamic-weights)
- [Leakage-Safe Learning](#10-leakage-safe-learning)
- [Forecast Blending](#11-forecast-blending)
- [Uncertainty and Calibration](#12-uncertainty-and-calibration)
- [Extreme-Weather Guidance](#13-extreme-weather-guidance)
- [Verification and Skill Update](#14-verification-and-skill-update)
- [Evaluation and Baselines](#15-evaluation-and-baselines)
- [Data Model](#16-data-model)
- [Software Architecture](#17-software-architecture)
- [Repository Structure](#18-repository-structure)
- [API](#19-api)
- [Dashboard](#20-dashboard)
- [Reliability and Failure Handling](#21-reliability-and-failure-handling)
- [Security and Governance](#22-security-and-governance)
- [Deployment](#23-deployment)
- [Reproducibility](#24-reproducibility)
- [Performance and Scaling](#25-performance-and-scaling)
- [Expected Operational Outputs](#26-expected-operational-outputs)
- [Interpretation of Results](#27-interpretation-of-results)
- [Limitations](#28-limitations)
- [References and Useful Resources](#29-references-and-useful-resources)
- [License](#30-license)

MausamFusion is an end-to-end forecast intelligence system that combines
**Numerical Weather Prediction (NWP) models, ensemble forecasts, and AI
weather models** into an adaptive multi-model forecast.

The system does not train a new global weather model from scratch.
Instead, it acts as an intelligence layer above existing forecast
systems and learns how much each source should contribute for a
particular **location, season, lead time, weather regime, and current
forecast situation**.

### What the completed system provides

- Blended rainfall, temperature, and wind forecasts
- Dynamic model weights
- Spatial model-weight maps
- Forecast uncertainty indicators
- Calibrated extreme-weather guidance
- Model contribution information
- Automated forecast verification
- Persistent historical and recent skill memory
- A closed-loop mechanism for updating future model weights
- API and dashboard interfaces for operational use

------------------------------------------------------------------------

# 1. Problem

Different forecast systems can have different strengths depending on:

- region
- season
- forecast lead time
- weather regime
- variable
- current atmospheric state

A fixed global model weighting therefore cannot represent all forecast
situations equally well.

MausamFusion treats multi-model forecasting as a **context-dependent
blending problem**.

The system receives forecasts from multiple sources and learns the
relative contribution of each source for the current forecast context.

------------------------------------------------------------------------

# 2. Solution

The completed system has six major stages:

1.  **Ingest and harmonize** heterogeneous forecast sources.
2.  **Build forecast context** from location, time, weather regime,
    model disagreement, and available skill information.
3.  **Generate dynamic model weights** using an adaptive gating model.
4.  **Blend the forecasts** into a single forecast field.
5.  **Add uncertainty and extreme-event guidance.**
6.  **Verify the result later against observations and update skill
    memory.**

The complete operational flow is:

``` mermaid
flowchart LR
    A["NWP + Ensemble + AI Forecasts"]
    B["Source Adapters"]
    C["Harmonization + Quality Control"]
    D["Context + Skill Features"]
    E["Adaptive Gating Model"]
    F["Dynamic Model Weights"]
    G["Hybrid Forecast"]
    H["Uncertainty + Extreme Guidance"]
    I["Verification"]
    J["Skill Memory Update"]

    A --> B --> C --> D --> E --> F --> G --> H --> I --> J
    J -. "Updated skill" .-> D
```

Historical skill is persistent information used during future forecast
runs. It is updated only after the corresponding forecasts can be
verified.

------------------------------------------------------------------------

# 3. Core Forecasting Model

For a forecast variable (v), location (x), and valid time (t), the
blended forecast is:

$$
F_{\text{blend}}(x,t,v)
=
\sum_{i=1}^{N}
w_i(x,t,v)\,F_i(x,t,v)
$$

The model weights satisfy:

$$
w_i(x,t,v) \geq 0
$$

and

$$
\sum_{i=1}^{N} w_i(x,t,v)=1
$$

The weight for each source is context-dependent:

$$
w_i =
f(
\text{Location},
\text{Lead Time},
\text{Season},
\text{Weather Regime},
\text{Historical Skill},
\text{Recent Skill},
\text{Model Disagreement},
\text{Current Forecast State}
)
$$

Therefore, the same source can receive different weights at different
locations, seasons, lead times, or weather regimes.

A model weight represents **relative contribution for a particular
forecast context**, not an absolute ranking of model quality.

------------------------------------------------------------------------

# 4. System Architecture

``` mermaid
flowchart TB

    subgraph SOURCES["Forecast Sources"]
        NWP["NWP Models<br/>IFS / GFS / Regional"]
        ENS["Ensemble Forecasts<br/>Multi-member + Spread"]
        AI["AI Forecasts<br/>GraphCast / Pangu-like / Other AI Sources"]
    end

    OBS["Reference Observations"]

    ADAPTER["Forecast Source Adapters"]
    QC["Data Harmonization & Quality Control"]

    CONTEXT["Current Forecast Context"]
    MEMORY["Historical + Recent Skill Memory"]
    GATE["Adaptive Gating Model"]
    WEIGHTS["Spatial + Temporal Dynamic Weights"]

    BLEND["Hybrid Forecast Blending"]
    UNC["Uncertainty & Calibration"]
    EXTREME["Extreme-Weather Guidance"]

    VERIFY["Forecast Verification"]
    UPDATE["Skill Memory Update"]

    NWP --> ADAPTER
    ENS --> ADAPTER
    AI --> ADAPTER

    ADAPTER --> QC

    QC --> CONTEXT
    MEMORY --> GATE
    CONTEXT --> GATE
    QC --> GATE

    GATE --> WEIGHTS
    WEIGHTS --> BLEND
    QC --> BLEND

    BLEND --> UNC
    UNC --> EXTREME

    BLEND --> VERIFY
    EXTREME --> VERIFY
    OBS --> VERIFY

    VERIFY --> UPDATE
    UPDATE --> MEMORY
```

## Component responsibilities

| Component                        | Responsibility                                                                                  |
|----------------------------------|-------------------------------------------------------------------------------------------------|
| Forecast Source Adapters         | Convert heterogeneous source formats into the common forecast schema                            |
| Data Harmonization & QC          | Regrid fields, normalize units, align time/lead information, and validate inputs                |
| Current Forecast Context         | Builds information available at forecast issuance                                               |
| Historical + Recent Skill Memory | Stores model performance conditioned on region, season, lead time, regime, and recent behaviour |
| Adaptive Gating Model            | Predicts relative usefulness of each available forecast source                                  |
| Dynamic Weight Engine            | Converts model scores into constrained normalized weights                                       |
| Blend Engine                     | Produces the final multi-model forecast field                                                   |
| Uncertainty & Calibration        | Estimates forecast spread and calibrates probabilistic outputs                                  |
| Extreme-Weather Guidance         | Produces event probabilities or indicators for defined extreme events                           |
| Verification Engine              | Compares forecasts with later observations                                                      |
| Skill Memory Update              | Converts verification results into information used by future runs                              |
| API                              | Serves forecasts, weights, uncertainty, events, and verification                                |
| Dashboard                        | Provides maps, comparisons, model contributions, and verification views                         |

------------------------------------------------------------------------

# 5. Forecast Source Adapters

Forecast systems can differ in:

- file format
- grid definition
- spatial resolution
- units
- forecast cycle
- lead-time convention
- variable naming
- ensemble representation
- metadata

MausamFusion therefore isolates source-specific logic inside adapters.

Conceptually:

``` text
Raw Source
    │
    ▼
Source Adapter
    │
    ▼
Common Forecast Schema
```

The core blending engine does not need to know how a particular source
originally represented its data.

## Supported input types

The architecture can work with:

- NetCDF
- GRIB-compatible forecast products
- Zarr
- Parquet metadata
- API-delivered forecast products

## Common forecast record

``` text
source_id
model_family
variable
issue_time
valid_time
lead_time
latitude
longitude
forecast_value
units
grid_definition
availability_status
ensemble_member (optional)
metadata
```

------------------------------------------------------------------------

# 6. Data Harmonization and Quality Control

After ingestion, forecast sources are converted to a common
representation.

### Spatial harmonization

Forecast fields are regridded to the target common grid.

### Unit harmonization

Variables are converted to standardized units before blending.

### Temporal alignment

Each forecast is aligned using:

``` text
Issue Time
     +
Valid Time
     +
Lead Time
```

### Quality checks

The pipeline checks for:

- missing fields
- invalid values
- inconsistent metadata
- unexpected dimensions
- duplicate forecast runs
- unavailable forecast sources

The resulting dataset is the only forecast representation consumed by
the core blending engine.

------------------------------------------------------------------------

# 7. Forecast Context

The adaptive model uses information available at forecast issuance.

## Context features

### Spatial

``` text
Latitude
Longitude
Region / Grid Cell
```

### Temporal

``` text
Month / Season
Issue Time
Lead Time
Forecast Cycle
```

### Weather state

``` text
Weather Regime
Current Forecast State
Recent Atmospheric State
Extreme-event indicators
```

### Model state

``` text
Historical Skill
Recent Skill
Rolling Error
Bias
Model Disagreement
Ensemble Spread
```

The context engine converts these values into the feature representation
consumed by the adaptive gating model.

------------------------------------------------------------------------

# 8. Historical and Recent Skill Memory

MausamFusion does not rely on a single global performance score.

Skill is tracked conditionally using:

``` text
Model
× Region
× Season
× Lead Time
× Weather Regime
```

Each skill record can contain:

- sample count
- MAE
- RMSE
- bias
- skill score
- recent rolling error
- recent bias
- time-decayed skill
- confidence / sample sufficiency
- verification timestamp

Example:

``` json
{
  "model": "model_a",
  "region": "north_india",
  "season": "monsoon",
  "lead_hours": 48,
  "weather_regime": "heavy_rain",
  "sample_count": 1840,
  "mae": 3.82,
  "rmse": 6.17,
  "bias": -0.41,
  "recent_mae": 3.54,
  "skill_score": 0.28
}
```

## Sparse-data backoff

A very specific combination may not have enough verified historical
samples.

The system therefore supports hierarchical backoff:

``` text
Model × Region × Season × Lead × Regime
                    │
             insufficient data?
                    │
                    ▼
       broader regional / seasonal skill
                    │
                    ▼
             broader model skill
```

This prevents unstable weights caused by extremely sparse historical
records.

------------------------------------------------------------------------

# 9. Adaptive Gating and Dynamic Weights

The adaptive gating model estimates the relative usefulness of each
available source.

Tree-based models such as **XGBoost** or **LightGBM** can be used for
this layer.

The process is:

``` text
Context Features
      │
      ▼
Adaptive Gating Model
      │
      ▼
Relative Model Scores
      │
      ▼
Non-negative Transformation
      │
      ▼
Weight Normalization
      │
      ▼
w₁ + w₂ + ... + wₙ = 1
```

The output is a weight vector for the current forecast context.

Example:

``` text
NWP       0.52
Ensemble  0.31
AI        0.17
```

The weights may vary spatially and temporally, creating model-weight
maps rather than one fixed global weight.

------------------------------------------------------------------------

# 10. Leakage-Safe Learning

Forecast weighting must never use information that would not have been
available when the forecast was issued.

The temporal rule is:

> **A forecast issued at time T may use only information available at or
> before T.**

Future observations are used only after the forecast's valid time has
passed and the forecast can be verified.

``` text
Forecast issued
      │
      ▼
Generate weights
      │
      ▼
Produce forecast
      │
      ▼
Observation becomes available later
      │
      ▼
Verification
      │
      ▼
Skill memory update
```

Evaluation uses chronological train/validation/test periods:

``` text
Earlier data                         Later data

|--------- TRAIN --------|-- VALIDATION --|------ TEST ------|
```

The test period remains unseen during model development.

------------------------------------------------------------------------

# 11. Forecast Blending

Once the dynamic weights are available, the blend engine combines the
aligned forecast fields using the equation defined in Section 3.

Supported forecast variables include:

- temperature
- precipitation/rainfall
- wind speed
- wind components where available
- additional variables through the adapter interface

## Missing forecast source

If a source is unavailable for a particular forecast run, it is excluded
and the remaining weights are renormalized.

Example:

``` text
Original weights

NWP       0.50
Ensemble  0.30
AI        0.20

AI unavailable

Renormalized weights

NWP       0.625
Ensemble  0.375
```

This allows the system to continue operating without treating a missing
forecast as a zero-valued forecast.

------------------------------------------------------------------------

# 12. Uncertainty and Calibration

MausamFusion keeps two concepts separate:

### Forecast uncertainty

How uncertain is the resulting forecast?

### Weight confidence

How confident is the system in the generated model contributions?

A weighted inter-model spread can be calculated around the blended
forecast.

Let:

$$
\mu = \sum_i w_iF_i
$$

Then a weighted spread can be represented as:

$$
\sigma^2 = \sum_i w_i(F_i-\mu)^2
$$

The uncertainty layer can expose this spread alongside the blended
forecast.

For probabilistic products, the system evaluates:

- calibration
- reliability
- Brier Score
- CRPS where appropriate

------------------------------------------------------------------------

# 13. Extreme-Weather Guidance

The initial extreme-event module supports:

- heavy rainfall
- heat wave
- high wind

Event definitions are configurable by region, variable, forecast
horizon, and operational definition.

The event processing sequence is:

``` text
Blended Forecast
      │
      ▼
Event Definition
      │
      ▼
Probability / Event Indicator
      │
      ▼
Calibration
      │
      ▼
Extreme-Weather Guidance
```

## Event evaluation

- Precision
- Recall
- F1
- Brier Score
- Reliability / calibration
- False-alarm rate
- Miss rate

Rare events are evaluated separately from ordinary forecast performance
because a system can have good average error while still performing
poorly on high-impact events.

------------------------------------------------------------------------

# 14. Verification and Skill Update

Verification converts forecast-observation comparisons into updated
skill information.

For every verifiable forecast:

1.  Match the forecast with the corresponding observation.
2.  Align spatial and temporal grids.
3.  Calculate forecast error.
4.  Calculate model-level verification metrics.
5.  Update recent performance.
6.  Update the appropriate conditional skill-memory records.
7.  Make the updated skill available to future forecast runs.

## Deterministic metrics

- MAE
- RMSE
- Bias
- Skill Score

## Probabilistic metrics

- Brier Score
- Reliability
- Calibration
- CRPS where applicable

## Extreme-event metrics

- Precision
- Recall
- F1
- False-alarm rate
- Miss rate

This creates the system's continuous learning mechanism without allowing
future observations to modify forecasts that were already issued.

------------------------------------------------------------------------

# 15. Evaluation and Baselines

MausamFusion is evaluated against clearly defined baselines:

| Method                | Description                                                                  |
|-----------------------|------------------------------------------------------------------------------|
| Best Individual Model | Performance of the strongest individual source under the evaluation protocol |
| Equal-Weight Mean     | Every available source receives the same weight                              |
| Fixed Global Weight   | A fixed weight vector learned from training data                             |
| Skill-Based Weighting | Weights derived from historical/recent skill                                 |
| MausamFusion          | Context-aware adaptive gating using the full feature set                     |

Evaluation is reported by:

- region
- season
- lead time
- variable
- weather regime
- extreme-event category

## Ablation studies

The full model is compared with versions that remove individual
information sources:

``` text
Full Model
   │
   ├── Without Region
   ├── Without Season
   ├── Without Lead Time
   ├── Without Weather Regime
   ├── Without Historical Skill
   └── Without Model Disagreement
```

This identifies which parts of the adaptive system contribute to
forecast performance.

------------------------------------------------------------------------

# 16. Data Model

The persistent system contains these core entities:

``` text
ForecastSource
ForecastRun
ForecastField
Observation
ContextSnapshot
ModelWeight
VerificationResult
SkillMemory
```

### ForecastSource

Stores information about an available NWP, ensemble, or AI source.

### ForecastRun

Identifies a specific source run, issue time, valid time, and lead time.

### ForecastField

References the scientific forecast data and its variable/grid/unit
metadata.

### ContextSnapshot

Stores the context used during a particular forecast generation.

### ModelWeight

Stores the generated source contribution and associated confidence
information.

### VerificationResult

Stores the comparison between forecast and observation.

### SkillMemory

Stores historical and recent performance used by future gating runs.

Large forecast arrays should be stored in scientific array formats such
as Zarr or NetCDF, while PostgreSQL/PostGIS can store metadata and
queryable geospatial information.

------------------------------------------------------------------------

# 17. Software Architecture

The implementation is divided into independent services and modules.

``` text
Web Dashboard
      │
      ▼
   FastAPI
      │
      ├── Forecast Service
      ├── Weight Service
      ├── Verification Service
      └── Source Service
             │
             ▼
       Core MausamFusion
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
   Adapters  Gating  Blending
       │       │       │
       │       ▼       │
       │   Skill Memory│
       │               │
       └───────┬───────┘
               ▼
        Scientific Storage
```

The dashboard and API are delivery layers. The core forecast pipeline
remains independent of the user interface.

------------------------------------------------------------------------

# 18. Repository Structure

``` text
mausamfusion/
├── README.md
├── LICENSE
├── pyproject.toml
├── requirements.txt
├── .env.example
├── docker-compose.yml
│
├── configs/
│   ├── variables.yaml
│   ├── regions.yaml
│   ├── sources.yaml
│   ├── thresholds.yaml
│   └── model.yaml
│
├── data/
│   ├── raw/
│   ├── intermediate/
│   ├── processed/
│   └── sample/
│
├── src/mausamfusion/
│   ├── adapters/
│   ├── harmonization/
│   ├── context/
│   ├── skill/
│   ├── gating/
│   ├── blending/
│   ├── uncertainty/
│   ├── extremes/
│   ├── verification/
│   ├── api/
│   └── pipeline/
│
├── models/
│   ├── gating/
│   ├── calibration/
│   └── metadata/
│
├── notebooks/
│   ├── 01_data_validation.ipynb
│   ├── 02_baselines.ipynb
│   ├── 03_gating_training.ipynb
│   ├── 04_evaluation.ipynb
│   └── 05_extreme_events.ipynb
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── leakage/
│
├── dashboard/
│   ├── app/
│   ├── components/
│   └── maps/
│
└── docs/
    ├── architecture.md
    ├── data-contract.md
    ├── api.md
    └── evaluation.md
```

------------------------------------------------------------------------

# 19. API

The API exposes forecast products and system intelligence.

| Method | Endpoint          | Purpose                           |
|--------|-------------------|-----------------------------------|
| GET    | `/health`         | Service health                    |
| GET    | `/sources`        | Available forecast sources        |
| GET    | `/forecasts`      | Query blended forecasts           |
| GET    | `/forecasts/{id}` | Retrieve a forecast run           |
| GET    | `/weights`        | Retrieve model weights            |
| GET    | `/weights/map`    | Retrieve spatial weight maps      |
| GET    | `/uncertainty`    | Retrieve uncertainty indicators   |
| GET    | `/extremes`       | Retrieve extreme-weather guidance |
| GET    | `/verification`   | Retrieve verification results     |
| GET    | `/skill`          | Retrieve skill-memory information |
| POST   | `/ingest`         | Submit forecast data              |
| POST   | `/verify`         | Trigger verification              |
| POST   | `/skill/update`   | Update skill memory               |

### Example response

``` json
{
  "forecast_id": "mf_20260930_0000_048",
  "issue_time": "2026-09-30T00:00:00Z",
  "valid_time": "2026-10-02T00:00:00Z",
  "lead_hours": 48,
  "variable": "temperature",
  "location": {
    "lat": 26.85,
    "lon": 80.95
  },
  "value": 31.7,
  "unit": "degC",
  "weights": {
    "nwp": 0.52,
    "ensemble": 0.31,
    "ai": 0.17
  },
  "uncertainty": 1.8,
  "weight_confidence": 0.84
}
```

------------------------------------------------------------------------

# 20. Dashboard

The dashboard is an operational interface over the API.

## Forecast Map

Displays:

- blended forecast
- selected variable
- valid time
- lead time
- spatial uncertainty
- extreme-event indicators

## Model Weight Map

Displays spatial contribution of each available forecast source.

## Forecast Comparison

Allows comparison between:

- individual source forecasts
- equal-weight forecast
- fixed-weight forecast
- skill-based forecast
- MausamFusion forecast

## Verification

Displays relevant:

- MAE
- RMSE
- Bias
- Skill Score
- Brier Score
- Precision
- Recall
- F1
- reliability/calibration

## Forecast Explainability

For a selected forecast, the interface can show:

``` text
Location
Season
Lead Time
Weather Regime
Historical Skill
Recent Skill
Model Disagreement
Generated Weights
```

These are the factors available to the gating system; a displayed model
weight is not presented as a causal explanation.

------------------------------------------------------------------------

# 21. Reliability and Failure Handling

## Missing forecast source

When a forecast source is unavailable:

``` text
Detect unavailable source
        │
        ▼
Exclude source from blend
        │
        ▼
Renormalize remaining weights
        │
        ▼
Continue forecast generation
```

## Corrupt input

Invalid files or records are rejected or quarantined before entering the
blending pipeline.

## Sparse skill data

The skill-memory backoff strategy from Section 8 prevents extremely
sparse combinations from producing unstable weights.

## Stale or delayed forecasts

Source metadata records availability and processing state so stale data
is not silently treated as a current forecast.

------------------------------------------------------------------------

# 22. Security and Governance

The core forecasting system does not require personal user data.

Production controls include:

- environment-based secrets
- no credentials in source control
- API authentication where required
- input validation
- schema validation
- audit logging
- versioned model artifacts
- versioned configuration
- reproducible verification records

Forecast lineage is maintained so that an output can be traced to:

``` text
Forecast ID
├── Source versions
├── Input forecast runs
├── Context snapshot
├── Generated weights
├── Gating model version
├── Calibration version
└── Verification result
```

------------------------------------------------------------------------

# 23. Deployment

A production deployment separates scientific data processing from
delivery services.

Typical services:

``` text
mausamfusion-api
mausamfusion-worker
mausamfusion-verifier
mausamfusion-dashboard
postgres-postgis
scientific-data-store
```

Docker can be used to make the application environment reproducible.

Large multidimensional forecast arrays remain in scientific storage,
while relational services handle metadata, configuration, state, and
queryable results.

------------------------------------------------------------------------

# 24. Reproducibility

Every experiment records:

``` text
Dataset version
Forecast source versions
Observation version
Code commit
Configuration version
Model artifact version
Training period
Validation period
Test period
Random seed
Evaluation metrics
```

This makes each reported experiment traceable to the data and software
configuration that produced it.

------------------------------------------------------------------------

# 25. Performance and Scaling

Weather data naturally forms high-dimensional arrays:

``` text
time × lead × variable × latitude × longitude × model
```

The implementation therefore uses:

- Xarray
- Dask
- chunked arrays
- Zarr
- spatial tiling
- incremental ingestion
- parallel verification
- cached skill features

The system processes the required spatial and temporal chunks instead of
loading complete global datasets into memory.

------------------------------------------------------------------------

# 26. Expected Operational Outputs

A completed MausamFusion run can produce:

### Forecast products

``` text
Blended Temperature
Blended Rainfall
Blended Wind
```

### Model intelligence

``` text
NWP Weight Map
Ensemble Weight Map
AI Weight Map
Weight Confidence
```

### Uncertainty

``` text
Inter-model Spread
Calibrated Probabilistic Information
```

### Extreme-weather guidance

``` text
Heavy Rainfall Guidance
Heat-Wave Guidance
High-Wind Guidance
```

### Verification

``` text
Forecast Error
Model Skill
Regional Skill
Seasonal Skill
Lead-Time Skill
Event Performance
```

------------------------------------------------------------------------

# 27. Interpretation of Results

Evaluation should not rely on a single global average.

A result report should identify:

``` text
Variable
Region
Season
Lead Time
Evaluation Period
Weather Regime
```

Example deterministic report:

``` text
Variable: Temperature
Lead: 48 h
Region: Evaluation Region
Period: Held-out Test Period

                     MAE    RMSE    Bias
------------------------------------------
NWP                  ...
Ensemble             ...
AI                   ...
Equal Weight         ...
Fixed Weight         ...
Skill Weight         ...
MausamFusion         ...
```

Example event report:

``` text
Event: Heavy Rainfall

                    Brier   Precision   Recall   F1
----------------------------------------------------
Baseline             ...
Equal Weight         ...
MausamFusion         ...
```

The purpose of these reports is to establish whether adaptive blending
adds measurable value under the defined evaluation protocol.

------------------------------------------------------------------------

# 28. Limitations

MausamFusion does not remove limitations present in its input
forecasting systems.

- If all source models share the same error, blending cannot recover
  information absent from all sources.
- Rare weather regimes may not have enough historical examples.
- Forecast model upgrades can make older skill records less
  representative.
- Dataset shift can change model usefulness.
- A model weight represents relative contribution, not causal
  importance.
- Extreme-event evaluation requires sufficiently long and representative
  datasets.
- Verification quality depends on the quality and alignment of reference
  observations.
- Operational integration with an external forecasting organization
  requires appropriate data interfaces, validation, governance, and
  deployment approval.

------------------------------------------------------------------------

# 29. References and Useful Resources

## Smart India Hackathon

- PS 26081: <https://sih2026.vuce.in/ps/SIH26081>
- Public PS 26081 mirror:
  <https://github.com/jeevansai-hub/SIH-2026-/blob/main/ps_2026/SIH26081.md>

## Scientific Weather Data

- WeatherBench 2: <https://weatherbench2.readthedocs.io/>
- Copernicus Climate Data Store / ERA5:
  <https://cds.climate.copernicus.eu/>
- ECMWF: <https://www.ecmwf.int/>

## Existing Forecasting Landscape

- ECMWF Open Data:
  <https://www.ecmwf.int/en/forecasts/datasets/open-data>
- DTN Frontier Weather:
  <https://www.dtn.com/weather/utilities-and-renewable-energy/frontier-weather/>
- WindBorne MetaMesh:
  <https://windbornesystems.com/blog/introducing-metamesh>
- The Weather Company:
  <https://www.weathercompany.com/weather-forecast-services/>

## Technology

- Xarray: <https://xarray.dev/>
- Dask: <https://www.dask.org/>
- Zarr: <https://zarr.dev/>
- XGBoost: <https://xgboost.readthedocs.io/>
- LightGBM: <https://lightgbm.readthedocs.io/>
- FastAPI: <https://fastapi.tiangolo.com/>
- PostGIS: <https://postgis.net/>
- MapLibre: <https://maplibre.org/>
- Plotly: <https://plotly.com/>

------------------------------------------------------------------------

# 30. License

Add an explicit software license before public distribution.

Third-party datasets, model outputs, and pretrained models remain
subject to their own licenses and usage conditions.
