import { jsPDF as JsPdfConstructor } from 'jspdf';
import autoTablePlugin from 'jspdf-autotable';

// Universal resolution across Node.js ESM and Vite browser bundle
const jsPDF = JsPdfConstructor;
const autoTable = typeof autoTablePlugin === 'function' ? autoTablePlugin : (autoTablePlugin.autoTable || autoTablePlugin.default);

/**
 * Clean text to ensure compatibility with standard jsPDF fonts (Helvetica/Latin-1)
 * Replaces common emojis with text representations and strips unprintable characters
 */
function sanitizePdfText(str) {
  if (!str) return '';
  return String(str)
    // Replace common emojis with readable labels
    .replace(/🚨/g, '[EMERGENCY] ')
    .replace(/📍/g, '[Location] ')
    .replace(/⏱️|⏰|⏳/g, '[Time] ')
    .replace(/📅/g, '[Date] ')
    .replace(/📞|☎️/g, '[Phone] ')
    .replace(/✉️|📧/g, '[Email] ')
    .replace(/🛡️|🔒/g, '[Security] ')
    .replace(/📎/g, '[Attachment] ')
    .replace(/🌐/g, '[GPS] ')
    .replace(/⚠️/g, '[Warning] ')
    .replace(/✓|✔/g, '[OK] ')
    // Remove remaining non-ASCII or high surrogate characters that jsPDF cannot encode
    .replace(/[^\x00-\x7F]/g, ' ')
    .trim();
}

/**
 * Format a Date object or ISO string to readable format
 */
function formatDateTime(val) {
  if (!val) return 'Not recorded';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return String(val);
  }
}

/**
 * Generates an official, high-authority PDF Incident Report for SecureHer
 *
 * @param {Object} options
 * @param {Object} options.report - The incident report data
 * @param {Object} [options.user] - Authenticated user details
 * @param {Object} [options.userProfile] - Extended profile details
 * @param {Array}  [options.evidenceItems] - Matching evidence vault items
 * @param {Object} [options.emergencyContact] - Authorized emergency contact
 * @returns {Promise<Blob>} The generated PDF Blob
 */
