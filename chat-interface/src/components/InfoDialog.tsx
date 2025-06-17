import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const InfoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/80 hover:text-white hover:bg-white/20 rounded-full h-10 w-10 transition-all duration-200 p-0"
        >
          <Info className="h-7 w-7" strokeWidth={2.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[300px] sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Gebruik van AI</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            Om anoniemiteit en veiligheid te garanderen, gebruiken we AI om de
            verhalen van deze mensen te vertellen.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
