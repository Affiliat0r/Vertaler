// Existing document generators
const { generateMarriageCertificate } = require('./marriageCertificate');
const { generateAuthenticationPage } = require('./authenticationPage');
const { generateCivilRegistration } = require('./civilRegistration');
const { generateBirthCertificate } = require('./birthCertificate');

// New document generators
const { generateDiploma } = require('./diploma');
const { generateCertificate } = require('./certificate');
const { generateDrivingLicense } = require('./drivingLicense');
const { generateConsularDocument } = require('./consularDocument');
const { generateFamilyRecordBook } = require('./familyRecordBook');
const { generateEmployerStatement } = require('./employerStatement');
const { generateBrpExtract } = require('./brpExtract');
const { generateCourtDocument } = require('./courtDocument');
const { generateNotarialDeed } = require('./notarialDeed');

module.exports = {
  // Existing
  generateMarriageCertificate,
  generateAuthenticationPage,
  generateCivilRegistration,
  generateBirthCertificate,

  // New document types
  generateDiploma,
  generateCertificate,
  generateDrivingLicense,
  generateConsularDocument,
  generateFamilyRecordBook,
  generateEmployerStatement,
  generateBrpExtract,
  generateCourtDocument,
  generateNotarialDeed
};
