import { VerificationResult, DocumentCategory, DocumentType, VerificationStatus } from '../types';
import { INITIAL_VERIFICATIONS } from '../data/mockData';

// Generate simulated SHA-256
export async function computeFileHash(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback pseudo-hash
    let str = file.name + file.size + file.lastModified;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}

export interface VerificationProgressStep {
  step: number;
  title: string;
  detail: string;
  durationMs: number;
}

export const VERIFICATION_STAGES: VerificationProgressStep[] = [
  {
    step: 1,
    title: 'Document Uploaded',
    detail: 'Secure ingestion completed; computing SHA-256 cryptographic digest & registering payload...',
    durationMs: 500
  },
  {
    step: 2,
    title: 'Preprocessing & Enhancement',
    detail: 'Evaluating blurriness, contrast ratio, skew angle (0.4°), and auto-normalizing image boundaries...',
    durationMs: 650
  },
  {
    step: 3,
    title: 'Tesseract OCR Text Extraction',
    detail: 'Executing Tesseract neural OCR engine; extracting text blocks, tokens, and per-word confidence metrics...',
    durationMs: 800
  },
  {
    step: 4,
    title: 'AI Document Classification',
    detail: 'Multimodal semantic classification verifying document category, template layout, and required statutory fields...',
    durationMs: 650
  },
  {
    step: 5,
    title: 'Anomaly & Tampering Detection',
    detail: 'Executing Error Level Analysis (ELA), font kerning integrity, seal contour analysis, and digital cloning inspection...',
    durationMs: 850
  },
  {
    step: 6,
    title: 'Field Consistency Validation',
    detail: 'Cross-validating mathematical marks/percentage arithmetic, chronological date order, and entity schema checksums...',
    durationMs: 600
  },
  {
    step: 7,
    title: 'Reference Database Check',
    detail: 'Querying authoritative reference registry; matching against authorized baseline records...',
    durationMs: 700
  },
  {
    step: 8,
    title: 'Final Verification Report',
    detail: 'Synthesizing composite confidence score, aggregating findings, and issuing tamper-evident audit certificate...',
    durationMs: 500
  }
];

