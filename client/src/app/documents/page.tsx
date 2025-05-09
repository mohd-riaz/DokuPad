"use client";

import DocumentNavbar from "./document-navbar";
import TemplateGallery from "./template-gallery";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DocumentsTable from "./documents-table";
import { useSearchParams } from "@/hooks/use-search-params";

export default function Documents() {
  const [search] = useSearchParams("search");
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.getDocuments,
    { search },
    { initialNumItems: 5 }
  );
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-background">
        <DocumentNavbar />
      </div>
      <div className="mt-16">
        <TemplateGallery />
        <DocumentsTable
          documents={results}
          loadMore={loadMore}
          status={status}
        />
      </div>
    </div>
  );
}
