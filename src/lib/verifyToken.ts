const AUTH_URL = "https://crm-api-test.vindo.ai/api/v6/customer-portal/auth/me";
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000); // edge-friendly timeout

    const res = await fetch(AUTH_URL, {
      method: "GET",
      headers: {
        Authorization: token, // change to `Authorization: token` if your API requires it
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!res.ok) return false;
    const data = await res.json();

    // Prefer a stable boolean from API if available, fall back to message
    return data?.success === true || data?.message === "Success";
  } catch {
    // Network/timeout error -> treat as invalid
    return false;
  }
}
