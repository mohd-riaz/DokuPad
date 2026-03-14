import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLinkIcon,
  FilePenIcon,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import RemoveDialog from "@/components/remove-dialog";
import RenameDialog from "@/components/rename-dialog";
import { useState } from "react";

interface DocumentMenuProps {
  documentId: Id<"documents">;
  title: string;
  onNewTab: (id: Id<"documents">) => void;
}

function DocumentMenu({ documentId, title, onNewTab }: DocumentMenuProps) {
  const renameState = useState(false);
  const removeState = useState(false);

  const [renameOpen, setRenameOpen] = renameState;
  const [removeOpen, setRemoveOpen] = removeState;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onNewTab(documentId);
              setDropdownOpen(false);
            }}
          >
            <ExternalLinkIcon className="size-4 mr-2" />
            Open in a new tab
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setRenameOpen(true);
              setDropdownOpen(false);
            }}
          >
            <FilePenIcon className="size-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setRemoveOpen(true);
              setDropdownOpen(false);
            }}
          >
            <TrashIcon className="size-4 mr-2 text-destructive" />
            <span className="text-destructive">Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameDialog
        documentId={documentId}
        initialTitle={title}
        state={renameState}
      />
      <RemoveDialog documentId={documentId} state={removeState} />
    </>
  );
}
export default DocumentMenu;
