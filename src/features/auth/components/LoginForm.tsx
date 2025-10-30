'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Role } from '@/types/role';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signInEmail } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper untuk tentukan home berdasarkan role
  const roleHome = (role?: Role | string) => {
    switch (role) {
      case Role.Cashier:
        return '/cashier';
      case Role.Chef:
        return '/chef';
      case Role.Packager:
        return '/packager';
      default:
        return '/';
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const user = await signInEmail(username, password);
      if (!user) {
        setError('Email atau password salah.');
        return;
      }

      // redirect ke ?from=... kalau ada, atau ke home sesuai role
      const from = params.get('from');
      const redirectTo = from || roleHome(user.role);
      router.replace(redirectTo);
    } catch (err) {
      console.error('Error saat login:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-maroon mb-6 text-center">Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-maroon text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 placeholder-gray-400"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label className="block text-maroon text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:border-gray-700 placeholder-gray-400"
            placeholder="Masukkan password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white font-bold py-3 px-4 rounded-lg hover:from-red-800 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
