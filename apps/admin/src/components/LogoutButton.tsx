'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // if it's true : logging out
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Avoid accepting clicks before React attaches the logout request handler.
    setIsHydrated(true);
  }, []);

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
      disabled={!isHydrated || isLoggingOut}
      onClick={() => void handleLogout()}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
