const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { cellBorders } = require('../styles');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate the birth certificate page content
 */
function generateBirthCertificate(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("GEBOORTEAKTE", 32));

  // Newborn data section
  content.push(createCenteredParagraph("GEGEVENS VAN DE PASGEBORENE", { bold: true, size: 24, spacing: { before: 100, after: 100 } }));

  const newbornTable = new Table({
    columnWidths: [3000, 6000],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Volledige naam van de pasgeborene", 3000, "FFF0F0"),
          createCell(data.newbornFullName || "Raw'a Abd al-Razzaq Abd al-Rab Abu Bakr Salah", { width: 6000 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Geslacht", 3000, "FFF0F0"),
          createCell(data.newbornGender || "Vrouwelijk", { width: 6000 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Voornaam pasgeborene", 3000, "FFF0F0"),
          createCell(data.newbornFirstName || "Raw'a", { width: 6000 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Naam vader", 3000, "FFF0F0"),
          createCell(data.fatherName || "Abd al-Razzaq", { width: 6000 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Naam grootvader en familienaam", 3000, "FFF0F0"),
          createCell(data.grandfatherAndFamily || "Abd al-Rab Abu Bakr Salah", { width: 6000 })
        ]
      })
    ]
  });
  content.push(newbornTable);

  // Birth date in letters
  content.push(createCenteredParagraph("GEBOORTEDATUM IN LETTERS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const birthDateTable = new Table({
    columnWidths: [1800, 1800, 1800, 1800, 1800],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Uur", 1800, "E8F0FF"),
          createHeaderCell("Dag", 1800, "E8F0FF"),
          createHeaderCell("Maand", 1800, "E8F0FF"),
          createHeaderCell("Jaar", 1800, "E8F0FF"),
          createHeaderCell("Kalender", 1800, "E8F0FF")
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthHourHijri || "....................")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthDayHijri || "De eerste")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthMonthHijri || "Shawwal")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthYearHijri || "....................")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Hijri")] })], { width: 1800 })
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthHourGregorian || "....................")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthDayGregorian || "De eerste")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthMonthGregorian || "....................")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthYearGregorian || "....................")] })], { width: 1800 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("Gregoriaans")] })], { width: 1800 })
        ]
      })
    ]
  });
  content.push(birthDateTable);

  // Birth place
  content.push(createCenteredParagraph("GEBOORTEPLAATS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const birthPlaceTable = new Table({
    columnWidths: [3000, 3000, 3000],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Dorp/Stad", 3000, "E8F0FF"),
          createHeaderCell("District", 3000, "E8F0FF"),
          createHeaderCell("Gouvernement/Land", 3000, "E8F0FF")
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthCity || "....................")] })], { width: 3000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthDistrict || "Al-Mansoura")] })], { width: 3000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.birthGovernorate || "Aden")] })], { width: 3000 })
        ]
      })
    ]
  });
  content.push(birthPlaceTable);

  // Parents data
  content.push(createCenteredParagraph("GEGEVENS VAN DE OUDERS", { bold: true, size: 24, spacing: { before: 200, after: 100 } }));

  const parentsTable = new Table({
    columnWidths: [2250, 6750],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Vader:", 2250, "E8F8FF"),
          createCell(data.fatherFullName || "Abd al-Razzaq Abd al-Rab Abu Bakr Salah", { width: 6750 })
        ]
      }),
      new TableRow({
        children: [
          createHeaderCell("Moeder:", 2250, "FFE8F0"),
          createCell(data.motherFullName || "Samar Muhammad Ahmed Saeed", { width: 6750 })
        ]
      })
    ]
  });
  content.push(parentsTable);

  // Parents national ID
  content.push(createParagraph("Nationaal ID-nummer van de ouders:", { bold: true, spacing: { before: 200, after: 100 } }));
  
  const parentsIdTable = new Table({
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
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.fatherNationalId || "[Leeg]")] })], { width: 4500 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(data.motherNationalId || "[Leeg]")] })], { width: 4500 })
        ]
      })
    ]
  });
  content.push(parentsIdTable);

  // Family civil registration
  content.push(createParagraph("Gezinsregistratie bij de Burgerlijke Stand:", { bold: true, spacing: { before: 200, after: 100 } }));
  
  const familyRegTable = new Table({
    columnWidths: [3000, 3000, 3000],
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Naam van de administratie", 3000, "F0F0F0"),
          createHeaderCell("Gezinsregistratienummer", 3000, "F0F0F0"),
          createHeaderCell("Datum", 3000, "F0F0F0")
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("-")] })], { width: 3000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("-")] })], { width: 3000 }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("-")] })], { width: 3000 })
        ]
      })
    ]
  });
  content.push(familyRegTable);

  // Registration details
  content.push(createParagraph(`De geboortegegevens zijn geregistreerd in het geboorteregister nummer: ${data.birthRegNumber || '18'} en registratienummer: ${data.birthRegId || '233'}`, { spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Registratiedatum:", data.birthRegDate || "4/9/2027"));
  content.push(createParagraph(`Bij de Burgerlijke Stand: ${data.civilOffice || 'Al-Mansura'} District: ${data.civilDistrict || '....................'} Gouvernement: ${data.civilGovernorate || 'Lahij'}`));

  content.push(createLabelValueParagraph("Directeur Burgerlijke Stand:", data.civilDirector || "...................."));
  content.push(createLabelValueParagraph("Naam van de registrator:", data.registrarName || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));

  // Newborn national ID
  content.push(new Paragraph({
    spacing: { before: 100, after: 100 },
    children: [new TextRun({ text: "Nationaal ID-nummer van de pasgeborene:", bold: true }), new TextRun(` ${data.newbornNationalId || '[Leeg]'}`)]
  }));

  return content;
}

module.exports = { generateBirthCertificate };
