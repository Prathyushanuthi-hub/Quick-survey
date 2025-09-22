# Quick Survey App - Design Document

## User Interface Design

### Design Philosophy
The Quick Survey App follows a modern, minimalist design approach with emphasis on:
- **Clarity**: Clean, uncluttered interface elements
- **Accessibility**: High contrast, readable fonts, keyboard navigation
- **Consistency**: Uniform styling across all components
- **Responsiveness**: Adaptive layout for all device sizes
- **Visual Hierarchy**: Clear information organization

### Color Palette
```css
Primary Colors:
- Background Gradient: #667eea to #764ba2 (Purple gradient)
- Card Background: #ffffff (White)
- Primary Button: #667eea to #764ba2 (Gradient)
- Secondary Button: #f8f9fa (Light gray)

Text Colors:
- Primary Text: #333333 (Dark gray)
- Secondary Text: #666666 (Medium gray)
- Placeholder Text: #999999 (Light gray)

Interactive Elements:
- Selected State: #667eea (Primary blue)
- Hover State: rgba(102, 126, 234, 0.1) (Light blue overlay)
- Border Color: #e9ecef (Light border)
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300 (Light), 400 (Regular), 600 (Semi-bold), 700 (Bold)
- **Font Sizes**: 
  - H1: 2.5rem (40px)
  - H2: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.9rem (14px)

### Layout Structure
```
Container (max-width: 600px)
├── Screen (absolute positioned cards)
│   ├── Welcome Screen
│   │   ├── Title (h1)
│   │   ├── Description (p)
│   │   └── Start Button
│   ├── Survey Screen
│   │   ├── Progress Header
│   │   │   ├── Progress Bar
│   │   │   └── Progress Text
│   │   ├── Question Container
│   │   │   ├── Question Title (h2)
│   │   │   ├── Question Description (p)
│   │   │   └── Options Container
│   │   └── Navigation Actions
│   │       ├── Previous Button
│   │       └── Next Button
│   └── Results Screen
│       ├── Thank You Message
│       ├── Survey Summary
│       └── Restart Button
```

### Component Design Specifications

#### Welcome Screen
- **Card Size**: 600px max width, 400px min height
- **Background**: White with 20px border radius
- **Shadow**: 0 20px 40px rgba(0, 0, 0, 0.1)
- **Content Alignment**: Centered
- **Animation**: Fade in with translate up effect

#### Progress Bar
- **Container**: Full width with 10px height
- **Background**: #e9ecef (Light gray)
- **Fill**: Linear gradient (#667eea to #764ba2)
- **Border Radius**: 5px
- **Animation**: Smooth width transition (0.3s ease)

#### Question Types

##### Multiple Choice Options
- **Layout**: Vertical stack with 10px gaps
- **Option Style**: 
  - Padding: 15px 20px
  - Border: 2px solid #e9ecef
  - Border Radius: 12px
  - Background: #ffffff
  - Hover: Transform translateY(-2px) + shadow
  - Selected: Border color #667eea + background tint

##### Rating Scale
- **Layout**: Horizontal grid (responsive)
- **Rating Buttons**: 
  - Size: 50px × 50px circles
  - Background: #f8f9fa
  - Border: 2px solid #e9ecef
  - Selected: Gradient background + white text
  - Labels: Below scale (left/right aligned)

##### Text Input
- **Field Style**:
  - Border: 2px solid #e9ecef
  - Border Radius: 12px
  - Padding: 15px
  - Font: Inherit from body
  - Focus: Border color #667eea + shadow
  - Rows: 4 (textarea)

#### Buttons
- **Primary Button**:
  - Background: Linear gradient (#667eea to #764ba2)
  - Color: White
  - Padding: 14px 28px
  - Border Radius: 12px
  - Font Weight: 600
  - Hover: Transform translateY(-2px) + enhanced shadow

- **Secondary Button**:
  - Background: #f8f9fa
  - Color: #666666
  - Border: 2px solid #e9ecef
  - Same padding and radius as primary
  - Hover: Background #e9ecef + transform

### Responsive Design Breakpoints

#### Desktop (> 768px)
- Container: 90% width, max 600px
- Screen padding: 40px
- Button layout: Horizontal (flex row)
- Rating grid: 10 columns (1-10)

#### Tablet (768px and below)
- Container: 95% width
- Screen padding: 30px 20px
- Font sizes: Reduced by 0.2rem
- Rating grid: Responsive wrapping

#### Mobile (480px and below)
- Screen padding: 25px 15px
- Button layout: Vertical stack (full width)
- Font sizes: Further reduced
- Rating buttons: Smaller (45px × 45px)

### Animation and Transitions

#### Screen Transitions
```css
.screen {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.screen.active {
  opacity: 1;
  transform: translateY(0);
}
```

#### Button Interactions
```css
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: enhanced;
}
```

#### Question Container
```css
.question-container {
  animation: fadeInUp 0.4s ease;
}
```

## API Design

### Current State: Client-Side Only
The application currently operates entirely on the client side without backend API integration.

### Data Flow
```
survey-data.json → SurveyApp.loadSurveyData() → Question Display → User Interaction → Local Storage → Results Display
```

### Future API Architecture

#### Base URL Structure
```
Production: https://api.quicksurvey.com/v1
Development: https://dev-api.quicksurvey.com/v1
```

#### Authentication
```
Header: Authorization: Bearer <token>
Content-Type: application/json
```

#### Core Endpoints

##### Survey Management
```
GET    /surveys              - List all surveys
POST   /surveys              - Create new survey
GET    /surveys/{id}         - Get survey details
PUT    /surveys/{id}         - Update survey
DELETE /surveys/{id}         - Delete survey
GET    /surveys/{id}/config  - Get survey configuration
```

##### Response Management
```
POST   /surveys/{id}/responses     - Submit survey response
GET    /surveys/{id}/responses     - Get all responses (admin)
GET    /surveys/{id}/analytics     - Get response analytics
GET    /responses/{responseId}     - Get specific response
```

##### User Management
```
POST   /auth/register        - User registration
POST   /auth/login          - User authentication
POST   /auth/logout         - User logout
GET    /auth/profile        - Get user profile
PUT    /auth/profile        - Update user profile
```

#### Data Models

##### Survey Configuration
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "questions": [
    {
      "id": "number",
      "type": "multiple-choice|rating|text",
      "title": "string",
      "description": "string",
      "required": "boolean",
      "options": ["string"], // for multiple-choice
      "scale": "number", // for rating
      "labels": { // for rating
        "low": "string",
        "high": "string"
      },
      "placeholder": "string" // for text
    }
  ],
  "settings": {
    "allowAnonymous": "boolean",
    "requireAuth": "boolean",
    "maxResponses": "number",
    "expiresAt": "ISO8601",
    "theme": "object"
  },
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "createdBy": "string"
}
```

