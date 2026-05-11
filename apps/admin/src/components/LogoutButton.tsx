'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // if it's true : logging out

  const handleLogout = async () => {
    setIsLoggingOut(true); //  do this when onclick

    const response = await fetch('/api/auth', {
      method: 'DELETE',
    });

    if (response.ok) {
      router.push('/');
      router.refresh();
      return;
    }

    setIsLoggingOut(false);
  };

  return (
    <button
      type="button"
      className={className}
      disabled={isLoggingOut}
      onClick={() => void handleLogout()}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
