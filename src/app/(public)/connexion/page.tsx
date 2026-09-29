"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import AuthShell from "@/components/brand/AuthShell";
import { authErrorMessage, login } from "@/lib/auth-client";
import { ROLE_DASHBOARD } from "@/lib/auth-contract";

export default function ConnexionPage() {
  const [showPassword, setShowPassword] = useState(false);
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
      const user = await login(email, password);
      // Les comptes de l'équipe sont refusés par l'API : ils passent par /admin/connexion.
      const destination = ROLE_DASHBOARD[user.role];

      if (!destination) {
        setError("Aucun espace n'est encore disponible pour ce rôle.");
        return;
      }

      router.push(destination);
      router.refresh();
    } catch (caughtError) {
      setError(authErrorMessage(caughtError, "Une erreur est survenue. Veuillez réessayer."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Content de vous revoir."
      subtitle="Connectez-vous à votre espace IN-CUBATOR pour continuer."
      side={{
        heading: "Votre projet avance, votre espace le suit.",
        text: "Feuille de route, mentors, Deal Room : retrouvez tout ce qui fait avancer votre startup au même endroit.",
      }}
    >
      {error && (
        <p role="alert" className="mb-5 border border-orange-accent/40 bg-orange-accent/10 px-4 py-3 text-sm font-semibold text-orange-deep">
          {error}
        </p>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-violet-dark">Adresse e-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="exemple@email.com"
          />
        </label>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-violet-dark">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field !pr-12"
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-main transition-colors hover:text-violet-dark"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <Link href="#" className="text-sm font-bold text-violet-main transition-colors hover:text-violet-dark">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-main">
          <input type="checkbox" className="h-4 w-4 accent-[#3e2a57]" />
          Se souvenir de moi
        </label>

        <button type="submit" disabled={loading} className="btn btn-primary w-full !py-4 disabled:opacity-60">
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Connexion en cours…
            </>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      <p className="mt-8 text-sm text-gray-main">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-bold text-violet-dark underline-offset-4 hover:underline">
          Créer un compte
        </Link>
      </p>

      <p className="mt-6 flex items-start gap-3 border-t border-line pt-6 text-sm leading-relaxed text-gray-main">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-violet-main" />
        Connexion sécurisée : vos données restent confidentielles et protégées.
      </p>
    </AuthShell>
  );
}
