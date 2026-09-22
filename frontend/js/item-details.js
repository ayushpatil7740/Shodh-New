/**
 * Item Details Page Logic
 * Fetches item details, toggles contact information, and renders algorithmic matches
 */
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');

  const container = document.getElementById('item-details-container');
  const errorContainer = document.getElementById('item-error-container');

  if (!itemId) {
    showError('No item ID provided in URL.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/items/${encodeURIComponent(itemId)}`);
    const result = await res.json();

    if (!res.ok || !result.success || !result.data) {
      showError('Item not found or could not be loaded.');
      return;
    }

    const item = result.data;
    const matches = result.matches || [];

    renderDetails(item, matches);
  } catch (err) {
    console.error('Error fetching details:', err);
    showError('Could not connect to backend server. Make sure it is running on port 5000.');
  }

  function showError(msg) {
    if (container) container.style.display = 'none';
    if (errorContainer) {
      errorContainer.style.display = 'block';
      errorContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem;">⚠️</div>
          <h2 style="font-size: 1.5rem; margin-top: 10px;">${escapeHtml(msg)}</h2>
          <p style="color: var(--slate-500); margin-top: 6px;"><a href="../browse/index.html" style="color: var(--primary); text-decoration: underline;">Back to Browse Items</a></p>
        </div>
      `;
    }
  }

  function renderDetails(item, matches) {
    const isLost = item.type === 'lost';
    const badgeClass = isLost ? 'badge-lost' : 'badge-found';
    const badgeText = isLost ? 'Lost Item' : 'Found Item';
    const fallbackImg = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&auto=format&fit=crop&q=80';

    document.title = `${item.itemName} | Lost & Found`;

    // Populate Item Image & Badges
    const galleryEl = document.getElementById('detail-gallery');
    galleryEl.innerHTML = `
      <img src="${item.imageUrl || fallbackImg}" alt="${escapeHtml(item.itemName)}" class="detail-img" onerror="this.src='${fallbackImg}'">
      <span class="${badgeClass}">${badgeText}</span>
      <span class="badge-category">${escapeHtml(item.category)}</span>
    `;

    // Populate Info
    document.getElementById('detail-title').textContent = item.itemName;
    document.getElementById('detail-desc').textContent = item.description;
    document.getElementById('detail-location').textContent = item.location;
    document.getElementById('detail-date').textContent = `${formatDate(item.date)} ${item.time ? 'at ' + item.time : ''}`;
    document.getElementById('detail-posted').textContent = formatDate(item.createdAt || item.date);

    // Additional info
    const addlBox = document.getElementById('detail-additional-box');
    if (item.additionalInfo && item.additionalInfo.trim()) {
      addlBox.style.display = 'block';
      document.getElementById('detail-additional').textContent = item.additionalInfo;
    } else {
      addlBox.style.display = 'none';
    }

    // Contact button logic
    const contactBtn = document.getElementById('btn-show-contact');
    const contactInfoBox = document.getElementById('contact-info-box');
    const contactNameEl = document.getElementById('contact-name-display');
    const contactEmailEl = document.getElementById('contact-email-display');
    const contactPhoneEl = document.getElementById('contact-phone-display');

    contactBtn.textContent = `Contact ${isLost ? 'Owner' : 'Finder'}`;

    contactBtn.addEventListener('click', () => {
      contactBtn.style.display = 'none';
      contactInfoBox.style.display = 'block';

      contactNameEl.textContent = item.contactName || 'Not specified';

      if (item.contactEmail) {
        contactEmailEl.innerHTML = `<a href="mailto:${encodeURIComponent(item.contactEmail)}?subject=Regarding Lost & Found: ${encodeURIComponent(item.itemName)}" style="color: var(--primary); text-decoration: underline;">${escapeHtml(item.contactEmail)}</a>`;
      } else {
        contactEmailEl.textContent = 'None provided';
      }

      if (item.contactPhone) {
        contactPhoneEl.innerHTML = `<a href="tel:${encodeURIComponent(item.contactPhone)}" style="color: var(--primary); text-decoration: underline;">${escapeHtml(item.contactPhone)}</a>`;
      } else {
        contactPhoneEl.textContent = 'None provided';
      }
    });

    // Populate Matches
    const matchesSection = document.getElementById('matches-container');
    if (matches && matches.length > 0) {
      matchesSection.innerHTML = matches.map(m => renderMatchCard(m, '..')).join('');
    } else {
      matchesSection.innerHTML = `
        <div style="background: var(--white); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 30px; text-align: center; color: var(--slate-500);">
          No algorithmic matches found for this item yet. When matching reports are submitted, they will appear here.
        </div>
      `;
    }

    container.style.display = 'block';
  }
});
