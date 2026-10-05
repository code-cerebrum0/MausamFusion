export type Variable = 'temperature' | 'rainfall' | 'wind';
export type SourceId = 'nwp' | 'ensemble' | 'ai';
export type ModelChoice = 'blend' | SourceId;
export type Weights = Record<SourceId, number>;
export type MethodId = 'best' | 'equal' | 'fixed' | 'skill' | 'fusion';

export interface ForecastContext {
  locationId: string;
  variable: Variable;
  date: string;
  leadHours: number;
  model: ModelChoice;
  regimeId: string;
}

export interface LocationInfo {
  id: string;
  name: string;
  lat: number;
  lon: number;
  region: string;
}

export interface RegimeInfo {
  id: string;
  label: string;
  season: string;
  description: string;
  tempOffset: number;
  rainFactor: number;
  windFactor: number;
  bias: Weights;
}

export interface VariableInfo {
  id: Variable;
  label: string;
  unit: string;
  long: string;
}

export interface SourceInfo {
  id: SourceId;
  label: string;
  name: string;
  description: string;
}

export interface RegionInfo {
  id: string;
  label: string;
  lat: number;
  lon: number;
}

export interface ExtremeEvent {
  id: string;
  label: string;
  variable: Variable;
  threshold: number;
  unit: string;
  basis: string;
}

export interface Option {
  value: string;
  label: string;
}