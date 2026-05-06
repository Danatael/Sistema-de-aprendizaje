"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(result.error ?? "No se pudo iniciar sesion")
        setLoading(false)
        return
      }

      const nextPath = searchParams.get("next") ?? "/"
      router.replace(nextPath)
      router.refresh()
    } catch {
      setError("Error de conexion con el backend")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#0f172a_45%,_#020617_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-md items-center">
        <section className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-300">Acceso protegido</p>
          <h1 className="mb-2 text-2xl font-bold text-white">Iniciar sesion</h1>
          <p className="mb-6 text-sm text-slate-300">Conecta con tu backend cifrado para acceder al juego.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm text-slate-200">
              Usuario
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-400 transition focus:ring"
                placeholder="admin"
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Contrasena
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-400 transition focus:ring"
                placeholder="********"
                required
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-400">
            Usa variables de entorno AUTH_USERNAME y AUTH_PASSWORD_HASH para credenciales seguras en produccion.
          </p>
        </section>
      </div>
    </main>
  )
}
