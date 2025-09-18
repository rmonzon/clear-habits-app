import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Target } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface NavigationHeaderProps {
  user?: UserType | null;
  onLogout?: () => void;
}

export function NavigationHeader({ user, onLogout }: NavigationHeaderProps) {
  const getUserDisplayName = (user: UserType) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email || "User";
  };

  const getUserInitials = (user: UserType) => {
    if (user.firstName || user.lastName) {
      const first = user.firstName?.[0] || "";
      const last = user.lastName?.[0] || "";
      return `${first}${last}`.toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  data-testid="user-menu-trigger"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profileImageUrl || ""}
                      alt={getUserDisplayName(user)}
                    />
                    <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                data-testid="user-menu"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p
                      className="text-sm font-medium leading-none"
                      data-testid="user-display-name"
                    >
                      {getUserDisplayName(user)}
                    </p>
                    {user.email && (
                      <p
                        className="text-xs leading-none text-muted-foreground"
                        data-testid="user-email"
                      >
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} data-testid="menu-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-login"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
