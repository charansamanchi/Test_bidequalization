# Library Management Application - Development Guide

## Project Overview
A full-stack SAP CAP (Cloud Application Programming) application with a SAPUI5 frontend and backend OData service for managing Authors and Books.

---

## Development Steps Completed

### Step 1: Project Initialization
**Goal:** Set up the base project structure

- **Initial workspace:** `C:\Users\I355335\CAPM\test_project`
- **Package.json:** Created with dependencies:
  - `@sap/cds: ^9`
  - `@cap-js/sqlite: ^2`
- **Command:** `npm install`

---

### Step 2: Create CDS Data Model & Service
**File:** [srv/test-service.cds](srv/test-service.cds)

**What we defined:**

1. **Authors Entity**
   ```cds
   entity Authors {
     key ID : UUID;
     name   : String(111);
     born   : Date;
   }
   ```

2. **Books Entity** with unmanaged association
   ```cds
   entity Books {
     key ID   : UUID;
     title    : String(255);
     genre    : String(50);
     stock    : Integer;
     price    : Decimal(9,2);
     authorID : UUID;
     author   : Association to Authors on author.ID = authorID;
   }
   ```

3. **CatalogService** (OData endpoint)
   ```cds
   service CatalogService {
     entity Books    as projection on demo.Books;
     entity Authors  as projection on demo.Authors;
   }
   ```

**Key Design Decision:** Used unmanaged association (`on author.ID = authorID`) to avoid binding calculated elements as foreign keys.

**Generated API Endpoints:**
- `GET /odata/v4/catalog/Authors`
- `GET /odata/v4/catalog/Books`
- `GET /odata/v4/catalog/Books?$filter=authorID eq '{ID}'`

---

### Step 3: Create Sample Data
**Location:** [db/data/](db/data/)

1. **Authors CSV** ([demo-Authors.csv](db/data/demo-Authors.csv))
   - George Orwell (1903-06-25)
   - Jane Austen (1775-12-16)
   - J.R.R. Tolkien (1892-01-03)
   - Agatha Christie (1890-09-15)

2. **Books CSV** ([demo-Books.csv](db/data/demo-Books.csv))
   - 9 books across 4 genres
   - Each book linked to an author via `authorID`
   - Includes: title, genre, stock, price

**Auto-seeding:** CAP automatically loads CSV files into the database when `cds watch` runs.

---

### Step 4: Build SAPUI5 Frontend

#### 4.1 Project Structure
```
app/
├── webapp/
│   ├── index.html               (Entry point)
│   ├── Component.js             (App initialization)
│   ├── manifest.json            (App configuration & routing)
│   ├── controller/
│   │   └── Main.controller.js   (Business logic)
│   ├── view/
│   │   ├── Main.view.xml        (Root view with App container)
│   │   ├── Authors.view.xml     (Authors list page)
│   │   └── Books.view.xml       (Books detail page)
│   ├── css/
│   │   └── style.css            (Custom styles)
│   └── i18n/
│       └── i18n.properties      (Translations)
```

#### 4.2 Component Initialization ([Component.js](app/webapp/Component.js))
- Creates JSONModel for view state (`/authors`, `/books`)
- Sets up routing engine
- Initializes without OData model (using fetch instead)

#### 4.3 Main Controller ([Main.controller.js](app/webapp/controller/Main.controller.js))

**Key Methods:**

1. **onInit()** - Attaches route matching listener
2. **_onRouteMatched()** - Triggered on navigation
   - Route "authors" → calls `_loadAuthors()`
   - Route "books/{id}" → calls `_loadBooksByAuthor(id)`

3. **_loadAuthors()** - Fetch `/odata/v4/catalog/Authors`
   - Updates view model with author list
   - Refreshes bindings

4. **_loadBooksByAuthor(authorId)** - Fetch with filter
   - URL: `/odata/v4/catalog/Books?$filter=authorID eq '{id}'`
   - Updates view model with filtered books

5. **onAuthorPress(oEvent)** - Click handler
   - Gets clicked author ID from binding context
   - Navigates to books route: `navTo("books", { id: authorId })`

6. **onNavBack()** - Back button handler
   - Returns to previous page or defaults to authors

#### 4.4 Routing Configuration ([manifest.json](app/webapp/manifest.json))

```json
"routes": [
  {
    "pattern": "",
    "name": "authors",
    "target": "authors"
  },
  {
    "pattern": "books/{id}",
    "name": "books",
    "target": "books"
  }
]
```

**Flow:**
- Default route (empty pattern) → Authors page
- User clicks author → Route to `books/{authorID}`
- Books page displays books for selected author

#### 4.5 Views

**Authors Page** ([Authors.view.xml](app/webapp/view/Authors.view.xml))
- List of authors using `StandardListItem` with `type="Active"`
- Fields: author name (title), birth date (description)
- `itemPress` event triggers `onAuthorPress()`

**Books Page** ([Books.view.xml](app/webapp/view/Books.view.xml))
- List of books filtered by author
- Fields: title, genre, price
- Additional attributes: stock, ID
- Back button calls `onNavBack()`

---

### Step 5: Fix Issues & Refinements

#### Issue 1: Calculated PKs Breaking Bindings
- **Problem:** Primary keys with `= cuid()` defaults treated as on-read calculated elements
- **Solution:** Removed calculated defaults, use plain UUID fields

#### Issue 2: OData Metadata Loading Failures
- **Problem:** OData V2/V4 models had metadata issues
- **Solution:** Switched to JSON model + native `fetch()` API for REST calls

#### Issue 3: ObjectListItem Press Event Not Firing
- **Problem:** `press` on ObjectListItem wasn't triggering
- **Solution:** Moved to List-level `itemPress` with StandardListItem

