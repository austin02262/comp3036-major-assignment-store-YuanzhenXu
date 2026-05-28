"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    // Registration stays client-side for quick feedback, while validation is enforced by the API.
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error || "Registration failed.");
        return;
      }

      // New users login after registration so the session is created through one path.
      router.push("/login");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-gray-950">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-wide text-red-700">
          GameHub Customer
        </p>
        <h1 className="mt-2 text-3xl font-black">Register</h1>
        <p className="mt-3 text-sm text-gray-600">
          Create a customer account, then login to enter the store.
        </p>

        <form onSubmit={submitRegister} className="mt-6 space-y-5">
          <Field label="Username" value={username} onChange={setUsername} />
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-700 px-4 py-3 font-bold text-white hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already registered?{" "}
          <a href="/login" className="font-bold text-blue-700 hover:text-blue-900">
            Login
          </a>
        </p>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  // Shared field component keeps registration inputs accessible with matching labels.
  const id = label.toLowerCase();

  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        required
      />
    </div>
  );
}
