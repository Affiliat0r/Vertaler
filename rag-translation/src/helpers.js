const { Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, ShadingType, PageBreak } = require('docx');
const { cellBorders, lightCellBorders, createShadedCell } = require('./styles');

/**
 * Create a centered title paragraph
 */
function createTitle(text, size = 32, spacing = { before: 200, after: 200 }) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: spacing,
    children: [new TextRun({ text: text, bold: true, size: size })]
  });
}

/**
 * Create a centered paragraph
 */
function createCenteredParagraph(text, options = {}) {
  const { bold = false, italics = false, size = 22, spacing = { after: 100 } } = options;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: spacing,
    children: [new TextRun({ text: text, bold: bold, italics: italics, size: size })]
  });
}

/**
 * Create a normal paragraph
 */
function createParagraph(text, options = {}) {
  const { bold = false, italics = false, spacing = { after: 100 } } = options;
  return new Paragraph({
    spacing: spacing,
    children: [new TextRun({ text: text, bold: bold, italics: italics })]
  });
}

/**
 * Create a paragraph with label and value
 */
function createLabelValueParagraph(label, value, spacing = { after: 50 }) {
  return new Paragraph({
    spacing: spacing,
    children: [
      new TextRun({ text: label, bold: true }),
      new TextRun(` ${value}`)
    ]
  });
}

/**
 * Create a page break
 */
function createPageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

/**
 * Create a table cell
 */
function createCell(content, options = {}) {
  const {
    width = 4500,
    shading = null,
    alignment = AlignmentType.LEFT,
    borders = cellBorders
  } = options;

  // Convert content to array of paragraphs if it's a string
  let children;
  if (typeof content === 'string') {
    children = [new Paragraph({ alignment: alignment, children: [new TextRun(content)] })];
  } else if (Array.isArray(content)) {
    children = content;
  } else {
    children = [content];
  }

  const cellOptions = {
    borders: borders,
    width: { size: width, type: WidthType.DXA },
    children: children
  };

  if (shading) {
    cellOptions.shading = createShadedCell(shading);
  }

  return new TableCell(cellOptions);
}

/**
 * Create a header cell (centered, bold, with shading)
 */
function createHeaderCell(text, width = 4500, shading = "E8E8E8") {
  return createCell(
    [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: text, bold: true })]
    })],
    { width: width, shading: shading }
  );
}

/**
 * Create a simple two-column table
 */
function createTwoColumnTable(rows, columnWidths = [4500, 4500]) {
  return new Table({
    columnWidths: columnWidths,
    rows: rows.map(row => new TableRow({
      children: row.map((cell, index) => {
        if (typeof cell === 'string') {
          return createCell(cell, { width: columnWidths[index] });
        }
        return cell;
      })
    }))
  });
}

/**
 * Create a data row with label and value columns
 */
function createDataRow(label, value1, value2, columnWidths = [4500, 4500]) {
  return new TableRow({
    children: [
      createCell([
        new Paragraph({ children: [new TextRun({ text: label, bold: true })] }),
        new Paragraph({ children: [new TextRun(value1)] })
      ], { width: columnWidths[0] }),
      createCell([
        new Paragraph({ children: [new TextRun({ text: label, bold: true })] }),
        new Paragraph({ children: [new TextRun(value2)] })
      ], { width: columnWidths[1] })
    ]
  });
}

module.exports = {
  createTitle,
  createCenteredParagraph,
  createParagraph,
  createLabelValueParagraph,
  createPageBreak,
  createCell,
  createHeaderCell,
  createTwoColumnTable,
  createDataRow
};