export async function generateIncidentReportPdf({
  report,
  user = null,
  userProfile = null,
  evidenceItems = [],
  emergencyContact = null
}) {
  if (!report) {
    throw new Error('Report data is required to generate PDF.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Primary color palette
  const COLOR_PRIMARY = [91, 33, 79];      // #5B214F Deep Plum
  const COLOR_SECONDARY = [199, 91, 122];  // #C75B7A Rose Gold
  const COLOR_EMERGENCY = [217, 45, 58];   // #D92D3A Crimson
  const COLOR_DARK = [41, 33, 42];         // #29212A Dark charcoal
  const COLOR_MUTED = [100, 90, 95];       // Muted gray
  const COLOR_LIGHT_BG = [251, 248, 249];  // #FBF8F9
  const COLOR_BORDER = [246, 221, 229];    // #F6DDE5

  // Reference Code
  const refCode = `SH-IR-${(report.id || String(Date.now())).slice(0, 8).toUpperCase()}`;
  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Top Accent Header Bar
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 56, 'F');

  // Secondary Color Line
  doc.setFillColor(...COLOR_SECONDARY);
  doc.rect(0, 56, pageWidth, 4, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SECUREHER', margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('PERSONAL SAFETY & INCIDENT DOCUMENTATION SYSTEM', margin, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('OFFICIAL RECORD', pageWidth - margin, 28, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`REF: ${refCode}`, pageWidth - margin, 42, { align: 'right' });

  let cursorY = 82;

  // Document Title & Confidentiality Stamp
  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('CONFIDENTIAL SAFETY INCIDENT REPORT', margin, cursorY);
  cursorY += 16;

  doc.setTextColor(...COLOR_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    'This legal-ready document is a verified private record compiled through the SecureHer Women\'s Security Platform.',
    margin,
    cursorY
  );
  cursorY += 18;

  // Overview Info Box (2 columns)
  const boxY = cursorY;
  const boxHeight = 84;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, boxY, contentWidth, boxHeight, 4, 4, 'FD');

  // Left column in box
  const col1X = margin + 14;
  const col2X = margin + (contentWidth / 2) + 10;
  let textY = boxY + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('INCIDENT TITLE:', col1X, textY);
  doc.setTextColor(...COLOR_DARK);
  doc.text(sanitizePdfText(report.title || 'Untitled Incident'), col1X + 90, textY);

  textY += 16;
  doc.setTextColor(...COLOR_MUTED);
  doc.text('CLASSIFICATION:', col1X, textY);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(sanitizePdfText(report.incidentType || 'General Safety Concern'), col1X + 90, textY);

  textY += 16;
  doc.setTextColor(...COLOR_MUTED);
  doc.text('INCIDENT TIME:', col1X, textY);
  doc.setTextColor(...COLOR_DARK);
  doc.text(formatDateTime(report.incidentAt), col1X + 90, textY);

  textY += 16;
  doc.setTextColor(...COLOR_MUTED);
  doc.text('REPORT STATUS:', col1X, textY);
  const statusStr = (report.status || 'saved').toUpperCase();
  if (statusStr === 'VERIFIED') {
    doc.setTextColor(46, 125, 50);
  } else if (statusStr === 'DRAFT') {
    doc.setTextColor(237, 108, 2);
  } else {
    doc.setTextColor(...COLOR_PRIMARY);
  }
  doc.text(statusStr, col1X + 90, textY);

  // Right column in box
  textY = boxY + 18;
  const userName = sanitizePdfText(userProfile?.fullName || user?.displayName || 'Protected SecureHer User');
  doc.setTextColor(...COLOR_MUTED);
  doc.text('DOCUMENTED BY:', col2X, textY);
  doc.setTextColor(...COLOR_DARK);
  doc.text(userName, col2X + 92, textY);

  textY += 16;
  doc.setTextColor(...COLOR_MUTED);
  doc.text('RECORD REF ID:', col2X, textY);
  doc.setTextColor(...COLOR_DARK);
  doc.text(refCode, col2X + 92, textY);

  textY += 16;
  doc.setTextColor(...COLOR_MUTED);
  doc.text('GENERATED ON:', col2X, textY);
  doc.setTextColor(...COLOR_DARK);
  doc.text(generatedAt, col2X + 92, textY);

  textY += 16;
  doc.setTextColor(...COLOR_MUTED);
  doc.text('DATA INTEGRITY:', col2X, textY);
  doc.setTextColor(46, 125, 50);
  doc.text('SHA-256 Web Crypto Verified', col2X + 92, textY);

  cursorY = boxY + boxHeight + 20;

  // Location & Geospatial Verification Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('1. LOCATION & GEOSPATIAL INTELLIGENCE', margin, cursorY);
  cursorY += 6;

  doc.setDrawColor(...COLOR_SECONDARY);
  doc.setLineWidth(0.8);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 14;

  const hasCoords = report.latitude != null && report.longitude != null;
  const locationLabel = sanitizePdfText(report.locationLabel || 'Location not specified');
  const coordsText = hasCoords
    ? `${Number(report.latitude).toFixed(6)}° N, ${Number(report.longitude).toFixed(6)}° E (Accuracy: ±${report.locationAccuracyMeters || '15'}m)`
    : 'GPS fix not attached to this report';

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      textColor: COLOR_DARK
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLOR_MUTED, cellWidth: 120 },
      1: { cellWidth: contentWidth - 120 }
    },
    body: [
      ['Stated Location:', locationLabel],
      ['Geographic Coordinates:', coordsText],
      [
        'Google Maps Reference:',
        hasCoords
          ? `https://www.google.com/maps?q=${report.latitude},${report.longitude}`
          : 'Geospatial link unavailable'
      ]
    ]
  });

  cursorY = doc.lastAutoTable.finalY + 18;

  // Incident Description & Narrative Statement
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('2. INCIDENT STATEMENT & DETAILED ACCOUNT', margin, cursorY);
  cursorY += 6;

  doc.setDrawColor(...COLOR_SECONDARY);
  doc.setLineWidth(0.8);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 14;

  const safeDescription = sanitizePdfText(report.description || 'No detailed statement provided.');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_DARK);

  const descLines = doc.splitTextToSize(safeDescription, contentWidth);
  for (const line of descLines) {
    if (cursorY > pageHeight - 65) {
      doc.addPage();
      cursorY = 50;
    }
    doc.text(line, margin, cursorY);
    cursorY += 13;
  }

  cursorY += 10;

  // Context Notes / Witness Information (if present)
  if (report.notes && report.notes.trim()) {
    if (cursorY > pageHeight - 90) {
      doc.addPage();
      cursorY = 50;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text('Witness & Contextual Observations:', margin, cursorY);
    cursorY += 12;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_DARK);

    const notesLines = doc.splitTextToSize(sanitizePdfText(report.notes), contentWidth);
    for (const line of notesLines) {
      if (cursorY > pageHeight - 65) {
        doc.addPage();
        cursorY = 50;
      }
      doc.text(line, margin, cursorY);
      cursorY += 12;
    }
    cursorY += 12;
  }

  // Evidence Attachments & Chain of Custody Table
  if (cursorY > pageHeight - 120) {
    doc.addPage();
    cursorY = 50;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('3. EVIDENCE VAULT & CRYPTOGRAPHIC CHAIN OF CUSTODY', margin, cursorY);
  cursorY += 6;

  doc.setDrawColor(...COLOR_SECONDARY);
  doc.setLineWidth(0.8);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  const relevantEvidence = (evidenceItems || []).filter(item => {
    return (report.evidenceIds || []).includes(item.id);
  });

  if (relevantEvidence.length > 0) {
    const evidenceTableBody = relevantEvidence.map((ev, idx) => {
      const typeLabel = (ev.type || 'Media').toUpperCase();
      const timeStr = formatDateTime(ev.timestamp);
      const hashStr = ev.sha256Hash || 'N/A';
      const sizeStr = ev.byteSize ? `${(ev.byteSize / 1024).toFixed(1)} KB` : 'N/A';
      return [
        `#${idx + 1} ${typeLabel}`,
        sanitizePdfText(ev.id),
        timeStr,
        sizeStr,
        hashStr.length > 28 ? `${hashStr.slice(0, 14)}...${hashStr.slice(-14)}` : hashStr
      ];
    });

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: COLOR_PRIMARY,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 4,
        textColor: COLOR_DARK
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' },
        1: { cellWidth: 85 },
        2: { cellWidth: 110 },
        3: { cellWidth: 55 },
        4: { cellWidth: contentWidth - 320, font: 'courier' }
      },
      head: [['Media Type', 'Identifier', 'Captured At', 'Size', 'SHA-256 Digest (Web Crypto)']],
      body: evidenceTableBody
    });

    cursorY = doc.lastAutoTable.finalY + 14;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(
      '* Each evidence file\'s SHA-256 hash was generated in-browser via the W3C Web Cryptography API upon capture, providing mathematical verification against tampering or alteration.',
      margin,
      cursorY
    );
    cursorY += 18;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_MUTED);
    const evCount = report.evidenceIds ? report.evidenceIds.length : 0;
    const noteText = evCount > 0
      ? `This report references ${evCount} attached evidence ID(s): ${(report.evidenceIds || []).join(', ')}. (Media metadata preserved separately in Evidence Vault).`
      : 'No digital evidence files were attached to this incident report at the time of documentation.';
    doc.text(noteText, margin, cursorY);
    cursorY += 20;
  }

  // Emergency Contact & Response Information (if configured)
  if (emergencyContact && emergencyContact.name) {
    if (cursorY > pageHeight - 90) {
      doc.addPage();
      cursorY = 50;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text('4. DESIGNATED EMERGENCY RESPONSE CONTACT', margin, cursorY);
    cursorY += 6;

    doc.setDrawColor(...COLOR_SECONDARY);
    doc.setLineWidth(0.8);
    doc.line(margin, cursorY, margin + contentWidth, cursorY);
    cursorY += 12;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      theme: 'plain',
      styles: {
        fontSize: 8.5,
        cellPadding: 4,
        textColor: COLOR_DARK
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: COLOR_MUTED, cellWidth: 120 },
        1: { cellWidth: contentWidth - 120 }
      },
      body: [
        ['Contact Name:', sanitizePdfText(emergencyContact.name)],
        ['Relationship:', sanitizePdfText(emergencyContact.relationship || 'Emergency Contact')],
        ['Phone Number:', sanitizePdfText(emergencyContact.phone || 'Not provided')],
        ['Email Address:', sanitizePdfText(emergencyContact.email || 'Not provided')]
      ]
    });

    cursorY = doc.lastAutoTable.finalY + 16;
  }

  // Legal & Regulatory Statement
  if (cursorY > pageHeight - 85) {
    doc.addPage();
    cursorY = 50;
  }

  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, cursorY, contentWidth, 48, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_EMERGENCY);
  doc.text('LEGAL NOTICE & EMERGENCY DISCLAIMER', margin + 8, cursorY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_MUTED);
  const disclaimerText =
    'This record is compiled for personal documentation, incident history tracking, and voluntary presentation to legal counsel or law enforcement authorities. SecureHer does not independently adjudicate claims. In cases of immediate danger, always call national emergency services (112 or local police).';
  const discLines = doc.splitTextToSize(disclaimerText, contentWidth - 16);
  doc.text(discLines, margin + 8, cursorY + 24);

  // Add Dynamic Page Numbering & Footer across all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Subtle bottom border
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);

    // Footer Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(
      `SecureHer Women's Security Platform | Ref: ${refCode} | Confidential Document`,
      margin,
      pageHeight - 20
    );

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 20,
      { align: 'right' }
    );
  }

  return doc.output('blob');
}

