/**
 * Admin Dashboard Logic
 * Checks authentication, renders report table, handles resolution toggle and deletion
 */
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    window.location.href = '../login/index.html';
    return;
  }

  const tableBody = document.getElementById('admin-table-body');
  const totalCountEl = document.getElementById('admin-total-count');
  const lostCountEl = document.getElementById('admin-lost-count');
  const foundCountEl = document.getElementById('admin-found-count');
  const resolvedCountEl = document.getElementById('admin-resolved-count');
  const searchInput = document.getElementById('admin-search-input');
  const filterTypeSelect = document.getElementById('admin-filter-type');
  const logoutBtn = document.getElementById('btn-admin-logout');

  const deleteModal = document.getElementById('delete-modal');
  const deleteItemNameEl = document.getElementById('delete-item-name');
  const cancelDeleteBtn = document.getElementById('btn-cancel-delete');
  const confirmDeleteBtn = document.getElementById('btn-confirm-delete');

  let allItems = [];
  let pendingDeleteId = null;

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '../login/index.html';
    });
  }

  // Load and render all reports
  async function loadAdminReports() {
    if (tableBody) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--slate-400);">Loading reports...</td></tr>';
    }

    try {
      const res = await fetch(`${API_BASE_URL}/items`);
      const result = await res.json();
      allItems = result.data || [];

      // Update counters
      const lost = allItems.filter(i => i.type === 'lost').length;
      const found = allItems.filter(i => i.type === 'found').length;
      const resolved = allItems.filter(i => i.status === 'resolved').length;

      if (totalCountEl) totalCountEl.textContent = allItems.length;
      if (lostCountEl) lostCountEl.textContent = lost;
      if (foundCountEl) foundCountEl.textContent = found;
      if (resolvedCountEl) resolvedCountEl.textContent = resolved;

      renderTable();
    } catch (err) {
      console.error('Failed to load admin items:', err);
      if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--lost-color);">Error connecting to backend server.</td></tr>';
      }
    }
  }

  function renderTable() {
    if (!tableBody) return;

    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const typeFilter = filterTypeSelect ? filterTypeSelect.value : 'all';

    const filtered = allItems.filter(item => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesSearch =
        !query ||
        (item.itemName || '').toLowerCase().includes(query) ||
        (item.location || '').toLowerCase().includes(query) ||
        (item.contactName || '').toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--slate-400);">No matching reports found.</td></tr>';
      return;
    }

    tableBody.innerHTML = filtered.map(item => {
      const isLost = item.type === 'lost';
      const badgeStyle = isLost
        ? 'background: var(--lost-light); color: var(--lost-color); border: 1px solid var(--lost-border);'
        : 'background: var(--found-light); color: var(--found-color); border: 1px solid var(--found-border);';
      const isResolved = item.status === 'resolved';

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${item.imageUrl || ''}" alt="" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; background: #eee;">
              <div>
                <strong>${escapeHtml(item.itemName)}</strong>
                <div style="font-size: 0.72rem; color: var(--slate-400);">ID: ${item.id ? item.id.slice(0, 8) + '...' : ''}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; ${badgeStyle}">
              ${escapeHtml(item.type)}
            </span>
          </td>
          <td>${escapeHtml(item.category)}</td>
          <td>
            <div>${escapeHtml(item.location)}</div>
            <div style="font-size: 0.75rem; color: var(--slate-400);">${formatDate(item.date)}</div>
          </td>
          <td>
            <div>${escapeHtml(item.contactName || '')}</div>
            <div style="font-size: 0.75rem; color: var(--slate-400);">${escapeHtml(item.contactEmail || item.contactPhone || '')}</div>
          </td>
          <td>
            <button
              type="button"
              class="btn-status-toggle"
              data-id="${item.id}"
              data-status="${item.status || 'active'}"
              style="padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; ${isResolved ? 'background: #dbeafe; color: #1e40af;' : 'background: var(--slate-100); color: var(--slate-600);'}"
            >
              ${isResolved ? '✓ Reunited' : 'Active'}
            </button>
          </td>
          <td style="text-align: right;">
            <a href="../item-details/index.html?id=${encodeURIComponent(item.id)}" style="display: inline-block; padding: 4px 8px; font-size: 0.8rem; color: var(--primary); font-weight: 700;">View</a>
            <button type="button" class="btn-delete-report btn-delete-sm" data-id="${item.id}" data-name="${escapeHtml(item.itemName)}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row event listeners
    document.querySelectorAll('.btn-status-toggle').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const cur = btn.dataset.status;
        const next = cur === 'resolved' ? 'active' : 'resolved';
        try {
          await fetch(`${API_BASE_URL}/items/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: next })
          });
          loadAdminReports();
        } catch (err) {
          alert('Failed to update status.');
        }
      });
    });

    document.querySelectorAll('.btn-delete-report').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingDeleteId = btn.dataset.id;
        if (deleteItemNameEl) deleteItemNameEl.textContent = btn.dataset.name;
        if (deleteModal) deleteModal.style.display = 'flex';
      });
    });
  }

  // Filter & Search events
  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (filterTypeSelect) filterTypeSelect.addEventListener('change', renderTable);

  // Modal actions
  if (cancelDeleteBtn && deleteModal) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.style.display = 'none';
      pendingDeleteId = null;
    });
  }

  if (confirmDeleteBtn && deleteModal) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      try {
        await fetch(`${API_BASE_URL}/items/${encodeURIComponent(pendingDeleteId)}`, {
          method: 'DELETE'
        });
        deleteModal.style.display = 'none';
        pendingDeleteId = null;
        loadAdminReports();
      } catch (err) {
        alert('Failed to delete report.');
      }
    });
  }

  loadAdminReports();
});