#### Issue 4: Binding Expressions Not Expanding in Strings
- **Problem:** Description text showed literal `{view>genre}` instead of values
- **Solution:** Used separate attribute elements (ObjectAttribute) for proper binding

---

### Step 6: Initialize Git & Push to GitHub

1. **Install Git for Windows**
   - Command: `winget install --id Git.Git -e --source winget`
   - Installed at: `C:\Program Files\Git\cmd\git.exe`

2. **Initialize Git Repository**
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" init
   & "C:\Program Files\Git\cmd\git.exe" config user.name "CAPM Developer"
   & "C:\Program Files\Git\cmd\git.exe" config user.email "dev@capm.local"
   ```

3. **Stage & Commit**
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" add .
   & "C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit: Add CDS service, sample data, and SAPUI5 app with Authors and Books routing"
   ```

4. **Push to GitHub**
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/charansamanchi/Test_bidequalization.git
   & "C:\Program Files\Git\cmd\git.exe" push -u origin master
   ```

   - **Commit Hash:** `8130f38`
   - **Remote:** `origin/master` (tracking enabled)
   - **Authentication:** Completed via browser OAuth flow

---

## How the Application Works

### Architecture Flow

```
User Browser
    ↓
SAPUI5 UI (app/webapp/)
    ├─ Authors.view.xml (displays list)
    └─ Books.view.xml (displays filtered list)
    ↓ (fetch calls)
CAP Backend Server
    ├─ test-service.cds (OData endpoints)
    └─ /odata/v4/catalog/ routes
    ↓
SQLite Database
    ├─ Authors table
    ├─ Books table
    └─ Sample data (CSV-seeded)
```

### User Journey

1. **App Start**
   - User opens `http://localhost:4004/app/`
   - Main.view.xml loads, App container initializes
   - Router navigates to default "" route (authors)
   - Authors controller loads `_loadAuthors()`
   - Fetches `/odata/v4/catalog/Authors`
   - Displays list of 4 authors

2. **Author Click**
   - User clicks "George Orwell"
   - `onAuthorPress()` extracts ID: `550e8400-e29b-41d4-a716-446655440001`
   - Navigates to route: `books/550e8400-e29b-41d4-a716-446655440001`
   - Books controller loads `_loadBooksByAuthor()` with author ID
   - Fetches `/odata/v4/catalog/Books?$filter=authorID eq '550e8400-e29b-41d4-a716-446655440001'`
   - Displays 2 books by George Orwell (1984, Animal Farm)

3. **Back Navigation**
   - User clicks back button
   - `onNavBack()` returns to authors list
   - Cycle repeats

---

## Running the Application

### Prerequisites
- Node.js (v16+)
- Git for Windows
- npm (comes with Node.js)

### Start Development Server
```powershell
cd C:\Users\I355335\CAPM\test_project
npm install        # If not already done
cds watch
```

**Output:**
```
 > listening on { url: 'http://localhost:4004' }
```

### Access the App
- **UI:** http://localhost:4004/app/
- **OData API:** http://localhost:4004/odata/v4/catalog/$metadata
- **Authors Endpoint:** http://localhost:4004/odata/v4/catalog/Authors

---

## Key Technologies & Concepts

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Backend Service | SAP CAP (Node.js) | OData endpoints, data model |
| Data Model | CDS (Core Data Services) | Declarative entity/service definitions |
| Database | SQLite | Local development persistence |
| Frontend Framework | SAPUI5 (OpenUI5) | UI components, routing, data binding |
| Communication | REST (fetch API) | HTTP calls from UI to backend |
| Routing | SAPUI5 Router | Client-side navigation |
| Data Binding | One-way, JSONModel | UI updates from view model |
| Version Control | Git | Commit history, GitHub integration |

---

## Files & Their Roles

| File | Role |
|------|------|
| `srv/test-service.cds` | Backend data model & OData service definition |
| `db/data/*.csv` | Sample data seeds |
| `package.json` | Dependencies & scripts |
| `app/webapp/index.html` | Entry HTML with UI5 bootstrap |
| `app/webapp/Component.js` | App initialization & model setup |
| `app/webapp/manifest.json` | Routing config, app metadata |
| `app/webapp/controller/Main.controller.js` | All business logic & event handlers |
| `app/webapp/view/*.xml` | UI definitions (Views) |
| `app/webapp/css/style.css` | Custom CSS |

---

## Next Steps (Potential Enhancements)

1. **Separate Controllers** - Split Main.controller into Authors & Books controllers
2. **Error Handling** - Add try-catch, user-friendly error messages
3. **Create/Update/Delete** - Implement POST/PATCH/DELETE in backend
4. **Search & Filter** - Add UI controls for filtering authors/books
5. **Authentication** - Add login/logout mechanism
6. **Responsive Design** - Optimize for mobile/tablet
7. **Unit Tests** - Add QUnit tests for controller methods
8. **Production Build** - Configure CDS for production deployment

---

## Troubleshooting

### Git command not recognized
- Ensure Git is in PATH or use full path: `C:\Program Files\Git\cmd\git.exe`

### Port 4004 already in use
- Kill process: `lsof -ti:4004 | xargs kill -9` (Linux/Mac) or use different port in `cds watch`

### Authors/Books not loading
- Check browser console (F12) for fetch errors
- Verify `cds watch` is running
- Check `/odata/v4/catalog/$metadata` endpoint accessibility

### Bindings not updating
- Ensure view model refresh is called: `oViewModel.refresh(true)`
- Check binding paths match view model structure

---

**Last Updated:** February 19, 2026  
**Repository:** https://github.com/charansamanchi/Test_bidequalization.git  
**Branch:** master  
**Commit:** 8130f38
