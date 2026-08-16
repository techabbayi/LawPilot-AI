export type UserRole = "user" | "legal_reviewer" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl?: string;
  googleId?: string;
  retentionDays: number; // 0 = immediate, 1, 7, 30, 90, -1 = keep until delete
  autoOcr: boolean;
  aiProviderPreference: string;
  createdAt: string;
  updatedAt: string;
}

export type FileType = "pdf" | "docx" | "img" | "txt";
export type RetentionPolicy = "immediate" | "24h" | "7d" | "30d" | "90d" | "keep";

export interface IDocument {
  _id: string;
  userId: string;
  title: string;
  fileName: string;
  fileUrl: string;
  cloudinaryPublicId?: string;
  fileType: FileType;
  sizeBytes: number;
  textContent: string;
  category: string; // e.g. "NDAs", "Employment", "SaaS", "Real Estate", "General"
  retentionPolicy: RetentionPolicy;
  expiresAt?: string;
  status: "uploaded" | "parsing" | "parsed" | "error";
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    ocrUsed?: boolean;
    language?: string;
  };
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface IDetectedClause {
  id: string;
  clauseType: string;
  title: string;
  originalText: string;
  simplifiedExplanation: string;
  riskLevel: RiskLevel;
  recommendation: string;
  confidenceScore: number;
}

export interface IAnalysis {
  _id: string;
  documentId: string;
  userId: string;
  overallRiskScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  executiveSummary: string;
  keyTerms: { label: string; value: string }[];
  detectedClauses: IDetectedClause[];
  missingClauses: string[];
  actionableRecommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IContractComparison {
  _id: string;
  userId: string;
  title: string;
  docA: { id: string; title: string; fileType: string };
  docB: { id: string; title: string; fileType: string };
  summary: string;
  riskDelta: "docA_safer" | "docB_safer" | "equal" | "high_risk_both";
  keyDifferences: {
    clauseCategory: string;
    docAText: string;
    docBText: string;
    analysis: string;
    winner: "docA" | "docB" | "neutral";
  }[];
  createdAt: string;
}

export interface IChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: { sourceDocTitle: string; snippet: string; page?: number }[];
  providerUsed?: string;
  modelUsed?: string;
  timestamp: string;
}

export interface IChatSession {
  _id: string;
  userId: string;
  title: string;
  attachedDocId?: string;
  attachedDocTitle?: string;
  messages: IChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ITemplateVariable {
  name: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
  required: boolean;
}

export interface IDocumentTemplate {
  _id: string;
  title: string;
  description: string;
  category: "NDA" | "Employment" | "SaaS" | "Services" | "Corporate" | "Intellectual Property";
  iconName: string;
  variables: ITemplateVariable[];
  templateBodyMarkdown: string;
  createdAt: string;
}

export interface IAISettings {
  primaryProvider: "groq" | "gemini" | "openai" | "openrouter" | "llama" | "deepseek" | "qwen" | "anthropic";
  fallbackProvider: "groq" | "gemini" | "openai" | "openrouter" | "llama" | "deepseek" | "qwen" | "anthropic";
  temperature: number;
  maxTokens: number;
  apiKeysConfigured: {
    groq: boolean;
    gemini: boolean;
    openai: boolean;
    openrouter: boolean;
    llama: boolean;
    deepseek: boolean;
    qwen: boolean;
    anthropic?: boolean;
  };
  encryptedApiKeys?: {
    gemini?: string;
    groq?: string;
    openai?: string;
    openrouter?: string;
    deepseek?: string;
    anthropic?: string;
  };
  routingMode: "cost_optimized" | "speed_optimized" | "accuracy_optimized";
}

export interface IAuditLog {
  _id: string;
  userId?: string;
  userEmail?: string;
  action: string; // e.g. "AUTH_LOGIN", "DOC_UPLOAD", "DOC_HARD_DELETE", "AI_ANALYSIS", "DATA_EXPORT"
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface INotification {
  _id: string;
  userId: string;
  type: "alert" | "expiry" | "system" | "analysis";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
