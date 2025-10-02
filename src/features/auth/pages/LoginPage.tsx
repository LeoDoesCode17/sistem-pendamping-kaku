'use client';

import { useRouter } from 'next/navigation';
import TopBar from '../../ui/Topbar/TopbarLogin';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: string) => {
    // Simpan role ke cookies/session
    document.cookie = `role=${role}; path=/`;
    
    // Redirect berdasarkan role
    switch(role) {
      case 'cashier':
        router.push('/cashier');
        break;
      case 'chef':
        router.push('/chef');
        break;
      case 'packager':
        router.push('/packager');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}