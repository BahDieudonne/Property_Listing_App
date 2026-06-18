const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const resolveImageUrl = (src) => {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return `${API_BASE_URL}${src}`;
  return `${API_BASE_URL}/uploads/${src}`;
};

export const fallbackImageUrl = (label, width = 400, height = 250) => {
  const text = (label || 'Property').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#1e2130"/>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#g)"/>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2a2f4d"/>
          <stop offset="100%" stop-color="#0f1222"/>
        </linearGradient>
      </defs>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}" fill="#9095b0">
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
