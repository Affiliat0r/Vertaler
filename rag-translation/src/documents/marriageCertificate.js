const { Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, ShadingType } = require('docx');
const { cellBorders, lightCellBorders, createShadedCell } = require('../styles');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createCell, createHeaderCell } = require('../helpers');

/**
 * Generate the marriage certificate page content
 */
function generateMarriageCertificate(data = {}) {
  const content = [];

  // Header
  content.push(createCenteredParagraph("REPUBLIEK JEMEN", { bold: true, size: 28 }));
  content.push(createCenteredParagraph("Ministerie van Justitie", { bold: true, size: 24 }));
  content.push(createCenteredParagraph("Algemene Directie voor Notariële Zaken", { size: 22 }));
  content.push(createCenteredParagraph(`Volgnummer: ${data.serialNumber || '0885'}`, { size: 20 }));

  // Title
  content.push(createTitle("HUWELIJKSAKTE", 32));

  // Quranic verses
  content.push(createCenteredParagraph(
    'Allah de Verhevene zei: "En tot Zijn tekenen behoort dat Hij voor jullie echtgenotes uit jullie eigen soort heeft geschapen, opdat jullie rust bij hen vinden. En Hij heeft tussen jullie liefde en barmhartigheid geplaatst."',
    { italics: true, size: 20 }
  ));
  content.push(createCenteredParagraph(
    'En de Boodschapper van Allah (vrede zij met hem) zei: "Huw en vermeerder, want ik zal trots op jullie zijn tegenover de andere volkeren op de Dag des Oordeels."',
    { italics: true, size: 20, spacing: { after: 200 } }
  ));

  // Contract date info
  content.push(createParagraph(`Op de dag: ${data.dayHijri || '....................'} van de maand: ${data.monthHijri || 'Shawwal'} ${data.yearHijri || '1441'} Hijri, overeenkomend met: ${data.dateGregorian || '....................'}`));
  content.push(createParagraph(`Maand: ${data.month || '1'} Jaar: ${data.year || '2020'} Gregoriaans, verscheen voor mij: ${data.notary || '....................'}`));
  content.push(createParagraph(`Houder van identiteitskaart nr.: ${data.notaryId || '115'}, uitgegeven door: ${data.notaryIdPlace || '....................'} op datum: ${data.notaryIdDate || '27/1/2001'} Gregoriaans`));
  content.push(createParagraph(`De huwelijkscontractant (wali) van de bruid: ${data.waliName || 'Ali ....................'} zoon van ${data.waliFather || '....................'}`));
  content.push(createParagraph(`De zus: ${data.brideName || '....................'} dochter van ${data.brideFather || 'Abd al-Razzaq'} zoon van ${data.brideGrandfather || 'Abd Allah'} Bijnaam: ${data.brideNickname || '....................'}`));

  // Spouses data table header
  content.push(createTitle("GEGEVENS VAN DE ECHTGENOTEN", 24));

  // Main data table
  const spousesTable = new Table({
    columnWidths: [4500, 4500],
    rows: [
      // Header row
      new TableRow({
        children: [
          createHeaderCell("Echtgenoot", 4500),
          createHeaderCell("Echtgenote", 4500)
        ]
      }),
      // Identity document
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Identiteitsbewijs:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`Type: ${data.husbandIdType || 'Persoonlijk'}`)] }),
            new Paragraph({ children: [new TextRun(`Nummer: ${data.husbandIdNumber || '57591254'}`)] }),
            new Paragraph({ children: [new TextRun(`Afgifteplaats: ${data.husbandIdPlace || 'Aden'}`)] }),
            new Paragraph({ children: [new TextRun(`Afgiftedatum: ${data.husbandIdDate || '1/6/2014'}`)] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Identiteitsbewijs:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`Type: ${data.wifeIdType || 'Persoonlijk'}`)] }),
            new Paragraph({ children: [new TextRun(`Nummer: ${data.wifeIdNumber || '17661'}`)] }),
            new Paragraph({ children: [new TextRun(`Afgifteplaats: ${data.wifeIdPlace || 'Aden'}`)] }),
            new Paragraph({ children: [new TextRun(`Afgiftedatum: ${data.wifeIdDate || '8/7/2018'}`)] })
          ], { width: 4500 })
        ]
      }),
      // Birth date
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Geboortedatum:", bold: true }), new TextRun(` ${data.husbandBirthDate || '16/9/1997'} - Hijri: / /`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Geboortedatum:", bold: true }), new TextRun(` ${data.wifeBirthDate || '1/7/'} - Hijri: / /`)] })], { width: 4500 })
        ]
      }),
      // Birth place
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Geboorteplaats:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`Dorp/Stad: ${data.husbandBirthCity || 'Crater'}`)] }),
            new Paragraph({ children: [new TextRun(`District: ${data.husbandBirthDistrict || '....................'} Gouvernement: ${data.husbandBirthGov || '....................'}`)] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Geboorteplaats:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`Dorp/Stad: ${data.wifeBirthCity || 'Al-Mansoura'}`)] }),
            new Paragraph({ children: [new TextRun(`District: ${data.wifeBirthDistrict || 'Al-Mansoura'}, Gouvernement: ${data.wifeBirthGov || 'Aden'}`)] })
          ], { width: 4500 })
        ]
      }),
      // Residence
      new TableRow({
        children: [
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Gebruikelijke verblijfplaats:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`District: ${data.husbandResidence || 'Crater'}, Gouvernement: ${data.husbandResGov || '....................'}`)] })
          ], { width: 4500 }),
          createCell([
            new Paragraph({ children: [new TextRun({ text: "Gebruikelijke verblijfplaats:", bold: true })] }),
            new Paragraph({ children: [new TextRun(`District: ${data.wifeResidence || 'Al-Mansoura'}, Gouvernement: ${data.wifeResGov || 'Aden'}`)] })
          ], { width: 4500 })
        ]
      }),
      // Nationality
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Nationaliteit:", bold: true }), new TextRun(` ${data.husbandNationality || 'Jemenitisch'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Nationaliteit:", bold: true }), new TextRun(` ${data.wifeNationality || 'Jemenitisch'}`)] })], { width: 4500 })
        ]
      }),
      // Previous marital status
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Eerdere burgerlijke staat:", bold: true }), new TextRun(` ${data.husbandPrevStatus || '....................'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Eerdere burgerlijke staat:", bold: true }), new TextRun(` ${data.wifePrevStatus || '....................'}`)] })], { width: 4500 })
        ]
      }),
      // Education
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Opleidingsniveau:", bold: true }), new TextRun(` ${data.husbandEducation || 'Gemiddeld'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Opleidingsniveau:", bold: true }), new TextRun(` ${data.wifeEducation || 'Gemiddeld'}`)] })], { width: 4500 })
        ]
      }),
      // Profession
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Beroep:", bold: true }), new TextRun(` ${data.husbandProfession || '....................'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Beroep:", bold: true }), new TextRun(` ${data.wifeProfession || 'Huisvrouw'}`)] })], { width: 4500 })
        ]
      }),
      // Mother's name
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun({ text: "Naam van de moeder:", bold: true }), new TextRun(` ${data.husbandMother || 'Hafsa Munir Ahmed Hilal'}`)] })], { width: 4500 }),
          createCell([new Paragraph({ children: [new TextRun({ text: "Naam van de moeder:", bold: true }), new TextRun(` ${data.wifeMother || 'Samar Muhammad Ahmed Saeed'}`)] })], { width: 4500 })
        ]
      })
    ]
  });
  content.push(spousesTable);

  // Contract details
  content.push(new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun("Na vaststelling van de toestemming van de contractanten die wettelijk als geldig wordt beschouwd, en de afwezigheid van wettelijke belemmeringen voor hen beiden, werd het contract gesloten door de wali van de vrouw die het dichtst bij haar staat volgens de sharia, haar broer.")]
  }));
  content.push(createParagraph(`De broer: ${data.brotherName || 'Jamil Zain Jamil Barik'}, houder van identiteitskaart nr. (${data.brotherId || '686679'}), uitgegeven door: ${data.brotherIdPlace || 'Crater'}, op datum: ${data.brotherIdDate || '14/3/2019'}`));
  content.push(createParagraph("Door middel van aanbod en aanvaarding volgens het Boek van Allah de Verhevene en de Sunnah van Zijn Boodschapper (vrede zij met hem), en met overeenstemming over de bruidschat, zijnde: de uitgestelde bruidschat ...................."));
  content.push(createParagraph("Contant betaald bij het sluiten van het contract ...................."));
  content.push(createParagraph("(En uitgesteld): .................... en de aanvaarding van: ...................."));
  content.push(createParagraph("En het contract werd gesloten op de genoemde pagina in aanwezigheid van:"));

  // Witnesses
  content.push(new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: "Eerste getuige:", bold: true }),
      new TextRun(` ${data.witness1Name || '....................'} houder van identiteitskaart nr. (${data.witness1Id || '706095'}), uitgegeven door: ${data.witness1IdPlace || '....................'} op datum: ${data.witness1IdDate || '11/14/2019'}`)
    ]
  }));
  content.push(new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: "Tweede getuige:", bold: true }),
      new TextRun(` ${data.witness2Name || '....................'} houder van identiteitskaart nr. (${data.witness2Id || '1164543'}), uitgegeven door: ${data.witness2IdPlace || '....................'} op datum: ${data.witness2IdDate || '17/8/2017'}`)
    ]
  }));

  // Blessing
  content.push(createCenteredParagraph("Moge Allah dit tot een gezegend en weldadig huwelijk maken...", { bold: true, italics: true, spacing: { before: 200, after: 200 } }));

  // Fingerprints section
  content.push(createParagraph("Vingerafdrukken en handtekeningen:", { bold: true, spacing: { before: 100, after: 100 } }));
  
  const fingerprintsTable = new Table({
    columnWidths: [1800, 1800, 1800, 1800, 1800],
    rows: [
      new TableRow({
        children: [
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Vingerafdruk Wali", size: 18 })] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Vingerafdruk Echtgenote", size: 18 })] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Vingerafdruk Echtgenoot", size: 18 })] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Handtekening Getuige 1", size: 18 })] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Handtekening Getuige 2", size: 18 })] })], { width: 1800, borders: lightCellBorders })
        ]
      }),
      new TableRow({
        children: [
          createCell([new Paragraph({ children: [new TextRun(" ")] }), new Paragraph({ children: [new TextRun(" ")] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ children: [new TextRun(" ")] }), new Paragraph({ children: [new TextRun(" ")] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ children: [new TextRun(" ")] }), new Paragraph({ children: [new TextRun(" ")] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ children: [new TextRun(" ")] }), new Paragraph({ children: [new TextRun(" ")] })], { width: 1800, borders: lightCellBorders }),
          createCell([new Paragraph({ children: [new TextRun(" ")] }), new Paragraph({ children: [new TextRun(" ")] })], { width: 1800, borders: lightCellBorders })
        ]
      })
    ]
  });
  content.push(fingerprintsTable);

  // Document recorder
  content.push(createLabelValueParagraph("Naam van de documentregistrator:", data.registrarName || "...................."));
  content.push(createLabelValueParagraph("Functie:", data.registrarTitle || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));

  return content;
}

module.exports = { generateMarriageCertificate };
