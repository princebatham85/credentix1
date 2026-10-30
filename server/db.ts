import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserEntity {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  preferences: {
    notifications: boolean;
    strictness: number;
    autoReject: boolean;
  };
  role: 'student' | 'citizen' | 'institution' | 'government';
  organization: string;
}

export interface DocumentEntity {
  documentId: string;
  userId: string;
  documentName: string;
  documentType: string;
  documentCategory: 'government' | 'educational';
  storagePath: string;
  uploadDate: string;
  verificationStatus: 'Verified' | 'Suspicious' | 'Failed' | 'Manual Review Required' | 'Pending';
  fileSize: string;
  mimeType: string;
  fileUrl?: string;
  hashSha256: string;
}

export interface VerificationResultEntity {
  verificationId: string;
  documentId: string;
  userId: string;
  extractedInformation: Record<string, string>;
  documentQuality: {
    resolution: string;
    contrast: string;
    glare: string;
    skew: string;
    score: number;
  };
  tamperingIndicators: Array<{
    name: string;
    description: string;
    severity: 'safe' | 'low' | 'moderate' | 'critical';
    detected: boolean;
    coordinates?: { x: number; y: number; w: number; h: number };
  }>;
  consistencyChecks: Array<{
    field: string;
    expected: string;
    found: string;
    match: boolean;
    note: string;
  }>;
  referenceDatabaseComparison: {
    database: string;
    matchScore: number;
    status: 'Matched' | 'Partial Match' | 'Record Mismatch' | 'Unable to verify against reference database';
    referenceId: string;
    timestamp: string;
    matchingFields?: string[];
    mismatchedFields?: string[];
    missingFields?: string[];
    note?: string;
  };
  complianceResults: Array<{
    rule: string;
    standard: string;
    passed: boolean;
    comment: string;
  }>;
  issuesDetected: Array<{
    title: string;
    severity: 'critical' | 'moderate' | 'low';
    description: string;
    recommendation: string;
  }>;
  overallStatus: 'Verified' | 'Suspicious' | 'Failed' | 'Manual Review Required';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendations: string[];
  createdAt: string;
}

export interface VerificationHistoryEntity {
  historyId: string;
  userId: string;
  documentId: string;
  verificationId: string;
  status: 'Verified' | 'Suspicious' | 'Failed' | 'Manual Review Required';
  timestamp: string;
  documentName: string;
  documentType: string;
  category: 'government' | 'educational';
}

export interface ReferenceRecordEntity {
  referenceId: string;
  documentType: string;
  referenceNumber: string; // e.g. PAN number, Aadhaar last-4/name, Roll No
  referenceInformation: Record<string, string>;
  issuingAuthority: string;
  recordStatus: 'Active' | 'Revoked' | 'Archived';
  description?: string;
}

interface DatabaseSchema {
  users: Record<string, UserEntity>;
  documents: Record<string, DocumentEntity>;
  verificationResults: Record<string, VerificationResultEntity>;
  verificationHistory: Record<string, VerificationHistoryEntity>;
  referenceRecords: Record<string, ReferenceRecordEntity>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing utility
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_docshield_salt_2026').digest('hex');
}

