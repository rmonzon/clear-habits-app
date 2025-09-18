import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export function useAuth() {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();

  return {
    user,
    isLoading: !isLoaded,
    isAuthenticated: !!user,
    getToken,
  };
}