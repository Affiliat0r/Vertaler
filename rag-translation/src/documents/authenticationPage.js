const { Paragraph, TextRun } = require('docx');
const { createTitle, createCenteredParagraph, createParagraph, createLabelValueParagraph, createPageBreak } = require('../helpers');

/**
 * Generate the authentication/legalization page content
 */
function generateAuthenticationPage(data = {}) {
  const content = [];

  // Page break before this section
  content.push(createPageBreak());

  // Title
  content.push(createTitle("LEGALISATIE- EN AUTHENTIFICATIEPAGINA", 28));

  // Ministry of Foreign Affairs section
  content.push(createParagraph("REPUBLIEK JEMEN", { bold: true, spacing: { before: 100, after: 100 } }));
  content.push(createParagraph("Ministerie van Buitenlandse Zaken", { bold: true }));
  content.push(createParagraph("Afdeling Consulaire Zaken", { spacing: { after: 200 } }));

  content.push(createParagraph("Legalisatie:", { bold: true, spacing: { before: 100, after: 100 } }));
  content.push(createParagraph("De Consulaire Afdeling authenticeert de handtekening en het zegel."));
  content.push(createParagraph("Niet verantwoordelijk voor de inhoud van het document.", { italics: true, spacing: { after: 200 } }));

  // Court stamp info
  content.push(createParagraph("Rechtbank van Eerste Aanleg - Al-Mansoura", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Naam:", data.courtName || "Ali Abd ...................."));
  content.push(createLabelValueParagraph("Bedrag:", data.courtAmount || ".................... Alleen"));
  content.push(createLabelValueParagraph("Datum:", data.courtDate || "18/7/2021"));
  content.push(createLabelValueParagraph("Contractnummer:", data.contractNumber || "708545"));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));

  // Ministry of Justice stamp
  content.push(createParagraph("REPUBLIEK JEMEN", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph("Ministerie van Justitie", { bold: true }));
  content.push(createParagraph("Algemene Directie voor Notariële Zaken"));
  content.push(createParagraph("Afdeling Legalisatie"));
  content.push(createLabelValueParagraph("Nummer:", data.justiceNumber || "669"));
  content.push(createLabelValueParagraph("Datum:", data.justiceDate || "/ /"));
  content.push(createLabelValueParagraph("Overeenkomend met:", data.justiceGregorianDate || "15/6/2021"));
  content.push(createParagraph("Het Ministerie van Justitie authenticeert het zegel en de handtekening van de notaris/rechtbank: .................... en de verplichting jegens hen met betrekking tot wat is vastgelegd.", { spacing: { after: 200 } }));

  // Additional stamps - Foreign Affairs
  content.push(createParagraph("Stempel Ministerie van Buitenlandse Zaken:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createParagraph("Ministerie van Buitenlandse Zaken"));
  content.push(createParagraph("En Expats"));
  content.push(createParagraph("Consulaire Afdeling Authenticeert"));
  content.push(createParagraph("De handtekening en het zegel"));
  content.push(createParagraph("Niet verantwoordelijk voor de inhoud van het document.", { italics: true }));
  content.push(createLabelValueParagraph("Nr.:", data.foreignAffairsNumber || "CS81"));
  content.push(createLabelValueParagraph("Datum:", data.foreignAffairsDate || "...................."));
  content.push(createLabelValueParagraph("Handtekening:", "...................."));

  // Notarization info
  content.push(createParagraph("Notariële Informatie:", { bold: true, spacing: { before: 200, after: 100 } }));
  content.push(createLabelValueParagraph("Nummer:", data.notaryNumber || "47"));
  content.push(createLabelValueParagraph("Datum van uitvoering:", data.notaryExecDate || "18/6/"));
  content.push(createLabelValueParagraph("Paginanummer:", data.notaryPageNumber || "CS 618"));
  content.push(createLabelValueParagraph("Kosten:", data.notaryCost || "...................."));

  return content;
}

module.exports = { generateAuthenticationPage };
