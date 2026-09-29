"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Loader2, User } from "lucide-react";

import AuthShell from "@/components/brand/AuthShell";
import { ClientApiError } from "@/lib/api-client-v2";
import { authErrorMessage, register } from "@/lib/auth-client";

export default function InscriptionPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"particulier" | "entreprise">("particulier");

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData.email, formData.password);
      router.push("/candidature/formulaire");
      router.refresh();
    } catch (caughtError) {
      if (caughtError instanceof ClientApiError && caughtError.fields) {
        const fieldMessages = Object.values(caughtError.fields).flat();
        setError(fieldMessages.join(" "));
      } else {
        setError(authErrorMessage(caughtError, "Une erreur s'est produite lors de l'inscription."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthShell
      title="Rejoignez IN-CUBATOR."
      subtitle="Créez votre compte, puis déposez votre candidature au programme."
      photo="/photos/roadmap-whiteboard.webp"
      photoAlt="Une main désigne une feuille de route Q1 à Q4 sur un tableau blanc"
      side={{
        heading: "De l'idée au projet concret, en six étapes.",
        text: "Diagnostic, accompagnement, test terrain, réseau, formations, lancement : votre parcours commence par un compte.",
      }}
    >
      <div className="mb-7 grid grid-cols-2 border border-line bg-white p-0.5" role="group" aria-label="Type de compte">
        {(
          [
            ["particulier", "Particulier", User],
            ["entreprise", "Entreprise", Building2],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            aria-pressed={accountType === id}
            onClick={() => setAccountType(id)}
            className={`flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
              accountType === id ? "bg-violet-dark text-white" : "text-gray-main hover:text-violet-dark"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mb-5 border border-orange-accent/40 bg-orange-accent/10 px-4 py-3 text-sm font-semibold text-orange-deep">
          {error}
        </p>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {accountType === "entreprise" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-violet-dark">Nom de l&apos;entreprise</span>
            <input
              type="text"
              name="companyName"
              required
              autoComplete="organization"
              value={formData.companyName}
              onChange={handleInputChange}
              className="field"
              placeholder="Votre entreprise"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-violet-dark">Nom complet</span>
          <input
            type="text"
            name="fullName"
            required
            autoComplete="name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="field"
            placeholder="Prénom Nom"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-violet-dark">Adresse e-mail</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
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
              name="password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              className="field !pr-12"
              placeholder="Choisissez un mot de passe"
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
          <p className="mt-2 text-sm text-gray-main">
            12 caractères minimum, avec au moins une majuscule, une minuscule et un chiffre.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-gray-main">
          <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#3e2a57]" />
          <span>
            J&apos;accepte les{" "}
            <Link href="#" className="font-bold text-violet-dark underline-offset-4 hover:underline">
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="#" className="font-bold text-violet-dark underline-offset-4 hover:underline">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>

        <button type="submit" disabled={loading} className="btn btn-primary w-full !py-4 disabled:opacity-60">
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Création en cours…
            </>
          ) : (
            "Créer mon compte"
          )}
        </button>
      </form>

      <p className="mt-8 text-sm text-gray-main">
        Vous avez déjà un compte ?{" "}
        <Link href="/connexion" className="font-bold text-violet-dark underline-offset-4 hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
