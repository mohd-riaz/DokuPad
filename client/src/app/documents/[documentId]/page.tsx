"use client";
import { useAuth } from "@clerk/nextjs";
import Navbar from "./navbar";
import TextEditor from "./text-editor";
import Toolbar from "./toolbar";
import { useEffect, useState } from "react";

function DocumentPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { userId, getToken, isLoaded, isSignedIn } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const token = await getToken();
      const { documentId } = await params;
      setToken(token);
      setDocumentId(documentId);
    };
    fetch();
  }, [getToken, params, setDocumentId]);

  return (
    documentId &&
    token && (
      <div className="min-h-screen bg-primary-foreground overflow-auto">
        <div className="flex flex-col fixed top-0 left-0 right-0 z-10 bg-primary-foreground print:hidden">
          <Navbar />
          <Toolbar />
        </div>
        <div className="pt-[122px] print:pt-0">
          <TextEditor documentId={documentId} token={token} />
        </div>
      </div>
    )
  );
}
export default DocumentPage;
