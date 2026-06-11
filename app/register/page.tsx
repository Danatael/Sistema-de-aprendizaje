"use client"

import { FormEvent, Suspense, useState } from "react"
import { useRouter } from "next/navigation"

function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const result = await response.json().catch(() => ({}))
      setLoading(false)

      if (!response.ok) {
        setError(result.error ?? "No se pudo crear la cuenta")
        return
      }

      router.replace("/")
      router.refresh()
    } catch (err) {
      console.error("Register error:", err)
      setError("Error de conexion con el servidor")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1c2a44_0%,_#0b1321_40%,_#020617_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-2xl items-center justify-center gap-8">
        <section className="hidden w-1/2 flex-col rounded-[2rem] border border-slate-700/80 bg-slate-950/80 p-10 text-slate-100 shadow-[0_30px_80px_rgba(14,116,144,0.18)] backdrop-blur-xl md:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30">
              <span className="text-xl font-bold">PC</span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Registro seguro</p>
              <h2 className="text-3xl font-semibold text-white">Crea tu cuenta</h2>
            </div>
          </div>
          <p className="text-slate-400">
            Registra tu usuario en la base de datos para acceder al simulador y guardar tu progreso de manera segura.
          </p>
          <div className="mt-auto space-y-4 rounded-3xl border border-cyan-500/10 bg-slate-900/70 p-6 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">Cuenta profesional</p>
              <p className="mt-2 text-slate-400">Aquí registras tu correo electrónico con contraseña segura para jugar.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Acceso directo</p>
              <p className="mt-2 text-slate-400">Después del registro, el sistema ingresará automáticamente y redirigirá al inicio.</p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-md rounded-[2rem] border border-slate-700/80 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/15 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">Nuevo usuario</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Registro</h1>
            </div>
            <div className="rounded-2xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 ring-1 ring-cyan-400/30">
              Base de datos
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block text-sm text-slate-200">
              Correo electrónico
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="usuario@dominio.com"
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Confirmar contraseña
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Repite tu contraseña"
                minLength={8}
                required
              />
            </label>

            {error ? (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-sm text-slate-400">
            <p>¿Ya tienes cuenta?</p>
            <a href="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Iniciar sesión</a>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            El registro se almacena en la base de datos y se valida en el servidor.
          </p>
        </section>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <RegisterForm />
    </Suspense>
  )
}
