const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate family record book (Livret de famille / Familieboekje) page content
 */
function generateFamilyRecordBook(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("FAMILIEBOEKJE / FAMILIESTAMBOEK", 32));

  // Issuing authority
  content.push(createCenteredParagraph(data.issuingAuthority || "Burgerlijke Stand", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.issuingPlace || "......................", { size: 20, spacing: { after: 200 } }));

  // Book details
  content.push(createLabelValueParagraph("Boekjesnummer:", data.bookNumber || "...................."));
  content.push(createLabelValueParagraph("Datum van afgifte:", data.issueDate || "...................."));

  // Husband/Father details
  content.push(createCenteredParagraph("GEGEVENS ECHTGENOOT / VADER", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const husbandTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Volledige naam", 3500, "E8F8FF"),
          createCell(data.husbandFullName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "E8F8FF"),
          createCell(data.husbandBirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "E8F8FF"),
          createCell(data.husbandBirthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Nationaliteit", 3500, "E8F8FF"),
          createCell(data.husbandNationality || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Beroep", 3500, "E8F8FF"),
          createCell(data.husbandProfession || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Naam vader", 3500, "E8F8FF"),
          createCell(data.husbandFatherName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Naam moeder", 3500, "E8F8FF"),
          createCell(data.husbandMotherName || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(husbandTable);

  // Wife/Mother details
  content.push(createCenteredParagraph("GEGEVENS ECHTGENOTE / MOEDER", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const wifeTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Volledige naam", 3500, "FFE8F0"),
          createCell(data.wifeFullName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "FFE8F0"),
          createCell(data.wifeBirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "FFE8F0"),
          createCell(data.wifeBirthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Nationaliteit", 3500, "FFE8F0"),
          createCell(data.wifeNationality || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Beroep", 3500, "FFE8F0"),
          createCell(data.wifeProfession || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Naam vader", 3500, "FFE8F0"),
          createCell(data.wifeFatherName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Naam moeder", 3500, "FFE8F0"),
          createCell(data.wifeMotherName || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(wifeTable);

  // Marriage details
  content.push(createCenteredParagraph("HUWELIJKSGEGEVENS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Datum huwelijk:", data.marriageDate || "...................."));
  content.push(createLabelValueParagraph("Plaats huwelijk:", data.marriagePlace || "...................."));
  content.push(createLabelValueParagraph("Huwelijksakte nummer:", data.marriageCertNumber || "...................."));

  // Children
  content.push(createCenteredParagraph("KINDEREN", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const childrenTable = new Table({
    columnWidths: [500, 3000, 2000, 2000, 1500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Nr.", 500, "E8E8E8"),
          createHeaderCell("Volledige naam", 3000, "E8E8E8"),
          createHeaderCell("Geboortedatum", 2000, "E8E8E8"),
          createHeaderCell("Geboorteplaats", 2000, "E8E8E8"),
          createHeaderCell("Geslacht", 1500, "E8E8E8")
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("1")] })], { width: 500 }),
          createCell(data.child1Name || "......................", { width: 3000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.child1BirthDate || "..........")] })], { width: 2000 }),
          createCell(data.child1BirthPlace || "..........", { width: 2000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.child1Gender || "....")] })], { width: 1500 })
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("2")] })], { width: 500 }),
          createCell(data.child2Name || "......................", { width: 3000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.child2BirthDate || "..........")] })], { width: 2000 }),
          createCell(data.child2BirthPlace || "..........", { width: 2000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.child2Gender || "....")] })], { width: 1500 })
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("3")] })], { width: 500 }),
          createCell(data.child3Name || "......................", { width: 3000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.child3BirthDate || "..........")] })], { width: 2000 }),
          createCell(data.child3BirthPlace || "..........", { width: 2000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.child3Gender || "....")] })], { width: 1500 })
        ]
      })
    ]
  });
  content.push(childrenTable);

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Ambtenaar burgerlijke stand:", data.registrarName || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));
  content.push(createLabelValueParagraph("Stempel:", "[Officieel stempel]"));

  return content;
}

module.exports = { generateFamilyRecordBook };
