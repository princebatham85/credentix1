import { VerificationResult, DocumentCategory, DocumentType } from '../types';

export const INITIAL_VERIFICATIONS: VerificationResult[] = [
  {
    id: 'DOC-2026-9481',
    documentName: 'Aadhaar_Card_E-Kyc_Rajesh_Kumar.pdf',
    category: 'government',
    documentType: 'Aadhaar Card',
    uploadDate: '2026-10-29 14:32:10',
    status: 'Verified',
    confidenceScore: 99.2,
    hashSha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    extractedData: {
      'Cardholder Name': 'Rajesh Kumar Sharma',
      'Aadhaar Number': 'XXXX-XXXX-4891',
      'Date of Birth': '14/08/1998',
      'Gender': 'Male',
      'Address': 'Flat 402, Shanti Heights, Sector 14, Gurugram, Haryana - 122001',
      'UIDAI Digital Signature': 'Valid & Timestamped (NIC CA 2022)',
      'QR Code Checksum': 'Cryptographically Valid (SHA-256)',
      'Issue / Generation Date': '2024-03-12'
    },
    qualityAssessment: {
      resolution: '450 DPI (High Fidelity)',
      contrast: '98% (Optimal)',
      glare: 'None Detected',
      skew: '0.2° (Perfect Alignment)',
      score: 97
    },
    tamperingIndicators: [
      {
        name: 'Pixel Grid Consistency (ELA)',
        description: 'Error Level Analysis reveals homogeneous JPEG compression across all text blocks.',
        severity: 'safe',
        detected: false
      },
      {
        name: 'Micro-print Security Line',
        description: 'Micro-text "GOVERNMENT OF INDIA" intact without blurring or digital erasure.',
        severity: 'safe',
        detected: false
      },
      {
        name: 'Font Family & Glyph Kerning',
        description: 'TrueType font metrics match official UIDAI Aadhaar standard typography.',
        severity: 'safe',
        detected: false
      }
    ],
    fieldConsistencyChecks: [
      { field: 'DOB vs Age', expected: '28 years', found: '28 years', match: true, note: 'Age aligns with stated DOB' },
      { field: 'Verhoeff Checksum', expected: 'Valid parity bit', found: 'Valid parity bit', match: true, note: '12-digit Aadhaar math passes Verhoeff algorithm' },
      { field: 'QR vs OCR Content', expected: 'Name & DOB match', found: 'Name & DOB match', match: true, note: 'Secure QR payload matches printed OCR text' }
    ],
    referenceComparison: {
      database: 'Simulated UIDAI e-KYC Vault (Demo Sandbox)',
      matchScore: 99.8,
      status: 'Matched',
      referenceId: 'UIDAI-DEMO-KYC-991204',
      timestamp: '2026-10-29 14:32:15'
    },
    complianceChecklist: [
      { rule: 'Aadhaar Redaction Rule', standard: 'Masked first 8 digits compliance', passed: true, comment: 'First 8 digits securely redacted' },
      { rule: 'Digital Signature Integrity', standard: 'IT Act 2000 Section 3A', passed: true, comment: 'Valid digital certificate chain' },
      { rule: 'Format Standards', standard: 'e-Aadhaar v3.0 Specification', passed: true, comment: 'Document layout matches standard schema' }
    ],
    issuesDetected: [],
    recommendations: [
      'Document authenticated successfully. Safe for automated student enrollment & onboarding.',
      'Cryptographic signature verified against simulated national identity repository.'
    ],
    fileSize: '1.4 MB'
  },
  {
    id: 'DOC-2026-8832',
    documentName: 'PAN_Card_Scanned_Amit_Verma.jpg',
    category: 'government',
    documentType: 'PAN Card',
    uploadDate: '2026-10-29 11:15:44',
    status: 'Suspicious',
    confidenceScore: 61.4,
    hashSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    extractedData: {
      'Permanent Account Number': 'ABC PV 8921 K',
      'Cardholder Name': 'Amit Verma',
      'Father\'s Name': 'Ramesh Chandra Verma',
      'Date of Birth': '05/11/1995 (Anomalous)',
      'Income Tax Dept Seal': 'Blurred / Possible Copy-Paste',
      'Hologram Integrity': 'Low Contrast Artifacts'
    },
    qualityAssessment: {
      resolution: '200 DPI (Borderline)',
      contrast: '72% (Uneven Lighting)',
      glare: 'Moderate reflection on laminate edge',
      skew: '3.4° Tilt',
      score: 68
    },
    tamperingIndicators: [
      {
        name: 'Date of Birth Field Tampering',
        description: 'Significant pixel compression variance detected around "05/11/1995". High probability of image manipulation/patching.',
        severity: 'critical',
        detected: true,
        coordinates: { x: 42, y: 58, w: 28, h: 8 }
      },
      {
        name: 'Font Weight Inconsistency',
        description: 'The font weight of the birth year differs by 24% from adjacent cardholder text fields.',
        severity: 'moderate',
        detected: true,
        coordinates: { x: 55, y: 58, w: 15, h: 7 }
      },
      {
        name: 'Guilloche Security Pattern Broken',
        description: 'The fine background guilloche lines disappear directly behind the birth date block.',
        severity: 'critical',
        detected: true,
        coordinates: { x: 40, y: 56, w: 32, h: 12 }
      }
    ],
    fieldConsistencyChecks: [
      { field: 'PAN Structure Format', expected: '5 Alpha + 4 Num + 1 Alpha', found: 'ABCPV8921K', match: true, note: 'Format is syntactically valid' },
      { field: '4th Character Entity Check', expected: 'P (Individual)', found: 'P', match: true, note: 'Designates individual' },
      { field: 'DOB vs Tax Filing Baseline', expected: '05/11/1990', found: '05/11/1995', match: false, note: '5-year discrepancy flagged against simulated record' }
    ],
    referenceComparison: {
      database: 'Simulated NSDL / UTIITSL Demo Registry',
      matchScore: 58.2,
      status: 'Partial Match',
      referenceId: 'PAN-NSDL-REF-8472',
      timestamp: '2026-10-29 11:15:50'
    },
    complianceChecklist: [
      { rule: 'CBDT PAN Specification', standard: 'Standard Form 49A/49AA', passed: false, comment: 'Font anomaly in Date of Birth section' },
      { rule: 'Anti-Tamper Background', standard: 'Continuous background printing', passed: false, comment: 'Guilloche pattern ruptured' },
      { rule: 'Resolution Minimum', standard: '>= 300 DPI for legal verification', passed: false, comment: 'Uploaded at 200 DPI' }
    ],
    issuesDetected: [
      {
        title: 'Digital Modification of Date of Birth',
        severity: 'critical',
        description: 'High confidence ELA artifact indicates the date digits were cloned or overwritten using editing software.',
        recommendation: 'Reject automated clearance and request original physical card verification.'
      },
      {
        title: 'Background Pattern Discontinuity',
        severity: 'moderate',
        description: 'Micro-guilloche waves have been smoothed out over an area of 140x60 pixels.',
        recommendation: 'Request high-resolution flatbed scanner copy.'
      }
    ],
    recommendations: [
      'FLAGGED FOR INVESTIGATION: Do NOT accept for bank account opening or academic admission.',
      'Require the applicant to produce original document or provide Digilocker-verified XML.'
    ],
    fileSize: '820 KB'
  },
  {
    id: 'DOC-2026-7719',
    documentName: 'BTech_Degree_Certificate_Pooja_Mehta.pdf',
    category: 'educational',
    documentType: 'Degree Certificate',
    uploadDate: '2026-10-28 16:45:22',
    status: 'Failed',
    confidenceScore: 31.8,
    hashSha256: 'c3d4e5f6a1b20718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    extractedData: {
      'Candidate Name': 'Pooja Mehta',
      'Degree Title': 'Bachelor of Technology in Computer Science',
      'Institution Name': 'National Institute of Engineering & Technology',
      'Roll / Enrollment Number': 'NIET-2022-CS-0419',
      'Year of Passing': 'June 2024',
      'Division / Grade': 'First Class with Distinction (8.9 CGPA)',
      'Vice Chancellor Signature': 'Unverified Digital Stamp',
      'Registrar Seal': 'Missing Security Embossing'
    },
    qualityAssessment: {
      resolution: '180 DPI (Low)',
      contrast: '65% (Faded)',
      glare: 'None',
      skew: '1.8°',
      score: 52
    },
    tamperingIndicators: [
      {
        name: 'University Emblem Forgery',
        description: 'University seal graphic is an unvectorized raster overlay with visible JPEG ringing artifacts around borders.',
        severity: 'critical',
        detected: true,
        coordinates: { x: 38, y: 72, w: 24, h: 18 }
      },
      {
        name: 'Roll Number Checksum Mismatch',
        description: 'Enrollment algorithm checksum failed. Serial number does not adhere to NIET 2022 batch sequencing.',
        severity: 'critical',
        detected: true
      },
      {
        name: 'Missing Security Watermark',
        description: 'UV security watermark simulated layer absent in transmitted PDF vector streams.',
        severity: 'critical',
        detected: true
      }
    ],
    fieldConsistencyChecks: [
      { field: 'Graduation Year vs Duration', expected: '4 years (2020-2024)', found: 'Enrolled 2022 - Graduated 2024 (2 yrs)', match: false, note: 'B.Tech completed in 2 years is mathematically impossible without lateral entry documentation' },
      { field: 'Registrar Signature Hash', expected: 'Matched to Registry Key', found: 'Unknown Bitmap', match: false, note: 'Signature not recognized in university authorized signatory DB' }
    ],
    referenceComparison: {
      database: 'Simulated NAD (National Academic Depository) Demo Sandbox',
      matchScore: 12.0,
      status: 'Record Mismatch',
      referenceId: 'NAD-VERIFY-FAIL-0092',
      timestamp: '2026-10-28 16:45:30'
    },
    complianceChecklist: [
      { rule: 'UGC Minimum Standards 2021', standard: 'B.Tech 4-Year Credit Curriculum', passed: false, comment: 'Curriculum timeline inconsistency' },
      { rule: 'NAD / Digilocker Alignment', standard: 'Cryptographic document URI', passed: false, comment: 'No matching academic depository token' },
      { rule: 'Seal & Security Inks', standard: 'Embossed physical seal reflection', passed: false, comment: 'Imitation 2D graphic detected' }
    ],
    issuesDetected: [
      {
        title: 'Counterfeit Academic Credential Detected',
        severity: 'critical',
        description: 'Certificate fails enrollment algorithm, duration timeline, and lacks university seal integrity.',
        recommendation: 'Reject immediately and issue notice to institutional admissions board.'
      }
    ],
    recommendations: [
      'REJECT APPLICATION: Document exhibits multiple critical indicators of fabrication.',
      'Report incident to Institutional Academic Misconduct Cell.'
    ],
    fileSize: '3.1 MB'
  },
  {
    id: 'DOC-2026-6540',
    documentName: 'State_Domicile_Certificate_Suresh_Rathod.pdf',
    category: 'government',
    documentType: 'Domicile Certificate',
    uploadDate: '2026-10-28 09:20:05',
    status: 'Manual Review Required',
    confidenceScore: 78.4,
    hashSha256: '998877665544332211aabbccddeeff00112233445566778899aabbccddeeff00',
    extractedData: {
      'Applicant Name': 'Suresh Devendra Rathod',
      'Certificate Number': 'DOM/MH/PUN/2025/084129',
      'State / Territory': 'Maharashtra',
      'District': 'Pune',
      'Tahsil': 'Haveli',
      'Years of Residence': '18 Years',
      'Issuing Officer': 'Tehsildar & Executive Magistrate, Haveli'
    },
    qualityAssessment: {
      resolution: '280 DPI',
      contrast: '79%',
      glare: 'Heavy crease and fold across barcode',
      skew: '4.1°',
      score: 74
    },
    tamperingIndicators: [
      {
        name: 'Barcode Occlusion',
        description: 'Physical fold on certificate prevents automatic 2D data-matrix scanning.',
        severity: 'moderate',
        detected: true,
        coordinates: { x: 70, y: 15, w: 22, h: 12 }
      },
      {
        name: 'Seal Degradation',
        description: 'Tehsil office rubber stamp is faint due to scan contrast, requiring human visual affirmation.',
        severity: 'low',
        detected: true
      }
    ],
    fieldConsistencyChecks: [
      { field: 'Certificate Prefix', expected: 'DOM/MH/PUN', found: 'DOM/MH/PUN', match: true, note: 'Matches Pune district tehsil taxonomy' },
      { field: 'Barcode Decodability', expected: '100% Read', found: '62% (Corrupted by fold)', match: false, note: 'Human verifier needed to read serial manually' }
    ],
    referenceComparison: {
      database: 'Simulated MahaOnline e-Seva Kendra Portal',
      matchScore: 84.0,
      status: 'Partial Match',
      referenceId: 'MAHA-DOM-2025-998',
      timestamp: '2026-10-28 09:20:12'
    },
    complianceChecklist: [
      { rule: 'State e-District Standards', standard: 'Valid Digital or Wet Seal', passed: true, comment: 'Government serial format verified' },
      { rule: 'Barcode Readability', standard: 'ISO/IEC 15415 Quality >= Grade C', passed: false, comment: 'Crease degrades automated read' }
    ],
    issuesDetected: [
      {
        title: 'Degraded Physical Scan Quality',
        severity: 'low',
        description: 'Document has physical crease over barcode. Text is authentic but automated machine reader requires human sign-off.',
        recommendation: 'Assign to Tier-2 manual verification officer for 2-minute visual check.'
      }
    ],
    recommendations: [
      'Document appears authentic. Route to administrative staff for manual barcode confirmation.',
      'Alternatively, ask applicant to submit an uncreased copy or DigiLocker issued PDF.'
    ],
    fileSize: '1.9 MB'
  },
  {
    id: 'DOC-2026-5112',
    documentName: 'CBSE_Class_XII_Marksheet_Sneha_Patel.png',
    category: 'educational',
    documentType: 'Marksheet',
    uploadDate: '2026-10-27 15:10:33',
    status: 'Verified',
    confidenceScore: 98.6,
    hashSha256: '554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766',
    extractedData: {
      'Student Name': 'Sneha Patel',
      'Roll Number': '12648931',
      'School Code': '84012 (Delhi Public School)',
      'Board': 'Central Board of Secondary Education (CBSE)',
      'Academic Session': '2023 - 2024',
      'Total Aggregate': '476 / 500 (95.2%)',
      'Pass Status': 'PASS',
      'DigiLocker Verified Badge': 'Present (Valid Certificate Chain)'
    },
    qualityAssessment: {
      resolution: '600 DPI',
      contrast: '99%',
      glare: 'None',
      skew: '0.0°',
      score: 99
    },
    tamperingIndicators: [
      {
        name: 'Subject Marks Summation Integrity',
        description: 'Marks for English (94), Physics (95), Chemistry (96), Math (95), Computer Science (96) match 476 aggregate.',
        severity: 'safe',
        detected: false
      },
      {
        name: 'CBSE Hologram Security Grid',
        description: 'High-density micro-prismatic hologram structure authenticated with zero digital interpolation.',
        severity: 'safe',
        detected: false
      }
    ],
    fieldConsistencyChecks: [
      { field: 'Grade Points vs Marks', expected: 'A1 across all subjects', found: 'A1', match: true, note: 'Grade points perfectly aligned with percentiles' },
      { field: 'Board QR Code', expected: 'CBSE-SEC-12-2024-TOKEN', found: 'CBSE-SEC-12-2024-TOKEN', match: true, note: 'Matches CBSE centralized server digest' }
    ],
    referenceComparison: {
      database: 'Simulated CBSE DigiLocker / Pariksha Sangam Node',
      matchScore: 99.9,
      status: 'Matched',
      referenceId: 'CBSE-2024-DIGI-849102',
      timestamp: '2026-10-27 15:10:40'
    },
    complianceChecklist: [
      { rule: 'National Education Policy 2020', standard: 'Academic Bank of Credits (ABC) ID', passed: true, comment: 'ABC ID verified and linked' },
      { rule: 'Digital Signature Standard', standard: 'Controller of Examinations PKI', passed: true, comment: 'PKI cert valid till 2028' }
    ],
    issuesDetected: [],
    recommendations: [
      'Document authenticated without discrepancy.',
      'Ready for automated college merit-list compilation and counseling qualification.'
    ],
    fileSize: '2.4 MB'
  }
];