export function generateCustomVerification(
  file: { name: string; size: number; url?: string },
  category: DocumentCategory,
  documentType: DocumentType,
  fileHash: string,
  forceOutcome?: VerificationStatus
): VerificationResult {
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const docId = `DOC-2026-${randomSuffix}`;

  // If user uploaded a file containing "tamper", "fake", "bad", "forged" in name, or if forced
  const lowerName = file.name.toLowerCase();
  let status: VerificationStatus = 'Verified';
  let confidenceScore = 98.4;

  if (forceOutcome) {
    status = forceOutcome;
    confidenceScore =
      forceOutcome === 'Verified' ? 99.1 :
      forceOutcome === 'Suspicious' ? 62.5 :
      forceOutcome === 'Failed' ? 28.4 : 76.8;
  } else if (lowerName.includes('tamper') || lowerName.includes('edit') || lowerName.includes('suspicious')) {
    status = 'Suspicious';
    confidenceScore = 63.8;
  } else if (lowerName.includes('fake') || lowerName.includes('forged') || lowerName.includes('fail')) {
    status = 'Failed';
    confidenceScore = 32.1;
  } else if (lowerName.includes('scan') || lowerName.includes('review') || lowerName.includes('fold')) {
    status = 'Manual Review Required';
    confidenceScore = 77.2;
  } else {
    // Default 85% chance verified, 15% manual review for realistic demo
    const rand = Math.random();
    if (rand > 0.88) {
      status = 'Manual Review Required';
      confidenceScore = 79.5;
    } else {
      status = 'Verified';
      confidenceScore = 97.8 + Math.floor(Math.random() * 20) / 10;
    }
  }

  // Generate customized extracted fields based on document type
  const extractedData: Record<string, string> = {};
  if (category === 'government') {
    if (documentType === 'Aadhaar Card') {
      extractedData['Holder Full Name'] = 'Aarav Dev Sharma';
      extractedData['Aadhaar Number'] = 'XXXX-XXXX-6729';
      extractedData['Date of Birth'] = '22/04/1999';
      extractedData['Gender'] = 'Male';
      extractedData['Issuing Authority'] = 'Unique Identification Authority of India (UIDAI)';
      extractedData['Masking Compliance'] = 'First 8 Digits Redacted (Compliant)';
      extractedData['QR Code Verification'] = status === 'Failed' ? 'Checksum Failed' : 'Verified Cryptographic Token';
    } else if (documentType === 'PAN Card') {
      extractedData['Permanent Account Number'] = 'BRPPS' + Math.floor(1000 + Math.random() * 9000) + 'E';
      extractedData['Cardholder Name'] = 'Priyanka Sen';
      extractedData['Father\'s Name'] = 'Alok Sen';
      extractedData['Date of Birth'] = status === 'Suspicious' ? '12/09/1997 (Altered Pixels)' : '12/09/1997';
      extractedData['Tax Department Stamp'] = 'Govt. of India Income Tax Dept.';
      extractedData['Entity Classifier'] = 'Individual (P)';
    } else if (documentType === 'Income Certificate') {
      extractedData['Applicant Name'] = 'Rohan Manoj Patil';
      extractedData['Certificate Serial'] = 'INC/MH/2026/' + Math.floor(100000 + Math.random() * 900000);
      extractedData['Annual Family Income'] = 'INR 1,80,000 (One Lakh Eighty Thousand Only)';
      extractedData['Issuing Officer'] = 'Tehsildar & Taluka Magistrate';
      extractedData['Financial Year'] = '2025 - 2026';
    } else if (documentType === 'Caste Certificate') {
      extractedData['Certificate Holder'] = 'Kavita Suresh Gond';
      extractedData['Category'] = 'Scheduled Tribe (ST) - Gond';
      extractedData['District & State'] = 'Nagpur, Maharashtra';
      extractedData['Order / Gazette Ref'] = 'Govt. Order No. ST-882/CR-91';
      extractedData['Issuing Authority'] = 'Sub-Divisional Magistrate';
    } else {
      extractedData['Applicant Name'] = 'Vikas Rajendra Rao';
      extractedData['Domicile Token'] = 'DOM/KA/2026/' + Math.floor(10000 + Math.random() * 90000);
      extractedData['State of Residence'] = 'Karnataka (15+ Years continuous residence)';
      extractedData['Issuing Authority'] = 'Assistant Commissioner, Revenue Division';
    }
  } else {
    // Educational
    if (documentType === 'Marksheet') {
      extractedData['Student Name'] = 'Ananya Siddharth Roy';
      extractedData['Examination Board'] = 'Council for the Indian School Certificate Examinations (CISCE)';
      extractedData['Roll Number'] = 'ICSE-2024-' + Math.floor(100000 + Math.random() * 900000);
      extractedData['Total Percentage'] = '93.6%';
      extractedData['Result Status'] = 'PASS - First Division';
    } else if (documentType === 'Degree Certificate') {
      extractedData['Graduate Name'] = 'Vikramaditya Chauhan';
      extractedData['Degree Conferred'] = 'Bachelor of Science (Honours) in Data Science';
      extractedData['University Name'] = 'Delhi Technological University (DTU)';
      extractedData['Graduation Date'] = 'July 2025';
      extractedData['Division'] = 'First Class with Distinction';
    } else if (documentType === 'Diploma Certificate') {
      extractedData['Candidate Name'] = 'Nikhil Ramesh Jadhav';
      extractedData['Polytechnic Diploma'] = 'Diploma in Mechanical Engineering';
      extractedData['Board of Technical Education'] = 'MSBTE Mumbai';
      extractedData['Percentage Aggregate'] = '82.4%';
    } else if (documentType === 'School Leaving Certificate') {
      extractedData['Pupil Name'] = 'Isha Nandkishore Joshi';
      extractedData['General Register No.'] = 'GR-88421';
      extractedData['Date of Admission'] = '15/06/2014';
      extractedData['Date of Leaving'] = '31/03/2024';
      extractedData['Reason for Leaving'] = 'Completed Higher Secondary Studies';
    } else {
      extractedData['Candidate Name'] = 'Karan Jayesh Parekh';
      extractedData['Certificate Type'] = 'Official Bonafide & Migration Certificate';
      extractedData['Enrollment Serial'] = 'UNIV-MIG-2026-9041';
      extractedData['Issuing Registrar'] = 'Office of Academic Affairs & Admissions';
    }
  }

  // Quality Assessment
  const quality = {
    resolution: status === 'Manual Review Required' ? '220 DPI (Sub-optimal)' : '400+ DPI (Crisp)',
    contrast: status === 'Manual Review Required' ? '74%' : '96%',
    glare: status === 'Manual Review Required' ? 'Detected on bottom margin' : 'None Detected',
    skew: status === 'Manual Review Required' ? '3.8°' : '0.4°',
    score: status === 'Verified' ? 95 : status === 'Manual Review Required' ? 72 : 60
  };

  // Tampering Indicators
  const tamperingIndicators = [
    {
      name: 'Pixel Grid Re-compression (ELA)',
      description: status === 'Suspicious'
        ? 'Localized high-frequency artifacts around name and date regions indicate modification.'
        : status === 'Failed'
        ? 'Massive JPEG block discontinuities throughout certificate header and seal.'
        : 'Uniform compression levels across all text and border regions. No digital patches detected.',
      severity: (status === 'Suspicious' ? 'critical' : status === 'Failed' ? 'critical' : 'safe') as any,
      detected: status === 'Suspicious' || status === 'Failed',
      coordinates: status === 'Suspicious' ? { x: 35, y: 48, w: 30, h: 10 } : undefined
    },
    {
      name: 'Font Geometry & Kerning Consistency',
      description: status === 'Suspicious'
        ? 'Typographic baseline shift of 1.4pt detected on numeric date characters.'
        : 'Glyph metrics align with issuing authority certified typography specifications.',
      severity: (status === 'Suspicious' ? 'moderate' : 'safe') as any,
      detected: status === 'Suspicious'
    },
    {
      name: 'Emblem & Security Stamp Integrity',
      description: status === 'Failed'
        ? 'Embossed seal pattern absent; digital bitmap copy detected with low vector resolution.'
        : status === 'Manual Review Required'
        ? 'Physical stamp faint due to lighting angle; requires inspector eye confirmation.'
        : 'Official government emblem / university seal authenticated with intact micro-contours.',
      severity: (status === 'Failed' ? 'critical' : status === 'Manual Review Required' ? 'low' : 'safe') as any,
      detected: status === 'Failed' || status === 'Manual Review Required'
    }
  ];

  // Field Consistency
  const fieldConsistencyChecks = [
    {
      field: 'Entity Identifier Syntax',
      expected: 'Standard National Schema',
      found: 'Compliant Format',
      match: true,
      note: 'Serial and alphanumeric structure corresponds to issuing authority patterns.'
    },
    {
      field: 'Chronological Timeline',
      expected: 'Valid issue sequence',
      found: status === 'Suspicious' ? 'Anomalous DOB sequence' : 'Logical chronological flow',
      match: status !== 'Suspicious' && status !== 'Failed',
      note: status === 'Suspicious' ? 'Cross-field chronology mismatch flagged' : 'Dates and session milestones verify logically'
    },
    {
      field: 'QR / Barcode Digest Alignment',
      expected: 'Payload matches visual OCR',
      found: status === 'Failed' ? 'QR Hash Unmatched' : status === 'Manual Review Required' ? 'Partially Occluded' : '100% Match',
      match: status === 'Verified',
      note: status === 'Verified' ? 'Visual OCR text is byte-for-byte identical to secure barcode payload' : 'Discrepancy or physical fold detected'
    }
  ];

  // Reference comparison
  const referenceComparison = {
    database: category === 'government' ? 'Simulated DigiLocker / State e-District Sandbox' : 'Simulated National Academic Depository (NAD)',
    matchScore: status === 'Verified' ? 99.4 : status === 'Manual Review Required' ? 82.0 : status === 'Suspicious' ? 54.0 : 18.0,
    status: (status === 'Verified' ? 'Matched' : status === 'Manual Review Required' ? 'Partial Match' : status === 'Suspicious' ? 'Record Mismatch' : 'Record Mismatch') as any,
    referenceId: `SIM-REF-${category.toUpperCase().substring(0, 3)}-${randomSuffix}`,
    timestamp: dateStr
  };

  // Compliance items
  const complianceChecklist = [
    { rule: 'Information Technology Act 2000', standard: 'Section 4 (Legal recognition of electronic records)', passed: status !== 'Failed', comment: 'Electronic format requirements' },
    { rule: 'Digital Privacy & PII Redaction', standard: 'Masking of Aadhaar/Identity prefix', passed: true, comment: 'Confidentiality standards observed' },
    { rule: 'Anti-Spoofing & Liveness Test', standard: 'Physical original vs printed photocopy vs screen capture', passed: status !== 'Failed', comment: status === 'Failed' ? 'Suspected screen capture replay' : 'Document passed liveness checks' }
  ];

  // Issues detected
  const issuesDetected = [];
  if (status === 'Suspicious') {
    issuesDetected.push({
      title: 'Potential Digital Alteration in Numeric Field',
      severity: 'critical' as const,
      description: 'Error Level Analysis reveals pixel tampering around key date or identifier digits.',
      recommendation: 'Request candidate to produce original physical certificate or authenticate via DigiLocker API.'
    });
  } else if (status === 'Failed') {
    issuesDetected.push({
      title: 'Counterfeit Graphic / Unverified Credentials',
      severity: 'critical' as const,
      description: 'Document lacks requisite holographic security elements and fails institutional registry checksum.',
      recommendation: 'Reject document clearance immediately and escalate to compliance grievance cell.'
    });
  } else if (status === 'Manual Review Required') {
    issuesDetected.push({
      title: 'Low Scan Contrast / Obscured Security Line',
      severity: 'low' as const,
      description: 'Physical fold or glare prevents 100% automated OCR confidence on secondary stamp.',
      recommendation: 'Officer visual confirmation advised before final approval.'
    });
  }

  // Recommendations
  const recommendations = [];
  if (status === 'Verified') {
    recommendations.push('Document successfully authenticated with high confidence (98%+).');
    recommendations.push('Cleared for automated admissions, job onboarding, or government welfare verification.');
    recommendations.push('Audit hash recorded for immutable audit trail compliance.');
  } else if (status === 'Suspicious') {
    recommendations.push('Do not accept without secondary physical verification.');
    recommendations.push('Initiate applicant query notice citing ELA manipulation findings.');
  } else if (status === 'Failed') {
    recommendations.push('Immediate rejection recommended. Flagged in institution fraud registry.');
  } else {
    recommendations.push('Forward to Tier-2 verifier queue for 60-second manual cross-inspection.');
  }

  return {
    id: docId,
    documentName: file.name,
    category,
    documentType,
    uploadDate: dateStr,
    status,
    confidenceScore,
    hashSha256: fileHash,
    extractedData,
    qualityAssessment: quality,
    tamperingIndicators,
    fieldConsistencyChecks,
    referenceComparison,
    complianceChecklist,
    issuesDetected,
    recommendations,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    filePreviewUrl: file.url
  };
}

export function getStatusColor(status: VerificationStatus): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (status) {
    case 'Verified':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500'
      };
    case 'Suspicious':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        dot: 'bg-amber-500'
      };
    case 'Failed':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        dot: 'bg-rose-500'
      };
    case 'Manual Review Required':
    default:
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-800',
        border: 'border-sky-200',
        badge: 'bg-sky-100 text-sky-900 border-sky-300',
        dot: 'bg-sky-500'
      };
  }
}
