const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate employer statement / work certificate page content
 */
function generateEmployerStatement(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("WERKGEVERSVERKLARING", 32));

  // Company details
  content.push(createCenteredParagraph(data.companyName || "......................", { bold: true, size: 28, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.companyAddress || "......................", { size: 20 }));
  content.push(createCenteredParagraph(`KvK: ${data.chamberOfCommerce || "...................."}`, { size: 20, spacing: { after: 200 } }));

  // Statement type
  content.push(createCenteredParagraph(`Type: ${data.statementType || "Arbeidsverklaring"}`, { bold: true, size: 22, spacing: { after: 200 } }));

  // Employee details
  content.push(createCenteredParagraph("GEGEVENS WERKNEMER", { bold: true, size: 24, spacing: { before: 100, after: 100 } }));

  const employeeTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Volledige naam", 3500, "E8F0FF"),
          createCell(data.employeeName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "E8F0FF"),
          createCell(data.employeeBirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Adres", 3500, "E8F0FF"),
          createCell(data.employeeAddress || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Nationaliteit", 3500, "E8F0FF"),
          createCell(data.employeeNationality || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("BSN / ID-nummer", 3500, "E8F0FF"),
          createCell(data.employeeIdNumber || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(employeeTable);

  // Employment details
  content.push(createCenteredParagraph("ARBEIDSGEGEVENS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const employmentTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Functie", 3500, "D5F5D5"),
          createCell(data.jobTitle || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Afdeling", 3500, "D5F5D5"),
          createCell(data.department || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Type contract", 3500, "D5F5D5"),
          createCell(data.contractType || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Datum indiensttreding", 3500, "D5F5D5"),
          createCell(data.startDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Datum uitdiensttreding", 3500, "D5F5D5"),
          createCell(data.endDate || "N.v.t. (nog in dienst)", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Werkuren per week", 3500, "D5F5D5"),
          createCell(data.hoursPerWeek || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Bruto maandsalaris", 3500, "D5F5D5"),
          createCell(data.grossSalary || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Vakantiedagen per jaar", 3500, "D5F5D5"),
          createCell(data.vacationDays || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(employmentTable);

  // Additional statement
  if (data.additionalStatement) {
    content.push(createParagraph("Aanvullende verklaring:", { bold: true, spacing: { before: 200, after: 100 } }));
    content.push(createParagraph(data.additionalStatement));
  }

  // Purpose
  content.push(createLabelValueParagraph("Doel van de verklaring:", data.purpose || "...................."));

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Naam:", data.signatoryName || "...................."));
  content.push(createLabelValueParagraph("Functie:", data.signatoryTitle || "...................."));
  content.push(createLabelValueParagraph("Datum:", data.issueDate || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));
  content.push(createLabelValueParagraph("Bedrijfsstempel:", "[Bedrijfsstempel]"));

  return content;
}

module.exports = { generateEmployerStatement };
