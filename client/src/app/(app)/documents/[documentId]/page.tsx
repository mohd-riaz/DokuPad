import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import Document from "./document";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";

const DocumentPage = async ({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) => {
  const { documentId } = await params;
  const { getToken } = await auth();
  const token = (await getToken({ template: "convex" })) ?? undefined;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getDocumentByIdClient,
    {
      documentId: documentId as Id<"documents">,
    },
    { token }
  ).catch(()=>{redirect('/documents')})
  .then((document) => {
    if(!document) {
      redirect('/documents')
    }
    console.log("Document loaded.");
    return document;
  })

  return (
    <Document
      preloadedDocument={preloadedDocument!}
      documentId={documentId}
      token={token}
    />
  );
};
export default DocumentPage;
