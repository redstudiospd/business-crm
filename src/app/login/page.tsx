"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const providers = [
  { id: "google", label: "Continue with Google" },
  { id: "microsoft-entra-id", label: "Continue with Microsoft" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleProviderSignIn = async (id: string) => {
    if (busy) return;
    setBusy(true);
    setStatus(null);
    try {
      await signIn(id, {callbackUrl: "/dashboard" });
    } catch {
      setBusy(false);
      setStatus("Sign-in failed. Please try again.");
    }
  };

  const handleDemoSignIn = async () => {
    setStatus("Signing in to demo...");
    await signIn("credentials", {
      email: "demo@aesonops.local",
      password: "demo1234",
      callbackUrl: "/dashboard"
    });
  };

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Sending login link...");
    const result = await signIn("email", {
      redirect: false,
      email,
      callbackUrl: "/dashboard",
    });
    if (result?.error) {
      setStatus(`Error: ${result.error}`);
    } else {
      setStatus("Check your email for a login link.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-hairline bg-surface-2 p-8 shadow-lg shadow-black/20">
      <div>
        <Link href="/" className="inline-flex items-centers gap-2 text-sm text-muted transition-color duration-200 ease-out hover:text-ink"> ← Back to home</Link>
        <h1 className="text-3xl font-semibold text-ink">Sign in to aeson.ai</h1>
        <p className="mt-2 text-sm text-muted">
          Access your AI-powered business workspace with Google, Microsoft, or email.
        </p>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleProviderSignIn(provider.id)}
            className="w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-surface-3 disabled:opacity-50"
          >
            {provider.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleDemoSignIn}
        className="w-full rounded-sm bg-accent px-4 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent-hover disabled:opacity-50"
      >
        Try demo account
      </button>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <label className="block text-sm font-medium text-ink">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-sm border border-hairline bg-surface px-4 py-3 text-ink outline-none transition-colors duration-200 ease-out focus:border-accent disabled:opacity-50"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-sm bg-accent px-4 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent-hover disabled:opacity-50"
        >
          Send login link
        </button>
      </form>

      {status ? (
        <p className="rounded-sm bg-surface px-4 py-3 text-sm text-ink">{status}</p>
      ) : null}

      <p className="text-center text-sm text-muted">
        Not a member? Use one of the login options above to create an account.
      </p>
    </div>
  );
}
