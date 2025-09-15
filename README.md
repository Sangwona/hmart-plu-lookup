# Produce PLU Lookup System

A web-based Produce PLU (Price Look-Up) code search system with admin management capabilities.

## Features

- **Cashier View**: Search and browse produce items by name or PLU code
- **Admin Panel**: Full CRUD operations for managing produce items
- **CSV Import/Export**: Bulk operations for data management
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Clone or Download

```bash
git clone <repository-url>
cd produce-plu-lookup
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the migration script from `supabase/migrations/20250914032700_create_tables.sql`

### 3. Configuration

1. Open `config.js`
2. Replace the Supabase URL and API key with your own:

```javascript
window.SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co",
  anonKey: "your-anon-key-here",
};
```

You can find these values in your Supabase project dashboard under Settings > API.

### 4. Local Development

Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

### 5. GitHub Pages Deployment

1. Push your code to GitHub
2. Go to Repository Settings > Pages
3. Select the main branch and set root folder
4. **Important**: The `config.js` file is in `.gitignore` - you'll need to manually add it to your repository after setting up your Supabase credentials

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # Custom styles
├── config.js           # Supabase configuration (gitignored)
├── supabase.js         # Supabase client setup
├── database.js         # Database operations
├── admin.js            # Admin panel functionality
├── script.js           # Main application logic
├── migrate.js          # Database migration script
├── test.js             # Test utilities
├── supabase/
│   └── migrations/     # Database schema
└── README.md           # This file
```

## Security Notes

- The `config.js` file contains sensitive API keys and is excluded from version control
- Each deployment should use its own Supabase project for data isolation
- Never commit API keys to public repositories

## Technologies Used

- **Frontend**: HTML, CSS (Tailwind), JavaScript (ES6 Modules)
- **Backend**: Supabase (PostgreSQL)
- **UI Framework**: Tailwind CSS
- **Icons**: Heroicons (via SVG)

## Admin Access

To access the admin panel:

1. Click "Go to Admin" button
2. Enter the 4-digit code: `1234` (default)
3. You can change this code in `admin.js`

## CSV Format

### Import Format (3 columns, no headers):

```
name,plu_code,description
Apple,4011,description
Banana,4012,organic
```

### Export Format (3 columns with headers):

```
name,plu_code,description
Apple,4011,description
Banana,4012,organic
```

## License

This project is open source. Feel free to use and modify as needed.
