/**
 * Home Page Logic
 * Fetches recent items, statistics, and handles quick search
 */
document.addEventListener('DOMContentLoaded', () => {
  const recentGrid = document.getElementById('recent-items-grid');
  const lostGrid = document.getElementById('lost-items-grid');
  const foundGrid = document.getElementById('found-items-grid');

  const totalStat = document.getElementById('stat-total');
  const lostStat = document.getElementById('stat-lost');
  const foundStat = document.getElementById('stat-found');

  const searchForm = document.getElementById('hero-search-form');
  const searchInput = document.getElementById('hero-search-input');

  // Determine root path prefix based on whether we are at /home or root /
  const isSubFolder = window.location.pathname.includes('/home');
  const relativeRoot = isSubFolder ? '..' : '.';

  // Search submission redirect
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q) {
        window.location.href = `${relativeRoot}/browse/index.html?search=${encodeURIComponent(q)}`;
      } else {
        window.location.href = `${relativeRoot}/browse/index.html`;
      }
    });
  }

  // Load items from API
  async function loadHomeData() {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      const result = await response.json();
      const items = result.data || [];

      const lostItems = items.filter(i => i.type === 'lost');
      const foundItems = items.filter(i => i.type === 'found');

      // Update stats
      if (totalStat) totalStat.textContent = items.length;
      if (lostStat) lostStat.textContent = lostItems.length;
      if (foundStat) foundStat.textContent = foundItems.length;

      // Render recent items (top 4)
      if (recentGrid) {
        if (items.length === 0) {
          recentGrid.innerHTML = '<p class="empty-text">No items reported yet.</p>';
        } else {
          recentGrid.innerHTML = items.slice(0, 4).map(item => renderItemCard(item, relativeRoot)).join('');
        }
      }

      // Render lost items preview
      if (lostGrid) {
        if (lostItems.length === 0) {
          lostGrid.innerHTML = '<p class="empty-text">No lost items reported.</p>';
        } else {
          lostGrid.innerHTML = lostItems.slice(0, 4).map(item => renderItemCard(item, relativeRoot)).join('');
        }
      }

      // Render found items preview
      if (foundGrid) {
        if (foundItems.length === 0) {
          foundGrid.innerHTML = '<p class="empty-text">No found items reported.</p>';
        } else {
          foundGrid.innerHTML = foundItems.slice(0, 4).map(item => renderItemCard(item, relativeRoot)).join('');
        }
      }
    } catch (err) {
      console.error('Failed to load home page data:', err);
      if (recentGrid) {
        recentGrid.innerHTML = '<p class="empty-text">Could not connect to backend server. Make sure node server.js is running.</p>';
      }
    }
  }

  loadHomeData();
});
