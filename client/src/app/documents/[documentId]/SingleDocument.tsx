"use client";

import dynamic from "next/dynamic";
import Navbar from "./Navbar";
const TextEditor = dynamic(
  () => import("@/app/documents/[documentId]/TextEditor"),
  {
    ssr: false,
  }
);

function SingleDocument({ documentId }: { documentId: string }) {
  return (
    <div>
      <Navbar />
      <TextEditor documentId={documentId} />
    </div>
  );
}
export default SingleDocument;
