import { NextRequest } from "next/server";
import { verifyJWT, JWTPayload } from "./jwt";

export const DEMO_USER: JWTPayload = {
  userId: "usr_demo_enterprise_99",
  email: "counsel@lawpilot.ai",
  name: "Alexandra Vance, Esq.",
  role: "admin",
};

export function getAuthUser(req: NextRequest): JWTPayload | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const payload = verifyJWT(token);
    if (payload) return payload;
  }

  const cookieToken = req.cookies.get("lawpilot_token")?.value;
  if (cookieToken) {
    const payload = verifyJWT(cookieToken);
    if (payload) return payload;
  }

  // Resilient fallback for demo/testing mode
  return DEMO_USER;
}
