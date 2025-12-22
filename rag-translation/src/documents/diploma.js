const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate diploma/degree certificate page content
 */
function generateDiploma(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("DIPLOMA / GETUIGSCHRIFT", 32));

  // Institution info
  content.push(createCenteredParagraph(data.institutionName || "......................", { bold: true, size: 28, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.institutionAddress || "......................", { size: 20, spacing: { after: 200 } }));

  // Diploma details table
  const diplomaTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Volledige naam", 3500, "E8F0FF"),
          createCell(data.holderFullName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "E8F0FF"),
          createCell(data.holderBirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "E8F0FF"),
          createCell(data.holderBirthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Diplomatype", 3500, "E8F0FF"),
          createCell(data.diplomaType || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Studierichting", 3500, "E8F0FF"),
          createCell(data.fieldOfStudy || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Specialisatie", 3500, "E8F0FF"),
          createCell(data.specialization || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Behaalde graad", 3500, "E8F0FF"),
          createCell(data.degreeAwarded || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Classificatie/Cijfer", 3500, "E8F0FF"),
          createCell(data.classification || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Datum van afgifte", 3500, "E8F0FF"),
          createCell(data.issueDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Diplomaserie", 3500, "E8F0FF"),
          createCell(data.diplomaSerial || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Registratienummer", 3500, "E8F0FF"),
          createCell(data.registrationNumber || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(diplomaTable);

  // Study period
  content.push(createParagraph("Studieperiode:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Van:", data.studyStartDate || "...................."));
  content.push(createLabelValueParagraph("Tot:", data.studyEndDate || "...................."));

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Rector/Directeur:", data.rectorName || "...................."));
  content.push(createLabelValueParagraph("Decaan/Afdelingshoofd:", data.deanName || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));
  content.push(createLabelValueParagraph("Stempel:", "[Officieel stempel]"));

  return content;
}

module.exports = { generateDiploma };
