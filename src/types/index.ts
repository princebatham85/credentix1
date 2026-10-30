export type DocumentCategory = 'government' | 'educational';

export type GovernmentDocType =
  | 'Aadhaar Card'
  | 'PAN Card'
  | 'Income Certificate'
  | 'Caste Certificate'
  | 'Domicile Certificate';

export type EducationalDocType =
  | 'Marksheet'
  | 'Degree Certificate'
  | 'Diploma Certificate'
  | 'School Leaving Certificate'
  | 'University Certificate';

export type DocumentType = GovernmentDocType | EducationalDocType;

export type VerificationStatus =
  | 'Verified'
  | 'Suspicious'
  | 'Failed'
  | 'Manual Review Required';

export interface QualityAssessment {
  resolution: string;
  contrast: string;
  glare: string;
  skew: string;
  score: number; // 0 - 100
}

export interface TamperingIndicator {
  name: string;
  description: string;
  severity: 'safe' | 'low' | 'moderate' | 'critical';
  detected: boolean;
  coordinates?: {
    x: number; // percentage
    y: number;
    w: number;
    h: number;
  };
}

export interface FieldConsistencyCheck {
  field: string;
  expected: string;
  found: string;
  match: boolean;
  note: string;
}

export interface ReferenceComparison {
  database: string;
  matchScore: number; // 0 - 100
  status: 'Matched' | 'Partial Match' | 'Record Mismatch' | 'Unindexed in Registry' | 'Unable to verify against reference database';
  referenceId: string;
  timestamp: string;
  matchingFields?: string[];
  mismatchedFields?: string[];
  missingFields?: string[];
  note?: string;
}

export interface ComplianceItem {
  rule: string;
  standard: string;
  passed: boolean;
  comment: string;
}

export interface IssueDetected {
  title: string;
  severity: 'critical' | 'moderate' | 'low';
  description: string;
  recommendation: string;
}

export interface VerificationResult {
  id: string;
  documentName: string;
  category: DocumentCategory;
  documentType: DocumentType;
  uploadDate: string;
  status: VerificationStatus;
  confidenceScore: number; // 0 - 100
  hashSha256: string;
  extractedData: Record<string, string>;
  qualityAssessment: QualityAssessment;
  tamperingIndicators: TamperingIndicator[];
  fieldConsistencyChecks: FieldConsistencyCheck[];
  referenceComparison: ReferenceComparison;
  complianceChecklist: ComplianceItem[];
  issuesDetected: IssueDetected[];
  recommendations: string[];
  filePreviewUrl?: string;
  fileSize?: string;
  isDemoSample?: boolean;
  ocrConfidence?: number;
  ocrFieldConfidences?: Record<string, number>;
  ocrRawText?: string;
  imageForensics?: {
    blurScore: number;
    readabilityGrade: string;
    skewAngleDeg: number;
    contrastRatio: number;
  };
  pipelineLogs?: Array<{
    step: number;
    name: string;
    status: string;
    detail: string;
    timestamp: string;
  }>;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'student' | 'citizen' | 'institution' | 'government';
  organization: string;
  avatarUrl?: string;
  accountType: 'Enterprise Verifier' | 'Institutional Portal' | 'Citizen Portal';
}

export type ActivePage =
  | 'landing'
  | 'login'
  | 'auth'
  | 'dashboard'
  | 'verify'
  | 'history'
  | 'reports'
  | 'supported-docs'
  | 'settings'
  | 'help';

export type AuthMode = 'signin' | 'signup' | 'forgot';
