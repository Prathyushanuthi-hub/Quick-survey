# Quick Survey App

An attractive, interactive survey application with minimum functionality built using vanilla HTML, CSS, and JavaScript. Features a modern UI design with smooth animations and responsive layout.

## Features

- **Attractive UI Design**: Modern gradient background with clean, card-based interface
- **Interactive Elements**: Smooth hover effects, animations, and button interactions
- **Multiple Question Types**: 
  - Multiple choice questions
  - Rating scale (1-10) with visual feedback
  - Text input for open-ended responses
- **Progress Tracking**: Visual progress bar showing completion status
- **Responsive Design**: Optimized for both desktop and mobile devices
- **JSON Data Source**: Easy-to-modify survey questions stored in JSON format
- **Results Summary**: Complete overview of all responses at completion
- **Category Management**: Organize surveys with categories using CRUD API (requires backend server)

## Screenshots

### Welcome Screen
![Welcome Screen](https://github.com/user-attachments/assets/7c699bde-0083-4aa2-907e-70b830d60f16)

### Multiple Choice Question
![Multiple Choice](https://github.com/user-attachments/assets/97776aa7-8bd1-44ae-bd11-f75945e783c6)

### Rating Question
![Rating Question](https://github.com/user-attachments/assets/77be3f20-c120-4e67-b0b1-8aa70acf2aef)

### Text Input Question
![Text Input](https://github.com/user-attachments/assets/4bd4f127-0c0f-48d8-a568-86e235517b99)

### Results Summary
![Results](https://github.com/user-attachments/assets/b8150c35-1a25-492d-b3df-be1865ef41b2)

## File Structure

```
Quick-survey/
├── index.html           # Main HTML structure
├── styles.css           # CSS styling and responsive design
├── script.js            # JavaScript functionality
├── survey-data.json     # Sample survey questions and configuration
├── categories.html      # Category management UI
├── categories.js        # Category management JavaScript
├── server.js            # Express.js backend server for Categories API
├── package.json         # Node.js dependencies
├── API.md              # Categories API documentation
├── doc/                # Documentation folder
│   ├── categories-planning.md
│   ├── categories-design.md
│   ├── categories-security-performance-accessibility.md
│   ├── categories-architecture-diagrams.md
│   └── categories-test-strategy.md
└── README.md           # This file
```

## How to Use

1. **Setup**: Simply serve the files through any web server (Python's built-in server, Live Server, etc.)
2. **Customize Questions**: Edit `survey-data.json` to modify questions, options, and survey structure
3. **Launch**: Open `index.html` in a web browser
4. **Take Survey**: Follow the intuitive interface to complete the survey

## Running the App

### Option 1: Static Survey Only (GitHub Pages Compatible)

For the basic survey functionality without category management:

#### Using Python (built-in server)
```bash
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

#### Using Node.js (if you have http-server installed)
```bash
npx http-server -p 8000
# Open http://localhost:8000 in your browser
```

#### Using VS Code Live Server
1. Install the Live Server extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 2: Full Application with Categories (Requires Node.js)

To use the category management features with the backend API:

#### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

#### Installation
```bash
# Install dependencies
npm install
```

#### Running the Server
```bash
# Start the Express server
npm start

# Server will run on http://localhost:3000
```

#### Accessing the Application
1. **Survey App**: Open http://localhost:3000/index.html
2. **Category Management**: Open http://localhost:3000/categories.html

The Express server provides:
- Static file serving for all HTML/CSS/JS files
- RESTful API for category management at `/api/categories`
- CORS enabled for development

## Survey Configuration

The survey is configured through `survey-data.json`. You can easily modify:

- **Question types**: `multiple-choice`, `rating`, `text`
- **Question content**: Title, description, options
- **Rating scales**: Customize scale range and labels
- **Required fields**: Mark questions as required or optional

### Sample Question Structure

```json
{
  "id": 1,
  "type": "multiple-choice",
  "title": "Your question here",
  "description": "Additional context",
  "options": ["Option 1", "Option 2", "Option 3"],
  "required": true
}
```

## Technical Features

- **Vanilla JavaScript**: No external dependencies
- **Modern CSS**: Flexbox, Grid, CSS animations
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Error Handling**: Graceful fallbacks for failed data loading
- **Accessibility**: Semantic HTML and keyboard navigation support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)  
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

The app is designed to be easily customizable:

1. **Colors**: Modify CSS custom properties in `styles.css`
2. **Layout**: Adjust responsive breakpoints and spacing
3. **Questions**: Update `survey-data.json` with your content
4. **Functionality**: Extend `script.js` for additional features
5. **Categories**: Use the Categories API to organize surveys (see `API.md`)

## Categories Feature

The application includes a comprehensive category management system with a RESTful API:

### Features
- **Create** categories with name, description, and color
- **Read** all categories or individual category details
- **Update** existing categories
- **Delete** categories with confirmation
- **Visual interface** for easy management
- **Color coding** for visual organization

### API Endpoints
See [API.md](API.md) for complete API documentation.

**Base URL**: `http://localhost:3000/api`

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Documentation
Comprehensive documentation is available in the `/doc` folder:
- **Planning**: [categories-planning.md](doc/categories-planning.md)
- **Design**: [categories-design.md](doc/categories-design.md)
- **Security/Performance/Accessibility**: [categories-security-performance-accessibility.md](doc/categories-security-performance-accessibility.md)
- **Architecture Diagrams**: [categories-architecture-diagrams.md](doc/categories-architecture-diagrams.md)
- **Test Strategy**: [categories-test-strategy.md](doc/categories-test-strategy.md)

## License

Open source - feel free to use and modify for your projects.