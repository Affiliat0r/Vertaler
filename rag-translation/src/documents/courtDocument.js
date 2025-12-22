const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate court document page content
 */
function generateCourtDocument(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("GERECHTELIJK DOCUMENT", 32));

  // Court info
  content.push(createCenteredParagraph(data.courtName || "Rechtbank", { bold: true, size: 28, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.courtDivision || "......................", { bold: true, size: 22 }));
  content.push(createCenteredParagraph(data.courtAddress || "......................", { size: 20, spacing: { after: 200 } }));

  // Document type
  content.push(createCenteredParagraph(`Type: ${data.documentType || "Gerechtelijke Uitspraak"}`, { bold: true, size: 22, spacing: { after: 200 } }));

  // Case details
  content.push(createCenteredParagraph("ZAAKGEGEVENS", { bold: true, size: 24, spacing: { before: 100, after: 100 } }));

  const caseTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Zaaknummer", 3500, "E8E8E8"),
          createCell(data.caseNumber || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Datum uitspraak", 3500, "E8E8E8"),
          createCell(data.judgmentDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Type zaak", 3500, "E8E8E8"),
          createCell(data.caseType || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Rechter(s)", 3500, "E8E8E8"),
          createCell(data.judges || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(caseTable);

  // Parties involved
  content.push(createCenteredParagraph("BETROKKEN PARTIJEN", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const partiesTable = new Table({
    columnWidths: [4500, 4500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Eiser / Verzoeker", 4500, "D5F5D5"),
          createHeaderCell("Gedaagde / Verweerder", 4500, "FFF0F0")
        ]
      }),
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Naam: ", bold: true }), new TextRun(data.plaintiffName || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Adres: ", bold: true }), new TextRun(data.plaintiffAddress || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Advocaat: ", bold: true }), new TextRun(data.plaintiffLawyer || "....................")] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Naam: ", bold: true }), new TextRun(data.defendantName || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Adres: ", bold: true }), new TextRun(data.defendantAddress || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Advocaat: ", bold: true }), new TextRun(data.defendantLawyer || "....................")] })
          ], { width: 4500 })
        ]
      })
    ]
  });
  content.push(partiesTable);

  // Subject matter
  content.push(createParagraph("Onderwerp van de zaak:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph(data.subjectMatter || "...................."));

  // Decision/Ruling
  content.push(createParagraph("Beslissing / Uitspraak:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph(data.decision || "De rechtbank beslist als volgt: ...................."));

  // Grounds for decision
  if (data.grounds) {
    content.push(createParagraph("Gronden voor de beslissing:", { bold: true, spacing: { before: 200, after: 100 } }));
    content.push(createParagraph(data.grounds));
  }

  // Appeal information
  content.push(createParagraph("Beroepsmogelijkheid:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph(data.appealInfo || "Tegen deze uitspraak kan binnen [termijn] hoger beroep worden ingesteld bij ...................."));

  // Court costs
  content.push(createLabelValueParagraph("Proceskosten:", data.courtCosts || "...................."));

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Griffier:", data.clerkName || "...................."));
  content.push(createLabelValueParagraph("Rechter:", data.judgeName || "...................."));
  content.push(createLabelValueParagraph("Datum:", data.signatureDate || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));
  content.push(createLabelValueParagraph("Rechtbankstempel:", "[Officieel stempel]"));

  return content;
}

module.exports = { generateCourtDocument };
