const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate notarial deed page content
 */
function generateNotarialDeed(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("NOTARIËLE AKTE", 32));

  // Notary info
  content.push(createCenteredParagraph(data.notaryName || "Notaris ......................", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.notaryOffice || "......................", { size: 22 }));
  content.push(createCenteredParagraph(data.notaryAddress || "......................", { size: 20, spacing: { after: 200 } }));

  // Deed type
  content.push(createCenteredParagraph(`Type akte: ${data.deedType || "Notariële Akte"}`, { bold: true, size: 22, spacing: { after: 200 } }));

  // Deed details
  content.push(createCenteredParagraph("AKTEGEGEVENS", { bold: true, size: 24, spacing: { before: 100, after: 100 } }));

  const deedTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Repertoriumnummer", 3500, "FFF8E8"),
          createCell(data.repertoireNumber || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Datum van de akte", 3500, "FFF8E8"),
          createCell(data.deedDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Plaats van verlijden", 3500, "FFF8E8"),
          createCell(data.deedPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Registratienummer", 3500, "FFF8E8"),
          createCell(data.registrationNumber || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(deedTable);

  // Parties involved
  content.push(createCenteredParagraph("COMPARANTEN / PARTIJEN", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  // Party 1
  content.push(createParagraph("Partij 1:", { bold: true, spacing: { before: 100, after: 100 } }));
  const party1Table = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Naam", 3500, "E8F0FF"),
          createCell(data.party1Name || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "E8F0FF"),
          createCell(data.party1BirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "E8F0FF"),
          createCell(data.party1BirthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Adres", 3500, "E8F0FF"),
          createCell(data.party1Address || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Identiteitsbewijs", 3500, "E8F0FF"),
          createCell(data.party1IdDocument || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Hoedanigheid", 3500, "E8F0FF"),
          createCell(data.party1Capacity || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(party1Table);

  // Party 2
  content.push(createParagraph("Partij 2:", { bold: true, spacing: { before: 200, after: 100 } }));
  const party2Table = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Naam", 3500, "D5F5D5"),
          createCell(data.party2Name || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "D5F5D5"),
          createCell(data.party2BirthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "D5F5D5"),
          createCell(data.party2BirthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Adres", 3500, "D5F5D5"),
          createCell(data.party2Address || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Identiteitsbewijs", 3500, "D5F5D5"),
          createCell(data.party2IdDocument || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Hoedanigheid", 3500, "D5F5D5"),
          createCell(data.party2Capacity || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(party2Table);

  // Subject of the deed
  content.push(createParagraph("Onderwerp van de akte:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph(data.deedSubject || "De comparanten verklaren het volgende te zijn overeengekomen: ...................."));

  // Deed content/provisions
  content.push(createParagraph("Inhoud / Bepalingen:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph(data.deedContent || "...................."));

  // Financial details (if applicable)
  if (data.financialAmount) {
    content.push(createParagraph("Financiële gegevens:", { bold: true, spacing: { before: 200, after: 100 } }));
    content.push(createLabelValueParagraph("Bedrag:", data.financialAmount));
    content.push(createLabelValueParagraph("Betalingswijze:", data.paymentMethod || "...................."));
  }

  // Witnesses
  content.push(createParagraph("Getuigen:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Getuige 1:", data.witness1Name || "...................."));
  content.push(createLabelValueParagraph("Getuige 2:", data.witness2Name || "...................."));

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph("Deze akte is voorgelezen aan de comparanten, die verklaren de inhoud te begrijpen en hiermee akkoord te gaan."));
  content.push(createLabelValueParagraph("Handtekening Partij 1:", "...................."));
  content.push(createLabelValueParagraph("Handtekening Partij 2:", "...................."));
  content.push(createLabelValueParagraph("Handtekening Notaris:", "...................."));
  content.push(createLabelValueParagraph("Notarieel zegel:", "[Notarieel zegel]"));

  return content;
}

module.exports = { generateNotarialDeed };
