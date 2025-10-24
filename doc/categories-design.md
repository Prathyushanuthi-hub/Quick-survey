# Categories Feature - Design Document

## UI Design

### Design Philosophy
The Categories feature follows the existing Quick Survey design system with:
- **Consistency:** Matches the main app's visual language
- **Clarity:** Clear visual hierarchy and information architecture
- **Simplicity:** Minimal, focused interface
- **Feedback:** Immediate visual confirmation of actions

### Color Palette
Inherits from the main application:

```css
Primary Colors:
- Primary Blue: #667eea
- Primary Purple: #764ba2
- Success Green: #10b981
- Error Red: #ff4757
- Background Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

Neutral Colors:
- Text Primary: #333333
- Text Secondary: #666666
- Text Tertiary: #999999
- Border: #e9ecef
- Background: #ffffff
- Light Gray: #f8f9fa
```

### Typography
- **Font Family:** Inter (Google Fonts)
- **Weights:** 400 (Regular), 600 (Semi-bold), 700 (Bold)
- **Sizes:**
  - H1: 2rem (32px)
  - H2: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Component Specifications

#### Category Form Card
```css
.category-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 900px;
}
```

**Elements:**
- Form title (h2)
- Input fields with labels
- Color picker with preview
- Action buttons (Create/Update/Cancel)

#### Category List Item
```css
.category-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  gap: 15px;
  transition: all 0.3s ease;
}

.category-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
}
```

**Elements:**
- Color dot indicator (20px circle)
- Category name (bold)
- Description (secondary text)
- Edit button
- Delete button

#### Color Picker Interface
- HTML5 color input (60px × 40px)
- Live preview panel showing selected color
- Hex code display
- Default value: #667eea

#### Notification Toast
```css
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}
```

