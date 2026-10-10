import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateIncidentReportPdf,
  generateIncidentSummaryLogPdf,
  generateEvidenceCertificatePdf
} from './src/services/pdf/incidentReportPdfService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTests() {
  console.log('--- STARTING SECUREHER PDF GENERATION AUDIT & TESTS ---');

  const testOutputDir = path.join(__dirname, 'test_output_pdfs');
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }

  // TEST CASE 1: Standard Realistic Incident Report with Attached Evidence and Contacts
  console.log('\n[TEST 1] Testing standard realistic incident report...');
  const sampleReport1 = {
    id: 'inc_84920412',
    title: 'Followed by Suspicious Individual near Metro Station',
    incidentType: 'Stalking',
    incidentAt: '2026-10-09T18:45:00.000Z',
    locationLabel: 'MG Road Metro Station, Exit 3, Bengaluru',
    latitude: 12.97561,
    longitude: 77.60662,
    locationAccuracyMeters: 8,
    description: 'While walking from Exit 3 of the metro station towards the auto stand, an unidentified male in a dark jacket began following closely at an uncomfortable distance. When I crossed the street, the individual crossed as well and accelerated their pace. I entered a nearby pharmacy to stay in a well-lit public space with people.',
    notes: 'Pharmacist and another customer observed the individual waiting outside on the sidewalk for approximately 10 minutes before departing in an unregistered vehicle.',
    evidenceIds: ['ev_photo_101', 'ev_video_102'],
    status: 'verified'
  };

  const sampleUser = {
    uid: 'user_secure_007',
    displayName: 'Priya Sharma',
    email: 'priya.sharma@example.com'
  };

  const sampleProfile = {
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210'
  };

  const sampleEvidence = [
    {
      id: 'ev_photo_101',
      type: 'photo',
      mimeType: 'image/jpeg',
      byteSize: 245120,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      timestamp: '2026-10-09T18:48:12.000Z'
    },
    {
      id: 'ev_video_102',
      type: 'video',
      mimeType: 'video/webm',
      byteSize: 1845120,
      sha256Hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      timestamp: '2026-10-09T18:50:44.000Z'
    }
  ];

  const sampleContact = {
    name: 'Anjali Sharma',
    relationship: 'Sister',
    phone: '+91 98765 99999',
    email: 'anjali.s@example.com'
  };

  const blob1 = await generateIncidentReportPdf({
    report: sampleReport1,
    user: sampleUser,
    userProfile: sampleProfile,
    evidenceItems: sampleEvidence,
    emergencyContact: sampleContact
  });

  const buffer1 = Buffer.from(await blob1.arrayBuffer());
  const file1Path = path.join(testOutputDir, 'Test_Report_Standard.pdf');
  fs.writeFileSync(file1Path, buffer1);

  const header1 = buffer1.slice(0, 5).toString('ascii');
  if (header1 !== '%PDF-') throw new Error(`Generated file 1 does not start with PDF magic header: ${header1}`);
  console.log(`✓ Test 1 Passed! Size: ${buffer1.length} bytes, saved to ${file1Path}`);

  // TEST CASE 2: Multi-Page Long Account with Special Characters & Emojis
  console.log('\n[TEST 2] Testing multi-page long description with emojis and special characters...');
  const longParagraph = 'This is an extensive narrative detailing a prolonged stalking and intimidation occurrence over multiple days. '.repeat(15);
  const sampleReport2 = {
    id: 'inc_long_99182',
    title: '🚨 Harassment Incident with Extended Narrative & Quotes "Special" & \'Symbols\'',
    incidentType: 'Harassment',
    incidentAt: new Date().toISOString(),
    locationLabel: 'Indiranagar 100ft Road, near Café Coffee Day 📍',
    latitude: 12.97189,
    longitude: 77.64115,
    description: `${longParagraph}\n\nAdditional details:\n${longParagraph}\n\nConclusion of statement with timestamps: 10:30 PM, 11:15 PM.`,
    notes: 'Witness remarks recorded by nearby shopkeeper: "He was lingering by the ATM for over an hour." '.repeat(6),
    evidenceIds: [],
    status: 'draft'
  };

  const blob2 = await generateIncidentReportPdf({
    report: sampleReport2,
    user: sampleUser,
    userProfile: sampleProfile
  });
  const buffer2 = Buffer.from(await blob2.arrayBuffer());
  const file2Path = path.join(testOutputDir, 'Test_Report_MultiPage_Long.pdf');
  fs.writeFileSync(file2Path, buffer2);
  console.log(`✓ Test 2 Passed! Multi-page PDF generated cleanly, Size: ${buffer2.length} bytes`);

  // TEST CASE 3: Minimal Report with Missing Optional Fields (No GPS, no notes, no evidence, anonymous)
  console.log('\n[TEST 3] Testing minimal report with missing optional fields...');
  const minimalReport = {
    id: 'inc_min_001',
    title: 'Verbal Threat',
    incidentType: 'Threats',
    incidentAt: '2026-10-08T12:00:00.000Z',
    description: 'Brief verbal threat encountered.',
    status: 'saved'
  };

  const blob3 = await generateIncidentReportPdf({
    report: minimalReport
  });
  const buffer3 = Buffer.from(await blob3.arrayBuffer());
  const file3Path = path.join(testOutputDir, 'Test_Report_Minimal.pdf');
  fs.writeFileSync(file3Path, buffer3);
  console.log(`✓ Test 3 Passed! Handled missing GPS, contacts, notes gracefully, Size: ${buffer3.length} bytes`);

  // TEST CASE 4: Master All-Incidents Summary Log PDF
  console.log('\n[TEST 4] Testing Master Incident Audit Log PDF...');
  const blobSummary = await generateIncidentSummaryLogPdf({
    reports: [sampleReport1, sampleReport2, minimalReport],
    userProfile: sampleProfile
  });
  const bufferSummary = Buffer.from(await blobSummary.arrayBuffer());
  const fileSummaryPath = path.join(testOutputDir, 'Test_Master_Summary_Log.pdf');
  fs.writeFileSync(fileSummaryPath, bufferSummary);
  console.log(`✓ Test 4 Passed! Summary Log PDF created, Size: ${bufferSummary.length} bytes`);

  // TEST CASE 5: Evidence Chain of Custody Certificate PDF
  console.log('\n[TEST 5] Testing Cryptographic Chain of Custody Certificate PDF...');
  const blobCert = await generateEvidenceCertificatePdf({
    item: {
      id: 'ev_cert_7721',
      type: 'photo',
      mimeType: 'image/jpeg',
      byteSize: 521400,
      sha256Hash: '4a53c3918126e07341926639206f654b90cf0bfa2e9ed940f90e1debc4c8f135',
      timestamp: new Date().toISOString(),
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 6,
      note: 'Captured suspect license plate on arrival'
    },
    userProfile: sampleProfile
  });
  const bufferCert = Buffer.from(await blobCert.arrayBuffer());
  const fileCertPath = path.join(testOutputDir, 'Test_Evidence_Certificate.pdf');
  fs.writeFileSync(fileCertPath, bufferCert);
  console.log(`✓ Test 5 Passed! Forensic Certificate PDF generated, Size: ${bufferCert.length} bytes`);

  console.log('\n=== ALL 5 PDF TEST SCENARIOS PASSED WITH ZERO ERRORS ===\n');
}

runTests().catch((err) => {
  console.error('FATAL TEST ERROR:', err);
  process.exit(1);
});
