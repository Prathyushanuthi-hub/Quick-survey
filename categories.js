// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Category management class
class CategoryManager {
    constructor() {
        this.categories = [];
        this.editingId = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadCategories();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Color picker change
        document.getElementById('category-color').addEventListener('input', (e) => {
            this.updateColorPreview(e.target.value);
        });

        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.resetForm();
        });
    }

    updateColorPreview(color) {
        const preview = document.getElementById('color-preview');
        preview.style.background = color;
    }

    async loadCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const result = await response.json();
            
            if (result.success) {
                this.categories = result.data;
                this.renderCategories();
            } else {
                this.showNotification('Failed to load categories', 'error');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showNotification('Error connecting to server. Make sure the server is running.', 'error');
            this.renderEmptyState('Error loading categories. Please check server connection.');
        }
    }

    renderCategories() {
        const container = document.getElementById('categories-container');
        
        if (this.categories.length === 0) {
            this.renderEmptyState('No categories yet. Create your first category above!');
            return;
        }

        container.innerHTML = this.categories.map(category => `
            <div class="category-item">
                <div class="category-info">
                    <div class="category-name">
                        <span class="category-color-dot" style="background: ${category.color}"></span>
                        ${this.escapeHtml(category.name)}
                    </div>
                    <div class="category-description">${this.escapeHtml(category.description || 'No description')}</div>
                </div>
                <div class="category-actions">
                    <button class="btn-icon btn-edit" onclick="categoryManager.editCategory(${category.id})">
                        Edit
                    </button>
                    <button class="btn-icon btn-delete" onclick="categoryManager.deleteCategory(${category.id})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderEmptyState(message) {
        const container = document.getElementById('categories-container');
        container.innerHTML = `<div class="empty-state">${message}</div>`;
    }

    async handleSubmit() {
        const name = document.getElementById('category-name').value.trim();
        const description = document.getElementById('category-description').value.trim();
        const color = document.getElementById('category-color').value;

        if (!name) {
            this.showNotification('Category name is required', 'error');
            return;
        }

        const categoryData = { name, description, color };

        if (this.editingId) {
            await this.updateCategory(this.editingId, categoryData);
        } else {
            await this.createCategory(categoryData);
        }
    }

    async createCategory(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(result.message, 'success');
                this.resetForm();
                await this.loadCategories();
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            this.showNotification('Error creating category', 'error');
        }
    }

    async updateCategory(id, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(result.message, 'success');
                this.resetForm();
                await this.loadCategories();
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            this.showNotification('Error updating category', 'error');
        }
    }

    editCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.editingId = id;
        
        document.getElementById('category-id').value = id;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-description').value = category.description || '';
        document.getElementById('category-color').value = category.color;
        this.updateColorPreview(category.color);

        document.getElementById('form-title').textContent = 'Edit Category';
        document.getElementById('submit-btn').textContent = 'Update Category';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async deleteCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(result.message, 'success');
                await this.loadCategories();
            } else {
                this.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            this.showNotification('Error deleting category', 'error');
        }
    }

    resetForm() {
        this.editingId = null;
        
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
        document.getElementById('category-color').value = '#667eea';
        this.updateColorPreview('#667eea');

        document.getElementById('form-title').textContent = 'Create New Category';
        document.getElementById('submit-btn').textContent = 'Create Category';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the category manager
let categoryManager;
document.addEventListener('DOMContentLoaded', () => {
    categoryManager = new CategoryManager();
});
