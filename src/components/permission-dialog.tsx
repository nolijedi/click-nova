import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  command: string;
  onAllow: () => void;
  onDeny: () => void;
}

export function PermissionDialog({
  open,
  onOpenChange,
  title,
  description,
  command,
  onAllow,
  onDeny
}: PermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-yellow-500 animate-pulse" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Command to execute:</span>
            </div>
            <code className="text-sm font-mono bg-black/20 p-2 rounded block">
              {command}
            </code>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>This action requires elevated permissions</span>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-start">
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={onAllow}
          >
            Allow
          </Button>
          <Button
            variant="secondary"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onDeny}
          >
            Deny
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
