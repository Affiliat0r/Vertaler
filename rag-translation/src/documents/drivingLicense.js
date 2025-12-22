const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate driving license page content
 */
function generateDrivingLicense(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("RIJBEWIJS", 32));

  // Issuing country
  content.push(createCenteredParagraph(data.issuingCountry || "......................", { bold: true, size: 24, spacing: { before: 200, after: 200 } }));

  // License holder details
  content.push(createCenteredParagraph("GEGEVENS RIJBEWIJSHOUDER", { bold: true, size: 24, spacing: { before: 100, after: 100 } }));

  const holderTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("1. Achternaam", 3500, "FFF0F0"),
          createCell(data.lastName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("2. Voornamen", 3500, "FFF0F0"),
          createCell(data.firstNames || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("3. Geboortedatum", 3500, "FFF0F0"),
          createCell(data.birthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("3. Geboorteplaats", 3500, "FFF0F0"),
          createCell(data.birthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("4a. Afgiftedatum", 3500, "FFF0F0"),
          createCell(data.issueDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("4b. Vervaldatum", 3500, "FFF0F0"),
          createCell(data.expiryDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("4c. Afgegeven door", 3500, "FFF0F0"),
          createCell(data.issuingAuthority || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("5. Rijbewijsnummer", 3500, "FFF0F0"),
          createCell(data.licenseNumber || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("8. Adres", 3500, "FFF0F0"),
          createCell(data.address || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Nationaliteit", 3500, "FFF0F0"),
          createCell(data.nationality || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(holderTable);

  // Categories
  content.push(createCenteredParagraph("RIJBEWIJSCATEGORIEËN", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const categoriesTable = new Table({
    columnWidths: [1500, 2500, 2500, 2500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("9. Categorie", 1500, "E8E8E8"),
          createHeaderCell("10. Afgiftedatum", 2500, "E8E8E8"),
          createHeaderCell("11. Vervaldatum", 2500, "E8E8E8"),
          createHeaderCell("12. Beperkingen", 2500, "E8E8E8")
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category1 || "A")] })], { width: 1500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category1IssueDate || "..........")] })], { width: 2500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category1ExpiryDate || "..........")] })], { width: 2500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category1Restrictions || "-")] })], { width: 2500 })
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category2 || "B")] })], { width: 1500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category2IssueDate || "..........")] })], { width: 2500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category2ExpiryDate || "..........")] })], { width: 2500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category2Restrictions || "-")] })], { width: 2500 })
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category3 || "C")] })], { width: 1500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category3IssueDate || "..........")] })], { width: 2500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category3ExpiryDate || "..........")] })], { width: 2500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.category3Restrictions || "-")] })], { width: 2500 })
        ]
      })
    ]
  });
  content.push(categoriesTable);

  // Additional info
  content.push(createLabelValueParagraph("Bloedgroep:", data.bloodGroup || "...................."));
  content.push(createLabelValueParagraph("Opmerkingen:", data.remarks || "...................."));

  return content;
}

module.exports = { generateDrivingLicense };
