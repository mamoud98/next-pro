"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Call your external API
  const r = await fetch(
    "https://crm-api-test.vindo.ai/api/v6/customer-portal/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Adjust payload/fields to match your provider
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    }
  );

  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    return { error: data?.message || "Invalid credentials." };
  }

  const data = await r.json();
  const accessToken = data.customerPortalAccessToken;

  const maxAge = Math.min(60 * 60, Number(data.expiresIn || 3600)); // <= 1h

  // Set secure HttpOnly cookies
  const jar = await cookies();
  jar.set("token", accessToken, {
    httpOnly: false,
    secure: false, // keep true in prod (HTTPS)
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  // On success: server-side redirect (no client JS needed)
  redirect("/profile");
}
