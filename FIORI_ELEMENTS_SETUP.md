# Authors & Books Manager - Fiori Elements Application

A clean SAP Fiori Elements application built with CAP (Cloud Application Programming) and SAPUI5 for managing authors and their books.

## Project Structure

```
test_project/
├── app/
│   └── webapp/
│       ├── index.html              # Main entry point
│       ├── manifest.json           # Fiori Elements manifest configuration
│       ├── Component.js            # UI5 Component
│       ├── controller/             # (removed - using Fiori Elements templates)
│       ├── view/                   # (removed - using Fiori Elements templates)
│       ├── i18n/
│       │   └── i18n.properties     # Localization strings
│       ├── css/                    # Styling
│       └── model/
│           └── models.js           # Device model initialization
├── db/
│   ├── data/
│   │   ├── demo-Authors.csv        # Authors seed data
│   │   └── demo-Books.csv          # Books seed data
│   └── schema.cds                  # Data model definitions
├── srv/
│   ├── test-service.cds            # Service definitions with UI annotations
│   └── test-service.js             # Service implementation (CRUD actions)
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## Features

✅ **Authors Management**
- View list of all authors (ListReport)
- Search and filter authors by name
- View author details (ObjectPage)
- Delete authors
- (Create author via OData actions)

✅ **Books Management**
- View books by author
- See book details (title, genre, stock, price)
- Delete books
- (Create book via OData actions)

✅ **Navigation**
- Click on an author to view their books in the ObjectPage
- Related books table shows all books by the selected author
- Seamless navigation between ListReport and ObjectPage

✅ **Fiori Elements UI**
- Standard SAP Fiori 3 design
- ResponsiveTable for ListReport
- ObjectPage with multiple sections/facets
- Integrated search and filter functionality
- Action buttons for CRUD operations

## Technology Stack

- **Backend**: SAP CAP (Cloud Application Programming)
- **Database**: SQLite (development, in-memory)
- **Frontend**: SAPUI5 / OpenUI5
- **OData**: V4 Protocol
- **UI Pattern**: Fiori Elements (ListReport/ObjectPage)
- **Package Manager**: npm
- **Node.js Runtime**

## Getting Started

### Prerequisites

- Node.js (14.x or higher)
- @sap/cds-cli (`npm install -g @sap/cds-cli`)
- Git

### Installation

```bash
# Navigate to project directory
cd test_project

# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server (default port: 4004)
npm start

# Or specify a custom port
PORT=3000 npm start
```

The application will be available at:
- **UI**: `http://localhost:<port>/index.html`
- **OData Service**: `http://localhost:<port>/odata/v4/catalog/`

### Sample Data

The application includes pre-loaded sample data:
- **5 Authors**: George Orwell, Jane Austen, J.R.R. Tolkien, Agatha Christie, Isaac Asimov
- **10 Books**: Associated with authors in various genres

Data is loaded from CSV files in `db/data/` and stored in an in-memory SQLite database.

## API Endpoints

Get the OData metadata:
```
GET /odata/v4/catalog/$metadata
```

Query Authors:
```
GET /odata/v4/catalog/Authors
GET /odata/v4/catalog/Authors?$filter=name eq 'George Orwell'
GET /odata/v4/catalog/Authors(ID)?$expand=books
```

Query Books:
```
GET /odata/v4/catalog/Books
GET /odata/v4/catalog/Books?$filter=genre eq 'Fantasy'
```

Actions (POST):
```
POST /odata/v4/catalog/deleteAuthor
Body: { ID: "uuid-here" }

POST /odata/v4/catalog/deleteBook
Body: { ID: "uuid-here" }

POST /odata/v4/catalog/createAuthor
Body: { name: "Author Name", born: "1900-01-01" }

POST /odata/v4/catalog/createBook
Body: { title: "Title", genre: "Genre", stock: 10, price: 9.99, authorID: "uuid-here" }
```

## Data Model

### Authors Entity
- `ID` (UUID): Unique identifier
- `name` (String): Author's name
- `born` (Date): Birth date
- `books` (Association): One-to-many relationship to Books

### Books Entity
- `ID` (UUID): Unique identifier
- `title` (String): Book title
- `genre` (String): Book genre/category
- `stock` (Integer): Available quantity
- `price` (Decimal): Price in USD
- `authorID` (UUID): Foreign key to Authors
- `author` (Association): Reference to author

## UI Annotations

The application uses SAP UI5 Annotations (XML vocabulary) defined in `srv/test-service.cds`:

- **UI.HeaderInfo**: Title, type name, and description for entities
- **UI.LineItem**: Column definitions for tables and list reports
- **UI.SelectionFields**: Search/filter field configuration
- **UI.FieldGroup**: Grouping of fields in ObjectPage form sections
- **UI.Facets**: Multiple sections/tabs in ObjectPage
- **UI.DataFieldForAction**: Action buttons in tables
- **UI.PresentationVariant**: Sorting and visualization settings

