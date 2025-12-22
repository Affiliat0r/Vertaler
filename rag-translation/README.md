# Document Translator

Translate official documents (marriage certificates, birth certificates, authentication pages, etc.) to professional Word documents (.docx).

## Features

- 📄 Generate professional Word documents from translated content
- 🏛️ Support for official document types:
  - Marriage certificates (Huwelijksakte)
  - Birth certificates (Geboorteakte)
  - Authentication/legalization pages
  - Civil registration documents
- 📊 Proper table formatting with borders and shading
- ⚙️ Configurable via `.env` file
- 🔧 Modular architecture for easy customization

## Installation

1. **Clone or download this project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure settings (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

## Usage

### Quick Start

Run the document generator:

```bash
npm start
```

or

```bash
npm run translate
```

The generated document will be saved to `./output/Documenten_Nederlands.docx`

### Development Mode

For development with auto-reload:

```bash
npm run dev
```

## Project Structure

```
document-translator-vscode/
├── src/
│   ├── index.js              # Main entry point
│   ├── config.js             # Configuration loader
│   ├── styles.js             # Document styles and borders
│   ├── helpers.js            # Utility functions
│   └── documents/
│       ├── index.js          # Document exports
│       ├── marriageCertificate.js
│       ├── authenticationPage.js
│       ├── civilRegistration.js
│       └── birthCertificate.js
├── input/                    # Place input documents here
├── output/                   # Generated documents
├── .env                      # Environment configuration
├── .env.example              # Example configuration
├── package.json
└── README.md
```

## Configuration

Edit `.env` to customize:

| Variable | Description | Default |
|----------|-------------|---------|
| `OUTPUT_DIR` | Output directory | `./output` |
| `OUTPUT_FILENAME` | Output filename | `Documenten_Nederlands.docx` |
| `DEFAULT_FONT` | Document font | `Arial` |
| `DEFAULT_FONT_SIZE` | Body text size (in half-points) | `22` (11pt) |
| `MARGIN_*` | Page margins (in DXA, 1440 = 1 inch) | `720` (0.5 inch) |

## Customizing Document Data

Edit the `exampleDocumentData` object in `src/index.js` to customize the content:

```javascript
const exampleDocumentData = {
  marriageCertificate: {
    serialNumber: '0885',
    husbandFullName: 'Ali Abd ...',
    wifeFullName: 'Raw\'a Abd al-Razzaq ...',
    // ... more fields
  },
  authentication: {
    courtDate: '18/7/2021',
    contractNumber: '708545',
    // ... more fields
  },
  civilRegistration: {
    // ... fields
  },
  birthCertificate: {
    newbornFullName: 'Raw\'a ...',
    newbornGender: 'Vrouwelijk',
    // ... more fields
  }
};
```

## Adding New Document Types

1. Create a new file in `src/documents/`:
   ```javascript
   // src/documents/newDocument.js
   const { Paragraph, TextRun } = require('docx');
   const { createTitle, createParagraph } = require('../helpers');

   function generateNewDocument(data = {}) {
     const content = [];
     // Add your document content here
     return content;
   }

   module.exports = { generateNewDocument };
   ```

2. Export it from `src/documents/index.js`

3. Import and use in `src/index.js`

## Helper Functions

Available helpers in `src/helpers.js`:

| Function | Description |
|----------|-------------|
| `createTitle(text, size, spacing)` | Create centered bold title |
| `createParagraph(text, options)` | Create normal paragraph |
| `createCenteredParagraph(text, options)` | Create centered paragraph |
| `createLabelValueParagraph(label, value)` | Create "Label: Value" paragraph |
| `createPageBreak()` | Create page break |
| `createCell(content, options)` | Create table cell |
| `createHeaderCell(text, width, shading)` | Create header cell |

## Table Column Width Reference

| Columns | Width Values |
|---------|--------------|
| 2 | `[4500, 4500]` |
| 3 | `[3000, 3000, 3000]` |
| 4 | `[2250, 2250, 2250, 2250]` |
| 5 | `[1800, 1800, 1800, 1800, 1800]` |

Total width for standard page with 0.5" margins: ~9000 DXA

## Shading Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Light Gray | `E8E8E8` | Headers |
| Light Blue | `E8F0FF` | Info sections |
| Light Green | `D5F5D5` | Positive data |
| Light Pink | `FFF0F0` | Personal data |
| Light Yellow | `FFF8E8` | Warnings |

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
