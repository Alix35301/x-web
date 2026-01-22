import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Modal = ({
  children,
  isOpen,
  title,
  description,
  submitLabel = "Submit",
  loadingLabel = "Loading",
  isLoading = false,
  onClose,
  onSubmit,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  description: string;
  submitLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onSubmit}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
