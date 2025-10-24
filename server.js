const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// In-memory storage for categories (will be persisted to file)
const CATEGORIES_FILE = path.join(__dirname, 'categories-data.json');

// Initialize categories data
let categories = [];
let nextCategoryId = 1;

// Load categories from file if it exists
function loadCategories() {
    try {
        if (fs.existsSync(CATEGORIES_FILE)) {
            const data = fs.readFileSync(CATEGORIES_FILE, 'utf8');
            const parsed = JSON.parse(data);
            categories = parsed.categories || [];
            nextCategoryId = parsed.nextId || 1;
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        categories = [];
        nextCategoryId = 1;
    }
}

// Save categories to file
function saveCategories() {
    try {
        const data = {
            categories,
            nextId: nextCategoryId
        };
        fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving categories:', error);
    }
}

// Initialize data
loadCategories();

// API Routes

// Get all categories
app.get('/api/categories', (req, res) => {
    res.json({
        success: true,
        data: categories,
        count: categories.length
    });
});

// Get a specific category by ID
app.get('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const category = categories.find(c => c.id === id);
    
    if (!category) {
        return res.status(404).json({
            success: false,
            error: 'Category not found'
        });
    }
    
    res.json({
        success: true,
        data: category
    });
});

// Create a new category
app.post('/api/categories', (req, res) => {
    const { name, description, color } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Category name is required'
        });
    }
    
    // Check for duplicate name
    const existingCategory = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingCategory) {
        return res.status(400).json({
            success: false,
            error: 'Category with this name already exists'
        });
    }
    
    const newCategory = {
        id: nextCategoryId++,
        name: name.trim(),
        description: description || '',
        color: color || '#667eea',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    saveCategories();
    
    res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Category created successfully'
    });
});

// Update a category
app.put('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, color } = req.body;
    
    const categoryIndex = categories.findIndex(c => c.id === id);
    
    if (categoryIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Category not found'
        });
    }
    
    // Validation
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Category name must be a non-empty string'
            });
        }
        
        // Check for duplicate name (excluding current category)
        const existingCategory = categories.find(c => 
            c.id !== id && c.name.toLowerCase() === name.toLowerCase()
        );
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                error: 'Category with this name already exists'
            });
        }
    }
    
    // Update category
    const category = categories[categoryIndex];
    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (color !== undefined) category.color = color;
    category.updatedAt = new Date().toISOString();
    
    saveCategories();
    
    res.json({
        success: true,
        data: category,
        message: 'Category updated successfully'
    });
});

// Delete a category
app.delete('/api/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const categoryIndex = categories.findIndex(c => c.id === id);
    
    if (categoryIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Category not found'
        });
    }
    
    const deletedCategory = categories.splice(categoryIndex, 1)[0];
    saveCategories();
    
    res.json({
        success: true,
        data: deletedCategory,
        message: 'Category deleted successfully'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Categories API available at http://localhost:${PORT}/api/categories`);
});
