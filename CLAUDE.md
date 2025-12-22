# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for "Al-Bayaan" - a sworn translator (beëdigd vertaler) service for Arabic-Dutch translations. The site is built with vanilla HTML, CSS, and JavaScript with Supabase backend and Vercel hosting.

## Development

### Local Development
```bash
python -m http.server 8000
```

### Deployment
```bash
vercel                # Deploy to Vercel
```

### Supabase CLI (local path)
```bash
"c:\Users\hasaat\supabase-cli\supabase.exe" functions deploy send-contact-email --project-ref knwpwdbqosdjwxfmwnro
```

## Architecture

### Multi-language Structure
- `/index.html` - Dutch (default, `lang="nl"`)
- `/en/index.html` - English (`lang="en"`)
- `/ar/index.html` - Arabic (`lang="ar" dir="rtl"`)

Each language version is a separate HTML file with translated content. The language switcher in the header links between versions.

### Backend Integration
- **Supabase**: Stores contact submissions in `contact_submissions` table, file uploads in `documents` bucket
- **Vercel Serverless** (`api/send-email.js`): Sends email notifications via Resend API
- **Supabase Edge Function** (`supabase/functions/send-contact-email/`): Database webhook for email notifications

### CSS Organization
- `css/style.css` - Main styles with CSS custom properties, includes light/dark theme via `data-theme` attribute
- `css/rtl.css` - RTL overrides for Arabic version (loaded only on Arabic page)
- `css/fonts.css` - Font face declarations

### Design System
Light/dark theme toggle with yellow accent. Key CSS variables:
- `--color-accent`: `#FFD700` (yellow/gold)
- Font families: Poppins (headings), Lora (body), Mirza/Kufam (Arabic)
- Theme stored in `localStorage` and applied via `data-theme` attribute on `<html>`

### JavaScript Features (`js/main.js`)
- Supabase client initialization and form submission
- Theme toggle with logo switching (`logo-vectorized.svg` / `logo-vectorized-light.svg`)
- File upload with drag-and-drop to Supabase Storage
- Localized UI messages (NL/EN/AR) via `getLocalizedText()`
- Custom modal dialogs (replaces browser alert/confirm)
- Typewriter effect for hero title (preserves Arabic letter connections)

### RTL Support
Arabic version uses `dir="rtl"` on `<html>`. The `rtl.css` file handles:
- Reversed flex directions and mirrored positions
- Right-aligned text and swapped grid column orders

### Form Handling Flow
1. Validates required fields + privacy checkbox
2. Uploads files to Supabase Storage (`documents` bucket)
3. Inserts submission to `contact_submissions` table
4. Calls `/api/send-email` Vercel function for email notification
5. Shows success modal, offers WhatsApp follow-up
6. Falls back to WhatsApp if Supabase fails

### Environment Variables (Vercel)
- `RESEND_API_KEY`: API key for email sending via Resend

### Supabase Secrets
- `RESEND_API_KEY`: For Edge Function email sending
- `RECIPIENT_EMAIL`: Email recipient for notifications

## Fonts
Local font files: `Poppins/`, `Lora/`, `Mirza/`, `Kufam/`
