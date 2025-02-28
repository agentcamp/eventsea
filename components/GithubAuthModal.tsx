import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface GithubAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GithubAuthModal({ open, onOpenChange }: GithubAuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Login required</DialogTitle>
          <DialogDescription>
            You need to be logged in to subscribe to events.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="rounded-full bg-background p-4">
            <Image src="/github.svg" alt="GitHub" width={48} height={48} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            EventSea uses GitHub for authentication.
            <br />
            Connect your GitHub account to continue.
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={() => signIn('github', { callbackUrl: window.location.href })}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" />
            Continue with GitHub
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
