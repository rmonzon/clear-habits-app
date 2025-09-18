import React, { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient, setTokenGetter } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

function Router() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  // Debug Clerk authentication state  
  console.log('Clerk Auth State:', {
    isLoaded,
    isSignedIn,
  });
  
  // Set up the token getter for the query client
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  // Show loading state while Clerk loads
  if (!isLoaded) {
    console.log('Clerk not loaded yet, showing loading...');
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  console.log('Rendering routes with authentication state:', { isSignedIn });

  return (
    <Switch>
      {!isSignedIn ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Dashboard} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;