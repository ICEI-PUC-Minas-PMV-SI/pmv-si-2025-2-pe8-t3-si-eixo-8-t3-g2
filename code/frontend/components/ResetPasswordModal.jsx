'use client'
import { useState } from 'react'

export default function ResetPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (res.ok) setSent(true)
      else throw new Error(data.error?.message || 'Erro ao enviar e-mail')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#0E1625] w-full max-w-md rounded-lg p-6 border border-[#1E2A3B] shadow-2xl">
        <h2 className="text-lg font-semibold mb-1 text-white">Resetar senha</h2>
        <p className="text-sm text-gray-400 mb-4">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {sent ? (
          <div className="text-center text-green-400 py-4">
            ✅ Um link de redefinição foi enviado para {email}.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full bg-[#0B1320] border border-[#1E2A3B] text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
            />

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-400 hover:text-gray-200 transition"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#007BFF] hover:bg-[#006AE6] text-white px-4 py-1.5 text-sm rounded-md transition"
              >
                {loading ? 'ENVIANDO...' : 'CONTINUAR'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
