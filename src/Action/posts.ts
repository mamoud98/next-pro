"use server";

import { cookies } from "next/headers";

export async function getPosts() {
  try {
    const jar = await cookies();
    const token = jar.get("token")?.value;

    if (!token) {
      return { error: "No authentication token found" };
    }

    const response = await fetch(
      "https://crm-api-test.vindo.ai/api/v6/customer-portal/post/list",
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return { error: "Failed to fetch posts" };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { error: "An error occurred while fetching posts" };
  }
}
