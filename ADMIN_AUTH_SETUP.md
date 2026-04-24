# Admin Authentication Setup

## Overview
The PCDP Portal uses a **hardcoded admin email whitelist** as the single source of truth for admin access. This ensures that only explicitly authorized admins can access the admin features.

## ⚠️ IMPORTANT: How Admin Access Works

### The Rule
**ONLY emails listed in the `ADMIN_EMAILS` array in [src/App.jsx](src/App.jsx#L10-L12) can access the portal.**

### Current Authorized Admins
- `aruneshownsty1@gmail.com`
- `harinisrim27@gmail.com`

## Adding a New Admin

To grant admin access to a new email:

1. Open [src/App.jsx](src/App.jsx)
2. Find the `ADMIN_EMAILS` constant (around line 10)
3. Add the new email to the array:

```javascript
const ADMIN_EMAILS = [
  'aruneshownsty1@gmail.com',
  'harinisrim27@gmail.com',
  'new.admin@example.com',  // ← Add here
];
```

4. Save and deploy

## ⚠️ Database Table vs Whitelist

There is an `admins` table in the Supabase database, but **it is NOT used for authentication**. The whitelist in `ADMIN_EMAILS` is the only control.

**Even if someone is added to the database `admins` table, they will NOT get access** unless they are also in the `ADMIN_EMAILS` array.

## Why This Design?

- **Security**: No automatic admin elevation
- **Clarity**: Single source of truth (hardcoded list)
- **Control**: Admin access requires explicit code changes
- **Transparency**: All authorized admins are visible in one place

## Login Methods

### Method 1: Email & Password
- Uses Supabase Auth with email/password
- Must be explicitly set up in Supabase

### Method 2: Google Sign-In
- Uses OAuth with Google
- Available for all users but access depends on `ADMIN_EMAILS`

## Access Control Logic

```
User logs in (email + password OR Google OAuth)
    ↓
App checks: Is user email in ADMIN_EMAILS list?
    ↓
    NO → Show login page (access denied)
    YES → Grant access to portal & admin features
```

## Session & Logout

- Sessions are managed by Supabase Auth
- Logout clears session and returns to login page
- All state is cleared on logout

---

**Last Updated**: April 24, 2025
