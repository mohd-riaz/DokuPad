"use client";

import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface RemoveDialogProps {
  documentId: Id<"documents">;
  state: [state: boolean, setState: (state: boolean) => void];
}

function RemoveDialog({ documentId, state }: RemoveDialogProps) {
  const removeDocument = useMutation(api.documents.removeById);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id: Id<"documents">) => {
    setIsDeleting(true);
    removeDocument({ id })
      .catch(() => toast.error("Something went wrong"))
      .then(() => toast.success("Document removed"))
      .finally(() => setIsDeleting(false));
  };

  return (
    <AlertDialog open={state[0]} onOpenChange={state[1]}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(documentId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default RemoveDialog;
