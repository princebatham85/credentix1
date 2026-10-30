import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { db, hashPassword, UserEntity } from './server/db.js';
import { analyzeDocumentWithGemini } from './server/geminiService.js';
import { executeVerificationPipeline } from './server/services/verificationPipeline.js';
import { preprocessDocument } from './server/services/preprocessing.js';
import { runTesseractOcr } from './server/services/ocrService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_START_TIME = Date.now();

// Ensure directories exist
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for secure file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `doc_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are accepted.'));
    }
  }
});

// In-memory token store for sessions (userId -> token, token -> userId)
const activeSessions: Record<string, string> = {};

function createSessionToken(userId: string): string {
  const token = 'tok_' + crypto.randomBytes(24).toString('hex');
  activeSessions[token] = userId;
  return token;
}

// Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return;
  }

  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  const userId = activeSessions[token];

  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired session token' });
    return;
  }

  const user = db.getUserById(userId);
  if (!user) {
    res.status(401).json({ error: 'User record not found' });
    return;
  }

  (req as any).user = user;
  next();
}

// Optional Auth (for guest demo mode)
function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/, '').trim();
    const userId = activeSessions[token];
    if (userId) {
      const user = db.getUserById(userId);
      if (user) {
        (req as any).user = user;
      }
    }
  }
  next();
}

// Sanitize user for responses (never return password hash)
function sanitizeUser(user: UserEntity) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// -----------------------------------------------------------------------------
// Authentication Endpoints
// -----------------------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim(),
      passwordHash: hashPassword(password),
      role: role || 'government',
      organization: organization || 'Institutional Verification Cell',
      preferences: {
        notifications: true,
        strictness: 85,
        autoReject: false
      }
    });

    const token = createSessionToken(newUser.userId);
    res.status(201).json({
      user: sanitizeUser(newUser),
      token,
      message: 'Registration successful'
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register account' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const hash = hashPassword(password);
    if (user.passwordHash !== hash) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = createSessionToken(user.userId);
    res.json({
      user: sanitizeUser(user),
      token,
      message: 'Sign In Successful!'
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = (req as any).user as UserEntity;
  res.json({ user: sanitizeUser(user) });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/, '').trim();
    delete activeSessions[token];
  }
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address required.' });
    return;
  }
  res.json({
    message: `Password reset link dispatched to ${email} (Demonstration Simulation).`
  });
});

// -----------------------------------------------------------------------------
// System Health Check Endpoints
// -----------------------------------------------------------------------------
app.get(['/api/health', '/api/system/status'], (req, res) => {
  const startTime = Date.now();
  const simulate = req.query.simulate as string | undefined;

  // Simulate downtime for testing/demonstration
  if (simulate === 'downtime') {
    res.status(503).json({
      status: 'downtime',
      uptime: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
      timestamp: new Date().toISOString(),
      environment: 'production',
      version: '2.4.0',
      services: {
        apiServer: { status: 'downtime', latencyMs: 512, message: 'REST API service disruption' },
        database: { status: 'downtime', message: 'Storage partition unavailable' },
        aiEngine: { status: 'downtime', message: 'Inference pipeline unreachable' },
        storage: { status: 'downtime', message: 'Filesystem read/write failed' }
      },
      overallLatencyMs: 512
    });
    return;
  }

  // Simulate degraded performance
  if (simulate === 'degraded') {
    res.status(200).json({
      status: 'degraded',
      uptime: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
      timestamp: new Date().toISOString(),
      environment: 'production',
      version: '2.4.0',
      services: {
        apiServer: { status: 'operational', latencyMs: 35, message: 'Express API responsive' },
        database: { status: 'operational', recordsCount: db.getAllHistory().length, message: 'Database active' },
        aiEngine: { status: 'degraded', provider: 'Google Gemini 3.8 Flash', latencyMs: 640, message: 'High inference queue load / Rate throttled' },
        storage: { status: 'operational', message: 'Upload filesystem write delay elevated' }
      },
      overallLatencyMs: 340
    });
    return;
  }

  try {
    // 1. Storage check
    let storageStatus: 'operational' | 'degraded' | 'downtime' = 'operational';
    let storageMessage = 'Local disk storage accessible';
    try {
      fs.accessSync(UPLOADS_DIR, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
      storageStatus = 'degraded';
      storageMessage = 'Uploads directory permissions degraded';
    }

    // 2. Database check
    let dbStatus: 'operational' | 'degraded' | 'downtime' = 'operational';
    let recordsCount = 0;
    try {
      recordsCount = db.getAllHistory().length + db.getReferenceRecords().length;
    } catch {
      dbStatus = 'degraded';
    }

    // 3. AI engine check
    const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
    const aiEngineStatus: 'operational' | 'degraded' = geminiConfigured ? 'operational' : 'degraded';
    const aiEngineMessage = geminiConfigured
      ? 'Google Gemini 3.8 Flash multimodal forensic pipeline ready'
      : 'API key configured in fallback mode';

    const apiLatency = Math.max(2, Date.now() - startTime);

    let overallStatus: 'operational' | 'degraded' | 'downtime' = 'operational';
    if (storageStatus === 'degraded' || aiEngineStatus === 'degraded' || dbStatus === 'degraded') {
      overallStatus = 'degraded';
    }

    res.json({
      status: overallStatus,
      uptime: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
      timestamp: new Date().toISOString(),
      environment: 'production',
      version: '2.4.0',
      services: {
        apiServer: {
          status: 'operational',
          latencyMs: apiLatency,
          message: 'Express REST API responsive'
        },
        database: {
          status: dbStatus,
          recordsCount,
          message: `${recordsCount} records indexed in active store`
        },
        aiEngine: {
          status: aiEngineStatus,
          provider: 'Google Gemini 3.8 Flash',
          apiKeyConfigured: geminiConfigured,
          message: aiEngineMessage
        },
        storage: {
          status: storageStatus,
          uploadsDir: 'uploads',
          message: storageMessage
        }
      },
      overallLatencyMs: apiLatency
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'downtime',
      uptime: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
      timestamp: new Date().toISOString(),
      error: err?.message || 'Internal health check failure',
      services: {
        apiServer: { status: 'downtime', message: err?.message },
        database: { status: 'degraded' },
        aiEngine: { status: 'degraded' },
        storage: { status: 'degraded' }
      },
      overallLatencyMs: 0
    });
  }
});

// -----------------------------------------------------------------------------
// Document Management Endpoints
// -----------------------------------------------------------------------------

// POST /api/documents/upload
app.post('/api/documents/upload', optionalAuth, upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No document file uploaded.' });
      return;
    }

    const { documentType, documentCategory } = req.body;
    const user = (req as any).user;
    const userId = user ? user.userId : 'usr_guest_verifier';

    // Calculate file SHA-256
    const fileBuffer = fs.readFileSync(file.path);
    const hashSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const createdDoc = db.createDocument({
      userId,
      documentName: file.originalname,
      documentType: documentType || 'Aadhaar Card',
      documentCategory: documentCategory || 'government',
      storagePath: file.path,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimeType: file.mimetype,
      fileUrl: `/uploads/${file.filename}`,
      hashSha256,
      verificationStatus: 'Pending'
    });

    res.status(201).json({
      document: createdDoc,
      message: 'Document uploaded and registered successfully.'
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to upload document.' });
  }
});

// POST /api/verify/pipeline (Full 8-stage AI/ML forensic & Tesseract OCR pipeline)
app.post('/api/verify/pipeline', optionalAuth, async (req, res) => {
  try {
    const { documentId, documentType, documentCategory, documentName, fileBase64, mimeType, forcedOutcome } = req.body;
    const user = (req as any).user;
    const userId = user ? user.userId : 'usr_guest_verifier';

    let doc = documentId ? db.getDocument(documentId) : null;
    let actualDocId = documentId;

    if (!doc) {
      const created = db.createDocument({
        userId,
        documentName: documentName || 'Verified_Document.pdf',
        documentType: documentType || 'Aadhaar Card',
        documentCategory: documentCategory || 'government',
        storagePath: '',
        fileSize: '1.2 MB',
        mimeType: mimeType || 'application/pdf',
        hashSha256: crypto.createHash('sha256').update(documentName || 'doc').digest('hex'),
        verificationStatus: 'Pending'
      });
      actualDocId = created.documentId;
      doc = created;
    }

    let fileBuffer: Buffer | undefined;
    if (doc.storagePath && fs.existsSync(doc.storagePath)) {
      fileBuffer = fs.readFileSync(doc.storagePath);
    }

    const pipelineResult = await executeVerificationPipeline({
      documentId: actualDocId,
      userId,
      documentName: doc.documentName,
      documentCategory: doc.documentCategory,
      documentType: doc.documentType,
      fileBuffer,
      fileBase64,
      mimeType: mimeType || doc.mimeType,
      forcedOutcome
    });

    res.json({
      success: true,
      result: pipelineResult.verificationResult,
      pipeline: {
        preprocessing: pipelineResult.preprocessing,
        ocrData: pipelineResult.ocrData,
        consistency: pipelineResult.consistency,
        forensics: pipelineResult.forensics,
        referenceComparison: pipelineResult.referenceComparison,
        executionLogs: pipelineResult.executionLogs,
        overallConfidenceScore: pipelineResult.overallConfidenceScore
      },
      message: '8-Stage verification pipeline executed successfully.'
    });
  } catch (err: any) {
    console.error('Pipeline verification error:', err);
    res.status(500).json({ error: err?.message || 'Failed to execute verification pipeline' });
  }
});

// POST /api/verify/analyze (Backward-compatible route upgraded to use full pipeline)
app.post('/api/verify/analyze', optionalAuth, async (req, res) => {
  try {
    const { documentId, documentType, documentCategory, documentName, fileBase64, mimeType, forcedOutcome } = req.body;

    const user = (req as any).user;
    const userId = user ? user.userId : 'usr_guest_verifier';

    let doc = documentId ? db.getDocument(documentId) : null;
    let actualDocId = documentId;

    if (!doc) {
      const created = db.createDocument({
        userId,
        documentName: documentName || 'Verified_Document.pdf',
        documentType: documentType || 'Aadhaar Card',
        documentCategory: documentCategory || 'government',
        storagePath: '',
        fileSize: '1.2 MB',
        mimeType: mimeType || 'application/pdf',
        hashSha256: crypto.createHash('sha256').update(documentName || 'doc').digest('hex'),
        verificationStatus: 'Pending'
      });
      actualDocId = created.documentId;
      doc = created;
    }

    let fileBuffer: Buffer | undefined;
    if (doc.storagePath && fs.existsSync(doc.storagePath)) {
      fileBuffer = fs.readFileSync(doc.storagePath);
    }

    const pipelineResult = await executeVerificationPipeline({
      documentId: actualDocId,
      userId,
      documentName: doc.documentName,
      documentCategory: doc.documentCategory,
      documentType: doc.documentType,
      fileBuffer,
      fileBase64,
      mimeType: mimeType || doc.mimeType,
      forcedOutcome
    });

    res.json({
      result: pipelineResult.verificationResult,
      pipeline: {
        preprocessing: pipelineResult.preprocessing,
        ocrData: pipelineResult.ocrData,
        consistency: pipelineResult.consistency,
        forensics: pipelineResult.forensics,
        referenceComparison: pipelineResult.referenceComparison,
        executionLogs: pipelineResult.executionLogs,
        overallConfidenceScore: pipelineResult.overallConfidenceScore
      },
      message: 'Document verification and forensic analysis completed.'
    });
  } catch (err: any) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Failed to execute document analysis.' });
  }
});

// POST /api/ocr/extract (Dedicated Tesseract OCR extraction)
app.post('/api/ocr/extract', optionalAuth, async (req, res) => {
  try {
    const { documentType, fileBase64, mimeType } = req.body;
    let buffer: Buffer;
    if (fileBase64) {
      const clean = fileBase64.replace(/^data:[^;]+;base64,/, '');
      buffer = Buffer.from(clean, 'base64');
    } else {
      buffer = Buffer.from('Document OCR sample text');
    }

    const ocrData = await runTesseractOcr(buffer, documentType || 'Aadhaar Card');
    res.json({ ocr: ocrData });
  } catch (err: any) {
    console.error('OCR Extraction error:', err);
    res.status(500).json({ error: 'Failed to extract text using Tesseract OCR' });
  }
});

// POST /api/preprocess/analyze (Dedicated Preprocessing & Quality assessment)
app.post('/api/preprocess/analyze', optionalAuth, async (req, res) => {
  try {
    const { fileName, fileBase64, mimeType } = req.body;
    let buffer: Buffer;
    if (fileBase64) {
      const clean = fileBase64.replace(/^data:[^;]+;base64,/, '');
      buffer = Buffer.from(clean, 'base64');
    } else {
      buffer = Buffer.from('Sample buffer');
    }

    const result = await preprocessDocument(buffer, mimeType || 'image/jpeg', fileName || 'document.jpg');
    res.json({ preprocessing: result });
  } catch (err: any) {
    console.error('Preprocessing inspection error:', err);
    res.status(500).json({ error: 'Failed to run preprocessing inspection' });
  }
});

// GET /api/documents
app.get('/api/documents', optionalAuth, (req, res) => {
  const user = (req as any).user;
  const userId = user ? user.userId : 'usr_guest_verifier';
  const docs = db.getDocumentsByUser(userId);
  res.json({ documents: docs });
});

// GET /api/documents/:id
app.get('/api/documents/:id', optionalAuth, (req, res) => {
  const doc = db.getDocument(req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  const result = db.getVerificationResultByDocumentId(doc.documentId);
  res.json({ document: doc, result });
});

// DELETE /api/documents/:id
app.delete('/api/documents/:id', optionalAuth, (req, res) => {
  const user = (req as any).user;
  const userId = user ? user.userId : 'usr_guest_verifier';
  const success = db.deleteDocument(req.params.id, userId);
  if (!success) {
    res.status(404).json({ error: 'Document not found or unauthorized' });
    return;
  }
  res.json({ message: 'Document and analysis results removed successfully.' });
});

// GET /api/results/:id
app.get('/api/results/:id', (req, res) => {
  const result = db.getVerificationResultByDocumentId(req.params.id) || db.getVerificationResultById(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Verification result not found' });
    return;
  }
  res.json({ result });
});

// GET /api/history
app.get('/api/history', optionalAuth, (req, res) => {
  const user = (req as any).user;
  const userId = user ? user.userId : 'usr_guest_verifier';
  const history = db.getHistoryByUser(userId);
  res.json({ history });
});

// GET /api/dashboard/stats
app.get('/api/dashboard/stats', optionalAuth, (req, res) => {
  const user = (req as any).user;
  const userId = user ? user.userId : 'usr_guest_verifier';
  const stats = db.getDashboardStats(userId);
  res.json(stats);
});

// GET /api/reference-records
app.get('/api/reference-records', (_req, res) => {
  const records = db.getReferenceRecords();
  res.json({ referenceRecords: records });
});

// POST /api/reference-records
app.post('/api/reference-records', optionalAuth, (req, res) => {
  const { documentType, referenceNumber, referenceInformation, issuingAuthority, recordStatus, description } = req.body;
  if (!documentType || !referenceNumber || !referenceInformation) {
    res.status(400).json({ error: 'documentType, referenceNumber, and referenceInformation required.' });
    return;
  }

  const newRec = db.addReferenceRecord({
    documentType,
    referenceNumber,
    referenceInformation,
    issuingAuthority: issuingAuthority || 'State Verification Authority',
    recordStatus: recordStatus || 'Active',
    description: description || 'Administrator authorized reference record'
  });

  res.status(201).json({ referenceRecord: newRec, message: 'Reference record created.' });
});

// -----------------------------------------------------------------------------
// Vite Middleware (Dev) & Static Serving (Prod)
// -----------------------------------------------------------------------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`DocShield AI Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
});
