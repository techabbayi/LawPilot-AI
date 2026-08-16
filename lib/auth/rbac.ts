import { UserRole } from "@/lib/types";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  legal_reviewer: 2,
  admin: 3,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
