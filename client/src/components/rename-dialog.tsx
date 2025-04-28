"use client";

import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface RenameDialogProps {
  documentId: Id<"documents">;
  initialTitle: string;
  state: [state: boolean, setState: (state: boolean) => void];
}

function RenameDialog({ documentId, initialTitle, state }: RenameDialogProps) {
  const updateDocument = useMutation(api.documents.updateById);
  const [isRenaming, setIsRenaming] = useState(false);

  const [title, setTitle] = useState(initialTitle);

  const handleRename = (id: Id<"documents">, title: string) => {
    setIsRenaming(true);
    updateDocument({ id, title })
      .catch(() => toast.error("Something went wrong"))
      .then(() => toast.success("Document renamed"))
      .finally(() => {
        setIsRenaming(false);
        state[1](false);
      });
  };

  return (
    <Dialog open={state[0]} onOpenChange={state[1]}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRename(documentId, title);
          }}
        >
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>
              Enter a new name for this document.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document name"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                state[1](false);
              }}
              type="button"
              variant="ghost"
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button
              disabled={isRenaming}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default RenameDialog;