##### Survey Response
```json
{
  "id": "string",
  "surveyId": "string",
  "userId": "string|null",
  "answers": {
    "questionId": "any" // answer value varies by question type
  },
  "metadata": {
    "userAgent": "string",
    "ipAddress": "string",
    "startTime": "ISO8601",
    "completionTime": "ISO8601",
    "referrer": "string"
  },
  "submittedAt": "ISO8601"
}
```

##### User Profile
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "admin|user",
  "preferences": {
    "theme": "light|dark",
    "notifications": "boolean",
    "timezone": "string"
  },
  "createdAt": "ISO8601",
  "lastLogin": "ISO8601"
}
```

#### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object|null"
  },
  "timestamp": "ISO8601",
  "requestId": "string"
}
```

#### Rate Limiting
- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 1000 requests per hour
- **Premium users**: 10000 requests per hour

#### Response Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **429**: Rate Limited
- **500**: Internal Server Error

## Database Design

### Current State: No Database
The application currently uses JSON files for configuration and client-side storage for temporary data.

### Future Database Architecture

#### Technology Choice: PostgreSQL
- **ACID Compliance**: Ensures data integrity
- **JSON Support**: Native JSON column types
- **Scalability**: Horizontal and vertical scaling options
- **Performance**: Excellent query optimization

#### Database Schema

##### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  preferences JSONB DEFAULT '{}',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

##### Surveys Table
```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  configuration JSONB NOT NULL,
  settings JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft',
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);
```

##### Survey Responses Table
```sql
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  answers JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_time_seconds INTEGER
);
```

##### Organizations Table (Future)
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### User Organization Memberships Table (Future)
```sql
CREATE TABLE user_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);
```

#### Indexes for Performance
```sql
-- Survey queries
CREATE INDEX idx_surveys_created_by ON surveys(created_by);
CREATE INDEX idx_surveys_status ON surveys(status);
CREATE INDEX idx_surveys_published_at ON surveys(published_at);

-- Response queries
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX idx_survey_responses_submitted_at ON survey_responses(submitted_at);

-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Data Relationships
```
Users (1) → (Many) Surveys
Users (1) → (Many) Survey Responses
Surveys (1) → (Many) Survey Responses
Organizations (1) → (Many) Users (Many-to-Many)
Organizations (1) → (Many) Surveys
```

#### Data Retention Policy
- **Survey Responses**: Retained indefinitely (user-configurable)
- **User Sessions**: 30 days
- **Audit Logs**: 1 year
- **Analytics Data**: Aggregated and anonymized after 2 years

#### Backup Strategy
- **Full Backup**: Daily at 2 AM UTC
- **Incremental Backup**: Every 6 hours
- **Point-in-time Recovery**: Up to 30 days
- **Geographic Replication**: Cross-region backup storage

This design document provides a comprehensive overview of the application's current design and future architectural plans, ensuring scalability, maintainability, and user experience excellence.