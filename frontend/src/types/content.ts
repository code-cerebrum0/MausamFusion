export interface NavItem {
  label: string;
  to: string;
}

export interface NavGroup {
  title: string;
  links: NavItem[];
}

export interface SearchEntry {
  title: string;
  section: string;
  to: string;
  description: string;
  keywords: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  summary: string;
  inputs: string[];
  outputs: string[];
}

export interface ArchitectureNode {
  id: string;
  title: string;
  responsibility: string;
  inputs: string[];
  outputs: string[];
}

export interface ApiParam {
  name: string;
  location: 'query' | 'path' | 'body';
  type: string;
  required: boolean;
  description: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  description: string;
  params: ApiParam[];
  requestBody?: string;
  response: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReliabilityCase {
  id: string;
  title: string;
  detection: string;
  response: string;
}

export interface GovernanceItem {
  id: string;
  title: string;
  description: string;
}

export interface Reference {
  authors: string;
  year: number;
  title: string;
  venue: string;
  url: string;
}

export interface Dataset {
  name: string;
  kind: string;
  role: string;
}