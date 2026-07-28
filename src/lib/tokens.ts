import type { Account } from "@prisma/client";
import { google } from "googleapis";
import prisma from "./prisma";

export async function refreshGoogleToken(account: Account): Promise<string | null> {
  if (!account.refresh_token) return account.access_token;

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2.setCredentials({ refresh_token: account.refresh_token });

  try {
    const { credentials } = await oauth2.refreshAccessToken();
    const accessToken = credentials.access_token;
    if (!accessToken) return null;

    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: accessToken,
        expires_at: credentials.expiry_date
          ? Math.floor(credentials.expiry_date / 1000)
          : null,
        refresh_token: credentials.refresh_token ?? account.refresh_token,
      },
    });
    return accessToken;
  } catch {
    return null;
  }
}

export async function refreshMicrosoftToken(account: Account): Promise<string | null> {
  if (!account.refresh_token) return account.access_token;

  const tenant = process.env.AZURE_AD_TENANT_ID ?? "common";
  try {
    const res = await fetch(
      `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.AZURE_AD_CLIENT_ID!,
          client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
          refresh_token: account.refresh_token,
          grant_type: "refresh_token",
          scope: "openid email profile offline_access Mail.Read Mail.ReadWrite Calendars.Read",
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();

    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
        refresh_token: data.refresh_token ?? account.refresh_token,
      },
    });
    return data.access_token;
  } catch {
    return null;
  }
}

export async function getValidAccessToken(account: Account): Promise<string | null> {
  const isExpired =
    account.expires_at && account.expires_at * 1000 < Date.now() + 60_000;

  if (!isExpired && account.access_token) return account.access_token;

  if (account.provider === "google") return refreshGoogleToken(account);
  if (account.provider === "microsoft-entra-id") return refreshMicrosoftToken(account);
  return account.access_token;
}
