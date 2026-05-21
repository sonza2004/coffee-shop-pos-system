export type UserRole = "admin" | "cashier" | "owner";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export function getUser(): User | null {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function getRole(): UserRole | null {
  const user = getUser();
  return user?.role || null;
}

export function hasRole(allowed: UserRole[]): boolean {
  const role = getRole();
  if (!role) return false;
  return allowed.includes(role);
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}
