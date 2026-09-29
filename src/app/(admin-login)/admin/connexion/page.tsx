"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { adminLogin, authErrorMessage } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // La route dédiée refuse tout compte qui n'appartient pas à l'équipe.
      await adminLogin(email, password);

      router.push("/admin");
      router.refresh();
    } catch (caughtError) {
      setError(authErrorMessage(caughtError, "Identifiants incorrects ou accès non autorisé"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-paper px-5 py-16">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 -z-10 w-[55%] bg-paper-deep"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="facet-tr w-full max-w-md bg-white p-8 shadow-deep sm:p-10">
        <Image src="/logo.png" alt="IN-CUBATOR" width={170} height={54} className="h-11 w-auto" priority />
        <h1 className="mt-7 font-serif text-3xl font-extrabold text-violet-dark">Accès administrateur</h1>
        <p className="mt-2 text-gray-main">Réservé à l&apos;équipe IN-CUBATOR.</p>

        {error && (
          <p role="alert" className="mt-6 border border-orange-accent/40 bg-orange-accent/10 px-4 py-3 text-sm font-semibold text-orange-deep">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Mot de passe</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={loading} className="btn btn-violet w-full !py-4 disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
