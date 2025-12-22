const { Paragraph, TextRun, Table, TableRow, AlignmentType } = require('docx');
const { cellBorders, createShadedCell } = require('../styles');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate the civil registration page content
 */
function generateCivilRegistration(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Header
  content.push(createCenteredParagraph("REPUBLIEK JEMEN", { bold: true, size: 24, spacing: { before: 100, after: 100 } }));
  content.push(createCenteredParagraph("BURGERLIJKE STAND - HUWELIJKSREGISTRATIE", { bold: true, size: 28, spacing: { after: 200 } }));

  // Contract date header
  content.push(new Paragraph({
    spacing: { before: 100, after: 100 },
    children: [
      new TextRun({ text: "Datum van het contract in letters:", bold: true }),
      new TextRun(` Dag: ${data.dayInWords || 'Eén'}, Maand: ${data.monthInWords || 'Januari'}, Jaar: ${data.yearInWords || 'Tweeduizend Eenentwintig'}`)
    ]
  }));
  content.push(new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "Plaats van het contract:", bold: true }),
      new TextRun(` Isolatie/Wijk: ${data.neighborhood || '....................'} District: ${data.district || 'Al-Mansoura'}, Gouvernement/Land: ${data.governorate || 'Aden'}`)
    ]
  }));

  // Spouses data table
  const spousesTable = new Table({
    columnWidths: [4500, 4500],
    rows: [
      // Header
      new TableRow({
        children: [
          createHeaderCell("Gegevens Echtgenoot", 4500, "D5F5D5"),
          createHeaderCell("Gegevens Echtgenote", 4500, "D5F5D5")
        ]
      }),
      // Full name
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Volledige naam:", bold: true })] }),
            new Paragraph({ children: [new TextRun(data.husbandFullName || "Ali Abd .................... Ali Abd Laghwi")] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Volledige naam:", bold: true })] }),
            new Paragraph({ children: [new TextRun(data.wifeFullName || "Raw'a Abd al-Razzaq Abd al-Rab Abu Bakr")] })
          ], { width: 4500 })
        ]
      }),
      // Birth date
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Geboortedatum:", bold: true }), new TextRun(` ${data.husbandBirthDate || '16/9/1998'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Geboortedatum:", bold: true }), new TextRun(` ${data.wifeBirthDate || '1/1/2007'}`)] })], { width: 4500 })
        ]
      }),
      // Birth place
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Geboorteplaats:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`Dorp/Stad: ${data.husbandBirthCity || 'Crater'}`)] }),
            new Paragraph({ children: [new TextRun(`District: ${data.husbandBirthDistrict || '....................'} Gouvernement/Land: ${data.husbandBirthGov || 'Lahij'}`)] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Geboorteplaats:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`Dorp/Stad: ${data.wifeBirthCity || 'Al-Mansoura'}`)] }),
            new Paragraph({ children: [new TextRun(`District: ${data.wifeBirthDistrict || '....................'} Gouvernement/Land: ${data.wifeBirthGov || 'Aden'}`)] })
          ], { width: 4500 })
        ]
      }),
      // Profession
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Hoofdberoep:", bold: true }), new TextRun(` ${data.husbandProfession || 'Student'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Hoofdberoep:", bold: true }), new TextRun(` ${data.wifeProfession || 'Huisvrouw'}`)] })], { width: 4500 })
        ]
      }),
      // Nationality and Religion
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Nationaliteit:", bold: true }), new TextRun(` ${data.husbandNationality || 'Jemenitisch'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Religie:", bold: true }), new TextRun(` ${data.husbandReligion || 'Islam'}`)] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Nationaliteit:", bold: true }), new TextRun(` ${data.wifeNationality || 'Jemenitisch'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Religie:", bold: true }), new TextRun(` ${data.wifeReligion || 'Islam'}`)] })
          ], { width: 4500 })
        ]
      }),
      // Mother's name
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Volledige naam moeder:", bold: true })] }),
            new Paragraph({ children: [new TextRun(data.husbandMotherName || "Hafsa Munir Ahmed Hilal")] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Volledige naam moeder:", bold: true })] }),
            new Paragraph({ children: [new TextRun(data.wifeMotherName || "Samar Muhammad Ahmed Saeed")] })
          ], { width: 4500 })
        ]
      }),
      // ID info
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Type identiteitsbewijs:", bold: true }), new TextRun(` ${data.husbandIdType || 'Persoonlijk'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Nummer:", bold: true }), new TextRun(` ${data.husbandIdNumber || '57591254'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Afgifteplaats:", bold: true }), new TextRun(` ${data.husbandIdPlace || 'Aden'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Afgiftedatum:", bold: true }), new TextRun(` ${data.husbandIdDate || '1/5/2014'}`)] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Type identiteitsbewijs:", bold: true }), new TextRun(` ${data.wifeIdType || 'Gezinsboekje'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Nummer:", bold: true }), new TextRun(` ${data.wifeIdNumber || '2008715'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Afgifteplaats:", bold: true }), new TextRun(` ${data.wifeIdPlace || 'Aden'}`)] }),
            new Paragraph({ children: [new TextRun({ text: "Afgiftedatum:", bold: true }), new TextRun(` ${data.wifeIdDate || '7/7/2018'}`)] })
          ], { width: 4500 })
        ]
      }),
      // National ID
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Nationaal ID-nummer:", bold: true }), new TextRun(` ${data.husbandNationalId || '[Leeg]'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Nationaal ID-nummer:", bold: true }), new TextRun(` ${data.wifeNationalId || '17266'}`)] })], { width: 4500 })
        ]
      }),
      // Family registration
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Gezinsregistratienummer:", bold: true }), new TextRun(" ....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Registratiedatum:", bold: true }), new TextRun(" / /")] }),
            new Paragraph({ children: [new TextRun({ text: "Registratieplaats:", bold: true }), new TextRun(" ....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Gouvernement:", bold: true }), new TextRun(" ....................")] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Gezinsregistratienummer:", bold: true }), new TextRun(" ....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Registratiedatum:", bold: true }), new TextRun(" / /")] }),
            new Paragraph({ children: [new TextRun({ text: "Registratieplaats:", bold: true }), new TextRun(" ....................")] }),
            new Paragraph({ children: [new TextRun({ text: "Gouvernement:", bold: true }), new TextRun(" ....................")] })
          ], { width: 4500 })
        ]
      })
    ]
  });
  content.push(spousesTable);

  // Marriage type
  content.push(createParagraph("Type huwelijk:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph("[✓] Nieuw      [ ] Bevestiging"));

  // Authentication reference
  content.push(createParagraph("Authentificatiereferentie:", { bold: true, spacing: { before: 100, after: 100 } }));
  content.push(createLabelValueParagraph("Nummer:", data.authNumber || "(4 van 11)"));
  content.push(createLabelValueParagraph("Datum:", data.authDate || "2/5/2027"));
  content.push(createLabelValueParagraph("Naam van de rechtbank:", data.courtName || "13 Aden"));

  // Registration footer
  content.push(createParagraph("De huwelijksgebeurtenis is geregistreerd in het huwelijksregister bij de Burgerlijke Stand", { spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("District:", `${data.regDistrict || 'Crater'}, Gouvernement: ${data.regGovernorate || 'Aden'}`));
  content.push(createLabelValueParagraph("Datum:", data.regDate || "1/8/2027"));
  content.push(createLabelValueParagraph("Directeur Burgerlijke Stand:", data.civilDirector || "...................."));
  content.push(createLabelValueParagraph("Naam van de registrator:", data.registrarName || "Wafa Ali"));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));

  return content;
}

module.exports = { generateCivilRegistration };
