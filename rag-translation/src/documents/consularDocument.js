const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate consular document page content
 */
function generateConsularDocument(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("CONSULAIR DOCUMENT", 32));

  // Embassy/Consulate info
  content.push(createCenteredParagraph(data.embassyName || "Ambassade / Consulaat", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.embassyCountry || "......................", { bold: true, size: 22 }));
  content.push(createCenteredParagraph(data.embassyAddress || "......................", { size: 20, spacing: { after: 200 } }));

  // Document type
  content.push(createCenteredParagraph(`Document: ${data.documentType || "Consulaire Verklaring"}`, { bold: true, size: 22, spacing: { after: 200 } }));

  // Subject details
  const subjectTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Betreft", 3500, "E8F0FF"),
          createCell(data.subjectName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "E8F0FF"),
          createCell(data.subjectBirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "E8F0FF"),
          createCell(data.subjectBirthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Nationaliteit", 3500, "E8F0FF"),
          createCell(data.subjectNationality || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Paspoortnummer", 3500, "E8F0FF"),
          createCell(data.passportNumber || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Huidig adres", 3500, "E8F0FF"),
          createCell(data.currentAddress || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(subjectTable);

  // Document content
  content.push(createParagraph("Inhoud:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph(data.content || "De Ambassade/het Consulaat verklaart hierbij dat ...................."));

  // Purpose
  content.push(createLabelValueParagraph("Doel:", data.purpose || "...................."));

  // Reference to attached documents
  if (data.attachedDocuments) {
    content.push(createParagraph("Bijgevoegde documenten:", { bold: true, spacing: { before: 200, after: 100 } }));
    content.push(createParagraph(data.attachedDocuments));
  }

  // Consular fees
  content.push(createParagraph("Consulaire gegevens:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Referentienummer:", data.referenceNumber || "...................."));
  content.push(createLabelValueParagraph("Consulaire kosten:", data.consularFees || "...................."));
  content.push(createLabelValueParagraph("Datum van afgifte:", data.issueDate || "...................."));
  content.push(createLabelValueParagraph("Geldig tot:", data.validUntil || "...................."));

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Consulair ambtenaar:", data.consularOfficer || "...................."));
  content.push(createLabelValueParagraph("Functie:", data.officerTitle || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));
  content.push(createLabelValueParagraph("Consulair zegel:", "[Officieel zegel]"));

  return content;
}

module.exports = { generateConsularDocument };
