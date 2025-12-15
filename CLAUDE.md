# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for "Al-Bayaan" - a sworn translator (beëdigd vertaler) service for Arabic-Dutch translations. The site is built with vanilla HTML, CSS, and JavaScript (no framework or build process).

## Development

### Local Development
Open `index.html` directly in a browser or use a local server:
```bash
python -m http.server 8000
```

### Deployment
Hosted on Vercel. Deploy via:
```bash
vercel
```

## Architecture

### Multi-language Structure
- `/index.html` - Dutch (default, `lang="nl"`)
- `/en/index.html` - English (`lang="en"`)
- `/ar/index.html` - Arabic (`lang="ar" dir="rtl"`)

Each language version is a separate HTML file with translated content. The language switcher in the header links between versions.

### CSS Organization
- `css/style.css` - Main styles using CSS custom properties (design tokens)
- `css/rtl.css` - RTL overrides for Arabic version (loaded only on Arabic page)
- `css/fonts.css` - Font face declarations

### Design System
Dark theme with yellow accent. Key CSS variables defined in `:root`:
- `--color-bg`: `#000000` (black background)
- `--color-accent`: `#FFD700` (yellow)
- Font families: Poppins (headings), Lora (body), Mirza/Kufam (Arabic)

### JavaScript Features (`js/main.js`)
- Header scroll effect
- Mobile menu toggle
- FAQ accordion
- File upload with drag-and-drop
- Contact form handling with localized messages
- Scroll animations using IntersectionObserver

### RTL Support
Arabic version uses `dir="rtl"` on `<html>`. The `rtl.css` file handles:
- Reversed flex directions
- Mirrored positions and margins
- Right-aligned text
- Swapped grid column orders

### Form Handling
Contact form is frontend-only (no backend). On submit:
1. Validates required fields
2. Shows success message
3. Optionally opens WhatsApp with pre-filled message

## Fonts
Local font files in project directories:
- `Poppins/` - Primary font
- `Lora/` - Body serif font
- `Mirza/` - Arabic body
- `Kufam/` - Arabic headings