**Types:**
- Success: Green background (#10b981)
- Error: Red background (#ff4757)
- Auto-dismiss after 3 seconds

### Responsive Design

#### Desktop (> 768px)
- Container: 900px max-width
- Form: Full width within container
- List: Full width with hover effects
- Buttons: Side by side

#### Tablet (768px and below)
- Container: 95% width
- Adjusted padding: 20px
- Form elements: Full width

#### Mobile (< 480px)
- Container: 100% width
- Padding: 15px
- Buttons: Stacked vertically
- Font sizes: Slightly reduced

### Animations

#### Category Item Hover
```css
transition: all 0.3s ease;
transform: translateY(-2px);
box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
```

#### Notification Slide-in
```css
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

#### Form Transition
- Smooth transition when switching between create and edit modes
- No page reload, inline form updates

## API Design

### API Architecture

#### Base URL
```
Development: http://localhost:3000/api
Production: https://quicksurvey.com/api (future)
```

#### Request/Response Format
- **Content-Type:** application/json
- **Character Encoding:** UTF-8

#### Standard Response Structure

**Success Response:**
```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Endpoint Specifications

#### 1. List All Categories
**Endpoint:** `GET /api/categories`

**Query Parameters:** None (future: pagination, filtering)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Customer Feedback",
      "description": "Customer satisfaction surveys",
      "color": "#667eea",
      "createdAt": "2025-10-24T10:00:00.000Z",
      "updatedAt": "2025-10-24T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes:**
- `200 OK` - Success

#### 2. Get Single Category
**Endpoint:** `GET /api/categories/:id`

**Path Parameters:**
- `id` (integer) - Category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Feedback",
    "description": "Customer satisfaction surveys",
    "color": "#667eea",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Category doesn't exist

#### 3. Create Category
**Endpoint:** `POST /api/categories`

**Request Body:**
```json
{
  "name": "Customer Feedback",
  "description": "Customer satisfaction surveys",
  "color": "#667eea"
}
```

**Validation Rules:**
- `name`: Required, non-empty string, must be unique
- `description`: Optional string
- `color`: Optional hex color code, default #667eea

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Feedback",
    "description": "Customer satisfaction surveys",
    "color": "#667eea",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

**Status Codes:**
- `201 Created` - Success
- `400 Bad Request` - Validation error

**Error Examples:**
```json
{
  "success": false,
  "error": "Category name is required"
}
```
```json
{
  "success": false,
  "error": "Category with this name already exists"
}
```

#### 4. Update Category
**Endpoint:** `PUT /api/categories/:id`

**Path Parameters:**
- `id` (integer) - Category ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#10b981"
}
```

**Validation Rules:**
- All fields optional
- `name` must be unique if provided
- Only provided fields are updated

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Name",
    "description": "Updated description",
    "color": "#10b981",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:05:00.000Z"
  },
  "message": "Category updated successfully"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Validation error
- `404 Not Found` - Category doesn't exist

#### 5. Delete Category
**Endpoint:** `DELETE /api/categories/:id`

**Path Parameters:**
- `id` (integer) - Category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Feedback",
    "description": "Customer satisfaction surveys",
    "color": "#667eea",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  },
  "message": "Category deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Category doesn't exist

#### 6. Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-24T10:00:00.000Z"
}
```

### API Design Patterns

#### RESTful Principles
- Resource-based URLs
- HTTP verbs for actions
- Stateless communication
- Standard status codes

#### Error Handling
- Consistent error format
- Meaningful error messages
- Appropriate status codes
- No sensitive information in errors

#### Validation
- Server-side validation required
- Client-side validation for UX
- Clear validation messages
- Type checking

### Future API Enhancements

#### Pagination
```
GET /api/categories?page=1&limit=10
```

#### Filtering
```
GET /api/categories?search=feedback
GET /api/categories?color=#667eea
```

#### Sorting
```
GET /api/categories?sort=name&order=asc
```

#### Batch Operations
```
POST /api/categories/batch
DELETE /api/categories/batch
```

## Database Design

### Current Implementation: File-based Storage

#### Storage File
**File:** `categories-data.json`
**Location:** Project root directory

**Structure:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Customer Feedback",
      "description": "Customer satisfaction surveys",
      "color": "#667eea",
      "createdAt": "2025-10-24T10:00:00.000Z",
      "updatedAt": "2025-10-24T10:00:00.000Z"
    }
  ],
  "nextId": 2
}
```

**Operations:**
- Read: Load entire file into memory
- Create: Add to array, increment nextId, save file
- Update: Find in array, modify, save file
- Delete: Remove from array, save file

**Advantages:**
- Simple implementation
- No database setup required
- Easy to backup and inspect
- Portable

**Disadvantages:**
- Not suitable for concurrent access
- Performance issues with large datasets
- No transaction support
- Manual backup required

### Future Database Schema (PostgreSQL)

#### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#667eea',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Future fields
  icon VARCHAR(50),
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  
  -- Audit fields
  created_by INTEGER REFERENCES users(id),
  organization_id INTEGER REFERENCES organizations(id)
);

-- Indexes
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_organization_id ON categories(organization_id);
CREATE INDEX idx_categories_created_at ON categories(created_at);

-- Full-text search
CREATE INDEX idx_categories_search ON categories 
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

#### Category Statistics (Future)
```sql
CREATE TABLE category_stats (
  category_id INTEGER PRIMARY KEY REFERENCES categories(id) ON DELETE CASCADE,
  survey_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Survey-Category Relationship (Future)
```sql
CREATE TABLE survey_categories (
  survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (survey_id, category_id)
);

CREATE INDEX idx_survey_categories_survey ON survey_categories(survey_id);
CREATE INDEX idx_survey_categories_category ON survey_categories(category_id);
```

### Data Migration Plan

#### Phase 1: Preparation
1. Install PostgreSQL
2. Set up database connection pool
3. Create migration scripts
4. Test with sample data

#### Phase 2: Schema Creation
1. Create tables with proper constraints
2. Create indexes for performance
3. Set up triggers for updated_at
4. Configure backup strategy

#### Phase 3: Data Migration
1. Export data from JSON
2. Transform to SQL format
3. Import into database
4. Verify data integrity

#### Phase 4: Code Update
1. Add database driver (pg/Sequelize)
2. Replace file operations with queries
3. Update error handling
4. Add connection pooling

#### Phase 5: Testing
1. Test all CRUD operations
2. Performance benchmarking
3. Stress testing
4. Rollback plan ready

### Data Integrity

#### Current (JSON)
- Manual validation in code
- No foreign key constraints
- Sequential ID generation
- Manual timestamp management

#### Future (PostgreSQL)
- Database-level constraints
- Foreign key relationships
- Automatic ID generation (SERIAL)
- Automatic timestamps (triggers)
- Transaction support
- Row-level locking

### Backup Strategy

#### Current
- Manual file copying
- Recommended: Daily backups
- Version control for config

#### Future
- Automated daily backups
- Point-in-time recovery
- Cross-region replication
- Backup retention: 30 days
- Automated restore testing

## System Architecture

### Current Architecture
```
┌─────────────────┐
│   Browser       │
│  (categories.   │
│    html/js)     │
└────────┬────────┘
         │ HTTP
         │
┌────────▼────────┐
│  Express.js     │
│   Server        │
│  (server.js)    │
└────────┬────────┘
         │ File I/O
         │
┌────────▼────────┐
│ categories-     │
│  data.json      │
└─────────────────┘
```

### Future Architecture
```
┌─────────────────┐
│   Browser       │
│  (React/Vue)    │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐
│  API Gateway    │
│  (Express.js)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Auth  │  │Cache │
│Service│  │Redis │
└───┬──┘  └──────┘
    │
┌───▼──────────┐
│ PostgreSQL   │
│  Database    │
└──────────────┘
```

## Integration Points

### Frontend Integration
- Standalone page (categories.html)
- Link from main app welcome screen
- Shared CSS design system
- Consistent navigation

### Future Survey Integration
- Category selector on survey creation
- Category badge on survey list
- Filter surveys by category
- Category-based analytics

This design document provides comprehensive specifications for the Categories feature, ensuring consistency with the existing application while planning for future enhancements.
