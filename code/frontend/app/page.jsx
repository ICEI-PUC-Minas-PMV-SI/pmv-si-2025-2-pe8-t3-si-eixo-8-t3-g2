'use client';
import { useState } from 'react';
import { login } from '../lib/auth';
import { useRouter } from 'next/navigation';
import ResetPasswordModal from '../components/ResetPasswordModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      alert('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0F1F] to-[#0D1B2A] text-white">
      <div className="w-full max-w-md bg-[#0E1625] p-8 rounded-xl shadow-2xl border border-[#1E2A3B]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="logo192.webp" alt="Classe A Company" className="h-14 object-contain" />
        </div>

        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-100">Acesse sua conta</h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-[#0B1320] border border-[#1E2A3B] text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-400">Senha</label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowReset(true);
                }}
                className="text-sm text-[#007BFF] hover:underline transition"
              >
                Esqueceu sua senha?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0B1320] border border-[#1E2A3B] text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
              required
            />
          </div>

          <div className="flex items-center">
            <input id="remember" type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="mr-2 accent-[#007BFF]" />
            <label htmlFor="remember" className="text-sm text-gray-400">
              Lembrar-me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#007BFF] hover:bg-[#006AE6] text-white font-semibold py-2 rounded-md transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">© {new Date().getFullYear()} Classe A Company</p>
      </div>
      <ResetPasswordModal open={showReset} onClose={() => setShowReset(false)} />
    </div>
  );
}
