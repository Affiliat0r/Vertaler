const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate general certificate page content (attestations, declarations, etc.)
 */
function generateCertificate(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("VERKLARING / ATTEST", 32));

  // Issuing authority
  content.push(createCenteredParagraph(data.issuingAuthority || "......................", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.authorityAddress || "......................", { size: 20, spacing: { after: 200 } }));

  // Certificate type
  content.push(createCenteredParagraph(`Type: ${data.certificateType || "Algemene Verklaring"}`, { bold: true, size: 22, spacing: { after: 200 } }));

  // Certificate details table
  const certTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Betreft", 3500, "D5F5D5"),
          createCell(data.subjectName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "D5F5D5"),
          createCell(data.subjectBirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "D5F5D5"),
          createCell(data.subjectBirthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Nationaliteit", 3500, "D5F5D5"),
          createCell(data.subjectNationality || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Identiteitsnummer", 3500, "D5F5D5"),
          createCell(data.subjectIdNumber || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Referentienummer", 3500, "D5F5D5"),
          createCell(data.referenceNumber || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(certTable);

  // Certificate content
  content.push(createParagraph("Inhoud van de verklaring:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph(data.certificateContent || "Deze verklaring bevestigt dat bovengenoemde persoon ...................."));

  // Purpose
  content.push(createLabelValueParagraph("Doel van de verklaring:", data.purpose || "...................."));

  // Validity
  content.push(createParagraph("Geldigheid:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Datum van afgifte:", data.issueDate || "...................."));
  content.push(createLabelValueParagraph("Geldig tot:", data.validUntil || "...................."));

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Naam functionaris:", data.officialName || "...................."));
  content.push(createLabelValueParagraph("Functie:", data.officialTitle || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));
  content.push(createLabelValueParagraph("Stempel:", "[Officieel stempel]"));

  return content;
}

module.exports = { generateCertificate };