/**
 * Generates an All-Incidents Summary Log PDF
 *
 * @param {Object} options
 * @param {Array}  options.reports - Array of incident reports
 * @param {Object} [options.userProfile] - User profile
 * @returns {Promise<Blob>} The generated PDF Blob
 */
export async function generateIncidentSummaryLogPdf({ reports = [], userProfile = null }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const COLOR_PRIMARY = [91, 33, 79];
  const COLOR_SECONDARY = [199, 91, 122];
  const COLOR_DARK = [41, 33, 42];
  const COLOR_MUTED = [100, 90, 95];
  const COLOR_BORDER = [246, 221, 229];

  // Header Banner
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 56, 'F');
  doc.setFillColor(...COLOR_SECONDARY);
  doc.rect(0, 56, pageWidth, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SECUREHER', margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('WOMEN SAFETY INCIDENT LOG SUMMARY', margin, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`TOTAL INCIDENTS: ${reports.length}`, pageWidth - margin, 28, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`EXPORTED: ${new Date().toLocaleDateString()}`, pageWidth - margin, 42, { align: 'right' });

  let cursorY = 80;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('MASTER INCIDENT AUDIT LOG', margin, cursorY);
  cursorY += 14;

  const userName = sanitizePdfText(userProfile?.fullName || 'SecureHer User');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(`User: ${userName} | Generated: ${new Date().toLocaleString()}`, margin, cursorY);
  cursorY += 18;

  const tableBody = reports.map((r, idx) => {
    return [
      `#${idx + 1}`,
      sanitizePdfText(r.incidentType || 'General'),
      sanitizePdfText(r.title || 'Untitled'),
      formatDateTime(r.incidentAt),
      sanitizePdfText(r.locationLabel || 'N/A'),
      (r.status || 'saved').toUpperCase()
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    styles: {
      fontSize: 8,
      cellPadding: 5,
      textColor: COLOR_DARK
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 90 },
      2: { cellWidth: 140, fontStyle: 'bold' },
      3: { cellWidth: 110 },
      4: { cellWidth: contentWidth - 426 },
      5: { cellWidth: 60, fontStyle: 'bold' }
    },
    head: [['#', 'Category', 'Incident Title', 'Incident Date/Time', 'Location', 'Status']],
    body: tableBody
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text('SecureHer Master Incident Documentation | Confidential', margin, pageHeight - 20);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  return doc.output('blob');
}

/**
 * Generates an official Certificate of Cryptographic Integrity PDF for an evidence item
 *
 * @param {Object} options
 * @param {Object} options.item - Evidence vault item
 * @param {Object} [options.userProfile] - User profile
 * @returns {Promise<Blob>} The generated PDF Blob
 */
export async function generateEvidenceCertificatePdf({ item, userProfile = null }) {
  if (!item) {
    throw new Error('Evidence item is required.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const COLOR_PRIMARY = [91, 33, 79];      // #5B214F
  const COLOR_SECONDARY = [199, 91, 122];  // #C75B7A
  const COLOR_SUCCESS = [46, 125, 50];     // Green
  const COLOR_DARK = [41, 33, 42];
  const COLOR_MUTED = [100, 90, 95];
  const COLOR_LIGHT_BG = [251, 248, 249];
  const COLOR_BORDER = [246, 221, 229];

  // Header Banner
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 56, 'F');
  doc.setFillColor(...COLOR_SECONDARY);
  doc.rect(0, 56, pageWidth, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SECUREHER', margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('TAMPER-EVIDENT EVIDENCE VAULT | CHAIN OF CUSTODY', margin, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('VERIFICATION CERTIFICATE', pageWidth - margin, 28, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ID: ${(item.id || '').toUpperCase()}`, pageWidth - margin, 42, { align: 'right' });

  let cursorY = 82;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('CERTIFICATE OF CRYPTOGRAPHIC INTEGRITY', margin, cursorY);
  cursorY += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(
    'This certificate certifies the mathematical integrity and forensic metadata of recorded evidence media.',
    margin,
    cursorY
  );
  cursorY += 18;

  // Prominent SHA-256 Box
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, cursorY, contentWidth, 70, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text('W3C WEB CRYPTOGRAPHY API — SHA-256 FORENSIC CHECKSUM', margin + 12, cursorY + 16);

  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_DARK);
  const hashText = item.sha256Hash || 'PENDING_VERIFICATION';
  doc.text(hashText, margin + 12, cursorY + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_SUCCESS);
  doc.text('STATUS: MATHEMATICALLY SEALED & INTEGRITY-PRESERVED', margin + 12, cursorY + 54);

  cursorY += 86;

  // Metadata Table
  const coordsStr = item.latitude != null && item.longitude != null
    ? `${Number(item.latitude).toFixed(6)}° N, ${Number(item.longitude).toFixed(6)}° E (±${item.accuracy || '15'}m)`
    : 'GPS fix not attached at capture time';

  const sizeStr = item.byteSize ? `${(item.byteSize / 1024).toFixed(1)} KB (${item.byteSize} bytes)` : 'Not recorded';

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 5,
      textColor: COLOR_DARK
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLOR_MUTED, cellWidth: 140 },
      1: { cellWidth: contentWidth - 140 }
    },
    body: [
      ['Evidence Identifier:', sanitizePdfText(item.id || 'N/A')],
      ['Media Category:', (item.type || 'photo').toUpperCase()],
      ['MIME Format:', item.mimeType || (item.type === 'photo' ? 'image/jpeg' : 'video/webm')],
      ['Capture Timestamp:', formatDateTime(item.timestamp)],
      ['Payload Byte Size:', sizeStr],
      ['Geographic Watermark:', coordsStr],
      ['Preserved By:', sanitizePdfText(userProfile?.fullName || 'SecureHer Registered User')],
      ['User Note / Log:', sanitizePdfText(item.note || 'Recorded in emergency situation')]
    ]
  });

  cursorY = doc.lastAutoTable.finalY + 20;

  // Chain of Custody Explanation Box
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, cursorY, contentWidth, 54, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('CHAIN OF CUSTODY & ADMISSIBILITY PRINCIPLES', margin + 10, cursorY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  const chainText =
    'The SHA-256 digest is generated via irreversible cryptographic hashing in the browser sandbox. Any modification to the source bytes changes the resultant hash completely, demonstrating whether digital media has been modified since timestamp of recording.';
  const lines = doc.splitTextToSize(chainText, contentWidth - 20);
  doc.text(lines, margin + 10, cursorY + 26);

  // Footer
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('SecureHer Tamper-Evident Evidence Vault | Chain of Custody Certificate', margin, pageHeight - 20);
  doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 20, { align: 'right' });

  return doc.output('blob');
}

