"use client";

import dynamic from "next/dynamic";
const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

function SingleDocument({ documentId }: { documentId: string }) {
  return (
    <div>
      <TextEditor documentId={documentId} />
    </div>
  );
}
export default SingleDocument;
