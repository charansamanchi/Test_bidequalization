# Quick Start Guide - Authors & Books Fiori Elements App

## Setup (One-time)

```bash
cd test_project
npm install
```

## Running the Application

### Start the Development Server

```bash
# Default port 4004
npm start

# Or use a different port
PORT=3000 npm start
```

The application will open at:
```
http://localhost:3000/index.html
```

## Using the Application

### **Authors List (ListReport)**
1. The main page shows a list of all authors
2. **Search**: Use the search box to find authors by name
3. **Click**: Click any author to view their details and books

### **Author Details & Books (ObjectPage)**
1. View the author's information in the first section
2. View all books by this author in the "Books" section below
3. **Delete Author**: Click the Delete button to remove the author
4. **Delete Book**: Right-click on any book or use the book's delete action (if available)

### **CRUD Operations**

#### Create Author (via API)
```bash
curl -X POST http://localhost:3000/odata/v4/catalog/createAuthor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J.K. Rowling",
    "born": "1965-07-31"
  }'
```

#### Create Book (via API)
```bash
curl -X POST http://localhost:3000/odata/v4/catalog/createBook \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Harry Potter",
    "genre": "Fantasy",
    "stock": 50,
    "price": 15.99,
    "authorID": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

#### Delete Author
- Click on an author in the list
- Click **Delete** button in the toolbar

#### Delete Book
- Navigate to an author's ObjectPage
- In the Books section, click **Delete** on the book row

## Sample Data

The app comes with sample data:
- **Authors**: George Orwell, Jane Austen, J.R.R. Tolkien, Agatha Christie, Isaac Asimov
- **Books**: 10 books across various genres

## Accessing the OData Service

Get OData metadata:
```
GET http://localhost:3000/odata/v4/catalog/$metadata
```

Query data:
```
GET http://localhost:3000/odata/v4/catalog/Authors
GET http://localhost:3000/odata/v4/catalog/Books
```

## Project Files Overview

| File | Purpose |
|------|---------|
| `srv/test-service.cds` | Data model & UI annotations |
| `srv/test-service.js` | Backend action handlers |
| `db/data/*.csv` | Sample data |
| `app/webapp/manifest.json` | Fiori Elements configuration |
| `app/webapp/index.html` | Application entry point |
| `app/webapp/Component.js` | UI5 App component |
| `package.json` | Dependencies & scripts |

## Architecture

```
┌─────────────────────────────────────┐
│     SAPUI5 / Fiori Elements         │  (Browser)
│   ListReport + ObjectPage Template  │
└──────────────┬──────────────────────┘
               │ OData V4 Requests
               ↓
┌─────────────────────────────────────┐
│      CAP Node.js Backend            │
│   - OData Service                   │
│   - CRUD Actions                    │
│   - Data Validation                 │
└──────────────┬──────────────────────┘
               │ SQL Queries
               ↓
┌─────────────────────────────────────┐
│      SQLite Database                │
│   (In-memory, development only)     │
└─────────────────────────────────────┘
```

## Fiori Elements Features Used

✅ **ListReport**: Authors list with search & sort
✅ **ObjectPage**: Author details with related books table
✅ **Facets**: Multiple sections on ObjectPage
✅ **Actions**: Delete author, delete book
✅ **Annotations**: UI driven entirely by CDS annotations
✅ **Responsive**: Works on desktop, tablet, and mobile

## Troubleshooting

### Port Already in Use
```bash
# Try a different port
PORT=3001 npm start
```

### Server Not Starting
1. Check Node.js version: `node -v` (should be >= 14)
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Clear cache: `npx cds clean`

### No Data Showing
1. Check OData endpoint: `http://localhost:3000/odata/v4/catalog/Authors`
2. Verify server logs for errors
3. Restart the server

### Fiori Elements Not Rendering
1. Check browser console for errors (F12)
2. Verify manifest.json is in `app/webapp/`
3. Clear browser cache and reload

## Next Steps

1. **Customize UI Annotations**: Edit `srv/test-service.cds` to add/remove columns, change field labels
2. **Add More Entities**: Extend the CDS model with new entities
3. **Add Business Logic**: Implement calculations, validations in `srv/test-service.js`
4. **Deploy to Cloud**: Use `npm run build && npm run deploy` for production

## Resources

- [SAP CAP Official Docs](https://cap.cloud.sap/)
- [SAPUI5 API Reference](https://sdk.openui5.org/)
- [Fiori Elements Floorpans](https://experience.sap.com/fiori-design-web/)
- [OData Documentation](http://www.odata.org/)

---

**Ready to go!** 🚀
