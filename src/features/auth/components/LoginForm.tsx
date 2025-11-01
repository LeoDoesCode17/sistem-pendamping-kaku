'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Role } from '@/types/role';

export default function LoginForm() {
  const router = useRouter();
  const { signInEmail } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goHomeByRole = (role?: Role | string) => {
    switch (role) {
      case Role.Cashier:
      case 'cashier':
        return '/cashier';
      case Role.Chef:
      case 'chef':
        return '/chef';
      case Role.Packager:
      case 'packager':
        return '/packager';
      default:
        return '/';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();            // ⬅️ cegah reload
    setError('');

    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      // 1) Firebase sign-in
      const user = await signInEmail(username, password);
      if (!user) {
        setError('Login gagal. Cek email/password.');
        return;
      }

      // 2) Set cookie session di server
      const roleStr = String(user.role).toLowerCase();            // 'cashier' | 'chef' | 'packager'
      const outletIdStr = String(user.outlet?.id ?? user.outlet); // pastikan string

      const resp = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: roleStr, outletId: outletIdStr }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        setError(data?.error ?? 'Gagal membuat sesi. Coba lagi.');
        return;
      }

      // 3) Redirect sesuai role
      const target = goHomeByRole(user.role);
      router.replace(target);
      router.refresh();
    } catch (err) {
      console.error('Error when login', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-center text-2xl font-bold text-maroon">Login</h2>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-maroon">Username</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:border-gray-700 focus:outline-none"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-maroon">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder-gray-400 focus:border-gray-700 focus:outline-none"
            placeholder="Masukkan password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-red-900 to-red-800 px-4 py-3 font-bold text-white transition-all hover:from-red-800 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
