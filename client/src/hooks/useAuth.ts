import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      setIsSupabaseLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      setIsSupabaseLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Only fetch user data from our API if authenticated with Supabase
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!supabaseUser,
    retry: false,
  });

  const isAuthenticated = !!supabaseUser;
  const isLoading = isSupabaseLoading || (isAuthenticated && isUserLoading);
  
  // Only return user data when authenticated to prevent stale state
  const safeUser = isAuthenticated ? user : undefined;

  return {
    user: safeUser,
    supabaseUser,
    isLoading,
    isAuthenticated,
    signOut: () => supabase.auth.signOut(),
  };
}