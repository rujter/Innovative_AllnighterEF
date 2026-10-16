const paths = {
home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
passport:'<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="9" r="2.5"/><path d="M8 16c0-4 8-4 8 0M8 18h8"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2m4 0h2M8 18h2"/>',
pill:'<path d="m10 5-5 5a5 5 0 0 0 7 7l5-5a5 5 0 0 0-7-7ZM8 8l7 7"/>',
inbox:'<path d="M5 4h14l3 12v4H2v-4zM2 16h6l2 3h4l2-3h6"/>',
heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a6 6 0 0 1 3 5v2"/>',
settings:'<path d="m9 3-1 3-3 1-2 4 2 2v4l4 2 3-1 3 1 4-2v-4l2-2-2-4-3-1-1-3z"/><circle cx="12" cy="11" r="3"/>',
help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 .5-1 1-1 2m0 3h.01"/>',
arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',chevron:'<path d="m9 5 7 7-7 7"/>',plus:'<path d="M12 5v14M5 12h14"/>',
check:'<path d="m5 12 4 4L19 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
bell:'<path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10M10 21h4"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6zM8 12l3 3 5-6"/>',activity:'<path d="M2 12h5l3-8 4 16 3-8h5"/>',
stethoscope:'<path d="M5 3v6a5 5 0 0 0 10 0V3M3 3h4m6 0h4m-7 11v2a5 5 0 0 0 10 0v-3"/><circle cx="20" cy="10" r="3"/>',
file:'<path d="M14 2H5v20h14V7zM14 2v6h5M8 13h8m-8 4h6"/>',x:'<path d="m6 6 12 12M6 18 18 6"/>',
alert:'<path d="m12 3 10 18H2zM12 9v5m0 3h.01"/>',video:'<rect x="2" y="5" width="14" height="14" rx="3"/><path d="m16 10 6-4v12l-6-4"/>',
download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
leaf:'<path d="M20 3C4 2 2 11 5 16c4 7 16 3 15-13ZM4 21 16 9"/>',checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',logout:'<path d="M9 4H4v16h5m5-13 5 5-5 5M9 12h12"/>',location:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>'
};
export const icon = (name, extra='') => `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
