import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

const AppHeader = ({ isAuthenticated = false, onSignOut }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold text-foreground">Door2fy</span>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