Example:
```cds
@(UI: {
  HeaderInfo: { TypeName: 'Author', Title: {Value: name} },
  LineItem: [ {Value: name}, {Value: born} ],
  SelectionFields: [name]
})
```

## Development

### Modify the Data Model

Edit `srv/test-service.cds`:
```cds
entity NewEntity {
  key ID : UUID;
  field1 : String;
  field2 : Integer;
}
```

### Add UI Annotations

In the service definition, add annotations to control the UI:
```cds
@(UI: {
  LineItem: [/* column definitions */],
  FieldGroup #Main: {Data: [/* form fields */]}
})
entity MyEntity { ... }
```

### Add Custom Logic

Implement in `srv/test-service.js`:
```javascript
this.on('action', async (req) => {
  // Custom logic here
  return { success: true };
});
```

### Rebuild & Redeploy

```bash
# Build the application
npm run build

# Deploy (in production)
npm run deploy
```

## Debugging

### View OData Metadata
```
http://localhost:<port>/odata/v4/catalog/$metadata
```

### Browser DevTools
- Open Developer Tools (F12)
- Check Network tab to view OData requests
- Check Console for JavaScript errors
- Fiori Elements logs are available in console

### CAP CDS CLI
```bash
# Test CDS model validation
cds validate

# Run model in mock mode
cds serve
```

## Testing the CRUD Operations

### Via UI (Fiori Elements)
1. Open the application
2. Click on an author in the list
3. View the ObjectPage with author details and books
4. Click "Delete" button to delete the author
5. Use action buttons to delete books

### Via REST API (curl / Postman)
```bash
# Create Author
curl -X POST http://localhost:3000/odata/v4/catalog/createAuthor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Author",
    "born": "1980-05-15"
  }'

# Delete Author
curl -X POST http://localhost:3000/odata/v4/catalog/deleteAuthor \
  -H "Content-Type: application/json" \
  -d '{"ID": "550e8400-e29b-41d4-a716-446655440001"}'
```

## Clean Project Structure

This project has been cleaned up to use standard Fiori Elements patterns:

**Removed:**
- Custom view files (Main.view.xml, Authors.view.xml, Books.view.xml, FioriMain.view.xml, CRUDDialog.fragment.xml)
- Custom controller files (Main.controller.js, FioriMain.controller.js)
- Old manifest files (fiori-manifest.json)
- Obsolete bootstrap files (fiori-index.html, ComponentFE.js)

**Kept:**
- Standard Fiori Elements templates provided by sap.suite.ui.generic.template library
- Minimal Component.js with device model initialization
- Single manifest.json driving the entire UI via annotations
- CDS annotations defining all UI behaviors

This results in:
- ✅ Cleaner codebase with less maintenance
- ✅ Consistent SAP Fiori design patterns
- ✅ Automatic search/filter/sort functionality
- ✅ Built-in responsive design
- ✅ Reduced custom code to maintain

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
PORT=3001 npm start

# Or kill the process using the port
# Windows:
netstat -ano | findstr :4004
taskkill /PID [PID] /F

# Mac/Linux:
lsof -i :4004
kill -9 [PID]
```

### Database Schema Mismatch
```bash
# The in-memory database is recreated on each start
# Just restart the server: npm start
# New tables will be created from the CDS model
```

### OData Metadata Not Loading
1. Ensure CAP server is running
2. Check the endpoint: `http://localhost:<port>/odata/v4/catalog/$metadata`
3. Verify CDS syntax in `srv/test-service.cds`
4. Check server logs for errors

### Fiori Elements Not Rendering
1. Verify manifest.json has `sap.ui.generic.app` section
2. Check that sap.suite.ui.generic.template library is loaded
3. Verify app component name in manifest matches actual component
4. Check browser console for JavaScript errors

## Git Repository

Track your changes with Git:
```bash
# Initialize repository
git init

# Add and commit changes
git add .
git commit -m "Initial commit: Fiori Elements app setup"

# View log
git log --oneline
```

## Production Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy to SAP Cloud Platform, Kyma, or On-Premise**:
   ```bash
   npm run deploy
   ```

3. **Environment Configuration**:
   - Update `package.json` with production URLs
   - Configure data source in manifest.json
   - Set database connection string

## Further Reading

- [SAP CAP Documentation](https://cap.cloud.sap/)
- [SAPUI5 API Reference](https://sdk.openui5.org/)
- [Fiori Elements Documentation](https://experience.sap.com/fiori-design-web/floorplan-list-report/)
- [OData V4 Specification](http://docs.oasis-open.org/odata/odata/v4.0/)

## License

This is a sample project for learning SAP CAP and Fiori Elements.

---

**Last Updated**: February 20, 2026
**Framework Versions**: OpenUI5 + SAP CAP (latest from npm registry)
