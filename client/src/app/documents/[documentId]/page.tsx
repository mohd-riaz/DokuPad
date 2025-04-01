"use client";

import dynamic from "next/dynamic";
const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

function DocumentPage() {
  return (
    <div>
      <TextEditor />
    </div>
  );
}
export default DocumentPage;
