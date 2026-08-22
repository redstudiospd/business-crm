"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const providers = [
  { id: "google", label: "Continue with Google" },
  { id: "microsoft-entra-id", label: "Continue with Microsoft" },
  { id: "apple", label: "Continue with Apple" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleProviderSignIn = async (id: string) => {
    setStatus(null);
    await signIn(id, { callbackUrl: "/dashboard" });
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
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-950/95 p-8 shadow-lg shadow-slate-950/20">
      <div>
        <h1 className="text-3xl font-semibold text-white">Sign in to OperaOPS</h1>
        <p className="mt-2 text-sm text-slate-400">
          Access your AI-powered business workspace with Google, Microsoft, Apple, or email.
        </p>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleProviderSignIn(provider.id)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 hover:border-slate-700 hover:bg-slate-800"
          >
            {provider.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Send login link
        </button>
      </form>

      {status ? (
        <p className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-200">{status}</p>
      ) : null}

      <p className="text-center text-sm text-slate-500">
        Not a member? Use one of the login options above to create an account.
      </p>
    </div>
  );
}
