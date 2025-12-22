const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

/**
 * Service for extracting and translating document data using Gemini
 */
class GeminiService {
  constructor(apiKey, modelName = 'gemini-3-flash-preview') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    console.log(`   Model: ${modelName}`);
  }

  /**
   * Convert a file to base64
   */
  fileToBase64(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
  }

  /**
   * Get MIME type from file extension
   */
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Extract and translate document data from a PDF
   */
  async extractAndTranslate(pdfPath, sourceLanguage = 'Arabic', targetLanguage = 'Dutch') {
    console.log(`\n🤖 Using Gemini to extract and translate document...`);
    console.log(`   PDF: ${pdfPath}`);
    console.log(`   From: ${sourceLanguage} → To: ${targetLanguage}`);

    const base64Data = this.fileToBase64(pdfPath);
    const mimeType = this.getMimeType(pdfPath);

    const prompt = `You are analyzing official documents that may be in ${sourceLanguage} or another language.
Extract ALL data from these documents and provide a JSON response with the translated content in ${targetLanguage}.

SUPPORTED DOCUMENT TYPES - Identify which types are present and extract data accordingly:

1. Marriage Certificate (وثيقة عقد زواج / Huwelijksakte)
2. Authentication/Legalization pages with stamps
3. Civil Registration (سجل مدني / Burgerlijke Stand)
4. Birth Certificate (شهادة ميلاد / Geboorteakte)
5. Diploma / Degree Certificate (شهادة / Diploma)
6. General Certificate / Attestation (شهادة / Verklaring)
7. Driving License (رخصة قيادة / Rijbewijs)
8. Consular Document (وثيقة قنصلية / Consulair Document)
9. Family Record Book (دفتر عائلة / Familieboekje)
10. Employer Statement (شهادة عمل / Werkgeversverklaring)
11. BRP Extract / Population Register (سجل السكان / Uittreksel Bevolkingsregister)
12. Court Document (وثيقة محكمة / Gerechtelijk Document)
13. Notarial Deed (عقد توثيقي / Notariële Akte)

Return a JSON object with this structure. ONLY include sections for document types that are actually present in the PDF.
Use "...................." for unclear/missing data, "[Leeg]" for explicitly empty fields.

{
  "marriageCertificate": {
    "serialNumber": "", "dayHijri": "", "monthHijri": "", "yearHijri": "", "dateGregorian": "",
    "month": "", "year": "", "notary": "", "notaryId": "", "notaryIdPlace": "", "notaryIdDate": "",
    "waliName": "", "waliFather": "", "brideName": "", "brideFather": "", "brideGrandfather": "", "brideNickname": "",
    "husbandIdType": "", "husbandIdNumber": "", "husbandIdPlace": "", "husbandIdDate": "",
    "husbandBirthDate": "", "husbandBirthCity": "", "husbandBirthDistrict": "", "husbandBirthGov": "",
    "husbandResidence": "", "husbandResGov": "", "husbandNationality": "", "husbandPrevStatus": "",
    "husbandEducation": "", "husbandProfession": "", "husbandMother": "",
    "wifeIdType": "", "wifeIdNumber": "", "wifeIdPlace": "", "wifeIdDate": "",
    "wifeBirthDate": "", "wifeBirthCity": "", "wifeBirthDistrict": "", "wifeBirthGov": "",
    "wifeResidence": "", "wifeResGov": "", "wifeNationality": "", "wifePrevStatus": "",
    "wifeEducation": "", "wifeProfession": "", "wifeMother": "",
    "brotherName": "", "brotherId": "", "brotherIdPlace": "", "brotherIdDate": "",
    "witness1Name": "", "witness1Id": "", "witness1IdPlace": "", "witness1IdDate": "",
    "witness2Name": "", "witness2Id": "", "witness2IdPlace": "", "witness2IdDate": "",
    "registrarName": "", "registrarTitle": ""
  },
  "authentication": {
    "courtName": "", "courtAmount": "", "courtDate": "", "contractNumber": "",
    "justiceNumber": "", "justiceDate": "", "justiceGregorianDate": "",
    "foreignAffairsNumber": "", "foreignAffairsDate": "",
    "notaryNumber": "", "notaryExecDate": "", "notaryPageNumber": "", "notaryCost": ""
  },
  "civilRegistration": {
    "dayInWords": "", "monthInWords": "", "yearInWords": "",
    "neighborhood": "", "district": "", "governorate": "",
    "husbandFullName": "", "husbandBirthDate": "", "husbandBirthCity": "", "husbandBirthDistrict": "", "husbandBirthGov": "",
    "husbandProfession": "", "husbandNationality": "", "husbandReligion": "", "husbandMotherName": "",
    "husbandIdType": "", "husbandIdNumber": "", "husbandIdPlace": "", "husbandIdDate": "", "husbandNationalId": "",
    "wifeFullName": "", "wifeBirthDate": "", "wifeBirthCity": "", "wifeBirthDistrict": "", "wifeBirthGov": "",
    "wifeProfession": "", "wifeNationality": "", "wifeReligion": "", "wifeMotherName": "",
    "wifeIdType": "", "wifeIdNumber": "", "wifeIdPlace": "", "wifeIdDate": "", "wifeNationalId": "",
    "authNumber": "", "authDate": "", "courtName": "",
    "regDistrict": "", "regGovernorate": "", "regDate": "", "civilDirector": "", "registrarName": ""
  },
  "birthCertificate": {
    "newbornFullName": "", "newbornGender": "", "newbornFirstName": "", "fatherName": "", "grandfatherAndFamily": "",
    "birthHourHijri": "", "birthDayHijri": "", "birthMonthHijri": "", "birthYearHijri": "",
    "birthHourGregorian": "", "birthDayGregorian": "", "birthMonthGregorian": "", "birthYearGregorian": "",
    "birthCity": "", "birthDistrict": "", "birthGovernorate": "",
    "fatherFullName": "", "motherFullName": "", "fatherNationalId": "", "motherNationalId": "",
    "birthRegNumber": "", "birthRegId": "", "birthRegDate": "",
    "civilOffice": "", "civilDistrict": "", "civilGovernorate": "", "civilDirector": "", "registrarName": "", "newbornNationalId": ""
  },
  "diploma": {
    "institutionName": "", "institutionAddress": "",
    "holderFullName": "", "holderBirthDate": "", "holderBirthPlace": "",
    "diplomaType": "", "fieldOfStudy": "", "specialization": "", "degreeAwarded": "", "classification": "",
    "issueDate": "", "diplomaSerial": "", "registrationNumber": "",
    "studyStartDate": "", "studyEndDate": "", "rectorName": "", "deanName": ""
  },
  "certificate": {
    "issuingAuthority": "", "authorityAddress": "", "certificateType": "",
    "subjectName": "", "subjectBirthDate": "", "subjectBirthPlace": "", "subjectNationality": "", "subjectIdNumber": "",
    "referenceNumber": "", "certificateContent": "", "purpose": "",
    "issueDate": "", "validUntil": "", "officialName": "", "officialTitle": ""
  },
  "drivingLicense": {
    "issuingCountry": "", "lastName": "", "firstNames": "", "birthDate": "", "birthPlace": "",
    "issueDate": "", "expiryDate": "", "issuingAuthority": "", "licenseNumber": "", "address": "", "nationality": "",
    "category1": "", "category1IssueDate": "", "category1ExpiryDate": "", "category1Restrictions": "",
    "category2": "", "category2IssueDate": "", "category2ExpiryDate": "", "category2Restrictions": "",
    "category3": "", "category3IssueDate": "", "category3ExpiryDate": "", "category3Restrictions": "",
    "bloodGroup": "", "remarks": ""
  },
  "consularDocument": {
    "embassyName": "", "embassyCountry": "", "embassyAddress": "", "documentType": "",
    "subjectName": "", "subjectBirthDate": "", "subjectBirthPlace": "", "subjectNationality": "",
    "passportNumber": "", "currentAddress": "", "content": "", "purpose": "", "attachedDocuments": "",
    "referenceNumber": "", "consularFees": "", "issueDate": "", "validUntil": "",
    "consularOfficer": "", "officerTitle": ""
  },
  "familyRecordBook": {
    "issuingAuthority": "", "issuingPlace": "", "bookNumber": "", "issueDate": "",
    "husbandFullName": "", "husbandBirthDate": "", "husbandBirthPlace": "", "husbandNationality": "",
    "husbandProfession": "", "husbandFatherName": "", "husbandMotherName": "",
    "wifeFullName": "", "wifeBirthDate": "", "wifeBirthPlace": "", "wifeNationality": "",
    "wifeProfession": "", "wifeFatherName": "", "wifeMotherName": "",
    "marriageDate": "", "marriagePlace": "", "marriageCertNumber": "",
    "child1Name": "", "child1BirthDate": "", "child1BirthPlace": "", "child1Gender": "",
    "child2Name": "", "child2BirthDate": "", "child2BirthPlace": "", "child2Gender": "",
    "child3Name": "", "child3BirthDate": "", "child3BirthPlace": "", "child3Gender": "",
    "registrarName": ""
  },
  "employerStatement": {
    "companyName": "", "companyAddress": "", "chamberOfCommerce": "", "statementType": "",
    "employeeName": "", "employeeBirthDate": "", "employeeAddress": "", "employeeNationality": "", "employeeIdNumber": "",
    "jobTitle": "", "department": "", "contractType": "", "startDate": "", "endDate": "",
    "hoursPerWeek": "", "grossSalary": "", "vacationDays": "", "additionalStatement": "", "purpose": "",
    "signatoryName": "", "signatoryTitle": "", "issueDate": ""
  },
  "brpExtract": {
    "issuingAuthority": "", "issuingPlace": "", "extractNumber": "", "issueDate": "",
    "lastName": "", "firstNames": "", "birthDate": "", "birthPlace": "", "birthCountry": "",
    "gender": "", "nationality": "", "maritalStatus": "", "bsnNumber": "",
    "streetAddress": "", "postalCode": "", "city": "", "country": "", "registrationDate": "",
    "fatherName": "", "fatherBirthDate": "", "fatherBirthPlace": "",
    "motherName": "", "motherBirthDate": "", "motherBirthPlace": "",
    "partnerName": "", "partnerBirthDate": "", "marriageDate": "", "officialName": ""
  },
  "courtDocument": {
    "courtName": "", "courtDivision": "", "courtAddress": "", "documentType": "",
    "caseNumber": "", "judgmentDate": "", "caseType": "", "judges": "",
    "plaintiffName": "", "plaintiffAddress": "", "plaintiffLawyer": "",
    "defendantName": "", "defendantAddress": "", "defendantLawyer": "",
    "subjectMatter": "", "decision": "", "grounds": "", "appealInfo": "", "courtCosts": "",
    "clerkName": "", "judgeName": "", "signatureDate": ""
  },
  "notarialDeed": {
    "notaryName": "", "notaryOffice": "", "notaryAddress": "", "deedType": "",
    "repertoireNumber": "", "deedDate": "", "deedPlace": "", "registrationNumber": "",
    "party1Name": "", "party1BirthDate": "", "party1BirthPlace": "", "party1Address": "", "party1IdDocument": "", "party1Capacity": "",
    "party2Name": "", "party2BirthDate": "", "party2BirthPlace": "", "party2Address": "", "party2IdDocument": "", "party2Capacity": "",
    "deedSubject": "", "deedContent": "", "financialAmount": "", "paymentMethod": "",
    "witness1Name": "", "witness2Name": ""
  }
}

IMPORTANT TRANSLATION NOTES for ${targetLanguage}:
- Translate labels and common terms to ${targetLanguage}
- Keep proper names (people's names) in their transliterated form
- For gender: use "Vrouwelijk" (Female) or "Mannelijk" (Male) in Dutch
- For nationality: use appropriate Dutch term (e.g., "Jemenitisch" for Yemeni, "Nederlands" for Dutch)
- For religion: use "Islam", "Christendom", etc.
- For profession "ربة منزل" use "Huisvrouw" (Housewife) in Dutch
- For profession "طالب" use "Student" in Dutch
- For ID type "شخصي" use "Persoonlijk" (Personal) in Dutch
- For ID type "بطاقة عائلية" use "Gezinsboekje" (Family booklet) in Dutch
- For education level use "Gemiddeld" (Medium), "Universitair" (University), "HBO" etc.
- Use "[Leeg]" for empty fields in Dutch
- Translate dates written in words to Dutch (e.g., "Eén" for one, "Januari" for January)
- For contract types: "Vast" (Permanent), "Tijdelijk" (Temporary), "Onbepaalde tijd" (Indefinite)
- For marital status: "Ongehuwd" (Single), "Gehuwd" (Married), "Gescheiden" (Divorced), "Weduwe/Weduwnaar" (Widow/Widower)

Return ONLY the JSON object, no additional text or markdown formatting.
Only include document type sections that are actually present in the PDF - omit sections for documents not found.`;

    try {
      const result = await this.model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        { text: prompt }
      ]);

      const response = await result.response;
      const text = response.text();

      // Clean up the response - remove markdown code blocks if present
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      console.log('   ✅ Gemini extraction complete');

      const documentData = JSON.parse(jsonText);
      return documentData;
    } catch (error) {
      console.error('   ❌ Gemini extraction failed:', error.message);
      throw error;
    }
  }
}

module.exports = { GeminiService };