// Pre-seeded Reference Records (Government & Educational)
const SEED_REFERENCE_RECORDS: ReferenceRecordEntity[] = [
  {
    referenceId: 'REF-GOV-AADHAAR-01',
    documentType: 'Aadhaar Card',
    referenceNumber: 'XXXX-XXXX-4891',
    referenceInformation: {
      'Cardholder Name': 'Rajesh Kumar Sharma',
      'Date of Birth': '14/08/1998',
      'Gender': 'Male',
      'Address': 'Sector 14, Gurugram, Haryana - 122001',
      'Digital Signature Status': 'Valid'
    },
    issuingAuthority: 'Unique Identification Authority of India (UIDAI Sandbox)',
    recordStatus: 'Active',
    description: 'Authorized sample reference record for UIDAI e-KYC validation demo'
  },
  {
    referenceId: 'REF-GOV-PAN-01',
    documentType: 'PAN Card',
    referenceNumber: 'ABCPV8921K',
    referenceInformation: {
      'Permanent Account Number': 'ABCPV8921K',
      'Cardholder Name': 'Amit Verma',
      'Father\'s Name': 'Ramesh Chandra Verma',
      'Date of Birth': '05/11/1990', // Discrepancy note: 1990 on record vs 1995 on tampered doc
      'Status': 'Valid & Linked'
    },
    issuingAuthority: 'Income Tax Department (NSDL/Protean Registry Sandbox)',
    recordStatus: 'Active',
    description: 'Official tax department master record for individual PAN validation'
  },
  {
    referenceId: 'REF-EDU-CBSE-01',
    documentType: 'Marksheet',
    referenceNumber: '12648931',
    referenceInformation: {
      'Student Name': 'Sneha Patel',
      'Roll Number': '12648931',
      'School Code': '84012 (Delhi Public School)',
      'Board': 'Central Board of Secondary Education (CBSE)',
      'Passing Year': '2024',
      'Total Aggregate': '476 / 500',
      'Result': 'PASS'
    },
    issuingAuthority: 'CBSE DigiLocker Registry (Pariksha Sangam Demo Node)',
    recordStatus: 'Active',
    description: 'Verified academic depository record for Senior School Certificate'
  },
  {
    referenceId: 'REF-EDU-DEGREE-01',
    documentType: 'Degree Certificate',
    referenceNumber: 'DTU-2025-DS-8802',
    referenceInformation: {
      'Graduate Name': 'Vikramaditya Chauhan',
      'Degree Conferred': 'Bachelor of Science (Honours) in Data Science',
      'University Name': 'Delhi Technological University (DTU)',
      'Year of Graduation': '2025',
      'Division': 'First Class with Distinction'
    },
    issuingAuthority: 'National Academic Depository (NAD / DigiLocker Sandbox)',
    recordStatus: 'Active',
    description: 'National Academic Depository authenticated degree record'
  },
  {
    referenceId: 'REF-GOV-DOMICILE-01',
    documentType: 'Domicile Certificate',
    referenceNumber: 'DOM/MH/PUN/2025/084129',
    referenceInformation: {
      'Applicant Name': 'Suresh Devendra Rathod',
      'District': 'Pune',
      'State': 'Maharashtra',
      'Issuing Officer': 'Tehsildar & Executive Magistrate, Haveli'
    },
    issuingAuthority: 'MahaOnline e-Seva Kendra State Registry Sandbox',
    recordStatus: 'Active',
    description: 'State citizen residential verification reference record'
  },
  {
    referenceId: 'REF-GOV-INCOME-01',
    documentType: 'Income Certificate',
    referenceNumber: 'INC/MH/2026/891241',
    referenceInformation: {
      'Applicant Name': 'Rohan Manoj Patil',
      'Certificate Number': 'INC/MH/2026/891241',
      'Annual Family Income': 'INR 1,80,000',
      'Financial Year': '2025 - 2026',
      'Issuing Officer': 'Tehsildar & Executive Magistrate'
    },
    issuingAuthority: 'Revenue and Forest Department, Government of Maharashtra',
    recordStatus: 'Active',
    description: 'Statutory income certificate reference record for educational scholarship validation'
  },
  {
    referenceId: 'REF-GOV-CASTE-01',
    documentType: 'Caste Certificate',
    referenceNumber: 'CC/MH/NAG/2025/1102',
    referenceInformation: {
      'Applicant Name': 'Kavita Suresh Gond',
      'Category': 'Scheduled Tribe (ST) - Gond',
      'Certificate Number': 'CC/MH/NAG/2025/1102',
      'District': 'Nagpur'
    },
    issuingAuthority: 'Sub-Divisional Caste Scrutiny Committee',
    recordStatus: 'Active',
    description: 'Certified caste verification record for affirmative action compliance'
  },
  {
    referenceId: 'REF-EDU-TAMPER-BASE-01',
    documentType: 'Marksheet',
    referenceNumber: 'ROLL-99214',
    referenceInformation: {
      'Student Name': 'Sneha Patel',
      'Roll Number': 'ROLL-99214',
      'Board': 'Central Board of Secondary Education (CBSE)',
      'Passing Year': '2024',
      'Total Aggregate': '312 / 500',
      'Declared Percentage': '62.4%',
      'Result': 'PASS - Second Division'
    },
    issuingAuthority: 'CBSE DigiLocker Registry (Pariksha Sangam Demo Node)',
    recordStatus: 'Active',
    description: 'Original master marksheet record showing candidate actual score of 62.4% before digital alteration'
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all collections exist
        return {
          users: parsed.users || {},
          documents: parsed.documents || {},
          verificationResults: parsed.verificationResults || {},
          verificationHistory: parsed.verificationHistory || {},
          referenceRecords: parsed.referenceRecords || this.seedReferenceRecords()
        };
      } catch (err) {
        console.error('Failed to read db.json, initializing fresh store:', err);
      }
    }

    const initial: DatabaseSchema = {
      users: {},
      documents: {},
      verificationResults: {},
      verificationHistory: {},
      referenceRecords: this.seedReferenceRecords()
    };

    // Pre-seed a default demo officer user for instant access if desired
    const defaultOfficerId = 'usr_gov_officer_demo';
    initial.users[defaultOfficerId] = {
      userId: defaultOfficerId,
      name: 'Dr. Vikram Sethi',
      email: 'v.sethi@delhi.gov.in',
      passwordHash: hashPassword('DocShield@2026'),
      createdAt: new Date().toISOString(),
      accountStatus: 'active',
      preferences: {
        notifications: true,
        strictness: 85,
        autoReject: false
      },
      role: 'government',
      organization: 'State Public Services & e-District Directorate'
    };

    this.saveData(initial);
    return initial;
  }

  private seedReferenceRecords(): Record<string, ReferenceRecordEntity> {
    const map: Record<string, ReferenceRecordEntity> = {};
    for (const rec of SEED_REFERENCE_RECORDS) {
      map[rec.referenceId] = rec;
    }
    return map;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // --- Users Collection ---
  getUserById(userId: string): UserEntity | undefined {
    return this.data.users[userId];
  }

  getUserByEmail(email: string): UserEntity | undefined {
    const lower = email.toLowerCase().trim();
    return Object.values(this.data.users).find(u => u.email.toLowerCase() === lower);
  }

  createUser(user: Omit<UserEntity, 'userId' | 'createdAt' | 'accountStatus'>): UserEntity {
    const userId = 'usr_' + crypto.randomUUID();
    const newUser: UserEntity = {
      ...user,
      userId,
      createdAt: new Date().toISOString(),
      accountStatus: 'active'
    };
    this.data.users[userId] = newUser;
    this.persist();
    return newUser;
  }

  updateUser(userId: string, partial: Partial<UserEntity>): UserEntity | undefined {
    const existing = this.data.users[userId];
    if (!existing) return undefined;
    this.data.users[userId] = { ...existing, ...partial };
    this.persist();
    return this.data.users[userId];
  }

  deleteUser(userId: string): boolean {
    if (!this.data.users[userId]) return false;
    delete this.data.users[userId];
    // Remove user's documents & history
    for (const [docId, doc] of Object.entries(this.data.documents)) {
      if (doc.userId === userId) {
        delete this.data.documents[docId];
        delete this.data.verificationResults[docId];
      }
    }
    for (const [histId, h] of Object.entries(this.data.verificationHistory)) {
      if (h.userId === userId) {
        delete this.data.verificationHistory[histId];
      }
    }
    this.persist();
    return true;
  }

  // --- Documents Collection ---
  createDocument(doc: Omit<DocumentEntity, 'documentId' | 'uploadDate'>): DocumentEntity {
    const documentId = 'DOC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newDoc: DocumentEntity = {
      ...doc,
      documentId,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.data.documents[documentId] = newDoc;
    this.persist();
    return newDoc;
  }

  getDocument(documentId: string): DocumentEntity | undefined {
    return this.data.documents[documentId];
  }

  getDocumentsByUser(userId: string): DocumentEntity[] {
    return Object.values(this.data.documents)
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }

  updateDocumentStatus(documentId: string, status: DocumentEntity['verificationStatus']): boolean {
    const doc = this.data.documents[documentId];
    if (!doc) return false;
    doc.verificationStatus = status;
    this.persist();
    return true;
  }

  deleteDocument(documentId: string, userId: string): boolean {
    const doc = this.data.documents[documentId];
    if (!doc || doc.userId !== userId) return false;
    delete this.data.documents[documentId];
    delete this.data.verificationResults[documentId];
    // Delete from history
    for (const [histId, h] of Object.entries(this.data.verificationHistory)) {
      if (h.documentId === documentId) {
        delete this.data.verificationHistory[histId];
      }
    }
    this.persist();
    return true;
  }

  // --- Verification Results Collection ---
  saveVerificationResult(result: VerificationResultEntity): VerificationResultEntity {
    this.data.verificationResults[result.documentId] = result;
    // Also record in history
    const historyId = 'HIST-' + crypto.randomUUID().slice(0, 8);
    const doc = this.data.documents[result.documentId];
    this.data.verificationHistory[historyId] = {
      historyId,
      userId: result.userId,
      documentId: result.documentId,
      verificationId: result.verificationId,
      status: result.overallStatus,
      timestamp: result.createdAt,
      documentName: doc?.documentName || 'Unknown Document',
      documentType: doc?.documentType || 'General Document',
      category: doc?.documentCategory || 'government'
    };
    // Update document status
    if (doc) {
      doc.verificationStatus = result.overallStatus;
    }
    this.persist();
    return result;
  }

  getVerificationResultByDocumentId(documentId: string): VerificationResultEntity | undefined {
    return this.data.verificationResults[documentId];
  }

  getVerificationResultById(verificationId: string): VerificationResultEntity | undefined {
    return Object.values(this.data.verificationResults).find(v => v.verificationId === verificationId);
  }

  // --- Verification History Collection ---
  getAllHistory(): VerificationHistoryEntity[] {
    return Object.values(this.data.verificationHistory);
  }

  getHistoryByUser(userId: string): VerificationHistoryEntity[] {
    return Object.values(this.data.verificationHistory)
      .filter(h => h.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // --- Reference Records Collection ---
  getReferenceRecords(): ReferenceRecordEntity[] {
    return Object.values(this.data.referenceRecords);
  }

  findReferenceRecord(documentType: string, searchKey: string): ReferenceRecordEntity | undefined {
    const cleanKey = searchKey.replace(/[\s-]/g, '').toLowerCase();
    return Object.values(this.data.referenceRecords).find(rec => {
      if (rec.documentType.toLowerCase() !== documentType.toLowerCase()) return false;
      const refNum = rec.referenceNumber.replace(/[\s-]/g, '').toLowerCase();
      if (cleanKey.includes(refNum) || refNum.includes(cleanKey)) return true;
      // Search inside referenceInformation values
      for (const val of Object.values(rec.referenceInformation)) {
        const cleanVal = val.replace(/[\s-]/g, '').toLowerCase();
        if (cleanVal.length > 3 && (cleanKey.includes(cleanVal) || cleanVal.includes(cleanKey))) {
          return true;
        }
      }
      return false;
    });
  }

  addReferenceRecord(rec: Omit<ReferenceRecordEntity, 'referenceId'>): ReferenceRecordEntity {
    const referenceId = 'REF-' + crypto.randomUUID().slice(0, 8);
    const newRecord: ReferenceRecordEntity = { ...rec, referenceId };
    this.data.referenceRecords[referenceId] = newRecord;
    this.persist();
    return newRecord;
  }

  // --- Dashboard Statistics Calculation ---
  getDashboardStats(userId: string) {
    const userDocs = this.getDocumentsByUser(userId);
    const total = userDocs.length;
    const verified = userDocs.filter(d => d.verificationStatus === 'Verified').length;
    const suspicious = userDocs.filter(d => d.verificationStatus === 'Suspicious' || d.verificationStatus === 'Failed').length;
    const pending = userDocs.filter(d => d.verificationStatus === 'Manual Review Required' || d.verificationStatus === 'Pending').length;
    return {
      totalDocumentsChecked: total,
      verifiedDocuments: verified,
      suspiciousDocuments: suspicious,
      pendingReviews: pending,
      recentActivity: userDocs.slice(0, 10)
    };
  }
}

export const db = new Database();
