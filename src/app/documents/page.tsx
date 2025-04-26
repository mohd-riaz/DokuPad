"use client";

import DocumentNavbar from "./document-navbar";
import TemplateGallery from "./template-gallery";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Documents() {
  const documents = useQuery(api.documents.getDocuments);
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-background">
        <DocumentNavbar />
      </div>
      <div className="mt-16">
        <TemplateGallery />
        {documents?.map((document, i) => <span key={i}>{document.title}</span>)}
      </div>
    </div>
  );
}
