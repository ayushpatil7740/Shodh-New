/**
 * Browse & Search Page Logic
 * Handles real-time search, category/type/location filtering, and sorting
 */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('browse-search-input');
  const searchForm = document.getElementById('browse-search-form');
  const typeButtons = document.querySelectorAll('.type-filter-btn');
  const categorySelect = document.getElementById('filter-category');
  const locationInput = document.getElementById('filter-location');
  const sortSelect = document.getElementById('filter-sort');
  const resetBtn = document.getElementById('btn-reset');
  const itemsGrid = document.getElementById('browse-items-grid');
  const itemsCountText = document.getElementById('items-count');

  // Read URL search params
  const urlParams = new URLSearchParams(window.location.search);
  let currentSearch = urlParams.get('search') || '';
  let currentType = urlParams.get('type') || 'all';
  let currentCategory = urlParams.get('category') || 'all';
  let currentLocation = urlParams.get('location') || '';
  let currentSort = urlParams.get('sort') || 'newest';

  // Populate form controls from initial URL params
  if (searchInput) searchInput.value = currentSearch;
  if (categorySelect) categorySelect.value = currentCategory;
  if (locationInput) locationInput.value = currentLocation;
  if (sortSelect) sortSelect.value = currentSort;

  typeButtons.forEach(btn => {
    if (btn.dataset.type === currentType) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Type filter buttons
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
      updateUrlAndFetch();
    });
  });

  // Category select change
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      currentCategory = categorySelect.value;
      updateUrlAndFetch();
    });
  }

  // Location input with debounce
  let locationDebounce;
  if (locationInput) {
    locationInput.addEventListener('input', () => {
      clearTimeout(locationDebounce);
      locationDebounce = setTimeout(() => {
        currentLocation = locationInput.value.trim();
        updateUrlAndFetch();
      }, 400);
    });
  }

  // Sort select change
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      updateUrlAndFetch();
    });
  }

  // Search form submit
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      currentSearch = searchInput.value.trim();
      updateUrlAndFetch();
    });
  }

  // Reset filters
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentSearch = '';
      currentType = 'all';
      currentCategory = 'all';
      currentLocation = '';
      currentSort = 'newest';

      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = 'all';
      if (locationInput) locationInput.value = '';
      if (sortSelect) sortSelect.value = 'newest';

      typeButtons.forEach(b => {
        if (b.dataset.type === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });

      updateUrlAndFetch();
    });
  }

  function updateUrlAndFetch() {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (currentType !== 'all') params.set('type', currentType);
    if (currentCategory !== 'all') params.set('category', currentCategory);
    if (currentLocation) params.set('location', currentLocation);
    if (currentSort !== 'newest') params.set('sort', currentSort);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);

    fetchCatalogItems();
  }

  async function fetchCatalogItems() {
    if (itemsGrid) {
      itemsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--slate-400);">Loading catalog items...</div>';
    }

    try {
      let items = [];

      if (currentSearch) {
        const res = await fetch(`${API_BASE_URL}/items/search?q=${encodeURIComponent(currentSearch)}`);
        const data = await res.json();
        items = data.data || [];
      } else {
        const query = new URLSearchParams();
        if (currentType !== 'all') query.set('type', currentType);
        if (currentCategory !== 'all') query.set('category', currentCategory);
        if (currentLocation) query.set('location', currentLocation);
        query.set('sort', currentSort);

        const res = await fetch(`${API_BASE_URL}/items?${query.toString()}`);
        const data = await res.json();
        items = data.data || [];
      }

      // If search was executed, also filter by active type, category, location, and sort
      if (currentSearch) {
        if (currentType !== 'all') {
          items = items.filter(i => i.type === currentType);
        }
        if (currentCategory !== 'all') {
          items = items.filter(i => (i.category || '').toLowerCase() === currentCategory.toLowerCase());
        }
        if (currentLocation) {
          const loc = currentLocation.toLowerCase();
          items = items.filter(i => (i.location || '').toLowerCase().includes(loc));
        }
        if (currentSort === 'oldest') {
          items.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
          items.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
      }

      if (itemsCountText) {
        itemsCountText.textContent = `Showing ${items.length} item${items.length === 1 ? '' : 's'}`;
      }

      if (items.length === 0) {
        itemsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--slate-800);">No items found</h3>
            <p style="color: var(--slate-500); font-size: 0.9rem; margin-top: 4px;">
              Try adjusting your search terms or clearing filters.
            </p>
          </div>
        `;
      } else {
        itemsGrid.innerHTML = items.map(item => renderItemCard(item, '..')).join('');
      }
    } catch (err) {
      console.error('Error fetching catalog:', err);
      if (itemsGrid) {
        itemsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--lost-color);">Unable to load items from server. Please verify the backend is running.</div>';
      }
    }
  }

  fetchCatalogItems();
});
