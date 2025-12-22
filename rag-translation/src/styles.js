const { BorderStyle, AlignmentType, ShadingType, WidthType } = require('docx');
const config = require('./config');

// Border definitions
const createBorder = (color) => ({
  style: BorderStyle.SINGLE,
  size: 1,
  color: color
});

const tableBorder = createBorder(config.table.borderColor);
const lightBorder = createBorder(config.table.lightBorderColor);

const cellBorders = {
  top: tableBorder,
  bottom: tableBorder,
  left: tableBorder,
  right: tableBorder
};

const lightCellBorders = {
  top: lightBorder,
  bottom: lightBorder,
  left: lightBorder,
  right: lightBorder
};

// Document styles
const documentStyles = {
  default: {
    document: {
      run: {
        font: config.document.defaultFont,
        size: config.document.defaultFontSize
      }
    }
  },
  paragraphStyles: [
    {
      id: "Title",
      name: "Title",
      basedOn: "Normal",
      run: {
        size: config.document.titleFontSize,
        bold: true,
        color: "000000",
        font: config.document.defaultFont
      },
      paragraph: {
        spacing: { before: 120, after: 120 },
        alignment: AlignmentType.CENTER
      }
    },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      run: {
        size: config.document.heading1FontSize,
        bold: true,
        color: "000000",
        font: config.document.defaultFont
      },
      paragraph: {
        spacing: { before: 240, after: 120 }
      }
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      run: {
        size: config.document.heading2FontSize,
        bold: true,
        color: "000000",
        font: config.document.defaultFont
      },
      paragraph: {
        spacing: { before: 180, after: 100 }
      }
    }
  ]
};

// Page properties
const pageProperties = {
  page: {
    margin: {
      top: config.margins.top,
      right: config.margins.right,
      bottom: config.margins.bottom,
      left: config.margins.left
    }
  }
};

// Shading colors
const shadingColors = {
  header: config.table.headerBgColor,
  lightBlue: "E8F0FF",
  lightGreen: "D5F5D5",
  lightPink: "FFF0F0",
  lightYellow: "FFF8E8",
  lightGray: "F0F0F0"
};

// Helper function to create cell with shading
const createShadedCell = (fill) => ({
  fill: fill,
  type: ShadingType.CLEAR
});

module.exports = {
  tableBorder,
  lightBorder,
  cellBorders,
  lightCellBorders,
  documentStyles,
  pageProperties,
  shadingColors,
  createShadedCell,
  createBorder
};
