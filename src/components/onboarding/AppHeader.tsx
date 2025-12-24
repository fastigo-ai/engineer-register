import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/assests/door2fy icon.jpg"

interface AppHeaderProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

const AppHeader = ({
  isAuthenticated = false,
  onSignOut,
}: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-12 h-12 rounded-xl  flex items-center justify-center shadow-glow overflow-hidden">
            <img
              src={Logo}
              alt="Door2fy Logo"
              className="w-full h-full object-contain"
            />
          </div>
          
        </div>

        {/* Right Side */}
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            
            {/* USER ICON */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/status")}
            >
              <User className="h-5 w-5" />
            </Button>

            {/* SIGN OUT */}
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
