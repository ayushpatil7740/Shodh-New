/**
 * Shared API Configuration & Helper Utilities
 * Works across local file opening, Live Server, and Express backend
 */
// Use relative /api path when served over http/https (works on localhost, Render, and any deployment).
// Fall back to absolute localhost URL only when opened directly as a local file (file://).
const API_BASE_URL = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
  ? '/api'
  : 'http://localhost:5000/api';

/**
 * Format date string into human readable format
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (_) {
    return dateStr;
  }
}

/**
 * Create standard item card HTML string
 */
function renderItemCard(item, relativeRoot = '.') {
  const isLost = item.type === 'lost';
  const badgeClass = isLost ? 'badge-lost' : 'badge-found';
  const badgeText = isLost ? 'Lost' : 'Found';
  const fallbackImg = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=500&auto=format&fit=crop&q=60';

  return `
    <article class="item-card">
      <div class="item-card-media">
        <img
          src="${item.imageUrl || fallbackImg}"
          alt="${escapeHtml(item.itemName)}"
          class="item-card-img"
          loading="lazy"
          onerror="this.src='${fallbackImg}'"
        />
        <span class="${badgeClass}">${badgeText}</span>
        <span class="badge-category">${escapeHtml(item.category)}</span>
      </div>
      <div class="item-card-body">
        <div>
          <h3 class="item-card-title">${escapeHtml(item.itemName)}</h3>
          <p class="item-card-desc">${escapeHtml(item.description)}</p>
          <div class="item-card-meta">
            <div class="meta-row">
              <span>📍</span>
              <span>${escapeHtml(item.location)}</span>
            </div>
            <div class="meta-row">
              <span>📅</span>
              <span>${formatDate(item.date)} ${item.time ? '• ' + escapeHtml(item.time) : ''}</span>
            </div>
          </div>
        </div>
        <div class="item-card-footer">
          <a href="${relativeRoot}/item-details/index.html?id=${encodeURIComponent(item.id)}" class="btn-card-action">
            View Details & Contact &rarr;
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Create possible match card HTML string
 */
function renderMatchCard(match, relativeRoot = '.') {
  const item = match.item;
  const isLost = item.type === 'lost';
  const fallbackImg = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=500&auto=format&fit=crop&q=60';
  const score = match.matchScore || 0;
  const scoreClass = score >= 70 ? 'match-score-high' : 'match-score-mid';

  const reasonsHtml = (match.reasons || [])
    .map(r => `<span class="match-reason-pill">✓ ${escapeHtml(r)}</span>`)
    .join('');

  return `
    <article class="match-card">
      <div class="match-media">
        <img src="${item.imageUrl || fallbackImg}" alt="${escapeHtml(item.itemName)}" class="match-img" onerror="this.src='${fallbackImg}'" />
      </div>
      <div class="match-body">
        <div>
          <div class="match-header">
            <span class="match-score-badge ${scoreClass}">Possible Match &mdash; ${match.matchPercentage || score + '%'}</span>
            <span style="font-size: 0.75rem; color: var(--slate-400);">${escapeHtml(item.category)}</span>
          </div>
          <h4 class="match-title">${escapeHtml(item.itemName)}</h4>
          <div class="match-info-row">
            ${isLost ? 'Lost at: ' : 'Found near: '}<strong>${escapeHtml(item.location)}</strong>
          </div>
          <div class="match-info-row">
            Date: <strong>${formatDate(item.date)}</strong>
          </div>
          <div class="match-reasons-list">
            ${reasonsHtml}
          </div>
        </div>
        <div style="margin-top: 12px; text-align: right;">
          <a href="${relativeRoot}/item-details/index.html?id=${encodeURIComponent(item.id)}" class="btn-card-action" style="display: inline-block; width: auto; padding: 6px 14px;">
            Verify Details &rarr;
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Simple HTML escape to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Mobile menu toggle setup
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
});
