'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: string) => {
    document.cookie = `role=${role}; path=/`;
    
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
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="flex items-center justify-center h-full px-4">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}