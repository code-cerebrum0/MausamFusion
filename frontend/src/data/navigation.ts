import type { NavGroup, NavItem } from '../types/content';

export const mainNav: NavItem[] = [
{ label: 'Overview', to: '/' },
{ label: 'Forecast', to: '/forecast' },
{ label: 'Model Weights', to: '/weights' },
{ label: 'Verification', to: '/verification' },
{ label: 'Architecture', to: '/architecture' },
{ label: 'API', to: '/api' },
{ label: 'Documentation', to: '/docs' }];


export const footerNav: NavGroup[] = [
{
  title: 'Product',
  links: [
  { label: 'Overview', to: '/' },
  { label: 'The problem', to: '/#problem' },
  { label: 'Six-stage pipeline', to: '/#pipeline' },
  { label: 'Contact', to: '/contact' }]

},
{
  title: 'Forecast',
  links: [
  { label: 'Forecast dashboard', to: '/forecast' },
  { label: 'Why this forecast?', to: '/forecast#explain' },
  { label: 'Uncertainty', to: '/forecast#uncertainty' },
  { label: 'Extreme weather', to: '/forecast#extremes' },
  { label: 'Model weights', to: '/weights' },
  { label: 'Forecast comparison', to: '/weights#comparison' }]

},
{
  title: 'Verification',
  links: [
  { label: 'Verification dashboard', to: '/verification' },
  { label: 'Calibration', to: '/verification#calibration' },
  { label: 'Verification records', to: '/verification#timeline' }]

},
{
  title: 'Architecture',
  links: [
  { label: 'System architecture', to: '/architecture' },
  { label: 'Software architecture', to: '/architecture#software' },
  { label: 'Reliability', to: '/architecture#reliability' },
  { label: 'Security & governance', to: '/architecture#governance' }]

},
{
  title: 'Developers',
  links: [
  { label: 'API reference', to: '/api' },
  { label: 'Documentation', to: '/docs' },
  { label: 'GitHub repository', to: '/docs#source-code' },
  { label: 'References', to: '/docs#references' },
  { label: 'FAQ', to: '/docs#faq' }]

}];