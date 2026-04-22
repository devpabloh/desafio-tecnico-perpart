export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3334";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body?.message ?? "Erro na requisição";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return response.json() as Promise<T>;
}