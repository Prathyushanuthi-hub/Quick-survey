# Categories Feature - Test Strategy and Test Cases

## Test Strategy Overview

### Testing Philosophy
- **Test-First Mindset:** Consider testability in design
- **Comprehensive Coverage:** Unit, integration, and E2E tests
- **Automation Priority:** Automate repetitive tests
- **Continuous Testing:** Run tests in CI/CD pipeline
- **Quality Gates:** Block deployments on test failures

### Testing Pyramid

```
       /\
      /E2E\         (Few - Slow - Expensive)
     /------\
    /  API  \       (Some - Medium - Moderate)
   /----------\
  /   Unit     \    (Many - Fast - Cheap)
 /--------------\
```

### Test Levels

1. **Unit Tests** (Target: 80% coverage)
   - Individual functions
   - Validation logic
   - Data transformations

2. **Integration Tests** (Target: 70% coverage)
   - API endpoints
   - Database operations
   - File I/O operations

3. **End-to-End Tests** (Target: Critical paths)
   - User workflows
   - Complete CRUD operations
   - Error scenarios

4. **Manual Tests**
   - UI/UX validation
   - Accessibility testing
   - Cross-browser testing

## Test Environment Setup

### Development Environment
```bash
# Install test dependencies
npm install --save-dev jest supertest @testing-library/dom

# Create test structure
mkdir -p tests/unit tests/integration tests/e2e

# Run tests
npm test
```

### Test Configuration