export const DEMO_PRESETS = [
  {
    id: 'preset-aadhaar-valid',
    title: '1. Valid Aadhaar Card',
    category: 'government' as DocumentCategory,
    documentType: 'Aadhaar Card' as DocumentType,
    fileName: 'Valid_Aadhaar_Card_Rajesh_Kumar.pdf',
    status: 'Verified' as const,
    expectedScore: 99.2,
    badge: 'Verified 99%',
    description: 'Authentic UIDAI masked e-Aadhaar with valid QR code, intact guilloche patterns and cryptographically sound certificate.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'preset-pan-valid',
    title: '2. Valid PAN Card',
    category: 'government' as DocumentCategory,
    documentType: 'PAN Card' as DocumentType,
    fileName: 'Valid_PAN_Card_Amit_Verma.jpg',
    status: 'Verified' as const,
    expectedScore: 98.4,
    badge: 'Verified 98%',
    description: 'Compliant Income Tax Department PAN card matching NSDL registry with authentic typography, clean hologram, and 10-char format.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'preset-marksheet-valid',
    title: '3. Valid Marksheet',
    category: 'educational' as DocumentCategory,
    documentType: 'Marksheet' as DocumentType,
    fileName: 'Valid_CBSE_Class_XII_Marksheet_Sneha.png',
    status: 'Verified' as const,
    expectedScore: 98.6,
    badge: 'Verified 99%',
    description: 'Authentic CBSE Senior School Certificate: 476/500 aggregate perfectly matches calculated 95.2%, authentic board seal, and clean typography.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'preset-marksheet-tampered',
    title: '4. Tampered Marksheet (Altered Marks/Percentage)',
    category: 'educational' as DocumentCategory,
    documentType: 'Marksheet' as DocumentType,
    fileName: 'Tampered_Marksheet_Altered_Marks_495.png',
    status: 'Failed' as const,
    expectedScore: 31.8,
    badge: 'Failed (Tampered)',
    description: 'Candidate digitally altered score to 495/500 (99%). Algorithmic check flags severe arithmetic variance against original registry record (312/500, 62.4%).',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'preset-blurry-document',
    title: '5. Blurry or Low-Quality Document',
    category: 'government' as DocumentCategory,
    documentType: 'Domicile Certificate' as DocumentType,
    fileName: 'Low_Quality_Blurry_Scan_Domicile.jpg',
    status: 'Manual Review Required' as const,
    expectedScore: 68.2,
    badge: 'Manual Review',
    description: 'Sub-optimal scan quality (150 DPI, low Laplacian blur sharpness, glare on margin). Routed to manual officer queue for secondary confirmation.',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  {
    id: 'preset-suspicious-doc',
    title: '6. Suspicious Document (Font Mismatch & Altered Date)',
    category: 'government' as DocumentCategory,
    documentType: 'PAN Card' as DocumentType,
    fileName: 'Suspicious_PAN_Altered_DOB_Font_Mismatch.jpg',
    status: 'Suspicious' as const,
    expectedScore: 61.4,
    badge: 'Suspicious 61%',
    description: 'Error Level Analysis reveals pixel recompression on numeric date field, 24% font weight mismatch, and ruptured background security guilloche.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  }
];

export const SUPPORTED_DOCUMENTS_INFO = [
  {
    category: 'Government Documents',
    description: 'State and central government identification, income, social category, and residential credentials.',
    items: [
      {
        name: 'Aadhaar Card',
        issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
        checks: ['12-digit Verhoeff Checksum Algorithm', 'UIDAI Digital PKI Signature', 'Secure 2048-bit QR Payload', 'First-8 Digits Masking Compliance (IT Act 2000)', 'Microprint & Guilloche Continuity'],
        turnaround: '< 2.8 sec',
        compliance: 'UIDAI Security Guidelines & e-KYC circular 2024'
      },
      {
        name: 'PAN Card',
        issuingAuthority: 'Income Tax Department (NSDL / Protean / UTIITSL)',
        checks: ['10-Character Alphanumeric Structure Check', '4th & 5th Character Semantic Rules', 'NSDL / UTI Holographic Stamp Quality', 'Error Level Analysis (ELA) on Name & DOB', 'Father\'s Name Alignment'],
        turnaround: '< 2.4 sec',
        compliance: 'Income Tax Act 1961 Section 139A'
      },
      {
        name: 'Income Certificate',
        issuingAuthority: 'State Revenue Department / Tehsildar / Sub-Divisional Magistrate',
        checks: ['Financial Year Validity Verification', 'Annual Income Figure vs Stated Category', 'State e-District Digital Barcode Scan', 'Executive Magistrate Digital Signature Stamp', 'Application Tracking Token Hash'],
        turnaround: '< 3.1 sec',
        compliance: 'State Public Services Guarantee Act'
      },
      {
        name: 'Caste Certificate',
        issuingAuthority: 'Competent District Magistrate / Revenue Authority',
        checks: ['Central / State Category Schedule (SC/ST/OBC/EWS)', 'Serial Number Format by District', 'Non-Creamy Layer Validity Date Verification', 'Government Watermark & Emblem Analysis', 'Sub-Caste vs Central Gazette Cross-Check'],
        turnaround: '< 3.0 sec',
        compliance: 'Constitutional Orders (Scheduled Castes/Tribes) & Central OBC Directory'
      },
      {
        name: 'Domicile Certificate',
        issuingAuthority: 'State Home / Revenue Department',
        checks: ['Years of Continuous Residency Validation', 'District Tehsil Jurisdiction Code', 'State e-Seva QR Decryption', 'Photo & Seal Stamp Boundary Blending Inspection', 'Applicant Age & Father Domicile Linkage'],
        turnaround: '< 2.6 sec',
        compliance: 'State Domicile Rules & Citizens Charter'
      }
    ]
  },
  {
    category: 'Educational Documents',
    description: 'Secondary, higher secondary, technical, and university degrees, marks, and bonafide certifications.',
    items: [
      {
        name: 'Marksheet (Secondary & Higher Secondary)',
        issuingAuthority: 'State Boards, CBSE, ICSE, NIOS',
        checks: ['Individual Subject Marks vs Cumulative Aggregate Math', 'Theory + Practical Split Verification', 'Board Examination Roll Number Pattern', 'Hologram / Foil Integrity Check', 'Academic Year & Passing Year Alignment'],
        turnaround: '< 2.5 sec',
        compliance: 'National Education Policy (NEP 2020) & Board By-Laws'
      },
      {
        name: 'Degree Certificate',
        issuingAuthority: 'Recognized Central, State, Deemed & Private Universities',
        checks: ['University Grants Commission (UGC) Accreditation Check', 'Degree Program Duration vs Enrollment Year', 'Vice-Chancellor / Registrar Signature Geometry', 'National Academic Depository (NAD) Token Cross-Check', 'Watermark & Security Border Wave Analysis'],
        turnaround: '< 3.4 sec',
        compliance: 'UGC Notification on Academic Degrees Specification 2021'
      },
      {
        name: 'Diploma Certificate',
        issuingAuthority: 'State Technical Education Boards & AICTE Approved Polytechnics',
        checks: ['Polytechnic Institutional Code Verification', 'Branch Specialization Classification', 'Curriculum Credits & Semester Passing Status', 'Anti-Scan Ghost Image Layer Detection', 'AICTE Affiliation Validation'],
        turnaround: '< 2.9 sec',
        compliance: 'AICTE Regulations for Diploma Programs'
      },
      {
        name: 'School Leaving Certificate (SLC / TC)',
        issuingAuthority: 'Accredited Schools & Junior Colleges',
        checks: ['General Register (GR) Number Sequence', 'Date of Leaving vs Academic Calendar', 'Character & Conduct Remark Integrity', 'Principal Seal & School Stamp Geometry', 'Affiliation Code with Educational Directorate'],
        turnaround: '< 2.2 sec',
        compliance: 'Right to Education (RTE) Act & State Education Codes'
      },
      {
        name: 'University Certificate / Migration',
        issuingAuthority: 'University Academic Registrar Section',
        checks: ['Transfer / Migration Unique Token Number', 'Enrollment Cancellation & Clearance Verification', 'University Hologram Reflection Gradient', 'Security Ink Fluorescence Simulation', 'Dual-Enrollment Prevention Flag'],
        turnaround: '< 2.7 sec',
        compliance: 'Inter-University Transfer Norms & UGC Guidelines'
      }
    ]
  }
];

export const FAQS = [
  {
    q: 'How does DocShield AI detect document tampering without accessing private databases?',
    a: 'DocShield AI uses a multi-layered computer vision and cryptographic evaluation pipeline. It combines Error Level Analysis (ELA) to spot pixel compression anomalies from photo editing, font kerning and glyph vector matching, layout template bounding-box validation, and local mathematical checksum audits (like the Verhoeff algorithm for Aadhaar and semantic validation for PAN).'
  },
  {
    q: 'Is DocShield AI safe for sensitive personal data (PII)?',
    a: 'Yes. DocShield AI is architected with privacy-first zero-knowledge principles. Document processing and forensic analysis occur securely with automatic PII redaction (such as masking the first 8 digits of Aadhaar). For enterprise deployments, DocShield AI supports on-premise air-gapped processing and dedicated virtual private cloud (VPC) instances.'
  },
  {
    q: 'What document formats are supported?',
    a: 'DocShield AI supports PDF, JPG, JPEG, and PNG files up to 25MB. It handles both digital born-e-documents (e-Aadhaar, DigiLocker downloads) and photographed/scanned paper certificates.'
  },
  {
    q: 'How does the platform assist educational institutions and enterprise organizations?',
    a: 'During student admissions, employee onboarding, credential audits, and regulatory compliance reviews, organizations process thousands of documents. DocShield AI automates routine verification in seconds, flags altered dates or forged seals, and provides compliance officers with an auditable cryptographic checklist.'
  },
  {
    q: 'Can DocShield AI distinguish between a camera photograph and an edited counterfeit?',
    a: 'Yes. Camera photos have uniform noise distributions, slight lens distortion, and natural lighting gradients. Counterfeits created with software like Photoshop show localized recompression boundaries, jagged font anti-aliasing edges, and broken guilloche background waves, which our tampering engine detects immediately.'
  }
];
