
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallButtonProps {
  onCall: () => void;
}

const CallButton = ({ onCall }: CallButtonProps) => {
  return (
    <Button
      onClick={onCall}
      variant="ghost"
      size="icon"
      className="text-white hover:bg-white/20 transition-colors duration-200"
    >
      <Phone className="h-5 w-5" />
    </Button>
  );
};

export default CallButton;
