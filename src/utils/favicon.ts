const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0d1320"/><path d="M6 20a10 10 0 0 1 20 0" fill="none" stroke="#818cf8" stroke-width="3" stroke-linecap="round"/><path d="M10 20a6 6 0 0 1 12 0" fill="none" stroke="#f5b342" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="20" r="2.6" fill="#2dd4bf"/></svg>`;

export function setFavicon() {
  const href = `data:image/svg+xml,${encodeURIComponent(SVG)}`;
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = href;
}