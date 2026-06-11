"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email.trim().toLowerCase(), password }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error ?? "No se pudo iniciar sesión");
        setLoading(false);
        return;
      }

      // If remember me is checked, you could implement persistent session logic
      // For now, just redirect as usual
      const nextPath = searchParams.get("next") ?? "/";
      await router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Error de conexión con el backend");
      setLoading(false);
    }
  }

  const handleForgotPassword = () => {
    alert("Por favor contacta con el administrador para restablecer tu contraseña.");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1c2a44_0%,_#0b1321_40%,_#020617_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/15 backdrop-blur-xl md:p-8">
          {/* Logo y título */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30">
              <span className="text-xl font-bold">PC</span>
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Ingresa tus credenciales para acceder al simulador
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Campo email */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            {/* Campo contraseña */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-200">
                  Contraseña
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Recordarme + Olvidé contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/40"
                />
                Recordarme
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-cyan-400 transition hover:text-cyan-300 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Validando credenciales..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Enlace a registro */}
          <div className="mt-6 text-center text-sm text-slate-400">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300 hover:underline"
            >
              Regístrate ahora
            </a>
          </div>

          {/* Texto de seguridad */}
          <p className="mt-6 text-center text-xs text-slate-500">
            La sesión se mantiene segura y los accesos se registran para auditoría.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <LoginForm />
    </Suspense>
  );
}