// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth-actions';
import type { Usuario } from '@/lib/types';

interface AuthState {
  user: Usuario | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setAuthState({
          user: user,
          loading: false,
          isAuthenticated: !!user,
        });
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
};