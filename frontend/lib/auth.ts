export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
