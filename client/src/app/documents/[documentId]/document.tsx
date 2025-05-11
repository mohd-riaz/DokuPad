"use client";

import Navbar from "./navbar";
import TextEditor from "./text-editor";
import Toolbar from "./toolbar";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getDocumentById>;
  documentId: string;
  token: string;
}

function Document({ preloadedDocument, documentId, token }: DocumentProps) {
  const document = usePreloadedQuery(preloadedDocument);

  return (
    <div className="min-h-screen bg-primary-foreground overflow-auto">
      <div className="flex flex-col fixed top-0 left-0 right-0 z-10 bg-primary-foreground print:hidden">
        <Navbar data={document} />
        <Toolbar />
      </div>
      <div className="pt-[122px] print:pt-0">
        <TextEditor
          documentId={documentId}
          content={document.initialContent ?? new ArrayBuffer()}
          token={token}
          isCollaborative={document.organizationId !== undefined}
        />
      </div>
    </div>
  );
}
export default Document;
