import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { AISettingsModel } from "@/lib/db/models/AISettings";

export interface ActiveModelOption {
  id: string;
  name: string;
  provider: string;
  isRecommended?: boolean;
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const settings = await AISettingsModel.findOne({ userId: user.userId }).lean();
    const configured = settings?.apiKeysConfigured || {
      gemini: !!process.env.GEMINI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
    };

    const activeModels: ActiveModelOption[] = [];

    // 1. Google Gemini Models (Frontier Intelligence & Fallbacks)
    activeModels.push(
      { id: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview (Google - Frontier Intelligence)", provider: "Google Gemini", isRecommended: true },
      { id: "gemini", name: "Gemini 1.5 Flash (Google - High Speed)", provider: "Google Gemini" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Google Next-Gen)", provider: "Google Gemini" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Google Multimodal)", provider: "Google Gemini" }
    );

    // 2. Groq Models
    activeModels.push(
      { id: "groq", name: "Groq (Llama 3.3 70B Versatile - Ultra Fast)", provider: "Groq", isRecommended: true },
      { id: "groq_llama_8b", name: "Groq (Llama 3.1 8B Instant)", provider: "Groq" }
    );

    // 3. OpenRouter Models
    activeModels.push(
      { id: "openrouter", name: "OpenRouter (DeepSeek R1 Reasoning)", provider: "OpenRouter", isRecommended: true },
      { id: "openrouter_qwen", name: "OpenRouter (Qwen 2.5 Coder 32B)", provider: "OpenRouter" },
      { id: "openrouter_claude", name: "OpenRouter (Anthropic Claude 3.5 Sonnet)", provider: "OpenRouter" }
    );

    // 4. OpenAI Models
    activeModels.push(
      { id: "openai", name: "OpenAI (GPT-4o Omnimodal)", provider: "OpenAI" },
      { id: "openai_mini", name: "OpenAI (GPT-4o-mini Fast)", provider: "OpenAI" }
    );

    // 5. DeepSeek Direct Models
    activeModels.push(
      { id: "deepseek", name: "DeepSeek (DeepSeek R1 Reasoning Engine)", provider: "DeepSeek" }
    );

    return NextResponse.json({
      success: true,
      models: activeModels,
      configuredProviders: configured,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch models" }, { status: 500 });
  }
}