#### Jest Configuration (package.json)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest tests/integration",
    "test:unit": "jest tests/unit"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "server.js",
      "categories.js",
      "!node_modules/**"
    ],
    "testMatch": [
      "**/tests/**/*.test.js"
    ]
  }
}
```

## Unit Tests

### Server-side Unit Tests

#### Test File: `tests/unit/validation.test.js`

```javascript
describe('Category Validation', () => {
  describe('Name Validation', () => {
    test('should reject empty name', () => {
      const result = validateCategoryName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Category name is required');
    });

    test('should reject whitespace-only name', () => {
      const result = validateCategoryName('   ');
      expect(result.valid).toBe(false);
    });

    test('should accept valid name', () => {
      const result = validateCategoryName('Customer Feedback');
      expect(result.valid).toBe(true);
    });

    test('should trim whitespace', () => {
      const result = validateCategoryName('  Test  ');
      expect(result.value).toBe('Test');
    });

    test('should reject non-string values', () => {
      expect(validateCategoryName(123).valid).toBe(false);
      expect(validateCategoryName(null).valid).toBe(false);
      expect(validateCategoryName(undefined).valid).toBe(false);
    });
  });

  describe('Color Validation', () => {
    test('should accept valid hex color', () => {
      expect(validateColor('#667eea').valid).toBe(true);
      expect(validateColor('#FFF').valid).toBe(true);
    });

    test('should reject invalid hex color', () => {
      expect(validateColor('667eea').valid).toBe(false);
      expect(validateColor('#GGG').valid).toBe(false);
    });

    test('should use default color if not provided', () => {
      expect(validateColor(undefined).value).toBe('#667eea');
    });
  });

  describe('Uniqueness Check', () => {
    const existingCategories = [
      { id: 1, name: 'Customer Feedback' },
      { id: 2, name: 'Product Survey' }
    ];

    test('should detect duplicate names (case-insensitive)', () => {
      expect(
        isUniqueName('customer feedback', existingCategories)
      ).toBe(false);
      
      expect(
        isUniqueName('CUSTOMER FEEDBACK', existingCategories)
      ).toBe(false);
    });

    test('should allow unique names', () => {
      expect(
        isUniqueName('New Category', existingCategories)
      ).toBe(true);
    });

    test('should allow same name for update (exclude current)', () => {
      expect(
        isUniqueName('Customer Feedback', existingCategories, 1)
      ).toBe(true);
    });
  });
});
```

### Client-side Unit Tests

#### Test File: `tests/unit/category-manager.test.js`

```javascript
describe('CategoryManager', () => {
  let categoryManager;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="category-form">
        <input id="category-name" />
        <textarea id="category-description"></textarea>
        <input id="category-color" type="color" />
      </form>
      <div id="categories-container"></div>
    `;
    categoryManager = new CategoryManager();
  });

  describe('HTML Escaping', () => {
    test('should escape HTML in category names', () => {
      const malicious = '<script>alert("XSS")</script>';
      const escaped = categoryManager.escapeHtml(malicious);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    test('should escape special characters', () => {
      expect(categoryManager.escapeHtml('Test & Co')).toBe('Test &amp; Co');
      expect(categoryManager.escapeHtml('A > B')).toBe('A &gt; B');
      expect(categoryManager.escapeHtml('C < D')).toBe('C &lt; D');
    });
  });

  describe('Form Reset', () => {
    test('should clear all form fields', () => {
      document.getElementById('category-name').value = 'Test';
      document.getElementById('category-description').value = 'Desc';
      
      categoryManager.resetForm();
      
      expect(document.getElementById('category-name').value).toBe('');
      expect(document.getElementById('category-description').value).toBe('');
    });

    test('should reset to create mode', () => {
      categoryManager.editingId = 5;
      categoryManager.resetForm();
      expect(categoryManager.editingId).toBeNull();
    });
  });

  describe('Color Preview Update', () => {
    test('should update preview background color', () => {
      const preview = document.createElement('div');
      preview.id = 'color-preview';
      document.body.appendChild(preview);
      
      categoryManager.updateColorPreview('#ff0000');
      
      expect(preview.style.background).toBe('rgb(255, 0, 0)');
    });
  });
});
```

## Integration Tests

### API Integration Tests

#### Test File: `tests/integration/categories-api.test.js`

```javascript
const request = require('supertest');
const app = require('../../server');

describe('Categories API', () => {
  // Clean up before and after tests
  beforeEach(async () => {
    // Reset test database
    await resetTestData();
  });

  describe('GET /api/categories', () => {
    test('should return empty array when no categories exist', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all categories', async () => {
      // Create test categories
      await createTestCategory('Category 1');
      await createTestCategory('Category 2');

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/categories/:id', () => {
    test('should return category by id', async () => {
      const created = await createTestCategory('Test Category');

      const response = await request(app)
        .get(`/api/categories/${created.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Category');
      expect(response.body.data.id).toBe(created.id);
    });

    test('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/categories/9999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Category not found');
    });
  });

  describe('POST /api/categories', () => {
    test('should create new category with valid data', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'Test description',
        color: '#667eea'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Category');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    test('should reject empty name', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('name is required');
    });

    test('should reject duplicate names', async () => {
      await createTestCategory('Duplicate');

      const response = await request(app)
        .post('/api/categories')
        .send({ name: 'Duplicate' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    test('should use default color if not provided', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: 'Test' })
        .expect(201);

      expect(response.body.data.color).toBe('#667eea');
    });
  });

  describe('PUT /api/categories/:id', () => {
    test('should update category with valid data', async () => {
      const created = await createTestCategory('Original');

      const response = await request(app)
        .put(`/api/categories/${created.id}`)
        .send({ name: 'Updated', color: '#ff0000' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated');
      expect(response.body.data.color).toBe('#ff0000');
      expect(response.body.data.updatedAt).not.toBe(created.createdAt);
    });

    test('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .put('/api/categories/9999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('should reject duplicate name on update', async () => {
      const cat1 = await createTestCategory('Category 1');
      await createTestCategory('Category 2');

      const response = await request(app)
        .put(`/api/categories/${cat1.id}`)
        .send({ name: 'Category 2' })
        .expect(400);

      expect(response.body.error).toContain('already exists');
    });

    test('should allow partial updates', async () => {
      const created = await createTestCategory('Test', 'Original Desc');

      const response = await request(app)
        .put(`/api/categories/${created.id}`)
        .send({ description: 'New Desc' })
        .expect(200);

      expect(response.body.data.name).toBe('Test');
      expect(response.body.data.description).toBe('New Desc');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    test('should delete category', async () => {
      const created = await createTestCategory('To Delete');

      const response = await request(app)
        .delete(`/api/categories/${created.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(created.id);

      // Verify deletion
      await request(app)
        .get(`/api/categories/${created.id}`)
        .expect(404);
    });

    test('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .delete('/api/categories/9999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
```

### File I/O Integration Tests

#### Test File: `tests/integration/file-operations.test.js`

```javascript
const fs = require('fs');
const path = require('path');

describe('File Operations', () => {
  const testFile = path.join(__dirname, 'test-categories.json');

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  test('should save categories to file', () => {
    const data = {
      categories: [{ id: 1, name: 'Test' }],
      nextId: 2
    };

    saveCategories(testFile, data);

    expect(fs.existsSync(testFile)).toBe(true);
    const loaded = JSON.parse(fs.readFileSync(testFile, 'utf8'));
    expect(loaded.categories).toHaveLength(1);
  });

  test('should load categories from file', () => {
    const data = {
      categories: [{ id: 1, name: 'Test' }],
      nextId: 2
    };
    fs.writeFileSync(testFile, JSON.stringify(data));

    const loaded = loadCategories(testFile);

    expect(loaded.categories).toHaveLength(1);
    expect(loaded.nextId).toBe(2);
  });

  test('should handle missing file gracefully', () => {
    const loaded = loadCategories(testFile);

    expect(loaded.categories).toEqual([]);
    expect(loaded.nextId).toBe(1);
  });

  test('should handle corrupted JSON', () => {
    fs.writeFileSync(testFile, 'invalid json{');

    const loaded = loadCategories(testFile);

    expect(loaded.categories).toEqual([]);
    expect(loaded.nextId).toBe(1);
  });
});
```

## End-to-End Tests

### User Flow E2E Tests

#### Test File: `tests/e2e/category-crud.test.js`

```javascript
const puppeteer = require('puppeteer');

describe('Category CRUD E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.goto('http://localhost:3000/categories.html');
  });

  test('should create a new category', async () => {
    // Fill form
    await page.type('#category-name', 'E2E Test Category');
    await page.type('#category-description', 'Created by E2E test');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for success notification
    await page.waitForSelector('.notification.success', { timeout: 3000 });
    
    // Verify category appears in list
    const categoryExists = await page.evaluate(() => {
      return document.body.textContent.includes('E2E Test Category');
    });
    expect(categoryExists).toBe(true);
  });

  test('should edit an existing category', async () => {
    // Create a category first
    await createCategoryViaUI(page, 'Original Name');
    
    // Click edit button
    await page.click('.btn-edit');
    
    // Modify name
    await page.click('#category-name', { clickCount: 3 });
    await page.type('#category-name', 'Updated Name');
    
    // Submit
    await page.click('#submit-btn');
    
    // Verify update
    await page.waitForSelector('.notification.success');
    const hasUpdated = await page.evaluate(() => {
      return document.body.textContent.includes('Updated Name');
    });
    expect(hasUpdated).toBe(true);
  });

  test('should delete a category with confirmation', async () => {
    // Create a category
    await createCategoryViaUI(page, 'To Be Deleted');
    
    // Set up dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });
    
    // Click delete
    await page.click('.btn-delete');
    
    // Verify deletion
    await page.waitForSelector('.notification.success');
    const stillExists = await page.evaluate(() => {
      return document.body.textContent.includes('To Be Deleted');
    });
    expect(stillExists).toBe(false);
  });

  test('should show validation error for empty name', async () => {
    await page.click('button[type="submit"]');
    
    const error = await page.waitForSelector('.notification.error');
    const errorText = await error.evaluate(el => el.textContent);
    
    expect(errorText).toContain('required');
  });

  test('should prevent duplicate category names', async () => {
    // Create first category
    await createCategoryViaUI(page, 'Duplicate Test');
    
    // Try to create duplicate
    await page.type('#category-name', 'Duplicate Test');
    await page.click('button[type="submit"]');
    
    // Verify error
    const error = await page.waitForSelector('.notification.error');
    const errorText = await error.evaluate(el => el.textContent);
    
    expect(errorText).toContain('already exists');
  });
});

async function createCategoryViaUI(page, name) {
  await page.type('#category-name', name);
  await page.click('button[type="submit"]');
  await page.waitForSelector('.notification.success');
}
```

## Manual Test Cases

### Functional Test Cases

#### TC-001: Create Category
**Priority:** High
**Preconditions:** Server running, categories page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to categories.html | Page loads successfully |
| 2 | Enter "Test Category" in name field | Text appears in field |
| 3 | Enter "Test description" in description | Text appears in field |
| 4 | Select color #ff0000 | Color preview updates to red |
| 5 | Click "Create Category" button | Success notification appears |
| 6 | | Category appears in list below |
| 7 | | Form resets to empty state |

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

#### TC-002: Edit Category
**Priority:** High
**Preconditions:** At least one category exists

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Edit" on a category | Form populates with category data |
| 2 | | "Create" changes to "Update" button |
| 3 | | "Cancel" button appears |
| 4 | Modify the name | Changes reflect in form |
| 5 | Click "Update Category" | Success notification appears |
| 6 | | Category updates in list |
| 7 | | Form resets to create mode |

#### TC-003: Delete Category
**Priority:** High
**Preconditions:** At least one category exists

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Delete" on a category | Confirmation dialog appears |
| 2 | Click "Cancel" in dialog | Dialog closes, no deletion |
| 3 | Click "Delete" again | Confirmation dialog appears |
| 4 | Click "OK" in dialog | Success notification appears |
| 5 | | Category removed from list |

#### TC-004: Validation - Empty Name
**Priority:** High

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Leave name field empty | - |
| 2 | Click "Create Category" | Error notification appears |
| 3 | | Message says "name is required" |
| 4 | | No category created |

#### TC-005: Validation - Duplicate Name
**Priority:** High

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create category "Test" | Success |
| 2 | Try to create another "Test" | Error notification appears |
| 3 | | Message mentions "already exists" |

### UI/UX Test Cases

#### TC-101: Responsive Design - Mobile
**Priority:** Medium

Test on viewport: 375x667 (iPhone SE)

- [ ] Form is readable and usable
- [ ] Buttons are easily tappable (min 44x44px)
- [ ] List items stack properly
- [ ] No horizontal scroll
- [ ] Text is legible

#### TC-102: Responsive Design - Tablet
**Priority:** Medium

Test on viewport: 768x1024 (iPad)

- [ ] Layout adjusts appropriately
- [ ] All features accessible
- [ ] Good use of space

#### TC-103: Color Picker
**Priority:** Low

- [ ] Color picker opens on click
- [ ] Preview updates in real-time
- [ ] Selected color persists
- [ ] Works in create and edit modes

#### TC-104: Keyboard Navigation
**Priority:** High

- [ ] Tab moves between fields correctly
- [ ] Enter submits form from text inputs
- [ ] Escape cancels edit mode
- [ ] All interactive elements are focusable
- [ ] Focus indicators are visible

### Accessibility Test Cases

#### TC-201: Screen Reader Compatibility
**Test with:** NVDA / JAWS / VoiceOver

- [ ] Form labels are announced
- [ ] Button purposes are clear
- [ ] Error messages are announced
- [ ] Success messages are announced
- [ ] List structure is understandable

#### TC-202: Keyboard-Only Navigation
- [ ] Can complete entire workflow with keyboard
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Skip links work (if implemented)

#### TC-203: Color Contrast
**Tool:** WAVE / axe DevTools

- [ ] All text meets WCAG AA (4.5:1)
- [ ] Interactive elements meet 3:1 ratio
- [ ] Focus indicators are visible

#### TC-204: Zoom Testing
**Test at:** 200% zoom

- [ ] No content overflow
- [ ] All features remain usable
- [ ] No loss of information

### Performance Test Cases

#### TC-301: Load Time
- [ ] Initial page load < 2 seconds
- [ ] Categories list loads < 1 second
- [ ] Form submission responds < 500ms

#### TC-302: Large Dataset
**Preconditions:** 1000+ categories

- [ ] List renders in reasonable time
- [ ] Scroll performance is smooth
- [ ] Memory usage stays reasonable

### Security Test Cases

#### TC-401: XSS Prevention
**Input:** `<script>alert('XSS')</script>`

- [ ] Script not executed
- [ ] Content is escaped in display
- [ ] No console errors

#### TC-402: SQL Injection (Future)
**Input:** `'; DROP TABLE categories;--`

- [ ] Input treated as string
- [ ] No database errors
- [ ] Category created/updated normally

## Test Execution

### Test Schedule

#### Pre-Commit
- Run unit tests
- Run linter

#### Pre-Push
- Run all unit tests
- Run integration tests
- Check coverage

#### CI Pipeline
- Run all automated tests
- Generate coverage report
- Run security scan

#### Pre-Release
- Run all automated tests
- Execute manual test suite
- Perform accessibility audit
- Load testing
- Security audit

### Coverage Goals

| Test Level | Target Coverage |
|------------|----------------|
| Unit Tests | 80% |
| Integration Tests | 70% |
| E2E Tests | Critical paths only |
| Manual Tests | 100% of test cases |

### Test Metrics

Track:
- Test pass rate
- Code coverage percentage
- Number of bugs found
- Mean time to detection (MTTD)
- Mean time to resolution (MTTR)

## Test Data Management

### Test Categories
```json
{
  "testCategories": [
    {
      "name": "Test Category 1",
      "description": "First test category",
      "color": "#667eea"
    },
    {
      "name": "Test Category 2",
      "description": "Second test category",
      "color": "#10b981"
    }
  ]
}
```

### Test Data Cleanup
- Reset test database before each test suite
- Clean up created categories after E2E tests
- Use isolated test environment

## Bug Tracking

### Bug Report Template
```
Title: [Component] Brief description

Environment:
- Browser: 
- OS:
- Server version:

Steps to Reproduce:
1. 
2.
3.

Expected Result:

Actual Result:

Screenshots/Logs:

Severity: Critical / High / Medium / Low
Priority: P0 / P1 / P2 / P3
```

This comprehensive test strategy ensures the Categories feature is thoroughly tested at all levels, from individual functions to complete user workflows, maintaining high quality and reliability.
