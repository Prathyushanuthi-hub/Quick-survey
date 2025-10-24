# Categories API Documentation

## Overview
The Categories API provides CRUD (Create, Read, Update, Delete) operations for managing survey categories. This API allows you to organize surveys into different categories for better organization and filtering.

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Categories
Retrieve a list of all categories.

**Endpoint:** `GET /api/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Customer Feedback",
      "description": "Surveys related to customer satisfaction",
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

---

### 2. Get Single Category
Retrieve details of a specific category by ID.

**Endpoint:** `GET /api/categories/:id`

**Parameters:**
- `id` (path parameter) - The category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Feedback",
    "description": "Surveys related to customer satisfaction",
    "color": "#667eea",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Category not found

---

### 3. Create Category
Create a new category.

**Endpoint:** `POST /api/categories`

**Request Body:**
```json
{
  "name": "Customer Feedback",
  "description": "Surveys related to customer satisfaction",
  "color": "#667eea"
}
```

**Fields:**
- `name` (required, string) - The category name (must be unique)
- `description` (optional, string) - Description of the category
- `color` (optional, string) - Hex color code (default: #667eea)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Feedback",
    "description": "Surveys related to customer satisfaction",
    "color": "#667eea",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

**Status Codes:**
- `201 Created` - Success
- `400 Bad Request` - Validation error (missing name or duplicate name)

---

### 4. Update Category
Update an existing category.

**Endpoint:** `PUT /api/categories/:id`

**Parameters:**
- `id` (path parameter) - The category ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#10b981"
}
```

**Fields:**
- `name` (optional, string) - The category name (must be unique)
- `description` (optional, string) - Description of the category
- `color` (optional, string) - Hex color code

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
- `404 Not Found` - Category not found

---

### 5. Delete Category
Delete a category by ID.

**Endpoint:** `DELETE /api/categories/:id`

**Parameters:**
- `id` (path parameter) - The category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Customer Feedback",
    "description": "Surveys related to customer satisfaction",
    "color": "#667eea",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  },
  "message": "Category deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Category not found

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Example Usage

### Using cURL

**Create a category:**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Feedback",
    "description": "Surveys related to customer satisfaction",
    "color": "#667eea"
  }'
```

**Get all categories:**
```bash
curl http://localhost:3000/api/categories
```

**Update a category:**
```bash
curl -X PUT http://localhost:3000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "description": "Updated description"
  }'
```

**Delete a category:**
```bash
curl -X DELETE http://localhost:3000/api/categories/1
```

### Using JavaScript Fetch API

**Create a category:**
```javascript
const response = await fetch('http://localhost:3000/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Customer Feedback',
    description: 'Surveys related to customer satisfaction',
    color: '#667eea'
  })
});
const result = await response.json();
```

**Get all categories:**
```javascript
const response = await fetch('http://localhost:3000/api/categories');
const result = await response.json();
```

## Data Storage

Categories are stored in `categories-data.json` in the project root directory. The data persists between server restarts.

## Running the Server

To start the API server:

```bash
npm start
```

Or:

```bash
node server.js
```

The server will start on port 3000 by default.

## CORS

The API has CORS enabled, allowing requests from any origin. This is suitable for development but should be configured more restrictively in production.
