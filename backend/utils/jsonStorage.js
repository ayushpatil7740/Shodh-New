const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'items.json');

// Simple in-process write queue to prevent concurrent write race conditions
let writeQueue = Promise.resolve();

/**
 * Ensures data directory and items.json file exist.
 */
function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

/**
 * Safely reads all items from items.json.
 * Handles missing file and malformed JSON gracefully.
 */
async function getItems() {
  ensureFileExists();

  try {
    const rawData = await fs.promises.readFile(DATA_FILE, 'utf8');
    if (!rawData.trim()) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('Warning: items.json is not an array. Resetting to empty array.');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Error reading items.json:', error.message);
    // If JSON is malformed, attempt to back it up and recover safely
    try {
      const backupPath = path.join(DATA_DIR, `items.backup.${Date.now()}.json`);
      if (fs.existsSync(DATA_FILE)) {
        fs.copyFileSync(DATA_FILE, backupPath);
        console.warn(`Malformed items.json backed up to ${backupPath}`);
      }
    } catch (backupErr) {
      console.error('Failed to create backup of corrupted file:', backupErr.message);
    }
    return [];
  }
}

/**
 * Safely writes items to items.json using atomic write (write to temp file then rename).
 * Wrapped in a queue to prevent concurrent write collisions.
 */
async function saveAllItems(items) {
  ensureFileExists();

  // Enqueue this write operation to ensure sequential writes
  writeQueue = writeQueue.then(async () => {
    const jsonContent = JSON.stringify(items, null, 2);
    const tempFile = path.join(DATA_DIR, `items.${Date.now()}.${Math.random().toString(36).substring(2, 8)}.tmp`);

    try {
      await fs.promises.writeFile(tempFile, jsonContent, 'utf8');
      await fs.promises.rename(tempFile, DATA_FILE);
    } catch (renameErr) {
      // Windows / OneDrive locks can block rename with EPERM. Fallback to direct write.
      try {
        await fs.promises.writeFile(DATA_FILE, jsonContent, 'utf8');
      } catch (directErr) {
        console.error('Direct write to items.json also failed:', directErr.message);
        throw directErr;
      }
    } finally {
      if (fs.existsSync(tempFile)) {
        try {
          await fs.promises.unlink(tempFile);
        } catch (_) {}
      }
    }
  });

  return writeQueue;
}

/**
 * Get single item by ID
 */
async function getItemById(id) {
  const items = await getItems();
  return items.find((item) => String(item.id) === String(id)) || null;
}

/**
 * Save a new item
 */
async function saveItem(newItem) {
  const items = await getItems();
  items.unshift(newItem); // Newest items first
  await saveAllItems(items);
  return newItem;
}

/**
 * Update an existing item by ID
 */
async function updateItem(id, updateData) {
  const items = await getItems();
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index === -1) {
    return null;
  }

  // Preserve id and createdAt
  const updatedItem = {
    ...items[index],
    ...updateData,
    id: items[index].id,
    createdAt: items[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  items[index] = updatedItem;
  await saveAllItems(items);
  return updatedItem;
}

/**
 * Delete an item by ID
 */
async function deleteItem(id) {
  const items = await getItems();
  const initialLength = items.length;
  const filtered = items.filter((item) => String(item.id) !== String(id));

  if (filtered.length === initialLength) {
    return false; // Item not found
  }

  await saveAllItems(filtered);
  return true;
}

/**
 * Search items across multiple fields (itemName, description, category, location)
 * Case-insensitive substring matching.
 */
async function searchItems(query = '') {
  const items = await getItems();
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) {
    return items;
  }

  const terms = cleanQuery.split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    const haystack = [
      item.itemName || '',
      item.description || '',
      item.category || '',
      item.location || '',
      item.additionalInfo || ''
    ].join(' ').toLowerCase();

    // Check if all search terms or any term matches
    return terms.some((term) => haystack.includes(term));
  });
}

module.exports = {
  getItems,
  getItemById,
  saveItem,
  updateItem,
  deleteItem,
  searchItems,
  saveAllItems
};
