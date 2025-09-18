import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Target } from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

export function NavigationHeader() {
  return (
    <header className="border-b bg-background" data-testid="navigation-header">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Target className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold" data-testid="app-title">
            ClearHabits
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <SignedIn>
            <UserButton data-testid="user-menu-trigger" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button data-testid="button-login">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
