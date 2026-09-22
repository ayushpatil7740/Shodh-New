const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const upload = require('../middleware/uploadMiddleware');

// Search items: GET /api/items/search?q=...
router.get('/search', itemsController.searchItems);

// Report Lost Item: POST /api/items/lost
router.post('/lost', upload.single('photo'), itemsController.createLostItem);

// Report Found Item: POST /api/items/found
router.post('/found', upload.single('photo'), itemsController.createFoundItem);

// Create Item: POST /api/items (supports body.type = 'lost' | 'found')
router.post('/', upload.single('photo'), itemsController.createItem);

// Get All Items: GET /api/items
router.get('/', itemsController.getAllItems);

// Get Matches for an item: GET /api/items/:id/matches
router.get('/:id/matches', itemsController.getItemMatches);

// Get Single Item: GET /api/items/:id
router.get('/:id', itemsController.getItemById);

// Delete Item: DELETE /api/items/:id
router.delete('/:id', itemsController.deleteItem);

// Update Item: PUT /api/items/:id
router.put('/:id', upload.single('photo'), itemsController.updateItem);

module.exports = router;
