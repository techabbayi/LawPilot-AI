import jwt from "jsonwebtoken";
import { UserRole } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "lawpilot_enterprise_secure_jwt_secret_key_2026_x900";
const TOKEN_EXPIRY = "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
