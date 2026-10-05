import type { GovernanceItem } from '../types/content';

export const governanceItems: GovernanceItem[] = [
{ id: 'secrets', title: 'Environment-based secrets', description: 'Credentials and keys are read from the environment or a secret manager — never committed to code or configuration files.' },
{ id: 'input', title: 'Input validation', description: 'Every request parameter is type-checked and range-checked before it reaches a service.' },
{ id: 'schema', title: 'Schema validation', description: 'Ingested datasets and API payloads are validated against versioned schemas.' },
{ id: 'auth', title: 'API authentication', description: 'Token-based authentication with scoped permissions for read and write endpoints.' },
{ id: 'audit', title: 'Audit logging', description: 'Ingestion, configuration changes, verification jobs and skill updates are written to an append-only audit log.' },
{ id: 'models', title: 'Versioned models', description: 'Each gating model is stored with a version identifier, training window and feature set.' },
{ id: 'config', title: 'Versioned configuration', description: 'Thresholds, grids and source settings are versioned so any forecast can be traced to its configuration.' },
{ id: 'records', title: 'Reproducible verification records', description: 'Verification records capture data versions, configuration and code version so scores can be recomputed.' },
{ id: 'lineage', title: 'Forecast lineage', description: 'Every blended forecast lists the source runs, weights, model and configuration that produced it.' }];