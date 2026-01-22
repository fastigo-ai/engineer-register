import { Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const UnderReviewScreen = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="glass-card rounded-2xl p-8 md:p-12 animate-fade-up text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Clock className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Profile Submitted Successfully!
          </h1>
          
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            Our team is reviewing your profile. You will be notified once approved.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Review typically takes 24-48 hours</span>
            </div>
          </div>

          <Button 
            disabled 
            className="w-full h-12 text-base font-medium opacity-60"
          >
            Awaiting Admin Approval
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnderReviewScreen;