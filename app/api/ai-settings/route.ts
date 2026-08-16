import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { AISettingsModel } from "@/lib/db/models/AISettings";
import { encryptSecret, decryptSecret, maskApiKey } from "@/lib/privacy/encryption";

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    let settingsDoc = await AISettingsModel.findOne({ userId: user.userId }).lean();
    
    const encryptedKeys = (settingsDoc && settingsDoc.encryptedApiKeys) || {};

    const hasGemini = !!(encryptedKeys.gemini || process.env.GEMINI_API_KEY);
    const hasGroq = !!(encryptedKeys.groq || process.env.GROQ_API_KEY);
    const hasOpenAI = !!encryptedKeys.openai;
    const hasOpenRouter = !!(encryptedKeys.openrouter || process.env.OPENROUTER_API_KEY);
    const hasDeepSeek = !!encryptedKeys.deepseek;
    const hasAnthropic = !!encryptedKeys.anthropic;

    const apiKeysConfigured = {
      gemini: hasGemini,
      groq: hasGroq,
      openai: hasOpenAI,
      openrouter: hasOpenRouter,
      deepseek: hasDeepSeek,
      anthropic: hasAnthropic,
      llama: false,
      qwen: false,
    };

    if (!settingsDoc) {
      settingsDoc = {
        primaryProvider: "gemini-3-flash-preview",
        fallbackProvider: "groq",
        temperature: 0.2,
        maxTokens: 4096,
        apiKeysConfigured,
        routingMode: "accuracy_optimized",
      } as any;
    } else {
      settingsDoc.apiKeysConfigured = apiKeysConfigured;
    }

    const maskedKeys = {
      geminiKey: encryptedKeys.gemini ? maskApiKey(decryptSecret(encryptedKeys.gemini)) : (process.env.GEMINI_API_KEY ? maskApiKey(process.env.GEMINI_API_KEY) : ""),
      groqKey: encryptedKeys.groq ? maskApiKey(decryptSecret(encryptedKeys.groq)) : (process.env.GROQ_API_KEY ? maskApiKey(process.env.GROQ_API_KEY) : ""),
      openaiKey: encryptedKeys.openai ? maskApiKey(decryptSecret(encryptedKeys.openai)) : "",
      openrouterKey: encryptedKeys.openrouter ? maskApiKey(decryptSecret(encryptedKeys.openrouter)) : (process.env.OPENROUTER_API_KEY ? maskApiKey(process.env.OPENROUTER_API_KEY) : ""),
      deepseekKey: encryptedKeys.deepseek ? maskApiKey(decryptSecret(encryptedKeys.deepseek)) : "",
      anthropicKey: encryptedKeys.anthropic ? maskApiKey(decryptSecret(encryptedKeys.anthropic)) : "",
    };

    return NextResponse.json({
      settings: settingsDoc,
      maskedKeys,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch AI settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      primaryProvider,
      fallbackProvider,
      routingMode,
      geminiKey,
      groqKey,
      openaiKey,
      openrouterKey,
      deepseekKey,
      anthropicKey,
    } = body;

    await connectDB();

    let existingDoc = await AISettingsModel.findOne({ userId: user.userId });
    if (!existingDoc) {
      existingDoc = new AISettingsModel({ userId: user.userId });
    }

    if (primaryProvider) existingDoc.primaryProvider = primaryProvider;
    if (fallbackProvider) existingDoc.fallbackProvider = fallbackProvider;
    if (routingMode) existingDoc.routingMode = routingMode;

    const currentEncrypted = existingDoc.encryptedApiKeys || {};

    const handleKeyUpdate = (newVal: string | undefined, currentCipher: string | undefined): string => {
      if (!newVal) return currentCipher || "";
      if (newVal.includes("••••")) return currentCipher || "";
      return encryptSecret(newVal.trim());
    };

    const updatedEncrypted = {
      gemini: handleKeyUpdate(geminiKey, currentEncrypted.gemini),
      groq: handleKeyUpdate(groqKey, currentEncrypted.groq),
      openai: handleKeyUpdate(openaiKey, currentEncrypted.openai),
      openrouter: handleKeyUpdate(openrouterKey, currentEncrypted.openrouter),
      deepseek: handleKeyUpdate(deepseekKey, currentEncrypted.deepseek),
      anthropic: handleKeyUpdate(anthropicKey, currentEncrypted.anthropic),
    };

    existingDoc.encryptedApiKeys = updatedEncrypted;

    existingDoc.apiKeysConfigured = {
      gemini: !!(updatedEncrypted.gemini || process.env.GEMINI_API_KEY),
      groq: !!(updatedEncrypted.groq || process.env.GROQ_API_KEY),
      openai: !!updatedEncrypted.openai,
      openrouter: !!(updatedEncrypted.openrouter || process.env.OPENROUTER_API_KEY),
      deepseek: !!updatedEncrypted.deepseek,
      anthropic: !!updatedEncrypted.anthropic,
      llama: false,
      qwen: false,
    };

    await existingDoc.save();

    return NextResponse.json({
      success: true,
      message: "AI Gateway configuration and API keys encrypted and saved successfully!",
      settings: existingDoc,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save AI settings" }, { status: 500 });
  }
}
