const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate BRP extract (Basisregistratie Personen / Population register extract) page content
 */
function generateBrpExtract(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("UITTREKSEL BEVOLKINGSREGISTER", 32));
  content.push(createCenteredParagraph("(BRP / GBA Uittreksel)", { size: 20, spacing: { after: 100 } }));

  // Issuing authority
  content.push(createCenteredParagraph(data.issuingAuthority || "Gemeente / Burgerlijke Stand", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));
  content.push(createCenteredParagraph(data.issuingPlace || "......................", { size: 20, spacing: { after: 200 } }));

  // Extract details
  content.push(createLabelValueParagraph("Uittrekselnummer:", data.extractNumber || "...................."));
  content.push(createLabelValueParagraph("Datum van afgifte:", data.issueDate || "...................."));

  // Personal details
  content.push(createCenteredParagraph("PERSOONSGEGEVENS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const personalTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Achternaam", 3500, "E8F0FF"),
          createCell(data.lastName || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Voornamen", 3500, "E8F0FF"),
          createCell(data.firstNames || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboortedatum", 3500, "E8F0FF"),
          createCell(data.birthDate || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteplaats", 3500, "E8F0FF"),
          createCell(data.birthPlace || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geboorteland", 3500, "E8F0FF"),
          createCell(data.birthCountry || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geslacht", 3500, "E8F0FF"),
          createCell(data.gender || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Nationaliteit", 3500, "E8F0FF"),
          createCell(data.nationality || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Burgerlijke staat", 3500, "E8F0FF"),
          createCell(data.maritalStatus || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("BSN / Identiteitsnummer", 3500, "E8F0FF"),
          createCell(data.bsnNumber || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(personalTable);

  // Address details
  content.push(createCenteredParagraph("ADRESGEGEVENS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const addressTable = new Table({
    columnWidths: [3500, 5500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Straat en huisnummer", 3500, "D5F5D5"),
          createCell(data.streetAddress || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Postcode", 3500, "D5F5D5"),
          createCell(data.postalCode || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Woonplaats", 3500, "D5F5D5"),
          createCell(data.city || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Land", 3500, "D5F5D5"),
          createCell(data.country || "......................", { width: 5500 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Datum inschrijving", 3500, "D5F5D5"),
          createCell(data.registrationDate || "......................", { width: 5500 })
        ]
      })
    ]
  });
  content.push(addressTable);

  // Parents details
  content.push(createCenteredParagraph("GEGEVENS OUDERS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const parentsTable = new Table({
    columnWidths: [4500, 4500],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Vader", 4500, "E8F8FF"),
          createHeaderCell("Moeder", 4500, "FFE8F0")
        ]
      }),
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Naam: ", bold: true }), new TextRun(data.fatherName || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Geboortedatum: ", bold: true }), new TextRun(data.fatherBirthDate || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Geboorteplaats: ", bold: true }), new TextRun(data.fatherBirthPlace || "....................")] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Naam: ", bold: true }), new TextRun(data.motherName || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Geboortedatum: ", bold: true }), new TextRun(data.motherBirthDate || "....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Geboorteplaats: ", bold: true }), new TextRun(data.motherBirthPlace || "....................")] })
          ], { width: 4500 })
        ]
      })
    ]
  });
  content.push(parentsTable);

  // Partner details (if applicable)
  if (data.partnerName) {
    content.push(createCenteredParagraph("GEGEVENS PARTNER", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));
    content.push(createLabelValueParagraph("Naam partner:", data.partnerName));
    content.push(createLabelValueParagraph("Geboortedatum:", data.partnerBirthDate || "...................."));
    content.push(createLabelValueParagraph("Datum huwelijk/partnerschap:", data.marriageDate || "...................."));
  }

  // Signatures
  content.push(createParagraph("Ondertekening:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Ambtenaar:", data.officialName || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));
  content.push(createLabelValueParagraph("Gemeentestempel:", "[Officieel stempel]"));

  return content;
}

module.exports = { generateBrpExtract };
