import SingleDocument from "./SingleDocument";

async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  return (
    <div className="h-screen overflow-auto">
      <SingleDocument documentId={documentId} />
    </div>
  );
}
export default DocumentPage;
